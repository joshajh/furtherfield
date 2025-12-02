"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Navigation, Footer, EventGrid, type Event } from "@/components";
import { use } from "react";

// Mock data - will be replaced with CMS
const eventsData: Record<string, Event & { description: string; images: string[] }> = {
  "larping-find-out": {
    slug: "larping-find-out",
    title: "LARPing, Find Out What It Means To Me",
    type: "Workshop",
    date: "August 6, 2028",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    summary: "We are all chimeras, theorized and fabricated hybrids",
    description: "We are all chimeras, theorized and fabricated hybrids of machine and organism; in short, we are cyborgs.",
    images: [
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600&q=80",
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600&q=80",
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600&q=80",
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600&q=80",
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600&q=80",
    ],
  },
  "larping-chattanooga": {
    slug: "larping-chattanooga",
    title: "LARPing, is that the Chattanooga ChooChoo",
    type: "Workshop",
    date: "August 12, 2028",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80",
    summary: "Join us for a LARPing experience",
    description: "An immersive workshop exploring the boundaries between reality and imagination.",
    images: [
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80",
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80",
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80",
    ],
  },
  "larping-red-light": {
    slug: "larping-red-light",
    title: "LARPing, You Don't Have To Put On That Red Light",
    type: "Performance",
    date: "August 15, 2028",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    summary: "For the light leaks and long silences",
    description: "A performance exploring themes of identity and transformation.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    ],
  },
  "larp-basics": {
    slug: "larp-basics",
    title: "LARP",
    type: "Exhibition",
    date: "August 20, 2028",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
    summary: "Hands-on experience",
    description: "An introduction to the world of live action role playing.",
    images: [],
  },
};

const moreEvents: Event[] = [
  {
    slug: "larping-chattanooga",
    title: "LARPing, is that the Chattanooga ChooChoo",
    type: "Workshop",
    date: "Aug 12",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80",
  },
  {
    slug: "larping-red-light",
    title: "LARPing, You Don't Have To Put On That Red Light",
    type: "Performance",
    date: "Aug 15",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  },
  {
    slug: "larp-basics",
    title: "LARP",
    type: "Exhibition",
    date: "Aug 20",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
  },
  {
    slug: "larping-find-out",
    title: "LARPing, Find Out What It Means To Me",
    type: "Workshop",
    date: "Aug 6",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
  },
];

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default function EventPage({ params }: PageProps) {
  const { slug } = use(params);
  const event = eventsData[slug];

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col gap-2.5 py-2.5">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-2xl">Event not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedEvents = moreEvents.filter((e) => e.slug !== slug).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col gap-2.5 py-2.5">
      <Navigation />

      <main className="flex flex-col gap-2.5">
        {/* Hero Section */}
        <section className="bg-gradient-brand rounded-lg mx-2.5 px-5 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="font-display text-text-dark text-[40px] md:text-[80px] lg:text-[100px] leading-[0.95] tracking-tight mb-6">
              {event.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-text-dark text-xl">
              <span className="border border-text-dark rounded-full px-3 py-1">
                {event.type}
              </span>
              <span>·</span>
              <span>{event.date}</span>
            </div>
          </motion.div>
        </section>

        {/* Image Gallery */}
        {event.images.length > 0 && (
          <section className="flex gap-2.5 overflow-x-auto px-2.5 pb-2">
            {event.images.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="relative flex-shrink-0 w-[200px] h-[150px] md:w-[300px] md:h-[200px] rounded-lg overflow-hidden"
              >
                <Image
                  src={img}
                  alt={`${event.title} image ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </motion.div>
            ))}
          </section>
        )}

        {/* Intro Section */}
        <section className="bg-bg-light rounded-lg mx-2.5 px-5 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              <h2 className="font-display text-text-dark text-3xl md:text-4xl shrink-0">
                Intro
              </h2>
              <p className="text-text-dark text-xl md:text-2xl leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>
        </section>

        {/* Decorative Ovals */}
        <div className="flex justify-center py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            <div className="w-48 h-32 md:w-72 md:h-48 rounded-[50%] border-2 border-gradient-start" />
            <div className="w-48 h-32 md:w-72 md:h-48 rounded-[50%] border-2 border-gradient-end" />
          </motion.div>
        </div>

        {/* More Events */}
        <section className="bg-gradient-brand rounded-lg mx-2.5 px-5 py-16">
          <h2 className="font-display text-text-dark text-4xl md:text-6xl mb-8">
            More
          </h2>
          <EventGrid events={relatedEvents} />
        </section>

        {/* Decorative Ovals */}
        <div className="flex justify-center py-10">
          <div className="flex flex-col gap-4">
            <div className="w-72 h-48 rounded-[50%] border-2 border-text-light/20" />
            <div className="w-72 h-48 rounded-[50%] border-2 border-text-light/20" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
