import { notFound } from 'next/navigation';
import { getDocBySlug, getDocSlugs } from '@/lib/docs';
import { FloatingPanel } from '@/components';
import { compileMDX } from 'next-mdx-remote/rsc';
import { useMDXComponents } from '@/mdx-components';

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
    const { content } = await compileMDX({
      source: doc.content,
      options: { parseFrontmatter: false },
      components: useMDXComponents({}),
    });

    return (
      <div className="flex flex-col gap-6">
        {/* Page title above the content panel */}
        <h1 className="font-display text-text-light text-[36px] sm:text-[40px] md:text-[80px] lg:text-[100px] leading-[0.95] tracking-tight">
          {doc.frontmatter.title || slugPath}
        </h1>

        {/* Scrollable content panel */}
        <FloatingPanel className="max-w-none max-h-[calc(100vh-200px)] overflow-y-auto">
          <article>{content}</article>
        </FloatingPanel>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
