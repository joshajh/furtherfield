# Marketing comps — key UI elements

Transparent-background PNGs of three key Furtherfield UI elements, rebuilt as
isolated layered "comps" for reuse on another marketing site. Rendered from a
self-contained harness (`export.html`) at 2× resolution, in the reference style
used by `~/repos/solar-power/exports` (layered UI panels, floating pill labels,
pulled-out data chips, hard offset-block shadows).

Regenerate any time (no dev server needed — the harness is a static file):

```bash
node export-comps.mjs        # writes the PNGs next to this README
```

The script uses the cached Playwright Chromium at
`~/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome` via `playwright-core`.

## What's here

Each comp comes in **two framings** × **two theme variants**:

- `*-flat--*`   → straight-on
- `*-tilted--*` → projected on the 3D-perspective stage (more dramatic, full-bleed hero)
- `*--light.png` → **dark ink / strokes** → use on **light / white** backgrounds
- `*--dark.png`  → **cream ink / strokes** → use on **dark / coloured** backgrounds

The brand accents (acid `#C8FF00`, the blue→periwinkle gradient, lemon data
cards) stay constant in both themes.

| File stem | What it is | Source |
|-----------|-----------|--------|
| `grid-creator-{flat,tilted}--{light,dark}` | The **Grid Generator** tool — control panel (data source, grid-size/amplitude/frequency sliders, SVG/PNG export) layered behind the live wave-distorted grid preview. Grid is the real generator output (tidal data, level 2.74 mAOD). | `tools/crafting-table-next/app/grid-generator/page.tsx` + `lib/svg-utils.ts` |
| `marine-readouts-{flat,tilted}--{light,dark}` | The homepage hero's **Live Data** readout — the brand-gradient tidal-grid panel + a marine-traffic card with the four `.tag` chips (Tide / Vessels / Arriving / Departing) and net-flow chip, for the Port of Felixstowe. | `marketing/components/HeroHeader.tsx` + `TidalGrid.tsx` |
| `event-chrome-{flat,tilted}--{light,dark}` | **Event-detail UI kit** — a gradient event-hero card (callout badges, italic display title, venue-pin button, "Book Now" tag) beside a chrome swatch panel showing the Brandmark3D 4-cube logo, callouts, the CubeDivider, and the inline icon set. | `marketing/app/events/[slug]/EventPageClient.tsx`, `Brandmark3D.tsx`, `CubeDivider.tsx` |

## Notes

- **Faithful, not screenshots.** The two wave grids port the exact generator
  math from the live components (`createWavyLine`, 100 segments, `lineIndex*0.5`
  for the tool grid; `generateWavyPath`, 35 segments, `lineIndex*0.3`,
  stroke `#9A8B55` for the hero grid). The cubes use the exact geometry and
  face colours from `Brandmark3D`/`CubeDivider`. Data snapshots are deterministic
  (no live fetch / `Math.random`) so re-exports render identically.
- **Palette** (from `marketing/app/globals.css`): ink `#0F0E0E`, cream `#F6F8FB`,
  gradient `#BCE5F3 → #D0D6FD`, acid `rgb(200,255,0)`, lemon `rgba(245,235,180)`.
  Fonts: Geist Mono (UI/mono), Plus Jakarta Sans (body); Spectral stands in for
  the P22 Mackinac display serif (swap if the licensed face is available).
- Each stage is measured and clipped tightly to the union bbox of its panels /
  pills / chips (plus shadow padding), so crops stay snug and never clip the
  outward-poking pill/chip.
- `export.html` + `export-comps.mjs` are the capture harness — safe to keep for
  re-exports or to delete once the PNGs are placed.
