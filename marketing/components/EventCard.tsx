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
      <Link href={`/events/${event.slug}`} className="block size-full">
        {/* Background Image */}
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-2.5">
          <div className="backdrop-blur-xl bg-white/20 rounded-md p-3">
            <h2 className="text-text-light text-xl font-semibold tracking-tight">
              {event.title}
            </h2>
            <div className="flex items-center gap-1 text-text-light text-xl font-semibold">
              <span>{event.type}</span>
              <span>·</span>
              <span>{event.date}</span>
            </div>
          </div>
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
