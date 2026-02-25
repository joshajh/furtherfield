# Rebuild Playbook Documentation Without Fumadocs

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace Fumadocs with a custom documentation layout that uses floating panels with black borders matching the marketing site aesthetic, with full control over styling.

**Architecture:** Build a simple custom docs system using Next.js app router with MDX support via @next/mdx. Create floating panel components that match the marketing site (LichenContainer style). Parse MDX files directly, build navigation from meta.json files, render with custom styled components.

**Tech Stack:** Next.js 16, React 19, @next/mdx, gray-matter (frontmatter parsing), Tailwind CSS 4

---

## Task 1: Install MDX Dependencies

**Files:**
- Modify: `playbook/package.json`
- Create: `playbook/mdx-components.tsx`

**Step 1: Install @next/mdx and gray-matter**

Run:
```bash
cd playbook && pnpm add @next/mdx @mdx-js/loader @mdx-js/react gray-matter
```

Expected: Dependencies added to package.json

**Step 2: Create mdx-components.tsx for custom MDX rendering**

Create file `playbook/mdx-components.tsx`:

```typescript
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="font-display text-[2.5rem] md:text-[3.5rem] font-semibold italic text-text-dark mb-4">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-display text-[1.75rem] font-semibold text-text-dark mt-10 mb-4 pb-2 border-b border-text-dark">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-[1.35rem] font-semibold text-text-dark mt-8 mb-3">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-mono text-sm font-medium uppercase tracking-wide text-text-dark mt-6 mb-2">
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className="text-text-dark leading-7 mb-4">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="text-text-dark mb-4 pl-6 list-disc">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="text-text-dark mb-4 pl-6 list-decimal">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="mb-2 leading-7">
        {children}
      </li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="bg-gradient-brand relative isolate border-l-4 border-treatment-acid rounded-r-lg p-6 my-8 text-text-dark italic font-display text-lg leading-7 before:content-[''] before:absolute before:inset-0 before:bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%220%200%20200%20200%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter%20id=%22noise%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.85%22%20numOctaves=%224%22%20stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20filter=%22url(%23noise)%22/%3E%3C/svg%3E')] before:opacity-60 before:mix-blend-overlay before:pointer-events-none before:rounded-r-lg before:-z-10">
        {children}
      </blockquote>
    ),
    strong: ({ children }) => (
      <strong className="text-text-dark font-semibold">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic">
        {children}
      </em>
    ),
    hr: () => (
      <hr className="border-none h-px bg-gradient-to-r from-transparent via-divider to-transparent my-12" />
    ),
    code: ({ children }) => (
      <code className="bg-treatment-acid/15 text-text-dark px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-bg-dark/5 border border-divider rounded-lg p-4 overflow-x-auto my-6">
        {children}
      </pre>
    ),
    ...components,
  }
}
```

**Step 3: Update next.config.mjs for MDX support**

Modify `playbook/next.config.mjs`:

```javascript
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
```

**Step 4: Commit**

```bash
git add playbook/package.json playbook/pnpm-lock.yaml playbook/mdx-components.tsx playbook/next.config.mjs
git commit -m "feat: add MDX support with custom components"
```

---

## Task 2: Create FloatingPanel Component

**Files:**
- Create: `playbook/components/FloatingPanel.tsx`
- Modify: `playbook/components/index.ts`

**Step 1: Create FloatingPanel component**

Create file `playbook/components/FloatingPanel.tsx`:

```typescript
'use client';

import { ReactNode } from 'react';

type FloatingPanelProps = {
  children: ReactNode;
  className?: string;
  withGradient?: boolean;
};

export function FloatingPanel({
  children,
  className = '',
  withGradient = false,
}: FloatingPanelProps) {
  if (withGradient) {
    return (
      <div
        className={`relative isolate bg-gradient-brand border-2 border-text-dark rounded-lg p-6 ${className}`}
      >
        {/* Film grain overlay */}
        <div
          className="absolute inset-0 opacity-60 mix-blend-overlay pointer-events-none rounded-lg -z-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        {children}
      </div>
    );
  }

  return (
    <div
      className={`bg-bg-dark border-2 border-text-dark rounded-lg p-6 ${className}`}
    >
      {children}
    </div>
  );
}
```

**Step 2: Export FloatingPanel from index**

Add to `playbook/components/index.ts`:

```typescript
export { FloatingPanel } from './FloatingPanel';
```

**Step 3: Commit**

```bash
git add playbook/components/FloatingPanel.tsx playbook/components/index.ts
git commit -m "feat: add FloatingPanel component for docs layout"
```

---

## Task 3: Create Docs Navigation Sidebar Component

**Files:**
- Create: `playbook/components/DocsSidebar.tsx`
- Create: `playbook/lib/docs.ts`
- Modify: `playbook/components/index.ts`

**Step 1: Create docs utility functions**

Create file `playbook/lib/docs.ts`:

