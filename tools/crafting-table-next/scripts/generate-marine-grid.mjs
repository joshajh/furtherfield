#!/usr/bin/env node
// Standalone marine data grid generator.
// Fetches live tidal data (UK Environment Agency) for Harwich — closest gauge to
// Felixstowe — then renders a wave-distorted grid as an SVG, mirroring the logic
// in app/grid-generator/page.tsx + lib/svg-utils.ts.

import { writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'public', 'assets', 'grid-generator')

const CANVAS_SIZE = 800
const GRID_SIZE = 20
const WAVE_AMPLITUDE = 15
const WAVE_FREQUENCY = 2

// --- Data source (port of lib/api.ts fetchTidalData) ---------------------

async function fetchTidalData() {
  try {
    const stationId = 'E71439' // Harwich
    const readingUrl = `https://environment.data.gov.uk/flood-monitoring/id/stations/${stationId}/readings?latest`
    const resp = await fetch(readingUrl)
    const data = await resp.json()
    if (data.items && data.items.length > 0) {
      const reading = data.items[0]
      return {
        type: 'tidal',
        level: reading.value,
        unit: reading.unitName || 'mAOD',
        station: 'Harwich',
        time: new Date(reading.dateTime),
        stationId,
        coordinates: { lat: 51.948, long: 1.292 },
      }
    }
  } catch (error) {
    console.log('Could not fetch tidal data, using simulated:', error.message)
  }

  // Harmonic-approximation fallback (semidiurnal ~12.4h cycle).
  const now = new Date()
  const hours = now.getHours() + now.getMinutes() / 60
  const level = Number((2 * Math.sin((hours / 12.4) * Math.PI * 2) + 1).toFixed(2))
  return {
    type: 'tidal',
    level,
    unit: 'mAOD',
    station: 'Harwich (Simulated)',
    time: now,
    stationId: 'E71439',
    coordinates: { lat: 51.948, long: 1.292 },
  }
}

// --- Wave math (port of lib/svg-utils.ts) --------------------------------

function calculateWaveParameters(baseAmplitude, baseFrequency, dataSource) {
  const normalizedTide = (dataSource.level + 2) / 6 // -2..+4 mAOD -> 0..1
  return {
    amplitude: baseAmplitude * (0.5 + normalizedTide * 0.5),
    frequency: baseFrequency * (0.8 + normalizedTide * 0.4),
    phase: normalizedTide * Math.PI * 2,
  }
}

function createWavyLine(x1, y1, x2, y2, waveParams, direction, lineIndex) {
  const segments = 100
  let d = `M ${x1} ${y1}`
  for (let i = 1; i <= segments; i++) {
    const t = i / segments
    let x, y
    const wave =
      Math.sin(t * Math.PI * 2 * waveParams.frequency + waveParams.phase + lineIndex * 0.5) *
      waveParams.amplitude
    if (direction === 'horizontal') {
      x = x1 + (x2 - x1) * t
      y = y1 + wave
    } else {
      x = x1 + wave
      y = y1 + (y2 - y1) * t
    }
    d += ` L ${x} ${y}`
  }
  return d
}

// --- SVG assembly --------------------------------------------------------

function buildSVG(dataSource) {
  const waveParams = calculateWaveParameters(WAVE_AMPLITUDE, WAVE_FREQUENCY, dataSource)
  const cellSize = CANVAS_SIZE / GRID_SIZE
  const paths = []

  for (let i = 0; i <= GRID_SIZE; i++) {
    const y = i * cellSize
    paths.push(createWavyLine(0, y, CANVAS_SIZE, y, waveParams, 'horizontal', i))
  }
  for (let i = 0; i <= GRID_SIZE; i++) {
    const x = i * cellSize
    paths.push(createWavyLine(x, 0, x, CANVAS_SIZE, waveParams, 'vertical', i))
  }

  const metadata = {
    app: 'grid-generator',
    version: '1.0',
    creator: 'Furtherfield Crafting Table',
    license: 'CC-BY-SA-4.0',
    timestamp: new Date().toISOString(),
    parameters: { gridSize: GRID_SIZE, waveAmplitude: WAVE_AMPLITUDE, waveFrequency: WAVE_FREQUENCY },
    dataSource: {
      type: 'tidal',
      station: dataSource.station,
      stationId: dataSource.stationId,
      level: dataSource.level,
      unit: dataSource.unit,
      coordinates: dataSource.coordinates,
      timestamp: dataSource.time.toISOString(),
    },
  }

  const pathEls = paths
    .map((d) => `  <path d="${d}" stroke="#000000" stroke-width="1" fill="none"/>`)
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS_SIZE}" height="${CANVAS_SIZE}" viewBox="0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}">
  <metadata>${JSON.stringify(metadata)}</metadata>
${pathEls}
</svg>
`
}

// --- Main ----------------------------------------------------------------

const dataSource = await fetchTidalData()
const svg = buildSVG(dataSource)

mkdirSync(OUT_DIR, { recursive: true })
const stamp = dataSource.time.toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19)
const filename = `RTCT-grid-tidal-${stamp}.svg`
const outPath = join(OUT_DIR, filename)
writeFileSync(outPath, svg)

console.log(`Data: ${dataSource.station} ${dataSource.level} ${dataSource.unit} @ ${dataSource.time.toISOString()}`)
console.log(`Wrote ${outPath}`)
