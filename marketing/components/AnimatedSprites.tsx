'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useSpring } from 'framer-motion'

type Sprite = {
  id: string
  src: string
  name: string
  size: number
  speed: number
  fleeDistance: number
}

const SPRITES: Omit<Sprite, 'id'>[] = [
  { src: '/sprites/bee.png', name: 'Bee', size: 32, speed: 0.8, fleeDistance: 150 },
  { src: '/sprites/beetle.png', name: 'Beetle', size: 28, speed: 0.5, fleeDistance: 100 },
  { src: '/sprites/dog.png', name: 'Dog', size: 40, speed: 0.6, fleeDistance: 120 },
  { src: '/sprites/goose.png', name: 'Goose', size: 36, speed: 0.7, fleeDistance: 180 },
  { src: '/sprites/squirel.png', name: 'Squirrel', size: 32, speed: 0.9, fleeDistance: 200 },
]

type SpriteInstance = Sprite & {
  x: number
  y: number
}

type CursorPosition = { x: number; y: number }

function AnimatedSprite({
  sprite,
  cursorPos
}: {
  sprite: SpriteInstance
  cursorPos: CursorPosition
}) {
  const [position, setPosition] = useState({ x: sprite.x, y: sprite.y })
  const [flipped, setFlipped] = useState(false)
  const basePositionRef = useRef({ x: sprite.x, y: sprite.y })
  const velocityRef = useRef({ x: 0, y: 0 })

  // Spring for smooth cursor-reactive movement - lower stiffness for smoother animation
  const springX = useSpring(sprite.x, { stiffness: 30, damping: 15 })
  const springY = useSpring(sprite.y, { stiffness: 30, damping: 15 })

  // Update base wandering position periodically
  useEffect(() => {
    const wander = () => {
      const maxX = window.innerWidth - sprite.size
      const maxY = window.innerHeight - sprite.size
      const newX = Math.random() * maxX
      const newY = Math.random() * maxY

      basePositionRef.current = { x: newX, y: newY }
    }

    wander()
    const interval = setInterval(wander, (6000 / sprite.speed) + Math.random() * 4000)
    return () => clearInterval(interval)
  }, [sprite.speed, sprite.size])

  // React to cursor position
  useEffect(() => {
    const updatePosition = () => {
      const base = basePositionRef.current
      let targetX = base.x
      let targetY = base.y

      // Calculate distance from cursor
      const dx = base.x - cursorPos.x
      const dy = base.y - cursorPos.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      // If cursor is close, flee from it
      if (distance < sprite.fleeDistance && distance > 0) {
        const fleeStrength = (1 - distance / sprite.fleeDistance) * 100
        const angle = Math.atan2(dy, dx)
        targetX = base.x + Math.cos(angle) * fleeStrength
        targetY = base.y + Math.sin(angle) * fleeStrength

        // Clamp to viewport
        targetX = Math.max(0, Math.min(window.innerWidth - sprite.size, targetX))
        targetY = Math.max(0, Math.min(window.innerHeight - sprite.size, targetY))
      }

      // Update flip based on movement direction
      const movingLeft = targetX < position.x
      setFlipped(movingLeft)

      springX.set(targetX)
      springY.set(targetY)
      setPosition({ x: targetX, y: targetY })
    }

    updatePosition()
  }, [cursorPos.x, cursorPos.y, sprite.fleeDistance, sprite.size, springX, springY, position.x])

  return (
    <motion.div
      className="fixed pointer-events-none z-40"
      style={{
        x: springX,
        y: springY,
        // Use will-change to hint GPU acceleration
        willChange: 'transform',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ opacity: { duration: 1 } }}
    >
      {/* Use img with mix-blend-mode instead of expensive backdropFilter */}
      <img
        src={sprite.src}
        alt={sprite.name}
        style={{
          width: sprite.size,
          height: sprite.size,
          transform: flipped ? 'scaleX(-1)' : 'none',
          mixBlendMode: 'difference',
          filter: 'brightness(1.2)',
        }}
        draggable={false}
      />
    </motion.div>
  )
}

export function AnimatedSprites() {
  const [sprites, setSprites] = useState<SpriteInstance[]>([])
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [cursorPos, setCursorPos] = useState<CursorPosition>({ x: -1000, y: -1000 })

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Track cursor position - throttled to reduce updates
  useEffect(() => {
    let lastUpdate = 0
    const throttleMs = 50 // Update at most 20 times per second

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastUpdate >= throttleMs) {
        lastUpdate = now
        setCursorPos({ x: e.clientX, y: e.clientY })
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    setMounted(true)

    const maxX = window.innerWidth - 50
    const maxY = window.innerHeight - 50

    const instances: SpriteInstance[] = SPRITES.map((sprite, i) => {
      return {
        ...sprite,
        id: `${sprite.name}-${i}`,
        x: Math.random() * maxX,
        y: Math.random() * maxY,
      }
    })

    setSprites(instances)
  }, [])

  // Don't render on mobile or before mounted
  if (!mounted || isMobile) return null

  return (
    <>
      {sprites.map((sprite) => (
        <AnimatedSprite
          key={sprite.id}
          sprite={sprite}
          cursorPos={cursorPos}
        />
      ))}
    </>
  )
}
