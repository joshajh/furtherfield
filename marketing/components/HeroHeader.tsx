"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type HeroHeaderProps = {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
};

export function HeroHeader({
  title = "Reimagine\nThis Coastal Town",
  subtitle,
  backgroundImage = "/images/hero-bg.jpg",
}: HeroHeaderProps) {
  const titleLines = title.split("\n");

  return (
    <section className="relative h-[700px] rounded-lg overflow-hidden bg-gradient-brand mx-2.5">
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover"
          priority
        />
      )}

      <div className="absolute inset-0 flex items-end p-10">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-display text-text-dark text-[60px] md:text-[100px] lg:text-[140px] leading-none"
        >
          {titleLines.map((line, i) => (
            <span key={i} className={i === 0 ? "italic block" : "block"}>
              {line}
            </span>
          ))}
        </motion.h1>
      </div>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="absolute bottom-10 right-10 text-text-dark text-xl max-w-md"
        >
          {subtitle}
        </motion.p>
      )}
    </section>
  );
}
