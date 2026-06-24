/**
 * Render the rotating 3D brandmark for AFTER EFFECTS with transparency.
 * AE does not import WebM (and its GIF support drops alpha), so this outputs:
 *   1. PNG image sequence   -> brandmark-ae/png-seq/brandmark_####.png   (most reliable)
 *   2. ProRes 4444 MOV      -> brandmark-ae/brandmark-rotating-prores4444.mov  (alpha)
 *   3. QuickTime Animation  -> brandmark-ae/brandmark-rotating-qtrle.mov       (alpha, smaller)
 *
 * Frames are screenshotted with omitBackground (true alpha) at 2x supersample
 * then downscaled with lanczos for crisp edges.
 *
 * Usage: node scripts/capture-brandmark-ae.mjs [size] [fps] [seconds]
 *   defaults: size=1200 fps=30 seconds=12
 */
import { chromium } from '@playwright/test'
import { spawnSync } from 'child_process'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'figma-export', 'brandmark-ae')
const seqDir = path.join(outDir, 'png-seq')
fs.mkdirSync(seqDir, { recursive: true })

const SIZE = parseInt(process.argv[2]) || 1200
const FPS = parseInt(process.argv[3]) || 30
const SECONDS = parseInt(process.argv[4]) || 12

const BRAND = Math.round(SIZE * 0.625)
const CUBE = Math.round(BRAND * 0.2)
const HALF = CUBE / 2
const BLUE = 'linear-gradient(180deg, #BCE5F3 0%, #D0D6FD 100%)'
const ACID = 'rgba(200, 255, 0, 0.85)'

const faces = () => `
  <div class="face" style="transform:translateZ(${HALF}px);background:${BLUE}"></div>
  <div class="face" style="transform:rotateY(180deg) translateZ(${HALF}px);background:${ACID}"></div>
  <div class="face" style="transform:rotateY(90deg) translateZ(${HALF}px);background:${BLUE}"></div>
  <div class="face" style="transform:rotateY(-90deg) translateZ(${HALF}px);background:${ACID}"></div>
  <div class="face" style="transform:rotateX(90deg) translateZ(${HALF}px);background:${ACID}"></div>
  <div class="face" style="transform:rotateX(-90deg) translateZ(${HALF}px);background:${ACID}"></div>`

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: SIZE, height: SIZE }, deviceScaleFactor: 2 })
  const totalFrames = FPS * SECONDS

  const html = `<!DOCTYPE html><html><head><style>
    *{margin:0;padding:0}
    body{width:${SIZE}px;height:${SIZE}px;display:flex;align-items:center;justify-content:center;background:transparent}
    .brandmark{width:${BRAND}px;height:${BRAND}px;perspective:${SIZE * 2.5}px}
    .inner{width:100%;height:100%;position:relative;transform-style:preserve-3d;transform:rotateX(-30deg) rotateY(var(--ry))}
    .cube{position:absolute;width:${CUBE}px;height:${CUBE}px;transform-style:preserve-3d;left:50%;top:50%;margin-left:${-HALF}px;margin-top:${-HALF}px}
    .face{position:absolute;width:${CUBE}px;height:${CUBE}px;border:${Math.max(1, CUBE * 0.01)}px solid #0F0E0E;box-sizing:border-box}
    .c1{transform:translate3d(${-HALF}px, ${-CUBE}px, ${-HALF}px)}
    .c2{transform:translate3d(${HALF}px, 0px, ${-HALF}px)}
    .c3{transform:translate3d(${-HALF}px, 0px, ${HALF}px)}
    .c4{transform:translate3d(${HALF}px, ${CUBE}px, ${HALF}px)}
  </style></head><body>
    <div class="brandmark"><div class="inner" id="inner">
      <div class="cube c1">${faces()}</div><div class="cube c2">${faces()}</div>
      <div class="cube c3">${faces()}</div><div class="cube c4">${faces()}</div>
    </div></div>
  </body></html>`

  await page.setContent(html)
  await page.waitForTimeout(300)

  console.log(`Rendering ${totalFrames} transparent frames at ${SIZE}px (2x supersample)...`)
  for (let i = 0; i < totalFrames; i++) {
    const ry = -45 + (360 * i) / totalFrames // one full rotation, loops seamlessly
    await page.evaluate((deg) => document.getElementById('inner').style.setProperty('--ry', deg + 'deg'), ry)
    await page.screenshot({
      path: path.join(seqDir, `brandmark_${String(i).padStart(4, '0')}.png`),
      type: 'png',
      omitBackground: true,
    })
    if (i % 30 === 0) console.log(`  frame ${i + 1}/${totalFrames}`)
  }
  await browser.close()
  console.log(`PNG sequence: ${seqDir}/ (${totalFrames} frames @ ${FPS}fps)`)

  const seqGlob = path.join(seqDir, 'brandmark_%04d.png')
  const scale = `scale=${SIZE}:${SIZE}:flags=lanczos`

  // ProRes 4444 with alpha (-pix_fmt yuva444p10le, profile 4 = 4444)
  const prores = path.join(outDir, 'brandmark-rotating-prores4444.mov')
  console.log('Encoding ProRes 4444 (alpha)...')
  let r = spawnSync('ffmpeg', ['-y', '-framerate', String(FPS), '-i', seqGlob, '-vf', scale,
    '-c:v', 'prores_ks', '-profile:v', '4444', '-pix_fmt', 'yuva444p10le', '-an', prores], { stdio: 'inherit' })
  if (r.status !== 0) throw new Error('prores encode failed')
  console.log(`ProRes 4444: ${prores}`)

  // QuickTime Animation (qtrle) — lossless RGBA, smaller than ProRes
  const qtrle = path.join(outDir, 'brandmark-rotating-qtrle.mov')
  console.log('Encoding QuickTime Animation / qtrle (alpha)...')
  r = spawnSync('ffmpeg', ['-y', '-framerate', String(FPS), '-i', seqGlob, '-vf', scale,
    '-c:v', 'qtrle', '-pix_fmt', 'argb', '-an', qtrle], { stdio: 'inherit' })
  if (r.status !== 0) throw new Error('qtrle encode failed')
  console.log(`QuickTime Animation: ${qtrle}`)

  console.log('Done.')
}

main().catch((e) => { console.error(e); process.exit(1) })
