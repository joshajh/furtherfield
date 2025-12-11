"use client";

import { motion } from "framer-motion";
import { Navigation, Footer, TidalGrid } from "@/components";
import type { AboutPage } from "@/lib/keystatic";

type AboutPageClientProps = {
  aboutPage: AboutPage | null;
  marqueeText?: string | null;
  aboutSnippet?: string | null;
};

export default function AboutPageClient({ aboutPage, marqueeText, aboutSnippet }: AboutPageClientProps) {
  const venues = aboutPage?.venues || [];
  const partners = aboutPage?.partners || [];

  return (
    <div className="min-h-screen flex flex-col gap-2.5 py-2.5">
      <Navigation marqueeText={marqueeText} aboutSnippet={aboutSnippet} />

      <main className="flex flex-col gap-2.5">
        {/* Hero Section */}
        <section className="relative bg-gradient-brand rounded-lg mx-2.5 px-5 py-24 md:py-32 overflow-hidden">
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
            <h1 className="font-display text-text-dark text-[50px] md:text-[80px] lg:text-[120px] leading-[0.95] tracking-tight">
              {(aboutPage?.heroTitle || "About\nThis Coastal Town").split("\n").map((line, i) => (
                <span key={i} className={i === 0 ? "italic block" : "block"}>
                  {line}
                </span>
              ))}
            </h1>
          </motion.div>
        </section>

        {/* Introduction Section */}
        <section className="bg-bg-light rounded-lg mx-2.5 px-5 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-text-dark text-3xl md:text-5xl mb-8">
                {aboutPage?.storyTitle || "Our Story"}
              </h2>
              <div className="space-y-6 text-text-dark text-lg md:text-xl leading-relaxed">
                {(aboutPage?.storyContent || "").split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-gradient-brand rounded-lg mx-2.5 px-5 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-12 md:gap-16"
            >
              <div>
                <h2 className="font-serif text-text-dark text-3xl md:text-4xl mb-6">
                  {aboutPage?.missionTitle || "Our Mission"}
                </h2>
                <p className="text-text-dark text-lg leading-relaxed">
                  {aboutPage?.missionContent}
                </p>
              </div>
              <div>
                <h2 className="font-serif text-text-dark text-3xl md:text-4xl mb-6">
                  {aboutPage?.visionTitle || "Our Vision"}
                </h2>
                <p className="text-text-dark text-lg leading-relaxed">
                  {aboutPage?.visionContent}
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Accessibility Section */}
        <section className="bg-bg-light rounded-lg mx-2.5 px-5 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-text-dark text-3xl md:text-5xl mb-8">
                Accessibility
              </h2>
              <div className="space-y-8">
                <p className="text-text-dark text-lg md:text-xl leading-relaxed">
                  {aboutPage?.accessibilityIntro || "We are committed to making all our events and venues as accessible as possible."}
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white/50 rounded-lg p-6">
                    <h3 className="font-semibold text-text-dark text-xl mb-4">Physical Access</h3>
                    <ul className="space-y-2 text-text-dark">
                      <li className="flex items-start gap-2">
                        <span className="text-gradient-start">&#8226;</span>
                        Wheelchair accessible venues clearly marked
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gradient-start">&#8226;</span>
                        Blue Badge parking available at most locations
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gradient-start">&#8226;</span>
                        Accessible toilet facilities
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gradient-start">&#8226;</span>
                        Seating available at all standing events
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white/50 rounded-lg p-6">
                    <h3 className="font-semibold text-text-dark text-xl mb-4">Sensory & Communication</h3>
                    <ul className="space-y-2 text-text-dark">
                      <li className="flex items-start gap-2">
                        <span className="text-gradient-start">&#8226;</span>
                        BSL interpretation available on request
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gradient-start">&#8226;</span>
                        Hearing loops at select venues
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gradient-start">&#8226;</span>
                        Large print materials available
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gradient-start">&#8226;</span>
                        Quiet spaces at larger events
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-brand rounded-lg p-6">
                  <h3 className="font-semibold text-text-dark text-xl mb-4">Need Assistance?</h3>
                  <p className="text-text-dark">
                    If you have specific access requirements or questions about attending our events, please contact us at{" "}
                    <a href={`mailto:${aboutPage?.contactEmail || "hello@thiscoastaltown.org"}`} className="underline hover:opacity-70">
                      {aboutPage?.contactEmail || "hello@thiscoastaltown.org"}
                    </a>
                    . We&apos;re happy to discuss your needs and make arrangements.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Venues Directory Section */}
        {venues.length > 0 && (
          <section className="bg-gradient-brand rounded-lg mx-2.5 px-5 py-16 md:py-24">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-display text-text-dark text-4xl md:text-6xl mb-4">
                  Venues
                </h2>
                <p className="text-text-dark text-lg mb-12 max-w-2xl">
                  Our events take place across multiple locations in and around Felixstowe. Each venue offers its own unique character and atmosphere.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-4">
                {venues.map((venue, i) => (
                  <motion.div
                    key={venue.name || i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="bg-white/90 rounded-lg p-6 hover:bg-white transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-semibold text-text-dark text-xl mb-1">
                          {venue.name}
                        </h3>
                        <p className="text-text-dark/70 text-sm">
                          {venue.address}
                        </p>
                      </div>
                      {venue.type && (
                        <span className="shrink-0 border border-text-dark text-text-dark text-xs px-3 py-1 rounded-full">
                          {venue.type}
                        </span>
                      )}
                    </div>
                    <p className="text-text-dark text-sm mb-4">
                      {venue.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {venue.accessibility.map((feature, fi) => (
                        feature && (
                          <span
                            key={fi}
                            className="bg-gradient-brand text-text-dark text-xs px-2 py-1 rounded"
                          >
                            {feature}
                          </span>
                        )
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Partners Section */}
        {partners.length > 0 && (
          <section className="bg-bg-light rounded-lg mx-2.5 px-5 py-16 md:py-24">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-serif text-text-dark text-3xl md:text-5xl mb-8">
                  Our Partners
                </h2>
                <p className="text-text-dark text-lg md:text-xl leading-relaxed mb-12">
                  {aboutPage?.partnersIntro || "This Coastal Town is made possible through the generous support of our partners and funders."}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {partners.map((partner, i) => (
                    <motion.div
                      key={partner.name || i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-center h-24 bg-white/50 rounded-lg"
                    >
                      <span className="text-text-dark/50 text-sm text-center px-4">
                        {partner.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section className="bg-gradient-brand rounded-lg mx-2.5 px-5 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-text-dark text-4xl md:text-6xl mb-6">
                Get in Touch
              </h2>
              <p className="text-text-dark text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                Have questions about our programme or want to get involved? We&apos;d love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`mailto:${aboutPage?.contactEmail || "hello@thiscoastaltown.org"}`}
                  className="inline-flex items-center justify-center gap-2 bg-text-dark text-text-light px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-opacity"
                >
                  Email Us
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-2 border-2 border-text-dark text-text-dark px-8 py-4 rounded-full font-semibold hover:bg-text-dark hover:text-text-light transition-colors"
                >
                  Newsletter Signup
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Decorative Ovals */}
        <div className="flex justify-center py-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            <div className="w-48 h-32 md:w-72 md:h-48 rounded-[50%] border-2 border-text-light/20" />
            <div className="w-48 h-32 md:w-72 md:h-48 rounded-[50%] border-2 border-text-light/20" />
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
