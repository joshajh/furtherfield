'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { Brandmark3D } from './Brandmark3D'

type NavigationProps = {
  marqueeText?: string | null;
  aboutSnippet?: string | null;
};

export function Navigation({ marqueeText, aboutSnippet }: NavigationProps = {}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showAbout, setShowAbout] = useState(false)

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

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <>
      <div className="fixed top-2.5 left-2.5 right-2.5 z-40">
        <nav className="flex items-stretch justify-between gap-2.5 relative z-50 p-2 bg-bg-dark rounded-lg">
          {/* Nav Menu Button - Mobile only: opens overlay */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="shrink-0 rounded bg-gradient-brand px-4 flex items-center justify-center hover-lemon-gradient md:hidden"
            aria-label="Toggle navigation menu"
          >
            <span className="relative z-10">
              <Brandmark3D size={10} autoRotate={false} />
            </span>
          </button>

          {/* Brandmark - Desktop: clickable link to home */}
          <Link
            href="/"
            className="shrink-0 rounded bg-gradient-brand px-4 items-center justify-center hover-lemon-gradient hidden md:flex"
            aria-label="Go to home"
          >
            <span className="relative z-10">
              <Brandmark3D size={10} autoRotate={false} />
            </span>
          </Link>

          {/* Content Container - Desktop: nav items + marquee, Mobile: marquee only */}
          <div className="flex-1 rounded bg-gradient-brand overflow-hidden relative h-[56px]">
            {/* Mobile: Marquee only */}
            <div className="absolute inset-0 flex items-center animate-marquee md:hidden">
              {[...Array(4)].map((_, i) => (
                <span
                  key={i}
                  className="shrink-0 px-4 text-text-dark font-medium text-sm uppercase tracking-wide whitespace-nowrap font-mono"
                >
                  {marqueeText || "This Coastal Town — A series of events exploring art, culture, and community on the Suffolk coast."} ✦
                </span>
              ))}
            </div>

            {/* Desktop: About overlay or Nav items + Marquee */}
            <div className="absolute inset-0 hidden md:flex items-center">
              {showAbout ? (
                <div className="flex items-center px-4 md:px-8">
                  <p className="text-text-dark font-medium text-xs md:text-sm uppercase tracking-wide font-mono line-clamp-2">
                    {aboutSnippet || "Furtherfield is a leading international arts organisation exploring the intersections of art, technology and social change."}
                  </p>
                </div>
              ) : (
                <div className="flex items-center w-full">
                  {/* Nav Links */}
                  <div className="flex items-center gap-2 px-4 shrink-0">
                    <Link href="/events" className="tag">
                      What&apos;s On
                    </Link>
                    <Link href="/people" className="tag">
                      People
                    </Link>
                    <Link href="/about" className="tag">
                      About
                    </Link>
                  </div>
                  {/* Marquee */}
                  <div className="flex-1 overflow-hidden relative h-full">
                    <div className="absolute inset-0 flex items-center animate-marquee">
                      {[...Array(4)].map((_, i) => (
                        <span
                          key={i}
                          className="shrink-0 px-4 text-text-dark font-medium text-sm uppercase tracking-wide whitespace-nowrap font-mono"
                        >
                          {marqueeText || "This Coastal Town — A series of events exploring art, culture, and community on the Suffolk coast."} ✦
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Logo Button - triggers About info */}
          <button
            onClick={() => setShowAbout(!showAbout)}
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
            <div
              className="absolute inset-0 bg-bg-dark/95 backdrop-blur-sm"
              onClick={closeMobileMenu}
            />

            {/* Menu Content */}
            <div className="relative h-full flex flex-col">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
