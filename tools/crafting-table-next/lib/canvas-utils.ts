// Canvas utilities for generating visual elements

import type { AssetMetadata } from './metadata'
import { createCompanionJSON } from './metadata'

export interface GridData {
  size: number
  wave: number
  dataSource: 'tidal' | 'ships'
}

export interface TidalData {
  type: 'tidal'
  level: number
  unit: string
  station: string
  time: Date
  stationId?: string
  coordinates?: {
    lat: number
    long: number
  }
}

export interface ShipData {
  type: 'ships'
  total: number
  arrivals: number
  departures: number
  flow: number
  time: Date
}

export type DataSource = TidalData | ShipData

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D

  constructor(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('Could not get 2D context from canvas')
    }
    this.ctx = context
  }

  clearCanvas(width: number, height: number, bgColor: string = '#ffffff') {
    this.ctx.fillStyle = bgColor
    this.ctx.fillRect(0, 0, width, height)
  }

  drawGrid(gridData: GridData, width: number, height: number) {
    const { size, wave } = gridData
    const cellSize = width / size

    this.ctx.strokeStyle = '#000000'
    this.ctx.lineWidth = 2

    // Draw wavy lines
    for (let i = 0; i <= size; i++) {
      // Horizontal
      this.ctx.beginPath()
      for (let j = 0; j <= width; j += 10) {
        const y = i * cellSize + Math.sin((j / width) * Math.PI * 4 + i * 0.5) * wave
        if (j === 0) {
          this.ctx.moveTo(j, y)
        } else {
          this.ctx.lineTo(j, y)
        }
      }
      this.ctx.stroke()

      // Vertical (avoid cramping at portrait bottom)
      if (i * cellSize < height * 0.85) {
        this.ctx.beginPath()
        for (let j = 0; j <= height; j += 10) {
          const x = i * cellSize + Math.sin((j / height) * Math.PI * 4 + i * 0.5) * wave
          if (j === 0) {
            this.ctx.moveTo(x, j)
          } else {
            this.ctx.lineTo(x, j)
          }
        }
        this.ctx.stroke()
      }
    }
  }

  applyGradient(colors: string[], width: number, height: number) {
    const gradient = this.ctx.createLinearGradient(0, 0, width, height)
    colors.forEach((color, i) => {
      gradient.addColorStop(i / (colors.length - 1), color)
    })

    this.ctx.globalCompositeOperation = 'multiply'
    this.ctx.globalAlpha = 0.3
    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, width, height)
    this.ctx.globalCompositeOperation = 'source-over'
    this.ctx.globalAlpha = 1
  }

  drawText(
    text: string,
    textSize: number,
    textColor: string,
    width: number,
    height: number
  ) {
    this.ctx.save()
    this.ctx.font = `bold ${textSize}px sans-serif`
    this.ctx.fillStyle = textColor
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'

    // Add text shadow for readability
    this.ctx.shadowColor = 'rgba(255, 255, 255, 0.8)'
    this.ctx.shadowBlur = 10

    // Word wrap
    const words = text.split(' ')
    const lines: string[] = []
    let currentLine = ''
    const maxWidth = width * 0.8

    words.forEach((word) => {
      const testLine = currentLine + word + ' '
      const metrics = this.ctx.measureText(testLine)
      if (metrics.width > maxWidth && currentLine !== '') {
        lines.push(currentLine)
        currentLine = word + ' '
      } else {
        currentLine = testLine
      }
    })
    lines.push(currentLine)

    // Draw lines
    const lineHeight = textSize * 1.2
    const totalHeight = lines.length * lineHeight
    const startY = (height - totalHeight) / 2

    lines.forEach((line, i) => {
      this.ctx.fillText(line, width / 2, startY + i * lineHeight)
    })

    this.ctx.restore()
  }

  drawFooter(
    width: number,
    height: number,
    contentTypeLabel: string,
    dataSource: DataSource | null,
    footerBgColor: string = '#f9fafb',
    footerBorderColor: string = '#d1d5db'
  ) {
    const footerHeight = 80
    const footerY = height - footerHeight

    // Draw footer background
    this.ctx.fillStyle = footerBgColor
    this.ctx.fillRect(0, footerY, width, footerHeight)

    // Border
    this.ctx.strokeStyle = footerBorderColor
    this.ctx.lineWidth = 3
    this.ctx.strokeRect(0, footerY, width, footerHeight)

    // Footer content
    this.ctx.fillStyle = '#1f2937'
    this.ctx.font = '16px sans-serif'
    this.ctx.textAlign = 'left'

    const padding = 20
    let yPos = footerY + 25

    // Taxonomy
    this.ctx.fillText(contentTypeLabel, padding, yPos)

    // Data info
    yPos += 25
    if (dataSource) {
      if (dataSource.type === 'tidal') {
        const timeStr = dataSource.time.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        })
        this.ctx.fillText(
          `Tide: ${dataSource.level.toFixed(1)}${dataSource.unit} at ${timeStr}`,
          padding,
          yPos
        )
      } else {
        const timeStr = dataSource.time.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        })
        const flowStr = dataSource.flow > 0 ? `+${dataSource.flow}` : `${dataSource.flow}`
        this.ctx.fillText(
          `Ships: ${dataSource.total} (${flowStr}) at ${timeStr}`,
          padding,
          yPos
        )
      }
    }

    // Date on right
    this.ctx.textAlign = 'right'
    this.ctx.fillText(new Date().toLocaleDateString('en-GB'), width - padding, footerY + 40)
  }
}

export function generateFilename(appName: string, extension: string, suffix: string = ''): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
  const suffixPart = suffix ? `-${suffix}` : ''
  return `${appName}-${timestamp}${suffixPart}.${extension}`
}

export function downloadCanvasAsImage(canvas: HTMLCanvasElement, filename: string, metadata?: AssetMetadata) {
  canvas.toBlob((blob) => {
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
