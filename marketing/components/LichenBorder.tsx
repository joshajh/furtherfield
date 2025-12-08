'use client';

export function LichenBorder() {
  return (
    <div
      className="fixed inset-0 z-30 pointer-events-none"
      aria-hidden="true"
    >
      {/* Left edge - offset off-screen */}
      <div
        className="absolute top-0 bottom-0 w-[300px]"
        style={{ left: '-75px' }}
      >
        {/* Original image */}
        <div
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage: 'url(/lichen/borders/border-left.png)',
            backgroundSize: 'auto 100%',
            backgroundPosition: 'left center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Lemon tint overlay */}
        <div
          className="absolute inset-0 bg-treatment-lemon mix-blend-multiply"
          style={{
            maskImage: 'url(/lichen/borders/border-left.png)',
            maskSize: 'auto 100%',
            maskPosition: 'left center',
            maskRepeat: 'no-repeat',
            WebkitMaskImage: 'url(/lichen/borders/border-left.png)',
            WebkitMaskSize: 'auto 100%',
            WebkitMaskPosition: 'left center',
            WebkitMaskRepeat: 'no-repeat',
          }}
        />
      </div>

      {/* Right edge - offset off-screen */}
      <div
        className="absolute top-0 bottom-0 w-[300px]"
        style={{ right: '-75px' }}
      >
        {/* Original image */}
        <div
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage: 'url(/lichen/borders/border-right.png)',
            backgroundSize: 'auto 100%',
            backgroundPosition: 'right center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Lemon tint overlay */}
        <div
          className="absolute inset-0 bg-treatment-lemon mix-blend-multiply"
          style={{
            maskImage: 'url(/lichen/borders/border-right.png)',
            maskSize: 'auto 100%',
            maskPosition: 'right center',
            maskRepeat: 'no-repeat',
            WebkitMaskImage: 'url(/lichen/borders/border-right.png)',
            WebkitMaskSize: 'auto 100%',
            WebkitMaskPosition: 'right center',
            WebkitMaskRepeat: 'no-repeat',
          }}
        />
      </div>

      {/* Bottom edge - offset off-screen */}
      <div
        className="absolute left-0 right-0 h-[300px]"
        style={{ bottom: '-75px' }}
      >
        {/* Original image */}
        <div
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage: 'url(/lichen/borders/border-bottom.png)',
            backgroundSize: '100% auto',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Lemon tint overlay */}
        <div
          className="absolute inset-0 bg-treatment-lemon mix-blend-multiply"
          style={{
            maskImage: 'url(/lichen/borders/border-bottom.png)',
            maskSize: '100% auto',
            maskPosition: 'center bottom',
            maskRepeat: 'no-repeat',
            WebkitMaskImage: 'url(/lichen/borders/border-bottom.png)',
            WebkitMaskSize: '100% auto',
            WebkitMaskPosition: 'center bottom',
            WebkitMaskRepeat: 'no-repeat',
          }}
        />
      </div>
    </div>
  );
}
