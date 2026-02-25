'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
    <div className="relative mb-2.5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full tag flex items-center justify-between transition-colors ${
          isOpen
            ? 'bg-text-dark text-text-light border-text-dark'
            : 'bg-treatment-acid text-text-dark border-text-dark hover:bg-text-dark hover:text-text-light'
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
        <div className="absolute top-full left-0 right-0 mt-2 space-y-1 p-4 bg-white/95 backdrop-blur-sm rounded-lg border-2 border-text-dark z-50">
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
