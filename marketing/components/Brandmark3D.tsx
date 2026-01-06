'use client'

import { useEffect, useRef } from 'react'

type Brandmark3DProps = {
  size?: number
  className?: string
  autoRotate?: boolean
}

// Lichen images for texturing rearward faces
const lichenImages = [
  '/lichen/lichen-1.png',
  '/lichen/lichen-2.png',
  '/lichen/lichen-3.png',
  '/lichen/lichen-4.png',
]

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

  // Helper to create lichen background style with blue gradient behind
  const lichenBg = (index: number): React.CSSProperties => ({
    backgroundImage: `url(${lichenImages[index % lichenImages.length]}), ${blueGradient}`,
    backgroundSize: 'cover, 100% 100%',
    backgroundPosition: 'center, center',
  })

  const Cube = ({ transform, cubeIndex }: { transform: string; cubeIndex: number }) => (
    <div style={{ ...cubeStyle, transform }}>
      {/* Front - blue gradient */}
      <div style={{ ...faceStyle, transform: `translateZ(${halfCube}px)`, background: blueGradient }} />
      {/* Back - lichen */}
      <div style={{ ...faceStyle, transform: `rotateY(180deg) translateZ(${halfCube}px)`, ...lichenBg(cubeIndex) }} />
      {/* Right - blue gradient */}
      <div style={{ ...faceStyle, transform: `rotateY(90deg) translateZ(${halfCube}px)`, background: blueGradient }} />
      {/* Left - lichen */}
      <div style={{ ...faceStyle, transform: `rotateY(-90deg) translateZ(${halfCube}px)`, ...lichenBg(cubeIndex + 1) }} />
      {/* Top - blue gradient (upward facing) */}
      <div style={{ ...faceStyle, transform: `rotateX(90deg) translateZ(${halfCube}px)`, background: blueGradient }} />
      {/* Bottom - lichen */}
      <div style={{ ...faceStyle, transform: `rotateX(-90deg) translateZ(${halfCube}px)`, ...lichenBg(cubeIndex + 3) }} />
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
        <Cube transform={`translate3d(${-halfCube}px, ${-cubeSize}px, ${-halfCube}px)`} cubeIndex={0} />
        {/* Cube 2: middle-back-right */}
        <Cube transform={`translate3d(${halfCube}px, 0px, ${-halfCube}px)`} cubeIndex={1} />
        {/* Cube 3: middle-front-left */}
        <Cube transform={`translate3d(${-halfCube}px, 0px, ${halfCube}px)`} cubeIndex={2} />
        {/* Cube 4: bottom-front-right (lowest) */}
        <Cube transform={`translate3d(${halfCube}px, ${cubeSize}px, ${halfCube}px)`} cubeIndex={3} />
      </div>
    </div>
  )
}
