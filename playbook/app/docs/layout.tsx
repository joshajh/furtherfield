import type { ReactNode } from 'react';
import { MobileDocsNav } from '@/components';
import { getNavigation } from '@/lib/docs';

export default function DocsLayout({ children }: { children: ReactNode }) {
  const navigation = getNavigation();

  return (
    <div className="bg-bg-dark min-h-screen">
      {/* Fixed mobile navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-bg-dark py-4">
        <div className="max-w-4xl mx-auto px-2.5">
          <MobileDocsNav navigation={navigation} />
        </div>
      </div>

      {/* Main content with top padding for fixed header */}
      <div className="pt-20">
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
