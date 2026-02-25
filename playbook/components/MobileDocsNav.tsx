'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brandmark3D } from './Brandmark3D';

type NavItem = {
  title: string;
  href?: string;
  separator?: boolean;
};

type MobileDocsNavProps = {
  navigation: NavItem[];
};

export function MobileDocsNav({ navigation }: MobileDocsNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="relative mb-6 flex items-center gap-3">
      {/* Brandmark - links to home */}
      <Link href="/" className="flex-shrink-0">
        <Brandmark3D size={20} autoRotate={true} />
      </Link>

      {/* Menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full tag flex items-center justify-between transition-colors ${
          isOpen
            ? 'bg-treatment-acid text-text-dark border-text-dark'
            : 'bg-transparent text-text-dark border-text-dark hover:bg-treatment-acid'
        }`}
      >
        <span>Contents</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 space-y-1 p-4 bg-white/95 backdrop-blur-sm rounded-lg border-2 border-text-dark z-50" style={{ marginLeft: 'calc(-20px - 0.75rem)' }}>
          {navigation.map((item, index) => {
            if (item.separator) {
              return (
                <div key={index} className="py-2">
                  <div className="font-mono text-xs uppercase tracking-wider text-text-dark font-semibold">
                    {item.title}
                  </div>
                </div>
              );
            }

            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href || '#'}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded font-mono text-xs uppercase tracking-wide transition-colors ${
                  isActive
                    ? 'bg-treatment-acid/20 text-text-dark border-l-2 border-text-dark font-semibold'
                    : 'text-text-dark/80 hover:bg-text-dark/5 hover:text-text-dark'
                }`}
              >
                {item.title}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
