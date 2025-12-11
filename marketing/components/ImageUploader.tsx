"use client";

import { useState, useRef } from "react";

interface ImageUploaderProps {
  name: string;
  currentImage?: string | null;
  onUpload?: (url: string) => void;
}

export function ImageUploader({ name, currentImage, onUpload }: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState(currentImage || "");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setImageUrl(data.url);
      onUpload?.(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  function handleRemove() {
    setImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={imageUrl} />

      {imageUrl ? (
        <div className="relative">
          <div className="border border-text-dark rounded overflow-hidden bg-bg-dark/10">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="admin-btn-secondary text-sm !py-2 !px-3"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="admin-link admin-link-danger"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border border-dashed border-text-dark rounded p-8 text-center cursor-pointer hover:bg-treatment-lemon/20 transition-colors"
        >
          {isUploading ? (
            <p className="text-text-dark">Uploading...</p>
          ) : (
            <>
              <p className="text-text-dark font-medium">Click to upload image</p>
              <p className="text-text-dark/50 text-sm mt-1">JPEG, PNG, GIF, WebP (max 5MB)</p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
}
