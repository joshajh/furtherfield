'use client'

import { useEffect, useRef } from 'react'

type Brandmark3DProps = {
  size?: number
  className?: string
  autoRotate?: boolean
}

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
  const lemonGradient = 'linear-gradient(135deg, #BEA6B0 0%, #BCE5F3 38%, #FFFCB9 61%, #F6F7F9 100%)'
  const lemonGradientVert = 'linear-gradient(180deg, #BEA6B0 0%, #BCE5F3 38%, #FFFCB9 61%, #F6F7F9 100%)'
  const deepGradient = 'linear-gradient(135deg, #720A08 0%, #C29ABB 39%, #D0D6FD 62%, #BEA6B0 100%)'

  const Cube = ({ transform }: { transform: string }) => (
    <div style={{ ...cubeStyle, transform }}>
      {/* Front */}
      <div style={{ ...faceStyle, transform: `translateZ(${halfCube}px)`, background: blueGradient }} />
      {/* Back */}
      <div style={{ ...faceStyle, transform: `rotateY(180deg) translateZ(${halfCube}px)`, background: lemonGradientVert }} />
      {/* Right */}
      <div style={{ ...faceStyle, transform: `rotateY(90deg) translateZ(${halfCube}px)`, background: blueGradient }} />
      {/* Left */}
      <div style={{ ...faceStyle, transform: `rotateY(-90deg) translateZ(${halfCube}px)`, background: lemonGradientVert }} />
      {/* Top */}
      <div style={{ ...faceStyle, transform: `rotateX(90deg) translateZ(${halfCube}px)`, background: lemonGradient }} />
      {/* Bottom */}
      <div style={{ ...faceStyle, transform: `rotateX(-90deg) translateZ(${halfCube}px)`, background: deepGradient }} />
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
