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

## Gradient Palette Sets

Three complementary palette sets for mixing and matching across social assets. Each palette contains three gradients, with each gradient having three color stops. All palettes are designed to work harmoniously together.

---

### Palette A: Coastal Dawn (Core Brand)

The primary brand palette used in the social-generator and website.

#### Gradient A1: Sky to Lavender (Primary Brand)
| Stop | Position | Hex | RGB |
|------|----------|-----|-----|
| 1 | 0% | `#BCE5F3` | 188, 229, 243 |
| 2 | 50% | `#D0D6FD` | 208, 214, 253 |
| 3 | 100% | `#E8E0F0` | 232, 224, 240 |

**CSS:** `linear-gradient(135deg, #BCE5F3 0%, #D0D6FD 50%, #E8E0F0 100%)`

#### Gradient A2: Mauve Horizon
| Stop | Position | Hex | RGB |
|------|----------|-----|-----|
| 1 | 0% | `#D0D6FD` | 208, 214, 253 |
| 2 | 50% | `#BEA6B0` | 190, 166, 176 |
| 3 | 100% | `#FFFCB9` | 255, 252, 185 |

**CSS:** `linear-gradient(135deg, #D0D6FD 0%, #BEA6B0 50%, #FFFCB9 100%)`

#### Gradient A3: Lemon Cream
| Stop | Position | Hex | RGB |
|------|----------|-----|-----|
| 1 | 0% | `#F5EBB4` | 245, 235, 180 |
| 2 | 50% | `#DCC896` | 220, 200, 150 |
| 3 | 100% | `#C8B480` | 200, 180, 128 |

**CSS:** `linear-gradient(135deg, #F5EBB4 0%, #DCC896 50%, #C8B480 100%)`

**Individual Colors (Palette A):**
```
#BCE5F3  #D0D6FD  #E8E0F0
#BEA6B0  #FFFCB9  #F5EBB4
#DCC896  #C8B480
```

---

### Palette B: Electric Flora (High Energy)

A vibrant palette for announcements and high-impact content.

#### Gradient B1: Acid Burst
| Stop | Position | Hex | RGB |
|------|----------|-----|-----|
| 1 | 0% | `#C8FF00` | 200, 255, 0 |
| 2 | 50% | `#A0FF50` | 160, 255, 80 |
| 3 | 100% | `#00FFA3` | 0, 255, 163 |

**CSS:** `linear-gradient(135deg, #C8FF00 0%, #A0FF50 50%, #00FFA3 100%)`

#### Gradient B2: Digital Sunset
| Stop | Position | Hex | RGB |
|------|----------|-----|-----|
| 1 | 0% | `#00D4FF` | 0, 212, 255 |
| 2 | 50% | `#7C6EE6` | 124, 110, 230 |
| 3 | 100% | `#A855F7` | 168, 85, 247 |

**CSS:** `linear-gradient(135deg, #00D4FF 0%, #7C6EE6 50%, #A855F7 100%)`

#### Gradient B3: Neon Meadow
| Stop | Position | Hex | RGB |
|------|----------|-----|-----|
| 1 | 0% | `#00FFA3` | 0, 255, 163 |
| 2 | 50% | `#50E0A0` | 80, 224, 160 |
| 3 | 100% | `#BCE5F3` | 188, 229, 243 |

**CSS:** `linear-gradient(135deg, #00FFA3 0%, #50E0A0 50%, #BCE5F3 100%)`

**Individual Colors (Palette B):**
```
#C8FF00  #A0FF50  #00FFA3
#00D4FF  #7C6EE6  #A855F7
#50E0A0
```

---

### Palette C: Weathered Shore (Muted & Organic)

An earthy palette for reflective content and archival material.

#### Gradient C1: Driftwood
| Stop | Position | Hex | RGB |
|------|----------|-----|-----|
| 1 | 0% | `#D2B48C` | 210, 180, 140 |
| 2 | 50% | `#B49664` | 180, 150, 100 |
| 3 | 100% | `#8B7355` | 139, 115, 85 |

**CSS:** `linear-gradient(135deg, #D2B48C 0%, #B49664 50%, #8B7355 100%)`

