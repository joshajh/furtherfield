/**
 * Capture the crafting-table Grid Generator UI for social posts.
 * Drives the live dev server with Playwright and screenshots the whole
 * interface + individual panels, so you can show "I built a generator
 * for dynamic grids from tidal data".
 *
 * Requires the crafting-table dev server running (default http://localhost:3055/grid-generator).
 *
 * Outputs to ../figma-export/grid-generator-ui/
 *   full-ui-<theme>.png        - whole page (controls + preview)
 *   controls-panel.png         - left control stack (data source, sliders, export)
 *   data-source-card.png       - just the live-tidal-data card
 *   preview-grid.png           - the generated grid in its dark preview panel
 *
 * Usage: node scripts/export-grid-generator-ui.mjs [url]
 */
import { chromium } from '@playwright/test'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const out = path.join(__dirname, '..', 'figma-export', 'grid-generator-ui')
fs.mkdirSync(out, { recursive: true })

const URL = process.argv[2] || 'http://localhost:3055/grid-generator'
const SCALE = 2 // retina-crisp screenshots

async function shotElement(page, selector, file, { pad = 0 } = {}) {
  const el = page.locator(selector).first()
  await el.waitFor({ state: 'visible', timeout: 15000 })
  const buf = await el.screenshot({ type: 'png' })
  if (pad) {
    const m = await sharp(buf).metadata()
    await sharp(buf)
      .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 15, g: 14, b: 14, alpha: 1 } })
      .png().toFile(path.join(out, file))
  } else {
    await sharp(buf).png().toFile(path.join(out, file))
  }
  console.log(`  ${file}`)
}

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({
    viewport: { width: 1500, height: 1100 },
    deviceScaleFactor: SCALE,
  })

  console.log(`Loading ${URL} ...`)
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 })

  // The grid SVG is the 800x800 one (svgRef); other <svg>s are dropdown/slider icons.
  const GRID_SVG = 'main svg[width="800"]'
  // Wait for the grid to actually render (paths appended to the SVG after data fetch)
  await page.waitForFunction((sel) => {
    const svg = document.querySelector(sel)
    return svg && svg.querySelectorAll('path').length > 10
  }, GRID_SVG, { timeout: 20000 }).catch(() => console.log('  (grid render wait timed out — capturing anyway)'))
  await page.waitForTimeout(800)

  // Report which data source actually loaded (live vs simulated)
  const dataText = await page.locator('text=Current Data:').locator('xpath=..').innerText().catch(() => '')
  if (dataText) console.log('  data card:', dataText.replace(/\n/g, ' | '))

  // 1. Full UI — dark page background
  await page.screenshot({ path: path.join(out, 'full-ui-dark.png'), fullPage: false })
  console.log('  full-ui-dark.png')

  // 2. Whole page (in case content is taller than viewport)
  await page.screenshot({ path: path.join(out, 'full-ui-tall.png'), fullPage: true })
  console.log('  full-ui-tall.png')

  // 3. The left controls column (data source + grid settings + export)
  await shotElement(page, 'main .grid > div:first-child', 'controls-panel.png', { pad: 32 })

  // 4. Individual cards
  await shotElement(page, '.card-gradient:has-text("Data Source")', 'data-source-card.png', { pad: 24 })
  await shotElement(page, '.card-gradient:has-text("Grid Settings")', 'grid-settings-card.png', { pad: 24 })
  await shotElement(page, '.card-gradient:has-text("Export")', 'export-card.png', { pad: 24 })

  // 5. The preview panel (dark) with the generated grid
  await shotElement(page, 'main .grid > div:last-child', 'preview-panel.png')

  // 6. Just the grid SVG itself, on white
  const svg = page.locator(GRID_SVG).first()
  await svg.screenshot({ path: path.join(out, 'preview-grid.png'), type: 'png' })
  console.log('  preview-grid.png')

  await browser.close()
  console.log('\nDone. See marketing/figma-export/grid-generator-ui/')
}

main().catch((e) => { console.error(e); process.exit(1) })
