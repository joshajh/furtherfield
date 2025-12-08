'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { generateMaritimeData } from './TidalGrid'

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [tideMenuOpen, setTideMenuOpen] = useState(false)
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
      <nav className="flex items-start justify-between gap-2.5 relative z-50">
      {/* Logo Button */}
      <button
        onClick={() => setTideMenuOpen(!tideMenuOpen)}
        className="shrink-0 rounded-lg bg-gradient-brand px-5 py-4 hover:opacity-90 transition-opacity"
        aria-label="Toggle maritime information"
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
      <div className="flex-1 rounded-lg bg-gradient-brand overflow-hidden">
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

      {/* Nav Items */}
      <div className="relative">
        <div className="rounded-lg bg-gradient-brand px-5 py-4 flex items-center gap-8">
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/#programme"
              className="text-text-dark font-semibold text-lg tracking-tight hover:opacity-70 transition-opacity"
            >
              Programme
            </Link>
            <Link
              href="/about"
              className="text-text-dark font-semibold text-lg tracking-tight hover:opacity-70 transition-opacity"
            >
              About
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-6 h-6 flex flex-col items-center justify-center gap-1.5"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={mobileMenuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              className="w-5 h-0.5 bg-text-dark block"
            />
            <motion.span
              animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-5 h-0.5 bg-text-dark block"
            />
            <motion.span
              animate={mobileMenuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
              className="w-5 h-0.5 bg-text-dark block"
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden absolute right-0 top-full mt-2.5 rounded-lg bg-gradient-brand overflow-hidden"
            >
              <div className="flex flex-col gap-4 p-5">
                <Link
                  href="/#programme"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-text-dark font-semibold text-xl tracking-tight whitespace-nowrap"
                >
                  Programme
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-text-dark font-semibold text-xl tracking-tight whitespace-nowrap"
                >
                  About
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </nav>

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
    </div>
  )
}
