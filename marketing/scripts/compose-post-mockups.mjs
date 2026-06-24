/**
 * Composite 1080x1080 Instagram post mockups from the exported brand assets.
 * Each mockup is laid out as an HTML page (real fonts, blend modes, transforms)
 * and screenshotted at 1080x1080 @2x via Playwright.
 *
 * Outputs to ../figma-export/post-mockups/
 *
 * Usage: node scripts/compose-post-mockups.mjs
 */
import { chromium } from '@playwright/test'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const exportDir = path.join(__dirname, '..', 'figma-export')
const out = path.join(exportDir, 'post-mockups')
fs.mkdirSync(out, { recursive: true })

// inline an asset inside figma-export/ as a base64 data URI so it loads
// reliably on a setContent() page (file:// resources are blocked there)
const A = (rel) => {
  const buf = fs.readFileSync(path.join(exportDir, rel))
  const ext = path.extname(rel).slice(1).toLowerCase()
  const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext === 'jpg' ? 'jpeg' : ext}`
  return `data:${mime};base64,${buf.toString('base64')}`
}

const SIZE = 1080

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Geist+Mono:wght@400;500&family=Rubik:wght@400;500;600;700&display=swap" rel="stylesheet">`

const BASE_CSS = `
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${SIZE}px;height:${SIZE}px;overflow:hidden}
  .canvas{width:${SIZE}px;height:${SIZE}px;position:relative;overflow:hidden;
          font-family:'Plus Jakarta Sans',sans-serif}
  .fill{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  .mono{font-family:'Geist Mono',monospace;letter-spacing:0.04em;text-transform:uppercase}
  .display{font-family:'Rubik',sans-serif;font-weight:600;letter-spacing:-0.02em;line-height:0.92}
  .acid{color:#C8FF00}
  .kicker{font-family:'Geist Mono',monospace;text-transform:uppercase;letter-spacing:0.1em;font-size:20px}
`

// ---------------------------------------------------------------------
// Mockup definitions — each returns inner HTML for .canvas
// ---------------------------------------------------------------------
const MOCKUPS = {
  // 1. Brandmark hero on the brand gradient
  'brandmark-hero': `
    <img class="fill" src="${A('backgrounds/bg-gradient-noise-square-1080.png')}">
    <img src="${A('brandmark/brandmark-3d-045.png')}"
         style="position:absolute;top:90px;left:50%;transform:translateX(-50%);width:660px;
                filter:drop-shadow(0 30px 40px rgba(15,14,14,0.18))">
    <div style="position:absolute;left:80px;bottom:96px;right:80px;color:#0F0E0E">
      <div class="kicker" style="margin-bottom:16px">Furtherfield · Studio</div>
      <div class="display" style="font-size:104px">Coastal<br>Futures<span class="acid">.</span></div>
    </div>`,

  // 2. The tidal grid generator — "we built this"
  'grid-generator': `
    <div class="fill" style="background:#0F0E0E"></div>
    <img src="${A('tidal-grid/tidal-grid-acid-a.png')}"
         style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.28">
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(15,14,14,0.85) 0%,rgba(15,14,14,0.1) 40%,rgba(15,14,14,0.2) 70%,rgba(15,14,14,0.92) 100%)"></div>
    <div style="position:absolute;top:84px;left:84px;right:84px;color:#F6F8FB">
      <div class="kicker acid" style="margin-bottom:18px">Tool · Grid Generator</div>
      <div class="display" style="font-size:88px;color:#F6F8FB">Grids from<br>live tidal data</div>
    </div>
    <img src="${A('grid-generator-ui/data-source-card.png')}"
         style="position:absolute;bottom:96px;left:84px;width:440px;border-radius:10px;
                box-shadow:0 24px 50px rgba(0,0,0,0.6)">
    <div class="mono" style="position:absolute;bottom:130px;right:84px;width:340px;text-align:right;
                color:#F6F8FB;font-size:19px;line-height:1.7">
      Harwich tide gauge → wave amplitude. Built in our Crafting Table toolkit.
    </div>`,

  // 3. Ecology / sprites with lichen
  'ecology-sprites': `
    <img class="fill" src="${A('backgrounds/bg-gradient-noise-square-1080.png')}">
    <img src="${A('lichen/borders/border-bottom.png')}"
         style="position:absolute;left:0;right:0;bottom:-20px;width:100%;
                mix-blend-mode:multiply;opacity:0.85">
    <img src="${A('sprites/goose@12x.png')}" style="position:absolute;top:430px;right:150px;width:210px;image-rendering:pixelated;transform:scaleX(-1)">
    <img src="${A('sprites/squirel@12x.png')}" style="position:absolute;top:560px;left:130px;width:150px;image-rendering:pixelated">
    <img src="${A('sprites/beetle@12x.png')}" style="position:absolute;top:470px;left:380px;width:120px;image-rendering:pixelated">
    <img src="${A('sprites/bee@12x.png')}" style="position:absolute;top:600px;right:330px;width:120px;image-rendering:pixelated">
    <div style="position:absolute;top:96px;left:84px;right:84px;color:#0F0E0E">
      <div class="kicker" style="margin-bottom:14px">Living Interface</div>
      <div class="display" style="font-size:96px">More than<br>human web<span class="acid">.</span></div>
    </div>`,

  // 4. Visual identity — swatches + type
  'visual-identity': `
    <div class="fill" style="background:#0F0E0E"></div>
    <div style="position:absolute;top:0;left:0;right:0;height:300px;display:flex">
      <div style="flex:1;background:linear-gradient(135deg,#C8FF00,#B4FF66,#A0FFAA)"></div>
      <div style="flex:1;background:linear-gradient(135deg,#BCE5F3,#D0D6FD,#E8E0F0)"></div>
      <div style="flex:1;background:linear-gradient(135deg,#00FFFF,#66FF99,#C8FF00)"></div>
      <div style="flex:1;background:linear-gradient(135deg,#FF00FF,#FF66FF,#C8FF00)"></div>
      <div style="flex:1;background:linear-gradient(135deg,#C8FF00,#00FFA3,#00D4FF,#A855F7)"></div>
    </div>
    <div style="position:absolute;top:380px;left:84px;right:84px;color:#F6F8FB">
      <div class="kicker acid" style="margin-bottom:20px">Visual Identity</div>
      <div class="display" style="font-size:128px;color:#F6F8FB">Aa<span class="acid">Bb</span>Cc</div>
      <div class="mono" style="margin-top:28px;font-size:22px;color:#9ca3af;line-height:1.7">
        Rubik · Plus Jakarta Sans · Geist Mono<br>
        18 gradients · acid #C8FF00 · solarpunk coast
      </div>
    </div>
    <img src="${A('logos/logo-white.png')}" style="position:absolute;bottom:84px;left:84px;width:280px">`,
}

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: SIZE, height: SIZE }, deviceScaleFactor: 2 })

  for (const [name, inner] of Object.entries(MOCKUPS)) {
    const html = `<!DOCTYPE html><html><head>${FONTS}<style>${BASE_CSS}</style></head>
      <body><div class="canvas">${inner}</div></body></html>`
    await page.setContent(html, { waitUntil: 'networkidle' })
    await page.waitForTimeout(500) // fonts + images settle
    const buf = await page.screenshot({ type: 'png' })
    await sharp(buf).png().toFile(path.join(out, `post-${name}.png`))
    console.log(`  post-${name}.png`)
  }

  await browser.close()
  console.log('\nDone. See marketing/figma-export/post-mockups/')
}

main().catch((e) => { console.error(e); process.exit(1) })
