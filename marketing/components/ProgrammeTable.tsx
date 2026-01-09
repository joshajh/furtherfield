"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Event } from "./EventCard";

type ProgrammeTableProps = {
  events: Event[];
};

export function ProgrammeTable({ events }: ProgrammeTableProps) {
  return (
    <section
      id="programme"
      className="bg-bg-light rounded-lg px-6 md:px-12 py-16"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-display text-text-dark text-[60px] md:text-[90px] leading-tight tracking-tight mb-20"
      >
        Programme
      </motion.h2>

      <div>
        {/* Table Header */}
        <div className="hidden md:flex gap-4 text-text-dark/60 font-semibold text-xl tracking-tight pb-4">
          <div className="flex-1">Event</div>
          <div className="w-40">Date</div>
          <div className="flex-1">Tags</div>
          <div className="flex-1 text-right">Description</div>
        </div>

        {/* Table Rows */}
        <div className="flex flex-col">
          {events.map((event, i) => (
            <motion.div
              key={event.slug}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Link
                href={`/events/${event.slug}`}
                className="group flex flex-col md:flex-row gap-2 md:gap-4 py-4 border-t border-dashed border-divider text-text-dark font-semibold text-xl tracking-tight hover:bg-black/5 transition-colors -mx-2 px-2 rounded"
              >
                <div className="flex-1 group-hover:underline">{event.title}</div>
                <div className="w-40 text-text-dark/70">{event.date}</div>
                <div className="flex-1 text-text-dark/70">{event.type}</div>
                <div className="flex-1 text-right text-text-dark/70 hidden md:block">
                  {event.summary || ""}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
