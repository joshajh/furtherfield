'use client';

import { useMemo } from 'react';
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

function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function FixedAreaLichen({ area }: { area: 'menu' | 'h1' }) {
  const patches = useMemo(() => {
    const result = [];
    const seed = area === 'menu' ? 5000 : 6000;
    const patchCount = 12;

    for (let i = 0; i < patchCount; i++) {
      const patchSeed = seed + i * 13;

      // Keep patches away from edges (10% margin on each side)
      const xPos = 10 + seededRandom(patchSeed + 1) * 80; // 10-90%

      // For h1 area, bias patches to bottom (where the pb-2.5 gap is)
      // For menu area, spread them out more
      // Keep away from top/bottom edges too
      let yPos;
      if (area === 'h1') {
        // Concentrate at bottom 30% but with margin
        yPos = 65 + seededRandom(patchSeed + 2) * 25; // 65-90%
      } else {
        // Spread across the area with margins
        yPos = 10 + seededRandom(patchSeed + 2) * 80; // 10-90%
      }

      result.push({
        id: `${area}-${i}`,
        src: LICHEN_IMAGES[Math.floor(seededRandom(patchSeed) * LICHEN_IMAGES.length)],
        x: xPos,
        y: yPos,
        size: 25 + seededRandom(patchSeed + 3) * 45,
        rotation: seededRandom(patchSeed + 4) * 360,
        flipX: seededRandom(patchSeed + 5) > 0.5,
        opacity: 0.35 + seededRandom(patchSeed + 6) * 0.35,
      });
    }

    return result;
  }, [area]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {patches.map((patch) => (
        <div
          key={patch.id}
          className="absolute"
          style={{
            left: `${patch.x}%`,
            top: `${patch.y}%`,
            transform: `translate(-50%, -50%) rotate(${patch.rotation}deg) scaleX(${patch.flipX ? -1 : 1})`,
            width: patch.size,
            height: patch.size,
          }}
        >
          <Image
            src={patch.src}
            alt=""
            width={100}
            height={100}
            className="w-full h-full object-contain"
            style={{ opacity: patch.opacity }}
          />
          <div
            className="absolute inset-0 bg-treatment-acid mix-blend-multiply"
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
      ))}
    </div>
  );
}
