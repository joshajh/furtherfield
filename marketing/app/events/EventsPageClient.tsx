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

function getNextOccurringDate(event: Event): { date: string; time: string | null; isQualitative?: boolean; qualitativeText?: string | null } | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter to upcoming dates (including today), excluding far-future qualitative dates
  const upcomingDates = event.dates.filter((d) => {
    // If it's a qualitative date (9999-12-31), treat it specially
    if (d.isQualitative) {
      return true; // Include qualitative dates
    }
    const relevantDate = d.endDate || d.date;
    const eventDate = new Date(relevantDate);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });

  // Sort by date ascending, but put qualitative dates last
  if (upcomingDates.length > 0) {
    const sorted = upcomingDates.sort((a, b) => {
      // Qualitative dates should come after real dates
      if (a.isQualitative && !b.isQualitative) return 1;
      if (!a.isQualitative && b.isQualitative) return -1;
      if (a.isQualitative && b.isQualitative) return 0;

      const dateA = new Date(a.endDate || a.date);
      const dateB = new Date(b.endDate || b.date);
      return dateA.getTime() - dateB.getTime();
    });
    return {
      date: sorted[0].date,
      time: sorted[0].time || event.time,
      isQualitative: sorted[0].isQualitative,
      qualitativeText: sorted[0].qualitativeText
    };
  }

  // No upcoming dates, return the most recent past date
  if (event.dates.length > 0) {
    const sorted = event.dates.filter((d) => !d.isQualitative).sort((a, b) => {
      const dateA = new Date(a.endDate || a.date);
      const dateB = new Date(b.endDate || b.date);
      return dateB.getTime() - dateA.getTime();
    });
    if (sorted.length > 0) {
      return {
        date: sorted[0].date,
        time: sorted[0].time || event.time,
        isQualitative: sorted[0].isQualitative,
        qualitativeText: sorted[0].qualitativeText
      };
    }
  }

  // Fallback to legacy date field
  if (event.date) {
    return { date: event.date, time: event.time };
  }

  return null;
}

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
  const nextDate = getNextOccurringDate(event);
  const formattedDate = nextDate?.isQualitative
    ? nextDate.qualitativeText || "TBC"
    : formatDate(nextDate?.date || null);
  const formattedTime = nextDate?.isQualitative ? null : formatTime(nextDate?.time);

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
  // Sort events: upcoming first (soonest first), then past (most recent first)
  const sortedEvents = [...events].sort((a, b) => {
    const nextDateA = getNextOccurringDate(a);
    const nextDateB = getNextOccurringDate(b);

    if (!nextDateA) return 1;
    if (!nextDateB) return -1;

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const dateA = new Date(nextDateA.date);
    dateA.setHours(0, 0, 0, 0);
    const dateB = new Date(nextDateB.date);
    dateB.setHours(0, 0, 0, 0);

    const aIsFuture = dateA >= now;
    const bIsFuture = dateB >= now;

    // If one is future and one is past, future comes first
    if (aIsFuture && !bIsFuture) return -1;
    if (!aIsFuture && bIsFuture) return 1;

    // Both future: sort ascending (soonest first)
    if (aIsFuture && bIsFuture) {
      return dateA.getTime() - dateB.getTime();
    }

    // Both past: sort descending (most recent first)
    return dateB.getTime() - dateA.getTime();
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

          {/* See All Events Link */}
          {events.length > 0 && (
            <div className="pt-6 mt-6 border-t border-text-dark/20 text-right">
              <Link
                href="/programme"
                className="inline-block text-text-dark font-semibold hover:underline decoration-text-dark/40 underline-offset-2"
              >
                See All Events →
              </Link>
            </div>
          )}
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
