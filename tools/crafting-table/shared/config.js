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
            article: { name: 'Article', shape: 'square', color: '#2563eb' },
            event: { name: 'Event', shape: 'circle', color: '#dc2626' },
            artwork: { name: 'Artwork', shape: 'triangle', color: '#7c3aed' },
            exhibition: { name: 'Exhibition', shape: 'hexagon', color: '#059669' },
            project: { name: 'Project', shape: 'pentagon', color: '#ea580c' },
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
        sea: ['#0a2f51', '#0e4f76', '#137da0', '#58b3d1', '#a4d4e6'],
        shore: ['#d4a574', '#e8caa4', '#f2e8dc', '#8b6f47', '#a8956c'],
        maritime: ['#1f3a5f', '#3d5a80', '#4d7ea8', '#90c2e7', '#c1d5e8'],
        flora: ['#2d5016', '#4a7c23', '#6fa834', '#9bc54d', '#c8e89c'],
        monochrome: ['#000000', '#404040', '#808080', '#c0c0c0', '#ffffff'],
        sunset: ['#ff6b35', '#f7931e', '#fdc43f', '#ffeb8a', '#f4e4c1']
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
