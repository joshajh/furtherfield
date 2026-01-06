'use client';

import { useEffect, useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const LICHEN_IMAGES = [
  '/lichen/lichen-1.png',
  '/lichen/lichen-2.png',
  '/lichen/lichen-3.png',
  '/lichen/lichen-4.png',
  '/lichen/lichen-5.png',
  '/lichen/lichen-6.png',
  '/lichen/lichen-7.png',
  '/lichen/lichen-8.png',
  '/lichen/lichen-9.png',
];

type LichenPatch = {
  id: string;
  src: string;
  x: number; // percentage from left
  y: number; // percentage from top
  size: number; // width in pixels
  rotation: number;
  flipX: boolean;
  opacity: number;
  layer: 'back' | 'front'; // which layer this patch belongs to
};

// Seeded random for consistent results per page load
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function LichenPatchElement({
  patch,
  treatmentClass
}: {
  patch: LichenPatch;
  treatmentClass: string;
}) {
  return (
    <div
      className="absolute"
      style={{
        left: `${patch.x}%`,
        top: `${patch.y}%`,
        transform: `translate(-50%, -50%) rotate(${patch.rotation}deg) scaleX(${patch.flipX ? -1 : 1})`,
        width: patch.size,
        height: patch.size,
      }}
    >
      {/* Original image */}
      <Image
        src={patch.src}
        alt=""
        width={100}
        height={100}
        className="w-full h-full object-contain"
        style={{ opacity: patch.opacity }}
      />
      {/* Tint overlay */}
      <div
        className={`absolute inset-0 ${treatmentClass} mix-blend-multiply transition-colors duration-700`}
        style={{
          maskImage: `url(${patch.src})`,
          maskSize: 'contain',
          maskPosition: 'center',
          maskRepeat: 'no-repeat',
          WebkitMaskImage: `url(${patch.src})`,
          WebkitMaskSize: 'contain',
          WebkitMaskPosition: 'center',
          WebkitMaskRepeat: 'no-repeat',
          opacity: patch.opacity,
        }}
      />
    </div>
  );
}

export function LichenGaps() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Hide on Keystatic CMS routes
  const isKeystatic = pathname?.startsWith('/keystatic');

  // Use 'dark' treatment on event detail pages, 'acid' elsewhere
  const isEventDetail = pathname?.startsWith('/events/') && pathname !== '/events';
  const treatmentClass = isEventDetail ? 'bg-treatment-dark' : 'bg-treatment-acid';

  useEffect(() => {
    if (isKeystatic) return;
    setMounted(true);
  }, [isKeystatic]);

  // Generate fixed lichen patches distributed across the viewport
  const lichenPatches = useMemo(() => {
    const patches: LichenPatch[] = [];
    const seed = (pathname?.length || 42);

    // BACK LAYER - more patches, distributed across edges
    const backPatchCount = 60;

    for (let i = 0; i < backPatchCount; i++) {
      const patchSeed = seed + i * 17;

      // Position - bias towards edges but more in middle too
      let xPos: number;
      let yPos: number;
      const edgeBias = seededRandom(patchSeed);

      if (edgeBias < 0.3) {
        // Left edge (0-15%)
        xPos = seededRandom(patchSeed + 1) * 15;
        yPos = seededRandom(patchSeed + 2) * 100;
      } else if (edgeBias < 0.6) {
        // Right edge (85-100%)
        xPos = 85 + seededRandom(patchSeed + 3) * 15;
        yPos = seededRandom(patchSeed + 4) * 100;
      } else {
        // Scattered across middle (more of these now)
        xPos = 15 + seededRandom(patchSeed + 5) * 70;
        yPos = seededRandom(patchSeed + 6) * 100;
      }

      patches.push({
        id: `back-${i}`,
        src: LICHEN_IMAGES[Math.floor(seededRandom(patchSeed + 7) * LICHEN_IMAGES.length)],
        x: xPos,
        y: yPos,
        size: edgeBias < 0.6
          ? 50 + seededRandom(patchSeed + 8) * 100 // Edge patches: 50-150px
          : 35 + seededRandom(patchSeed + 8) * 60, // Middle patches: 35-95px
        rotation: seededRandom(patchSeed + 9) * 360,
        flipX: seededRandom(patchSeed + 10) > 0.5,
        opacity: 0.4 + seededRandom(patchSeed + 11) * 0.4, // 0.4-0.8
        layer: 'back',
      });
    }

    // MIDDLE LAYER - extra patches scattered across the center
    const middlePatchCount = 30;

    for (let i = 0; i < middlePatchCount; i++) {
      const patchSeed = seed + 2000 + i * 31;

      // Position - anywhere in viewport
      const xPos = 10 + seededRandom(patchSeed + 1) * 80; // 10-90%
      const yPos = seededRandom(patchSeed + 2) * 100;

      patches.push({
        id: `middle-${i}`,
        src: LICHEN_IMAGES[Math.floor(seededRandom(patchSeed + 3) * LICHEN_IMAGES.length)],
        x: xPos,
        y: yPos,
        size: 30 + seededRandom(patchSeed + 4) * 70, // 30-100px
        rotation: seededRandom(patchSeed + 5) * 360,
        flipX: seededRandom(patchSeed + 6) > 0.5,
        opacity: 0.35 + seededRandom(patchSeed + 7) * 0.35, // 0.35-0.7
        layer: 'back',
      });
    }

    // FRONT LAYER - fewer patches, only at edges, on top of content
    const frontPatchCount = 20;

    for (let i = 0; i < frontPatchCount; i++) {
      const patchSeed = seed + 1000 + i * 23; // Different seed offset

      // Position - only at extreme edges
      let xPos: number;
      let yPos: number;
      const side = seededRandom(patchSeed);

      if (side < 0.5) {
        // Left edge (0-8%)
        xPos = seededRandom(patchSeed + 1) * 8;
        yPos = seededRandom(patchSeed + 2) * 100;
      } else {
        // Right edge (92-100%)
        xPos = 92 + seededRandom(patchSeed + 3) * 8;
        yPos = seededRandom(patchSeed + 4) * 100;
      }

      patches.push({
        id: `front-${i}`,
        src: LICHEN_IMAGES[Math.floor(seededRandom(patchSeed + 5) * LICHEN_IMAGES.length)],
        x: xPos,
        y: yPos,
        size: 40 + seededRandom(patchSeed + 6) * 80, // 40-120px
        rotation: seededRandom(patchSeed + 7) * 360,
        flipX: seededRandom(patchSeed + 8) > 0.5,
        opacity: 0.5 + seededRandom(patchSeed + 9) * 0.4, // 0.5-0.9
        layer: 'front',
      });
    }

    return patches;
  }, [pathname]);

  if (!mounted || isKeystatic) return null;

  const backPatches = lichenPatches.filter(p => p.layer === 'back');
  const frontPatches = lichenPatches.filter(p => p.layer === 'front');

  return (
    <>
      {/* Back layer - behind content, in front of black background */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        aria-hidden="true"
      >
        {backPatches.map((patch) => (
          <LichenPatchElement key={patch.id} patch={patch} treatmentClass={treatmentClass} />
        ))}
      </div>

      {/* Front layer - still behind content but more visible at edges */}
      <div
        className="fixed inset-0 pointer-events-none z-[2]"
        aria-hidden="true"
      >
        {frontPatches.map((patch) => (
          <LichenPatchElement key={patch.id} patch={patch} treatmentClass={treatmentClass} />
        ))}
      </div>
    </>
  );
}
