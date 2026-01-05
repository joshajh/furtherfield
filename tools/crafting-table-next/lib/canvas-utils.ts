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

export function downloadCanvasAsJPG(canvas: HTMLCanvasElement, filename: string, quality: number = 0.92) {
  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)
    }
  }, 'image/jpeg', quality)
}

// Keystones Social Graphic Renderer
export interface KeystonesConfig {
  width: number
  height: number
  headlineLine1: string
  headlineLine2: string
  subheadLeft: string
  subheadRight: string
  supportingText: string
  userImage: HTMLImageElement | null
  imageOffsetX: number  // -100 to 100, percentage offset
  imageOffsetY: number  // -100 to 100, percentage offset
  gridData: GridData | null
  dataSource: DataSource | null
}

export interface LoadedAssets {
  borderLeft: HTMLImageElement | null
  borderRight: HTMLImageElement | null
  borderBottom: HTMLImageElement | null
  lichenImages: HTMLImageElement[]
}

export class KeystonesRenderer {
  private ctx: CanvasRenderingContext2D
  private assets: LoadedAssets = {
    borderLeft: null,
    borderRight: null,
    borderBottom: null,
    lichenImages: [],
  }

  constructor(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('Could not get 2D context from canvas')
    }
    this.ctx = context
  }

  async loadAssets(): Promise<void> {
    const assetPaths = {
      borderLeft: '/assets/social-generator/border-left.png',
      borderRight: '/assets/social-generator/border-right.png',
    }

    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
      })
    }

    try {
      this.assets.borderLeft = await loadImage(assetPaths.borderLeft)
      console.log('Loaded borderLeft:', this.assets.borderLeft.width, 'x', this.assets.borderLeft.height)
      this.assets.borderRight = await loadImage(assetPaths.borderRight)
      console.log('Loaded borderRight:', this.assets.borderRight.width, 'x', this.assets.borderRight.height)
    } catch (error) {
      console.error('Could not load border assets:', error)
    }
  }

  clearCanvas(width: number, height: number) {
    this.ctx.fillStyle = '#000000'
    this.ctx.fillRect(0, 0, width, height)
  }

  drawGradientBackground(width: number, height: number, headerHeight: number) {
    // Create gradient similar to Figma design (blue/pink/yellow tones)
    const gradient = this.ctx.createLinearGradient(0, 0, width, headerHeight)
    gradient.addColorStop(0, 'rgba(188, 229, 243, 1)')    // Light blue
    gradient.addColorStop(0.3, 'rgba(208, 214, 253, 1)')  // Light purple
    gradient.addColorStop(0.6, 'rgba(190, 166, 176, 1)')  // Mauve
    gradient.addColorStop(1, 'rgba(255, 252, 185, 1)')    // Light yellow

    // Header background with rounded corners
    const padding = 20
    const radius = 12

    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.roundRect(padding, padding, width - padding * 2, headerHeight - padding, radius)
    this.ctx.fillStyle = gradient
    this.ctx.fill()
    this.ctx.restore()
  }

  drawWavyGrid(gridData: GridData, width: number, headerHeight: number, dataSource: DataSource | null) {
    const { size, wave } = gridData
    const padding = 20
    const gridWidth = width - padding * 2
    const gridHeight = headerHeight - padding * 2
    const cellSize = gridWidth / size

    // Calculate wave parameters based on data source
    let waveParams = {
      amplitude: wave,
      frequency: 3,
      phase: 0,
    }

    if (dataSource) {
      if (dataSource.type === 'tidal') {
        const normalizedTide = (dataSource.level + 2) / 6
        waveParams = {
          amplitude: wave * (0.5 + normalizedTide * 0.5),
          frequency: 3 * (0.8 + normalizedTide * 0.4),
          phase: normalizedTide * Math.PI * 2,
        }
      } else {
        const flowRatio = (dataSource.flow + 10) / 20
        const activityLevel = dataSource.total / 20
        waveParams = {
          amplitude: wave * (0.5 + activityLevel * 0.5),
          frequency: 3 * (0.5 + flowRatio * 1.0),
          phase: flowRatio * Math.PI * 2,
        }
      }
    }

    // Draw grid with gradient stroke
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.roundRect(padding, padding, gridWidth, gridHeight, 12)
    this.ctx.clip()

    // Grid line colors (pink/purple gradient)
    const lineGradient = this.ctx.createLinearGradient(0, padding, 0, headerHeight)
    lineGradient.addColorStop(0, 'rgba(200, 150, 200, 0.6)')
    lineGradient.addColorStop(1, 'rgba(150, 100, 180, 0.4)')

    this.ctx.strokeStyle = lineGradient
    this.ctx.lineWidth = 1

    // Draw horizontal wavy lines
    for (let i = 0; i <= size; i++) {
      const baseY = padding + i * cellSize
      this.ctx.beginPath()
      for (let x = padding; x <= width - padding; x += 5) {
        const normalizedX = (x - padding) / gridWidth
        const waveOffset = Math.sin(normalizedX * Math.PI * 2 * waveParams.frequency + waveParams.phase + i * 0.5) * waveParams.amplitude
        const y = baseY + waveOffset
        if (x === padding) {
          this.ctx.moveTo(x, y)
        } else {
          this.ctx.lineTo(x, y)
        }
      }
      this.ctx.stroke()
    }

    // Draw vertical wavy lines
    for (let i = 0; i <= size; i++) {
      const baseX = padding + i * cellSize
      this.ctx.beginPath()
      for (let y = padding; y <= headerHeight - padding; y += 5) {
        const normalizedY = (y - padding) / gridHeight
        const waveOffset = Math.sin(normalizedY * Math.PI * 2 * waveParams.frequency + waveParams.phase + i * 0.5) * waveParams.amplitude
        const x = baseX + waveOffset
        if (y === padding) {
          this.ctx.moveTo(x, y)
        } else {
          this.ctx.lineTo(x, y)
        }
      }
      this.ctx.stroke()
    }

    this.ctx.restore()
  }

  drawHeadline(
    line1: string,
    line2: string,
    width: number,
    yOffset: number = 56
  ) {
    const padding = 50
    const fontSize = 120
    const lineHeight = fontSize * 0.8

    this.ctx.save()
    this.ctx.fillStyle = '#000000'
    this.ctx.textBaseline = 'top'
    this.ctx.textAlign = 'left'

    // Line 1 - italic
    this.ctx.font = `italic ${fontSize}px "Instrument Serif", Georgia, serif`
    this.ctx.fillText(line1, padding, yOffset)

    // Line 2 - regular
    this.ctx.font = `${fontSize}px "Instrument Serif", Georgia, serif`
    this.ctx.fillText(line2, padding, yOffset + lineHeight)

    this.ctx.restore()
  }

  drawSubheads(
    leftText: string,
    rightText: string,
    width: number,
    yPosition: number
  ) {
    const padding = 50
    const fontSize = 40

    this.ctx.save()
    this.ctx.fillStyle = '#000000'
    this.ctx.textBaseline = 'middle'

    // Instrument Sans Bold condensed style
    this.ctx.font = `700 ${fontSize}px "Instrument Sans", sans-serif`

    // Left subhead with dot prefix
    this.ctx.textAlign = 'left'
    const dotRadius = 5
    this.ctx.beginPath()
    this.ctx.arc(padding + dotRadius, yPosition, dotRadius, 0, Math.PI * 2)
    this.ctx.fill()
    this.ctx.fillText(leftText.toUpperCase(), padding + dotRadius * 2 + 8, yPosition)

    // Right subhead
    this.ctx.textAlign = 'right'
    this.ctx.fillText(rightText.toUpperCase(), width - padding, yPosition)

    this.ctx.restore()
  }

  drawImageSection(
    image: HTMLImageElement | null,
    width: number,
    yStart: number,
    height: number,
    offsetX: number = 0,  // -100 to 100
    offsetY: number = 0   // -100 to 100
  ) {
    const padding = 20
    const radius = 12
    const sectionWidth = width - padding * 2
    const sectionHeight = height

    // Draw rounded rectangle background
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.roundRect(padding, yStart, sectionWidth, sectionHeight, radius)
    this.ctx.fillStyle = '#f2f2f5'
    this.ctx.fill()

    // Draw image if provided
    if (image) {
      this.ctx.beginPath()
      this.ctx.roundRect(padding, yStart, sectionWidth, sectionHeight, radius)
      this.ctx.clip()

      // Calculate cover fit - scale to cover the entire section
      const imgRatio = image.width / image.height
      const sectionRatio = sectionWidth / sectionHeight
      let drawWidth, drawHeight

      if (imgRatio > sectionRatio) {
        // Image is wider - fit height, overflow width
        drawHeight = sectionHeight
        drawWidth = image.width * (sectionHeight / image.height)
      } else {
        // Image is taller - fit width, overflow height
        drawWidth = sectionWidth
        drawHeight = image.height * (sectionWidth / image.width)
      }

      // Calculate center position
      let drawX = padding + (sectionWidth - drawWidth) / 2
      let drawY = yStart + (sectionHeight - drawHeight) / 2

      // Apply offsets based on available overflow
      const overflowX = Math.max(0, drawWidth - sectionWidth)
      const overflowY = Math.max(0, drawHeight - sectionHeight)

      if (overflowX > 0) {
        drawX += (offsetX / 100) * (overflowX / 2)
      }
      if (overflowY > 0) {
        drawY += (offsetY / 100) * (overflowY / 2)
      }

      this.ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight)
    }

    this.ctx.restore()
  }

  drawSupportingTextBar(
    text: string,
    width: number,
    yStart: number,
    height: number
  ) {
    const padding = 20
    const radius = 12

    // Draw background bar with gradient
    const gradient = this.ctx.createLinearGradient(0, yStart, width, yStart)
    gradient.addColorStop(0, 'rgba(194, 154, 187, 0.95)')
    gradient.addColorStop(1, 'rgba(208, 214, 253, 0.95)')

    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.roundRect(padding, yStart, width - padding * 2, height, radius)
    this.ctx.fillStyle = gradient
    this.ctx.fill()

    // Draw text
    this.ctx.fillStyle = '#000000'
    this.ctx.font = `700 ${40}px "Instrument Sans", sans-serif`
    this.ctx.textAlign = 'left'
    this.ctx.textBaseline = 'middle'
    this.ctx.fillText(text.toUpperCase(), padding + 30, yStart + height / 2)

    this.ctx.restore()
  }

  drawBorders(width: number, height: number) {
    // Draw lichen borders if loaded
    // Position them along the edges, scaling to fit the canvas height

    if (this.assets.borderLeft) {
      const img = this.assets.borderLeft
      // Scale to ~70% of canvas height, maintaining aspect ratio
      const targetHeight = height * 0.7
      const scale = targetHeight / img.height
      const drawWidth = img.width * scale
      const drawHeight = targetHeight

      this.ctx.drawImage(
        img,
        -drawWidth * 0.3 + 40,  // Slight overlap off left edge
        height * 0.28,          // Start about 1/4 down
        drawWidth,
        drawHeight
      )
    }

    if (this.assets.borderRight) {
      const img = this.assets.borderRight
      // Scale to ~80% of canvas height, maintaining aspect ratio
      const targetHeight = height * 0.8
      const scale = targetHeight / img.height
      const drawWidth = img.width * scale
      const drawHeight = targetHeight

      this.ctx.drawImage(
        img,
        width - drawWidth * 0.7 - 10,  // Position on right edge
        height * 0.15,                 // Start near top
        drawWidth,
        drawHeight
      )
    }
  }

  render(config: KeystonesConfig) {
    const {
      width,
      height,
      headlineLine1,
      headlineLine2,
      subheadLeft,
      subheadRight,
      supportingText,
      userImage,
      imageOffsetX,
      imageOffsetY,
      gridData,
      dataSource,
    } = config

    // Layout calculations (based on 1080x1350)
    const headerHeight = height * 0.55  // ~743px for header
    const subheadY = headerHeight - 30   // Position subheads near bottom of header
    const imageStart = headerHeight + 5
    const imageHeight = height * 0.33    // ~446px for image
    const supportingBarStart = height - 78
    const supportingBarHeight = 58

    // Clear and draw background
    this.clearCanvas(width, height)

    // 1. Gradient background for header
    this.drawGradientBackground(width, height, headerHeight)

    // 2. Wavy grid overlay
    if (gridData) {
      this.drawWavyGrid(gridData, width, headerHeight, dataSource)
    }

    // 3. Headline text
    this.drawHeadline(headlineLine1, headlineLine2, width)

    // 4. Subheads
    this.drawSubheads(subheadLeft, subheadRight, width, subheadY)

    // 5. Image section
    this.drawImageSection(userImage, width, imageStart, imageHeight, imageOffsetX, imageOffsetY)

    // 6. Supporting text bar
    this.drawSupportingTextBar(supportingText, width, supportingBarStart, supportingBarHeight)

    // 7. Decorative borders (drawn last, on top)
    this.drawBorders(width, height)
  }
}
