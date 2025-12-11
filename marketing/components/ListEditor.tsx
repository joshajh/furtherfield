"use client";

import { useState } from "react";

interface ListEditorProps {
  name: string;
  defaultValue?: string; // JSON array string
  placeholder?: string;
}

export function ListEditor({
  name,
  defaultValue = "[]",
  placeholder = "Add item...",
}: ListEditorProps) {
  const [items, setItems] = useState<string[]>(() => {
    try {
      return JSON.parse(defaultValue) || [];
    } catch {
      return [];
    }
  });
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem("");
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={JSON.stringify(items)} />

      {/* Current items */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1 bg-treatment-lemon/30 border border-text-dark rounded text-sm text-text-dark"
            >
              {item}
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-text-dark/50 hover:text-red-600 transition-colors"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Add new item */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="admin-input flex-1"
        />
        <button
          type="button"
          onClick={addItem}
          className="admin-btn-secondary !px-4"
        >
          Add
        </button>
      </div>
    </div>
  );
}
