# Furtherfield Brand Reference for Canva

Use this document to set up Canva templates that match the social-generator layouts.

---

## Color Palette

### Primary Colors (Add to Canva Brand Kit)

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Dark** | `#0F0E0E` | 15, 14, 14 | Primary background, dark text |
| **Light Text** | `#F6F8FB` | 246, 248, 251 | Text on dark backgrounds |
| **Divider** | `#555659` | 85, 86, 89 | Borders, muted text |

### Brand Gradient

| Position | Hex | RGB |
|----------|-----|-----|
| Start (Top) | `#BCE5F3` | 188, 229, 243 |
| End (Bottom) | `#D0D6FD` | 208, 214, 253 |

**Canva Setup:** Create a vertical gradient from Sky Blue (#BCE5F3) to Lavender (#D0D6FD)

### Treatment Colors (Overlays & Accents)

| Name | Hex (Solid) | RGBA (Transparent) | Usage |
|------|-------------|-------------------|-------|
| **Acid** | `#C8FF00` | rgba(200, 255, 0, 0.85) | Callouts, highlights, primary accent |
| **Lemon** | `#F5EBB4` | rgba(245, 235, 180, 0.85) | Hover states, warm highlights |
| **Lavender** | `#DCC8DC` | rgba(220, 200, 220, 0.85) | Soft accents, tag backgrounds |
| **Dark Overlay** | `#8CA0B4` | rgba(140, 160, 180, 0.7) | Image overlays (cool) |
| **Light Overlay** | `#DCC8D2` | rgba(220, 200, 210, 0.6) | Image overlays (warm) |

---

## Typography

### Primary Font: Monospace

**Canva alternatives (closest matches):**
1. **Space Mono** (Recommended - very similar to Geist Mono)
2. **IBM Plex Mono**
3. **Roboto Mono**

**Style Rules:**
- All caps / UPPERCASE
- Letter spacing: +2% to +5%
- Weight: Medium (500) or Semibold (600)

### Display Font (Headlines)

**Canva alternatives:**
1. **Playfair Display** (Available in Canva)
2. **Lora** (Serif alternative)

### Font Sizes (1080x1350 Instagram)

| Element | Size | Weight | Style |
|---------|------|--------|-------|
| Main Headline | 72-96px | Bold | Mixed case, italic on line 1 |
| Subhead/Tags | 24-32px | Medium | UPPERCASE, monospace |
| Body Text | 28-36px | Regular | Sentence case |
| Small Labels | 18-22px | Medium | UPPERCASE, monospace |

---

## Layout Templates

### Canvas Size
- **Instagram Stories/Reels:** 1080 x 1920 px
- **Instagram Carousel:** 1080 x 1350 px (4:5)
- **Instagram Square:** 1080 x 1080 px

### Layout 1: Cover (Carousel Opener)

```
┌──────────────────────────┐
│   HEADER (gradient bg)   │  <- Brand gradient
│                          │
│   Line 1 (italic)        │  <- Serif font, large
│   Line 2                 │  <- Serif font, large
│                          │
├──────────────────────────┤
│  TAGS BAR (lavender)     │  <- Tag | Tag
├──────────────────────────┤
│  ACCENT BAR (lemon)      │  <- Supporting text
└──────────────────────────┘
```

### Layout 2: Event Card

```
┌──────────────────────────┐
│   HEADER (gradient bg)   │
│   Headline               │
│   Tags                   │
├──────────────────────────┤
│   BODY (lemon bg)        │
│   Event details          │
│   Date / Time / Location │
├──────────────────────────┤
│   IMAGE STRIP (dark)     │
│   Photo with overlay     │
└──────────────────────────┘
```

### Layout 3: Feature Image

```
┌──────────────────────────┐
│                          │
│   FULL IMAGE             │
│   (with color overlay)   │
│                          │
├──────────────────────────┤
│  ACCENT BAR (lemon)      │  <- Caption
├──────────────────────────┤
│  TAGS (acid bg)          │  <- Metadata
└──────────────────────────┘
```

### Layout 4: Split

```
┌─────────────┬────────────┐
│             │            │
│   IMAGE     │   TEXT     │
│   (dark     │   (gradient│
│   overlay)  │   bg)      │
│             │            │
│             │   Headline │
│             │   Body     │
│             │            │
└─────────────┴────────────┘
```

---

## Component Styles

### Tags (Interactive Elements)

```
┌─────────────────┐
│  TAG LABEL      │  <- Monospace, UPPERCASE
└─────────────────┘
```
- Border: 1px solid #0F0E0E
- Background: Transparent (hover: Lemon)
- Padding: 8px 14px
- Border radius: 4px
- Font: 14px monospace, UPPERCASE

### Callouts (Non-Interactive Highlights)

```
 CALLOUT TEXT   <- Acid yellow background
```
- Background: #C8FF00 (Acid)
- No border, no padding
- Font: 12-14px monospace, UPPERCASE
- Text color: #0F0E0E (Dark)

### Callout Underline (Alternative)

```
UNDERLINED TEXT
________________  <- Acid yellow underline
```
- 3px underline in #C8FF00
- Text color: #0F0E0E
- Font: Monospace, UPPERCASE

---

## Image Treatments

### Adding Grain/Noise Texture

In Canva:
1. Add your image
2. Overlay a semi-transparent texture (search "noise" or "grain")
3. Set blend mode to "Overlay" at 50-60% opacity

### Color Overlay

1. Add image
2. Add rectangle on top
3. Fill with treatment color (Dark, Light, Lemon, or Lavender)
4. Set transparency to match RGBA values above

---

## Quick Reference: Hex Codes for Copy/Paste

```
Primary Dark:       #0F0E0E
Light Text:         #F6F8FB
Divider Gray:       #555659

Gradient Start:     #BCE5F3
Gradient End:       #D0D6FD

Acid Yellow:        #C8FF00
Lemon:              #F5EBB4
Lavender:           #DCC8DC
Dark Overlay:       #8CA0B4
Light Overlay:      #DCC8D2
```

---

## Canva Brand Kit Setup Checklist

- [ ] Add all 5 primary hex colors
- [ ] Create gradient element (save as reusable)
- [ ] Add Space Mono as primary font
- [ ] Add Playfair Display as headline font
- [ ] Create tag component (save as element)
- [ ] Create callout component (save as element)
- [ ] Save noise/grain texture overlay

---

## Export Settings

- Format: PNG for best quality
- JPG at 92% quality for smaller file size
- Ensure text is sharp (no compression artifacts on small text)
