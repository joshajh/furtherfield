"use client";

import { motion } from "framer-motion";
import { Navigation, Footer, TidalGrid } from "@/components";

const venues = [
  {
    name: "Felixstowe Beach Hut Gallery",
    address: "Sea Road, Felixstowe, IP11 2AS",
    type: "Gallery Space",
    accessibility: ["Wheelchair accessible", "Accessible parking nearby", "Assistance dogs welcome"],
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet ultricies lacinia.",
  },
  {
    name: "The Clocktower Pavilion",
    address: "Undercliff Road West, Felixstowe, IP11 2AF",
    type: "Event Venue",
    accessibility: ["Step-free access", "Accessible toilets", "Hearing loop available"],
    description: "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Maecenas faucibus mollis interdum.",
  },
  {
    name: "Landguard Fort",
    address: "View Point Road, Felixstowe, IP11 3TW",
    type: "Heritage Site",
    accessibility: ["Limited wheelchair access", "Uneven surfaces", "Assistance available on request"],
    description: "Nullam quis risus eget urna mollis ornare vel eu leo. Cras justo odio, dapibus ac facilisis in.",
  },
  {
    name: "Felixstowe Library",
    address: "Crescent Road, Felixstowe, IP11 7BY",
    type: "Community Space",
    accessibility: ["Full wheelchair access", "Accessible toilets", "Large print materials", "Quiet space available"],
    description: "Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col gap-2.5 py-2.5">
      <Navigation />

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
              <span className="italic block">About</span>
              <span className="block">This Coastal Town</span>
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
                Our Story
              </h2>
              <div className="space-y-6 text-text-dark text-lg md:text-xl leading-relaxed">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. Nulla facilisi. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
                </p>
                <p>
                  Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                </p>
                <p>
                  Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
                </p>
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
                  Our Mission
                </h2>
                <p className="text-text-dark text-lg leading-relaxed">
                  Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.
                </p>
              </div>
              <div>
                <h2 className="font-serif text-text-dark text-3xl md:text-4xl mb-6">
                  Our Vision
                </h2>
                <p className="text-text-dark text-lg leading-relaxed">
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
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
                  We are committed to making all our events and venues as accessible as possible. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white/50 rounded-lg p-6">
                    <h3 className="font-semibold text-text-dark text-xl mb-4">Physical Access</h3>
                    <ul className="space-y-2 text-text-dark">
                      <li className="flex items-start gap-2">
                        <span className="text-gradient-start">•</span>
                        Wheelchair accessible venues clearly marked
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gradient-start">•</span>
                        Blue Badge parking available at most locations
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gradient-start">•</span>
                        Accessible toilet facilities
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gradient-start">•</span>
                        Seating available at all standing events
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white/50 rounded-lg p-6">
                    <h3 className="font-semibold text-text-dark text-xl mb-4">Sensory & Communication</h3>
                    <ul className="space-y-2 text-text-dark">
                      <li className="flex items-start gap-2">
                        <span className="text-gradient-start">•</span>
                        BSL interpretation available on request
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gradient-start">•</span>
                        Hearing loops at select venues
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gradient-start">•</span>
                        Large print materials available
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gradient-start">•</span>
                        Quiet spaces at larger events
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-brand rounded-lg p-6">
                  <h3 className="font-semibold text-text-dark text-xl mb-4">Need Assistance?</h3>
                  <p className="text-text-dark">
                    If you have specific access requirements or questions about attending our events, please contact us at <a href="mailto:access@thiscoastaltown.org" className="underline hover:opacity-70">access@thiscoastaltown.org</a> or call <a href="tel:+441onal234567890" className="underline hover:opacity-70">01onal 234 567 890</a>. We&apos;re happy to discuss your needs and make arrangements.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Venues Directory Section */}
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
                  key={venue.name}
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
                    <span className="shrink-0 border border-text-dark text-text-dark text-xs px-3 py-1 rounded-full">
                      {venue.type}
                    </span>
                  </div>
                  <p className="text-text-dark text-sm mb-4">
                    {venue.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {venue.accessibility.map((feature) => (
                      <span
                        key={feature}
                        className="bg-gradient-brand text-text-dark text-xs px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners Section */}
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
                This Coastal Town is made possible through the generous support of our partners and funders. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {["Arts Council England", "Suffolk County Council", "Felixstowe Town Council", "National Lottery Heritage Fund"].map((partner, i) => (
                  <motion.div
                    key={partner}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-center h-24 bg-white/50 rounded-lg"
                  >
                    <span className="text-text-dark/50 text-sm text-center px-4">
                      {partner}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

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
                  href="mailto:hello@thiscoastaltown.org"
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
