"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useCallback } from "react";
import { Navigation, Footer, EventGrid, TidalGrid, Brandmark3D, VenueModal, type Event } from "@/components";
import type { Venue, Person } from "@/lib/cms";

type EventData = {
  slug: string;
  title: string;
  date: string | null;
  time: string | null;
  type: string;
  venueSlug: string | null;
  venue: Venue | null;
  image: string | null;
  summary: string | null;
  bookingUrl: string | null;
  featured: boolean;
  description: string;
};

type CMSEvent = {
  slug: string;
  title: string;
  date: string | null;
  time: string | null;
  type: string;
  venueSlug: string | null;
  venue: Venue | null;
  image: string | null;
  summary: string | null;
  bookingUrl: string | null;
  featured: boolean;
};

type EventPageClientProps = {
  event: EventData;
  relatedEvents: CMSEvent[];
  people?: Person[];
  marqueeText?: string | null;
  aboutSnippet?: string | null;
};

const PERSON_TYPE_LABELS: Record<string, string> = {
  team: "Team",
  collaborator: "Creative Collaborator",
  advisor: "Advisor",
  partner: "Partner",
};

function formatEventType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" });
}

export default function EventPageClient({
  event,
  relatedEvents,
  people = [],
  marqueeText,
  aboutSnippet,
}: EventPageClientProps) {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  const openVenueModal = useCallback(() => {
    if (event.venue) {
      setSelectedVenue(event.venue);
    }
  }, [event.venue]);

  const closeVenueModal = useCallback(() => {
    setSelectedVenue(null);
  }, []);

  const formattedRelatedEvents: Event[] = relatedEvents.map((e) => ({
    slug: e.slug,
    title: e.title,
    type: formatEventType(e.type),
    date: formatDate(e.date),
    image: e.image,
    summary: e.summary,
  }));

  return (
    <div className="min-h-screen flex flex-col gap-2.5 pt-[calc(56px+20px)] pb-2.5 relative z-10 overflow-x-hidden">
      <Navigation marqueeText={marqueeText} aboutSnippet={aboutSnippet} />

      <main className="flex flex-col gap-2.5">
        {/* Hero Section */}
        <section className="relative bg-gradient-brand rounded-lg mx-2.5 px-5 py-16 md:py-24 overflow-hidden">
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
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="font-display text-text-dark text-[36px] sm:text-[40px] md:text-[80px] lg:text-[100px] leading-[0.95] tracking-tight mb-6">
              {event.title}
            </h1>
            {/* Event metadata */}
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 mt-8 font-mono text-base md:text-lg uppercase tracking-wide text-text-dark/70">
              <span>{formatEventType(event.type)}</span>
              {event.date && (
                <>
                  <span className="text-text-dark/30">•</span>
                  <span>{formatDate(event.date)}</span>
                </>
              )}
              {event.time && (
                <>
                  <span className="text-text-dark/30">•</span>
                  <span>{event.time}</span>
                </>
              )}
            </div>

            {/* Venue and Book Now */}
            <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
              {event.venue && (
                <button
                  onClick={openVenueModal}
                  className="inline-flex items-center gap-1.5 font-mono text-base md:text-lg uppercase tracking-wide text-text-dark underline decoration-2 underline-offset-4 decoration-text-dark/40 hover:decoration-treatment-lemon hover:decoration-4 transition-all cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {event.venue.name}
                </button>
              )}
              {event.bookingUrl && (
                <a
                  href={event.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tag gap-1.5 bg-text-dark text-text-light border-text-dark hover:bg-treatment-acid hover:text-text-dark"
                >
                  Book Now
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </a>
              )}
            </div>
          </motion.div>
        </section>

        {/* Featured Image */}
        {event.image && (
          <section className="mx-2.5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative w-full h-[300px] md:h-[500px] rounded-lg overflow-hidden"
            >
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
              />
            </motion.div>
          </section>
        )}

        {/* Summary Section */}
        <section className="bg-bg-light rounded-lg mx-2.5 px-5 py-16">
          <div className="max-w-4xl mx-auto">
            {event.summary && (
              <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-12">
                <h2 className="font-serif text-text-dark text-3xl md:text-4xl shrink-0">
                  Summary
                </h2>
                <p className="text-text-dark text-xl md:text-2xl leading-relaxed font-semibold">
                  {event.summary}
                </p>
              </div>
            )}
            {event.description && (
              <div
                className="text-text-dark text-lg leading-relaxed prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-text-dark prose-p:text-text-dark prose-li:text-text-dark prose-a:text-treatment-acid prose-strong:text-text-dark [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4 [&_li]:my-1 [&_h2]:text-2xl [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:mt-4 [&_h3]:mb-2"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            )}
          </div>
        </section>

        {/* People Section */}
        {people.length > 0 && (
          <section className="bg-gradient-brand rounded-lg mx-2.5 px-5 py-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-text-dark text-4xl md:text-5xl mb-10">
                People
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {people.map((person) => (
                  <motion.div
                    key={person.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-bg-light rounded-lg p-5 flex flex-col"
                  >
                    {person.image && (
                      <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={person.image}
                          alt={person.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-serif text-text-dark text-xl mb-1">
                      {person.link ? (
                        <a
                          href={person.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-treatment-acid transition-colors"
                        >
                          {person.name}
                        </a>
                      ) : (
                        person.name
                      )}
                    </h3>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="tag tag-sm">
                        {PERSON_TYPE_LABELS[person.type] || person.type}
                      </span>
                      {person.role && (
                        <span className="tag tag-sm bg-treatment-acid/30">
                          {person.role}
                        </span>
                      )}
                    </div>
                    {person.bio && (
                      <p className="text-text-dark/80 text-sm leading-relaxed">
                        {person.bio}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Booking Button */}
        {event.bookingUrl && (
          <section className="mx-2.5">
            <a
              href={event.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block w-full bg-gradient-brand rounded-lg px-6 sm:px-8 py-6 sm:py-8 text-center overflow-hidden hover:shadow-lg transition-shadow"
            >
              <span className="relative z-10 font-display text-text-dark text-2xl sm:text-3xl md:text-4xl">
                Book Now
              </span>
              <span className="absolute inset-0 bg-treatment-lemon opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </section>
        )}

        {/* Rotating Cubes Icon */}
        <div className="flex justify-center py-16 bg-bg-dark">
          <Brandmark3D size={80} />
        </div>

        {/* More Events */}
        {formattedRelatedEvents.length > 0 && (
          <section className="bg-gradient-brand rounded-lg mx-2.5 px-5 py-16">
            <h2 className="font-display text-text-dark text-4xl md:text-6xl mb-8">
              More
            </h2>
            <EventGrid events={formattedRelatedEvents} />
          </section>
        )}

        {/* Rotating Cubes Icon */}
        <div className="flex justify-center py-10 bg-bg-dark">
          <Brandmark3D size={80} />
        </div>
      </main>

      <Footer />

      {/* Venue Modal */}
      <VenueModal venue={selectedVenue} onClose={closeVenueModal} />
    </div>
  );
}
