"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Navigation, Footer, EventGrid, TidalGrid, RotatingCubesIcon, type Event } from "@/components";
import { use } from "react";

// Placeholder content for all events
const placeholderEvent = {
  title: "Interspecies Meditation and Sharing Circle",
  type: "Workshop" as const,
  date: "Last Sunday of Every Month",
  time: "2pm - 3pm",
  location: "Felixstowe Beach, Opposite The Clock Pond",
  w3w: "filer.feels.fantastic",
  summary: "Become another creature for a while - explore their world, senses, and perspective through imagination and shared ritual.",
  description: `The Interspecies Meditation is a guided ritual designed to help people develop an affinity with non-human life forms through imaginative role-play and deep listening. It provides participants with a fun experience of possible new relations.

What to Expect:
• Draw on your own intuition to find your partner species
• A guided meditation to enter the consciousness of your chosen species
• A sharing circle where we reflect on our embodied experiences
• Thoughtful dialogue on place, ecology, and kinship across species

Whether you're an artist, activist, beach-walker, or just curious, this event offers a powerful, imaginative way to reconnect with your surroundings - and with the lives that share it.`,
};

// Mock data - will be replaced with CMS
const eventsData: Record<string, Event & { description: string; images: string[]; time?: string; location?: string; w3w?: string }> = {
  "larping-find-out": {
    slug: "larping-find-out",
    ...placeholderEvent,
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
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
    ...placeholderEvent,
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80",
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80",
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80",
    ],
  },
  "larping-red-light": {
    slug: "larping-red-light",
    ...placeholderEvent,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    ],
  },
  "larp-basics": {
    slug: "larp-basics",
    ...placeholderEvent,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
    images: [],
  },
};

const moreEvents: Event[] = [
  {
    slug: "larping-chattanooga",
    title: placeholderEvent.title,
    type: placeholderEvent.type,
    date: placeholderEvent.date,
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80",
  },
  {
    slug: "larping-red-light",
    title: placeholderEvent.title,
    type: placeholderEvent.type,
    date: placeholderEvent.date,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  },
  {
    slug: "larp-basics",
    title: placeholderEvent.title,
    type: placeholderEvent.type,
    date: placeholderEvent.date,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
  },
  {
    slug: "larping-find-out",
    title: placeholderEvent.title,
    type: placeholderEvent.type,
    date: placeholderEvent.date,
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
            <div className="flex flex-wrap justify-center gap-3 text-text-dark text-lg mt-8">
              <span className="border border-text-dark rounded-full px-4 py-1.5">
                {event.type}
              </span>
              <span className="border border-text-dark rounded-full px-4 py-1.5">
                {event.date}
              </span>
              {event.time && (
                <span className="border border-text-dark rounded-full px-4 py-1.5">
                  {event.time}
                </span>
              )}
              {event.location && (
                <span className="border border-text-dark rounded-full px-4 py-1.5">
                  {event.location}
                </span>
              )}
              {event.w3w && (
                <span className="border border-text-dark rounded-full px-4 py-1.5">
                  W3W: {event.w3w}
                </span>
              )}
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

        {/* Summary Section */}
        <section className="bg-bg-light rounded-lg mx-2.5 px-5 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-12">
              <h2 className="font-serif text-text-dark text-3xl md:text-4xl shrink-0">
                Summary
              </h2>
              <p className="text-text-dark text-xl md:text-2xl leading-relaxed">
                {event.summary}
              </p>
            </div>
            <div className="text-text-dark text-lg leading-relaxed whitespace-pre-line">
              {event.description}
            </div>
          </div>
        </section>

        {/* Rotating Cubes Icon */}
        <div className="flex justify-center py-16 bg-bg-dark">
          <RotatingCubesIcon size={200} />
        </div>

        {/* More Events */}
        <section className="bg-gradient-brand rounded-lg mx-2.5 px-5 py-16">
          <h2 className="font-display text-text-dark text-4xl md:text-6xl mb-8">
            More
          </h2>
          <EventGrid events={relatedEvents} />
        </section>

        {/* Rotating Cubes Icon */}
        <div className="flex justify-center py-10 bg-bg-dark">
          <RotatingCubesIcon size={200} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
