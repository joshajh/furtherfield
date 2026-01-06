"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Navigation, Footer, TidalGrid } from "@/components";
import type { Person } from "@/lib/cms";

type PeoplePageClientProps = {
  people: Person[];
  marqueeText?: string | null;
  aboutSnippet?: string | null;
};

const PERSON_TYPE_LABELS: Record<string, string> = {
  team: "Team",
  collaborator: "Creative Collaborators",
  advisor: "Advisors",
  partner: "Partners",
};

const PERSON_TYPE_ORDER: Person["type"][] = ["team", "collaborator", "advisor", "partner"];

export default function PeoplePageClient({
  people,
  marqueeText,
  aboutSnippet,
}: PeoplePageClientProps) {
  // Group people by type
  const groupedPeople = PERSON_TYPE_ORDER.reduce<Record<string, Person[]>>(
    (acc, type) => {
      const filtered = people.filter((p) => p.type === type);
      if (filtered.length > 0) {
        acc[type] = filtered;
      }
      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen flex flex-col gap-2.5 py-2.5 relative z-10">
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
            className="relative z-10 max-w-4xl"
          >
            <h1 className="font-display text-text-dark text-[36px] sm:text-[50px] md:text-[80px] lg:text-[120px] leading-[0.95] tracking-tight">
              People
            </h1>
          </motion.div>
        </section>

        {/* People Sections by Type */}
        {Object.entries(groupedPeople).map(([type, peopleInType], sectionIndex) => (
          <section
            key={type}
            className={`${
              sectionIndex % 2 === 0 ? "bg-bg-light" : "bg-gradient-brand"
            } rounded-lg mx-2.5 px-5 py-16 md:py-24`}
          >
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-display text-text-dark text-4xl md:text-5xl mb-10">
                  {PERSON_TYPE_LABELS[type] || type}
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {peopleInType.map((person, i) => (
                  <motion.div
                    key={person.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className={`${
                      sectionIndex % 2 === 0
                        ? "bg-white/50"
                        : "bg-bg-light"
                    } rounded-lg p-5 flex flex-col`}
                  >
                    {person.image && (
                      <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={person.image}
                          alt={person.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-serif text-text-dark text-xl mb-2">
                      {person.link ? (
                        <a
                          href={person.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-treatment-acid transition-colors"
                        >
                          {person.name}
                        </a>
                      ) : (
                        person.name
                      )}
                    </h3>
                    {person.bio && (
                      <p className="text-text-dark/80 text-sm leading-relaxed">
                        {person.bio}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Empty State */}
        {people.length === 0 && (
          <section className="bg-bg-light rounded-lg mx-2.5 px-5 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-text-dark/70 text-lg">
                No people to display yet.
              </p>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
