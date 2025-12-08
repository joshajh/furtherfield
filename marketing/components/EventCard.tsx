"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export type Event = {
  slug: string;
  title: string;
  type: string;
  date: string;
  image: string;
  summary?: string;
};

type EventCardProps = {
  event: Event;
  index?: number;
};

export function EventCard({ event, index = 0 }: EventCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative flex-1 min-w-[300px] md:min-w-[600px] h-[700px] rounded-lg overflow-hidden"
    >
      <Link href={`/events/${event.slug}`} className="flex flex-col size-full">
        {/* Image section with lemon treatment */}
        <div className="relative h-[68%]">
          {/* Base image */}
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

          {/* Cream wash overlay to fade the image */}
          <div
            className="absolute inset-0 pointer-events-none bg-[#F5F0E0]/50"
            aria-hidden="true"
          />

          {/* Film grain noise */}
          <div
            className="absolute inset-0 pointer-events-none treatment-noise"
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
          {/* Event type and date pills - z-40 to appear above lichen border */}
          <div className="relative z-40 flex flex-wrap gap-2 mb-2">
            <span className="border border-text-dark/60 rounded-full px-3 py-1 text-text-dark/80 text-xs font-medium">
              {event.type}
            </span>
            <span className="border border-text-dark/60 rounded-full px-3 py-1 text-text-dark/80 text-xs font-medium">
              {event.date}
            </span>
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
