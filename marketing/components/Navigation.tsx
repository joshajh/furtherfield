'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

type NavigationProps = {
  marqueeText?: string | null;
  aboutSnippet?: string | null;
};

export function Navigation({ marqueeText, aboutSnippet }: NavigationProps = {}) {
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false)
  const [navMenuOpen, setNavMenuOpen] = useState(false)

  return (
    <div className="sticky top-2.5 mx-2.5 z-40">
      <nav className="flex items-stretch justify-between gap-2.5 relative z-50">
      {/* Logo Button - triggers About info */}
      <button
        onClick={() => setAboutMenuOpen(!aboutMenuOpen)}
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

      {/* Marquee Ticker */}
      <div className="flex-1 rounded bg-gradient-brand overflow-hidden flex items-center">
        <div className="py-4 flex animate-marquee">
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="shrink-0 px-8 text-text-dark font-medium text-sm uppercase tracking-wide whitespace-nowrap font-mono"
            >
              {marqueeText || "This Coastal Town — A series of events exploring art, culture, and community on the Suffolk coast."} ✦
            </span>
          ))}
        </div>
      </div>

      {/* Nav Menu Button */}
      <button
        onClick={() => setNavMenuOpen(!navMenuOpen)}
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

      {/* About Row - triggered by f-mark */}
      <AnimatePresence>
        {aboutMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 10 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            className="relative z-20 rounded bg-gradient-brand overflow-hidden"
          >
            <div className="px-5 py-4">
              <p className="text-text-dark text-sm leading-relaxed">
                {aboutSnippet || "Furtherfield is a leading international arts organisation exploring the intersections of art, technology and social change. We work with artists, technologists, thinkers and communities worldwide to build creative networks across borders and boundaries."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav Menu Row - below nav, triggered by cubes icon */}
      <AnimatePresence>
        {navMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 10 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            className="relative z-20 rounded bg-gradient-brand overflow-hidden"
          >
            <div className="flex items-center justify-end px-4 py-3">
              {/* Nav Links */}
              <div className="flex items-center gap-2">
                <Link
                  href="/#programme"
                  onClick={() => setNavMenuOpen(false)}
                  className="tag"
                >
                  Programme
                </Link>
                <Link
                  href="/about"
                  onClick={() => setNavMenuOpen(false)}
                  className="tag"
                >
                  About
                </Link>
                <Link
                  href="/"
                  onClick={() => setNavMenuOpen(false)}
                  className="tag"
                >
                  Home
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
