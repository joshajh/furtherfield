import { notFound } from 'next/navigation';
import { getDocBySlug, getDocSlugs } from '@/lib/docs';
import { FloatingPanel, DocsHeader, DocsSidebar } from '@/components';
import { compileMDX } from 'next-mdx-remote/rsc';
import { useMDXComponents } from '@/mdx-components';
import { getNavigation } from '@/lib/docs';

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateStaticParams() {
  const slugs = getDocSlugs();
  return slugs.map((slug) => ({ slug: slug.split('/') }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const doc = getDocBySlug(slugPath);

  return {
    title: doc.frontmatter.title || slugPath,
    description: doc.frontmatter.description,
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const slugPath = slug.join('/');

  try {
    const doc = getDocBySlug(slugPath);
    const navigation = getNavigation();
    const { content } = await compileMDX({
      source: doc.content,
      options: { parseFrontmatter: false },
      components: useMDXComponents({}),
    });

    return (
      <>
        {/* Header with brandmark and title - full width */}
        <DocsHeader title={doc.frontmatter.title || slugPath} />

        {/* Content grid - sidebar and content panel aligned */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <DocsSidebar navigation={navigation} />
            </div>
          </aside>

          {/* Scrollable content panel */}
          <FloatingPanel className="max-w-none max-h-[calc(100vh-200px)] overflow-y-auto">
            <article>{content}</article>
          </FloatingPanel>
        </div>
      </>
    );
  } catch (error) {
    notFound();
  }
}
