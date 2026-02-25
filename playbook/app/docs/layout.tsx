import type { ReactNode } from 'react';
import { MobileDocsNav, LichenGaps, Footer } from '@/components';
import { getNavigation } from '@/lib/docs';

export default function DocsLayout({ children }: { children: ReactNode }) {
  const navigation = getNavigation();

  return (
    <div className="bg-bg-dark h-screen overflow-hidden flex flex-col">
      <LichenGaps />

      {/* Fixed mobile navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 pt-4">
        <div className="max-w-4xl mx-auto px-2.5">
          <MobileDocsNav navigation={navigation} />
        </div>
      </div>

      {/* Spacer for fixed menu */}
      <div className="flex-shrink-0 h-[56px] bg-bg-dark mb-2.5"></div>

      {/* Scrolling container */}
      <div className="flex-1 overflow-y-auto">
        <main>
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
