// Screenshots the export.html comps to transparent PNGs.
// Usage: node export-comps.mjs
// Mirrors solar-power/scripts/export-visuals.mjs: measure each stage's union
// bbox, clip tightly, capture flat + tilted in light + dark themes.
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(process.env.OUT ?? __dir);
const PAGE = pathToFileURL(resolve(__dir, "export.html")).href;
const EXE = process.env.HOME + "/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome";
const SCALE = 2;

const STAGES = [
  { id: "grid-creator", name: "grid-creator" },
  { id: "marine-readouts", name: "marine-readouts" },
  { id: "event-chrome", name: "event-chrome" },
];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: EXE });

for (const theme of ["dark", "light"]) {
  const ctx = await browser.newContext({
    deviceScaleFactor: SCALE,
    viewport: { width: 2000, height: 1400 },
  });
  const page = await ctx.newPage();
  await page.goto(PAGE, { waitUntil: "networkidle" });
  // theme class drives the ink/panel colour tokens on each stage
  await page.evaluate((t) => {
    document.querySelectorAll(".stage").forEach((s) => {
      s.classList.remove("theme-dark", "theme-light");
      s.classList.add("theme-" + t);
    });
  }, theme);
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(500);

  const measure = (id) =>
    page.evaluate((sid) => {
      const els = document.querySelectorAll(
        `#${sid} .ff-panel, #${sid} .ff-pill, #${sid} .ff-chip`
      );
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top);
        x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom);
      });
      return { x0, y0, x1, y1 };
    }, id);

  for (const s of STAGES) {
    const stage = page.locator(`#${s.id}`);
    if ((await stage.count()) === 0) { console.warn(`! missing #${s.id}`); continue; }

    for (const tilted of [false, true]) {
      await page.evaluate((a) => {
        const el = document.getElementById(a.id);
        el.classList.toggle("is-tilted", a.t);
      }, { id: s.id, t: tilted });
      await page.waitForTimeout(150);

      // scroll the stage near the viewport origin, then measure there
      const pre = await measure(s.id);
      await page.evaluate((y) => window.scrollBy(0, y - 60), pre.y0);
      await page.waitForTimeout(80);
      const b = await measure(s.id);
      const PAD_TL = 40, PAD_BR = 60; // clear the hard offset shadows (10-12px)
      const clip = {
        x: Math.max(0, b.x0 - PAD_TL),
        y: Math.max(0, b.y0 - PAD_TL),
        width: (b.x1 - b.x0) + PAD_TL + PAD_BR,
        height: (b.y1 - b.y0) + PAD_TL + PAD_BR,
      };

      const file = `${OUT}/${s.name}-${tilted ? "tilted" : "flat"}--${theme}.png`;
      await page.screenshot({ path: file, omitBackground: true, clip });
      console.log(`✓ ${file}  (${Math.round(clip.width)}×${Math.round(clip.height)})`);
      await page.evaluate(() => window.scrollTo(0, 0));
    }
    await page.evaluate((id) => document.getElementById(id).classList.remove("is-tilted"), s.id);
  }
  await ctx.close();
}

await browser.close();
console.log("\nDone → " + OUT);
