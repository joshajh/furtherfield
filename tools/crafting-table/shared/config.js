// Shared configuration for all micro-apps
const FURTHERFIELD_CONFIG = {
    // Standard asset dimensions
    sizes: {
        standard: 800,
        small: 400,
        large: 1600,
        sprite: 64,
        mark: 128
    },

    // Export formats
    formats: {
        svg: 'image/svg+xml',
        png: 'image/png',
        json: 'application/json'
    },

    // Felixstowe location data
    location: {
        name: 'Felixstowe',
        coords: { lat: 52.06, long: 1.35 },
        timezone: 'Europe/London'
    },

    // Content taxonomy
    taxonomy: {
        contentTypes: {
            article: { name: 'Article', shape: 'square', color: '#3a7ca5' },
            event: { name: 'Event', shape: 'circle', color: '#dc2626' },
            artwork: { name: 'Artwork', shape: 'triangle', color: '#7c3aed' },
            exhibition: { name: 'Exhibition', shape: 'hexagon', color: '#059669' },
            project: { name: 'Project', shape: 'pentagon', color: '#e8b339' },
            archive: { name: 'Archive', shape: 'octagon', color: '#4b5563' }
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
            experimental: { modifier: 'dotted' }
        }
    },

    // Default color palettes
    palettes: {
        ocean: ['#0f3057', '#2e5a7d', '#3a7ca5', '#7fa8c9', '#a7c7e7', '#BCE5F3', '#DBEAFF'],
        sunshine: ['#d4941e', '#e8b339', '#f4d35e', '#fff8a3', '#FFFCB9'],
        sea: ['#0f3057', '#3a7ca5', '#7fa8c9', '#BCE5F3', '#DBEAFF'],
        shore: ['#8b6f47', '#a8956c', '#d4a574', '#e8caa4', '#f2e8dc'],
        maritime: ['#0f3057', '#3a7ca5', '#7fa8c9', '#a7c7e7', '#BCE5F3'],
        flora: ['#2d5016', '#4a7c23', '#6fa834', '#9bc54d', '#c8e89c'],
        monochrome: ['#1f2937', '#4b5563', '#9ca3af', '#e5e7eb', '#f9fafb'],
        sunset: ['#ff6b35', '#e8b339', '#f4d35e', '#fff8a3', '#FFFCB9']
    },

    // Metadata structure
    assetMetadata: {
        version: '1.0',
        creator: 'Crafting Table',
        license: 'CC BY-SA 4.0'
    }
};

// Export for both module and script usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FURTHERFIELD_CONFIG;
}
