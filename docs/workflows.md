# Workflows

Common design workflows using the Furtherfield visual identity system.

## Quick Reference

| Workflow | Tools Used | Time | Output |
|----------|-----------|------|--------|
| [Event Poster](#workflow-1-event-poster) | Grid Generator, Colorist, Mark Generator | 15 min | Print/digital poster |
| [Trading Cards](#workflow-2-trading-cards) | Sprite Generator, Colorist, Mark Generator, Compositor | 20 min | Card designs |
| [Archive System](#workflow-3-archive-system) | Mark Generator | 10 min setup | Classification marks |
| [Web Background](#workflow-4-web-backgrounds) | Grid Generator, Colorist | 5 min | Tiled background |
| [Social Media](#workflow-5-social-media-assets) | Sprite Generator, Colorist | 10 min | Avatar/header images |

---

## Workflow 1: Event Poster

**Goal:** Create a poster for an upcoming event that reflects the tide at event time.

**Time:** ~15 minutes

### Steps

1. **Generate Base Grid** (5 min)
   - Open [Grid Generator](../tools/crafting-table/apps/grid-generator/)
   - Select "Tidal Flow" data source
   - Set grid size: 15-20 (good balance for posters)
   - Set wave amplitude: 25-30 (noticeable but not overwhelming)
   - Generate grid at event date/time (or current if testing)
   - Export as SVG (800x800px)

2. **Apply Colors** (5 min)
   - Open [Colorist](../tools/crafting-table/apps/colorist/)
   - Load your grid SVG
   - Select color mode:
     - "Gradient" for atmospheric feel
     - "Solid Palette" for clean, bold look
   - Choose palette based on event type:
     - "Maritime" for formal/professional
     - "Sunset" for evening events
     - "Flora" for environmental topics
   - Adjust gradient angle if using gradients (45° or 90° work well)
   - Export as SVG

3. **Create Event Mark** (3 min)
   - Open [Mark Generator](../tools/crafting-table/apps/mark-generator/)
   - Select "Event" content type (circle)
   - Add relevant tags (e.g., "Community" + "Digital")
   - Add attributes if needed (e.g., "Interactive")
   - Export as SVG (128x128px) and PNG

4. **Compose in Design Software** (2 min)
   - Import colored grid into Illustrator/Figma
   - Add event title, date, time, location (typography)
   - Place mark in corner or header
   - Export final poster

**Tips:**
- Generate grid close to event time for authentic connection
- Use larger wave amplitude for energetic/experimental events
- Use smaller amplitude for formal/professional events
- Include QR code linking to event page

---

## Workflow 2: Trading Cards

**Goal:** Create collectible cards representing community members, projects, or themes.

**Time:** ~20 minutes per card

### Steps

1. **Generate Sprite** (5 min)
   - Open [Sprite Generator](../tools/crafting-table/apps/sprite-generator/)
   - Choose category:
     - "Person" for community members
     - "Flora" for environmental themes
     - "Fauna" for wildlife/ecology
     - "Maritime" for nautical themes
   - Set size: 16x16 or 24x24
   - Enable symmetrical for cleaner look
   - Set density: 50-60% for balanced designs
   - Click "Generate Batch (9)" to see options
   - Select favorite from gallery
   - Export as SVG

2. **Colorize Sprite** (3 min)
   - Open [Colorist](../tools/crafting-table/apps/colorist/)
   - Load sprite SVG
   - Select "Solid Palette" mode
   - Choose thematic palette
   - Apply colors
   - Export as SVG

3. **Create Classification Mark** (3 min)
   - Open [Mark Generator](../tools/crafting-table/apps/mark-generator/)
   - Select appropriate content type
   - Add tags representing the subject
   - Export as SVG

4. **Generate Grid Background** (Optional, 3 min)
   - Open [Grid Generator](../tools/crafting-table/apps/grid-generator/)
   - Create subtle grid (low amplitude: 5-10)
   - Export as SVG

5. **Composite** (6 min)
   - Open [Compositor](../tools/crafting-table/apps/compositor/)
   - Load background grid (if using)
   - Load colored sprite
   - Load classification mark
   - Arrange:
     - Grid: Background layer, 30-40% opacity
     - Sprite: Center, 100% opacity, scale up
     - Mark: Top right corner, 60-80% scale
   - Add background color
   - Render composition
   - Export as PNG (800x800px)

6. **Add Text** (in design software)
   - Name/title
   - Description or stats
   - Unique ID (from mark metadata)

**Tips:**
- Generate multiple sprite batches to find the best one
- Use consistent palette across a card set
- Include metadata JSON for digital collections
- Print at 300dpi for physical cards

---

## Workflow 3: Archive System

**Goal:** Create a visual classification system for physical or digital archives.

**Time:** 10 minutes setup, then 2 minutes per item

### Initial Setup

1. **Review Taxonomy** (5 min)
   - Read [Taxonomy documentation](taxonomy.md)
   - Identify which content types you'll use
   - List common tag combinations in your collection

2. **Create Mark Legend** (5 min)
   - Open [Mark Generator](../tools/crafting-table/apps/mark-generator/)
   - Create one mark for each content type you use
   - Export all as SVG
   - Create legend poster showing:
     - Each shape with content type name
     - Position markers with tag names
     - Style modifiers with attribute names

### Per-Item Classification

1. **Classify Content** (1 min)
   - Determine content type
   - Identify 1-4 primary tags
   - Identify any applicable attributes

2. **Generate Mark** (1 min)
   - Open [Mark Generator](../tools/crafting-table/apps/mark-generator/)
   - Set content type, tags, attributes
   - Add title if desired
   - Export as SVG + PNG
   - Export metadata JSON
   - Name files with item ID: `item-001-mark.svg`

3. **Apply Mark**
   - **Physical:** Print mark and affix to item
   - **Digital:** Add mark to file thumbnail or metadata

**Tips:**
- Batch similar items for efficiency
- Keep marks at consistent size (128px/5cm)
- Store metadata JSON in searchable database
- Use mark IDs to link related items
- Create wayfinding system using content type colors

---

## Workflow 4: Web Backgrounds

**Goal:** Create dynamic tiled backgrounds for websites that update with tides.

**Time:** 5 minutes per variant

### Steps

1. **Generate Grid** (2 min)
   - Open [Grid Generator](../tools/crafting-table/apps/grid-generator/)
   - Select "Tidal Flow" data source
   - Set grid size: 10-15 (smaller for tiled backgrounds)
   - Set wave amplitude: 15-20 (subtle for backgrounds)
   - Generate and export SVG

2. **Apply Colors** (2 min)
   - Open [Colorist](../tools/crafting-table/apps/colorist/)
   - Load grid SVG
   - Select "Tint/Overlay" mode for subtle effect
   - Choose brand colors with low opacity (20-30%)
   - Export SVG

3. **Optimize for Web** (1 min)
   - Open SVG in code editor
   - Minify if needed
   - Set `viewBox` for scalability
   - Test tiling in browser

**For Dynamic Backgrounds:**

Generate grids at different tidal states:
- High tide: Maximum amplitude
- Mid tide: Medium amplitude
- Low tide: Minimum amplitude

Swap backgrounds based on current tide using JavaScript.

**Tips:**
- Keep wave amplitude low (10-20) for readability
- Use light tints to avoid overwhelming content
- Generate smaller grid sizes (8-12) for performance
- Cache multiple tidal states for smoother transitions

---

## Workflow 5: Social Media Assets

**Goal:** Create profile pictures, headers, and post templates.

**Time:** 10 minutes

### Profile Picture

1. **Generate Sprite** (4 min)
   - Open [Sprite Generator](../tools/crafting-table/apps/sprite-generator/)
   - Choose "Person" category
   - Generate multiple options
   - Select best
   - Export SVG

2. **Colorize** (2 min)
   - Open [Colorist](../tools/crafting-table/apps/colorist/)
   - Apply brand palette
   - Export PNG at 400x400px

### Header Image

1. **Generate Grid** (2 min)
   - Open [Grid Generator](../tools/crafting-table/apps/grid-generator/)
   - Create grid with current tidal data
   - Export at 1600x400px (resize in design tool)

2. **Add Elements** (2 min)
   - Open in design software
   - Add logo, text, or sprites
   - Export at platform-specific dimensions

### Post Templates

1. **Create Base Grid** (as above)
2. **Set up Template** in design software:
   - Add text placeholder
   - Add mark in corner for content type
   - Save as template for reuse

**Tips:**
- Generate sprite variants for different team members
- Update header grid seasonally or for events
- Use consistent palette across all social assets
- Export at multiple sizes for different platforms

---

## Advanced Workflows

### Animated Tidal Sequence

1. Generate grids at different tide levels (hourly over 12 hours)
2. Export all as PNG
3. Create GIF or video in animation software
4. Use for social media, exhibitions, or web

### Pattern Library

1. Generate 20-30 grid variations with different parameters
2. Colorize each with different palettes
3. Export all as SVG and PNG
4. Store in shared asset library
5. Use for consistent but varied applications

### Exhibition Wayfinding

1. Create mark for each exhibition section/theme
2. Print large-format marks for walls
3. Use same marks on printed materials
4. Include on web pages and apps
5. Create unified physical-digital experience

---

## Tips for All Workflows

**File Management:**
- Use consistent naming: `project-tool-date-version.svg`
- Export both SVG and PNG where possible
- Save metadata JSON for digital assets
- Keep source files organized by project

**Quality Control:**
- View exports at actual size before finalizing
- Check color contrast for accessibility
- Test tiled patterns for seamless repetition
- Verify SVG opens correctly in target software

**Collaboration:**
- Share generation parameters with team
- Document which tide/time grids were generated
- Include mark legend when introducing taxonomy
- Keep design tokens up to date

**Iteration:**
- Generate multiple options before committing
- Test at intended size/medium
- Get feedback from community
- Refine based on usage

---

## Questions?

- **Technical issues:** See [Crafting Table docs](../tools/crafting-table/README.md)
- **Visual guidelines:** See [Brand Guidelines](brand-guidelines.md)
- **Classification questions:** See [Taxonomy](taxonomy.md)
