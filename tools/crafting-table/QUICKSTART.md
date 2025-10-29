# Quick Start Guide

## Getting Started (30 seconds)

1. Open `index.html` in your browser
2. Click on any app tile
3. Start creating!

No installation, no build process, no dependencies.

---

## Example Workflow: Create a Trading Card

**Time: ~5 minutes**

### Step 1: Generate a Sprite (2 min)
1. Open **Sprite Generator**
2. Choose category: Person, Flora, Fauna, or Maritime
3. Click "Generate Sprite" until you like what you see
4. Or click "Generate Batch (9)" to see multiple options
5. Download SVG

### Step 2: Apply Colors (1 min)
1. Open **Colorist**
2. Load your sprite SVG
3. Choose "Palette" mode
4. Select "Sea" or "Flora" palette
5. Click "Apply Colors"
6. Download SVG

### Step 3: Add a Mark (1 min)
1. Open **Mark Generator**
2. Choose Content Type (e.g., "Artwork")
3. Select tags (e.g., "Community" + "Interactive")
4. Click "Generate Mark"
5. Download SVG

### Step 4: Compose (1 min)
1. Open **Compositor**
2. Load all 3 SVG files (sprite, colored sprite, mark)
3. Arrange layers: sprite in center, mark in corner
4. Adjust scale and position
5. Click "Render Composition"
6. Download final PNG

**Result**: A unique trading card combining procedural pixel art, maritime colors, and encoded metadata!

---

## Example Workflow: Generate a Grid Pattern

**Time: ~2 minutes**

### Real-time Tidal Grid
1. Open **Grid Generator**
2. Select "Tidal Flow" as data source
3. App automatically fetches current tide data from Felixstowe
4. Adjust wave amplitude and frequency to taste
5. Click "Generate New Grid" to see new variations
6. Download SVG or PNG

The grid will be unique to the current tidal conditions!

### Apply Colors
1. Open **Colorist**
2. Load your grid SVG
3. Choose "Gradient" mode
4. Select "Maritime" palette
5. Adjust gradient angle
6. Click "Apply Colors"
7. Export

**Result**: A unique grid pattern influenced by the sea, ready for use as a background, poster, or web design element.

---

## Example Workflow: Archive Marking System

**Time: ~10 minutes to setup, then instant marking**

### Create Your Taxonomy
1. Open **Mark Generator**
2. Review the built-in taxonomy (or modify `shared/config.js`)
3. Create marks for each content type you manage

### Generate Archive Marks
For each item in your archive:

1. Select content type (Article, Event, Artwork, etc.)
2. Check relevant primary tags (Digital, Environmental, Community, Historical)
3. Check attributes (Interactive, Experimental, Collaborative)
4. Add title if desired
5. Generate mark
6. Download SVG + JSON metadata
7. Name file with item ID

### Use the Marks
- Print marks and affix to physical items
- Add marks to digital file thumbnails
- Use marks as visual index
- Decode using included legend

**Result**: A complete visual classification system where every mark encodes its metadata visually.

---

## Tips & Tricks

### For Designers
- Export everything as SVG to maintain editability
- Use Compositor to build complex layouts before adding to design software
- Generate asset libraries at different times/tides for variety
- Color variations are your friend - one grid, many palettes

### For Developers
- JSON metadata can be parsed for databases
- Unique IDs link related assets
- All apps work offline (except tidal data fetching)
- Fork and extend - shared utilities make new apps easy

### For Archivists
- Mark Generator provides decodable visual taxonomy
- Export metadata JSON with every asset
- Build visual knowledge graphs
- Physical and digital archives share same system

### For Educators
- Apps demonstrate generative design principles
- Real-world data makes abstract concepts concrete
- No code required to use, but code is readable for learning
- Modular architecture teaches separation of concerns

---

## Common Questions

**Q: Do I need an internet connection?**
A: Mostly no. Only Grid Generator needs internet for real-time tidal data. All other apps work fully offline.

**Q: Can I edit the generated assets?**
A: Yes! Export as SVG and open in Illustrator, Figma, Inkscape, or any vector editor.

**Q: Can I change the color palettes?**
A: Yes! Edit `shared/config.js` to add your own palettes, or use Custom Palette in Colorist.

**Q: Can I add more content types to the taxonomy?**
A: Yes! Edit `shared/config.js` to add new content types, tags, or attributes.

**Q: How do I use this for print?**
A: Export high-resolution PNGs (default 800x800) or SVGs and place in InDesign, Illustrator, etc.

**Q: Can I automate generation?**
A: The apps are browser-based for now, but the algorithms are simple JavaScript - could be adapted for Node.js/Python for batch processing.

**Q: Will my assets be unique?**
A: Grid Generator creates unique patterns based on time/tide. Sprite Generator uses procedural algorithms with randomization. Mark Generator creates deterministic marks (same inputs = same mark) for consistency.

---

## What's Next?

1. **Explore**: Try all 5 apps
2. **Experiment**: Generate variations, test combinations
3. **Integrate**: Use in your real design workflows
4. **Extend**: Add new apps using the shared utilities
5. **Share**: Show your creations!

---

## File Locations

- **Landing page**: `index.html`
- **Grid Generator**: `apps/grid-generator/index.html`
- **Colorist**: `apps/colorist/index.html`
- **Sprite Generator**: `apps/sprite-generator/index.html`
- **Mark Generator**: `apps/mark-generator/index.html`
- **Compositor**: `apps/compositor/index.html`

---

## Need More Help?

- Read `README.md` for full documentation
- Check `shared/config.js` for customization options
- Inspect browser console for debugging
- View source - all code is readable and commented

**Happy creating!** 🌊
