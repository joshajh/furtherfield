"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { Navigation, Footer, TidalGrid } from "@/components";
import { HtmlContent } from "@/components/HtmlContent";
import type { AboutPage, Venue } from "@/lib/cms";

type AboutPageClientProps = {
  aboutPage: AboutPage | null;
  venues: Venue[];
  marqueeText?: string | null;
  aboutSnippet?: string | null;
};

type VenueModalProps = {
  venue: Venue;
  onClose: () => void;
};

function VenueModal({ venue, onClose }: VenueModalProps) {
  // Generate Google Maps embed URL from address
  const getMapUrl = (address: string | null) => {
    if (!address) return null;
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedAddress}`;
  };

  // Generate Google Maps link for directions
  const getDirectionsUrl = (address: string | null) => {
    if (!address) return "#";
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  };

  const mapUrl = getMapUrl(venue.address);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-text-dark/80 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-bg-light rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-text-dark/10 hover:bg-text-dark/20 transition-colors"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-text-dark"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Map */}
        {mapUrl ? (
          <div className="w-full h-48 md:h-64 bg-gradient-brand">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map of ${venue.name}`}
            />
          </div>
        ) : (
          <div className="w-full h-48 md:h-64 bg-gradient-brand flex items-center justify-center">
            <span className="text-text-dark/50">Map unavailable</span>
          </div>
        )}

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-16rem)]">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="font-serif text-text-dark text-2xl md:text-3xl mb-2">
                {venue.name}
              </h2>
              {venue.address && (
                <p className="text-text-dark/70">{venue.address}</p>
              )}
            </div>
            {venue.type && (
              <span className="tag">{venue.type}</span>
            )}
          </div>

          {venue.description && (
            <HtmlContent
              html={venue.description}
              className="prose max-w-none text-text-dark mb-6 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:underline"
            />
          )}

          {/* Accessibility features */}
          {venue.accessibility.length > 0 && venue.accessibility.some(Boolean) && (
            <div className="mb-6">
              <h3 className="font-semibold text-text-dark mb-3">Accessibility</h3>
              <div className="flex flex-wrap gap-2">
                {venue.accessibility.map(
                  (feature, i) =>
                    feature && (
                      <span
                        key={i}
                        className="bg-gradient-brand text-text-dark text-sm px-3 py-1.5 rounded-lg"
                      >
                        {feature}
                      </span>
                    )
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={getDirectionsUrl(venue.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-text-dark text-text-light px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Get Directions
            </a>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 border-2 border-text-dark text-text-dark px-6 py-3 rounded-full font-semibold hover:bg-text-dark hover:text-text-light transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AboutPageClient({ aboutPage, venues, marqueeText, aboutSnippet }: AboutPageClientProps) {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  const openVenueModal = useCallback((venue: Venue) => {
    setSelectedVenue(venue);
  }, []);

  const closeVenueModal = useCallback(() => {
    setSelectedVenue(null);
  }, []);
  const partners = aboutPage?.partners || [];

  return (
    <div className="min-h-screen flex flex-col gap-2.5 py-2.5">
      <Navigation marqueeText={marqueeText} aboutSnippet={aboutSnippet} />

      <main className="flex flex-col gap-2.5">
        {/* Hero Section */}
        <section className="relative bg-gradient-brand rounded-lg mx-2.5 px-5 py-24 md:py-32 overflow-hidden">
          <TidalGrid
            className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
            gridSize={16}
            waveAmplitude={6}
            waveFrequency={2.5}
            strokeColor="#9A8B55"
            strokeWidth={0.8}
            animationSpeed={0.00015}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-4xl"
          >
            <h1 className="font-display text-text-dark text-[50px] md:text-[80px] lg:text-[120px] leading-[0.95] tracking-tight">
              {(aboutPage?.heroTitle || "About\nThis Coastal Town").split("\n").map((line, i) => (
                <span key={i} className={i === 0 ? "italic block" : "block"}>
                  {line}
                </span>
              ))}
            </h1>
          </motion.div>
        </section>

        {/* Introduction Section */}
        <section className="bg-bg-light rounded-lg mx-2.5 px-5 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-text-dark text-3xl md:text-5xl mb-8">
                {aboutPage?.storyTitle || "Our Story"}
              </h2>
              <HtmlContent
                html={aboutPage?.storyContent}
                className="prose prose-lg md:prose-xl max-w-none text-text-dark [&_p]:leading-relaxed [&_h2]:font-serif [&_h2]:text-2xl [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:underline"
              />
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-gradient-brand rounded-lg mx-2.5 px-5 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-12 md:gap-16"
            >
              <div>
                <h2 className="font-serif text-text-dark text-3xl md:text-4xl mb-6">
                  {aboutPage?.missionTitle || "Our Mission"}
                </h2>
                <HtmlContent
                  html={aboutPage?.missionContent}
                  className="prose max-w-none text-text-dark text-lg [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:underline"
                />
              </div>
              <div>
                <h2 className="font-serif text-text-dark text-3xl md:text-4xl mb-6">
                  {aboutPage?.visionTitle || "Our Vision"}
                </h2>
                <HtmlContent
                  html={aboutPage?.visionContent}
                  className="prose max-w-none text-text-dark text-lg [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:underline"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Accessibility Section */}
        <section className="bg-bg-light rounded-lg mx-2.5 px-5 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-text-dark text-3xl md:text-5xl mb-8">
                Accessibility
              </h2>
              <div className="space-y-8">
                <HtmlContent
                  html={aboutPage?.accessibilityIntro || "We are committed to making all our events and venues as accessible as possible."}
                  className="prose prose-lg md:prose-xl max-w-none text-text-dark [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:underline"
                />

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white/50 rounded-lg p-6">
                    <h3 className="font-semibold text-text-dark text-xl mb-4">
                      {aboutPage?.physicalAccessTitle || "Physical Access"}
                    </h3>
                    <HtmlContent
                      html={aboutPage?.physicalAccessContent}
                      className="prose max-w-none text-text-dark [&_ul]:space-y-2 [&_ul]:list-none [&_ul]:pl-0 [&_li]:flex [&_li]:items-start [&_li]:gap-2 [&_li]:before:content-['•'] [&_li]:before:text-gradient-start [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:underline"
                    />
                  </div>

                  <div className="bg-white/50 rounded-lg p-6">
                    <h3 className="font-semibold text-text-dark text-xl mb-4">
                      {aboutPage?.sensoryCommTitle || "Sensory & Communication"}
                    </h3>
                    <HtmlContent
                      html={aboutPage?.sensoryCommContent}
                      className="prose max-w-none text-text-dark [&_ul]:space-y-2 [&_ul]:list-none [&_ul]:pl-0 [&_li]:flex [&_li]:items-start [&_li]:gap-2 [&_li]:before:content-['•'] [&_li]:before:text-gradient-start [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:underline"
                    />
                  </div>
                </div>

                <div className="bg-gradient-brand rounded-lg p-6">
                  <h3 className="font-semibold text-text-dark text-xl mb-4">
                    {aboutPage?.needAssistanceTitle || "Need Assistance?"}
                  </h3>
                  <HtmlContent
                    html={aboutPage?.needAssistanceContent || `If you have specific access requirements or questions about attending our events, please contact us at <a href="mailto:${aboutPage?.contactEmail || "hello@thiscoastaltown.org"}">${aboutPage?.contactEmail || "hello@thiscoastaltown.org"}</a>. We're happy to discuss your needs and make arrangements.`}
                    className="prose max-w-none text-text-dark [&_p]:leading-relaxed [&_a]:underline [&_a]:hover:opacity-70"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Venues Directory Section */}
        {venues.length > 0 && (
          <section className="bg-gradient-brand rounded-lg mx-2.5 px-5 py-16 md:py-24">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-display text-text-dark text-4xl md:text-6xl mb-4">
                  Venues
                </h2>
                <p className="text-text-dark text-lg mb-12 max-w-2xl">
                  Our events take place across multiple locations in and around Felixstowe. Each venue offers its own unique character and atmosphere.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-4">
                {venues.map((venue, i) => (
                  <motion.button
                    key={venue.name || i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    onClick={() => openVenueModal(venue)}
                    className="bg-white/90 rounded-lg p-6 hover:bg-white hover:shadow-lg transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-semibold text-text-dark text-xl mb-1 group-hover:underline decoration-text-dark/40 underline-offset-2">
                          {venue.name}
                        </h3>
                        <p className="text-text-dark/70 text-sm">
                          {venue.address}
                        </p>
                      </div>
                      {venue.type && (
                        <span className="tag tag-sm">{venue.type}</span>
                      )}
                    </div>
                    <p className="text-text-dark text-sm mb-4 line-clamp-2">
                      {venue.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {venue.accessibility.slice(0, 2).map((feature, fi) => (
                          feature && (
                            <span
                              key={fi}
                              className="bg-gradient-brand text-text-dark text-xs px-2 py-1 rounded"
                            >
                              {feature}
                            </span>
                          )
                        ))}
                        {venue.accessibility.filter(Boolean).length > 2 && (
                          <span className="text-text-dark/50 text-xs">
                            +{venue.accessibility.filter(Boolean).length - 2} more
                          </span>
                        )}
                      </div>
                      <span className="text-text-dark/50 text-sm group-hover:text-text-dark transition-colors">
                        View details &rarr;
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Partners Section */}
        {partners.length > 0 && (
          <section className="bg-bg-light rounded-lg mx-2.5 px-5 py-16 md:py-24">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-serif text-text-dark text-3xl md:text-5xl mb-8">
                  Our Partners
                </h2>
                <HtmlContent
                  html={aboutPage?.partnersIntro || "This Coastal Town is made possible through the generous support of our partners and funders."}
                  className="prose prose-lg md:prose-xl max-w-none text-text-dark mb-12 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:underline"
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {partners.map((partner, i) => (
                    <motion.div
                      key={partner.name || i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-center h-24 bg-white/50 rounded-lg"
                    >
                      <span className="text-text-dark/50 text-sm text-center px-4">
                        {partner.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section className="bg-gradient-brand rounded-lg mx-2.5 px-5 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-text-dark text-4xl md:text-6xl mb-6">
                Get in Touch
              </h2>
              <p className="text-text-dark text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                Have questions about our programme or want to get involved? We&apos;d love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`mailto:${aboutPage?.contactEmail || "hello@thiscoastaltown.org"}`}
                  className="inline-flex items-center justify-center gap-2 bg-text-dark text-text-light px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-opacity"
                >
                  Email Us
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-2 border-2 border-text-dark text-text-dark px-8 py-4 rounded-full font-semibold hover:bg-text-dark hover:text-text-light transition-colors"
                >
                  Newsletter Signup
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Decorative Ovals */}
        <div className="flex justify-center py-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            <div className="w-48 h-32 md:w-72 md:h-48 rounded-[50%] border-2 border-text-light/20" />
            <div className="w-48 h-32 md:w-72 md:h-48 rounded-[50%] border-2 border-text-light/20" />
          </motion.div>
        </div>
      </main>

      <Footer />

      {/* Venue Modal */}
      <AnimatePresence>
        {selectedVenue && (
          <VenueModal venue={selectedVenue} onClose={closeVenueModal} />
        )}
      </AnimatePresence>
    </div>
  );
}
