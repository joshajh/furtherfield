'use client';

export function LichenFooter() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="w-full h-[100px] opacity-90"
        style={{
          backgroundImage: 'url(/lichen-ruth-web/ruth-border-bottom.png)',
          backgroundSize: 'auto 100%',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'bottom center',
        }}
      />
    </div>
  );
}
