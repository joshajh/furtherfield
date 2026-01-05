import type { ElementType } from "react";

interface HtmlContentProps {
  html: string | null | undefined;
  className?: string;
  as?: ElementType;
}

/**
 * Safely renders HTML content from the CMS.
 * Uses dangerouslySetInnerHTML but the content comes from our admin-only CMS.
 */
export function HtmlContent({ html, className = "", as: Tag = "div" }: HtmlContentProps) {
  if (!html) return null;

  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
