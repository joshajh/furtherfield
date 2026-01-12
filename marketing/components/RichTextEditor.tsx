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

    // Get the node where the cursor/selection starts
    let startNode = range.startContainer;

    // If it's a text node, get the parent element
    if (startNode.nodeType === Node.TEXT_NODE) {
      startNode = startNode.parentNode as Node;
    }

    // Find the closest block-level parent (direct child of editor)
    const blockTags = ["P", "H1", "H2", "H3", "H4", "H5", "H6", "DIV", "BLOCKQUOTE"];
    let blockParent: Node | null = startNode;

    // Walk up to find a block element that's a direct child of the editor
    while (blockParent && blockParent !== editorRef.current) {
      if (
        blockParent.nodeType === Node.ELEMENT_NODE &&
        blockTags.includes((blockParent as HTMLElement).tagName) &&
        blockParent.parentNode === editorRef.current
      ) {
        break;
      }
      blockParent = blockParent.parentNode;
    }

    // If we found a valid block parent that's a direct child of the editor
    if (blockParent && blockParent !== editorRef.current && blockParent.parentNode === editorRef.current) {
      const oldBlock = blockParent as HTMLElement;

      // If it's already the target tag, convert to paragraph
      if (oldBlock.tagName.toLowerCase() === tagName.toLowerCase()) {
        if (tagName.toLowerCase() !== "p") {
          const newBlock = document.createElement("p");
          newBlock.innerHTML = oldBlock.innerHTML || "<br>";
          oldBlock.parentNode?.replaceChild(newBlock, oldBlock);

          const newRange = document.createRange();
          newRange.selectNodeContents(newBlock);
          newRange.collapse(false);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
        syncContent();
        editorRef.current?.focus();
        return;
      }

      // Replace the block element with the new tag type
      const newBlock = document.createElement(tagName);
      newBlock.innerHTML = oldBlock.innerHTML || "<br>";
      oldBlock.parentNode?.replaceChild(newBlock, oldBlock);

      // Set cursor inside new block
      const newRange = document.createRange();
      newRange.selectNodeContents(newBlock);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);
    } else {
      // No block parent found - we're likely in raw text directly in the editor
      // or the editor is empty. Wrap ALL content in proper block elements.

      // If editor is empty or only has a BR, create the block element directly
      if (!editorRef.current?.textContent?.trim()) {
        editorRef.current!.innerHTML = "";
        const newBlock = document.createElement(tagName);
        newBlock.innerHTML = "<br>";
        editorRef.current!.appendChild(newBlock);

        const newRange = document.createRange();
        newRange.setStart(newBlock, 0);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      } else {
        // There's content but it's not in proper blocks
        // Wrap all editor content in proper block elements first
        const fragment = document.createDocumentFragment();
        const childNodes = Array.from(editorRef.current!.childNodes);

        let currentParagraph: HTMLElement | null = null;

        childNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as HTMLElement;
            if (blockTags.includes(el.tagName)) {
              // Already a block element, add as-is
              if (currentParagraph) {
                fragment.appendChild(currentParagraph);
                currentParagraph = null;
              }
              fragment.appendChild(node.cloneNode(true));
            } else {
              // Inline element, add to current paragraph
              if (!currentParagraph) {
                currentParagraph = document.createElement("p");
              }
              currentParagraph.appendChild(node.cloneNode(true));
            }
          } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
            // Text node with content
            if (!currentParagraph) {
              currentParagraph = document.createElement("p");
            }
            currentParagraph.appendChild(node.cloneNode(true));
          }
        });

        if (currentParagraph) {
          fragment.appendChild(currentParagraph);
        }

        // Replace editor content with properly structured content
        editorRef.current!.innerHTML = "";
        editorRef.current!.appendChild(fragment);

        // Now find the first block and convert it to the target tag
        const firstBlock = editorRef.current!.firstElementChild;
        if (firstBlock && blockTags.includes(firstBlock.tagName)) {
          const newBlock = document.createElement(tagName);
          newBlock.innerHTML = firstBlock.innerHTML || "<br>";
          firstBlock.parentNode?.replaceChild(newBlock, firstBlock);

          const newRange = document.createRange();
          newRange.selectNodeContents(newBlock);
          newRange.collapse(false);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      }
    }

    syncContent();
    editorRef.current?.focus();
  }, [syncContent]);

  const insertList = useCallback((ordered: boolean) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (!editorRef.current?.contains(range.commonAncestorContainer)) return;

    // Check if we're already inside a list
    let currentNode: Node | null = range.commonAncestorContainer;
    while (currentNode && currentNode !== editorRef.current) {
      if (currentNode.nodeType === Node.ELEMENT_NODE) {
        const tagName = (currentNode as HTMLElement).tagName;
        if (tagName === "UL" || tagName === "OL") {
          // Already in a list - convert to the other type or remove
          const existingList = currentNode as HTMLElement;
          const newListTag = ordered ? "ol" : "ul";

          if (existingList.tagName.toLowerCase() === newListTag) {
            // Same type - unwrap the list (convert to paragraphs)
            const items = existingList.querySelectorAll("li");
            const fragment = document.createDocumentFragment();
            items.forEach((li) => {
              const p = document.createElement("p");
              p.innerHTML = li.innerHTML || "<br>";
              fragment.appendChild(p);
            });
            existingList.parentNode?.replaceChild(fragment, existingList);
          } else {
            // Different type - convert to the new list type
            const newList = document.createElement(newListTag);
            newList.innerHTML = existingList.innerHTML;
            existingList.parentNode?.replaceChild(newList, existingList);
          }

          syncContent();
          editorRef.current?.focus();
          return;
        }
      }
      currentNode = currentNode.parentNode;
    }

    // Check if cursor is inside a block element (p, h2, h3, etc.) - convert that block to a list item
    let blockParent: Node | null = range.startContainer;
    if (blockParent.nodeType === Node.TEXT_NODE) {
      blockParent = blockParent.parentNode;
    }

    const blockTags = ["P", "H1", "H2", "H3", "H4", "H5", "H6", "DIV"];
    while (blockParent && blockParent !== editorRef.current) {
      if (
        blockParent.nodeType === Node.ELEMENT_NODE &&
        blockTags.includes((blockParent as HTMLElement).tagName) &&
        blockParent.parentNode === editorRef.current
      ) {
        // Found a block element - convert it to a list
        const oldBlock = blockParent as HTMLElement;
        const listTag = ordered ? "ol" : "ul";
        const list = document.createElement(listTag);
        const li = document.createElement("li");
        li.innerHTML = oldBlock.innerHTML || "<br>";
        list.appendChild(li);
        oldBlock.parentNode?.replaceChild(list, oldBlock);

        // Set cursor inside the list item
        const newRange = document.createRange();
        newRange.selectNodeContents(li);
        newRange.collapse(false);
        selection.removeAllRanges();
        selection.addRange(newRange);

        syncContent();
        editorRef.current?.focus();
        return;
      }
      blockParent = blockParent.parentNode;
    }

    // No block parent - create a new list
    const listTag = ordered ? "ol" : "ul";
    const list = document.createElement(listTag);

    const selectedContent = range.extractContents();
    const textContent = selectedContent.textContent || "";

    // Split content by line breaks and create list items
    if (textContent.trim()) {
      // Get text and split by newlines or br tags
      const tempDiv = document.createElement("div");
      tempDiv.appendChild(selectedContent);
      const html = tempDiv.innerHTML;

      // Split by br tags or actual newlines in text
      const lines = html.split(/<br\s*\/?>/gi).map((line) => line.trim()).filter((line) => line.length > 0);

      if (lines.length > 0) {
        lines.forEach((line) => {
          const li = document.createElement("li");
          li.innerHTML = line;
          list.appendChild(li);
        });
      } else {
        // Single line or no content
        const li = document.createElement("li");
        li.appendChild(selectedContent.cloneNode(true));
        list.appendChild(li);
      }
    } else {
      // No selection - create empty list item
      const li = document.createElement("li");
      li.innerHTML = "<br>";
      list.appendChild(li);
    }

    range.insertNode(list);

    // Move cursor to the last list item
    const lastLi = list.querySelector("li:last-child");
    if (lastLi) {
      const newRange = document.createRange();
      newRange.selectNodeContents(lastLi);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }

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

      // Find the current block element we're in
      let currentBlock: Node | null = range.startContainer;
      if (currentBlock.nodeType === Node.TEXT_NODE) {
        currentBlock = currentBlock.parentNode;
      }

      const blockTags = ["P", "H1", "H2", "H3", "H4", "H5", "H6", "DIV", "LI"];
      while (currentBlock && currentBlock !== editorRef.current) {
        if (
          currentBlock.nodeType === Node.ELEMENT_NODE &&
          blockTags.includes((currentBlock as HTMLElement).tagName)
        ) {
          break;
        }
        currentBlock = currentBlock.parentNode;
      }

      // If we're in a list item, let default behavior handle it (or handle specially)
      if (currentBlock && (currentBlock as HTMLElement).tagName === "LI") {
        // For list items, create a new list item
        const li = document.createElement("li");
        li.innerHTML = "<br>";

        // Insert after current list item
        const parentList = currentBlock.parentNode;
        if (parentList && currentBlock.nextSibling) {
          parentList.insertBefore(li, currentBlock.nextSibling);
        } else if (parentList) {
          parentList.appendChild(li);
        }

        // Move cursor to new list item
        const newRange = document.createRange();
        newRange.setStart(li, 0);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);

        syncContent();
        return;
      }

      // Create a new paragraph
      const p = document.createElement("p");
      p.innerHTML = "<br>";

      // If we found a block element, insert the new paragraph AFTER it
      if (currentBlock && currentBlock !== editorRef.current && currentBlock.parentNode === editorRef.current) {
        // Insert new paragraph after the current block
        if (currentBlock.nextSibling) {
          editorRef.current!.insertBefore(p, currentBlock.nextSibling);
        } else {
          editorRef.current!.appendChild(p);
        }
      } else if (currentBlock && currentBlock !== editorRef.current) {
        // We're in a nested block - find the top-level block
        let topBlock = currentBlock;
        while (topBlock.parentNode && topBlock.parentNode !== editorRef.current) {
          topBlock = topBlock.parentNode;
        }
        if (topBlock.nextSibling) {
          editorRef.current!.insertBefore(p, topBlock.nextSibling);
        } else {
          editorRef.current!.appendChild(p);
        }
      } else {
        // No block found, just append
        editorRef.current!.appendChild(p);
      }

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
        className="w-full border border-text-dark border-t-0 rounded-b p-3 min-h-[150px] bg-transparent text-text-dark focus:outline-none focus:bg-treatment-lemon/20 prose prose-sm max-w-none [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:my-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ul]:ml-0 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_ol]:ml-0 [&_li]:my-1 [&_li]:pl-0 [&_a]:text-[rgb(200,255,0)] [&_a]:underline [&_p]:my-2"
        style={{ minHeight: `${rows * 24}px` }}
        data-placeholder={placeholder}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: var(--color-divider);
          pointer-events: none;
        }
        [contenteditable] :global(ul),
        [contenteditable] :global(ol) {
          list-style-position: outside;
          margin-left: 1.5rem;
        }
        [contenteditable] :global(li) {
          display: list-item;
          margin: 0.25rem 0;
        }
      `}</style>
    </div>
  );
}
