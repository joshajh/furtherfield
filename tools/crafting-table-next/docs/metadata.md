# Metadata System Documentation

## Overview

Crafting Table implements a comprehensive metadata encoding system to capture complete provenance data for all generated assets. This enables future programmatic access and novel interfaces for exploring and displaying the assets.

## Purpose

The metadata system future-proofs all generated assets by:

- **Capturing complete generation parameters** - Every setting, slider value, and user choice is recorded
- **Preserving data source information** - Live tidal and shipping data that influenced the generation is stored
- **Enabling programmatic access** - Metadata can be read and processed by other systems
- **Supporting novel interfaces** - Future interfaces can leverage the metadata to create unique visualizations and interactions
- **Maintaining provenance** - Each asset has a complete audit trail of how it was created

## Metadata Structure

All assets include standardized metadata with the following structure:

```typescript
{
  // Unique identifier (format: ff-{timestamp}-{random})
  id: "ff-1730224891234-x8k2p9w",

  // Which tool generated this asset
  app: "grid-generator",

  // Schema version for future compatibility
  version: "2.0.0",

  // ISO 8601 timestamp of generation
  timestamp: "2025-10-29T17:30:45.123Z",

  // Creator attribution
  creator: "Crafting Table",

  // License information
  license: "CC BY-SA 4.0",

  // Taxonomy classification (optional, used by some tools)
  taxonomy: {
    contentType: "article",
    tags: ["digital", "public"]
  },

  // Tool-specific parameters
  parameters: {
    // Varies by tool - see tool-specific sections below
  },

  // Live data source information (optional, when applicable)
  dataSource: {
    // Varies by data type - see data source sections below
  }
}
```

## Storage Methods

### SVG Files

SVG files embed metadata using the standards-compliant `<metadata>` element:

```xml
<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/"
            xmlns:cc="http://creativecommons.org/ns#"
            xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
{
  "id": "ff-1730224891234-x8k2p9w",
  "app": "grid-generator",
  ...
}
  </metadata>
  <!-- SVG content -->
</svg>
```

### PNG Files

PNG files are accompanied by a companion `.json` file with the same base filename:

- Image: `grid-2025-10-29T17-30-45-tidal.png`
- Metadata: `grid-2025-10-29T17-30-45-tidal.json`

Both files are downloaded automatically when the user exports a PNG.

## Data Source Types

### Tidal Data

When a tool uses live tidal data from the UK Environment Agency:

```typescript
dataSource: {
  type: "tidal",
  station: "Harwich",
  stationId: "E71439",
  level: 2.34,
  unit: "mAOD",
  coordinates: {
    lat: 51.948,
    long: 1.292
  },
  timestamp: "2025-10-29T17:25:00.000Z"
}
```

### Ship Movement Data

When a tool uses simulated ship movement data:

```typescript
dataSource: {
  type: "ships",
  total: 12,
  arrivals: 7,
  departures: 5,
  flow: 2,
  timestamp: "2025-10-29T17:25:00.000Z"
}
```

## Tool-Specific Parameters

### Grid Generator

```typescript
parameters: {
  gridSize: 20,          // Number of grid divisions
  waveAmplitude: 15,     // Wave height in pixels
  waveFrequency: 2.3     // Wave cycles across the grid
}
```

### Mark Generator

```typescript
parameters: {
  contentType: "article",
  selectedTags: ["digital", "public"]
}
```

### Social Graphics Generator

```typescript
parameters: {
  format: "square",           // "square" | "portrait"
  width: 1080,
  height: 1080,
  gridSize: 15,
  waveAmount: 20,
  palette: "monochrome",
  colorMode: "gradient",      // "gradient" | "solid"
  mainText: "Event Title",
  textSize: 48,
  textColor: "#1f2937",
  footerStyle: "text"         // "text" | "numeric"
}
```

### Colorist

```typescript
parameters: {
  palette: "monochrome",
  intensity: 50,              // 0-100
  originalFilename: "image.jpg"
}
```

### Sprite Generator

