import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // h1 is rendered outside the content from frontmatter, so we hide any h1s in the content
    h1: ({ children }) => null,
    h2: ({ children }) => (
      <h2 className="callout inline-block mt-10 mb-4 text-base">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-2xl md:text-3xl text-text-dark mt-8 mb-3 leading-tight">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-mono text-sm uppercase tracking-wide text-text-dark/60 mt-6 mb-2">
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className="text-text-dark/70 text-base md:text-lg leading-relaxed mb-4">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="text-text-dark/70 mb-4 pl-6 list-disc space-y-2">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="text-text-dark/70 mb-4 pl-6 list-decimal space-y-2">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-base md:text-lg leading-relaxed">
        {children}
      </li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="bg-gradient-brand relative isolate border-l-4 border-treatment-acid rounded-r-lg p-6 my-8 text-text-dark italic font-display text-lg leading-7 before:content-[''] before:absolute before:inset-0 before:bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%220%200%20200%20200%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter%20id=%22noise%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.85%22%20numOctaves=%224%22%20stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20filter=%22url(%23noise)%22/%3E%3C/svg%3E')] before:opacity-60 before:mix-blend-overlay before:pointer-events-none before:rounded-r-lg before:-z-10">
        {children}
      </blockquote>
    ),
    strong: ({ children }) => (
      <strong className="text-text-dark font-semibold tracking-normal">
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
      <pre className="bg-bg-dark/5 border border-divider rounded-lg p-4 overflow-x-auto my-6 text-text-dark">
        {children}
      </pre>
    ),
    ...components,
  }
}
