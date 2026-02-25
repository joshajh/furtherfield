'use client';

import Link from 'next/link';
import { Brandmark3D } from './Brandmark3D';

type DocsHeaderProps = {
  title: string;
};

export function DocsHeader({ title }: DocsHeaderProps) {
  return (
    <div className="mb-6 flex items-center gap-4">
      {/* Brandmark */}
      <Link href="/docs/index" className="hidden lg:block">
        <Brandmark3D size={24} autoRotate={true} />
      </Link>

      {/* H1 */}
      <h1 className="font-display text-text-light text-[36px] sm:text-[40px] md:text-[80px] lg:text-[100px] leading-[0.95] tracking-tight">
        {title}
      </h1>
    </div>
  );
}
