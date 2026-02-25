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
      <div className="flex flex-col gap-2.5">
        {/* Hero Section - Gradient background with title */}
        <section className="bg-gradient-brand rounded-lg mx-2.5 px-5 py-4">
          <div className="max-w-4xl mx-auto text-left">
            <h1 className="font-display text-[28px] sm:text-[40px] md:text-[60px] leading-[0.9] text-text-dark">
              {doc.frontmatter.title || slugPath}
            </h1>
          </div>
        </section>

        {/* Content Section - Light background */}
        <section className="bg-bg-light rounded-lg mx-2.5 px-5 py-8">
          <div className="max-w-4xl mx-auto">
            <article className="space-y-6">{content}</article>
          </div>
        </section>

        {/* Brandmark Section - Centered */}
        <section className="mx-2.5 py-6">
          <div className="flex justify-center">
            <Link href="/">
              <Brandmark3D size={40} autoRotate={true} />
            </Link>
          </div>
        </section>

        {/* Navigation Section - Gradient background */}
        <section className="bg-gradient-brand rounded-lg mx-2.5 px-5 py-8">
          <div className="max-w-4xl mx-auto">
            <nav className="space-y-2">
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
        </section>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
