'use client';

import Link from 'next/link';
import { Brandmark3D } from './Brandmark3D';

type DocsHeaderProps = {
  title: string;
};

export function DocsHeader({ title }: DocsHeaderProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 mb-6">
      {/* Left column - Brandmark */}
      <div className="hidden lg:flex lg:justify-center">
        <Link href="/docs/index">
          <Brandmark3D size={24} autoRotate={true} />
        </Link>
      </div>

      {/* Right column - H1 */}
      <h1 className="font-display text-text-light text-[36px] sm:text-[40px] md:text-[80px] lg:text-[100px] leading-[0.95] tracking-tight">
        {title}
      </h1>
    </div>
  );
}
