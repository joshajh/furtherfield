"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Navigation, Footer, AnimatedSprites, TidalGrid } from "@/components";
import type { Event } from "@/lib/cms";

type ProgrammePageClientProps = {
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
  const nextDate = getNextOccurringDate(event);
  const formattedDate = nextDate?.isQualitative
    ? nextDate.qualitativeText || "TBC"
    : formatDate(nextDate?.date || null);
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
          {/* Event type and date callouts */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="callout-sm">{formattedType}</span>
            {formattedDate && (
              <span className="callout-sm">{formattedDate}</span>
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

export default function ProgrammePageClient({
  events,
  marqueeText,
  ffSnippet,
}: ProgrammePageClientProps) {
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
              Programme
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
