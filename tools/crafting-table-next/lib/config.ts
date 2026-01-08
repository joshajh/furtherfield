// Shared configuration for all micro-apps

export const FURTHERFIELD_CONFIG = {
  // Standard asset dimensions
  sizes: {
    standard: 800,
    small: 400,
    large: 1600,
    sprite: 64,
    mark: 128,
  },

  // Export formats
  formats: {
    svg: 'image/svg+xml',
    png: 'image/png',
    json: 'application/json',
  },

  // Felixstowe location data
  location: {
    name: 'Felixstowe',
    coords: { lat: 52.06, long: 1.35 },
    timezone: 'Europe/London',
  },

  // Content taxonomy
  taxonomy: {
    contentTypes: {
      article: { name: 'Article', shape: 'square', color: '#3a7ca5' },
      event: { name: 'Event', shape: 'circle', color: '#dc2626' },
      artwork: { name: 'Artwork', shape: 'triangle', color: '#7c3aed' },
      exhibition: { name: 'Exhibition', shape: 'hexagon', color: '#059669' },
      project: { name: 'Project', shape: 'pentagon', color: '#e8b339' },
      archive: { name: 'Archive', shape: 'octagon', color: '#4b5563' },
    },

    tags: {
      // Primary categories
      digital: { position: 'top', glyph: 'circuit' },
      environmental: { position: 'right', glyph: 'leaf' },
      community: { position: 'bottom', glyph: 'people' },
      historical: { position: 'left', glyph: 'anchor' },

      // Secondary attributes
      interactive: { modifier: 'outlined' },
      ongoing: { modifier: 'animated' },
      collaborative: { modifier: 'composite' },
      experimental: { modifier: 'dotted' },
    },
  },

  // Default color palettes (keeping for data visualization, but UI will be monochrome)
  palettes: {
    ocean: ['#0f3057', '#2e5a7d', '#3a7ca5', '#7fa8c9', '#a7c7e7', '#e5e7eb', '#f9fafb'],
    sunshine: ['#1f2937', '#4b5563', '#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb', '#f9fafb'],
    sea: ['#0f3057', '#3a7ca5', '#7fa8c9', '#9ca3af', '#e5e7eb'],
    shore: ['#1f2937', '#374151', '#4b5563', '#6b7280', '#9ca3af'],
    maritime: ['#0f3057', '#3a7ca5', '#7fa8c9', '#a7c7e7', '#d1d5db'],
    flora: ['#1f2937', '#374151', '#4b5563', '#6b7280', '#9ca3af'],
    monochrome: ['#1f2937', '#4b5563', '#9ca3af', '#e5e7eb', '#f9fafb'],
    sunset: ['#1f2937', '#4b5563', '#6b7280', '#9ca3af', '#e5e7eb'],
  },

  // Metadata structure
  assetMetadata: {
    version: '1.0',
    creator: 'Crafting Table',
    license: 'CC BY-SA 4.0',
  },

  // Brand treatment colors (from marketing design system)
  brandTreatments: {
    lavender: {
      name: 'Lavender',
      bg: 'rgba(220, 200, 220, 0.85)',
      solid: '#DCC8DC',
    },
    lime: {
      name: 'Acid Lime',
      bg: 'rgba(200, 255, 0, 0.85)',
      solid: '#C8FF00',
    },
    lemon: {
      name: 'Lemon',
      bg: 'rgba(245, 235, 180, 0.85)',
      solid: '#F5EBB4',
    },
    dark: {
      name: 'Dark',
      bg: 'rgba(140, 160, 180, 0.7)',
      solid: '#8CA0B4',
    },
    gradient: {
      name: 'Brand Gradient',
      start: '#BCE5F3',
      end: '#D0D6FD',
    },
  },

  // Instagram social layouts (1080x1350)
  instagramLayouts: {
    cover: {
      id: 'cover',
      name: 'Cover',
      description: 'Carousel opener with bold headline',
      regions: ['header', 'tags-bar', 'accent-bar'],
      defaults: { header: 'gradient', 'tags-bar': 'lavender', 'accent-bar': 'lemon' },
    },
    'event-card': {
      id: 'event-card',
      name: 'Event Card',
      description: 'Promote events with details',
      regions: ['header', 'body', 'image-strip'],
      defaults: { header: 'gradient', body: 'lemon', 'image-strip': 'dark' },
    },
    'info-stack': {
      id: 'info-stack',
      name: 'Info Stack',
      description: 'Information-dense text blocks',
      regions: ['headline-block', 'body-block', 'tags-block'],
      defaults: { 'headline-block': 'gradient', 'body-block': 'lemon', 'tags-block': 'lavender' },
    },
    'feature-image': {
      id: 'feature-image',
      name: 'Feature Image',
      description: 'Showcase photography or artwork',
      regions: ['accent-bar', 'tags'],
      defaults: { 'accent-bar': 'lemon', tags: 'lime' },
    },
    split: {
      id: 'split',
      name: 'Split',
      description: 'Equal image and text balance',
      regions: ['left-panel', 'right-panel'],
      defaults: { 'left-panel': 'dark', 'right-panel': 'gradient' },
    },
  },
} as const

export type ContentType = keyof typeof FURTHERFIELD_CONFIG.taxonomy.contentTypes
export type PaletteName = keyof typeof FURTHERFIELD_CONFIG.palettes
export type TagName = keyof typeof FURTHERFIELD_CONFIG.taxonomy.tags
export type TreatmentId = keyof typeof FURTHERFIELD_CONFIG.brandTreatments
export type LayoutId = keyof typeof FURTHERFIELD_CONFIG.instagramLayouts
