# Brand Guidelines

## Overview

Furtherfield's visual identity bridges traditional grid-based design with the fluid, data-driven dynamics of maritime life. The system is both structured and organic, rooted in the specific place of Felixstowe while remaining universally accessible.

## Core Principles

### 1. Place-Based Design
Every visual element connects to Felixstowe's maritime environment:
- Grids influenced by tidal movements
- Colors drawn from sea, shore, and sky
- Rhythms that follow shipping patterns
- Forms that reference nautical shapes

### 2. Flexible Structure
The grid is fundamental but not rigid:
- Wavy lines maintain order while adding fluidity
- Variations emerge from real-time data
- Structure adapts without losing coherence
- Organic movement within systematic frameworks

### 3. Data-Driven Generation
Real-world data informs visual decisions:
- Tidal levels affect wave amplitude
- Ship movements influence pattern frequency
- Time stamps create unique moments
- Environmental conditions shape outputs

### 4. Modular Composition
Build complex designs from simple components:
- Each tool does one thing well
- Tools work independently or together
- Consistent data formats enable interoperability
- Systematic approach supports variety

## Visual Language

### Colors

**Brand Colors:**
- **Primary**: Deep Maritime Blue (#0a2f51)
  - Use for: Primary text, key UI elements, anchoring visuals
- **Secondary**: Ocean Blue (#137da0)
  - Use for: Interactive elements, links, highlights
- **Accent**: Light Maritime Blue (#58b3d1)
  - Use for: Accents, hover states, secondary information

**Thematic Palettes:**

**Sea Palette:**
- Use for: Main content, general applications
- From deep ocean (#0a2f51) to sky (#a4d4e6)
- Evokes depth, movement, fluidity

**Shore Palette:**
- Use for: Warm, earthy content, community topics
- Sand and earth tones (#8b6f47 to #f2e8dc)
- Evokes groundedness, accessibility, warmth

**Maritime Palette:**
- Use for: Technical content, infrastructure topics
- Industrial blues and grays
- Evokes industry, structure, functionality

**Flora Palette:**
- Use for: Environmental content, growing initiatives
- Greens from deep foliage to spring leaves
- Evokes growth, nature, vitality

**Sunset Palette:**
- Use for: Special events, celebrations, highlights
- Warm oranges and yellows
- Evokes energy, warmth, transformation

### Typography

**Font Family:**
- Primary: System font stack (ensures fast loading and native feel)
- Monospace: For technical content, code, IDs

**Font Sizes:**
- Display: 32-40px for hero text
- Headings: 20-24px
- Body: 16px base
- Small: 12-14px for captions and labels

**Hierarchy:**
- Use size, weight, and color to create clear hierarchy
- Maintain generous line height (1.6) for readability
- Limit line length to ~70 characters for body text

### Spacing

**Grid System:**
- Base unit: 4px
- Primary increments: 8px, 16px, 24px, 32px
- Maintain consistent spacing for visual rhythm
- Use generous whitespace - let designs breathe

### Shapes

**Content Type Shapes:**
Each content type has a signature shape (see [Taxonomy](taxonomy.md)):
- Square: Article
- Circle: Event
- Triangle: Artwork
- Hexagon: Exhibition
- Pentagon: Project
- Octagon: Archive

Use these shapes consistently across all materials to create visual language that can be decoded by the community.

## Using the Grid

The wavy grid is the foundation of the identity:

### When to Use
- Backgrounds for posters, web pages, documents
- Framing device for photographs
- Textural element in layouts
- Basis for pattern-making

### Best Practices
- Generate grids that reflect the moment (tide, time, event)
- Vary amplitude and frequency for different moods:
  - Low amplitude: calm, stable, corporate
  - High amplitude: dynamic, energetic, experimental
- Layer multiple grids with different opacities
- Use grids as clipping masks for images

### Combinations
- Grid + solid color: Clean, modern
- Grid + gradient: Atmospheric, dimensional
- Grid + noise: Textured, organic
- Grid + image: Integrated, layered

## Using Sprites

8-bit pixel art sprites create a playful, accessible visual language:

### When to Use
- Community member profiles
- Event icons and badges
- Navigation elements
- Trading card designs
- Social media avatars

### Categories
- **Person**: For profiles, team members, participants
- **Flora**: For environmental topics, gardens, nature
- **Fauna**: For wildlife, ecology, local species
- **Maritime**: For port, ships, nautical themes

### Best Practices
- Generate multiple variations and select best
- Use symmetrical sprites for more formal contexts
- Use asymmetrical for more organic, casual contexts
- Apply consistent color palette across sprite sets
- Export at multiple sizes for different uses

## Using Marks

Geometric marks encode content metadata visually:

### When to Use
- Archive organization
- Document classification
- Exhibition wayfinding
- Knowledge management systems
- Content tagging

### Encoding System
The mark's shape, position markers, and style modifiers encode:
1. **Shape** = Content type
2. **Position markers** = Primary tags
3. **Style modifiers** = Attributes

This creates a decodable visual language that serves both aesthetic and functional purposes.

### Best Practices
- Include legend when introducing marks to new audiences
- Use consistent mark sizes within a system
- Place marks in consistent locations (corner, header, etc.)
- Export metadata JSON with marks for digital systems
- Print marks on physical materials for unified system

## Composition

### Layouts

**Modular Grid:**
- Use 12-column grid for responsive layouts
- Break grid intentionally, not arbitrarily
- Align elements to grid for coherence
- Let wavy grid add organic counterpoint

**Hierarchy:**
- Largest element: Primary focus
- Group related elements with proximity
- Use whitespace to separate sections
- Guide eye with size, color, position

**Balance:**
- Asymmetric balance feels more dynamic
- Symmetric balance feels more stable
- Mix structured grids with organic elements
- Contrast hard edges with soft waves

### Layering

When compositing multiple elements:

1. **Background layer**: Grid, color, or gradient
2. **Content layer**: Main imagery or text
3. **Accent layer**: Sprites, marks, or decorative elements
4. **Overlay layer**: Tints, gradients, or additional grids

Use opacity to create depth and integrate layers.

## Applications

### Print Materials
- Posters: Large wavy grids with bold typography
- Publications: Marks for content classification
- Business cards: Small sprites or marks as identifiers
- Signage: Simple geometric marks for wayfinding

### Digital Materials
- Website: Real-time tidal grids as backgrounds
- Social media: Sprite-based avatars and icons
- Documentation: Marks for content organization
- Email: Simplified grids with brand colors

### Environmental
- Exhibition spaces: Large-scale grid projections
- Wayfinding: Mark-based navigation system
- Installations: Data-driven generative displays
- Signage: Consistent mark system

## Dos and Don'ts

### Do:
✓ Generate grids at meaningful moments (event times, key tides)
✓ Use consistent color palettes across a project
✓ Export at appropriate resolutions for medium
✓ Include metadata with digital assets
✓ Layer elements with intention
✓ Maintain generous whitespace
✓ Use taxonomy consistently

### Don't:
✗ Use low-quality raster exports when vector available
✗ Mix too many different palettes in one piece
✗ Ignore the grid system entirely
✗ Place marks without understanding their meaning
✗ Overuse effects (keep it clean)
✗ Forget to document generation parameters

## Tools

All visual elements should be created using:

- **[Crafting Table](../tools/crafting-table/)** - Official generative design tools
- **Design software** - Illustrator, Figma, etc. for post-processing
- **Design tokens** - For consistent values across platforms

## Accessibility

Ensure all designs meet accessibility standards:

- **Color contrast**: Minimum 4.5:1 for body text, 3:1 for large text
- **Readable type**: Minimum 16px for body text
- **Clear hierarchy**: Use multiple cues (size, weight, color)
- **Alt text**: Describe sprites and marks for screen readers
- **Semantic marks**: Include text labels alongside visual marks

## Updates

These guidelines evolve with the system. Current version: **1.0.0**

To propose changes:
1. Open an issue documenting the proposed change
2. Provide examples and rationale
3. Discuss with the team
4. Update guidelines and version number

---

For technical implementation details, see [Crafting Table documentation](../tools/crafting-table/README.md).

For systematic design values, see [Design Tokens](../design-tokens/).
