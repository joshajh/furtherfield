"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navigation, Footer, AnimatedSprites, TidalGrid } from "@/components";
import type { Event } from "@/lib/cms";

type EventsPageClientProps = {
  events: Event[];
  marqueeText?: string | null;
  ffSnippet?: string | null;
};

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(timeStr: string | null | undefined): string | null {
  if (!timeStr) return null;
  return timeStr;
}

type EventListItemProps = {
  event: Event;
  index: number;
};

function EventListItem({ event, index }: EventListItemProps) {
  const formattedDate = formatDate(event.date);
  const formattedTime = formatTime(event.time);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className="border-b border-text-dark/20 last:border-b-0"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6 py-4 md:py-5">
        {/* Title and venue */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/events/${event.slug}`}
            className="group"
          >
            <h2 className="text-text-dark text-lg md:text-xl font-semibold tracking-tight leading-tight group-hover:underline decoration-text-dark/40 underline-offset-2">
              {event.title}
            </h2>
          </Link>
          {event.venue && (
            <p className="text-text-dark/60 text-sm mt-1">{event.venue.name}</p>
          )}
        </div>

        {/* Date/Time */}
        <div className="flex flex-col md:items-end shrink-0 text-sm md:text-base">
          {formattedDate && (
            <span className="text-text-dark/80 font-mono">{formattedDate}</span>
          )}
          {formattedTime && (
            <span className="text-text-dark/60 font-mono">{formattedTime}</span>
          )}
        </div>

        {/* Book Now link */}
        {event.bookingUrl ? (
          <a
            href={event.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tag shrink-0"
          >
            Book Now
          </a>
        ) : (
          <Link
            href={`/events/${event.slug}`}
            className="tag shrink-0"
          >
            View Event
          </Link>
        )}
      </div>
    </motion.div>
  );
}

export default function EventsPageClient({
  events,
  marqueeText,
  ffSnippet,
}: EventsPageClientProps) {
  // Sort all events by date
  const sortedEvents = [...events].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div className="min-h-screen flex flex-col gap-2.5 pt-[calc(56px+20px)] pb-2.5 relative z-10 overflow-x-hidden">
      <AnimatedSprites />
      <Navigation marqueeText={marqueeText} ffSnippet={ffSnippet} />

      <main className="flex flex-col gap-2.5">
        {/* Hero Section */}
        <section className="relative bg-gradient-brand rounded-lg mx-2.5 p-4 md:p-5 overflow-hidden">
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
            className="relative z-10"
          >
            <h1 className="font-display text-text-dark text-[36px] sm:text-[50px] md:text-[80px] lg:text-[120px] leading-[0.95] tracking-tight">
              What&apos;s On
            </h1>
          </motion.div>
        </section>

        {/* Events List */}
        <section className="bg-gradient-brand rounded-lg mx-2.5 p-4 md:p-5">
          {sortedEvents.map((event, index) => (
            <EventListItem key={event.slug} event={event} index={index} />
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
