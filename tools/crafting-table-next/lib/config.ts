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
} as const

export type ContentType = keyof typeof FURTHERFIELD_CONFIG.taxonomy.contentTypes
export type PaletteName = keyof typeof FURTHERFIELD_CONFIG.palettes
export type TagName = keyof typeof FURTHERFIELD_CONFIG.taxonomy.tags
