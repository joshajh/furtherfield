'use client';

import { usePathname } from 'next/navigation';

export function LichenBorder() {
  const pathname = usePathname();

  // Always use acid treatment for the playbook docs
  const treatmentClass = 'bg-treatment-acid';

  return (
    <div
      className="fixed top-0 left-0 right-0 z-30 pointer-events-none"
      style={{ height: '100dvh' }}
      aria-hidden="true"
    >
      {/* Left edge - positioned at screen edge, starts at bottom */}
      <div
        className="absolute top-0 bottom-0 w-[300px]"
        style={{ left: '-100px' }}
      >
        {/* Original image */}
        <div
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage: 'url(/lichen/borders/border-left.png)',
            backgroundSize: 'auto 60vh',
            backgroundPosition: 'left bottom',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Tint overlay with transition */}
        <div
          className={`absolute inset-0 ${treatmentClass} mix-blend-multiply transition-colors duration-700 ease-in-out`}
          style={{
            maskImage: 'url(/lichen/borders/border-left.png)',
            maskSize: 'auto 60vh',
            maskPosition: 'left bottom',
            maskRepeat: 'no-repeat',
            WebkitMaskImage: 'url(/lichen/borders/border-left.png)',
            WebkitMaskSize: 'auto 60vh',
            WebkitMaskPosition: 'left bottom',
            WebkitMaskRepeat: 'no-repeat',
          }}
        />
      </div>

      {/* Right edge - positioned at screen edge, starts at bottom */}
      <div
        className="absolute top-0 bottom-0 w-[300px]"
        style={{ right: '-100px' }}
      >
        {/* Original image */}
        <div
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage: 'url(/lichen/borders/border-right.png)',
            backgroundSize: 'auto 60vh',
            backgroundPosition: 'right bottom',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Tint overlay with transition */}
        <div
          className={`absolute inset-0 ${treatmentClass} mix-blend-multiply transition-colors duration-700 ease-in-out`}
          style={{
            maskImage: 'url(/lichen/borders/border-right.png)',
            maskSize: 'auto 60vh',
            maskPosition: 'right bottom',
            maskRepeat: 'no-repeat',
            WebkitMaskImage: 'url(/lichen/borders/border-right.png)',
            WebkitMaskSize: 'auto 60vh',
            WebkitMaskPosition: 'right bottom',
            WebkitMaskRepeat: 'no-repeat',
          }}
        />
      </div>

    </div>
  );
}
