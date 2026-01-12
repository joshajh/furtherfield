'use client'

type CubeDividerProps = {
  size?: number
  className?: string
}

/**
 * A single 3D cube used as a divider between elements
 * Matches the cube style from Brandmark3D
 */
export function CubeDivider({ size = 8, className = '' }: CubeDividerProps) {
  const halfSize = size / 2

  const faceStyle: React.CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    border: '0.5px solid #0F0E0E',
    boxSizing: 'border-box',
  }

  const blueGradient = 'linear-gradient(180deg, #BCE5F3 0%, #D0D6FD 100%)'
  const acidColor = 'rgba(200, 255, 0, 0.85)'

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        perspective: size * 4,
        display: 'inline-block',
        verticalAlign: 'middle',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: 'rotateX(-20deg) rotateY(-45deg)',
        }}
      >
        {/* Front - blue gradient */}
        <div style={{ ...faceStyle, transform: `translateZ(${halfSize}px)`, background: blueGradient }} />
        {/* Back - acid */}
        <div style={{ ...faceStyle, transform: `rotateY(180deg) translateZ(${halfSize}px)`, background: acidColor }} />
        {/* Right - blue gradient */}
        <div style={{ ...faceStyle, transform: `rotateY(90deg) translateZ(${halfSize}px)`, background: blueGradient }} />
        {/* Left - acid */}
        <div style={{ ...faceStyle, transform: `rotateY(-90deg) translateZ(${halfSize}px)`, background: acidColor }} />
        {/* Top - blue gradient */}
        <div style={{ ...faceStyle, transform: `rotateX(90deg) translateZ(${halfSize}px)`, background: blueGradient }} />
        {/* Bottom - acid */}
        <div style={{ ...faceStyle, transform: `rotateX(-90deg) translateZ(${halfSize}px)`, background: acidColor }} />
      </div>
    </div>
  )
}
