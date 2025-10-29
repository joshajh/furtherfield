# Crafting Table - Next.js

Modern Next.js implementation of the Crafting Table micro-apps suite.

## Architecture

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with monochrome color scheme
- **Components**: shadcn/ui for consistent UI components
- **Language**: TypeScript for type safety

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at http://localhost:3000 (or next available port).

## Project Structure

```
app/
├── page.tsx                    # Home page with app grid
├── layout.tsx                  # Root layout
├── globals.css                 # Global styles with CSS variables
├── social-generator/           # Social media graphics tool
├── grid-generator/             # Wavy grid generator
├── colorist/                   # Color palette application
├── sprite-generator/           # 8-bit sprite creator
├── mark-generator/             # Taxonomy mark generator
└── compositor/                 # Multi-layer compositor

components/
└── ui/                         # shadcn/ui components

lib/
├── config.ts                   # Shared configuration
├── canvas-utils.ts             # Canvas rendering utilities
├── svg-utils.ts                # SVG rendering and export utilities
├── api.ts                      # External API integration (tidal data, etc.)
├── metadata.ts                 # Comprehensive metadata encoding system
└── utils.ts                    # General utilities

docs/
└── metadata.md                 # Metadata system documentation
```

## Features

### Social Graphics Generator (Complete)

The flagship tool for creating social media assets with:

- **5-Step Workflow**: Format → Grid → Colors → Content → Classification
- **Live Data Integration**: Real-time tidal data from UK Environment Agency
- **Monochrome Design**: Clean, professional grayscale aesthetic
- **Canvas-based**: High-quality PNG export at social media dimensions
- **Taxonomy System**: Content classification with visual encoding
- **Responsive Layout**: Sticky preview panel with scrollable controls

### Other Tools (All Complete)

- **Grid Generator**: Generate wavy grids influenced by live maritime data
- **Mark Generator**: Create geometric marks encoding content type and tags
- **Colorist**: Apply color palettes to existing images
- **Sprite Generator**: Generate 8-bit pixel art sprites procedurally
- **Compositor**: Layer multiple assets with opacity controls
- **Tide Table** (New): Upload assets and visualize historical maritime data from their original creation time

## New Features

### Metadata Preview

All tools now include an expandable metadata preview panel that shows:
- Live preview of what will be exported
- Formatted and raw JSON views
- Copy-to-clipboard functionality
- Real-time updates as parameters change

The metadata preview helps users understand exactly what provenance data is being captured with their assets.

### Tide Table Tool

A new experimental tool that enables temporal exploration of maritime data:

**How it works:**
1. Upload an existing asset (image, JSON, or file)
2. Extracts the original timestamp from:
   - EXIF data (for photos - when taken, created, or modified)
   - Crafting Table JSON metadata (for previously generated assets)
   - File system metadata (last modified date)
   - Manual input (user override)
3. Fetches historical tidal data from that moment in time
   - Real API data when available (UK Environment Agency)
   - Simulated data using harmonic models for older dates
4. Generates a grid that visualizes the maritime conditions

**Key features:**
- Timestamp confidence indicators (high/medium/low)
- Manual timestamp override
- Historical vs. simulated data transparency
- Complete dual metadata (original asset + generated grid)
- 4-step guided workflow

**Use cases:**
- Visualize the maritime "moment" of a photograph
- Create retrospective artworks tied to specific dates
- Build temporal archives of maritime conditions
- Generate grids from historically significant timestamps

## Metadata System

All exported assets include comprehensive metadata for future-proofing and programmatic access:

### What's Captured

- **Unique Identifiers**: Every asset has a unique ID for tracking and reference
- **Generation Parameters**: All settings, sliders, and user choices are recorded
- **Live Data Snapshots**: Complete tidal and shipping data that influenced the generation
- **Taxonomy Classification**: Content type and tag information where applicable
- **Timestamps**: ISO 8601 timestamps for temporal analysis
- **Provenance**: Creator, license, and tool version information

### Storage Methods

- **SVG Files**: Metadata embedded in standards-compliant `<metadata>` elements
- **PNG Files**: Companion `.json` files downloaded alongside images

### Future Possibilities

The metadata system enables:

- **Archive Interfaces**: Search, filter, and browse assets by generation parameters
- **Data Visualization**: Plot how maritime data affects visual outputs over time
- **Regeneration**: Recreate assets with different parameters but same data source
- **Machine Learning**: Train models on the relationship between data and visuals
- **Interactive Experiences**: Build responsive installations using live metadata

### Documentation

See [docs/metadata.md](docs/metadata.md) for complete documentation including:
- Metadata structure and schema
- Tool-specific parameters
- Programmatic access examples
- Best practices
- API reference

## Color Scheme

The Next.js version uses a monochrome color scheme with shades of gray for a clean, professional look:

- Background: White (#ffffff)
- Foreground: Dark Gray (#1f2937)
- Muted: Light Gray (#f9fafb)
- Border: Medium Gray (#d1d5db)

## Data Sources

- **Tidal Data**: UK Environment Agency Flood Monitoring API
- **Ship Movements**: Simulated (can be connected to real AIS data)
- **Location**: Felixstowe, UK (52.06°N, 1.35°E)

## Development Notes

- All micro-apps are client components (use 'use client')
- Canvas rendering is handled via refs and the CanvasRenderer class
- State management uses React hooks
- shadcn/ui components provide consistent styling

## License

CC BY-SA 4.0
