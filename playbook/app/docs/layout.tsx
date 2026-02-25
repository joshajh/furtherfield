import type { ReactNode } from 'react';
import { DocsSidebar, MobileDocsNav } from '@/components';
import { getNavigation } from '@/lib/docs';

export default function DocsLayout({ children }: { children: ReactNode }) {
  const navigation = getNavigation();

  return (
    <div className="hero-gradient-bg min-h-screen">
      <div className="max-w-7xl mx-auto py-6 px-6">
        {/* Mobile navigation */}
        <MobileDocsNav navigation={navigation} />

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <DocsSidebar navigation={navigation} />
          </aside>

          {/* Main content */}
          <main>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
