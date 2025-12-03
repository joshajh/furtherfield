# Design Tokens

Design tokens for the Furtherfield visual identity system. Extracted from the marketing website and Figma keystones to ensure consistency across all applications in this monorepo.

**Version:** 3.0.0

## Sources

Tokens in this directory are extracted from:
- **Marketing Site** (`/marketing`) - CSS custom properties and Tailwind classes
- **Figma Keystones** - [Furtherfield Keystones](https://www.figma.com/design/6BZ27OVK26MpFCOVgrPahF/Furtherfield-keystones)

## Token Files

### Colors (`colors.json`)

**Primitive Colors:**
- `black`: #0F0E0E - Primary dark color
- `white`: #FFFFFF - Pure white
- `gray.100-600`: Light to dark grays for text and backgrounds
- `blue.100-600`: Sky blue to deep ocean
- `purple.100`: Lavender for gradient
- `yellow.100-400`: Pale sunshine to golden
- `green.100-400`: Flora greens

**Semantic Colors:**
- `background.dark/light/white/card`: Background variants
- `text.light/dark/muted`: Text colors
- `border.divider`: Divider lines
- `accent.yellow/blue`: Accent colors
- `content-types.*`: Colors for event, artwork, exhibition, project, archive

**Brand Gradient:**
- `gradient.brand.start`: #BCE5F3 (sky blue)
- `gradient.brand.end`: #D0D6FD (lavender)

### Typography (`typography.json`)

**Font Families:**
- `sans`: Geist Sans - Primary UI font
- `mono`: Geist Mono - Code and technical content
- `serif`: Instrument Serif - Emphasis and accents
- `display`: Playfair Display - Headings
- `displayAlt`: P22 Mackinac Pro - Hero text
- `label`: Instrument Sans - Labels and tags

**Font Sizes:**
- Scale from `xs` (10px) to `10xl` (140px)
- Base size: 16px

**Text Styles (pre-composed):**
- `heroDisplay`: Large hero text (120px, P22 Mackinac Pro)
- `sectionLabel`: Tags and labels (40px, Instrument Sans condensed)
- `heading1-3`: Heading hierarchy
- `body`, `bodyLarge`: Body text styles
- `label`, `navigation`, `code`: Utility styles

### Spacing (`spacing.json`)

**Spacing Scale:**
- 4px base unit, scale from 0 to 128px
- Key value: `2.5` (10px) - base container spacing

**Semantic Spacing:**
- `container`: 10px (base), 50px (large)
- `sectionY.small/medium/large`: Vertical section padding
- `sectionX.small/medium/large`: Horizontal section padding
- `gap.xs-2xl`: Flex/grid gaps

**Border Radius:**
- `lg`: 8px - Default card radius
- `xl`: 12px - Figma component radius
- `full`: Circular/pill

**Z-Index:**
- `decoration`: 30
- `sprites`: 40
- `sticky`: 50
- `cursor`: 9999

**Animation:**
- Duration: fast (200ms), normal (300ms), slow (500ms)
- Easing: linear, easeOut, easeInOut

## Usage

### CSS Custom Properties

Each token file includes a `css.variables` section with ready-to-use CSS variables:

```css
:root {
  /* From colors.json */
  --color-bg-dark: #0F0E0E;
  --color-text-light: #F6F8FB;
  --color-gradient-start: #BCE5F3;
  --color-gradient-end: #D0D6FD;

  /* From typography.json */
  --font-sans: Geist Sans, ui-sans-serif, system-ui, sans-serif;
  --font-display: Playfair Display, ui-serif, Georgia, serif;

  /* From spacing.json */
  --spacing-container: 10px;
  --radius-card: 8px;
}
```

### Tailwind CSS

Each token file includes a `tailwind.extend` section for `tailwind.config.ts`:

```typescript
// tailwind.config.ts
import colors from '../design-tokens/colors.json';
import typography from '../design-tokens/typography.json';
import spacing from '../design-tokens/spacing.json';

export default {
  theme: {
    extend: {
      ...colors.tailwind.extend,
      ...typography.tailwind.extend,
      ...spacing.tailwind.extend,
    },
  },
};
```

### JavaScript/TypeScript

Import tokens directly:

```typescript
import colors from '@/design-tokens/colors.json';
import typography from '@/design-tokens/typography.json';
import spacing from '@/design-tokens/spacing.json';

// Access primitive values
const darkBg = colors.colors.primitive.black.value; // "#0F0E0E"

// Access semantic values
const primaryText = colors.colors.semantic.text.light.value; // "#F6F8FB"

// Access text styles
const heroStyle = typography.textStyles.heroDisplay;
```

### Brand Gradient

The signature Furtherfield gradient with noise overlay:

```css
.bg-gradient-brand {
  background: linear-gradient(to bottom, var(--color-gradient-start), var(--color-gradient-end));
  position: relative;
  isolation: isolate;
}

.bg-gradient-brand::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* noise texture */
  opacity: 0.6;
  mix-blend-mode: overlay;
  pointer-events: none;
}
```

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

## Design Principles

1. **Dark-first**: Primary UI uses dark background (#0F0E0E) with light text
2. **Gradient accents**: Brand identity through sky-to-lavender gradients
3. **Maritime typography**: Mix of serif (display) and clean sans-serif (body)
4. **Generous spacing**: 10px base unit with large section padding
5. **Soft corners**: 8-12px border radius on cards and components

## Updating Tokens

When design changes are made in Figma or the marketing site:

1. Extract new values from source
2. Update the appropriate JSON file
3. Increment version in `meta.version`
4. Update this README if new tokens are added
5. Verify changes don't break existing implementations
