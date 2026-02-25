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
