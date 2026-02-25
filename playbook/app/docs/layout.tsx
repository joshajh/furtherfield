import type { ReactNode } from 'react';
import { DocsSidebar, MobileDocsNav } from '@/components';
import { getNavigation } from '@/lib/docs';

export default function DocsLayout({ children }: { children: ReactNode }) {
  const navigation = getNavigation();

  return (
    <div className="hero-gradient-bg min-h-screen">
      <div className="max-w-4xl mx-auto py-4 px-4">
        {/* Main content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
