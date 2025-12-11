"use client";

import { useState, useRef, useCallback } from "react";

interface RichTextEditorProps {
  name: string;
  defaultValue?: string;
  rows?: number;
  placeholder?: string;
}

export function RichTextEditor({
  name,
  defaultValue = "",
  rows = 6,
  placeholder = "Enter content...",
}: RichTextEditorProps) {
  const [content, setContent] = useState(defaultValue);
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    // Update hidden input with current content
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  }, []);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  }, []);

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={content} />

      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border border-text-dark rounded-t bg-bg-dark/5">
        <button
          type="button"
          onClick={() => execCommand("bold")}
          className="px-2 py-1 text-xs font-bold border border-text-dark rounded hover:bg-treatment-lemon transition-colors"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => execCommand("italic")}
          className="px-2 py-1 text-xs italic border border-text-dark rounded hover:bg-treatment-lemon transition-colors"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => execCommand("underline")}
          className="px-2 py-1 text-xs underline border border-text-dark rounded hover:bg-treatment-lemon transition-colors"
          title="Underline"
        >
          U
        </button>
        <span className="w-px bg-text-dark/30 mx-1" />
        <button
          type="button"
          onClick={() => execCommand("insertUnorderedList")}
          className="px-2 py-1 text-xs border border-text-dark rounded hover:bg-treatment-lemon transition-colors"
          title="Bullet List"
        >
          &bull; List
        </button>
        <button
          type="button"
          onClick={() => execCommand("insertOrderedList")}
          className="px-2 py-1 text-xs border border-text-dark rounded hover:bg-treatment-lemon transition-colors"
          title="Numbered List"
        >
          1. List
        </button>
        <span className="w-px bg-text-dark/30 mx-1" />
        <button
          type="button"
          onClick={() => execCommand("formatBlock", "h2")}
          className="px-2 py-1 text-xs font-bold border border-text-dark rounded hover:bg-treatment-lemon transition-colors"
          title="Heading"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => execCommand("formatBlock", "h3")}
          className="px-2 py-1 text-xs font-bold border border-text-dark rounded hover:bg-treatment-lemon transition-colors"
          title="Subheading"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => execCommand("formatBlock", "p")}
          className="px-2 py-1 text-xs border border-text-dark rounded hover:bg-treatment-lemon transition-colors"
          title="Paragraph"
        >
          P
        </button>
        <span className="w-px bg-text-dark/30 mx-1" />
        <button
          type="button"
          onClick={() => {
            const url = prompt("Enter link URL:");
            if (url) execCommand("createLink", url);
          }}
          className="px-2 py-1 text-xs border border-text-dark rounded hover:bg-treatment-lemon transition-colors"
          title="Insert Link"
        >
          Link
        </button>
        <button
          type="button"
          onClick={() => execCommand("removeFormat")}
          className="px-2 py-1 text-xs border border-text-dark rounded hover:bg-treatment-lemon transition-colors"
          title="Clear Formatting"
        >
          Clear
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: defaultValue }}
        className="w-full border border-text-dark border-t-0 rounded-b p-3 min-h-[150px] bg-transparent text-text-dark focus:outline-none focus:bg-treatment-lemon/20 prose prose-sm max-w-none"
        style={{ minHeight: `${rows * 24}px` }}
        data-placeholder={placeholder}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: var(--color-divider);
          pointer-events: none;
        }
        [contenteditable] h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.5rem 0;
        }
        [contenteditable] h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0.5rem 0;
        }
        [contenteditable] ul,
        [contenteditable] ol {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        [contenteditable] a {
          color: rgb(200, 255, 0);
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
