/**
 * Render the rotating 3D brandmark as a SHARP, TRANSPARENT WebM (+ optional GIF).
 *
 * Why a dedicated script: Playwright's recordVideo bakes an opaque background
 * (yuv420p, no alpha) and is fixed-size — that's why the old webm showed black.
 * Here we screenshot transparent PNG frames (omitBackground) at high res, then
 * encode them with ffmpeg to VP9 + alpha (yuva420p) so the background is truly
 * transparent.
 *
 * Output: ../figma-export/brandmark/brandmark-rotating-hd.webm
 *         ../figma-export/brandmark/brandmark-rotating-hd.gif   (if --gif)
 *
 * Usage: node scripts/capture-brandmark-webm.mjs [size] [fps] [seconds]
 *   defaults: size=1200 fps=30 seconds=12     append "gif" to also write a GIF
 */
import { chromium } from '@playwright/test'
import { spawnSync } from 'child_process'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'figma-export', 'brandmark')
fs.mkdirSync(outDir, { recursive: true })

const SIZE = parseInt(process.argv[2]) || 1200
const FPS = parseInt(process.argv[3]) || 30
const SECONDS = parseInt(process.argv[4]) || 12
const ALSO_GIF = process.argv.includes('gif')

// brandmark geometry scales with SIZE (original was 250 brandmark in a 400 stage)
const BRAND = Math.round(SIZE * 0.625)
const CUBE = Math.round(BRAND * 0.2) // 50 of 250
const HALF = CUBE / 2

const BLUE = 'linear-gradient(180deg, #BCE5F3 0%, #D0D6FD 100%)'
const ACID = 'rgba(200, 255, 0, 0.85)'

function faces() {
  return `
    <div class="face" style="transform:translateZ(${HALF}px);background:${BLUE}"></div>
    <div class="face" style="transform:rotateY(180deg) translateZ(${HALF}px);background:${ACID}"></div>
    <div class="face" style="transform:rotateY(90deg) translateZ(${HALF}px);background:${BLUE}"></div>
    <div class="face" style="transform:rotateY(-90deg) translateZ(${HALF}px);background:${ACID}"></div>
    <div class="face" style="transform:rotateX(90deg) translateZ(${HALF}px);background:${ACID}"></div>
    <div class="face" style="transform:rotateX(-90deg) translateZ(${HALF}px);background:${ACID}"></div>`
}

async function main() {
  const framesDir = fs.mkdtempSync(path.join(outDir, 'frames-'))
  const browser = await chromium.launch()
  // deviceScaleFactor 2 => supersample, then ffmpeg downscales for crisp edges
  const page = await browser.newPage({ viewport: { width: SIZE, height: SIZE }, deviceScaleFactor: 2 })

  const totalFrames = FPS * SECONDS

  const html = `<!DOCTYPE html><html><head><style>
    *{margin:0;padding:0}
    body{width:${SIZE}px;height:${SIZE}px;display:flex;align-items:center;justify-content:center;background:transparent}
    .brandmark{width:${BRAND}px;height:${BRAND}px;perspective:${SIZE * 2.5}px}
    .inner{width:100%;height:100%;position:relative;transform-style:preserve-3d;
           transform:rotateX(-30deg) rotateY(var(--ry))}
    .cube{position:absolute;width:${CUBE}px;height:${CUBE}px;transform-style:preserve-3d;
          left:50%;top:50%;margin-left:${-HALF}px;margin-top:${-HALF}px}
    .face{position:absolute;width:${CUBE}px;height:${CUBE}px;border:${Math.max(1, CUBE * 0.01)}px solid #0F0E0E;box-sizing:border-box}
    .c1{transform:translate3d(${-HALF}px, ${-CUBE}px, ${-HALF}px)}
    .c2{transform:translate3d(${HALF}px, 0px, ${-HALF}px)}
    .c3{transform:translate3d(${-HALF}px, 0px, ${HALF}px)}
    .c4{transform:translate3d(${HALF}px, ${CUBE}px, ${HALF}px)}
  </style></head><body>
    <div class="brandmark"><div class="inner" id="inner">
      <div class="cube c1">${faces()}</div>
      <div class="cube c2">${faces()}</div>
      <div class="cube c3">${faces()}</div>
      <div class="cube c4">${faces()}</div>
    </div></div>
  </body></html>`

  await page.setContent(html)
  await page.waitForTimeout(300)

  console.log(`Rendering ${totalFrames} transparent frames at ${SIZE}px (2x)...`)
  for (let i = 0; i < totalFrames; i++) {
    // one full 360° rotation across the clip
    const ry = -45 + (360 * i) / totalFrames
    await page.evaluate((deg) => {
      document.getElementById('inner').style.setProperty('--ry', deg + 'deg')
    }, ry)
    await page.screenshot({
      path: path.join(framesDir, `f${String(i).padStart(4, '0')}.png`),
      type: 'png',
      omitBackground: true, // <-- real transparency
    })
    if (i % 30 === 0) console.log(`  frame ${i + 1}/${totalFrames}`)
  }
  await browser.close()

  // Encode VP9 WebM with alpha (yuva420p), downscale 2x supersample -> SIZE
  const webmPath = path.join(outDir, 'brandmark-rotating-hd.webm')
  console.log('Encoding transparent VP9 WebM...')
  const ff = spawnSync('ffmpeg', [
    '-y',
    '-framerate', String(FPS),
    '-i', path.join(framesDir, 'f%04d.png'),
    '-vf', `scale=${SIZE}:${SIZE}:flags=lanczos`,
    '-c:v', 'libvpx-vp9',
    '-pix_fmt', 'yuva420p',   // alpha-enabled
    '-b:v', '0', '-crf', '24',
    '-an',
    webmPath,
  ], { stdio: 'inherit' })
  if (ff.status !== 0) throw new Error('ffmpeg webm encode failed')
  console.log(`WebM: ${webmPath}`)

  if (ALSO_GIF) {
    const gifPath = path.join(outDir, 'brandmark-rotating-hd.gif')
    console.log('Encoding transparent GIF (palette)...')
    const palette = path.join(framesDir, 'palette.png')
    spawnSync('ffmpeg', ['-y', '-i', path.join(framesDir, 'f%04d.png'),
      '-vf', `fps=${FPS},scale=${SIZE}:${SIZE}:flags=lanczos,palettegen=reserve_transparent=1`, palette], { stdio: 'inherit' })
    const g = spawnSync('ffmpeg', ['-y', '-framerate', String(FPS), '-i', path.join(framesDir, 'f%04d.png'), '-i', palette,
      '-lavfi', `fps=${FPS},scale=${SIZE}:${SIZE}:flags=lanczos[x];[x][1:v]paletteuse=alpha_threshold=128`,
      '-gifflags', '-offsetting', gifPath], { stdio: 'inherit' })
    if (g.status === 0) console.log(`GIF: ${gifPath}`)
  }

  // cleanup frames
  fs.rmSync(framesDir, { recursive: true, force: true })
  console.log('Done.')
}

main().catch((e) => { console.error(e); process.exit(1) })
