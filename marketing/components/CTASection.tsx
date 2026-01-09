"use client";

import { motion } from "framer-motion";
import { Button } from "./Button";

type CTASectionProps = {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
};

export function CTASection({
  title = "Book or other CTA",
  subtitle = "Supporting two-liner",
  buttonText = "CTA",
  buttonHref = "#",
}: CTASectionProps) {
  return (
    <section className="relative rounded-lg overflow-hidden bg-gradient-brand">
      {/* Paper edge decorations - hidden on mobile */}
      <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 border-r border-dashed border-text-dark hidden sm:flex flex-col justify-between py-8 md:py-12 px-2 md:px-5">
        <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-gradient-brand border border-text-dark/20" />
        <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-gradient-brand border border-text-dark/20" />
        <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-gradient-brand border border-text-dark/20" />
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 border-l border-dashed border-text-dark hidden sm:flex flex-col justify-between py-8 md:py-12 px-2 md:px-5">
        <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-gradient-brand border border-text-dark/20" />
        <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-gradient-brand border border-text-dark/20" />
        <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-gradient-brand border border-text-dark/20" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center gap-6 md:gap-8 py-12 sm:py-20 md:py-32 px-6 md:px-12"
      >
        <div className="text-center">
          <h2 className="font-serif italic text-text-dark text-[32px] sm:text-[50px] md:text-[80px] leading-[0.9] tracking-tight">
            {title}
          </h2>
          <p className="text-text-dark text-base sm:text-xl mt-3 md:mt-4">{subtitle}</p>
        </div>

        <Button variant="primary" href={buttonHref}>
          {buttonText}
        </Button>
      </motion.div>
    </section>
  );
}
