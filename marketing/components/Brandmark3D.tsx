'use client'

import { useEffect, useRef } from 'react'

type BrandmarkProps = {
  size?: number
  className?: string
}

type Brandmark3DProps = BrandmarkProps & {
  autoRotate?: boolean
}

/**
 * Static SVG version of the brandmark - lightweight, no animation
 * Use this for navbars, footers, and places where you don't need rotation
 * Matches the Brandmark3D appearance at its default static angle
 */
export function BrandmarkSVG({ size = 40, className = '' }: BrandmarkProps) {
  return (
    <svg
      width={size * 2.5}
      height={size * 2.5}
      viewBox="0 0 100 100"
      className={className}
      aria-label="Furtherfield brandmark"
    >
      <defs>
        <linearGradient id="brandmark-blue-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#BCE5F3" />
          <stop offset="100%" stopColor="#D0D6FD" />
        </linearGradient>
      </defs>

      {/* 4 cubes in diagonal staircase pattern - matches Brandmark3D at rotateX(-30deg) rotateY(-45deg) */}

      {/* Cube 1: Top-back-left (highest) */}
      <g transform="translate(35, 20)">
        <polygon points="0,0 12,7 0,14 -12,7" fill="url(#brandmark-blue-gradient)" stroke="#0F0E0E" strokeWidth="0.5" />
        <polygon points="-12,7 0,14 0,28 -12,21" fill="rgba(200, 255, 0, 0.85)" stroke="#0F0E0E" strokeWidth="0.5" />
        <polygon points="12,7 0,14 0,28 12,21" fill="url(#brandmark-blue-gradient)" stroke="#0F0E0E" strokeWidth="0.5" />
      </g>

      {/* Cube 2: Middle-back-right */}
      <g transform="translate(59, 34)">
        <polygon points="0,0 12,7 0,14 -12,7" fill="url(#brandmark-blue-gradient)" stroke="#0F0E0E" strokeWidth="0.5" />
        <polygon points="-12,7 0,14 0,28 -12,21" fill="rgba(200, 255, 0, 0.85)" stroke="#0F0E0E" strokeWidth="0.5" />
        <polygon points="12,7 0,14 0,28 12,21" fill="url(#brandmark-blue-gradient)" stroke="#0F0E0E" strokeWidth="0.5" />
      </g>

      {/* Cube 3: Middle-front-left */}
      <g transform="translate(35, 48)">
        <polygon points="0,0 12,7 0,14 -12,7" fill="url(#brandmark-blue-gradient)" stroke="#0F0E0E" strokeWidth="0.5" />
        <polygon points="-12,7 0,14 0,28 -12,21" fill="rgba(200, 255, 0, 0.85)" stroke="#0F0E0E" strokeWidth="0.5" />
        <polygon points="12,7 0,14 0,28 12,21" fill="url(#brandmark-blue-gradient)" stroke="#0F0E0E" strokeWidth="0.5" />
      </g>

      {/* Cube 4: Bottom-front-right (lowest) */}
      <g transform="translate(59, 62)">
        <polygon points="0,0 12,7 0,14 -12,7" fill="url(#brandmark-blue-gradient)" stroke="#0F0E0E" strokeWidth="0.5" />
        <polygon points="-12,7 0,14 0,28 -12,21" fill="rgba(200, 255, 0, 0.85)" stroke="#0F0E0E" strokeWidth="0.5" />
        <polygon points="12,7 0,14 0,28 12,21" fill="url(#brandmark-blue-gradient)" stroke="#0F0E0E" strokeWidth="0.5" />
      </g>
    </svg>
  )
}

/**
 * 3D CSS rotating version of the brandmark
 * Use this for hero sections and places where animation adds value
 */
export function Brandmark3D({ size = 40, className = '', autoRotate = true }: Brandmark3DProps) {
  const shapeRef = useRef<HTMLDivElement>(null)
  const rotationRef = useRef({ x: -30, y: -45 })
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (!autoRotate || !shapeRef.current) return

    const animate = () => {
      rotationRef.current.y += 0.5
      if (shapeRef.current) {
        shapeRef.current.style.transform = `rotateX(${rotationRef.current.x}deg) rotateY(${rotationRef.current.y}deg)`
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [autoRotate])

  const cubeSize = size
  const halfCube = cubeSize / 2

  const cubeStyle: React.CSSProperties = {
    position: 'absolute',
    width: cubeSize,
    height: cubeSize,
    transformStyle: 'preserve-3d',
    left: '50%',
    top: '50%',
    marginLeft: -halfCube,
    marginTop: -halfCube,
  }

  const faceStyle: React.CSSProperties = {
    position: 'absolute',
    width: cubeSize,
    height: cubeSize,
    border: '0.5px solid #0F0E0E',
    boxSizing: 'border-box',
  }

  const blueGradient = 'linear-gradient(180deg, #BCE5F3 0%, #D0D6FD 100%)'
  const acidColor = 'rgba(200, 255, 0, 0.85)'

  const Cube = ({ transform }: { transform: string }) => (
    <div style={{ ...cubeStyle, transform }}>
      {/* Front - blue gradient */}
      <div style={{ ...faceStyle, transform: `translateZ(${halfCube}px)`, background: blueGradient }} />
      {/* Back - acid */}
      <div style={{ ...faceStyle, transform: `rotateY(180deg) translateZ(${halfCube}px)`, background: acidColor }} />
      {/* Right - blue gradient */}
      <div style={{ ...faceStyle, transform: `rotateY(90deg) translateZ(${halfCube}px)`, background: blueGradient }} />
      {/* Left - acid */}
      <div style={{ ...faceStyle, transform: `rotateY(-90deg) translateZ(${halfCube}px)`, background: acidColor }} />
      {/* Top - blue gradient (upward facing) */}
      <div style={{ ...faceStyle, transform: `rotateX(90deg) translateZ(${halfCube}px)`, background: blueGradient }} />
      {/* Bottom - acid */}
      <div style={{ ...faceStyle, transform: `rotateX(-90deg) translateZ(${halfCube}px)`, background: acidColor }} />
    </div>
  )

  return (
    <div
      className={className}
      style={{
        width: size * 2.5,
        height: size * 2.5,
        perspective: size * 10,
      }}
    >
      <div
        ref={shapeRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: 'rotateX(-30deg) rotateY(-45deg)',
        }}
      >
        {/* Cube 1: top-back-left (highest) */}
        <Cube transform={`translate3d(${-halfCube}px, ${-cubeSize}px, ${-halfCube}px)`} />
        {/* Cube 2: middle-back-right */}
        <Cube transform={`translate3d(${halfCube}px, 0px, ${-halfCube}px)`} />
        {/* Cube 3: middle-front-left */}
        <Cube transform={`translate3d(${-halfCube}px, 0px, ${halfCube}px)`} />
        {/* Cube 4: bottom-front-right (lowest) */}
        <Cube transform={`translate3d(${halfCube}px, ${cubeSize}px, ${halfCube}px)`} />
      </div>
    </div>
  )
}
