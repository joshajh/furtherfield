'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const LICHEN_IMAGES = [
  '/lichen-ruth-web/Lichen1.png',
  '/lichen-ruth-web/Lichen1a- light.png',
  '/lichen-ruth-web/Lichen1b- light.png',
  '/lichen-ruth-web/Lichen2- light.png',
  '/lichen-ruth-web/Lichen2a- light.png',
  '/lichen-ruth-web/Lichen2b- light.png',
  '/lichen-ruth-web/Lichen2c- light.png',
  '/lichen-ruth-web/Lichen3.png',
  '/lichen-ruth-web/lichen4.png',
  '/lichen-ruth-web/lichen4a.png',
  '/lichen-ruth-web/lichen5.png',
  '/lichen-ruth-web/lichen5a.png',
];

type LichenPatch = {
  id: string;
  src: string;
  edge: 'top' | 'bottom' | 'left' | 'right';
  position: number; // percentage along the edge
  size: number;
  rotation: number;
  flipX: boolean;
  opacity: number;
  offset: number; // how far outside the container
};

// Seeded random for consistent results
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

type LichenContainerProps = {
  children: React.ReactNode;
  className?: string;
  seed?: number; // unique seed for this container
  density?: 'sparse' | 'normal' | 'dense'; // how much lichen
  edges?: ('top' | 'bottom' | 'left' | 'right')[]; // which edges to decorate
};

export function LichenContainer({
  children,
  className = '',
  seed = 0,
  density = 'normal',
  edges = ['top', 'bottom', 'left', 'right'],
}: LichenContainerProps) {
  const pathname = usePathname();

  const lichenPatches = useMemo(() => {
    const patches: LichenPatch[] = [];
    const baseSeed = seed + (pathname?.length || 0);

    // Patches per edge based on density
    const patchesPerEdge = density === 'sparse' ? 2 : density === 'normal' ? 4 : 6;

    edges.forEach((edge, edgeIndex) => {
      const edgePatchCount = patchesPerEdge + Math.floor(seededRandom(baseSeed + edgeIndex * 100) * 2);

      for (let i = 0; i < edgePatchCount; i++) {
        const patchSeed = baseSeed + edgeIndex * 100 + i * 13;

        // Position along the edge (0-100%)
        const position = seededRandom(patchSeed) * 100;

        // Cluster towards corners sometimes
        let adjustedPosition = position;
        if (seededRandom(patchSeed + 1) > 0.6) {
          // Bias towards corners
          adjustedPosition = position < 50
            ? seededRandom(patchSeed + 2) * 20 // 0-20%
            : 80 + seededRandom(patchSeed + 3) * 20; // 80-100%
        }

        patches.push({
          id: `${edge}-${i}`,
          src: LICHEN_IMAGES[Math.floor(seededRandom(patchSeed + 4) * LICHEN_IMAGES.length)],
          edge,
          position: adjustedPosition,
          size: 45 + seededRandom(patchSeed + 5) * 45, // 45-90px
          rotation: seededRandom(patchSeed + 6) * 360,
          flipX: seededRandom(patchSeed + 7) > 0.5,
          opacity: 0.5 + seededRandom(patchSeed + 8) * 0.4, // 0.5-0.9
          offset: 5 + seededRandom(patchSeed + 9) * 15, // 5-20px outside
        });
      }
    });

    return patches;
  }, [seed, pathname, density, edges]);

  return (
    <div className={`relative ${className}`}>
      {children}

      {/* Lichen patches around the edges */}
      {lichenPatches.map((patch) => {
        let style: React.CSSProperties = {
          position: 'absolute',
          width: patch.size,
          height: patch.size,
          transform: `translate(-50%, -50%) rotate(${patch.rotation}deg) scaleX(${patch.flipX ? -1 : 1})`,
          zIndex: 1,
          pointerEvents: 'none',
        };

        // Position based on edge
        switch (patch.edge) {
          case 'top':
            style.left = `${patch.position}%`;
            style.top = -patch.offset;
            break;
          case 'bottom':
            style.left = `${patch.position}%`;
            style.bottom = -patch.offset;
            style.top = 'auto';
            style.transform = `translate(-50%, 50%) rotate(${patch.rotation}deg) scaleX(${patch.flipX ? -1 : 1})`;
            break;
          case 'left':
            style.left = -patch.offset;
            style.top = `${patch.position}%`;
            break;
          case 'right':
            style.right = -patch.offset;
            style.left = 'auto';
            style.top = `${patch.position}%`;
            style.transform = `translate(50%, -50%) rotate(${patch.rotation}deg) scaleX(${patch.flipX ? -1 : 1})`;
            break;
        }

        return (
          <div key={patch.id} style={style} aria-hidden="true">
            <Image
              src={patch.src}
              alt=""
              width={70}
              height={70}
              className="w-full h-full object-contain"
              style={{ opacity: patch.opacity }}
            />
          </div>
        );
      })}
    </div>
  );
}
