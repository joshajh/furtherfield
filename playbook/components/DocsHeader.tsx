'use client';

import Link from 'next/link';
import { Brandmark3D } from './Brandmark3D';
import { FloatingPanel } from './FloatingPanel';

type DocsHeaderProps = {
  title: string;
};

export function DocsHeader({ title }: DocsHeaderProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 mb-6">
      {/* Left column - Brandmark in floating panel with gradient */}
      <div className="hidden lg:block">
        <FloatingPanel withGradient className="flex justify-center items-center">
          <Link href="/docs/index">
            <Brandmark3D size={40} autoRotate={true} />
          </Link>
        </FloatingPanel>
      </div>

      {/* Right column - H1 in floating panel with gradient */}
      <FloatingPanel withGradient>
        <h1 className="font-display text-text-dark text-[36px] sm:text-[40px] md:text-[80px] lg:text-[100px] leading-[0.95] tracking-tight">
          {title}
        </h1>
      </FloatingPanel>
    </div>
  );
}
