// SVG utilities for grid generation

import type { AssetMetadata } from './metadata'
import { embedSVGMetadata, createCompanionJSON } from './metadata'

export interface WaveParams {
  amplitude: number
  frequency: number
  phase: number
}

export function createWavyLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  waveParams: WaveParams,
  direction: 'horizontal' | 'vertical',
  lineIndex: number
): string {
  const segments = 100
  let d = `M ${x1} ${y1}`

  for (let i = 1; i <= segments; i++) {
    const t = i / segments
    let x, y

    if (direction === 'horizontal') {
      x = x1 + (x2 - x1) * t
      // Apply wave distortion to y
      const wave =
        Math.sin(t * Math.PI * 2 * waveParams.frequency + waveParams.phase + lineIndex * 0.5) *
        waveParams.amplitude
      y = y1 + wave
    } else {
      // Apply wave distortion to x
      const wave =
        Math.sin(t * Math.PI * 2 * waveParams.frequency + waveParams.phase + lineIndex * 0.5) *
        waveParams.amplitude
      x = x1 + wave
      y = y1 + (y2 - y1) * t
    }

    d += ` L ${x} ${y}`
  }

  return d
}

export function calculateWaveParameters(
  baseAmplitude: number,
  baseFrequency: number,
  dataSource: any
): WaveParams {
  if (!dataSource) {
    return {
      amplitude: baseAmplitude,
      frequency: baseFrequency,
      phase: 0,
    }
  }

  if (dataSource.type === 'tidal') {
    // Map tide level to wave parameters
    // Tide values typically range from -2 to +4 mAOD
    const normalizedTide = (dataSource.level + 2) / 6 // Normalize to 0-1

    return {
      amplitude: baseAmplitude * (0.5 + normalizedTide * 0.5),
      frequency: baseFrequency * (0.8 + normalizedTide * 0.4),
      phase: normalizedTide * Math.PI * 2,
    }
  } else if (dataSource.type === 'ships') {
    // Map ship flow to wave parameters
    const flowRatio = (dataSource.flow + 10) / 20 // Normalize to 0-1
    const activityLevel = dataSource.total / 20 // Normalize based on expected max

    return {
      amplitude: baseAmplitude * (0.5 + activityLevel * 0.5),
      frequency: baseFrequency * (0.5 + flowRatio * 1.0),
      phase: flowRatio * Math.PI * 2,
    }
  }

  return {
    amplitude: baseAmplitude,
    frequency: baseFrequency,
    phase: 0,
  }
}

export function exportSVGFile(svgElement: SVGSVGElement, filename: string, metadata?: AssetMetadata) {
  let processedSVG = svgElement

  // Embed metadata if provided
  if (metadata) {
    processedSVG = embedSVGMetadata(svgElement, metadata)
  }

  const svgData = new XMLSerializer().serializeToString(processedSVG)
  const blob = new Blob([svgData], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()

  URL.revokeObjectURL(url)
}

export function exportSVGAsPNG(svgElement: SVGSVGElement, filename: string, size: number = 800, metadata?: AssetMetadata) {
  const svgData = new XMLSerializer().serializeToString(svgElement)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const img = new Image()

  canvas.width = size
  canvas.height = size

  img.onload = function () {
    ctx.drawImage(img, 0, 0)
    canvas.toBlob(function (blob) {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        link.click()
        URL.revokeObjectURL(url)

        // Create companion JSON file if metadata is provided
        if (metadata) {
          createCompanionJSON(metadata, filename)
        }
      }
    })
  }

  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
}
