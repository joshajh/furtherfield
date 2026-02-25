import Link from 'next/link';
import { Brandmark3D, LichenGaps } from '@/components';

export default function HomePage() {
  return (
    <main className="hero-section hero-gradient-bg min-h-screen">
      <LichenGaps />
      <div className="relative z-10 max-w-4xl text-center space-y-4 px-5 py-8 animate-content-main">
        <div className="space-y-3">
          {/* 3D Brandmark */}
          <div className="flex justify-center mb-6">
            <Brandmark3D size={40} autoRotate={true} />
          </div>

          <p className="callout inline-block px-2 py-1">
            A Time-Travel Playbook
          </p>

          {/* Hero title - matching marketing site style */}
          <div className="relative inline-block">
            <div className="absolute inset-0 backdrop-blur-md rounded-lg"
                 style={{
                   backgroundColor: 'rgba(255, 255, 255, 0.2)',
                   maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent), linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                   WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent), linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                   maskComposite: 'intersect',
                   WebkitMaskComposite: 'source-in'
                 }}></div>
            <h1 className="font-display text-[60px] sm:text-[80px] md:text-[120px] lg:text-[140px] leading-[0.9] text-text-dark inline-block px-4 py-6 relative">
              <span className="block italic">
                <span className="glitch-base-text" data-text="Reimagine">
                  <span className="relative z-10">Reimagine</span>
                </span>
              </span>
              <span className="block">This Coastal</span>
              <span className="block">Town</span>
            </h1>
          </div>

          <p className="text-sm text-text-dark font-mono uppercase tracking-wider bg-treatment-acid px-3 py-1 rounded inline-block">
            By Ruth Catlow and Ann Light
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link
            href="/docs"
            className="tag bg-treatment-acid !text-text-dark !border-text-dark hover:bg-text-dark hover:!text-gray-300 hover:!border-gray-300 inline-flex"
          >
            Read the Playbook →
          </Link>
          <Link
            href="https://thiscoastaltown.org"
            className="tag bg-gradient-brand !text-text-dark !border-text-dark hover:bg-text-dark hover:!text-gray-300 hover:!border-gray-300 inline-flex"
            target="_blank"
            rel="noopener noreferrer"
          >
            ← Main Site
          </Link>
        </div>
      </div>
    </main>
  );
}
