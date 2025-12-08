'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { generateMaritimeData } from './TidalGrid'

export function Navigation() {
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false)
  const [tideMenuOpen, setTideMenuOpen] = useState(false)
  const [navMenuOpen, setNavMenuOpen] = useState(false)
  const [maritimeData, setMaritimeData] = useState(() => generateMaritimeData())

  useEffect(() => {
    setMaritimeData(generateMaritimeData())
    const interval = setInterval(() => {
      setMaritimeData(generateMaritimeData())
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="sticky top-2.5 mx-2.5 z-40">
      <nav className="flex items-stretch justify-between gap-2.5 relative z-50">
      {/* Logo Button - triggers About info */}
      <button
        onClick={() => setAboutMenuOpen(!aboutMenuOpen)}
        className="shrink-0 rounded-lg bg-gradient-brand px-4 flex items-center justify-center hover:opacity-90 transition-opacity"
        aria-label="Toggle about information"
      >
        <Image
          src="/f-mark-white-trans.png"
          alt="Furtherfield"
          width={24}
          height={24}
          className="invert"
        />
      </button>

      {/* Marquee Ticker */}
      <div className="flex-1 rounded-lg bg-gradient-brand overflow-hidden flex items-center">
        <div className="py-4 flex animate-marquee">
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="shrink-0 px-8 text-text-dark font-semibold text-lg tracking-tight whitespace-nowrap"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ✦
            </span>
          ))}
        </div>
      </div>

      {/* Maritime Data Button - triggers tide/traffic info */}
      <button
        onClick={() => setTideMenuOpen(!tideMenuOpen)}
        className="shrink-0 rounded-lg bg-gradient-brand px-4 flex items-center justify-center hover:opacity-90 transition-opacity"
        aria-label="Toggle maritime information"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 32"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinejoin="round"
          className="w-10 h-7 text-text-dark"
        >
          {/* Isometric wave pattern - three rows */}
          <path d="M0 8 L8 4 L16 8 L24 4 L32 8 L40 4 L48 8" />
          <path d="M0 16 L8 12 L16 16 L24 12 L32 16 L40 12 L48 16" />
          <path d="M0 24 L8 20 L16 24 L24 20 L32 24 L40 20 L48 24" />
          {/* Vertical connections for isometric effect */}
          <path d="M8 4 L8 12" />
          <path d="M24 4 L24 12" />
          <path d="M40 4 L40 12" />
          <path d="M16 8 L16 16" />
          <path d="M32 8 L32 16" />
          <path d="M8 12 L8 20" />
          <path d="M24 12 L24 20" />
          <path d="M40 12 L40 20" />
          <path d="M16 16 L16 24" />
          <path d="M32 16 L32 24" />
        </svg>
      </button>

      {/* Nav Menu Button */}
      <button
        onClick={() => setNavMenuOpen(!navMenuOpen)}
        className="shrink-0 rounded-lg bg-gradient-brand px-4 flex items-center justify-center hover:opacity-90 transition-opacity"
        aria-label="Toggle navigation menu"
      >
        <Image
          src="/svg-icon.svg"
          alt="Menu"
          width={40}
          height={40}
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
            className="relative z-20 rounded-lg bg-gradient-brand overflow-hidden"
          >
            <div className="px-5 py-4">
              <p className="text-text-dark text-sm leading-relaxed">
                Furtherfield is a leading international arts organisation exploring the intersections of art, technology and social change. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p className="text-text-dark text-sm leading-relaxed mt-2">
                Furtherfield is committed to building and sustaining creative networks across borders and boundaries, working with artists, technologists, thinkers and communities worldwide. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Maritime Data Row - below nav, behind lichen border */}
      <AnimatePresence>
        {tideMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 10 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            className="relative z-20 rounded-lg bg-gradient-brand overflow-hidden"
          >
            <div className="flex items-stretch">
              {/* Tide Metric */}
              <div className="shrink-0 w-32 px-4 py-2 border-r border-text-dark/10">
                <div className="text-text-dark font-bold text-lg">
                  {maritimeData.tideLevel.toFixed(1)}m
                </div>
                <div className="text-text-dark/70 text-xs">
                  Tide level AOD
                </div>
              </div>

              {/* Tide Description */}
              <div className="flex-1 px-4 py-2 border-r border-text-dark/10">
                <p className="text-text-dark/80 text-xs leading-relaxed">
                  Live tidal data from the UK Environment Agency, measured at the nearest gauge to Felixstowe.
                  The tide follows a roughly 12.5-hour cycle, influencing port operations and the rhythm of coastal life.
                </p>
              </div>

              {/* Traffic Metric */}
              <div className="shrink-0 w-32 px-4 py-2 border-r border-text-dark/10">
                <div className="text-text-dark font-bold text-lg">
                  {maritimeData.totalShips}
                </div>
                <div className="text-text-dark/70 text-xs">
                  Vessels active
                </div>
              </div>

              {/* Traffic Description */}
              <div className="flex-1 px-4 py-2">
                <p className="text-text-dark/80 text-xs leading-relaxed">
                  Marine traffic at the Port of Felixstowe, the UK&apos;s busiest container port.
                  Currently {maritimeData.arrivals} arriving, {maritimeData.departures} departing.
                  This data shapes the generative patterns throughout the site.
                </p>
              </div>
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
            className="relative z-20 rounded-lg bg-gradient-brand overflow-hidden"
          >
            <div className="flex items-center justify-end gap-8 px-5 py-4">
              <Link
                href="/#programme"
                onClick={() => setNavMenuOpen(false)}
                className="text-text-dark font-semibold text-lg tracking-tight hover:opacity-70 transition-opacity"
              >
                Programme
              </Link>
              <Link
                href="/about"
                onClick={() => setNavMenuOpen(false)}
                className="text-text-dark font-semibold text-lg tracking-tight hover:opacity-70 transition-opacity"
              >
                About
              </Link>
              <Link
                href="/"
                onClick={() => setNavMenuOpen(false)}
                className="text-text-dark font-semibold text-lg tracking-tight hover:opacity-70 transition-opacity flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <circle cx="12" cy="5" r="3" />
                  <line x1="12" y1="8" x2="12" y2="21" />
                  <path d="M5 12h14" />
                  <path d="M5 12c0 4 3 7 7 9" />
                  <path d="M19 12c0 4-3 7-7 9" />
                </svg>
                Home
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
