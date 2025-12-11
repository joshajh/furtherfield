"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Navigation, Footer, EventGrid, TidalGrid, RotatingCubesIcon, type Event } from "@/components";
import type { Venue } from "@/lib/keystatic";

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
  marqueeText?: string | null;
  aboutSnippet?: string | null;
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
  marqueeText,
  aboutSnippet,
}: EventPageClientProps) {
  const formattedRelatedEvents: Event[] = relatedEvents.map((e) => ({
    slug: e.slug,
    title: e.title,
    type: formatEventType(e.type),
    date: formatDate(e.date),
    image: e.image,
    summary: e.summary,
  }));

  return (
    <div className="min-h-screen flex flex-col gap-2.5 py-2.5">
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
            <h1 className="font-display text-text-dark text-[40px] md:text-[80px] lg:text-[100px] leading-[0.95] tracking-tight mb-6">
              {event.title}
            </h1>
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              <span className="tag">{formatEventType(event.type)}</span>
              {event.date && (
                <span className="tag">{formatDate(event.date)}</span>
              )}
              {event.time && (
                <span className="tag">{event.time}</span>
              )}
              {event.venue && (
                <span className="tag">{event.venue.name}</span>
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
                <p className="text-text-dark text-xl md:text-2xl leading-relaxed">
                  {event.summary}
                </p>
              </div>
            )}
            {event.description && (
              <div className="text-text-dark text-lg leading-relaxed whitespace-pre-line">
                {event.description}
              </div>
            )}
          </div>
        </section>

        {/* Booking Button */}
        {event.bookingUrl && (
          <section className="mx-2.5">
            <a
              href={event.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-brand rounded-lg px-8 py-6 text-center text-text-dark text-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Book Now
            </a>
          </section>
        )}

        {/* Rotating Cubes Icon */}
        <div className="flex justify-center py-16 bg-bg-dark">
          <RotatingCubesIcon size={200} />
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
          <RotatingCubesIcon size={200} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
