# Furtherfield Visual Identity System

A complete design system for a digital arts organisation based in Felixstowe, UK. This monorepo contains design tokens, documentation, and generative design tools that create a flexible, data-driven visual identity rooted in the maritime environment.

## 📦 Repository Structure

```
furtherfield/
├── design-tokens/          # Systematic design values
│   ├── colors.json        # Color palettes and semantic colors
│   ├── typography.json    # Font scales and hierarchy
│   ├── spacing.json       # Spacing scale and sizing
│   └── README.md          # Token documentation
│
├── docs/                  # Documentation and guidelines
│   ├── brand-guidelines.md   # Visual identity guidelines
│   ├── taxonomy.md          # Content classification system
│   ├── workflows.md         # Common design workflows
│   └── README.md            # Documentation overview
│
├── tools/                 # Software tools
│   └── crafting-table/   # Generative design micro-apps
│       ├── apps/          # Individual micro-apps
│       │   ├── grid-generator/     # Tidal/ship-based grids
│       │   ├── colorist/          # Color application tool
│       │   ├── sprite-generator/  # 8-bit pixel art
│       │   ├── mark-generator/    # Taxonomy encoding marks
│       │   └── compositor/        # Multi-layer composition
│       ├── shared/        # Common utilities and styles
│       └── README.md      # Tool documentation
│
└── assets/               # Example outputs and references
    └── examples/         # Sample generated assets
```

## 🚀 Quick Start

### For Designers

1. **Read the guidelines**: Start with [`docs/brand-guidelines.md`](docs/brand-guidelines.md)
2. **Explore design tokens**: See [`design-tokens/`](design-tokens/)
3. **Use the tools**: Open [`tools/crafting-table/index.html`](tools/crafting-table/index.html) in your browser
4. **Follow workflows**: Check [`docs/workflows.md`](docs/workflows.md) for step-by-step guides

### For Developers

1. **Import design tokens**: Use JSON files from [`design-tokens/`](design-tokens/)
2. **Review tool APIs**: See [`tools/crafting-table/README.md`](tools/crafting-table/README.md)
3. **Explore source code**: All tools are vanilla HTML/CSS/JS with no build process

### For Content Creators

1. **Learn the taxonomy**: Read [`docs/taxonomy.md`](docs/taxonomy.md)
2. **Generate marks**: Use the [Mark Generator](tools/crafting-table/apps/mark-generator/index.html)
3. **Classify content**: Apply marks to organize and archive

## 🎨 Design System Components

### 1. Design Tokens

Foundational design values in machine-readable JSON format:

- **Colors**: Maritime-inspired palettes (sea, shore, flora, sunset)
- **Typography**: Font scales, weights, and hierarchy
- **Spacing**: Consistent spacing scale and asset sizes

[→ Explore Design Tokens](design-tokens/)

### 2. Crafting Table

A suite of 5 micro-apps for generative design:

- **Grid Generator**: Wavy grids influenced by Felixstowe tidal data and ship movements
- **Colorist**: Apply palettes, gradients, and generative noise to assets
- **Sprite Generator**: Procedural 8-bit pixel art (people, flora, fauna, maritime)
- **Mark Generator**: Geometric marks that visually encode content taxonomy
- **Compositor**: Layer and combine outputs into final compositions

**Key Features:**
- Real-time maritime data integration
- SVG/PNG/JSON export
- No installation required - runs in browser
- Modular architecture - use tools independently or together

[→ Launch Crafting Table](tools/crafting-table/index.html)

### 3. Taxonomy System

A visual classification system using geometric marks:

- **6 Content Types** encoded as shapes (article, event, artwork, exhibition, project, archive)
- **4 Primary Tags** shown as position markers (digital, environmental, community, historical)
- **4 Attributes** indicated by style modifiers (interactive, experimental, collaborative, ongoing)

**Use Cases:**
- Archive organization
- Content classification
- Wayfinding systems
- Knowledge management

[→ Learn the Taxonomy](docs/taxonomy.md)

## 🌊 Design Philosophy

### Place-Based
Every element connects to Felixstowe's maritime environment:
- Grids reflect tidal movements
- Colors drawn from sea and shore
- Data from local port and tides

### Flexible Structure
Maintains order while adding organic fluidity:
- Wavy grids instead of rigid rectangles
- Structure adapts without losing coherence
- Rules provide framework for variation

