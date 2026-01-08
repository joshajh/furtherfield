"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { LichenContainer } from "./LichenContainer";

export type Event = {
  slug: string;
  title: string;
  type: string;
  date: string | null;
  image: string | null;
  summary?: string | null;
};

type EventCardProps = {
  event: Event;
  index?: number;
};

export function EventCard({ event, index = 0 }: EventCardProps) {
  return (
    <LichenContainer
      seed={index * 100 + event.slug.length}
      density="sparse"
      edges={['top', 'bottom', 'left', 'right']}
      className="flex-1 min-w-[280px] sm:min-w-[300px] md:min-w-[600px] h-[500px] sm:h-[600px] md:h-[700px]"
    >
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className="group relative size-full rounded-lg overflow-hidden"
      >
        <Link href={`/events/${event.slug}`} className="flex flex-col size-full">
        {/* Image section with lemon treatment */}
        <div className="relative h-[68%]">
          {/* Base image */}
          {event.image && (
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}

          {/* Lemon color tint */}
          <div
            className="absolute inset-0 pointer-events-none bg-treatment-lemon/50 mix-blend-multiply"
            aria-hidden="true"
          />

          {/* Cream wash overlay to fade the image */}
          <div
            className="absolute inset-0 pointer-events-none bg-[#F5F0E0]/25"
            aria-hidden="true"
          />

          {/* Film grain noise */}
          <div
            className="absolute inset-0 pointer-events-none treatment-noise opacity-40"
            aria-hidden="true"
          />

          {/* Feathered bottom edge - fades into text section */}
          <div
            className="absolute inset-x-0 -bottom-12 h-64 pointer-events-none z-0 blur-md"
            style={{ background: 'linear-gradient(to bottom, transparent 0%, var(--color-gradient-start) 70%)' }}
            aria-hidden="true"
          />
        </div>

        {/* Content section with blue gradient */}
        <div className="relative flex flex-col flex-1 p-4 md:p-5 bg-gradient-brand">
          {/* Event type and date callouts - z-40 to appear above lichen border */}
          <div className="relative z-40 flex flex-wrap gap-2 mb-2">
            <span className="callout-sm">{event.type}</span>
            {event.date && (
              <span className="callout-sm">{event.date}</span>
            )}
          </div>

          {/* Title - z-40 to appear above lichen border */}
          <h2 className="relative z-40 text-text-dark text-xl md:text-2xl font-semibold tracking-tight leading-tight mb-1">
            {event.title}
          </h2>

          {/* Description - z-40 to appear above lichen border */}
          {event.summary && (
            <p className="relative z-40 text-text-dark/60 text-sm leading-relaxed line-clamp-2 mt-auto">
              {event.summary}
            </p>
          )}
        </div>
        </Link>
      </motion.article>
    </LichenContainer>
  );
}

type EventGridProps = {
  events: Event[];
};

export function EventGrid({ events }: EventGridProps) {
  return (
    <section className="flex flex-wrap gap-2.5 justify-center px-2.5">
      {events.map((event, i) => (
        <EventCard key={event.slug} event={event} index={i} />
      ))}
    </section>
  );
}
