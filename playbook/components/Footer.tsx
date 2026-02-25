export function Footer() {
  return (
    <footer className="w-full px-2.5 py-2.5 animate-content-footer">
      <div className="relative bg-gradient-brand rounded-lg px-6 py-4 pb-8 md:px-12 md:py-8 md:pb-10 overflow-hidden">
        {/* Ruth Border Bottom decoration */}
        <img
          src="/lichen-ruth-web/ruth-border-bottom.png"
          alt=""
          className="absolute bottom-0 left-0 right-0 w-full h-auto object-cover object-top pointer-events-none"
          style={{ maxHeight: '80px' }}
        />

        <div className="relative z-[1] flex flex-col gap-4">
          <div className="font-display text-text-dark text-[32px] sm:text-[50px] leading-none italic">
            <h2 className="mb-0">Reimagine</h2>
            <h2 className="mb-0">This Coastal</h2>
            <h2>Town</h2>
          </div>

          <p className="text-text-dark text-xs font-mono">
            Design and development by{' '}
            <a
              href="https://possibleworlds.space"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-2 py-0.5 bg-text-dark text-text-light rounded-full hover:bg-treatment-acid hover:text-text-dark transition-colors"
            >
              Possible Worlds
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
