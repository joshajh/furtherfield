"use client";

import { useRef, useCallback, useEffect } from "react";

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
  const editorRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);

  // Set initial content after mount
  useEffect(() => {
    if (editorRef.current && !initializedRef.current) {
      editorRef.current.innerHTML = defaultValue;
      initializedRef.current = true;
    }
  }, [defaultValue]);

  // Sync content to hidden input without causing re-render
  const syncContent = useCallback(() => {
    if (editorRef.current && hiddenInputRef.current) {
      hiddenInputRef.current.value = editorRef.current.innerHTML;
    }
  }, []);

  const wrapSelection = useCallback((tagName: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (!editorRef.current?.contains(range.commonAncestorContainer)) return;

    // Check if we're already inside this tag type
    let parentElement = range.commonAncestorContainer as Node;
    while (parentElement && parentElement !== editorRef.current) {
      if (parentElement.nodeName.toLowerCase() === tagName.toLowerCase()) {
        // Already wrapped, unwrap by replacing with contents
        const parent = parentElement.parentNode;
        if (parent) {
          while (parentElement.firstChild) {
            parent.insertBefore(parentElement.firstChild, parentElement);
          }
          parent.removeChild(parentElement);
        }
        syncContent();
        return;
      }
      parentElement = parentElement.parentNode as Node;
    }

    // Wrap selection in tag
    const wrapper = document.createElement(tagName);
    try {
      range.surroundContents(wrapper);
    } catch {
      // If surroundContents fails (partial selection), extract and wrap
      const fragment = range.extractContents();
      wrapper.appendChild(fragment);
      range.insertNode(wrapper);
    }

    // Restore selection
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(wrapper);
    selection.addRange(newRange);

    syncContent();
    editorRef.current?.focus();
  }, [syncContent]);

  const formatBlock = useCallback((tagName: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (!editorRef.current?.contains(range.commonAncestorContainer)) return;

    // Find the block-level parent
    let blockParent = range.commonAncestorContainer as Node;
    while (blockParent && blockParent !== editorRef.current) {
      if (blockParent.nodeType === Node.ELEMENT_NODE) {
        const el = blockParent as HTMLElement;
        const display = window.getComputedStyle(el).display;
        if (display === "block" || ["P", "H1", "H2", "H3", "H4", "DIV"].includes(el.tagName)) {
          break;
        }
      }
      blockParent = blockParent.parentNode as Node;
    }

    if (blockParent && blockParent !== editorRef.current && blockParent.nodeType === Node.ELEMENT_NODE) {
      // Replace the block element
      const newBlock = document.createElement(tagName);
      newBlock.innerHTML = (blockParent as HTMLElement).innerHTML;
      blockParent.parentNode?.replaceChild(newBlock, blockParent);

      // Set cursor inside new block
      const newRange = document.createRange();
      newRange.selectNodeContents(newBlock);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);
    } else {
      // Wrap content in new block
      const content = range.extractContents();
      const newBlock = document.createElement(tagName);
      newBlock.appendChild(content);
      range.insertNode(newBlock);
    }

    syncContent();
    editorRef.current?.focus();
  }, [syncContent]);

  const insertList = useCallback((ordered: boolean) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (!editorRef.current?.contains(range.commonAncestorContainer)) return;

    const listTag = ordered ? "ol" : "ul";
    const list = document.createElement(listTag);
    const li = document.createElement("li");

    const selectedContent = range.extractContents();
    if (selectedContent.textContent?.trim()) {
      li.appendChild(selectedContent);
    } else {
      li.innerHTML = "<br>";
    }

    list.appendChild(li);
    range.insertNode(list);

    // Move cursor to the list item
    const newRange = document.createRange();
    newRange.selectNodeContents(li);
    newRange.collapse(false);
    selection.removeAllRanges();
    selection.addRange(newRange);

    syncContent();
    editorRef.current?.focus();
  }, [syncContent]);

  const createLink = useCallback(() => {
    const url = prompt("Enter link URL:");
    if (!url) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (!editorRef.current?.contains(range.commonAncestorContainer)) return;

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    try {
      range.surroundContents(link);
    } catch {
      const fragment = range.extractContents();
      link.appendChild(fragment);
      range.insertNode(link);
    }

    syncContent();
    editorRef.current?.focus();
  }, [syncContent]);

  const removeFormatting = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (!editorRef.current?.contains(range.commonAncestorContainer)) return;

    const text = range.toString();
    range.deleteContents();
    range.insertNode(document.createTextNode(text));

    syncContent();
    editorRef.current?.focus();
  }, [syncContent]);

  const handleInput = useCallback(() => {
    syncContent();
  }, [syncContent]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(text));
    range.collapse(false);

    syncContent();
  }, [syncContent]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Handle Enter key to create paragraphs
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);

      // Insert a new paragraph
      const p = document.createElement("p");
      p.innerHTML = "<br>";
      range.deleteContents();
      range.insertNode(p);

      // Move cursor into the new paragraph
      const newRange = document.createRange();
      newRange.setStart(p, 0);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);

      syncContent();
    }
  }, [syncContent]);

  const handleBlur = useCallback(() => {
    syncContent();
  }, [syncContent]);

  const buttonClass = "px-2 py-1 text-xs border border-text-dark rounded hover:bg-treatment-lemon transition-colors";

  return (
    <div className="space-y-2">
      <input type="hidden" ref={hiddenInputRef} name={name} defaultValue={defaultValue} />

      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border border-text-dark rounded-t bg-bg-dark/5">
        <button
          type="button"
          onClick={() => wrapSelection("strong")}
          className={`${buttonClass} font-bold`}
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => wrapSelection("em")}
          className={`${buttonClass} italic`}
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => wrapSelection("u")}
          className={`${buttonClass} underline`}
          title="Underline"
        >
          U
        </button>
        <span className="w-px bg-text-dark/30 mx-1" />
        <button
          type="button"
          onClick={() => insertList(false)}
          className={buttonClass}
          title="Bullet List"
        >
          &bull; List
        </button>
        <button
          type="button"
          onClick={() => insertList(true)}
          className={buttonClass}
          title="Numbered List"
        >
          1. List
        </button>
        <span className="w-px bg-text-dark/30 mx-1" />
        <button
          type="button"
          onClick={() => formatBlock("h2")}
          className={`${buttonClass} font-bold`}
          title="Heading"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => formatBlock("h3")}
          className={`${buttonClass} font-bold`}
          title="Subheading"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => formatBlock("p")}
          className={buttonClass}
          title="Paragraph"
        >
          P
        </button>
        <span className="w-px bg-text-dark/30 mx-1" />
        <button
          type="button"
          onClick={createLink}
          className={buttonClass}
          title="Insert Link"
        >
          Link
        </button>
        <button
          type="button"
          onClick={removeFormatting}
          className={buttonClass}
          title="Clear Formatting"
        >
          Clear
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="w-full border border-text-dark border-t-0 rounded-b p-3 min-h-[150px] bg-transparent text-text-dark focus:outline-none focus:bg-treatment-lemon/20 prose prose-sm max-w-none [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:my-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_a]:text-[rgb(200,255,0)] [&_a]:underline [&_p]:my-2"
        style={{ minHeight: `${rows * 24}px` }}
        data-placeholder={placeholder}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: var(--color-divider);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
