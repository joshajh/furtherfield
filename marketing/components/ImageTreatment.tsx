'use client';

import Image from "next/image";

export type TreatmentVariant = 'dark' | 'light' | 'lemon';

type ImageTreatmentProps = {
  src: string;
  alt: string;
  variant?: TreatmentVariant;
  className?: string;
  showGrid?: boolean;
  showWaves?: boolean;
  priority?: boolean;
};

/**
 * ImageTreatment applies the Furtherfield visual treatment to images.
 *
 * The treatment includes:
 * - Color tint overlay (dark, light, or lemon palette)
 * - Film grain noise effect
 * - Optional decorative textures (grid and wave overlays)
 */
export function ImageTreatment({
  src,
  alt,
  variant = 'dark',
  className = '',
  showGrid = false,
  showWaves = false,
  priority = false,
}: ImageTreatmentProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Base image */}
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority={priority}
      />

      {/* Color tint overlay */}
      <div
        className={`absolute inset-0 pointer-events-none mix-blend-multiply ${
          variant === 'dark'
            ? 'bg-treatment-dark'
            : variant === 'light'
              ? 'bg-treatment-light'
              : 'bg-treatment-lemon'
        }`}
        aria-hidden="true"
      />

      {/* White overlay for softening */}
      <div
        className="absolute inset-0 pointer-events-none bg-white/10"
        aria-hidden="true"
      />

      {/* Film grain noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none treatment-noise"
        aria-hidden="true"
      />

      {/* Optional grid texture */}
      {showGrid && (
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          aria-hidden="true"
        >
          <Image
            src="/treatments/texture-grain.png"
            alt=""
            fill
            className="object-cover mix-blend-overlay"
          />
        </div>
      )}

      {/* Optional wave texture */}
      {showWaves && (
        <>
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            aria-hidden="true"
          >
            <Image
              src="/treatments/texture-brush-1.png"
              alt=""
              fill
              className="object-cover mix-blend-soft-light"
            />
          </div>
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            aria-hidden="true"
          >
            <Image
              src="/treatments/texture-brush-2.png"
              alt=""
              fill
              className="object-cover mix-blend-soft-light"
            />
          </div>
        </>
      )}
    </div>
  );
}
