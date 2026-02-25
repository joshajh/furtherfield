import type { ReactNode } from 'react';
import { DocsSidebar, MobileDocsNav } from '@/components';
import { getNavigation } from '@/lib/docs';

export default function DocsLayout({ children }: { children: ReactNode }) {
  const navigation = getNavigation();

  return (
    <div className="bg-bg-dark min-h-screen">
      <div className="max-w-7xl mx-auto py-6 px-6">
        {/* Mobile navigation */}
        <MobileDocsNav navigation={navigation} />

        {/* Header is rendered by the page component */}

        {/* Content grid - sidebar and main content aligned */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <DocsSidebar navigation={navigation} />
            </div>
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
