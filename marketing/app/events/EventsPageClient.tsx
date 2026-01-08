"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Navigation, Footer, AnimatedSprites, TidalGrid } from "@/components";
import type { Event } from "@/lib/cms";

type EventsPageClientProps = {
  events: Event[];
  marqueeText?: string | null;
  aboutSnippet?: string | null;
};

function formatEventType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type EventCardProps = {
  event: Event;
  index: number;
};

function EventCard({ event, index }: EventCardProps) {
  const formattedDate = formatDate(event.date);
  const formattedType = formatEventType(event.type);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group h-auto min-h-[420px] md:min-h-[450px]"
    >
      <Link
        href={`/events/${event.slug}`}
        className="flex flex-col h-full rounded-lg overflow-hidden bg-gradient-brand hover:shadow-lg transition-shadow duration-300"
      >
        {/* Image section */}
        <div className="relative aspect-[4/3] overflow-hidden shrink-0">
          {event.image ? (
            <>
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Lemon color tint */}
              <div
                className="absolute inset-0 pointer-events-none bg-treatment-lemon mix-blend-multiply"
                aria-hidden="true"
              />
              {/* Cream wash overlay */}
              <div
                className="absolute inset-0 pointer-events-none bg-[#F5F0E0]/40"
                aria-hidden="true"
              />
              {/* Film grain noise */}
              <div
                className="absolute inset-0 pointer-events-none treatment-noise"
                aria-hidden="true"
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#9A8B55]/30 to-[#4A7C59]/30" />
          )}
        </div>

        {/* Content section */}
        <div className="p-4 md:p-5 flex flex-col flex-1">
          {/* Event type and date pills */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="border border-text-dark/60 rounded-full px-3 py-1 text-text-dark/80 text-xs font-medium">
              {formattedType}
            </span>
            {formattedDate && (
              <span className="border border-text-dark/60 rounded-full px-3 py-1 text-text-dark/80 text-xs font-medium">
                {formattedDate}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-text-dark text-lg md:text-xl font-semibold tracking-tight leading-tight mb-2 group-hover:underline decoration-text-dark/40 underline-offset-2">
            {event.title}
          </h2>

          {/* Venue */}
          {event.venue && (
            <p className="text-text-dark/70 text-sm mb-2">{event.venue.name}</p>
          )}

          {/* Summary */}
          {event.summary && (
            <p className="text-text-dark/60 text-sm leading-relaxed line-clamp-2">
              {event.summary}
            </p>
          )}
        </div>
      </Link>
    </motion.article>
  );
}

export default function EventsPageClient({
  events,
  marqueeText,
  aboutSnippet,
}: EventsPageClientProps) {
  // Group events by type
  const eventsByType = events.reduce(
    (acc, event) => {
      const type = event.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(event);
      return acc;
    },
    {} as Record<string, Event[]>
  );

  // Sort events within each type by date
  Object.values(eventsByType).forEach((typeEvents) => {
    typeEvents.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  });

  // Sort all events by date for the "All Events" view
  const sortedEvents = [...events].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div className="min-h-screen flex flex-col gap-2.5 pt-[calc(56px+20px)] pb-2.5 relative z-10 overflow-x-hidden">
      <AnimatedSprites />
      <Navigation marqueeText={marqueeText} aboutSnippet={aboutSnippet} />

      <main className="flex flex-col gap-2.5">
        {/* Hero Section */}
        <section className="relative bg-gradient-brand rounded-lg mx-2.5 px-5 py-12 md:py-16 overflow-hidden">
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
            className="relative z-10 max-w-6xl mx-auto"
          >
            <h1 className="font-display text-text-dark text-[36px] sm:text-[50px] md:text-[80px] lg:text-[120px] leading-[0.95] tracking-tight">
              What&apos;s On
            </h1>
          </motion.div>
        </section>

        {/* Events Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 mx-2.5">
          {sortedEvents.map((event, index) => (
            <EventCard key={event.slug} event={event} index={index} />
          ))}
        </section>

        {/* Empty state */}
        {events.length === 0 && (
          <div className="rounded-lg bg-gradient-brand p-10 text-center mx-2.5">
            <p className="text-text-dark/70 text-lg">
              No events scheduled at the moment. Check back soon!
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