#### Gradient C2: Sea Mist
| Stop | Position | Hex | RGB |
|------|----------|-----|-----|
| 1 | 0% | `#8CA0B4` | 140, 160, 180 |
| 2 | 50% | `#A0B0C0` | 160, 176, 192 |
| 3 | 100% | `#C0D0E0` | 192, 208, 224 |

**CSS:** `linear-gradient(135deg, #8CA0B4 0%, #A0B0C0 50%, #C0D0E0 100%)`

#### Gradient C3: Lichen Stone
| Stop | Position | Hex | RGB |
|------|----------|-----|-----|
| 1 | 0% | `#DCC8D2` | 220, 200, 210 |
| 2 | 50% | `#C8B8C0` | 200, 184, 192 |
| 3 | 100% | `#B0A0A8` | 176, 160, 168 |

**CSS:** `linear-gradient(135deg, #DCC8D2 0%, #C8B8C0 50%, #B0A0A8 100%)`

**Individual Colors (Palette C):**
```
#D2B48C  #B49664  #8B7355
#8CA0B4  #A0B0C0  #C0D0E0
#DCC8D2  #C8B8C0  #B0A0A8
```

---

### Mixing Palettes

These palettes are designed to combine. Recommended combinations:

| Content Type | Primary Gradient | Accent | Tag Background |
|--------------|------------------|--------|----------------|
| **Events & Announcements** | A1 (Sky to Lavender) | B1 Acid (#C8FF00) | A2 Mauve |
| **High-Energy Promo** | B2 (Digital Sunset) | B1 Acid (#C8FF00) | A1 Sky |
| **Archive / Historical** | C1 (Driftwood) | C2 Sea Mist | C3 Lichen |
| **Nature / Environmental** | B3 (Neon Meadow) | B1 Acid (#C8FF00) | C2 Sea Mist |
| **Community / Warm** | A3 (Lemon Cream) | A2 Mauve | C1 Driftwood |

---

### All Gradients Quick Reference

```
PALETTE A - COASTAL DAWN
A1: #BCE5F3 → #D0D6FD → #E8E0F0  (Sky to Lavender)
A2: #D0D6FD → #BEA6B0 → #FFFCB9  (Mauve Horizon)
A3: #F5EBB4 → #DCC896 → #C8B480  (Lemon Cream)

PALETTE B - ELECTRIC FLORA
B1: #C8FF00 → #A0FF50 → #00FFA3  (Acid Burst)
B2: #00D4FF → #7C6EE6 → #A855F7  (Digital Sunset)
B3: #00FFA3 → #50E0A0 → #BCE5F3  (Neon Meadow)

PALETTE C - WEATHERED SHORE
C1: #D2B48C → #B49664 → #8B7355  (Driftwood)
C2: #8CA0B4 → #A0B0C0 → #C0D0E0  (Sea Mist)
C3: #DCC8D2 → #C8B8C0 → #B0A0A8  (Lichen Stone)
```

---

### All Individual Colors (27 Total)

Copy these into your Canva Brand Kit for maximum flexibility:

```
Palette A (Coastal Dawn):
#BCE5F3  #D0D6FD  #E8E0F0  #BEA6B0  #FFFCB9  #F5EBB4  #DCC896  #C8B480

Palette B (Electric Flora):
#C8FF00  #A0FF50  #00FFA3  #00D4FF  #7C6EE6  #A855F7  #50E0A0

Palette C (Weathered Shore):
#D2B48C  #B49664  #8B7355  #8CA0B4  #A0B0C0  #C0D0E0  #DCC8D2  #C8B8C0  #B0A0A8

Core (Always Available):
#0F0E0E  #F6F8FB  #555659
```

---

## Canva Brand Kit Setup Checklist

- [ ] Add core colors (#0F0E0E, #F6F8FB, #555659)
- [ ] Add Palette A colors (8 colors)
- [ ] Add Palette B colors (7 colors)
- [ ] Add Palette C colors (9 colors)
- [ ] Create gradient elements for each of the 9 gradients (save as reusable)
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
