'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function H1DemoPage() {
  return (
    <div className="min-h-screen bg-bg-dark p-8">
      {/* SVG Filters */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="weathered-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <h2 className="text-text-light text-2xl mb-8 font-mono">H1 Style Prototypes</h2>

      <div className="space-y-16">
        {/* Option 1: Glitchy Lichen Texture */}
        <DemoSection number={1} title="Glitchy Lichen Texture">
          <GlitchyLichenH1 />
        </DemoSection>

        {/* Option 2: RPG Quest Text */}
        <DemoSection number={2} title="RPG Quest Text">
          <RPGQuestH1 />
        </DemoSection>

        {/* Option 3: Mycelium Network */}
        <DemoSection number={3} title="Mycelium Network">
          <MyceliumH1 />
        </DemoSection>

        {/* Option 4: Solarpunk Gradient + Scanlines */}
        <DemoSection number={4} title="Solarpunk Gradient + Scanlines">
          <SolarpunkH1 />
        </DemoSection>

        {/* Option 5: Weathered/Eroded Letters */}
        <DemoSection number={5} title="Weathered/Eroded Letters">
          <WeatheredH1 />
        </DemoSection>

        {/* Option 6: Dual-state Hover Transform */}
        <DemoSection number={6} title="Dual-state Hover Transform">
          <DualStateH1 />
        </DemoSection>

        {/* Option 7: Procedural Moss Growth */}
        <DemoSection number={7} title="Procedural Moss Growth">
          <MossGrowthH1 />
        </DemoSection>
      </div>
    </div>
  )
}

function DemoSection({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl overflow-hidden">
      <div className="bg-text-dark/20 px-4 py-2 flex items-center gap-3">
        <span className="bg-treatment-acid text-text-dark text-sm font-bold px-2 py-0.5 rounded">
          {number}
        </span>
        <span className="text-text-light font-mono text-sm">{title}</span>
      </div>
      <div className="bg-gradient-brand p-10 min-h-[300px] flex items-center justify-center">
        {children}
      </div>
    </section>
  )
}

// ============================================
// OPTION 1: Combined - Glitch + RPG + Scanlines + Weathered
// ============================================
function GlitchyLichenH1() {
  return (
    <div className="text-left relative w-full">
      <h1 className="font-display text-[60px] md:text-[100px] leading-none text-text-dark weathered-text">
        {/* Reimagine - with glitch effect */}
        <span className="block relative italic">
          {/* Base layer */}
          <span className="glitch-base-text">
            Reimagine
          </span>
          {/* Glitch layer */}
          <span
            className="absolute inset-0 glitch-shadow-text text-text-dark/70"
            aria-hidden="true"
          >
            Reimagine
          </span>
        </span>
        {/* This Coastal Town - static */}
        <span className="block">
          This Coastal Town
        </span>
      </h1>

      {/* Scanlines overlay */}
      <div className="scanlines absolute inset-0 pointer-events-none rounded" />

      {/* Location/Date tags */}
      <div className="mt-4 flex gap-2">
        <span className="text-text-dark/40 text-[10px] font-mono border border-text-dark/20 px-2 py-0.5 rounded">
          FELIXSTOWE
        </span>
        <span className="text-text-dark/40 text-[10px] font-mono border border-text-dark/20 px-2 py-0.5 rounded">
          2026
        </span>
      </div>
    </div>
  )
}

// ============================================
// OPTION 2: RPG Quest Text
// ============================================
function RPGQuestH1() {
  const [displayText, setDisplayText] = useState('')
  const fullText = 'Reimagine This Coastal Town'

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setDisplayText(fullText.slice(0, i))
        i++
      } else {
        clearInterval(interval)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-center relative">
      <div className="rpg-scroll-bg absolute inset-0 -m-8 rounded-lg opacity-30" />
      <div className="relative">
        <span className="text-text-dark/60 text-xs tracking-[0.3em] uppercase font-mono block mb-2">
          &#9670; New Quest Available &#9670;
        </span>
        <h1 className="font-display text-[50px] md:text-[80px] leading-none text-text-dark">
          <span className="rpg-brackets">
            <span className="italic">{displayText.split(' ').slice(0, 1).join(' ')}</span>
            {displayText.includes(' ') && <br />}
            <span>{displayText.split(' ').slice(1).join(' ')}</span>
            <span className="rpg-cursor">|</span>
          </span>
        </h1>
        <div className="mt-4 flex justify-center gap-2">
          <span className="text-text-dark/50 text-xs font-mono border border-text-dark/30 px-2 py-0.5 rounded">
            LVL 1
          </span>
          <span className="text-text-dark/50 text-xs font-mono border border-text-dark/30 px-2 py-0.5 rounded">
            MAIN QUEST
          </span>
        </div>
      </div>
    </div>
  )
}

