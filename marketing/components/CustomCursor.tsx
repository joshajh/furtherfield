'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    const updateHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('cursor-pointer')

      setIsHovering(isInteractive)
    }

    window.addEventListener('mousemove', updatePosition)
    window.addEventListener('mousemove', updateHoverState)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', updatePosition)
      window.removeEventListener('mousemove', updateHoverState)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-4px, -4px)',
      }}
    >
      <Image
        src={isHovering ? '/CursorHover.png' : '/CursorDefault.png'}
        alt=""
        width={100}
        height={115}
        className="pointer-events-none"
        priority
      />
    </div>
  )
}
