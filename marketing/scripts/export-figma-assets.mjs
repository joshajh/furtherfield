/**
 * Export brand/visual elements as clean, Figma-ready files.
 *
 * Outputs to ../figma-export/ organized into subfolders:
 *   brandmark/  - 3D rotating brandmark stills (PNG) + source SVG + GIF/WebM
 *   tidal-grid/ - recolorable SVG + high-res transparent PNG stills + GIF
 *   sprites/    - upscaled pixel-art sprites (PNG, nearest-neighbour)
 *   lichen/     - lichen tiles + borders (PNG)
 *   logos/      - logo marks
 *
 * Usage: node scripts/export-figma-assets.mjs
 */
import { chromium } from '@playwright/test'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const pub = path.join(root, 'public')
const out = path.join(root, 'figma-export')

function ensure(dir) {
  fs.mkdirSync(dir, { recursive: true })
  return dir
}
function copyIfExists(src, dest) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest)
    return true
  }
  return false
}

// ---- Brand constants (mirrors components/Brandmark3D.tsx) ----
const BLUE_GRADIENT = 'linear-gradient(180deg, #BCE5F3 0%, #D0D6FD 100%)'
const ACID = 'rgba(200, 255, 0, 0.85)'
const STROKE = '#0F0E0E'

// =====================================================================
// 1. 3D BRANDMARK — render the live CSS cube at high res, multiple angles
// =====================================================================
async function exportBrandmark(browser) {
  const dir = ensure(path.join(out, 'brandmark'))
  const RENDER = 1600 // px canvas for crisp output
  const cube = RENDER / 5 // cube edge in px
  const half = cube / 2

  const cubeFaces = (transform) => `
    <div class="cube" style="transform:${transform}">
      <div class="face" style="transform:translateZ(${half}px);background:${BLUE_GRADIENT}"></div>
      <div class="face" style="transform:rotateY(180deg) translateZ(${half}px);background:${ACID}"></div>
      <div class="face" style="transform:rotateY(90deg) translateZ(${half}px);background:${BLUE_GRADIENT}"></div>
      <div class="face" style="transform:rotateY(-90deg) translateZ(${half}px);background:${ACID}"></div>
      <div class="face" style="transform:rotateX(90deg) translateZ(${half}px);background:${BLUE_GRADIENT}"></div>
      <div class="face" style="transform:rotateX(-90deg) translateZ(${half}px);background:${ACID}"></div>
    </div>`

  // The four stacked cubes, matching the component's translate3d offsets
  const cluster = `
    ${cubeFaces(`translate3d(${-half}px, ${-cube}px, ${-half}px)`)}
    ${cubeFaces(`translate3d(${half}px, 0px, ${-half}px)`)}
    ${cubeFaces(`translate3d(${-half}px, 0px, ${half}px)`)}
    ${cubeFaces(`translate3d(${half}px, ${cube}px, ${half}px)`)}`

  const page = await browser.newPage({ viewport: { width: RENDER, height: RENDER }, deviceScaleFactor: 1 })

  // Render one PNG per Y-rotation angle (the spin axis)
  const angles = [0, 45, 90, 135, 180, 225, 270, 315]
  for (const ay of angles) {
    const html = `<!DOCTYPE html><html><head><style>
      *{margin:0;padding:0;box-sizing:border-box}
      html,body{width:${RENDER}px;height:${RENDER}px;background:transparent;overflow:hidden}
      .stage{width:${RENDER}px;height:${RENDER}px;display:flex;align-items:center;justify-content:center;perspective:${RENDER * 2}px}
      .group{position:relative;width:${cube}px;height:${cube}px;transform-style:preserve-3d;
             transform:rotateX(-30deg) rotateY(${-45 - ay}deg)}
      .cube{position:absolute;width:${cube}px;height:${cube}px;transform-style:preserve-3d;left:50%;top:50%;margin-left:${-half}px;margin-top:${-half}px}
      .face{position:absolute;width:${cube}px;height:${cube}px;border:${Math.max(1, cube * 0.004)}px solid ${STROKE};box-sizing:border-box}
    </style></head><body><div class="stage"><div class="group">${cluster}</div></div></body></html>`
    await page.setContent(html)
    await page.waitForTimeout(150)
    const buf = await page.screenshot({ type: 'png', omitBackground: true })
    // Trim transparent edges, then pad to a clean square so it centers in Figma
    const trimmed = await sharp(buf).trim({ threshold: 5 }).toBuffer()
    const meta = await sharp(trimmed).metadata()
    const sq = Math.max(meta.width, meta.height)
    await sharp(trimmed)
      .extend({
        top: Math.round((sq - meta.height) / 2),
        bottom: Math.ceil((sq - meta.height) / 2),
        left: Math.round((sq - meta.width) / 2),
        right: Math.ceil((sq - meta.width) / 2),
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toFile(path.join(dir, `brandmark-3d-${String(ay).padStart(3, '0')}.png`))
    console.log(`  brandmark angle ${ay}°`)
  }
  await page.close()

  copyIfExists(path.join(pub, 'brandmark.svg'), path.join(dir, 'brandmark.svg'))
  copyIfExists(path.join(pub, 'brandmark-rotating.gif'), path.join(dir, 'brandmark-rotating.gif'))
  copyIfExists(path.join(pub, 'brandmark-rotating.webm'), path.join(dir, 'brandmark-rotating.webm'))
  copyIfExists(path.join(pub, 'brandmark-acid-top.png'), path.join(dir, 'brandmark-acid-top.png'))
}

// =====================================================================
// 2. TIDAL GRID — recolorable SVG + high-res transparent PNG stills
// =====================================================================
function buildGridSvg({ gridSize = 16, amplitude = 6, frequency = 2.5, stroke = '#9A8B55', strokeWidth = 0.8, phase = 0 }) {
  const VB = 100
  const cell = VB / gridSize
  const segments = 35
  const wavy = (x1, y1, x2, y2, dir, lineIndex) => {
    let d = `M ${x1.toFixed(2)} ${y1.toFixed(2)}`
    for (let i = 1; i <= segments; i++) {
      const t = i / segments
      const wave = Math.sin(t * Math.PI * 2 * frequency + phase + lineIndex * 0.3) * amplitude
      let x, y
      if (dir === 'h') { x = x1 + (x2 - x1) * t; y = y1 + wave }
      else { x = x1 + wave; y = y1 + (y2 - y1) * t }
      d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`
    }
    return d
  }
  let paths = ''
  for (let i = 0; i <= gridSize; i++) {
    const y = i * cell
    paths += `<path d="${wavy(0, y, VB, y, 'h', i)}" fill="none"/>`
  }
  for (let i = 0; i <= gridSize; i++) {
    const x = i * cell
    paths += `<path d="${wavy(x, 0, x, VB, 'v', i)}" fill="none"/>`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VB} ${VB}" width="${VB}" height="${VB}">
  <g stroke="${stroke}" stroke-width="${strokeWidth}" vector-effect="non-scaling-stroke">${paths}</g>
</svg>`
}

async function exportTidalGrid() {
  const dir = ensure(path.join(out, 'tidal-grid'))
  // Three colourways so you can pick what works on the post background
  const variants = [
    { name: 'muted', stroke: '#9A8B55' }, // site default
    { name: 'acid', stroke: '#C8FF00' },
    { name: 'ink', stroke: '#0F0E0E' },
    { name: 'light', stroke: '#F6F8FB' },
  ]
  for (const v of variants) {
    // a couple of phases give you different "moments" of the wave
    for (const [label, phase] of [['a', 0], ['b', 1.6]]) {
      const svg = buildGridSvg({ stroke: v.stroke, phase })
      const svgPath = path.join(dir, `tidal-grid-${v.name}-${label}.svg`)
      fs.writeFileSync(svgPath, svg)
      // High-res transparent PNG (3000px) rendered from the same SVG
      await sharp(Buffer.from(svg), { density: 900 })
        .resize(3000, 3000, { fit: 'fill' })
        .png()
        .toFile(path.join(dir, `tidal-grid-${v.name}-${label}.png`))
      console.log(`  tidal grid ${v.name}-${label}`)
    }
  }
  copyIfExists(path.join(pub, 'tidal-grid.gif'), path.join(dir, 'tidal-grid-animated.gif'))
}

// =====================================================================
// 3. SPRITES — upscale pixel art with nearest-neighbour (stays crisp)
// =====================================================================
async function exportSprites() {
  const dir = ensure(path.join(out, 'sprites'))
  const src = path.join(pub, 'sprites')
  if (!fs.existsSync(src)) return
  for (const f of fs.readdirSync(src).filter((f) => f.endsWith('.png'))) {
    const img = sharp(path.join(src, f))
    const meta = await img.metadata()
    const scale = 12 // pixel art -> big crisp blocks
    await img
      .resize(meta.width * scale, meta.height * scale, { kernel: 'nearest' })
      .png()
      .toFile(path.join(dir, f.replace('.png', `@${scale}x.png`)))
    // also keep the original
    fs.copyFileSync(path.join(src, f), path.join(dir, f))
    console.log(`  sprite ${f}`)
  }
}

// =====================================================================
// 4. LICHEN — copy tiles + borders straight through (already high-res)
// =====================================================================
function exportLichen() {
  const dir = ensure(path.join(out, 'lichen'))
  const src = path.join(pub, 'lichen')
  if (!fs.existsSync(src)) return
  for (const f of fs.readdirSync(src).filter((f) => f.endsWith('.png'))) {
    fs.copyFileSync(path.join(src, f), path.join(dir, f))
    console.log(`  lichen ${f}`)
  }
  const borders = path.join(src, 'borders')
  if (fs.existsSync(borders)) {
    const bdir = ensure(path.join(dir, 'borders'))
    for (const f of fs.readdirSync(borders).filter((f) => f.endsWith('.png'))) {
      fs.copyFileSync(path.join(borders, f), path.join(bdir, f))
      console.log(`  lichen border ${f}`)
    }
  }
}

// =====================================================================
// 5. GRADIENT SWATCHES — one PNG tile per gradient + a contact sheet
// =====================================================================
const GRADIENTS = [
  { name: 'brand', label: 'Brand', css: 'linear-gradient(to bottom, #BCE5F3, #D0D6FD)' },
  { name: 'A1-sky-lavender', label: 'Sky → Lavender', css: 'linear-gradient(135deg, #BCE5F3 0%, #D0D6FD 50%, #E8E0F0 100%)' },
  { name: 'A2-mauve-horizon', label: 'Mauve Horizon', css: 'linear-gradient(135deg, #D0D6FD 0%, #BEA6B0 50%, #FFFCB9 100%)' },
  { name: 'A3-lemon-cream', label: 'Lemon Cream', css: 'linear-gradient(135deg, #F5EBB4 0%, #E8DCA0 50%, #DCC8DC 100%)' },
  { name: 'B1-acid-mint', label: 'Acid → Mint', css: 'linear-gradient(135deg, #C8FF00 0%, #B4FF66 50%, #A0FFAA 100%)' },
  { name: 'B2-lemon-acid', label: 'Lemon → Acid', css: 'linear-gradient(135deg, #FFFCB9 0%, #E6FF66 50%, #C8FF00 100%)' },
  { name: 'B3-acid-sky', label: 'Acid → Sky', css: 'linear-gradient(135deg, #C8FF00 0%, #88FFCC 50%, #BCE5F3 100%)' },
  { name: 'C1-driftwood', label: 'Driftwood', css: 'linear-gradient(135deg, #D2B48C 0%, #B49664 50%, #8B7355 100%)' },
  { name: 'C2-sea-mist', label: 'Sea Mist', css: 'linear-gradient(135deg, #8CA0B4 0%, #A0B0C0 50%, #C0D0E0 100%)' },
  { name: 'C3-lichen-stone', label: 'Lichen Stone', css: 'linear-gradient(135deg, #DCC8D2 0%, #C8B8C0 50%, #B0A0A8 100%)' },
  { name: 'D1-cyan-flash', label: 'Cyan Flash', css: 'linear-gradient(135deg, #00FFFF 0%, #00D4FF 50%, #00A8FF 100%)' },
  { name: 'D2-cyan-acid', label: 'Cyan → Acid', css: 'linear-gradient(135deg, #00FFFF 0%, #66FF99 50%, #C8FF00 100%)' },
  { name: 'D3-electric-twilight', label: 'Electric Twilight', css: 'linear-gradient(135deg, #00D4FF 0%, #7C6EE6 50%, #D0D6FD 100%)' },
  { name: 'E1-hot-pink', label: 'Hot Pink Burst', css: 'linear-gradient(135deg, #FF00FF 0%, #FF66B2 50%, #FF99CC 100%)' },
  { name: 'E2-magenta-acid', label: 'Magenta → Acid', css: 'linear-gradient(135deg, #FF00FF 0%, #FF66FF 50%, #C8FF00 100%)' },
  { name: 'E3-sunset-neon', label: 'Sunset Neon', css: 'linear-gradient(135deg, #FF6B6B 0%, #FF00FF 50%, #A855F7 100%)' },
  { name: 'F1-solarpunk', label: 'Full Solarpunk', css: 'linear-gradient(135deg, #C8FF00 0%, #00FFA3 40%, #00D4FF 70%, #A855F7 100%)' },
  { name: 'F2-green-purple', label: 'Green → Purple', css: 'linear-gradient(135deg, #00FFA3 0%, #00D4FF 50%, #A855F7 100%)' },
  { name: 'F3-acid-purple', label: 'Acid → Purple', css: 'linear-gradient(135deg, #C8FF00 0%, #7C6EE6 50%, #A855F7 100%)' },
]

const FONT_LINK = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Geist+Mono:wght@400;500&family=Rubik:wght@400;500;600;700&display=swap" rel="stylesheet">`

async function exportSwatches(browser) {
  const dir = ensure(path.join(out, 'swatches'))
  const TILE = 1000
  const page = await browser.newPage({ viewport: { width: TILE, height: TILE }, deviceScaleFactor: 1 })
  for (const g of GRADIENTS) {
    const html = `<!DOCTYPE html><html><head>${FONT_LINK}<style>
      *{margin:0;padding:0;box-sizing:border-box}
      html,body{width:${TILE}px;height:${TILE}px}
      .tile{width:${TILE}px;height:${TILE}px;background:${g.css};position:relative;
            font-family:'Geist Mono',monospace;color:#0F0E0E}
      .meta{position:absolute;left:48px;bottom:40px;font-size:30px;letter-spacing:0.02em}
      .meta b{display:block;font-size:38px;margin-bottom:6px;font-weight:500}
      .meta span{opacity:0.65}
    </style></head><body><div class="tile">
      <div class="meta"><b>${g.label}</b><span>${g.name}</span></div>
    </div></body></html>`
    await page.setContent(html)
    await page.waitForTimeout(120)
    const buf = await page.screenshot({ type: 'png' })
    await sharp(buf).png().toFile(path.join(dir, `swatch-${g.name}.png`))
    console.log(`  swatch ${g.name}`)
  }
  await page.close()
}

// =====================================================================
// 6. TYPE SPECIMEN — display / body / mono on light + dark, 1080-square
// =====================================================================
async function exportTypeSpecimen(browser) {
  const dir = ensure(path.join(out, 'type-specimen'))
  const SIZE = 2160 // 2x of 1080 social square
  const page = await browser.newPage({ viewport: { width: SIZE, height: SIZE }, deviceScaleFactor: 1 })

  const themes = [
    { name: 'dark', bg: '#0F0E0E', fg: '#F6F8FB', accent: '#C8FF00' },
    { name: 'light', bg: '#F6F8FB', fg: '#0F0E0E', accent: '#0F0E0E' },
  ]
  for (const t of themes) {
    const html = `<!DOCTYPE html><html><head>${FONT_LINK}<style>
      *{margin:0;padding:0;box-sizing:border-box}
      html,body{width:${SIZE}px;height:${SIZE}px}
      .page{width:${SIZE}px;height:${SIZE}px;background:${t.bg};color:${t.fg};
            padding:160px 150px;display:flex;flex-direction:column;justify-content:space-between}
      .kicker{font-family:'Geist Mono',monospace;text-transform:uppercase;letter-spacing:0.06em;
              font-size:34px;color:${t.accent};margin-bottom:40px}
      .display{font-family:'Rubik',sans-serif;font-weight:600;font-size:300px;line-height:0.92;
               letter-spacing:-0.02em}
      .display .acid{color:${t.accent}}
      .alpha{font-family:'Rubik',sans-serif;font-weight:500;font-size:120px;line-height:1.05;
             opacity:0.9;margin-top:30px}
      .body{font-family:'Plus Jakarta Sans',sans-serif;font-size:58px;line-height:1.4;
            max-width:1500px;font-weight:400}
      .mono{font-family:'Geist Mono',monospace;font-size:40px;letter-spacing:0.02em;opacity:0.75;
            display:flex;gap:50px;flex-wrap:wrap}
      .mono span{border:1px solid ${t.fg};padding:14px 26px;opacity:0.85}
      .label{font-family:'Geist Mono',monospace;font-size:30px;opacity:0.5;text-transform:uppercase;
             letter-spacing:0.08em;margin-bottom:18px}
    </style></head><body><div class="page">
      <div>
        <div class="kicker">Furtherfield · Type System</div>
        <div class="display">Coastal<br>Futures<span class="acid">.</span></div>
        <div class="alpha">AaBbCcDd 0123456789</div>
      </div>
      <div>
        <div class="label">Display — Rubik</div>
        <div class="body">A maritime / coastal aesthetic for community, ecology and computation. Body text set in Plus Jakarta Sans.</div>
      </div>
      <div>
        <div class="label">Mono — Geist Mono</div>
        <div class="mono"><span>EXHIBITION</span><span>WORKSHOP</span><span>PERFORMANCE</span><span>#C8FF00</span></div>
      </div>
    </div></body></html>`
    await page.setContent(html)
    await page.waitForTimeout(400) // let webfonts settle
    const buf = await page.screenshot({ type: 'png' })
    await sharp(buf).png().toFile(path.join(dir, `type-specimen-${t.name}.png`))
    console.log(`  type specimen ${t.name}`)
  }
  await page.close()
}

// =====================================================================
// 7. MAIN-PAGE BACKGROUND — brand gradient + fractal noise overlay
//    Replicates .bg-gradient-brand from app/globals.css exactly:
//    linear-gradient(to bottom, #BCE5F3, #D0D6FD) + feTurbulence noise
//    at opacity 0.6, mix-blend-mode overlay.
// =====================================================================
async function exportBackground(browser) {
  const dir = ensure(path.join(out, 'backgrounds'))
  const GRADIENT = 'linear-gradient(to bottom, #BCE5F3, #D0D6FD)'
  const NOISE_URL = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")"

  // Instagram-native sizes
  const sizes = [
    { name: 'square-1080', w: 1080, h: 1080 },
    { name: 'portrait-1080x1350', w: 1080, h: 1350 },
    { name: 'story-1080x1920', w: 1080, h: 1920 },
  ]
  for (const s of sizes) {
    const page = await browser.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 2 })
    const html = `<!DOCTYPE html><html><head><style>
      *{margin:0;padding:0;box-sizing:border-box}
      html,body{width:${s.w}px;height:${s.h}px}
      .bg{width:${s.w}px;height:${s.h}px;background:${GRADIENT};position:relative;isolation:isolate}
      .bg::before{content:"";position:absolute;inset:0;background-image:${NOISE_URL};
                  opacity:0.6;mix-blend-mode:overlay;pointer-events:none}
    </style></head><body><div class="bg"></div></body></html>`
    await page.setContent(html)
    await page.waitForTimeout(150)
    const buf = await page.screenshot({ type: 'png' })
    await sharp(buf).png().toFile(path.join(dir, `bg-gradient-noise-${s.name}.png`))
    console.log(`  background ${s.name} (@2x)`)
    await page.close()
  }
}

// =====================================================================
// 8. LOGOS
// =====================================================================
function exportLogos() {
  const dir = ensure(path.join(out, 'logos'))
  copyIfExists(path.join(pub, 'logo-white.png'), path.join(dir, 'logo-white.png'))
  copyIfExists(path.join(pub, 'f-mark-white-trans.png'), path.join(dir, 'f-mark-white-trans.png'))
}

async function main() {
  ensure(out)
  console.log('Exporting Figma-ready assets to figma-export/ ...')
  const browser = await chromium.launch()
  console.log('• 3D brandmark stills'); await exportBrandmark(browser)
  console.log('• tidal grid SVG + PNG'); await exportTidalGrid()
  console.log('• sprites'); await exportSprites()
  console.log('• lichen'); exportLichen()
  console.log('• gradient swatches'); await exportSwatches(browser)
  console.log('• type specimen'); await exportTypeSpecimen(browser)
  console.log('• backgrounds'); await exportBackground(browser)
  console.log('• logos'); exportLogos()
  await browser.close()
  console.log('\nDone. See marketing/figma-export/')
}

main().catch((e) => { console.error(e); process.exit(1) })
