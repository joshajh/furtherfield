import { notFound } from 'next/navigation';
import { getDocBySlug, getDocSlugs, getNavigation } from '@/lib/docs';
import { Brandmark3D } from '@/components';
import { compileMDX } from 'next-mdx-remote/rsc';
import { useMDXComponents } from '@/mdx-components';
import Link from 'next/link';

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
      <div className="space-y-8">
        {/* Brandmark */}
        <div className="flex justify-center">
          <Link href="/">
            <Brandmark3D size={40} autoRotate={true} />
          </Link>
        </div>

        {/* Page title */}
        <h1 className="font-display text-[40px] sm:text-[50px] md:text-[80px] leading-[0.9] text-text-dark text-center">
          {doc.frontmatter.title || slugPath}
        </h1>

        {/* Content */}
        <article className="text-left space-y-6">{content}</article>

        {/* Navigation */}
        <nav className="pt-8 mt-8 border-t border-text-dark/20 space-y-2">
          <p className="callout inline-block mb-4">Contents</p>
          {navigation.map((item, index) => {
            if (item.separator) {
              return (
                <p key={index} className="text-xs uppercase tracking-wider text-text-dark/60 mt-4 mb-2 font-mono">
                  {item.title}
                </p>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href || '#'}
                className="block text-sm md:text-base text-text-dark/70 hover:text-text-dark underline decoration-treatment-acid decoration-2 underline-offset-2"
              >
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