// ============================================
// OPTION 3: Mycelium Network
// ============================================
function MyceliumH1() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [paths, setPaths] = useState<string[]>([])

  useEffect(() => {
    // Generate organic connecting lines
    const generatePaths = () => {
      const newPaths: string[] = []
      for (let i = 0; i < 15; i++) {
        const startX = Math.random() * 100
        const startY = 30 + Math.random() * 40
        const endX = Math.random() * 100
        const endY = 30 + Math.random() * 40
        const cp1x = startX + (Math.random() - 0.5) * 30
        const cp1y = startY + (Math.random() - 0.5) * 20
        const cp2x = endX + (Math.random() - 0.5) * 30
        const cp2y = endY + (Math.random() - 0.5) * 20
        newPaths.push(`M${startX},${startY} C${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`)
      }
      return newPaths
    }
    setPaths(generatePaths())
  }, [])

  return (
    <div className="relative w-full">
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {paths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke="#4a7c59"
            strokeWidth="0.3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 2 + Math.random() * 2, delay: i * 0.1, ease: "easeOut" }}
          />
        ))}
        {/* Spore nodes */}
        {paths.map((_, i) => (
          <motion.circle
            key={`node-${i}`}
            cx={Math.random() * 100}
            cy={30 + Math.random() * 40}
            r="0.8"
            fill="#c8ff00"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ duration: 0.5, delay: 1 + i * 0.15 }}
          />
        ))}
      </svg>
      <h1 className="relative z-10 font-display text-[60px] md:text-[100px] leading-none text-center text-text-dark">
        <span className="italic block">Reimagine</span>
        <span className="block">This Coastal Town</span>
      </h1>
    </div>
  )
}

// ============================================
// OPTION 4: Solarpunk Gradient + Scanlines
// ============================================
function SolarpunkH1() {
  return (
    <div className="relative">
      <h1 className="font-display text-[60px] md:text-[100px] leading-none text-center solarpunk-text">
        <span className="italic block">Reimagine</span>
        <span className="block">This Coastal Town</span>
      </h1>
      <div className="scanlines absolute inset-0 pointer-events-none" />
    </div>
  )
}

// ============================================
// OPTION 5: Weathered/Eroded Letters
// ============================================
function WeatheredH1() {
  return (
    <h1 className="weathered-text font-display text-[60px] md:text-[100px] leading-none text-center text-text-dark">
      <span className="italic block">Reimagine</span>
      <span className="block">This Coastal Town</span>
    </h1>
  )
}

// ============================================
// OPTION 6: Dual-state Hover Transform
// ============================================
function DualStateH1() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="cursor-pointer select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h1 className="text-[60px] md:text-[100px] leading-none text-center text-text-dark transition-all duration-500">
        <motion.span
          className="block"
          animate={{
            fontFamily: isHovered ? 'var(--font-instrument-serif), serif' : 'var(--font-geist-mono), monospace',
            fontStyle: isHovered ? 'italic' : 'normal',
            letterSpacing: isHovered ? '-0.02em' : '0.05em',
          }}
          transition={{ duration: 0.4 }}
        >
          Reimagine
        </motion.span>
        <motion.span
          className="block"
          animate={{
            fontFamily: isHovered ? 'var(--font-playfair), serif' : 'var(--font-geist-mono), monospace',
            letterSpacing: isHovered ? '-0.02em' : '0.02em',
          }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          This Coastal Town
        </motion.span>
      </h1>
      <p className="text-center text-text-dark/50 text-xs mt-4 font-mono">
        {isHovered ? '[ NATURE MODE ]' : '[ DIGITAL MODE ]'} — hover to transform
      </p>
    </div>
  )
}

// ============================================
// OPTION 7: Procedural Moss Growth
// ============================================
function MossGrowthH1() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [particles, setParticles] = useState<Array<{x: number; y: number; size: number; opacity: number; growing: boolean}>>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Initialize particles along text edges (simplified simulation)
    const newParticles: typeof particles = []
    for (let i = 0; i < 200; i++) {
      newParticles.push({
        x: Math.random() * canvas.width,
        y: 50 + Math.random() * (canvas.height - 100),
        size: 0,
        opacity: 0,
        growing: true
      })
    }
    setParticles(newParticles)

    let animationId: number
    let frame = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      newParticles.forEach((p, i) => {
        if (frame > i * 2 && p.growing) {
          p.size = Math.min(p.size + 0.05, 2 + Math.random() * 2)
          p.opacity = Math.min(p.opacity + 0.02, 0.7)
        }

        // Draw moss particle
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
        gradient.addColorStop(0, `rgba(200, 255, 0, ${p.opacity})`)
        gradient.addColorStop(0.5, `rgba(100, 180, 50, ${p.opacity * 0.7})`)
        gradient.addColorStop(1, `rgba(50, 100, 30, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      frame++
      if (frame < 500) {
        animationId = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={200}
        className="absolute inset-0 w-full h-full pointer-events-none mix-blend-multiply"
      />
      <h1 className="relative z-10 font-display text-[60px] md:text-[100px] leading-none text-center text-text-dark">
        <span className="italic block">Reimagine</span>
        <span className="block">This Coastal Town</span>
      </h1>
    </div>
  )
}
