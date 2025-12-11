'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

type NavigationProps = {
  marqueeText?: string | null;
  aboutSnippet?: string | null;
};

type ContentMode = 'marquee' | 'about' | 'nav';

export function Navigation({ marqueeText, aboutSnippet }: NavigationProps = {}) {
  const [contentMode, setContentMode] = useState<ContentMode>('marquee')

  const toggleMode = (mode: ContentMode) => {
    setContentMode(current => current === mode ? 'marquee' : mode)
  }

  return (
    <div className="sticky top-2.5 mx-2.5 z-40">
      <nav className="flex items-stretch justify-between gap-2.5 relative z-50">
        {/* Logo Button - triggers About info */}
        <button
          onClick={() => toggleMode('about')}
          className="shrink-0 rounded bg-gradient-brand px-4 flex items-center justify-center hover-lemon-gradient"
          aria-label="Toggle about information"
        >
          <Image
            src="/f-mark-white-trans.png"
            alt="Furtherfield"
            width={24}
            height={24}
            className="invert relative z-10"
          />
        </button>

        {/* Content Container */}
        <div className="flex-1 rounded bg-gradient-brand overflow-hidden flex items-center relative min-h-[56px]">
          <AnimatePresence mode="wait">
            {contentMode === 'marquee' && (
              <motion.div
                key="marquee"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex animate-marquee"
              >
                {[...Array(4)].map((_, i) => (
                  <span
                    key={i}
                    className="shrink-0 px-8 text-text-dark font-medium text-sm uppercase tracking-wide whitespace-nowrap font-mono"
                  >
                    {marqueeText || "This Coastal Town — A series of events exploring art, culture, and community on the Suffolk coast."} ✦
                  </span>
                ))}
              </motion.div>
            )}

            {contentMode === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="px-8 w-full"
              >
                <p className="text-text-dark font-medium text-sm uppercase tracking-wide font-mono">
                  {aboutSnippet || "Furtherfield is a leading international arts organisation exploring the intersections of art, technology and social change. We work with artists, technologists, thinkers and communities worldwide to build creative networks across borders and boundaries."}
                </p>
              </motion.div>
            )}

            {contentMode === 'nav' && (
              <motion.div
                key="nav"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-end px-4 py-3 w-full"
              >
                <div className="flex items-center gap-2">
                  <Link
                    href="/#programme"
                    onClick={() => setContentMode('marquee')}
                    className="tag"
                  >
                    Programme
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setContentMode('marquee')}
                    className="tag"
                  >
                    About
                  </Link>
                  <Link
                    href="/"
                    onClick={() => setContentMode('marquee')}
                    className="tag"
                  >
                    Home
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Menu Button */}
        <button
          onClick={() => toggleMode('nav')}
          className="shrink-0 rounded bg-gradient-brand px-4 flex items-center justify-center hover-lemon-gradient"
          aria-label="Toggle navigation menu"
        >
          <Image
            src="/svg-icon.svg"
            alt="Menu"
            width={40}
            height={40}
            className="relative z-10"
          />
        </button>
      </nav>
    </div>
  )
}
