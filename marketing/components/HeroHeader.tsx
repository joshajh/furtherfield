'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { TidalGrid, generateMaritimeData } from './TidalGrid'
import { LichenContainer } from './LichenContainer'
import { Brandmark3D } from './Brandmark3D'

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
    <LichenContainer
      seed={42}
      density="dense"
      edges={['top', 'bottom', 'left', 'right']}
      className="mx-2.5"
    >
    <section className="relative rounded-lg overflow-hidden bg-gradient-brand h-[calc(100dvh-20px-56px-10px)] md:h-[calc(100vh-56px-20px-10px)]">
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

      <div className="relative p-4 pb-12 md:p-10 h-full flex flex-col">
        <AnimatePresence mode="wait">
          {showMaritimeInfo ? (
            <motion.div
              key="maritime"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="relative z-40 flex-1 flex flex-col justify-center items-center md:items-start"
            >
              <h2 className="font-display text-text-dark text-[42px] sm:text-[56px] md:text-[100px] lg:text-[140px] leading-[0.9] md:leading-none text-center md:text-left italic mb-6 md:mb-8">
                Live Data
              </h2>

              <div className="flex flex-wrap gap-2 md:gap-3 mb-6 justify-center md:justify-start">
                <div className="tag flex items-center">
                  <span className="font-display text-lg md:text-2xl mr-1 leading-none">
                    {maritimeData.tideLevel.toFixed(1)}m
                  </span>
                  <span className="opacity-70 leading-none">Tide</span>
                </div>
                <div className="tag flex items-center">
                  <span className="font-display text-lg md:text-2xl mr-1 leading-none">
                    {maritimeData.totalShips}
                  </span>
                  <span className="opacity-70 leading-none">Vessels</span>
                </div>
                <div className="tag flex items-center">
                  <span className="font-display text-lg md:text-2xl mr-1 leading-none">
                    {maritimeData.arrivals}
                  </span>
                  <span className="opacity-70 leading-none">Arriving</span>
                </div>
                <div className="tag flex items-center">
                  <span className="font-display text-lg md:text-2xl mr-1 leading-none">
                    {maritimeData.departures}
                  </span>
                  <span className="opacity-70 leading-none">Departing</span>
                </div>
              </div>

              <p className="text-text-dark/70 text-sm max-w-md leading-relaxed font-mono uppercase tracking-wide text-center md:text-left">
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
              className="relative flex-1 flex flex-col items-center md:items-start"
            >
              {/* Spacer to center the main content */}
              <div className="flex-1" />

              <div>
                {/* Animated 3D brandmark - centered above on mobile, inline on desktop */}
                <div className="flex justify-center mb-2 md:hidden">
                  <Brandmark3D size={20} />
                </div>

                <h1 className="relative z-40 font-display text-[60px] sm:text-[60px] md:text-[120px] lg:text-[150px] leading-[0.9] md:leading-none text-center md:text-left">
                  {titleLines.map((line, i) => (
                    i === 0 ? (
                      <span key={i} className="block italic text-text-dark">
                        <span className="hidden md:inline-block mr-2 -ml-1 align-top">
                          <Brandmark3D size={28} />
                        </span>
                        {line}
                      </span>
                    ) : (
                      <span key={i} className="block text-text-dark">{line}</span>
                    )
                  ))}
                </h1>

                {/* Location/Date callouts */}
                <div className="relative z-40 mt-4 flex gap-2 justify-center md:justify-start">
                  <span className="callout">FELIXSTOWE</span>
                  <span className="callout">2026</span>
                </div>

                {/* Subtitle - inline on desktop */}
                {subtitle && (
                  <p className="relative z-10 text-text-dark text-xl max-w-md mt-6 hidden md:block">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Spacer to center the main content */}
              <div className="flex-1" />

              {/* Subtitle - bottom on mobile */}
              {subtitle && (
                <p className="relative z-10 text-text-dark/70 text-sm max-w-md font-mono uppercase tracking-wide text-center md:hidden">
                  {subtitle}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{
            opacity: { delay: 1, duration: 0.5 },
            y: { delay: 1.5, duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-dark/60"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
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
    </LichenContainer>
  )
}
