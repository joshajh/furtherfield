'use client';

import { usePathname } from 'next/navigation';

export function LichenBorder() {
  const pathname = usePathname();

  // Hide on Keystatic CMS routes
  if (pathname?.startsWith('/keystatic')) {
    return null;
  }

  // Use 'dark' treatment on event detail pages, 'acid' elsewhere
  const isEventDetail = pathname?.startsWith('/events/') && pathname !== '/events';
  const treatmentClass = isEventDetail ? 'bg-treatment-dark' : 'bg-treatment-acid';

  return (
    <div
      className="fixed top-0 left-0 right-0 z-30 pointer-events-none"
      style={{ height: '100dvh' }}
      aria-hidden="true"
    >
      {/* Left edge - offset off-screen, starts at bottom, fades at 40% from bottom */}
      <div
        className="absolute top-0 bottom-0 w-[300px]"
        style={{ left: '-75px' }}
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

      {/* Right edge - offset off-screen, starts at bottom, fades at 40% from bottom */}
      <div
        className="absolute top-0 bottom-0 w-[300px]"
        style={{ right: '-75px' }}
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
