# Furtherfield Brand Reference for Canva

Use this document to set up Canva templates that match the social-generator layouts.

---

## Color Palette

### Core Colors (Add to Canva Brand Kit)

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Dark** | `#0F0E0E` | 15, 14, 14 | Primary background, dark text |
| **Light Text** | `#F6F8FB` | 246, 248, 251 | Text on dark backgrounds |
| **Divider** | `#555659` | 85, 86, 89 | Borders, muted text |
| **Background Light** | `#F5F5F5` | 245, 245, 245 | Light backgrounds |
| **White** | `#FFFFFF` | 255, 255, 255 | Pure white |

### Brand Gradient (Primary)

| Position | Hex | RGB |
|----------|-----|-----|
| Start (Top) | `#BCE5F3` | 188, 229, 243 |
| End (Bottom) | `#D0D6FD` | 208, 214, 253 |

**CSS:** `linear-gradient(to bottom, #BCE5F3, #D0D6FD)`
**Canva Setup:** Create a vertical gradient from Sky Blue (#BCE5F3) to Lavender (#D0D6FD)

### Treatment Colors (Overlays & Accents)

| Name | Hex (Solid) | RGBA (Transparent) | Usage |
|------|-------------|-------------------|-------|
| **Acid** | `#C8FF00` | rgba(200, 255, 0, 0.85) | Callouts, highlights, primary accent |
| **Lemon** | `#F5EBB4` | rgba(245, 235, 180, 0.85) | Hover states, warm highlights |
| **Lavender** | `#DCC8DC` | rgba(220, 200, 220, 0.85) | Soft accents, tag backgrounds |
| **Dark Overlay** | `#8CA0B4` | rgba(140, 160, 180, 0.7) | Image overlays (cool) |
| **Light Overlay** | `#DCC8D2` | rgba(220, 200, 210, 0.6) | Image overlays (warm) |

### Content Type Colors (Taxonomy)

| Type | Hex | RGB |
|------|-----|-----|
| Event | `#DC2626` | 220, 38, 38 |
| Artwork | `#7C3AED` | 124, 58, 237 |
| Exhibition | `#059669` | 5, 150, 105 |
| Project | `#E8B339` | 232, 179, 57 |
| Article | `#3A7CA5` | 58, 124, 165 |
| Archive | `#4B5563` | 75, 85, 99 |

---

## Typography

### Body Text: Plus Jakarta Sans

**Canva alternatives:**
1. **Plus Jakarta Sans** (Available in Canva - use this)
2. **DM Sans** (Similar geometric sans)
3. **Inter** (Fallback)

**Weights:** 400 (Regular), 500 (Medium), 600 (Semibold)

### Display/Headlines: Rubik

**Canva alternatives:**
1. **Rubik** (Available in Canva - use this)
2. **Nunito** (Similar rounded sans)

**Weights:** 400, 500, 600, 700 (Bold)

### Monospace: Space Mono

**Canva alternatives:**
1. **Space Mono** (Recommended - closest to Geist Mono)
2. **IBM Plex Mono**
3. **Roboto Mono**

**Style Rules:**
- All caps / UPPERCASE
- Letter spacing: +2% to +5%
- Weight: Medium (500) or Semibold (600)

### Font Sizes (1080x1350 Instagram)

| Element | Size | Weight | Font | Style |
|---------|------|--------|------|-------|
| Main Headline | 72-96px | Bold | Rubik | Mixed case, italic on line 1 |
| Subhead/Tags | 24-32px | Medium | Space Mono | UPPERCASE |
| Body Text | 28-36px | Regular | Plus Jakarta Sans | Sentence case |
| Small Labels | 18-22px | Medium | Space Mono | UPPERCASE |

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
│   Line 1 (italic)        │  <- Rubik, large
│   Line 2                 │  <- Rubik, large
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
│  TAG LABEL      │  <- Space Mono, UPPERCASE
└─────────────────┘
```
- Border: 1px solid #0F0E0E
- Background: Transparent (hover: Lemon)
- Padding: 8px 14px
- Border radius: 4px
- Font: 14px Space Mono, UPPERCASE

### Callouts (Non-Interactive Highlights)

```
 CALLOUT TEXT   <- Acid yellow background
```
- Background: #C8FF00 (Acid)
- No border, no padding
- Font: 12-14px Space Mono, UPPERCASE
- Text color: #0F0E0E (Dark)

### Callout Underline (Alternative)

```
UNDERLINED TEXT
________________  <- Acid yellow underline
```
- 3px underline in #C8FF00
- Text color: #0F0E0E
- Font: Space Mono, UPPERCASE

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

## Quick Reference: Core Hex Codes

```
BACKGROUNDS & TEXT
Dark:               #0F0E0E
Light Text:         #F6F8FB
Divider Gray:       #555659
Background Light:   #F5F5F5
White:              #FFFFFF

BRAND GRADIENT
Gradient Start:     #BCE5F3
Gradient End:       #D0D6FD

TREATMENT COLORS
Acid Yellow:        #C8FF00
Lemon:              #F5EBB4
Lavender:           #DCC8DC
Dark Overlay:       #8CA0B4
Light Overlay:      #DCC8D2

CONTENT TYPES
Event Red:          #DC2626
Artwork Purple:     #7C3AED
Exhibition Green:   #059669
Project Gold:       #E8B339
Article Blue:       #3A7CA5
Archive Gray:       #4B5563
```

---

## Gradient Palette Sets

Six complementary palette sets for mixing and matching across social assets. Each palette contains three gradients, with each gradient having three color stops. All palettes work harmoniously together.

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
| 2 | 50% | `#E8DCA0` | 232, 220, 160 |
| 3 | 100% | `#DCC8DC` | 220, 200, 220 |

**CSS:** `linear-gradient(135deg, #F5EBB4 0%, #E8DCA0 50%, #DCC8DC 100%)`

**Individual Colors (Palette A):**
```
#BCE5F3  #D0D6FD  #E8E0F0
#BEA6B0  #FFFCB9  #F5EBB4
#E8DCA0  #DCC8DC
```

---

### Palette B: Acid Core (Primary Accent)

The signature acid yellow with complementary bright tones.

#### Gradient B1: Acid to Mint
| Stop | Position | Hex | RGB |
|------|----------|-----|-----|
| 1 | 0% | `#C8FF00` | 200, 255, 0 |
| 2 | 50% | `#B4FF66` | 180, 255, 102 |
| 3 | 100% | `#A0FFAA` | 160, 255, 170 |

**CSS:** `linear-gradient(135deg, #C8FF00 0%, #B4FF66 50%, #A0FFAA 100%)`

#### Gradient B2: Lemon to Acid
| Stop | Position | Hex | RGB |
|------|----------|-----|-----|
| 1 | 0% | `#FFFCB9` | 255, 252, 185 |
| 2 | 50% | `#E6FF66` | 230, 255, 102 |
| 3 | 100% | `#C8FF00` | 200, 255, 0 |

**CSS:** `linear-gradient(135deg, #FFFCB9 0%, #E6FF66 50%, #C8FF00 100%)`

#### Gradient B3: Acid to Sky
| Stop | Position | Hex | RGB |
|------|----------|-----|-----|
| 1 | 0% | `#C8FF00` | 200, 255, 0 |
| 2 | 50% | `#88FFCC` | 136, 255, 204 |
| 3 | 100% | `#BCE5F3` | 188, 229, 243 |

**CSS:** `linear-gradient(135deg, #C8FF00 0%, #88FFCC 50%, #BCE5F3 100%)`

**Individual Colors (Palette B):**
```
#C8FF00  #B4FF66  #A0FFAA
#FFFCB9  #E6FF66  #88FFCC
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

### Palette D: Electric Cyan (High Energy)

Vibrant cyan-forward palette for digital and tech-focused content.

#### Gradient D1: Cyan Flash
| Stop | Position | Hex | RGB |
|------|----------|-----|-----|
| 1 | 0% | `#00FFFF` | 0, 255, 255 |
| 2 | 50% | `#00D4FF` | 0, 212, 255 |
| 3 | 100% | `#00A8FF` | 0, 168, 255 |

**CSS:** `linear-gradient(135deg, #00FFFF 0%, #00D4FF 50%, #00A8FF 100%)`

#### Gradient D2: Cyan to Acid
| Stop | Position | Hex | RGB |
|------|----------|-----|-----|
| 1 | 0% | `#00FFFF` | 0, 255, 255 |
| 2 | 50% | `#66FF99` | 102, 255, 153 |
| 3 | 100% | `#C8FF00` | 200, 255, 0 |

**CSS:** `linear-gradient(135deg, #00FFFF 0%, #66FF99 50%, #C8FF00 100%)`

#### Gradient D3: Electric Twilight
| Stop | Position | Hex | RGB |
|------|----------|-----|-----|
| 1 | 0% | `#00D4FF` | 0, 212, 255 |
| 2 | 50% | `#7C6EE6` | 124, 110, 230 |
| 3 | 100% | `#D0D6FD` | 208, 214, 253 |

**CSS:** `linear-gradient(135deg, #00D4FF 0%, #7C6EE6 50%, #D0D6FD 100%)`

**Individual Colors (Palette D):**
```
#00FFFF  #00D4FF  #00A8FF
#66FF99  #7C6EE6
```

---

### Palette E: Neon Magenta (Bold Statements)

Hot pink and magenta tones for maximum impact.

#### Gradient E1: Hot Pink Burst
| Stop | Position | Hex | RGB |
|------|----------|-----|-----|
| 1 | 0% | `#FF00FF` | 255, 0, 255 |
| 2 | 50% | `#FF66B2` | 255, 102, 178 |
| 3 | 100% | `#FF99CC` | 255, 153, 204 |

**CSS:** `linear-gradient(135deg, #FF00FF 0%, #FF66B2 50%, #FF99CC 100%)`

#### Gradient E2: Magenta to Acid
| Stop | Position | Hex | RGB |
|------|----------|-----|-----|
| 1 | 0% | `#FF00FF` | 255, 0, 255 |
| 2 | 50% | `#FF66FF` | 255, 102, 255 |
| 3 | 100% | `#C8FF00` | 200, 255, 0 |

**CSS:** `linear-gradient(135deg, #FF00FF 0%, #FF66FF 50%, #C8FF00 100%)`

#### Gradient E3: Sunset Neon
| Stop | Position | Hex | RGB |
|------|----------|-----|-----|
| 1 | 0% | `#FF6B6B` | 255, 107, 107 |
| 2 | 50% | `#FF00FF` | 255, 0, 255 |
| 3 | 100% | `#A855F7` | 168, 85, 247 |

**CSS:** `linear-gradient(135deg, #FF6B6B 0%, #FF00FF 50%, #A855F7 100%)`

**Individual Colors (Palette E):**
```
#FF00FF  #FF66B2  #FF99CC
#FF66FF  #FF6B6B  #A855F7
```

---

### Palette F: Solarpunk (Futuristic Organic)

The full spectrum solarpunk gradient from the site, plus variations.

#### Gradient F1: Full Solarpunk
| Stop | Position | Hex | RGB |
|------|----------|-----|-----|
| 1 | 0% | `#C8FF00` | 200, 255, 0 |
| 2 | 40% | `#00FFA3` | 0, 255, 163 |
| 3 | 70% | `#00D4FF` | 0, 212, 255 |
| 4 | 100% | `#A855F7` | 168, 85, 247 |

**CSS:** `linear-gradient(135deg, #C8FF00 0%, #00FFA3 40%, #00D4FF 70%, #A855F7 100%)`

#### Gradient F2: Green to Purple
| Stop | Position | Hex | RGB |
|------|----------|-----|-----|
| 1 | 0% | `#00FFA3` | 0, 255, 163 |
| 2 | 50% | `#00D4FF` | 0, 212, 255 |
| 3 | 100% | `#A855F7` | 168, 85, 247 |

**CSS:** `linear-gradient(135deg, #00FFA3 0%, #00D4FF 50%, #A855F7 100%)`

#### Gradient F3: Acid to Purple
| Stop | Position | Hex | RGB |
|------|----------|-----|-----|
| 1 | 0% | `#C8FF00` | 200, 255, 0 |
| 2 | 50% | `#7C6EE6` | 124, 110, 230 |
| 3 | 100% | `#A855F7` | 168, 85, 247 |

**CSS:** `linear-gradient(135deg, #C8FF00 0%, #7C6EE6 50%, #A855F7 100%)`

**Individual Colors (Palette F):**
```
#C8FF00  #00FFA3  #00D4FF  #A855F7  #7C6EE6
```

---

### Mixing Palettes

These palettes are designed to combine. Recommended combinations:

| Content Type | Primary Gradient | Accent | Tag Background |
|--------------|------------------|--------|----------------|
| **Events & Announcements** | A1 (Sky to Lavender) | B1 Acid (#C8FF00) | A2 Mauve |
| **High-Energy Promo** | F1 (Full Solarpunk) | B1 Acid (#C8FF00) | D1 Cyan |
| **Tech / Digital** | D1 (Cyan Flash) | B2 (#C8FF00) | D3 Twilight |
| **Bold Statements** | E1 (Hot Pink) | B1 Acid (#C8FF00) | E3 Sunset |
| **Archive / Historical** | C1 (Driftwood) | C2 Sea Mist | C3 Lichen |
| **Nature / Environmental** | B3 (Acid to Sky) | B1 Acid (#C8FF00) | C2 Sea Mist |
| **Community / Warm** | A3 (Lemon Cream) | A2 Mauve | C1 Driftwood |
| **Futuristic** | F2 (Green to Purple) | D2 (#00FFFF) | F3 Acid Purple |

---

### All Gradients Quick Reference

```
PALETTE A - COASTAL DAWN (Core Brand)
A1: #BCE5F3 → #D0D6FD → #E8E0F0  (Sky to Lavender)
A2: #D0D6FD → #BEA6B0 → #FFFCB9  (Mauve Horizon)
A3: #F5EBB4 → #E8DCA0 → #DCC8DC  (Lemon Cream)

PALETTE B - ACID CORE (Primary Accent)
B1: #C8FF00 → #B4FF66 → #A0FFAA  (Acid to Mint)
B2: #FFFCB9 → #E6FF66 → #C8FF00  (Lemon to Acid)
B3: #C8FF00 → #88FFCC → #BCE5F3  (Acid to Sky)

PALETTE C - WEATHERED SHORE (Muted)
C1: #D2B48C → #B49664 → #8B7355  (Driftwood)
C2: #8CA0B4 → #A0B0C0 → #C0D0E0  (Sea Mist)
C3: #DCC8D2 → #C8B8C0 → #B0A0A8  (Lichen Stone)

PALETTE D - ELECTRIC CYAN (High Energy)
D1: #00FFFF → #00D4FF → #00A8FF  (Cyan Flash)
D2: #00FFFF → #66FF99 → #C8FF00  (Cyan to Acid)
D3: #00D4FF → #7C6EE6 → #D0D6FD  (Electric Twilight)

PALETTE E - NEON MAGENTA (Bold)
E1: #FF00FF → #FF66B2 → #FF99CC  (Hot Pink Burst)
E2: #FF00FF → #FF66FF → #C8FF00  (Magenta to Acid)
E3: #FF6B6B → #FF00FF → #A855F7  (Sunset Neon)

PALETTE F - SOLARPUNK (Futuristic)
F1: #C8FF00 → #00FFA3 → #00D4FF → #A855F7  (Full Solarpunk)
F2: #00FFA3 → #00D4FF → #A855F7  (Green to Purple)
F3: #C8FF00 → #7C6EE6 → #A855F7  (Acid to Purple)
```

---

### All Individual Colors (50+ Total)

Copy these into your Canva Brand Kit for maximum flexibility:

```
CORE COLORS
#0F0E0E  #F6F8FB  #555659  #F5F5F5  #FFFFFF

TREATMENT COLORS
#C8FF00  #F5EBB4  #DCC8DC  #8CA0B4  #DCC8D2

CONTENT TYPE COLORS
#DC2626  #7C3AED  #059669  #E8B339  #3A7CA5  #4B5563

PALETTE A (Coastal Dawn)
#BCE5F3  #D0D6FD  #E8E0F0  #BEA6B0  #FFFCB9  #E8DCA0

PALETTE B (Acid Core)
#C8FF00  #B4FF66  #A0FFAA  #E6FF66  #88FFCC

PALETTE C (Weathered Shore)
#D2B48C  #B49664  #8B7355  #8CA0B4  #A0B0C0  #C0D0E0  #C8B8C0  #B0A0A8

PALETTE D (Electric Cyan)
#00FFFF  #00D4FF  #00A8FF  #66FF99  #7C6EE6

PALETTE E (Neon Magenta)
#FF00FF  #FF66B2  #FF99CC  #FF66FF  #FF6B6B  #A855F7

PALETTE F (Solarpunk)
#00FFA3
```

---

## Canva Brand Kit Setup Checklist

- [ ] Add core colors (5 colors)
- [ ] Add treatment colors (5 colors)
- [ ] Add content type colors (6 colors)
- [ ] Add Palette A colors (6 colors)
- [ ] Add Palette B colors (5 colors)
- [ ] Add Palette C colors (8 colors)
- [ ] Add Palette D colors (5 colors)
- [ ] Add Palette E colors (6 colors)
- [ ] Add Palette F colors (1 color - others shared)
- [ ] Create gradient elements for each of the 18 gradients
- [ ] Add Plus Jakarta Sans as body font
- [ ] Add Rubik as headline font
- [ ] Add Space Mono as monospace font
- [ ] Create tag component (save as element)
- [ ] Create callout component (save as element)
- [ ] Save noise/grain texture overlay

---

## Export Settings

- Format: PNG for best quality
- JPG at 92% quality for smaller file size
- Ensure text is sharp (no compression artifacts on small text)
