'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { generateMaritimeData } from './TidalGrid'

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [tideLevel, setTideLevel] = useState(1)

  useEffect(() => {
    setTideLevel(generateMaritimeData().tideLevel)
    const interval = setInterval(() => {
      setTideLevel(generateMaritimeData().tideLevel)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <nav className="sticky top-2.5 z-50 mx-2.5 flex items-start justify-between gap-2.5">
      {/* Tide Data */}
      <Link
        href="/"
        className="shrink-0 rounded-lg bg-gradient-brand px-5 py-4 font-bold text-xl text-text-dark hover:opacity-90 transition-opacity"
      >
        {tideLevel.toFixed(1)}m AOD
      </Link>

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
  )
}