```typescript
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type DocMeta = {
  slug: string;
  title: string;
  description?: string;
  order?: number;
};

export type NavItem = {
  title: string;
  href?: string;
  separator?: boolean;
};

const CONTENT_DIR = path.join(process.cwd(), 'content', 'docs');

export function getDocSlugs(): string[] {
  const files = fs.readdirSync(CONTENT_DIR);
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

export function getDocBySlug(slug: string) {
  const fullPath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    frontmatter: data as { title?: string; description?: string },
    content,
  };
}

export function getNavigation(): NavItem[] {
  try {
    const metaPath = path.join(CONTENT_DIR, 'meta.json');
    const metaContent = fs.readFileSync(metaPath, 'utf8');
    const meta = JSON.parse(metaContent);

    return meta.pages.map((page: string) => {
      if (page.startsWith('---')) {
        const title = page.replace(/---/g, '').trim();
        return { title, separator: true };
      }

      const doc = getDocBySlug(page);
      return {
        title: doc.frontmatter.title || page,
        href: `/docs/${page}`,
      };
    });
  } catch (error) {
    console.error('Failed to load navigation:', error);
    return [];
  }
}

export function getAllDocs() {
  const slugs = getDocSlugs();
  return slugs.map((slug) => getDocBySlug(slug));
}
```

**Step 2: Create DocsSidebar component**

Create file `playbook/components/DocsSidebar.tsx`:

```typescript
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
```

**Step 3: Export DocsSidebar from index**

Add to `playbook/components/index.ts`:

```typescript
export { DocsSidebar } from './DocsSidebar';
```

**Step 4: Commit**

```bash
git add playbook/lib/docs.ts playbook/components/DocsSidebar.tsx playbook/components/index.ts
git commit -m "feat: add docs navigation sidebar component"
```

---

## Task 4: Create New Docs Layout

**Files:**
- Modify: `playbook/app/docs/layout.tsx`
- Delete: `playbook/app/layout.config.ts` (Fumadocs config)
- Delete: `playbook/lib/source.ts` (Fumadocs source)

**Step 1: Replace docs layout**

Replace `playbook/app/docs/layout.tsx`:

```typescript
import type { ReactNode } from 'react';
import { DocsSidebar } from '@/components';
import { getNavigation } from '@/lib/docs';

export default function DocsLayout({ children }: { children: ReactNode }) {
  const navigation = getNavigation();

  return (
    <div className="hero-gradient-bg min-h-screen">
      <div className="max-w-7xl mx-auto py-6 px-4">
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
```

**Step 2: Delete Fumadocs config files**

Run:
```bash
cd playbook
rm -f app/layout.config.ts lib/source.ts
```

Expected: Fumadocs config files removed

**Step 3: Commit**

```bash
git add playbook/app/docs/layout.tsx
git add -u playbook/app/layout.config.ts playbook/lib/source.ts
git commit -m "feat: replace Fumadocs layout with custom docs layout"
```

---

## Task 5: Create Dynamic Docs Page Route

**Files:**
- Create: `playbook/app/docs/[slug]/page.tsx`
- Delete: `playbook/app/docs/[[...slug]]/page.tsx` (Fumadocs route)

**Step 1: Create dynamic slug route**

Create file `playbook/app/docs/[slug]/page.tsx`:

```typescript
import { notFound } from 'next/navigation';
import { getDocBySlug, getDocSlugs } from '@/lib/docs';
import { FloatingPanel } from '@/components';
import { compileMDX } from 'next-mdx-remote/rsc';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = getDocSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);

  return {
    title: `${doc.frontmatter.title || slug} | This Coastal Town Playbook`,
    description: doc.frontmatter.description,
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;

  try {
    const doc = getDocBySlug(slug);
    const { content } = await compileMDX({
      source: doc.content,
      options: { parseFrontmatter: false },
    });

    return (
      <FloatingPanel withGradient className="prose prose-lg max-w-none">
        <article>{content}</article>
      </FloatingPanel>
    );
  } catch (error) {
    notFound();
  }
}
```

**Step 2: Delete Fumadocs catch-all route**

Run:
```bash
cd playbook
rm -rf app/docs/\[\[...slug\]\]
```

Expected: Fumadocs route directory removed

**Step 3: Install next-mdx-remote**

Run:
```bash
cd playbook && pnpm add next-mdx-remote
```

Expected: Dependency added

**Step 4: Commit**

```bash
git add playbook/app/docs/[slug]/page.tsx playbook/package.json playbook/pnpm-lock.yaml
git add -u playbook/app/docs/\[\[...slug\]\]
git commit -m "feat: add dynamic docs page route"
```

---

## Task 6: Create Docs Index Page

**Files:**
- Create: `playbook/app/docs/page.tsx`

**Step 1: Create docs index that redirects to first doc**

Create file `playbook/app/docs/page.tsx`:

```typescript
import { redirect } from 'next/navigation';

export default function DocsIndexPage() {
  redirect('/docs/index');
}
```

**Step 2: Commit**

```bash
git add playbook/app/docs/page.tsx
git commit -m "feat: add docs index page with redirect"
```

---

## Task 7: Remove Fumadocs Dependencies

