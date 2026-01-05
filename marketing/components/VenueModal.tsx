"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Venue } from "@/lib/cms";
import { HtmlContent } from "@/components/HtmlContent";

type VenueModalProps = {
  venue: Venue | null;
  onClose: () => void;
};

function VenueModalContent({ venue, onClose }: { venue: Venue; onClose: () => void }) {
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

export function VenueModal({ venue, onClose }: VenueModalProps) {
  return (
    <AnimatePresence>
      {venue && <VenueModalContent venue={venue} onClose={onClose} />}
    </AnimatePresence>
  );
}
