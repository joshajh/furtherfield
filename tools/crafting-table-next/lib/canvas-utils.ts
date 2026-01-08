// Canvas utilities for generating visual elements

import type { AssetMetadata } from './metadata'
import { createCompanionJSON } from './metadata'
import { FURTHERFIELD_CONFIG, type TreatmentId, type LayoutId } from './config'

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
    // Use basePath for assets when configured
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
    const assetPaths = {
      borderLeft: `${basePath}/assets/social-generator/border-left.png`,
      borderRight: `${basePath}/assets/social-generator/border-right.png`,
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
    // Legacy signature - call the new bounds-based method with default bounds
    const padding = 20
    this.drawWavyGridInBounds(gridData, { x: padding, y: padding, width: width - padding * 2, height: headerHeight - padding * 2 }, dataSource)
  }

  drawWavyGridInBounds(gridData: GridData, bounds: { x: number, y: number, width: number, height: number }, dataSource: DataSource | null) {
    const { size, wave } = gridData
    const { x: startX, y: startY, width: gridWidth, height: gridHeight } = bounds
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
    this.ctx.roundRect(startX, startY, gridWidth, gridHeight, 12)
    this.ctx.clip()

    // Grid line colors (pink/purple gradient)
    const lineGradient = this.ctx.createLinearGradient(startX, startY, startX, startY + gridHeight)
    lineGradient.addColorStop(0, 'rgba(200, 150, 200, 0.6)')
    lineGradient.addColorStop(1, 'rgba(150, 100, 180, 0.4)')

    this.ctx.strokeStyle = lineGradient
    this.ctx.lineWidth = 1

    // Draw horizontal wavy lines
    for (let i = 0; i <= size; i++) {
      const baseY = startY + i * cellSize
      this.ctx.beginPath()
      for (let x = startX; x <= startX + gridWidth; x += 5) {
        const normalizedX = (x - startX) / gridWidth
        const waveOffset = Math.sin(normalizedX * Math.PI * 2 * waveParams.frequency + waveParams.phase + i * 0.5) * waveParams.amplitude
        const y = baseY + waveOffset
        if (x === startX) {
          this.ctx.moveTo(x, y)
        } else {
          this.ctx.lineTo(x, y)
        }
      }
      this.ctx.stroke()
    }

    // Draw vertical wavy lines
    for (let i = 0; i <= size; i++) {
      const baseX = startX + i * cellSize
      this.ctx.beginPath()
      for (let y = startY; y <= startY + gridHeight; y += 5) {
        const normalizedY = (y - startY) / gridHeight
        const waveOffset = Math.sin(normalizedY * Math.PI * 2 * waveParams.frequency + waveParams.phase + i * 0.5) * waveParams.amplitude
        const x = baseX + waveOffset
        if (y === startY) {
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

    // Left subhead
    this.ctx.textAlign = 'left'
    this.ctx.fillText(leftText.toUpperCase(), padding, yPosition)

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

// ============================================
// Social Layout System - Multi-layout renderer
// ============================================

export interface RegionColors {
  [regionId: string]: TreatmentId
}

export interface SocialLayoutConfig extends KeystonesConfig {
  layout: LayoutId
  regionColors: RegionColors
  bodyText?: string  // Additional text for content layouts
  showGrid?: boolean  // Whether to show the wavy grid overlay
}

interface Bounds {
  x: number
  y: number
  width: number
  height: number
}

export class SocialLayoutRenderer extends KeystonesRenderer {
  private treatments = FURTHERFIELD_CONFIG.brandTreatments
  private layouts = FURTHERFIELD_CONFIG.instagramLayouts

  // Get fill style for a treatment color
  private getTreatmentFill(treatmentId: TreatmentId, bounds: Bounds): string | CanvasGradient {
    const treatment = this.treatments[treatmentId]
    if ('start' in treatment && 'end' in treatment) {
      // It's a gradient
      const ctx = this.getContext()
      const gradient = ctx.createLinearGradient(bounds.x, bounds.y, bounds.x + bounds.width, bounds.y)
      gradient.addColorStop(0, treatment.start)
      gradient.addColorStop(1, treatment.end)
      return gradient
    }
    return treatment.bg
  }

  // Access to the context for creating gradients
  private getContext(): CanvasRenderingContext2D {
    // @ts-expect-error - accessing protected member from parent
    return this.ctx
  }

  // Draw a colored region with rounded corners
  drawColoredRegion(bounds: Bounds, treatmentId: TreatmentId, radius: number = 12) {
    const ctx = this.getContext()
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(bounds.x, bounds.y, bounds.width, bounds.height, radius)
    ctx.fillStyle = this.getTreatmentFill(treatmentId, bounds)
    ctx.fill()
    ctx.restore()
  }

  // Draw text within a region
  drawRegionText(
    text: string,
    bounds: Bounds,
    options: {
      fontSize?: number
      fontWeight?: string
      fontStyle?: string
      fontFamily?: string
      color?: string
      align?: CanvasTextAlign
      baseline?: CanvasTextBaseline
      uppercase?: boolean
      padding?: number
    } = {}
  ) {
    const ctx = this.getContext()
    const {
      fontSize = 40,
      fontWeight = '700',
      fontStyle = '',
      fontFamily = '"Instrument Sans", sans-serif',
      color = '#000000',
      align = 'left',
      baseline = 'middle',
      uppercase = true,
      padding = 30,
    } = options

    ctx.save()
    ctx.fillStyle = color
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`.trim()
    ctx.textAlign = align
    ctx.textBaseline = baseline

    const displayText = uppercase ? text.toUpperCase() : text

    let x = bounds.x + padding
    if (align === 'center') x = bounds.x + bounds.width / 2
    if (align === 'right') x = bounds.x + bounds.width - padding

    const y = bounds.y + bounds.height / 2

    ctx.fillText(displayText, x, y)
    ctx.restore()
  }

  // Draw multiline text with word wrap
  drawWrappedText(
    text: string,
    bounds: Bounds,
    options: {
      fontSize?: number
      fontWeight?: string
      fontFamily?: string
      color?: string
      lineHeight?: number
      padding?: number
    } = {}
  ) {
    const ctx = this.getContext()
    const {
      fontSize = 32,
      fontWeight = '400',
      fontFamily = '"Instrument Sans", sans-serif',
      color = '#000000',
      lineHeight = 1.4,
      padding = 30,
    } = options

    ctx.save()
    ctx.fillStyle = color
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
    ctx.textBaseline = 'top'

    const maxWidth = bounds.width - padding * 2
    const lines: string[] = []

    // Split by explicit linebreaks first, then word wrap each paragraph
    const paragraphs = text.split('\n')
    paragraphs.forEach((paragraph) => {
      if (paragraph.trim() === '') {
        lines.push('')  // Preserve empty lines
        return
      }

      const words = paragraph.split(' ')
      let currentLine = ''

      words.forEach((word) => {
        const testLine = currentLine + word + ' '
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth && currentLine !== '') {
          lines.push(currentLine.trim())
          currentLine = word + ' '
        } else {
          currentLine = testLine
        }
      })
      if (currentLine.trim()) lines.push(currentLine.trim())
    })

    const lineHeightPx = fontSize * lineHeight
    let y = bounds.y + padding

    lines.forEach((line) => {
      ctx.fillText(line, bounds.x + padding, y)
      y += lineHeightPx
    })

    ctx.restore()
  }

  // Draw tag pills
  drawTagPills(
    tags: string[],
    bounds: Bounds,
    treatmentId: TreatmentId,
    position: 'top-left' | 'top-right' | 'top-spread' = 'top-spread'
  ) {
    const ctx = this.getContext()
    const padding = 20
    const tagHeight = 36
    const tagPadding = 12
    const tagGap = 10
    const fontSize = 14
    const radius = 4

    ctx.save()
    ctx.font = `500 ${fontSize}px "Geist Mono", monospace`

    const tagWidths = tags.map((tag) => ctx.measureText(tag.toUpperCase()).width + tagPadding * 2)

    let startX = bounds.x + padding
    if (position === 'top-right') {
      startX = bounds.x + bounds.width - padding - tagWidths.reduce((a, b) => a + b, 0) - tagGap * (tags.length - 1)
    } else if (position === 'top-spread' && tags.length === 2) {
      // First tag on left, second on right
    }

    const y = bounds.y + padding

    tags.forEach((tag, i) => {
      let x = startX
      if (position === 'top-spread' && i === 1) {
        x = bounds.x + bounds.width - padding - tagWidths[i]
      } else if (i > 0 && position !== 'top-spread') {
        x = startX + tagWidths.slice(0, i).reduce((a, b) => a + b, 0) + tagGap * i
      }

      const tagBounds = { x, y, width: tagWidths[i], height: tagHeight }
      this.drawColoredRegion(tagBounds, treatmentId, radius)

      ctx.fillStyle = '#000000'
      ctx.textBaseline = 'middle'
      ctx.fillText(tag.toUpperCase(), x + tagPadding, y + tagHeight / 2)
    })

    ctx.restore()
  }

  // ============================================
  // Layout Renderers
  // ============================================

  renderCover(config: SocialLayoutConfig) {
    const { width, height, headlineLine1, headlineLine2, subheadLeft, subheadRight, supportingText, userImage, imageOffsetX, imageOffsetY, gridData, dataSource, regionColors, showGrid } = config

    const padding = 20
    const gap = 5
    const accentBarHeight = 58
    const tagsBarHeight = 50
    const headerTextHeight = 280  // Space for headline text
    const imageHeight = height - padding * 2 - headerTextHeight - tagsBarHeight - accentBarHeight - gap * 2

    this.clearCanvas(width, height)

    // Header region (headline area)
    const headerTreatment = regionColors['header'] || 'gradient'
    const headerBounds = { x: padding, y: padding, width: width - padding * 2, height: headerTextHeight }
    this.drawColoredRegion(headerBounds, headerTreatment)

    // Wavy grid overlay on header (if enabled)
    if (showGrid && gridData) {
      this.drawWavyGridInBounds(gridData, headerBounds, dataSource)
    }

    // Headline
    this.drawHeadline(headlineLine1, headlineLine2, width, 80)

    // Tags bar (separate container with customizable color)
    const tagsBarTreatment = regionColors['tags-bar'] || 'lavender'
    const tagsBarY = padding + headerTextHeight + gap
    const tagsBarBounds = { x: padding, y: tagsBarY, width: width - padding * 2, height: tagsBarHeight }
    this.drawColoredRegion(tagsBarBounds, tagsBarTreatment)

    // Draw tags text in the tags bar
    const ctx = this.getContext()
    ctx.save()
    ctx.fillStyle = '#000000'
    ctx.font = `700 32px "Instrument Sans", sans-serif`
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'left'
    ctx.fillText(subheadLeft.toUpperCase(), padding + 30, tagsBarY + tagsBarHeight / 2)
    ctx.textAlign = 'right'
    ctx.fillText(subheadRight.toUpperCase(), width - padding - 30, tagsBarY + tagsBarHeight / 2)
    ctx.restore()

    // Image container
    const imageY = tagsBarY + tagsBarHeight + gap
    const imageBounds = { x: padding, y: imageY, width: width - padding * 2, height: imageHeight }
    if (userImage) {
      this.drawImageSection(userImage, width, imageY, imageHeight, imageOffsetX, imageOffsetY)
      // Grid overlay on image if enabled
      if (showGrid && gridData) {
        const ctx = this.getContext()
        ctx.save()
        ctx.beginPath()
        ctx.roundRect(imageBounds.x, imageBounds.y, imageBounds.width, imageBounds.height, 12)
        ctx.clip()
        this.drawWavyGridInBounds(gridData, imageBounds, dataSource)
        ctx.restore()
      }
    } else {
      // Empty image placeholder
      this.drawImageSection(null, width, imageY, imageHeight, 0, 0)
    }

    // Accent bar
    const accentTreatment = regionColors['accent-bar'] || 'lemon'
    const accentBarY = imageY + imageHeight + gap
    const accentBounds = { x: padding, y: accentBarY, width: width - padding * 2, height: accentBarHeight }
    this.drawColoredRegion(accentBounds, accentTreatment)
    this.drawRegionText(supportingText, accentBounds)

    // Decorative borders
    this.drawBorders(width, height)
  }

  renderEventCard(config: SocialLayoutConfig) {
    const { width, height, headlineLine1, headlineLine2, subheadLeft, subheadRight, bodyText, userImage, imageOffsetX, imageOffsetY, supportingText, gridData, dataSource, regionColors, showGrid } = config

    const padding = 20
    const gap = 5
    const footerHeight = 58
    // Calculate available height and distribute proportionally
    const availableHeight = height - padding * 2 - footerHeight - gap * 2
    const headerHeight = availableHeight * 0.35
    const bodyHeight = availableHeight * 0.25
    const imageHeight = availableHeight * 0.40

    this.clearCanvas(width, height)

    // Header region
    const headerTreatment = regionColors['header'] || 'gradient'
    const headerBounds = { x: padding, y: padding, width: width - padding * 2, height: headerHeight }
    this.drawColoredRegion(headerBounds, headerTreatment)

    // Grid on header if enabled
    if (showGrid && gridData) {
      this.drawWavyGridInBounds(gridData, headerBounds, dataSource)
    }

    this.drawHeadline(headlineLine1, headlineLine2, width, padding + 30)
    this.drawSubheads(subheadLeft, subheadRight, width, padding + headerHeight - 40)

    // Body region
    const bodyTreatment = regionColors['body'] || 'lemon'
    const bodyY = padding + headerHeight + gap
    const bodyBounds = { x: padding, y: bodyY, width: width - padding * 2, height: bodyHeight }
    this.drawColoredRegion(bodyBounds, bodyTreatment)
    if (bodyText) {
      this.drawWrappedText(bodyText, bodyBounds, { fontSize: 28 })
    }

    // Image strip region
    const imageY = bodyY + bodyHeight + gap
    const imageBounds = { x: padding, y: imageY, width: width - padding * 2, height: imageHeight }
    this.drawImageSection(userImage, width, imageY, imageHeight, imageOffsetX, imageOffsetY)

    // Grid on image if enabled
    if (showGrid && gridData) {
      this.drawWavyGridInBounds(gridData, imageBounds, dataSource)
    }

    // Footer (fixed style) - flush with image
    const footerY = imageY + imageHeight + gap
    this.drawSupportingTextBar(supportingText, width, footerY, footerHeight)
  }

  renderInfoStack(config: SocialLayoutConfig) {
    const { width, height, headlineLine1, headlineLine2, bodyText, subheadLeft, subheadRight, supportingText, userImage, imageOffsetX, imageOffsetY, gridData, dataSource, regionColors, showGrid } = config

    const padding = 20
    const gap = 5
    const footerHeight = 58
    const availableHeight = height - padding * 2 - footerHeight - gap
    const blockHeight = (availableHeight - gap * 2) / 3

    this.clearCanvas(width, height)

    // Headline block
    const headlineTreatment = regionColors['headline-block'] || 'gradient'
    const headlineBounds = { x: padding, y: padding, width: width - padding * 2, height: blockHeight }
    this.drawColoredRegion(headlineBounds, headlineTreatment)

    // Grid on headline block if enabled
    if (showGrid && gridData) {
      this.drawWavyGridInBounds(gridData, headlineBounds, dataSource)
    }

    this.drawHeadline(headlineLine1, headlineLine2, width, padding + 20)

    // Body block
    const bodyTreatment = regionColors['body-block'] || 'lemon'
    const bodyY = padding + blockHeight + gap
    const bodyBounds = { x: padding, y: bodyY, width: width - padding * 2, height: blockHeight }
    this.drawColoredRegion(bodyBounds, bodyTreatment)
    if (bodyText) {
      this.drawWrappedText(bodyText, bodyBounds, { fontSize: 28 })
    }

    // Tags block with image background
    const tagsY = bodyY + blockHeight + gap
    const tagsBounds = { x: padding, y: tagsY, width: width - padding * 2, height: blockHeight }

    // Draw image as background first if provided
    if (userImage) {
      this.drawImageSection(userImage, width, tagsY, blockHeight, imageOffsetX, imageOffsetY)

      // Grid overlay on image if enabled
      if (showGrid && gridData) {
        this.drawWavyGridInBounds(gridData, tagsBounds, dataSource)
      }

      // Add color overlay on top of image
      const tagsTreatment = regionColors['tags-block'] || 'lavender'
      const ctx = this.getContext()
      ctx.save()
      ctx.beginPath()
      ctx.roundRect(padding, tagsY, width - padding * 2, blockHeight, 12)
      ctx.clip()
      ctx.fillStyle = this.getTreatmentFill(tagsTreatment, tagsBounds) as string
      ctx.globalAlpha = 0.7
      ctx.fillRect(padding, tagsY, width - padding * 2, blockHeight)
      ctx.restore()
    } else {
      // No image, just draw the colored region
      const tagsTreatment = regionColors['tags-block'] || 'lavender'
      this.drawColoredRegion(tagsBounds, tagsTreatment)
    }

    // Draw tag pills on top
    this.drawTagPills([subheadLeft, subheadRight], { ...tagsBounds, y: tagsY + blockHeight / 2 - 18 }, 'acid')

    // Footer (fixed style)
    this.drawSupportingTextBar(supportingText, width, height - footerHeight - padding, footerHeight)
  }

  renderFeatureImage(config: SocialLayoutConfig) {
    const { width, height, subheadLeft, subheadRight, supportingText, userImage, imageOffsetX, imageOffsetY, gridData, dataSource, regionColors, showGrid } = config

    const padding = 20
    const gap = 5
    const accentBarHeight = 58
    const imageHeight = height - padding * 2 - accentBarHeight - gap
    const imageBounds = { x: padding, y: padding, width: width - padding * 2, height: imageHeight }

    this.clearCanvas(width, height)

    // Large image region
    this.drawImageSection(userImage, width, padding, imageHeight, imageOffsetX, imageOffsetY)

    // Grid overlay on image if enabled
    if (showGrid && gridData) {
      this.drawWavyGridInBounds(gridData, imageBounds, dataSource)
    }

    // Floating tag pills on image
    const tagsTreatment = regionColors['tags'] || 'acid'
    this.drawTagPills([subheadLeft, subheadRight], imageBounds, tagsTreatment, 'top-spread')

    // Accent bar (same as other layouts)
    const accentTreatment = regionColors['accent-bar'] || 'lemon'
    const accentBarY = padding + imageHeight + gap
    const accentBounds = { x: padding, y: accentBarY, width: width - padding * 2, height: accentBarHeight }
    this.drawColoredRegion(accentBounds, accentTreatment)
    this.drawRegionText(supportingText, accentBounds)
  }

  renderSplit(config: SocialLayoutConfig) {
    const { width, height, headlineLine1, headlineLine2, bodyText, supportingText, userImage, imageOffsetX, imageOffsetY, gridData, dataSource, regionColors, showGrid } = config

    const padding = 20
    const gap = 5
    const footerHeight = 58
    const mainHeight = height - padding * 2 - footerHeight - gap
    const panelWidth = (width - padding * 2 - gap) / 2

    this.clearCanvas(width, height)

    // Left panel (image with overlay)
    const leftTreatment = regionColors['left-panel'] || 'dark'
    const leftBounds = { x: padding, y: padding, width: panelWidth, height: mainHeight }

    // Draw image first
    const ctx = this.getContext()
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(leftBounds.x, leftBounds.y, leftBounds.width, leftBounds.height, 12)
    ctx.clip()

    if (userImage) {
      const imgRatio = userImage.width / userImage.height
      const panelRatio = panelWidth / mainHeight
      let drawWidth, drawHeight

      if (imgRatio > panelRatio) {
        drawHeight = mainHeight
        drawWidth = userImage.width * (mainHeight / userImage.height)
      } else {
        drawWidth = panelWidth
        drawHeight = userImage.height * (panelWidth / userImage.width)
      }

      let drawX = padding + (panelWidth - drawWidth) / 2
      let drawY = padding + (mainHeight - drawHeight) / 2

      const overflowX = Math.max(0, drawWidth - panelWidth)
      const overflowY = Math.max(0, drawHeight - mainHeight)
      if (overflowX > 0) drawX += (imageOffsetX / 100) * (overflowX / 2)
      if (overflowY > 0) drawY += (imageOffsetY / 100) * (overflowY / 2)

      ctx.drawImage(userImage, drawX, drawY, drawWidth, drawHeight)

      // Grid overlay on image if enabled
      if (showGrid && gridData) {
        this.drawWavyGridInBounds(gridData, leftBounds, dataSource)
      }
    }

    // Color overlay on image
    ctx.fillStyle = this.getTreatmentFill(leftTreatment, leftBounds) as string
    ctx.globalCompositeOperation = 'multiply'
    ctx.fillRect(leftBounds.x, leftBounds.y, leftBounds.width, leftBounds.height)
    ctx.globalCompositeOperation = 'source-over'
    ctx.restore()

    // Right panel (content)
    const rightTreatment = regionColors['right-panel'] || 'gradient'
    const rightBounds = { x: padding + panelWidth + gap, y: padding, width: panelWidth, height: mainHeight }
    this.drawColoredRegion(rightBounds, rightTreatment)

    // Headline in right panel
    const headlineFontSize = 72
    ctx.save()
    ctx.fillStyle = '#000000'
    ctx.textBaseline = 'top'
    ctx.textAlign = 'left'

    ctx.font = `italic ${headlineFontSize}px "Instrument Serif", Georgia, serif`
    ctx.fillText(headlineLine1, rightBounds.x + 30, rightBounds.y + 40)

    ctx.font = `${headlineFontSize}px "Instrument Serif", Georgia, serif`
    ctx.fillText(headlineLine2, rightBounds.x + 30, rightBounds.y + 40 + headlineFontSize * 0.85)
    ctx.restore()

    // Body text in right panel
    if (bodyText) {
      const textBounds = { ...rightBounds, y: rightBounds.y + 200, height: rightBounds.height - 200 }
      this.drawWrappedText(bodyText, textBounds, { fontSize: 24 })
    }

    // Footer (fixed style)
    this.drawSupportingTextBar(supportingText, width, height - footerHeight - padding, footerHeight)
  }

  // Main render dispatcher
  renderLayout(config: SocialLayoutConfig) {
    switch (config.layout) {
      case 'cover':
        this.renderCover(config)
        break
      case 'event-card':
        this.renderEventCard(config)
        break
      case 'info-stack':
        this.renderInfoStack(config)
        break
      case 'feature-image':
        this.renderFeatureImage(config)
        break
      case 'split':
        this.renderSplit(config)
        break
      default:
        // Fallback to legacy render
        this.render(config)
    }
  }
}
