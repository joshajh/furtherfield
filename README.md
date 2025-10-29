# Furtherfield Design Tools

A modular suite of micro-apps for generative visual identity design. Each tool performs a specific task and can be used independently or composed together to create dynamic, data-driven assets rooted in Felixstowe's maritime environment.

## Philosophy

This system takes a **tech-first, tool-based approach** to visual identity design:

- **Modular**: Each app does one thing well
- **Composable**: Apps work standalone or together
- **Data-driven**: Real-world maritime data influences generation
- **Flexible**: Remove rigidity while maintaining structure
- **Archival**: Built-in taxonomy for knowledge management

## Quick Start

1. Open `index.html` in your browser to see all available apps
2. Each app is self-contained in `apps/[app-name]/index.html`
3. No build process required - just open and use
4. Optional: Run `python3 -m http.server 8000` for local hosting

## The Micro-Apps

### 1. Grid Generator (`apps/grid-generator/`)

Creates flexible grids with wave-like distortions based on real-time data.

**Features:**
- Real-time tidal data from UK Environment Agency API
- Ship movement tracking from Port of Felixstowe
- Adjustable wave amplitude and frequency
- Maintains structure while adding organic flow
- SVG & PNG export

**Use Cases:**
- Base patterns for layouts
- Backgrounds for posters, websites
- Animated sequences showing tidal cycles
- Unique patterns for each publication

**Data Sources:**
- Tidal: Updates every 15 minutes from nearest tide gauge
- Ships: Vessel arrivals/departures influence wave patterns

---

### 2. Colorist (`apps/colorist/`)

Applies color palettes, gradients, and generative noise to existing assets.

**Features:**
- 4 color modes: Solid Palette, Gradient, Generative Noise, Tint/Overlay
- 6 maritime-inspired palettes (sea, shore, maritime, flora, monochrome, sunset)
- Custom palette builder
- Works with SVG files from other apps
- Preserves vector quality

**Use Cases:**
- Colorize grid patterns for different seasons/events
- Create color variations of sprites
- Apply brand colors to generated assets
- Add visual noise for texture

**Workflow:**
1. Load SVG from Grid Generator or Sprite Generator
2. Select color mode and palette
3. Adjust parameters
4. Export colored version

---

### 3. Sprite Generator (`apps/sprite-generator/`)

Generates procedural 8-bit pixel art of people, flora, fauna, and maritime objects.

**Features:**
- 4 categories: Person, Flora, Fauna, Maritime
- Symmetrical or asymmetrical designs
- Adjustable pixel density and size (8x8 to 32x32)
- Batch generation (9 sprites at once)
- Thumbnail gallery for selection
- All maritime-themed color palettes available

**Use Cases:**
- Trading card-like symbols for community members
- Icons representing different content types
- Profile pictures with consistent style
- Decorative elements for publications

**Algorithm:**
- Procedural generation with category-specific patterns
- Person: head/torso/body structure
- Flora: organic, branching patterns
- Fauna: compact body shapes
- Maritime: boat/anchor/port shapes

---

### 4. Mark Generator (`apps/mark-generator/`)

Creates geometric marks that encode content-type and tags for archival and knowledge management.

**Features:**
- Visual encoding of metadata
- 6 content types (Article, Event, Artwork, Exhibition, Project, Archive)
- 4 primary tags (Digital, Environmental, Community, Historical)
- 4 attribute modifiers (Interactive, Ongoing, Collaborative, Experimental)
- Decodable marks with included legend
- Unique ID generation

**Taxonomy:**

**Content Types (Shapes):**
- Square = Article
- Circle = Event
- Triangle = Artwork
- Hexagon = Exhibition
- Pentagon = Project
- Octagon = Archive

**Primary Tags (Position Markers):**
- Top = Digital
- Right = Environmental
- Bottom = Community
- Left = Historical

**Attributes (Style Modifiers):**
- Outlined = Interactive
- Dotted = Experimental
- Composite = Collaborative
- (Future: Animated indicators = Ongoing)

**Use Cases:**
- Physical/digital archive organization
- Content classification system
- Visual knowledge graph
- Wayfinding system
- Document categorization
- Exhibition labeling

---

### 5. Compositor (`apps/compositor/`)

Combines outputs from multiple micro-apps into final layered compositions.

**Features:**
- Multi-layer composition
- Per-layer controls: position, scale, opacity, rotation
- Layer reordering (bring to front/send to back)
- Background color selector
- Real-time preview
- Supports SVG, PNG, JPG

**Use Cases:**
- Combine grid + sprite + mark into single asset
- Create posters with multiple generated elements
- Layer colored grids with marks
- Build trading card designs
- Assemble complex layouts

**Workflow:**
1. Generate assets in other apps (Grid, Sprite, Mark)
2. Load all assets into Compositor
3. Arrange, scale, and position layers
4. Adjust opacity for overlays
5. Export final composition

---

## Shared Infrastructure

All apps share common utilities and configuration:

### `shared/config.js`
- Standard asset sizes
- Color palettes
- Content taxonomy
- Export formats
- Felixstowe location data

### `shared/utils.js`
- Export functions (SVG, PNG, JSON)
- Metadata generation
- Color utilities
- File loading helpers

### `shared/styles.css`
- Consistent UI components
- Responsive layout
- Maritime-inspired color scheme

## Typical Workflows

### Workflow 1: Event Poster
1. **Grid Generator**: Create wavy grid based on event date's tide
2. **Colorist**: Apply event-specific color palette
3. **Mark Generator**: Create mark encoding event type + tags
4. **Compositor**: Combine grid + mark, add text externally

