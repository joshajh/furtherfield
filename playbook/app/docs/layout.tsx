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

        {/* Main content - header spans full width, then grid below */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
