'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

type Sprite = {
  id: string
  src: string
  name: string
  size: number
  speed: number
}

const SPRITES: Omit<Sprite, 'id'>[] = [
  { src: '/sprites/bee.png', name: 'Bee', size: 32, speed: 0.8 },
  { src: '/sprites/beetle.png', name: 'Beetle', size: 28, speed: 0.5 },
  { src: '/sprites/dog.png', name: 'Dog', size: 40, speed: 0.6 },
  { src: '/sprites/goose.png', name: 'Goose', size: 36, speed: 0.7 },
  { src: '/sprites/squirel.png', name: 'Squirrel', size: 32, speed: 0.9 },
]

type SpriteInstance = Sprite & {
  x: number
  y: number
  targetX: number
  targetY: number
  flipped: boolean
}

function generateRandomPosition(maxX: number, maxY: number) {
  return {
    x: Math.random() * maxX,
    y: Math.random() * maxY,
  }
}

function AnimatedSprite({ sprite }: { sprite: SpriteInstance }) {
  const [target, setTarget] = useState({ x: sprite.targetX, y: sprite.targetY })
  const [flipped, setFlipped] = useState(sprite.flipped)
  const lastTargetRef = useRef({ x: sprite.x, y: sprite.y })

  useEffect(() => {
    const updateTarget = () => {
      const maxX = window.innerWidth - sprite.size
      const maxY = window.innerHeight - sprite.size
      const newTarget = generateRandomPosition(maxX, maxY)

      // Determine flip based on movement direction
      setFlipped(newTarget.x < lastTargetRef.current.x)
      lastTargetRef.current = newTarget
      setTarget(newTarget)
    }

    // Update target periodically based on sprite speed
    const baseInterval = 8000 / sprite.speed
    const interval = setInterval(updateTarget, baseInterval + Math.random() * 4000)
    return () => clearInterval(interval)
  }, [sprite.speed, sprite.size])

  return (
    <motion.div
      className="fixed pointer-events-none z-40"
      initial={{ x: sprite.x, y: sprite.y, opacity: 0 }}
      animate={{
        x: target.x,
        y: target.y,
        opacity: 1,
      }}
      transition={{
        x: { duration: 8 / sprite.speed, ease: 'linear' },
        y: { duration: 8 / sprite.speed, ease: 'linear' },
        opacity: { duration: 1 },
      }}
    >
      <Image
        src={sprite.src}
        alt={sprite.name}
        width={sprite.size}
        height={sprite.size}
        className="pixelated"
        style={{
          imageRendering: 'pixelated',
          transform: flipped ? 'scaleX(-1)' : 'none',
        }}
      />
    </motion.div>
  )
}

export function AnimatedSprites() {
  const [sprites, setSprites] = useState<SpriteInstance[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const maxX = window.innerWidth - 50
    const maxY = window.innerHeight - 50

    const instances: SpriteInstance[] = SPRITES.map((sprite, i) => {
      const start = generateRandomPosition(maxX, maxY)
      const end = generateRandomPosition(maxX, maxY)
      return {
        ...sprite,
        id: `${sprite.name}-${i}`,
        x: start.x,
        y: start.y,
        targetX: end.x,
        targetY: end.y,
        flipped: end.x < start.x,
      }
    })

    setSprites(instances)
  }, [])

  if (!mounted) return null

  return (
    <>
      {sprites.map((sprite) => (
        <AnimatedSprite key={sprite.id} sprite={sprite} />
      ))}
    </>
  )
}
