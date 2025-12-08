'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { TidalGrid } from './TidalGrid'

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

  return (
    <section className="relative rounded-lg overflow-hidden bg-gradient-brand mx-2.5 pt-16">
      {showTidalGrid && (
        <TidalGrid
          className="absolute inset-0 w-full h-full opacity-[0.15] pointer-events-none"
          gridSize={16}
          waveAmplitude={6}
          waveFrequency={2.5}
          strokeColor="#0F0E0E"
          strokeWidth={0.5}
          animationSpeed={0.00008}
        />
      )}

      <div className="relative p-10">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-40 font-display text-text-dark text-[60px] md:text-[100px] lg:text-[140px] leading-none"
        >
          {titleLines.map((line, i) => (
            <span key={i} className={i === 0 ? 'italic block' : 'block'}>
              {line}
            </span>
          ))}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative z-10 text-text-dark text-xl max-w-md mt-6"
          >
            {subtitle}
          </motion.p>
        )}
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
