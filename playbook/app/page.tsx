import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="hero-section hero-gradient-bg min-h-screen">
      {/* Lichen decorations */}
      <img
        src="/lichen-ruth-web/Lichen1.png"
        alt=""
        className="absolute top-0 left-0 w-24 h-24 object-contain opacity-70 -rotate-45"
        aria-hidden="true"
      />
      <img
        src="/lichen-ruth-web/Lichen2- light.png"
        alt=""
        className="absolute top-20 right-0 w-32 h-32 object-contain opacity-60 rotate-12"
        aria-hidden="true"
      />
      <img
        src="/lichen-ruth-web/lichen4.png"
        alt=""
        className="absolute bottom-0 left-10 w-40 h-40 object-contain opacity-70 rotate-180"
        aria-hidden="true"
      />
      <img
        src="/lichen-ruth-web/lichen5.png"
        alt=""
        className="absolute bottom-10 right-0 w-36 h-36 object-contain opacity-60 -rotate-30"
        aria-hidden="true"
      />
      <img
        src="/lichen-ruth-web/Lichen3.png"
        alt=""
        className="absolute top-1/2 left-0 w-20 h-20 object-contain opacity-50 rotate-90"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl text-center space-y-8 px-6 py-16">
        <div className="space-y-6">
          <p className="callout inline-block px-2 py-1">
            A Time-Travel Playbook
          </p>

          {/* Hero title - matching marketing site style */}
          <h1 className="font-display text-[50px] sm:text-[60px] md:text-[100px] lg:text-[120px] leading-[0.9] text-text-dark">
            <span className="block italic">
              <span className="glitch-base-text" data-text="Reimagine">
                <span className="relative z-10">Reimagine</span>
              </span>
            </span>
            <span className="block">This Coastal</span>
            <span className="block">Town</span>
          </h1>

          <p className="text-xl md:text-2xl text-text-dark/80 max-w-2xl mx-auto">
            For inspiring coastal communities
          </p>
          <p className="text-sm text-text-dark/60 font-mono uppercase tracking-wider">
            By Ruth Catlow and Ann Light
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Link
            href="/docs"
            className="tag text-text-dark border-text-dark hover:bg-treatment-acid"
          >
            Read the Playbook
          </Link>
          <Link
            href="https://thiscoastaltown.org"
            className="tag text-text-dark border-text-dark hover:bg-treatment-acid"
            target="_blank"
            rel="noopener noreferrer"
          >
            Main Site →
          </Link>
        </div>

        <div className="pt-12 mt-12 border-t border-text-dark/20">
          <blockquote className="text-lg text-text-dark/70 italic max-w-xl mx-auto bg-transparent border-l-0 p-0">
            "In the off-grid kitchen, devices are left behind as foraged flavours bring the town together..."
          </blockquote>
        </div>

        {/* Footer credits */}
        <div className="pt-8 text-xs text-text-dark/50 font-mono uppercase tracking-wider">
          <p>A Furtherfield Project</p>
        </div>
      </div>

      {/* Bottom lichen strip */}
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none">
        <img
          src="/lichen-ruth-web/Lichen1.png"
          alt=""
          className="absolute bottom-0 left-0 w-24 h-16 object-contain"
          aria-hidden="true"
        />
        <img
          src="/lichen-ruth-web/Lichen2a- light.png"
          alt=""
          className="absolute bottom-0 left-20 w-20 h-14 object-contain"
          aria-hidden="true"
        />
        <img
          src="/lichen-ruth-web/lichen4a.png"
          alt=""
          className="absolute bottom-0 left-1/3 w-24 h-16 object-contain"
          aria-hidden="true"
        />
        <img
          src="/lichen-ruth-web/Lichen3.png"
          alt=""
          className="absolute bottom-0 right-1/3 w-16 h-12 object-contain"
          aria-hidden="true"
        />
        <img
          src="/lichen-ruth-web/lichen5a.png"
          alt=""
          className="absolute bottom-0 right-20 w-24 h-16 object-contain"
          aria-hidden="true"
        />
        <img
          src="/lichen-ruth-web/Lichen2b- light.png"
          alt=""
          className="absolute bottom-0 right-0 w-20 h-14 object-contain"
          aria-hidden="true"
        />
      </div>
    </main>
  );
}