### Data-Driven
Real-world data influences visual decisions:
- Tidal levels affect wave patterns
- Ship movements inform composition
- Time stamps create unique moments

### Modular
Build complexity from simple components:
- Each tool does one thing well
- Tools work independently or together
- Consistent formats enable interoperability

## 📖 Documentation

Comprehensive guides for all aspects of the system:

- [**Brand Guidelines**](docs/brand-guidelines.md) - Visual identity, colors, typography, composition
- [**Taxonomy**](docs/taxonomy.md) - Content classification system and marks
- [**Workflows**](docs/workflows.md) - Step-by-step guides for common tasks
- [**Design Tokens**](design-tokens/README.md) - Token format and usage
- [**Crafting Table**](tools/crafting-table/README.md) - Tool documentation and APIs

## 🎯 Common Use Cases

### Event Promotion
1. Generate grid reflecting event date's tide
2. Apply thematic color palette
3. Create mark encoding event type/tags
4. Compose into poster or social media asset

[→ See Workflow](docs/workflows.md#workflow-1-event-poster)

### Archive Organization
1. Define content types and tags
2. Generate marks for each item
3. Print/embed marks for unified system
4. Use across physical and digital archives

[→ See Workflow](docs/workflows.md#workflow-3-archive-system)

### Web Design
1. Generate tidal grids as backgrounds
2. Create sprite-based icons
3. Use marks for navigation
4. Update dynamically with real-time data

[→ See Workflow](docs/workflows.md#workflow-4-web-backgrounds)

## 🛠️ Technical Details

**Crafting Table:**
- Built with vanilla HTML, CSS, JavaScript
- No frameworks or dependencies
- No build process required
- Works offline (except tidal data fetching)
- Responsive design, mobile-friendly

**Design Tokens:**
- JSON format following W3C Design Tokens spec
- Importable in CSS, JS, design tools
- Semantic naming convention
- Versioned for change management

**Data Sources:**
- UK Environment Agency Flood Monitoring API (tidal data)
- Port of Felixstowe vessel tracking (ship data)
- Graceful fallback to simulated data

## 🎓 Learning Path

**Week 1: Understanding**
- Day 1-2: Read brand guidelines
- Day 3-4: Explore design tokens
- Day 5: Try each tool in Crafting Table

**Week 2: Practicing**
- Day 1-2: Follow workflow tutorials
- Day 3-4: Generate assets for real project
- Day 5: Experiment with combinations

**Week 3: Mastering**
- Day 1-2: Create full compositions
- Day 3-4: Implement in design software
- Day 5: Teach someone else the system

## 🤝 Contributing

This is a living system. To contribute:

1. **For design additions**: Open an issue proposing the change
2. **For tool improvements**: Fork and submit pull request
3. **For documentation**: Edit markdown files and PR
4. **For taxonomy extensions**: Propose in issue with examples

## 📋 Maintenance

**Design Tokens:** Review quarterly, update as needed
**Crafting Table:** Fix bugs as reported, add features as requested
**Documentation:** Keep synchronized with tool updates
**Taxonomy:** Evolve based on community needs

## 📄 License

MIT License - See individual components for specific terms

## 🌍 Location

**Felixstowe, Suffolk, UK**
- Coordinates: 52.06°N, 1.35°E
- UK's largest container port
- Coastal town with rich maritime heritage

## 📞 Support

- **Technical issues**: See tool documentation
- **Design questions**: See brand guidelines
- **General questions**: Open an issue on GitHub

---

## Version

**Current Release:** 1.0.0

- **Design Tokens:** 1.0.0
- **Crafting Table:** 1.0.0
- **Taxonomy:** 1.0.0
- **Documentation:** 1.0.0

---

**Built for:** Digital arts organisation, Felixstowe, UK
**Philosophy:** Tech-first, tool-based approach to visual identity
**Core Concept:** Flexible grids meeting fluid maritime data

---

## Quick Links

- 🎨 [Launch Crafting Table](tools/crafting-table/index.html)
- 📘 [Brand Guidelines](docs/brand-guidelines.md)
- 🏷️ [Taxonomy System](docs/taxonomy.md)
- 🎬 [Workflows](docs/workflows.md)
- 🎨 [Design Tokens](design-tokens/)

**Start creating!** 🌊
