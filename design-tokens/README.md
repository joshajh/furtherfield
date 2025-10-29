# Design Tokens

Design tokens for the Furtherfield visual identity system. These tokens define the foundational design decisions that create consistency across all digital and physical materials.

## What Are Design Tokens?

Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes. They act as a single source of truth for design decisions.

## Token Categories

### Colors (`colors.json`)

Maritime-inspired color palette based on Felixstowe's coastal environment:

**Brand Colors:**
- Primary: Deep maritime blue (#0a2f51)
- Secondary: Ocean blue (#137da0)
- Accent: Light maritime blue (#58b3d1)

**Thematic Palettes:**
- **Sea**: Blues from deep ocean to sky
- **Shore**: Sand and earth tones
- **Maritime**: Industrial port colors
- **Flora**: Greens from coastal vegetation
- **Sunset**: Warm oranges and yellows

**Semantic Colors:**
- Content type colors (article, event, artwork, exhibition, project, archive)
- Neutral grays (50-900 scale)

### Typography (`typography.json`)

**Font Families:**
- Sans: System font stack for UI and body text
- Mono: Monospace for technical content and code

**Font Sizes:**
- Scale from xs (12px) to 4xl (40px)
- Base size: 16px (1rem)

**Font Weights:**
- Regular (400), Medium (500), Semibold (600), Bold (700)

**Line Heights:**
- Tight (1.25) for headings
- Normal (1.5) for UI
- Relaxed (1.6) for body text
- Loose (1.8) for long-form content

### Spacing (`spacing.json`)

**Spacing Scale:**
- xs (4px) to 3xl (64px)
- Based on 4px/8px grid system

**Asset Sizes:**
- Sprite: 64px
- Mark: 128px
- Small: 400px
- Standard: 800px
- Large: 1600px

**Border Radius:**
- sm (4px) to full (circular)

## Usage

### In CSS

```css
:root {
  --color-primary: #0a2f51;
  --color-secondary: #137da0;
  --spacing-md: 16px;
  --font-size-base: 1rem;
}
```

### In JavaScript

```javascript
import colors from './design-tokens/colors.json';
const primaryColor = colors.colors.brand.primary.value;
```

### In Design Tools

Import JSON files into Figma, Sketch, or Adobe XD using design token plugins.

## Token Format

Tokens follow the [W3C Design Tokens Community Group](https://design-tokens.github.io/community-group/) specification:

```json
{
  "token-name": {
    "value": "actual-value",
    "type": "token-type",
    "description": "human-readable description"
  }
}
```

## Extending Tokens

To add new tokens:

1. Add to appropriate JSON file
2. Follow existing naming conventions
3. Include `value`, `type`, and `description`
4. Document in this README
5. Update dependent systems (Crafting Table, documentation)

## Integration

These tokens are used by:

- **Crafting Table** (`tools/crafting-table/`): Color palettes, sizing
- **Documentation** (`docs/`): Brand guidelines
- **Website/Applications**: Consistent styling

## Version

Current version: **1.0.0**

Tokens follow semantic versioning:
- Major: Breaking changes to token structure
- Minor: New tokens added
- Patch: Documentation or value corrections

## Related

- [Crafting Table](../tools/crafting-table/): Generative design tools
- [Brand Guidelines](../docs/brand-guidelines.md): Full brand documentation
