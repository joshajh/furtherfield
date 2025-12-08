'use client';

export function LichenBorder() {
  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none"
      aria-hidden="true"
    >
      {/* Left edge - offset 30% off-screen */}
      <div
        className="absolute top-0 bottom-0 w-[300px] grayscale opacity-80 mix-blend-darken"
        style={{
          left: '-45px',
          backgroundImage: 'url(/lichen/borders/border-left.png)',
          backgroundSize: 'auto 100%',
          backgroundPosition: 'left center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Right edge - offset 30% off-screen */}
      <div
        className="absolute top-0 bottom-0 w-[300px] grayscale opacity-80 mix-blend-darken"
        style={{
          right: '-45px',
          backgroundImage: 'url(/lichen/borders/border-right.png)',
          backgroundSize: 'auto 100%',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Bottom edge - offset 30% off-screen */}
      <div
        className="absolute left-0 right-0 h-[300px] grayscale opacity-80 mix-blend-darken"
        style={{
          bottom: '-45px',
          backgroundImage: 'url(/lichen/borders/border-bottom.png)',
          backgroundSize: '100% auto',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
        }}
      />
    </div>
  );
}
