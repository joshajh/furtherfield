'use client'

type BrandmarkAcidTopProps = {
  size?: number
  className?: string
  autoRotate?: boolean
}

/**
 * 3D CSS rotating version of the brandmark with acid yellow upward-facing faces
 * Uses CSS animation instead of JS for better performance
 */
export function BrandmarkAcidTop({ size = 40, className = '', autoRotate = true }: BrandmarkAcidTopProps) {

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
      {/* Top - acid yellow (upward facing) - CHANGED from original */}
      <div style={{ ...faceStyle, transform: `rotateX(90deg) translateZ(${halfCube}px)`, background: acidColor }} />
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
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: 'rotateX(-30deg) rotateY(-45deg)',
          // Use CSS animation for GPU-accelerated rotation
          animation: autoRotate ? 'brandmark-spin 20s linear infinite' : 'none',
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
