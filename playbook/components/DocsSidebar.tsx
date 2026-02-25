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
    <FloatingPanel className="h-fit sticky top-[20px]">
      <nav className="space-y-1">
        <h2 className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-4 px-3">
          Contents
        </h2>
        {navigation.map((item, index) => {
          if (item.separator) {
            return (
              <div key={index} className="py-2 px-3">
                <div className="font-mono text-xs uppercase tracking-wider text-treatment-acid">
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
                  ? 'bg-treatment-acid/10 text-treatment-acid border-l-2 border-treatment-acid'
                  : 'text-text-light hover:bg-treatment-acid/5 hover:text-treatment-acid'
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
