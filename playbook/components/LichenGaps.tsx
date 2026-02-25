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
  x: number;
  y: number;
  size: number;
  rotation: number;
  flipX: boolean;
  opacity: number;
  layer: 'back' | 'front';
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
        opacity: 0.7,
      }}
    >
      <Image
        src={patch.src}
        alt=""
        width={100}
        height={100}
        className="w-full h-full object-contain animate-fade-in"
        style={{
          opacity: patch.opacity,
          animationDelay: `${parseInt(patch.id.split('-')[1]) * 20}ms`
        }}
      />
      <div
        className={`absolute inset-0 ${treatmentClass} mix-blend-multiply transition-colors duration-700 animate-fade-in`}
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
          animationDelay: `${parseInt(patch.id.split('-')[1]) * 20}ms`
        }}
      />
    </div>
  );
}

export function LichenGaps() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const treatmentClass = 'bg-treatment-acid';

  useEffect(() => {
    setMounted(true);
  }, []);

  const lichenPatches = useMemo(() => {
    const patches: LichenPatch[] = [];
    const seed = (pathname?.length || 42);

    // BACK LAYER
    const backPatchCount = 60;

    for (let i = 0; i < backPatchCount; i++) {
      const patchSeed = seed + i * 17;

      let xPos: number;
      let yPos: number;
      const edgeBias = seededRandom(patchSeed);

      if (edgeBias < 0.3) {
        xPos = seededRandom(patchSeed + 1) * 15;
        yPos = seededRandom(patchSeed + 2) * 100;
      } else if (edgeBias < 0.6) {
        xPos = 85 + seededRandom(patchSeed + 3) * 15;
        yPos = seededRandom(patchSeed + 4) * 100;
      } else {
        xPos = 15 + seededRandom(patchSeed + 5) * 70;
        yPos = seededRandom(patchSeed + 6) * 100;
      }

      patches.push({
        id: `back-${i}`,
        src: LICHEN_IMAGES[Math.floor(seededRandom(patchSeed + 7) * LICHEN_IMAGES.length)],
        x: xPos,
        y: yPos,
        size: edgeBias < 0.6
          ? 50 + seededRandom(patchSeed + 8) * 100
          : 35 + seededRandom(patchSeed + 8) * 60,
        rotation: seededRandom(patchSeed + 9) * 360,
        flipX: seededRandom(patchSeed + 10) > 0.5,
        opacity: (0.4 + seededRandom(patchSeed + 11) * 0.4) * 0.1,
        layer: 'back',
      });
    }

    // MIDDLE LAYER
    const middlePatchCount = 30;

    for (let i = 0; i < middlePatchCount; i++) {
      const patchSeed = seed + 2000 + i * 31;

      const xPos = 10 + seededRandom(patchSeed + 1) * 80;
      const yPos = seededRandom(patchSeed + 2) * 100;

      patches.push({
        id: `middle-${i}`,
        src: LICHEN_IMAGES[Math.floor(seededRandom(patchSeed + 3) * LICHEN_IMAGES.length)],
        x: xPos,
        y: yPos,
        size: 30 + seededRandom(patchSeed + 4) * 70,
        rotation: seededRandom(patchSeed + 5) * 360,
        flipX: seededRandom(patchSeed + 6) > 0.5,
        opacity: (0.35 + seededRandom(patchSeed + 7) * 0.35) * 0.1,
        layer: 'back',
      });
    }

    // FRONT LAYER
    const frontPatchCount = 20;

    for (let i = 0; i < frontPatchCount; i++) {
      const patchSeed = seed + 1000 + i * 23;

      let xPos: number;
      let yPos: number;
      const side = seededRandom(patchSeed);

      if (side < 0.5) {
        xPos = seededRandom(patchSeed + 1) * 8;
        yPos = seededRandom(patchSeed + 2) * 100;
      } else {
        xPos = 92 + seededRandom(patchSeed + 3) * 8;
        yPos = seededRandom(patchSeed + 4) * 100;
      }

      patches.push({
        id: `front-${i}`,
        src: LICHEN_IMAGES[Math.floor(seededRandom(patchSeed + 5) * LICHEN_IMAGES.length)],
        x: xPos,
        y: yPos,
        size: 40 + seededRandom(patchSeed + 6) * 80,
        rotation: seededRandom(patchSeed + 7) * 360,
        flipX: seededRandom(patchSeed + 8) > 0.5,
        opacity: (0.5 + seededRandom(patchSeed + 9) * 0.4) * 0.1,
        layer: 'front',
      });
    }

    return patches;
  }, [pathname]);

  if (!mounted) return null;

  const backPatches = lichenPatches.filter(p => p.layer === 'back');
  const frontPatches = lichenPatches.filter(p => p.layer === 'front');

  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
      >
        {backPatches.map((patch) => (
          <LichenPatchElement key={patch.id} patch={patch} treatmentClass={treatmentClass} />
        ))}
      </div>

      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
      >
        {frontPatches.map((patch) => (
          <LichenPatchElement key={patch.id} patch={patch} treatmentClass={treatmentClass} />
        ))}
      </div>
    </>
  );
}
