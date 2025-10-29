// Shared utilities for all micro-apps

const FurtherfieldUtils = {
    /**
     * Generate asset metadata
     */
    createMetadata(appName, contentType, tags = []) {
        return {
            id: this.generateId(),
            app: appName,
            timestamp: new Date().toISOString(),
            contentType: contentType,
            tags: tags,
            version: FURTHERFIELD_CONFIG.assetMetadata.version,
            creator: FURTHERFIELD_CONFIG.assetMetadata.creator
        };
    },

    /**
     * Generate unique ID
     */
    generateId() {
        return `ff-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Export SVG to file
     */
    exportSVG(svgElement, filename, metadata = null) {
        // Clone SVG and add metadata if provided
        const svg = svgElement.cloneNode(true);

        if (metadata) {
            const metaElement = document.createElementNS('http://www.w3.org/2000/svg', 'metadata');
            metaElement.textContent = JSON.stringify(metadata);
            svg.insertBefore(metaElement, svg.firstChild);
        }

        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: FURTHERFIELD_CONFIG.formats.svg });
        this.downloadBlob(blob, filename);
    },

    /**
     * Export SVG as PNG
     */
    exportPNG(svgElement, filename, size = FURTHERFIELD_CONFIG.sizes.standard) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        canvas.width = size;
        canvas.height = size;

        return new Promise((resolve, reject) => {
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                canvas.toBlob(blob => {
                    this.downloadBlob(blob, filename);
                    resolve();
                });
            };

            img.onerror = reject;
            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
        });
    },

    /**
     * Export metadata as JSON
     */
    exportJSON(data, filename) {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: FURTHERFIELD_CONFIG.formats.json });
        this.downloadBlob(blob, filename);
    },

    /**
     * Download blob helper
     */
    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    },

    /**
     * Load image from file
     */
    loadImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    /**
     * Load SVG from file
     */
    loadSVG(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(e.target.result, 'image/svg+xml');
                const svg = doc.documentElement;
                resolve(svg);
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    },

    /**
     * Format timestamp for filenames
     */
    getTimestamp() {
        return new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    },

    /**
     * Generate filename
     */
    generateFilename(appName, extension, suffix = '') {
        const timestamp = this.getTimestamp();
        const suffixPart = suffix ? `-${suffix}` : '';
        return `${appName}-${timestamp}${suffixPart}.${extension}`;
    },

    /**
     * Create SVG element
     */
    createSVG(width = FURTHERFIELD_CONFIG.sizes.standard, height = FURTHERFIELD_CONFIG.sizes.standard) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

        // Add white background by default
        const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bg.setAttribute('width', width);
        bg.setAttribute('height', height);
        bg.setAttribute('fill', 'white');
        svg.appendChild(bg);

        return svg;
    },

    /**
     * Color utilities
     */
    color: {
        hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },

        rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        },

        interpolate(color1, color2, factor) {
            const c1 = this.hexToRgb(color1);
            const c2 = this.hexToRgb(color2);

            const r = Math.round(c1.r + factor * (c2.r - c1.r));
            const g = Math.round(c1.g + factor * (c2.g - c1.g));
            const b = Math.round(c1.b + factor * (c2.b - c1.b));

            return this.rgbToHex(r, g, b);
        }
    }
};

// Export for both module and script usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FurtherfieldUtils;
}
