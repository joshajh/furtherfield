import Link from 'next/link';
import { Brandmark3D } from '@/components';

export default function HomePage() {
  return (
    <main className="hero-section hero-gradient-bg min-h-screen">
      <div className="relative z-10 max-w-4xl text-center space-y-4 px-5 py-8">
        <div className="space-y-3">
          {/* 3D Brandmark */}
          <div className="flex justify-center mb-2">
            <Brandmark3D size={40} autoRotate={true} />
          </div>

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

          <p className="text-sm text-text-dark/60 font-mono uppercase tracking-wider">
            By Ruth Catlow and Ann Light
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/docs"
            className="tag bg-treatment-acid !text-text-dark !border-text-dark hover:bg-text-dark hover:!text-gray-300 hover:!border-gray-300"
          >
            Read the Playbook
          </Link>
          <Link
            href="https://thiscoastaltown.org"
            className="tag bg-treatment-acid !text-text-dark !border-text-dark hover:bg-text-dark hover:!text-gray-300 hover:!border-gray-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            Main Site →
          </Link>
        </div>

        <div className="pt-6 mt-6 border-t border-text-dark/20">
          <blockquote className="text-base md:text-lg text-text-dark/70 italic max-w-xl mx-auto bg-transparent border-l-0 p-0">
            "In the off-grid kitchen, devices are left behind as foraged flavours bring the town together..."
          </blockquote>
        </div>
      </div>
    </main>
  );
}
