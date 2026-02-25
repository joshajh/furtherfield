import type { ReactNode } from 'react';
import { MobileDocsNav } from '@/components';
import { getNavigation } from '@/lib/docs';

export default function DocsLayout({ children }: { children: ReactNode }) {
  const navigation = getNavigation();

  return (
    <div className="bg-bg-dark min-h-screen">
      <div className="py-4">
        {/* Mobile navigation dropdown */}
        <div className="max-w-4xl mx-auto px-2.5">
          <MobileDocsNav navigation={navigation} />
        </div>

        {/* Main content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