**Files:**
- Modify: `playbook/package.json`
- Modify: `playbook/app/layout.tsx`
- Modify: `playbook/app/globals.css`

**Step 1: Remove Fumadocs imports from root layout**

Modify `playbook/app/layout.tsx` - remove these lines:

```typescript
import { RootProvider } from 'fumadocs-ui/provider/next';
```

And change the layout JSX from:

```typescript
<RootProvider
  theme={{
    enabled: true,
    defaultTheme: 'dark',
    enableSystem: false,
  }}
>
  {children}
</RootProvider>
```

To simply:

```typescript
{children}
```

**Step 2: Remove Fumadocs CSS from globals.css**

Remove these lines from `playbook/app/globals.css`:

```css
@import "fumadocs-ui/style.css";
```

And remove all CSS rules that target `[data-fd-*]` selectors (everything from line ~40 to ~1060).

**Step 3: Uninstall Fumadocs packages**

Run:
```bash
cd playbook && pnpm remove fumadocs-core fumadocs-mdx fumadocs-ui
```

Expected: Packages removed from package.json

**Step 4: Commit**

```bash
git add playbook/package.json playbook/pnpm-lock.yaml playbook/app/layout.tsx playbook/app/globals.css
git commit -m "refactor: remove Fumadocs dependencies and styling"
```

---

## Task 8: Test and Verify

**Files:**
- None (testing only)

**Step 1: Start dev server**

Run:
```bash
cd playbook && pnpm dev
```

Expected: Server starts on port 3010 without errors

**Step 2: Test navigation**

Visit in browser:
- `http://localhost:3010/docs/index` - should show introduction page
- `http://localhost:3010/docs/inspiration` - should show inspiration page
- `http://localhost:3010/docs/team` - should show team page

Expected: All pages load with:
- Floating sidebar panel on left (dark background, black border)
- Floating content panel on right (gradient background, black border, film grain)
- Dark text on blue gradient (readable)
- Sidebar navigation working with active states

**Step 3: Test responsive**

Resize browser to mobile width.

Expected: Sidebar hidden on mobile, content fills width

**Step 4: Test build**

Run:
```bash
cd playbook && pnpm build
```

Expected: Build completes successfully with no errors

**Step 5: Manual verification checklist**

- [ ] Sidebar shows all navigation items
- [ ] Active page highlighted in sidebar
- [ ] Content panel has gradient background
- [ ] Content panel has film grain overlay
- [ ] Text is dark and readable
- [ ] Both panels have black borders
- [ ] Both panels have rounded corners
- [ ] MDX content renders correctly (headings, paragraphs, lists, blockquotes)
- [ ] Mobile hides sidebar
- [ ] Landing page buttons still work

---

## Task 9: Add Mobile Sidebar

**Files:**
- Create: `playbook/components/MobileDocsNav.tsx`
- Modify: `playbook/app/docs/layout.tsx`
- Modify: `playbook/components/index.ts`

**Step 1: Create mobile navigation component**

Create file `playbook/components/MobileDocsNav.tsx`:

```typescript
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = {
  title: string;
  href?: string;
  separator?: boolean;
};

type MobileDocsNavProps = {
  navigation: NavItem[];
};

export function MobileDocsNav({ navigation }: MobileDocsNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-bg-dark border-2 border-text-dark rounded-lg p-4 flex items-center justify-between font-mono text-xs uppercase tracking-wide text-text-light"
      >
        <span>Menu</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-2 bg-bg-dark border-2 border-text-dark rounded-lg p-4 space-y-1">
          {navigation.map((item, index) => {
            if (item.separator) {
              return (
                <div key={index} className="py-2">
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
                onClick={() => setIsOpen(false)}
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
        </div>
      )}
    </div>
  );
}
```

**Step 2: Export MobileDocsNav**

Add to `playbook/components/index.ts`:

```typescript
export { MobileDocsNav } from './MobileDocsNav';
```

**Step 3: Add mobile nav to docs layout**

Modify `playbook/app/docs/layout.tsx` - add import:

```typescript
import { DocsSidebar, MobileDocsNav } from '@/components';
```

And update JSX to include mobile nav:

```typescript
<div className="max-w-7xl mx-auto py-6 px-4">
  {/* Mobile navigation */}
  <MobileDocsNav navigation={navigation} />

  <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
    {/* ... rest of layout */}
  </div>
</div>
```

**Step 4: Test mobile navigation**

Run dev server and resize to mobile.

Expected: Mobile menu button appears, clicking opens nav, clicking link closes nav

**Step 5: Commit**

```bash
git add playbook/components/MobileDocsNav.tsx playbook/components/index.ts playbook/app/docs/layout.tsx
git commit -m "feat: add mobile navigation for docs"
```

---

## Notes

- All MDX content files remain in `content/docs/` unchanged
- The `meta.json` file controls navigation order and section separators
- Custom MDX components are defined in `mdx-components.tsx`
- FloatingPanel component is reusable for other layouts
- Film grain effect matches marketing site exactly
- No Fumadocs = full control over styling
