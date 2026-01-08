'use client'

import { useState } from 'react'

// Display font options (replacing Playfair Display) - needs to work at display AND subhead sizes
const displayFonts = [
  { id: 'supreme', name: 'Supreme', family: '"Supreme", sans-serif', description: 'Rounded geometric - soft, modern' },
  { id: 'outfit', name: 'Outfit', family: '"Outfit", sans-serif', description: 'Geometric variable - scales beautifully' },
  { id: 'albert-sans', name: 'Albert Sans', family: '"Albert Sans", sans-serif', description: 'Geometric grotesque - versatile weights' },
  { id: 'sora', name: 'Sora', family: '"Sora", sans-serif', description: 'Geometric - great at all sizes' },
  { id: 'red-hat-display', name: 'Red Hat Display', family: '"Red Hat Display", sans-serif', description: 'Contemporary - open, friendly' },
  { id: 'lexend', name: 'Lexend', family: '"Lexend", sans-serif', description: 'Optimised readability - clean, modern' },
  { id: 'rubik', name: 'Rubik', family: '"Rubik", sans-serif', description: 'Rounded corners - approachable, warm' },
  { id: 'poppins', name: 'Poppins', family: '"Poppins", sans-serif', description: 'Geometric - circular forms, popular' },
]

// Sans body font options (replacing Geist Sans)
const sansFonts = [
  { id: 'inter', name: 'Inter', family: '"Inter", sans-serif', description: 'Neutral workhorse - extremely legible' },
  { id: 'dm-sans', name: 'DM Sans', family: '"DM Sans", sans-serif', description: 'Geometric humanist - softer feel' },
  { id: 'plus-jakarta', name: 'Plus Jakarta Sans', family: '"Plus Jakarta Sans", sans-serif', description: 'Modern geometric - refined' },
  { id: 'manrope', name: 'Manrope', family: '"Manrope", sans-serif', description: 'Semi-condensed - efficient, modern' },
]

