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
