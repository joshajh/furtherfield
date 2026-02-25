'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FloatingPanel } from './FloatingPanel';

type NavItem = {
  title: string;
  href?: string;
  separator?: boolean;
};

type DocsSidebarProps = {
  navigation: NavItem[];
};

export function DocsSidebar({ navigation }: DocsSidebarProps) {
  const pathname = usePathname();

  return (
    <FloatingPanel withGradient className="h-fit sticky top-[20px]">
      <nav className="space-y-1">
        <h2 className="font-mono text-xs uppercase tracking-wider text-text-dark/60 mb-4 px-3">
          Contents
        </h2>
        {navigation.map((item, index) => {
          if (item.separator) {
            return (
              <div key={index} className="py-2 px-3">
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
              className={`block px-3 py-2 rounded font-mono text-xs uppercase tracking-wide transition-colors ${
                isActive
                  ? 'bg-text-dark/10 text-text-dark border-l-2 border-text-dark font-semibold'
                  : 'text-text-dark/80 hover:bg-text-dark/5 hover:text-text-dark'
              }`}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>
    </FloatingPanel>
  );
}