export default function FontDemoPage() {
  const [selectedDisplay, setSelectedDisplay] = useState(displayFonts[0])
  const [selectedSans, setSelectedSans] = useState(sansFonts[0])

  return (
    <>
      {/* Google Fonts - display and body options */}
      <link
        href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&family=Inter:wght@400;500;600&family=Lexend:wght@400;500;600;700&family=Manrope:wght@400;500;600&family=Outfit:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600&family=Poppins:wght@400;500;600;700&family=Red+Hat+Display:wght@400;500;600;700&family=Rubik:wght@400;500;600;700&family=Sora:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      {/* Fontshare - Supreme */}
      <link
        href="https://api.fontshare.com/v2/css?f[]=supreme@400,500,700&display=swap"
        rel="stylesheet"
      />

      <main className="min-h-screen bg-gradient-brand">
        {/* Font Selectors */}
        <div className="sticky top-0 z-50 bg-bg-dark/95 backdrop-blur border-b border-white/10 p-4">
          <div className="max-w-7xl mx-auto flex flex-wrap gap-6">
            <div>
              <label className="block text-text-light/60 text-xs uppercase tracking-wide mb-2">Display Font</label>
              <div className="flex gap-2 flex-wrap">
                {displayFonts.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => setSelectedDisplay(font)}
                    className={`px-3 py-2 rounded text-sm font-mono transition-all ${
                      selectedDisplay.id === font.id
                        ? 'bg-treatment-acid text-text-dark'
                        : 'bg-white/10 text-text-light hover:bg-white/20'
                    }`}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-text-light/60 text-xs uppercase tracking-wide mb-2">Body Font</label>
              <div className="flex gap-2 flex-wrap">
                {sansFonts.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => setSelectedSans(font)}
                    className={`px-3 py-2 rounded text-sm font-mono transition-all ${
                      selectedSans.id === font.id
                        ? 'bg-treatment-acid text-text-dark'
                        : 'bg-white/10 text-text-light hover:bg-white/20'
                    }`}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-3 text-xs text-text-light/40">
            <span className="text-treatment-acid">{selectedDisplay.name}</span>: {selectedDisplay.description} | <span className="text-treatment-acid">{selectedSans.name}</span>: {selectedSans.description}
          </div>
        </div>

        {/* Demo Content */}
        <div className="p-6 md:p-10">
          {/* Page Title - like About page */}
          <section className="mb-16">
            <h1
              className="text-text-dark text-[36px] sm:text-[50px] md:text-[80px] lg:text-[120px] leading-[0.95] tracking-tight"
              style={{ fontFamily: selectedDisplay.family }}
            >
              About
            </h1>
          </section>

          {/* Summary Section */}
          <section className="mb-16 max-w-4xl">
            <h2
              className="text-text-dark text-3xl md:text-5xl mb-8"
              style={{ fontFamily: selectedDisplay.family }}
            >
              Summary
            </h2>
            <div
              className="text-text-dark text-lg leading-relaxed space-y-4"
              style={{ fontFamily: selectedSans.family }}
            >
              <p>
                This Coastal Town is an immersive programme of art, technology, and community engagement
                taking place across Felixstowe in 2026. The festival brings together local residents,
                international artists, and innovative thinkers to explore the intersection of maritime
                heritage and digital futures.
              </p>
              <p>
                Through workshops, exhibitions, performances, and interventions, we invite participants
                to reimagine what coastal communities can become in an era of climate change,
                technological transformation, and renewed interest in place-based culture.
              </p>
            </div>
          </section>

          {/* Venues Section */}
          <section className="mb-16">
            <h2
              className="text-text-dark text-3xl md:text-5xl mb-8"
              style={{ fontFamily: selectedDisplay.family }}
            >
              Venues
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {['Landguard Fort', 'Felixstowe Library', 'The Seafront', 'Manor House'].map((venue) => (
                <div key={venue} className="bg-white/20 rounded-lg p-6">
                  <h3
                    className="text-text-dark text-2xl mb-2"
                    style={{ fontFamily: selectedDisplay.family }}
                  >
                    {venue}
                  </h3>
                  <p
                    className="text-text-dark/80"
                    style={{ fontFamily: selectedSans.family }}
                  >
                    A historic location transformed into a space for contemporary art and dialogue.
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* People Section */}
          <section className="mb-16">
            <h2
              className="text-text-dark text-4xl md:text-5xl mb-10"
              style={{ fontFamily: selectedDisplay.family }}
            >
              People
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { name: 'Sarah Chen', role: 'ARTISTIC DIRECTOR' },
                { name: 'Marcus Webb', role: 'CURATOR' },
                { name: 'Elena Vasquez', role: 'COMMUNITY LEAD' },
              ].map((person) => (
                <div key={person.name} className="bg-white/20 rounded-lg p-6">
                  <h3
                    className="text-text-dark text-xl mb-2"
                    style={{ fontFamily: selectedDisplay.family }}
                  >
                    {person.name}
                  </h3>
                  <span className="callout-sm">{person.role}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Navigation Preview */}
          <section className="mb-16 bg-bg-dark rounded-lg p-8">
            <h3 className="text-text-light/60 text-sm uppercase tracking-wide mb-6">Navigation Preview</h3>
            <div className="flex flex-col gap-4">
              {['Events', 'About', 'People', 'Archive'].map((item) => (
                <span
                  key={item}
                  className="text-4xl sm:text-5xl text-text-light hover:text-treatment-lemon transition-colors cursor-pointer"
                  style={{ fontFamily: selectedDisplay.family }}
                >
                  {item}
                </span>
              ))}
            </div>
          </section>

          {/* Event Card Preview */}
          <section className="mb-16">
            <h3 className="text-text-dark/60 text-sm uppercase tracking-wide mb-6">Event Detail Preview</h3>
            <div className="bg-white/20 rounded-lg p-8">
              <h1
                className="text-text-dark text-[36px] sm:text-[50px] md:text-[80px] leading-[0.95] tracking-tight mb-6"
                style={{ fontFamily: selectedDisplay.family }}
              >
                Tidal Frequencies
              </h1>
              <div className="flex gap-3 mb-6">
                <span className="callout-sm">WORKSHOP</span>
                <span className="callout-sm">12 JUL 2026</span>
              </div>
              <p
                className="text-text-dark text-lg leading-relaxed max-w-2xl"
                style={{ fontFamily: selectedSans.family }}
              >
                An interactive sound installation exploring the relationship between tidal patterns
                and electronic music. Participants will create compositions using real-time data
                from Felixstowe&apos;s coastline.
              </p>
            </div>
          </section>

          {/* CTA Preview */}
          <section className="mb-16">
            <h3 className="text-text-dark/60 text-sm uppercase tracking-wide mb-6">CTA Button Preview</h3>
            <button
              className="bg-white text-text-dark px-6 py-8 text-4xl sm:text-5xl md:text-7xl tracking-tight rounded-lg hover:bg-opacity-90 transition-all italic"
              style={{ fontFamily: selectedDisplay.family }}
            >
              Get Involved
            </button>
          </section>

          {/* Type Scale Reference */}
          <section className="border-t border-text-dark/20 pt-12">
            <h3 className="text-text-dark/60 text-sm uppercase tracking-wide mb-8">Type Scale Reference</h3>
            <div className="space-y-6">
              {[
                { size: '120px', label: 'Page Title' },
                { size: '80px', label: 'Hero Headline' },
                { size: '50px', label: 'Section Header' },
                { size: '36px', label: 'Card Title' },
                { size: '24px', label: 'Subhead' },
              ].map((item) => (
                <div key={item.size} className="flex items-baseline gap-4">
                  <span className="text-text-dark/40 text-xs font-mono w-20">{item.size}</span>
                  <span
                    className="text-text-dark leading-none"
                    style={{ fontFamily: selectedDisplay.family, fontSize: item.size }}
                  >
                    Aa
                  </span>
                  <span className="text-text-dark/60 text-sm">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-12 space-y-4">
              <h4 className="text-text-dark/60 text-sm uppercase tracking-wide mb-4">Body Text Samples</h4>
              {['18px', '16px', '14px'].map((size) => (
                <p
                  key={size}
                  className="text-text-dark"
                  style={{ fontFamily: selectedSans.family, fontSize: size }}
                >
                  <span className="text-text-dark/40 font-mono text-xs mr-4">{size}</span>
                  The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.
                </p>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
