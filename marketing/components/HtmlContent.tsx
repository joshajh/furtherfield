import type { ElementType } from "react";

interface HtmlContentProps {
  html: string | null | undefined;
  className?: string;
  as?: ElementType;
}

/**
 * Safely renders HTML content from the CMS.
 * Uses dangerouslySetInnerHTML but the content comes from our admin-only CMS.
 * The `isolate` class creates a new stacking context to prevent style leakage.
 */
export function HtmlContent({ html, className = "", as: Tag = "div" }: HtmlContentProps) {
  if (!html) return null;

  return (
    <Tag
      className={`isolate ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
