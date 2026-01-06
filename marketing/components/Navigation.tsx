'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Brandmark3D } from './Brandmark3D'

type NavigationProps = {
  marqueeText?: string | null;
  aboutSnippet?: string | null;
};

type ContentMode = 'marquee' | 'about' | 'nav';

export function Navigation({ marqueeText, aboutSnippet }: NavigationProps = {}) {
  const [contentMode, setContentMode] = useState<ContentMode>('marquee')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const toggleMode = (mode: ContentMode) => {
    setContentMode(current => current === mode ? 'marquee' : mode)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <>
      <div className="fixed top-2.5 left-2.5 right-2.5 z-40">
        <nav className="flex items-stretch justify-between gap-2.5 relative z-50">
          {/* Nav Menu Button - Desktop: inline toggle, Mobile: opens overlay */}
          <button
            onClick={() => {
              // On mobile, open the full-screen menu
              if (window.innerWidth < 768) {
                setMobileMenuOpen(true)
              } else {
                toggleMode('nav')
              }
            }}
            className="shrink-0 rounded bg-gradient-brand px-4 flex items-center justify-center hover-lemon-gradient"
            aria-label="Toggle navigation menu"
          >
            <span className="relative z-10">
              <Brandmark3D size={10} autoRotate={false} />
            </span>
          </button>

          {/* Content Container */}
          <div className="flex-1 rounded bg-gradient-brand overflow-hidden relative h-[56px]">
            <AnimatePresence mode="popLayout">
              {contentMode === 'marquee' && (
                <motion.div
                  key="marquee"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center animate-marquee"
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
                  className="absolute inset-0 flex items-center px-4 md:px-8"
                >
                  <p className="text-text-dark font-medium text-xs md:text-sm uppercase tracking-wide font-mono">
                    {aboutSnippet || "Furtherfield is a leading international arts organisation exploring the intersections of art, technology and social change. We work with artists, technologists, thinkers and communities worldwide to build creative networks across borders and boundaries."}
                  </p>
                </motion.div>
              )}

              {contentMode === 'nav' && (
                <motion.div
                  key="nav"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute inset-0 hidden md:flex items-center px-4"
                >
                  <div className="flex items-center gap-2">
                    <Link
                      href="/"
                      onClick={() => setContentMode('marquee')}
                      className="tag"
                    >
                      Home
                    </Link>
                    <Link
                      href="/events"
                      onClick={() => setContentMode('marquee')}
                      className="tag"
                    >
                      What&apos;s On
                    </Link>
                    <Link
                      href="/people"
                      onClick={() => setContentMode('marquee')}
                      className="tag"
                    >
                      People
                    </Link>
                    <Link
                      href="/about"
                      onClick={() => setContentMode('marquee')}
                      className="tag"
                    >
                      About
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
        </nav>
      </div>

      {/* Full-viewport Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] md:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-bg-dark/95 backdrop-blur-sm"
              onClick={closeMobileMenu}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="relative h-full flex flex-col"
            >
              {/* Close Button */}
              <div className="flex justify-end p-4">
                <button
                  onClick={closeMobileMenu}
                  className="tag text-lg px-6 py-3"
                  aria-label="Close menu"
                >
                  Close
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 flex flex-col items-center justify-center gap-4 sm:gap-6 px-6 sm:px-8">
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className="font-display text-4xl sm:text-5xl text-text-light hover:text-treatment-lemon transition-colors py-2"
                >
                  Home
                </Link>
                <Link
                  href="/events"
                  onClick={closeMobileMenu}
                  className="font-display text-4xl sm:text-5xl text-text-light hover:text-treatment-lemon transition-colors py-2"
                >
                  What&apos;s On
                </Link>
                <Link
                  href="/people"
                  onClick={closeMobileMenu}
                  className="font-display text-4xl sm:text-5xl text-text-light hover:text-treatment-lemon transition-colors py-2"
                >
                  People
                </Link>
                <Link
                  href="/about"
                  onClick={closeMobileMenu}
                  className="font-display text-4xl sm:text-5xl text-text-light hover:text-treatment-lemon transition-colors py-2"
                >
                  About
                </Link>
              </nav>

              {/* Footer */}
              <div className="p-8 text-center">
                <p className="text-text-light/60 font-mono text-sm uppercase tracking-wide">
                  This Coastal Town
                </p>
                <p className="text-text-light/40 font-mono text-xs mt-2">
                  Felixstowe 2026
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