```typescript
parameters: {
  spriteType: "maritime",     // "person" | "flora" | "fauna" | "maritime"
  complexity: 5,              // 2-7
  colorDensity: 50,           // 20-80
  spriteSize: 64,
  pixelSize: 8
}
```

### Compositor

```typescript
parameters: {
  canvasSize: 800,
  layerCount: 3,
  layers: [
    {
      name: "background.png",
      opacity: 100,
      visible: true
    },
    {
      name: "overlay.png",
      opacity: 75,
      visible: true
    }
  ]
}
```

## Programmatic Access

### Reading SVG Metadata

```typescript
import { extractSVGMetadata } from '@/lib/metadata'

// From SVG string
const svgString = await fetch('/path/to/file.svg').then(r => r.text())
const metadata = extractSVGMetadata(svgString)

console.log(metadata.id)           // "ff-1730224891234-x8k2p9w"
console.log(metadata.app)          // "grid-generator"
console.log(metadata.dataSource)   // Tidal or ship data
```

### Reading Companion JSON

```typescript
import { readCompanionJSON } from '@/lib/metadata'

// From file input
const fileInput = document.querySelector('input[type="file"]')
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0]
  const metadata = await readCompanionJSON(file)

  console.log(metadata.parameters)   // Tool-specific parameters
  console.log(metadata.dataSource)   // Live data snapshot
})
```

## Future Possibilities

The comprehensive metadata system enables numerous future applications:

### Archive Interfaces
- Timeline view showing how tidal/shipping data affected visual outputs over time
- Search and filter assets by generation parameters
- Compare assets created under different conditions

### Data Visualization
- Plot tidal levels against wave amplitude in generated grids
- Visualize the relationship between ship movements and visual patterns
- Create "data portraits" showing maritime activity through visual assets

### Regeneration & Variation
- Recreate assets with different parameters but same data source
- Generate variations by adjusting individual parameters
- Batch process assets with programmatic parameter changes

### Machine Learning
- Train models to predict visual outcomes from maritime data
- Generate new patterns based on historical data correlations
- Classify and cluster assets by their generation characteristics

### Interactive Experiences
- Allow users to "scrub through time" seeing how an asset would look at different tide levels
- Create responsive installations that regenerate visuals based on current maritime conditions
- Build APIs that serve assets matching specific criteria

## Implementation Details

### Metadata Utilities

The metadata system is implemented in `/lib/metadata.ts` with these key functions:

- `generateAssetId()` - Creates unique identifiers
- `createAssetMetadata()` - Generates metadata objects
- `embedSVGMetadata()` - Embeds metadata in SVG elements
- `extractSVGMetadata()` - Extracts metadata from SVG strings
- `createCompanionJSON()` - Creates JSON files for PNG exports
- `readCompanionJSON()` - Reads metadata from JSON files

### Export Integration

Export functions in both `/lib/svg-utils.ts` and `/lib/canvas-utils.ts` accept optional metadata parameters:

```typescript
// SVG exports
exportSVGFile(svgElement, filename, metadata)
exportSVGAsPNG(svgElement, filename, size, metadata)

// Canvas exports
downloadCanvasAsImage(canvas, filename, metadata)
```

## Best Practices

### For Users
- Keep metadata JSON files with their corresponding PNG images
- Use descriptive filenames to complement the metadata
- Archive the complete metadata for long-term preservation

### For Developers
- Always include all available parameters in metadata
- Capture data source information whenever live data is used
- Version the metadata schema for future compatibility
- Test metadata extraction to ensure all fields are accessible

## Schema Evolution

The metadata version field (`"2.0.0"`) allows for future schema changes:

- **Major version** - Breaking changes to structure
- **Minor version** - New fields added (backward compatible)
- **Patch version** - Bug fixes or clarifications

Future interfaces should check the version and handle different schemas appropriately.

## License & Attribution

All metadata includes:
- `creator: "Crafting Table"` - Attribution to the tool
- `license: "CC BY-SA 4.0"` - Creative Commons ShareAlike license

This ensures proper attribution while allowing reuse and remix under compatible licenses.
