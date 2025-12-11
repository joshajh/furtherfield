'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { TidalGrid, generateMaritimeData } from './TidalGrid'

type HeroHeaderProps = {
  title?: string
  subtitle?: string
  showTidalGrid?: boolean
}

export function HeroHeader({
  title = 'Reimagine\nThis Coastal Town',
  subtitle,
  showTidalGrid = true,
}: HeroHeaderProps) {
  const titleLines = title.split('\n')
  const [showMaritimeInfo, setShowMaritimeInfo] = useState(false)
  const [maritimeData, setMaritimeData] = useState(() => generateMaritimeData())

  useEffect(() => {
    setMaritimeData(generateMaritimeData())
    const interval = setInterval(() => {
      setMaritimeData(generateMaritimeData())
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative rounded-lg overflow-hidden bg-gradient-brand mx-2.5 pt-16">
      {/* SVG Filter for weathered text effect */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="weathered-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      {showTidalGrid && (
        <TidalGrid
          className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
          gridSize={16}
          waveAmplitude={6}
          waveFrequency={2.5}
          strokeColor="#9A8B55"
          strokeWidth={0.8}
          animationSpeed={0.00015}
        />
      )}

      {/* ? Button - top right */}
      <button
        onClick={() => setShowMaritimeInfo(!showMaritimeInfo)}
        className="tag absolute top-4 right-4 z-50"
        aria-label="Toggle maritime information"
      >
        ?
      </button>

      <div className="relative p-10">
        <AnimatePresence mode="wait">
          {showMaritimeInfo ? (
            <motion.div
              key="maritime"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="relative z-40"
            >
              <h2 className="font-display text-text-dark text-[60px] md:text-[100px] lg:text-[140px] leading-none mb-4">
                Live Data
              </h2>

              <div className="flex flex-wrap gap-4 mb-4">
                <div className="bg-text-dark/10 rounded-lg px-4 py-2">
                  <div className="text-text-dark font-bold text-2xl md:text-3xl">
                    {maritimeData.tideLevel.toFixed(1)}m
                  </div>
                  <div className="text-text-dark/70 text-xs">
                    Tide AOD
                  </div>
                </div>
                <div className="bg-text-dark/10 rounded-lg px-4 py-2">
                  <div className="text-text-dark font-bold text-2xl md:text-3xl">
                    {maritimeData.totalShips}
                  </div>
                  <div className="text-text-dark/70 text-xs">
                    Vessels
                  </div>
                </div>
                <div className="bg-text-dark/10 rounded-lg px-4 py-2">
                  <div className="text-text-dark font-bold text-2xl md:text-3xl">
                    {maritimeData.arrivals}
                  </div>
                  <div className="text-text-dark/70 text-xs">
                    Arriving
                  </div>
                </div>
                <div className="bg-text-dark/10 rounded-lg px-4 py-2">
                  <div className="text-text-dark font-bold text-2xl md:text-3xl">
                    {maritimeData.departures}
                  </div>
                  <div className="text-text-dark/70 text-xs">
                    Departing
                  </div>
                </div>
              </div>

              <p className="text-text-dark/80 text-sm max-w-xl leading-relaxed">
                Live tidal and marine traffic data from the Port of Felixstowe, the UK&apos;s busiest container port.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="relative"
            >
              <h1 className="relative z-40 font-display text-[60px] md:text-[100px] leading-none weathered-text">
                {titleLines.map((line, i) => (
                  i === 0 ? (
                    <span key={i} className="block relative italic">
                      <Image
                        src="/svg-icon.svg"
                        alt=""
                        width={40}
                        height={40}
                        className="inline-block mr-2 -ml-1 align-top animate-spin-slow"
                        aria-hidden="true"
                      />
                      <span className="glitch-base-text text-gradient-dark">{line}</span>
                      <span className="absolute inset-0 left-[1em] glitch-shadow-text text-treatment-acid" aria-hidden="true">
                        {line}
                      </span>
                    </span>
                  ) : (
                    <span key={i} className="block text-gradient-dark">{line}</span>
                  )
                ))}
              </h1>


              {/* Location/Date tags */}
              <div className="relative z-40 mt-4 flex gap-2">
                <span className="tag">FELIXSTOWE</span>
                <span className="tag">2026</span>
              </div>

              {subtitle && (
                <p className="relative z-10 text-text-dark text-xl max-w-md mt-6">
                  {subtitle}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-0 translate-x-[70%] translate-y-[55%]">
        <Image
          src="/felixstowe-containers-optimized.png"
          alt="Felixstowe container port"
          width={1600}
          height={567}
          className="w-full h-auto"
          priority
        />
      </div>
    </section>
  )
}