### Workflow 2: Trading Cards
1. **Sprite Generator**: Create character/creature pixel art
2. **Colorist**: Apply thematic palette
3. **Mark Generator**: Encode character attributes
4. **Compositor**: Arrange sprite + mark + decorative elements

### Workflow 3: Archive System
1. **Mark Generator**: Create marks for all content items
2. Export with metadata JSON
3. Use marks as visual index system
4. Decode marks using included taxonomy

### Workflow 4: Dynamic Identity
1. **Grid Generator**: Generate grids at key tidal moments
2. **Colorist**: Create seasonal color variants
3. Build library of variations
4. Apply different combinations for different use cases

## Technical Details

### Data Formats

All apps export consistent metadata:
```json
{
  "id": "ff-1234567890-abc123",
  "app": "grid-generator",
  "timestamp": "2025-10-29T15:00:00.000Z",
  "contentType": "generated-grid",
  "tags": ["tidal", "wave"],
  "version": "1.0",
  "creator": "Furtherfield Micro-Apps"
}
```

### Export Formats

- **SVG**: Vector, editable, ideal for design tools
- **PNG**: Raster, ready for web/print
- **JSON**: Metadata for archival/reconstruction

### Browser Compatibility

Works in all modern browsers with:
- SVG rendering
- ES6 JavaScript
- Canvas API
- Fetch API

No frameworks or build tools required.

## File Structure

```
furtherfield/
├── index.html                 # Landing page / app navigator
├── apps/
│   ├── grid-generator/       # Tidal/ship-based grid generation
│   ├── colorist/             # Color application tool
│   ├── sprite-generator/     # Pixel art generator
│   ├── mark-generator/       # Encoded taxonomy marks
│   └── compositor/           # Multi-layer composition
├── shared/
│   ├── config.js            # Global configuration
│   ├── utils.js             # Shared utilities
│   └── styles.css           # Common styles
├── docs/                    # Documentation
└── README.md               # This file
```

## Content Taxonomy

The system includes a complete taxonomy for content classification:

### Content Types
- **Article**: Written content, blog posts, essays
- **Event**: Workshops, exhibitions openings, performances
- **Artwork**: Individual artworks, installations
- **Exhibition**: Curated shows, collections
- **Project**: Long-term initiatives, collaborations
- **Archive**: Historical materials, documentation

### Tags
- **Digital**: Technology, net art, digital culture
- **Environmental**: Nature, ecology, sustainability
- **Community**: Participation, collaboration, social practice
- **Historical**: Archive, heritage, memory

### Attributes
- **Interactive**: Requires participation, responsive
- **Ongoing**: Long-term, iterative, continuous
- **Collaborative**: Multiple creators, collective work
- **Experimental**: Research-based, exploratory

## Maritime Data Sources

### Tidal Data
- **API**: UK Environment Agency Flood Monitoring
- **Station**: Nearest tide gauge to Felixstowe (52.06°N, 1.35°E)
- **Update Frequency**: Every 15 minutes
- **Data**: Tide level in mAOD (metres above Ordnance Datum)
- **URL**: https://environment.data.gov.uk/flood-monitoring

### Ship Data
- **Source**: Port of Felixstowe vessel tracking
- **Data**: Arrivals, departures, vessels at berth
- **Implementation**: Optional backend proxy (see `apps/grid-generator/server.js`)
- **Fallback**: Simulated realistic traffic patterns

## Advanced Usage

### Custom Palettes
1. In Colorist, select "Custom Palette"
2. Add colors using color picker
3. Export colored asset
4. Metadata includes your custom palette

### Batch Processing
1. Sprite Generator can create 9 sprites at once
2. Select favorites from thumbnail gallery
3. Process multiple grids at different tide levels
4. Build asset libraries

### Metadata-Driven Workflows
1. Export JSON metadata with all assets
2. Use IDs to link related assets
3. Build databases of generated works
4. Reconstruct parameters later

### Integration with Design Tools
1. Export SVG from any app
2. Open in Illustrator, Figma, Inkscape
3. Further edit while preserving vectors
4. Combine with typography, photography

## Future Enhancements

Potential additions to the suite:

- [ ] **Typography Tool**: Maritime-inspired type treatment generator
- [ ] **Animation Tool**: Create time-lapse sequences of tide cycles
- [ ] **Pattern Tool**: Generate seamless patterns from grids
- [ ] **3D Extrusion**: Convert 2D marks into 3D models
- [ ] **Sound Tool**: Sonify tidal/ship data
- [ ] **Historical Playback**: View data from past dates
- [ ] **API Integration**: Direct webhook connections
- [ ] **Preset System**: Save and load configurations
- [ ] **Collaborative Features**: Share assets between users
- [ ] **Print Templates**: Ready-to-use layouts for physical materials

## Credits

Created for a digital arts organisation based in Felixstowe, UK.

The system bridges traditional grid-based design with the fluid, data-driven dynamics of maritime life, creating a visual identity that's both structured and organic, local and universal.

## License

MIT License

---

## Getting Help

- Open `index.html` for interactive tool selection
- Each app has inline help and examples
- Check `shared/config.js` for customizable parameters
- Inspect browser console for debugging

## Contributing

To add a new micro-app:

1. Create `apps/[app-name]/index.html`
2. Import shared CSS and JS
3. Use `FurtherfieldUtils` for exports
4. Follow the established UI patterns
5. Add to main `index.html` landing page
6. Document in this README

---

**Built with:** Vanilla HTML, CSS, JavaScript
**No dependencies:** No frameworks, no build process
**Data sources:** UK Environment Agency, Port of Felixstowe
**Location:** Felixstowe, Suffolk, UK (52.06°N, 1.35°E)
