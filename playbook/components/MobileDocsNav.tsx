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
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full tag bg-treatment-acid text-text-dark border-text-dark flex items-center justify-between"
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
        <div className="mt-2 space-y-2 p-4 bg-white/10 backdrop-blur-sm rounded-lg border-2 border-text-dark">
          {navigation.map((item, index) => {
            if (item.separator) {
              return (
                <div key={index} className="pt-4 pb-2">
                  <div className="font-mono text-xs uppercase tracking-wider text-text-dark/60">
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
                className={`block py-2 text-sm transition-colors ${
                  isActive
                    ? 'text-text-dark font-semibold underline decoration-treatment-acid decoration-2'
                    : 'text-text-dark/70 hover:text-text-dark'
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
