# Content Taxonomy

A visual classification system for organizing and encoding content metadata.

## Overview

The Furtherfield taxonomy provides a structured way to classify content using geometric marks. Each mark visually encodes:
1. **Content Type** (shape)
2. **Primary Tags** (position markers)
3. **Attributes** (style modifiers)

This creates a system that is both human-readable and machine-processable, suitable for physical and digital archives.

## Content Types

Content types are represented by distinct geometric shapes:

### Article (Square)
**Shape:** Square
**Color:** Blue (#2563eb)

**Definition:** Written content including blog posts, essays, reports, and editorial pieces.

**Examples:**
- Blog posts
- Essays and long-form writing
- Research reports
- Reviews and critiques
- Interviews

**When to use:** Any primarily text-based content meant for reading.

---

### Event (Circle)
**Shape:** Circle
**Color:** Red (#dc2626)

**Definition:** Time-based gatherings, workshops, performances, and happenings.

**Examples:**
- Workshop sessions
- Performances and screenings
- Opening receptions
- Talks and lectures
- Online events and webinars

**When to use:** Anything with a specific date/time that people attend.

---

### Artwork (Triangle)
**Shape:** Triangle
**Color:** Purple (#7c3aed)

**Definition:** Individual creative works including digital art, installations, and commissions.

**Examples:**
- Digital artworks
- Installations
- Commissioned pieces
- Net art projects
- Sound works
- Video art

**When to use:** Discrete creative outputs by individual or collaborative artists.

---

### Exhibition (Hexagon)
**Shape:** Hexagon
**Color:** Green (#059669)

**Definition:** Curated collections of artworks or materials, presented together.

**Examples:**
- Gallery exhibitions
- Online exhibitions
- Themed collections
- Retrospectives
- Curatorial projects

**When to use:** When multiple works are presented together with curatorial framing.

---

### Project (Pentagon)
**Shape:** Pentagon
**Color:** Orange (#ea580c)

**Definition:** Long-term initiatives, research programs, and ongoing collaborations.

**Examples:**
- Multi-year research projects
- Community initiatives
- Residency programs
- Partnerships and collaborations
- Educational programs

**When to use:** Extended activities with multiple components and outcomes.

---

### Archive (Octagon)
**Shape:** Octagon
**Color:** Gray (#4b5563)

**Definition:** Historical materials, documentation, and preserved records.

**Examples:**
- Historical documents
- Past event documentation
- Preserved artworks
- Oral histories
- Digital preservation projects

**When to use:** Material preserved for historical/research purposes.

---

## Primary Tags

Primary tags indicate the main theme or domain of the content. They are represented by position markers on the mark:

### Digital (Top Marker)
**Position:** Top
**Glyph:** Circuit

**Definition:** Content focused on technology, digital culture, net art, and online communities.

**Examples:**
- Net art projects
- Technology discussions
- Digital tools and platforms
- Online communities
- Software and code art

---

### Environmental (Right Marker)
**Position:** Right
**Glyph:** Leaf

**Definition:** Content related to nature, ecology, sustainability, and climate.

**Examples:**
- Environmental art
- Ecology research
- Climate activism
- Sustainable practices
- Nature-based work

---

### Community (Bottom Marker)
**Position:** Bottom
**Glyph:** People

**Definition:** Content involving participation, collaboration, and social practice.

**Examples:**
- Participatory projects
- Community workshops
- Social practice art
- Collective activities
- Public engagement

---

### Historical (Left Marker)
**Position:** Left
**Glyph:** Anchor

**Definition:** Content examining history, heritage, memory, and archival practices.

**Examples:**
- Historical research
- Archive projects
- Heritage work
- Memory projects
- Retrospectives

---

## Attributes

Attributes are secondary characteristics that modify the content type. They are represented by style changes to the mark:

### Interactive (Outlined)
**Modifier:** Outlined (unfilled shape)

**Definition:** Content that requires participation, responds to input, or is user-driven.

**Examples:**
- Interactive installations
- Responsive web works
- Games and playable media
- Audience-participatory events

---

### Experimental (Dotted)
**Modifier:** Dotted border

**Definition:** Research-based, exploratory, or process-oriented content.

**Examples:**
- Research projects
- Prototypes and works-in-progress
- Experimental methodologies
- Speculative design

---

### Collaborative (Composite)
**Modifier:** Inner shape (layered)

**Definition:** Content created by multiple people or organizations working together.

**Examples:**
- Co-created artworks
- Partnership projects
- Collective initiatives
- Multi-author works

---

### Ongoing (Animated) *
**Modifier:** Animated or pulsing (digital only)

**Definition:** Long-term, iterative, or continuous content.

**Examples:**
- Living documents
- Ongoing research
- Continuous projects
- Iterative development

\* *Currently represented in metadata only; visual implementation coming soon*

---

## Using the System

### Creating a Mark

1. **Identify content type** → Select shape
2. **Identify primary tags** (up to 4) → Add position markers
3. **Identify attributes** (unlimited) → Apply style modifiers
4. **Generate mark** using [Mark Generator](../tools/crafting-table/apps/mark-generator/)
5. **Export SVG + JSON metadata**

### Example Classification

**Content:** "Coastal Data Observatory" - A collaborative art project using sensors to monitor coastal erosion, with an online dashboard showing real-time data.

**Classification:**
- **Type:** Project (Pentagon) - it's an ongoing initiative
- **Tags:** Environmental (right marker) + Digital (top marker)
- **Attributes:** Collaborative (composite) + Interactive (outlined) + Ongoing (metadata)

**Result:** A composite outlined pentagon with markers at the top and right positions.

### Reading a Mark

To decode a mark:

1. **Look at shape** → Identifies content type
2. **Check for position markers** → Shows primary themes (up to 4)
3. **Notice style** → Reveals attributes
4. **Scan metadata** (if available) → Full details and unique ID

With practice, marks become instantly recognizable and create a shared visual language across the community.

## Implementation

### Physical Archives
- Print marks on labels, folders, or directly on materials
- Use consistent size (128px/5cm recommended)
- Include legend poster in archive space
- Add unique ID below mark for database linking

### Digital Systems
- Embed marks in file thumbnails
- Use marks as filter icons in databases
- Include marks in document headers
- Export metadata JSON for searchability

### Wayfinding
- Use marks on signage to indicate content type
- Color-code spaces by primary tag
- Create consistency across physical and digital

### Documentation
- Add marks to publication covers
- Use in table of contents for quick scanning
- Include in headers of web pages
- Integrate into email templates

## Extending the System

To add new content types, tags, or attributes:

1. **Propose addition** with clear definition and examples
2. **Choose visual representation** that fits the system
3. **Update** `tools/crafting-table/shared/config.js`
4. **Document** in this file
5. **Test** with community for clarity
6. **Release** with updated version number

## Version

Current taxonomy version: **1.0.0**

Changes follow semantic versioning:
- Major: Breaking changes to core types
- Minor: New types, tags, or attributes added
- Patch: Clarifications and corrections

---

## Related Resources

- [Mark Generator](../tools/crafting-table/apps/mark-generator/) - Create marks
- [Brand Guidelines](brand-guidelines.md) - Visual usage
- [Design Tokens](../design-tokens/colors.json) - Content type colors
