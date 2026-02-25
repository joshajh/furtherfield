import type { ReactNode } from 'react';
import Link from 'next/link';
import { DocsSidebar, MobileDocsNav, Brandmark3D } from '@/components';
import { getNavigation } from '@/lib/docs';

export default function DocsLayout({ children }: { children: ReactNode }) {
  const navigation = getNavigation();

  return (
    <div className="bg-bg-dark min-h-screen">
      <div className="max-w-7xl mx-auto py-6 px-6">
        {/* Mobile navigation */}
        <MobileDocsNav navigation={navigation} />

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar column with brandmark - offset to align with content panel */}
          <aside className="hidden lg:flex lg:flex-col lg:gap-6">
            {/* Spacer for h1 height to align menu with content panel */}
            <div className="flex flex-col gap-4">
              {/* Brandmark above sidebar - clickable to return to docs index */}
              <Link href="/docs/index" className="flex justify-center">
                <Brandmark3D size={24} autoRotate={true} />
              </Link>
            </div>

            {/* Sidebar aligned with content panel */}
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
