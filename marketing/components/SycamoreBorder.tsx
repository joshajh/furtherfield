'use client'

export function SycamoreBorder() {
  return (
    <div className="fixed inset-0 pointer-events-none z-30" aria-hidden="true">
      {/* Top Left Corner - Branch with leaves */}
      <svg
        className="absolute top-0 left-0 w-48 h-48 text-text-light/50"
        viewBox="0 0 200 200"
        fill="none"
      >
        {/* Main branch */}
        <path
          d="M0 0 Q40 20 60 60 Q70 90 65 120"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Secondary branch */}
        <path
          d="M30 30 Q50 35 70 30"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Sycamore leaf 1 - palmate shape */}
        <path
          d="M60 60 L55 45 L60 50 L65 42 L68 52 L78 48 L72 58 L82 62 L70 65 L72 75 L62 68 L55 78 L58 66 L48 65 L58 60 Z"
          fill="currentColor"
          opacity="0.6"
        />
        {/* Sycamore leaf 2 */}
        <path
          d="M85 25 L82 15 L86 18 L90 12 L92 20 L100 18 L95 25 L102 28 L93 30 L94 38 L87 32 L82 40 L84 30 L76 29 L84 26 Z"
          fill="currentColor"
          opacity="0.4"
        />
        {/* Winged seed (samara) */}
        <g transform="translate(35, 85) rotate(-30)">
          <ellipse cx="0" cy="0" rx="3" ry="5" fill="currentColor" opacity="0.5" />
          <path
            d="M0 -5 Q8 -15 5 -30 Q2 -20 0 -5"
            fill="currentColor"
            opacity="0.3"
          />
        </g>
      </svg>

      {/* Top Right Corner - Mirrored branch */}
      <svg
        className="absolute top-0 right-0 w-48 h-48 text-text-light/50"
        viewBox="0 0 200 200"
        fill="none"
        style={{ transform: 'scaleX(-1)' }}
      >
        <path
          d="M0 0 Q40 20 60 60 Q70 90 65 120"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M30 30 Q50 35 70 30"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M60 60 L55 45 L60 50 L65 42 L68 52 L78 48 L72 58 L82 62 L70 65 L72 75 L62 68 L55 78 L58 66 L48 65 L58 60 Z"
          fill="currentColor"
          opacity="0.6"
        />
        <path
          d="M90 35 L87 25 L91 28 L95 22 L97 30 L105 28 L100 35 L107 38 L98 40 L99 48 L92 42 L87 50 L89 40 L81 39 L89 36 Z"
          fill="currentColor"
          opacity="0.4"
        />
      </svg>

      {/* Bottom Left Corner */}
      <svg
        className="absolute bottom-0 left-0 w-56 h-56 text-text-light/50"
        viewBox="0 0 220 220"
        fill="none"
        style={{ transform: 'scaleY(-1)' }}
      >
        <path
          d="M0 0 Q30 40 50 80 Q60 110 55 150"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M25 50 Q45 45 65 55"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Larger leaf cluster */}
        <path
          d="M50 80 L43 60 L50 68 L58 55 L62 70 L78 65 L68 78 L85 85 L68 90 L72 105 L58 95 L48 110 L52 92 L38 90 L50 84 Z"
          fill="currentColor"
          opacity="0.5"
        />
        {/* Floating seeds */}
        <g transform="translate(80, 40) rotate(15)">
          <ellipse cx="0" cy="0" rx="2.5" ry="4" fill="currentColor" opacity="0.4" />
          <path d="M0 -4 Q6 -12 4 -25 Q1.5 -15 0 -4" fill="currentColor" opacity="0.25" />
        </g>
        <g transform="translate(100, 65) rotate(-10)">
          <ellipse cx="0" cy="0" rx="2" ry="3.5" fill="currentColor" opacity="0.35" />
          <path d="M0 -3.5 Q5 -10 3.5 -20 Q1 -12 0 -3.5" fill="currentColor" opacity="0.2" />
        </g>
      </svg>

      {/* Bottom Right Corner */}
      <svg
        className="absolute bottom-0 right-0 w-56 h-56 text-text-light/50"
        viewBox="0 0 220 220"
        fill="none"
        style={{ transform: 'scale(-1, -1)' }}
      >
        <path
          d="M0 0 Q30 40 50 80 Q60 110 55 150"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M25 50 Q45 45 65 55"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M50 80 L43 60 L50 68 L58 55 L62 70 L78 65 L68 78 L85 85 L68 90 L72 105 L58 95 L48 110 L52 92 L38 90 L50 84 Z"
          fill="currentColor"
          opacity="0.5"
        />
        <g transform="translate(90, 50) rotate(25)">
          <ellipse cx="0" cy="0" rx="2.5" ry="4" fill="currentColor" opacity="0.4" />
          <path d="M0 -4 Q6 -12 4 -25 Q1.5 -15 0 -4" fill="currentColor" opacity="0.25" />
        </g>
      </svg>

      {/* Left edge - vertical vine/branch */}
      <svg
        className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-96 text-text-light/50"
        viewBox="0 0 50 400"
        fill="none"
        preserveAspectRatio="xMinYMid slice"
      >
        <path
          d="M8 0 Q15 50 10 100 Q5 150 12 200 Q18 250 8 300 Q3 350 10 400"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Small leaves along the vine */}
        <path d="M10 80 L5 70 L12 75 L15 68 L14 78 L10 80" fill="currentColor" opacity="0.5" />
        <path d="M12 180 L7 170 L14 175 L17 168 L16 178 L12 180" fill="currentColor" opacity="0.4" />
        <path d="M8 280 L3 270 L10 275 L13 268 L12 278 L8 280" fill="currentColor" opacity="0.5" />
      </svg>

      {/* Right edge - vertical vine/branch */}
      <svg
        className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-96 text-text-light/50"
        viewBox="0 0 50 400"
        fill="none"
        preserveAspectRatio="xMaxYMid slice"
        style={{ transform: 'translateY(-50%) scaleX(-1)' }}
      >
        <path
          d="M8 0 Q15 50 10 100 Q5 150 12 200 Q18 250 8 300 Q3 350 10 400"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M10 120 L5 110 L12 115 L15 108 L14 118 L10 120" fill="currentColor" opacity="0.5" />
        <path d="M12 220 L7 210 L14 215 L17 208 L16 218 L12 220" fill="currentColor" opacity="0.4" />
        <path d="M8 320 L3 310 L10 315 L13 308 L12 318 L8 320" fill="currentColor" opacity="0.5" />
      </svg>
    </div>
  )
}
