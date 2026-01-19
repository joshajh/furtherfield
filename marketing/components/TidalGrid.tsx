"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";

type TidalGridProps = {
  className?: string;
  gridSize?: number;
  waveAmplitude?: number;
  waveFrequency?: number;
  strokeColor?: string;
  strokeWidth?: number;
  animationSpeed?: number;
};

type WaveParams = {
  amplitude: number;
  frequency: number;
  phase: number;
};

// Simulated maritime data generator (based on Felixstowe port patterns)
export function generateMaritimeData() {
  const hour = new Date().getHours();

  // Simulate tidal patterns (roughly 12.5 hour cycle)
  const tidalPhase = ((Date.now() / 1000 / 60 / 60) % 12.5) / 12.5;
  const tideLevel = Math.sin(tidalPhase * Math.PI * 2) * 2 + 1; // -1 to 3 mAOD range

  // Simulate ship activity (busier during day)
  const dayActivity = Math.sin(((hour - 6) / 24) * Math.PI * 2) * 0.5 + 0.5;
  const baseShips = 8 + Math.floor(Math.random() * 4);
  const totalShips = Math.floor(baseShips * (0.5 + dayActivity * 0.5));
  const arrivals = Math.floor(totalShips * (0.4 + Math.random() * 0.2));
  const departures = totalShips - arrivals;

  return {
    tideLevel,
    totalShips,
    arrivals,
    departures,
    flow: arrivals - departures,
  };
}

function calculateWaveParams(
  baseAmplitude: number,
  baseFrequency: number,
  maritimeData: ReturnType<typeof generateMaritimeData>,
  animationPhase: number
): WaveParams {
  // Normalize tide level (-1 to 3) to 0-1 range
  const normalizedTide = (maritimeData.tideLevel + 1) / 4;

  // Ship flow affects frequency
  const flowRatio = (maritimeData.flow + 5) / 10;
  const activityLevel = maritimeData.totalShips / 15;

  // Blend tidal and ship influences
  const amplitudeModifier = 0.6 + normalizedTide * 0.25 + activityLevel * 0.15;
  const frequencyModifier = 0.7 + flowRatio * 0.3;

  return {
    amplitude: baseAmplitude * amplitudeModifier,
    frequency: baseFrequency * frequencyModifier,
    phase: animationPhase + normalizedTide * Math.PI,
  };
}

function generateWavyPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  waveParams: WaveParams,
  direction: "horizontal" | "vertical",
  lineIndex: number
): string {
  const segments = 35; // Balance between smoothness and performance
  let d = `M ${x1.toFixed(2)} ${y1.toFixed(2)}`;

  for (let i = 1; i <= segments; i++) {
    const t = i / segments;
    let x: number, y: number;

    if (direction === "horizontal") {
      x = x1 + (x2 - x1) * t;
      const wave =
        Math.sin(
          t * Math.PI * 2 * waveParams.frequency +
            waveParams.phase +
            lineIndex * 0.3
        ) * waveParams.amplitude;
      y = y1 + wave;
    } else {
      const wave =
        Math.sin(
          t * Math.PI * 2 * waveParams.frequency +
            waveParams.phase +
            lineIndex * 0.3
        ) * waveParams.amplitude;
      x = x1 + wave;
      y = y1 + (y2 - y1) * t;
    }

    d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }

  return d;
}

export function TidalGrid({
  className = "",
  gridSize = 12,
  waveAmplitude = 8,
  waveFrequency = 2,
  strokeColor = "currentColor",
  strokeWidth = 1,
  animationSpeed = 0.0001,
}: TidalGridProps) {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [maritimeData, setMaritimeData] = useState({
    tideLevel: 1,
    totalShips: 10,
    arrivals: 5,
    departures: 5,
    flow: 0,
  });
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Update maritime data periodically (and on mount)
  useEffect(() => {
    setMaritimeData(generateMaritimeData());
    const interval = setInterval(() => {
      setMaritimeData(generateMaritimeData());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Animation loop - throttled to ~30fps for performance
  useEffect(() => {
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;

      // Only update if enough time has passed (throttle to target FPS)
      if (delta >= frameInterval) {
        lastTimeRef.current = timestamp - (delta % frameInterval);
        setAnimationPhase((prev) => (prev + delta * animationSpeed) % (Math.PI * 2));
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animationSpeed]);

  const waveParams = calculateWaveParams(
    waveAmplitude,
    waveFrequency,
    maritimeData,
    animationPhase
  );

  const viewBoxSize = 100;
  const cellSize = viewBoxSize / gridSize;
  const paths: ReactElement[] = [];

  // Generate horizontal wavy lines
  for (let i = 0; i <= gridSize; i++) {
    const y = i * cellSize;
    const d = generateWavyPath(
      0,
      y,
      viewBoxSize,
      y,
      waveParams,
      "horizontal",
      i
    );
    paths.push(
      <path
        key={`h-${i}`}
        d={d}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    );
  }

  // Generate vertical wavy lines
  for (let i = 0; i <= gridSize; i++) {
    const x = i * cellSize;
    const d = generateWavyPath(
      x,
      0,
      x,
      viewBoxSize,
      waveParams,
      "vertical",
      i
    );
    paths.push(
      <path
        key={`v-${i}`}
        d={d}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    );
  }

  return (
    <svg
      className={className}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {paths}
    </svg>
  );
}
