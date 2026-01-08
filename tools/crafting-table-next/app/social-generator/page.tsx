'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  SocialLayoutRenderer,
  generateFilename,
  downloadCanvasAsImage,
  downloadCanvasAsJPG,
  type GridData,
  type DataSource,
  type RegionColors,
} from '@/lib/canvas-utils'
import { FURTHERFIELD_CONFIG, type LayoutId, type TreatmentId } from '@/lib/config'
import { fetchTidalData, fetchShipData } from '@/lib/api'
import { createAssetMetadata } from '@/lib/metadata'

const CANVAS_WIDTH = 1080
const CANVAS_HEIGHT = 1350

const layouts = FURTHERFIELD_CONFIG.instagramLayouts
const treatments = FURTHERFIELD_CONFIG.brandTreatments

// Single slide state
interface SlideState {
  id: string
  headlineLine1: string
  headlineLine2: string
  subheadLeft: string
  subheadRight: string
  supportingText: string
  bodyText: string
  userImage: HTMLImageElement | null
  imageOffsetX: number
  imageOffsetY: number
  layout: LayoutId
  regionColors: RegionColors
}

// Shared state across all slides
interface SharedState {
  gridData: GridData | null
  dataSource: DataSource | null
  showGrid: boolean
}

// Get default region colors for a layout
function getDefaultRegionColors(layoutId: LayoutId): RegionColors {
  const layout = layouts[layoutId]
  return { ...layout.defaults } as RegionColors
}

// Create a new slide with default values
function createNewSlide(index: number): SlideState {
  return {
    id: `slide-${Date.now()}-${index}`,
    headlineLine1: index === 0 ? 'Reimagine' : `Slide ${index + 1}`,
    headlineLine2: index === 0 ? 'This Coastal Town' : 'Headline',
    subheadLeft: 'Live Action Role Play',
    subheadRight: 'Felixstowe',
    supportingText: 'Supporting Secondary Text',
    bodyText: 'Join us for an immersive experience exploring the future of our coastal community through creative storytelling and play.',
    userImage: null,
    imageOffsetX: 0,
    imageOffsetY: 0,
    layout: index === 0 ? 'cover' : 'event-card',
    regionColors: getDefaultRegionColors(index === 0 ? 'cover' : 'event-card'),
  }
}

export default function SocialGeneratorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<SocialLayoutRenderer | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const exportCanvasRef = useRef<HTMLCanvasElement>(null)

  // Carousel state
  const [slides, setSlides] = useState<SlideState[]>([createNewSlide(0)])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [sharedState, setSharedState] = useState<SharedState>({
    gridData: null,
    dataSource: null,
    showGrid: true,
  })

  const [gridSize, setGridSize] = useState(20)
  const [waveAmount, setWaveAmount] = useState(15)
  const [dataSourceType, setDataSourceType] = useState<'tidal' | 'ships'>('tidal')
  const [isGenerating, setIsGenerating] = useState(false)
  const [assetsLoaded, setAssetsLoaded] = useState(false)
  const [jpgQuality, setJpgQuality] = useState(92)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isExporting, setIsExporting] = useState(false)

  // Get current slide
  const currentSlide = slides[currentSlideIndex]

  // Update current slide
  const updateCurrentSlide = useCallback((updates: Partial<SlideState>) => {
    setSlides(prev => prev.map((slide, i) =>
      i === currentSlideIndex ? { ...slide, ...updates } : slide
    ))
  }, [currentSlideIndex])

  // Initialize renderer and load assets
  useEffect(() => {
    if (canvasRef.current && !rendererRef.current) {
      rendererRef.current = new SocialLayoutRenderer(canvasRef.current)
      rendererRef.current.loadAssets().then(() => {
        setAssetsLoaded(true)
      })
    }
  }, [])

  // Re-render when state changes
  const renderCanvas = useCallback(() => {
    if (!rendererRef.current || !canvasRef.current || !currentSlide) return

    const config = {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      headlineLine1: currentSlide.headlineLine1,
      headlineLine2: currentSlide.headlineLine2,
      subheadLeft: currentSlide.subheadLeft,
      subheadRight: currentSlide.subheadRight,
      supportingText: currentSlide.supportingText,
      bodyText: currentSlide.bodyText,
      userImage: currentSlide.userImage,
      imageOffsetX: currentSlide.imageOffsetX,
      imageOffsetY: currentSlide.imageOffsetY,
      gridData: sharedState.gridData,
      dataSource: sharedState.dataSource,
      layout: currentSlide.layout,
      regionColors: currentSlide.regionColors,
      showGrid: sharedState.showGrid,
    }

    rendererRef.current.renderLayout(config)
  }, [currentSlide, sharedState])

  // Render on state change
  useEffect(() => {
    if (assetsLoaded) {
      renderCanvas()
    }
  }, [assetsLoaded, renderCanvas])

  // Generate grid from data
  const handleGenerateGrid = async () => {
    setIsGenerating(true)
    try {
      const dataSource = dataSourceType === 'tidal'
        ? await fetchTidalData()
        : await fetchShipData()

      const gridData: GridData = {
        size: gridSize,
        wave: waveAmount,
        dataSource: dataSourceType,
      }

      setSharedState(prev => ({
        ...prev,
        gridData,
        dataSource,
      }))
    } finally {
      setIsGenerating(false)
    }
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const img = new window.Image()
    img.onload = () => {
      updateCurrentSlide({ userImage: img })
    }
    img.src = URL.createObjectURL(file)
  }

  // Handle image drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file || !file.type.startsWith('image/')) return

    const img = new window.Image()
    img.onload = () => {
      updateCurrentSlide({ userImage: img })
    }
    img.src = URL.createObjectURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Image position dragging on canvas
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!currentSlide?.userImage) return
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !currentSlide?.userImage) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = CANVAS_WIDTH / rect.width
    const scaleY = CANVAS_HEIGHT / rect.height

    const deltaX = (e.clientX - dragStart.x) * scaleX
    const deltaY = (e.clientY - dragStart.y) * scaleY

    const sensitivityX = 0.5
    const sensitivityY = 0.5

    const newOffsetX = Math.max(-100, Math.min(100, currentSlide.imageOffsetX + deltaX * sensitivityX))
    const newOffsetY = Math.max(-100, Math.min(100, currentSlide.imageOffsetY + deltaY * sensitivityY))

    updateCurrentSlide({
      imageOffsetX: newOffsetX,
      imageOffsetY: newOffsetY,
    })

    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleCanvasMouseUp = () => {
    setIsDragging(false)
  }

  const handleCanvasMouseLeave = () => {
    setIsDragging(false)
  }

  // Export single slide
  const handleExportPNG = () => {
    if (!canvasRef.current) return
    const filename = generateFilename('RTCT', 'png', `slide-${currentSlideIndex + 1}-of-${slides.length}`)
    const metadata = createAssetMetadata(
      'social-generator',
      {
        headlineLine1: currentSlide.headlineLine1,
        headlineLine2: currentSlide.headlineLine2,
        subheadLeft: currentSlide.subheadLeft,
        subheadRight: currentSlide.subheadRight,
        supportingText: currentSlide.supportingText,
        gridSize,
        waveAmount,
        slideIndex: currentSlideIndex,
        totalSlides: slides.length,
      },
      sharedState.dataSource || undefined
    )
    downloadCanvasAsImage(canvasRef.current, filename, metadata)
  }

  const handleExportJPG = () => {
    if (!canvasRef.current) return
    const filename = generateFilename('RTCT', 'jpg', `slide-${currentSlideIndex + 1}-of-${slides.length}`)
    downloadCanvasAsJPG(canvasRef.current, filename, jpgQuality / 100)
  }

  // Export all slides
  const handleExportAllPNG = async () => {
    if (!exportCanvasRef.current) return
    setIsExporting(true)

    const exportRenderer = new SocialLayoutRenderer(exportCanvasRef.current)
    await exportRenderer.loadAssets()

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i]

      const config = {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        headlineLine1: slide.headlineLine1,
        headlineLine2: slide.headlineLine2,
        subheadLeft: slide.subheadLeft,
        subheadRight: slide.subheadRight,
        supportingText: slide.supportingText,
        bodyText: slide.bodyText,
        userImage: slide.userImage,
        imageOffsetX: slide.imageOffsetX,
        imageOffsetY: slide.imageOffsetY,
        gridData: sharedState.gridData,
        dataSource: sharedState.dataSource,
        layout: slide.layout,
        regionColors: slide.regionColors,
        showGrid: sharedState.showGrid,
      }

      exportRenderer.renderLayout(config)

      // Small delay between exports to avoid overwhelming the browser
      await new Promise(resolve => setTimeout(resolve, 100))

      const filename = generateFilename('RTCT', 'png', `slide-${i + 1}-of-${slides.length}`)
      downloadCanvasAsImage(exportCanvasRef.current, filename)
    }

    setIsExporting(false)
  }

  // Handle layout change
  const handleLayoutChange = (layoutId: LayoutId) => {
    updateCurrentSlide({
      layout: layoutId,
      regionColors: getDefaultRegionColors(layoutId),
    })
  }

  // Handle region color change
  const handleRegionColorChange = (regionId: string, treatmentId: TreatmentId) => {
    updateCurrentSlide({
      regionColors: {
        ...currentSlide.regionColors,
        [regionId]: treatmentId,
      },
    })
  }

  // Slide management
  const addSlide = () => {
    const newSlide = createNewSlide(slides.length)
    setSlides(prev => [...prev, newSlide])
    setCurrentSlideIndex(slides.length)
  }

  const duplicateSlide = () => {
    const newSlide = {
      ...currentSlide,
      id: `slide-${Date.now()}-${slides.length}`,
      headlineLine1: currentSlide.headlineLine1,
      headlineLine2: currentSlide.headlineLine2,
    }
    setSlides(prev => [...prev.slice(0, currentSlideIndex + 1), newSlide, ...prev.slice(currentSlideIndex + 1)])
    setCurrentSlideIndex(currentSlideIndex + 1)
  }

  const deleteSlide = () => {
    if (slides.length <= 1) return
    setSlides(prev => prev.filter((_, i) => i !== currentSlideIndex))
    setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))
  }

  const moveSlide = (direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? currentSlideIndex - 1 : currentSlideIndex + 1
    if (newIndex < 0 || newIndex >= slides.length) return

    const newSlides = [...slides]
    const [removed] = newSlides.splice(currentSlideIndex, 1)
    newSlides.splice(newIndex, 0, removed)
    setSlides(newSlides)
    setCurrentSlideIndex(newIndex)
  }

  // Reset handler
  const handleReset = () => {
    if (confirm('Reset all slides? This will clear your entire carousel.')) {
      setSlides([createNewSlide(0)])
      setCurrentSlideIndex(0)
      setSharedState({
        gridData: null,
        dataSource: null,
        showGrid: true,
      })
      setGridSize(20)
      setWaveAmount(15)
    }
  }

  // Get current layout info
  const currentLayout = layouts[currentSlide?.layout || 'cover']

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 font-mono uppercase tracking-wide">Reimagine This Social Generator</h1>
          <p className="text-muted-foreground font-mono text-sm">Create carousel posts with dynamic marine data grids</p>
        </header>

        <div className="grid lg:grid-cols-[400px_1fr] gap-6">
          {/* Controls Panel */}
          <div className="space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto pr-2">
            {/* Slide Navigation */}
            <div className="card-gradient rounded-md border border-[#0F0E0E] p-5">
              <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[#0F0E0E] border-b border-[#0F0E0E] pb-2 mb-4">Carousel Slides</h3>
              <div className="space-y-3 relative z-10">
                {/* Slide thumbnails */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {slides.map((slide, index) => (
                    <button
                      key={slide.id}
                      onClick={() => setCurrentSlideIndex(index)}
                      className={`flex-shrink-0 w-12 h-15 rounded border-2 flex items-center justify-center font-mono text-xs font-bold transition-all ${
                        index === currentSlideIndex
                          ? 'border-[#C8FF00] bg-[#0F0E0E] text-[#C8FF00]'
                          : 'border-[#555659] bg-transparent text-[#555659] hover:border-[#0F0E0E] hover:text-[#0F0E0E]'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={addSlide}
                    className="flex-shrink-0 w-12 h-15 rounded border-2 border-dashed border-[#555659] flex items-center justify-center font-mono text-lg text-[#555659] hover:border-[#0F0E0E] hover:text-[#0F0E0E] transition-all"
                  >
                    +
                  </button>
                </div>

                {/* Slide actions */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={duplicateSlide}
                    size="sm"
                    className="font-mono text-xs uppercase tracking-wider bg-transparent text-[#0F0E0E] border border-[#0F0E0E] hover:bg-[rgba(245,235,180,0.85)]"
                  >
                    Duplicate
                  </Button>
                  <Button
                    onClick={() => moveSlide('left')}
                    size="sm"
                    disabled={currentSlideIndex === 0}
                    className="font-mono text-xs uppercase tracking-wider bg-transparent text-[#0F0E0E] border border-[#0F0E0E] hover:bg-[rgba(245,235,180,0.85)] disabled:opacity-30"
                  >
                    ← Move
                  </Button>
                  <Button
                    onClick={() => moveSlide('right')}
                    size="sm"
                    disabled={currentSlideIndex === slides.length - 1}
                    className="font-mono text-xs uppercase tracking-wider bg-transparent text-[#0F0E0E] border border-[#0F0E0E] hover:bg-[rgba(245,235,180,0.85)] disabled:opacity-30"
                  >
                    Move →
                  </Button>
                  <Button
                    onClick={deleteSlide}
                    size="sm"
                    disabled={slides.length <= 1}
                    className="font-mono text-xs uppercase tracking-wider bg-transparent text-red-600 border border-red-600 hover:bg-red-50 disabled:opacity-30"
                  >
                    Delete
                  </Button>
                </div>

                <div className="font-mono text-xs text-[#555659] pt-1">
                  Slide {currentSlideIndex + 1} of {slides.length}
                </div>
              </div>
            </div>

            {/* Layout Selector */}
            <div className="card-gradient rounded-md border border-[#0F0E0E] p-5">
              <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[#0F0E0E] border-b border-[#0F0E0E] pb-2 mb-4">Layout</h3>
              <div className="grid grid-cols-5 gap-2 relative z-10">
                {(Object.keys(layouts) as LayoutId[]).map((layoutId) => (
                  <button
                    key={layoutId}
                    onClick={() => handleLayoutChange(layoutId)}
                    className={`relative aspect-[4/5] rounded border-2 overflow-hidden transition-all ${
                      currentSlide?.layout === layoutId
                        ? 'border-[#C8FF00] ring-2 ring-[#C8FF00]'
                        : 'border-[#0F0E0E] hover:border-[#555659]'
                    }`}
                    title={layouts[layoutId].name}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/assets/social-generator/layouts/layout-${layoutId}.svg`}
                      alt={layouts[layoutId].name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              <div className="mt-3 font-mono text-xs text-[#0F0E0E]">
                <span className="font-semibold">{currentLayout.name}</span>
                <span className="text-[#555659] ml-2">{currentLayout.description}</span>
              </div>
            </div>

            {/* Region Colors */}
            <div className="card-gradient rounded-md border border-[#0F0E0E] p-5">
              <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[#0F0E0E] border-b border-[#0F0E0E] pb-2 mb-4">Region Colors</h3>
              <div className="space-y-3 relative z-10">
                {currentLayout.regions.map((regionId) => (
                  <div key={regionId} className="flex items-center justify-between gap-3">
                    <label className="font-mono text-xs uppercase tracking-wider text-[#0F0E0E] flex-shrink-0">
                      {regionId.replace(/-/g, ' ')}
                    </label>
                    <div className="flex gap-1">
                      {(Object.keys(treatments) as TreatmentId[]).map((treatmentId) => {
                        const treatment = treatments[treatmentId]
                        const isSelected = currentSlide?.regionColors[regionId] === treatmentId
                        const bgColor = 'start' in treatment ? `linear-gradient(90deg, ${treatment.start}, ${treatment.end})` : treatment.solid
                        return (
                          <button
                            key={treatmentId}
                            onClick={() => handleRegionColorChange(regionId, treatmentId)}
                            className={`w-6 h-6 rounded border-2 transition-all ${
                              isSelected ? 'border-[#0F0E0E] ring-1 ring-[#0F0E0E]' : 'border-transparent hover:border-[#555659]'
                            }`}
                            style={{ background: bgColor }}
                            title={treatment.name}
                          />
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Headline */}
            <div className="card-gradient rounded-md border border-[#0F0E0E] p-5">
              <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[#0F0E0E] border-b border-[#0F0E0E] pb-2 mb-4">Headline</h3>
              <div className="space-y-4 relative z-10">
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase tracking-wider text-[#0F0E0E]">Line 1 (italic)</label>
                  <Input
                    value={currentSlide?.headlineLine1 || ''}
                    onChange={(e) => updateCurrentSlide({ headlineLine1: e.target.value })}
                    placeholder="Reimagine"
                    className="font-mono bg-transparent border-[#0F0E0E] text-[#0F0E0E] placeholder:text-[#555659] focus:bg-[rgba(245,235,180,0.85)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase tracking-wider text-[#0F0E0E]">Line 2</label>
                  <Input
                    value={currentSlide?.headlineLine2 || ''}
                    onChange={(e) => updateCurrentSlide({ headlineLine2: e.target.value })}
                    placeholder="This Coastal Town"
                    className="font-mono bg-transparent border-[#0F0E0E] text-[#0F0E0E] placeholder:text-[#555659] focus:bg-[rgba(245,235,180,0.85)]"
                  />
                </div>
              </div>
            </div>

            {/* Subheads - hidden for Split layout which doesn't use them */}
            {currentSlide?.layout !== 'split' && (
              <div className="card-gradient rounded-md border border-[#0F0E0E] p-5">
                <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[#0F0E0E] border-b border-[#0F0E0E] pb-2 mb-4">Tags</h3>
                <div className="space-y-4 relative z-10">
                  <div className="space-y-1.5">
                    <label className="font-mono text-xs uppercase tracking-wider text-[#0F0E0E]">Left tag</label>
                    <Input
                      value={currentSlide?.subheadLeft || ''}
                      onChange={(e) => updateCurrentSlide({ subheadLeft: e.target.value })}
                      placeholder="Live Action Role Play"
                      className="font-mono bg-transparent border-[#0F0E0E] text-[#0F0E0E] placeholder:text-[#555659] focus:bg-[rgba(245,235,180,0.85)]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-mono text-xs uppercase tracking-wider text-[#0F0E0E]">Right tag</label>
                    <Input
                      value={currentSlide?.subheadRight || ''}
                      onChange={(e) => updateCurrentSlide({ subheadRight: e.target.value })}
                      placeholder="Felixstowe"
                      className="font-mono bg-transparent border-[#0F0E0E] text-[#0F0E0E] placeholder:text-[#555659] focus:bg-[rgba(245,235,180,0.85)]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Grid Controls */}
            <div className="card-gradient rounded-md border border-[#0F0E0E] p-5">
              <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[#0F0E0E] border-b border-[#0F0E0E] pb-2 mb-4">Grid Pattern</h3>
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs uppercase tracking-wider text-[#0F0E0E]">Show Grid Overlay</label>
                  <button
                    onClick={() => setSharedState(prev => ({ ...prev, showGrid: !prev.showGrid }))}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      sharedState.showGrid ? 'bg-[#C8FF00]' : 'bg-[#555659]'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-[#0F0E0E] transition-transform ${
                        sharedState.showGrid ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase tracking-wider text-[#0F0E0E]">Data Source</label>
                  <Select value={dataSourceType} onValueChange={(v: 'tidal' | 'ships') => setDataSourceType(v)}>
                    <SelectTrigger className="font-mono bg-transparent border-[#0F0E0E] text-[#0F0E0E]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="font-mono">
                      <SelectItem value="tidal">Live Tidal Data</SelectItem>
                      <SelectItem value="ships">Ship Movements</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="font-mono text-xs uppercase tracking-wider text-[#0F0E0E]">Grid Density</label>
                    <span className="font-mono text-xs text-[#555659]">{gridSize}</span>
                  </div>
                  <Slider value={[gridSize]} onValueChange={([v]) => setGridSize(v)} min={10} max={30} step={1} className="[&_[role=slider]]:bg-[#0F0E0E]" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="font-mono text-xs uppercase tracking-wider text-[#0F0E0E]">Wave Intensity</label>
                    <span className="font-mono text-xs text-[#555659]">{waveAmount}</span>
                  </div>
                  <Slider value={[waveAmount]} onValueChange={([v]) => setWaveAmount(v)} min={5} max={30} step={1} className="[&_[role=slider]]:bg-[#0F0E0E]" />
                </div>

                <Button
                  onClick={handleGenerateGrid}
                  disabled={isGenerating}
                  className="w-full font-mono uppercase tracking-wider bg-[#0F0E0E] text-[#F6F8FB] hover:bg-[rgba(200,255,0,0.85)] hover:text-[#0F0E0E] border border-[#0F0E0E]"
                >
                  {isGenerating ? 'Generating...' : 'Generate Grid from Live Data'}
                </Button>

                {sharedState.dataSource && (
                  <div className="bg-[rgba(245,235,180,0.85)] p-3 rounded text-sm space-y-1 font-mono text-[#0F0E0E]">
                    <div className="font-semibold uppercase text-xs tracking-wider">Data Used (all slides):</div>
                    {sharedState.dataSource.type === 'tidal' ? (
                      <>
                        <div className="text-xs">{sharedState.dataSource.station}</div>
                        <div className="text-xs">
                          {sharedState.dataSource.level.toFixed(2)} {sharedState.dataSource.unit}
                        </div>
                        <div className="text-xs text-[#555659]">{sharedState.dataSource.time.toLocaleTimeString()}</div>
                      </>
                    ) : (
                      <>
                        <div className="text-xs">Total Ships: {sharedState.dataSource.total}</div>
                        <div className="text-xs">
                          Flow: {sharedState.dataSource.flow > 0 ? '+' : ''}
                          {sharedState.dataSource.flow}
                        </div>
                        <div className="text-xs text-[#555659]">{sharedState.dataSource.time.toLocaleTimeString()}</div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div className="card-gradient rounded-md border border-[#0F0E0E] p-5">
              <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[#0F0E0E] border-b border-[#0F0E0E] pb-2 mb-4">Image</h3>
              <div className="space-y-4 relative z-10">
                <div
                  className="border-2 border-dashed border-[#0F0E0E] rounded-md p-6 text-center cursor-pointer hover:bg-[rgba(245,235,180,0.85)] transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {currentSlide?.userImage ? (
                    <div className="space-y-2">
                      <div className="font-mono text-xs uppercase tracking-wider text-[#C8FF00] bg-[#0F0E0E] px-2 py-1 rounded inline-block">Image uploaded</div>
                      <div className="font-mono text-xs text-[#555659]">{currentSlide.userImage.width} × {currentSlide.userImage.height}px</div>
                      <button className="font-mono text-xs uppercase tracking-wider border border-[#0F0E0E] px-3 py-1.5 rounded hover:bg-[rgba(245,235,180,0.85)] text-[#0F0E0E]">Change Image</button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="font-mono text-sm text-[#0F0E0E]">Drop image here or click to upload</div>
                      <div className="font-mono text-xs text-[#555659]">PNG, JPG recommended</div>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {currentSlide?.userImage && (
                  <div className="font-mono text-xs text-[#555659] pt-2">
                    Drag on preview to reposition
                  </div>
                )}
              </div>
            </div>

            {/* Supporting Text */}
            <div className="card-gradient rounded-md border border-[#0F0E0E] p-5">
              <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[#0F0E0E] border-b border-[#0F0E0E] pb-2 mb-4">Supporting Text</h3>
              <div className="relative z-10">
                <Input
                  value={currentSlide?.supportingText || ''}
                  onChange={(e) => updateCurrentSlide({ supportingText: e.target.value })}
                  placeholder="Supporting Secondary Text"
                  className="font-mono bg-transparent border-[#0F0E0E] text-[#0F0E0E] placeholder:text-[#555659] focus:bg-[rgba(245,235,180,0.85)]"
                />
              </div>
            </div>

            {/* Body Text (for content layouts) */}
            {(currentSlide?.layout === 'event-card' || currentSlide?.layout === 'info-stack' || currentSlide?.layout === 'split') && (
              <div className="card-gradient rounded-md border border-[#0F0E0E] p-5">
                <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[#0F0E0E] border-b border-[#0F0E0E] pb-2 mb-4">Body Text</h3>
                <div className="relative z-10">
                  <Textarea
                    value={currentSlide?.bodyText || ''}
                    onChange={(e) => updateCurrentSlide({ bodyText: e.target.value })}
                    placeholder="Enter body text for your layout..."
                    rows={4}
                    className="font-mono bg-transparent border-[#0F0E0E] text-[#0F0E0E] placeholder:text-[#555659] focus:bg-[rgba(245,235,180,0.85)] resize-none"
                  />
                </div>
              </div>
            )}

            {/* Export */}
            <div className="card-gradient rounded-md border border-[#0F0E0E] p-5">
              <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[#0F0E0E] border-b border-[#0F0E0E] pb-2 mb-4">Export</h3>
              <div className="space-y-3 relative z-10">
                <div className="font-mono text-xs uppercase tracking-wider text-[#555659] mb-2">Current Slide</div>
                <Button
                  onClick={handleExportPNG}
                  className="w-full font-mono uppercase tracking-wider bg-[#0F0E0E] text-[#F6F8FB] hover:bg-[rgba(200,255,0,0.85)] hover:text-[#0F0E0E] border border-[#0F0E0E]"
                >
                  Download PNG
                </Button>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="font-mono text-xs uppercase tracking-wider text-[#0F0E0E]">JPG Quality</label>
                    <span className="font-mono text-xs text-[#555659]">{jpgQuality}%</span>
                  </div>
                  <Slider value={[jpgQuality]} onValueChange={([v]) => setJpgQuality(v)} min={50} max={100} step={1} className="[&_[role=slider]]:bg-[#0F0E0E]" />
                </div>
                <Button
                  onClick={handleExportJPG}
                  className="w-full font-mono uppercase tracking-wider bg-transparent text-[#0F0E0E] border border-[#0F0E0E] hover:bg-[rgba(245,235,180,0.85)]"
                >
                  Download JPG
                </Button>

                {slides.length > 1 && (
                  <>
                    <div className="border-t border-[#0F0E0E] pt-3 mt-3">
                      <div className="font-mono text-xs uppercase tracking-wider text-[#555659] mb-2">All Slides ({slides.length})</div>
                      <Button
                        onClick={handleExportAllPNG}
                        disabled={isExporting}
                        className="w-full font-mono uppercase tracking-wider bg-[#C8FF00] text-[#0F0E0E] hover:bg-[rgba(200,255,0,0.7)] border border-[#0F0E0E]"
                      >
                        {isExporting ? 'Exporting...' : `Download All ${slides.length} Slides (PNG)`}
                      </Button>
                    </div>
                  </>
                )}

                <Button
                  onClick={handleReset}
                  className="w-full font-mono uppercase tracking-wider bg-transparent text-[#555659] border border-transparent hover:border-[#0F0E0E] hover:text-[#0F0E0E]"
                >
                  Reset All
                </Button>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-4 bg-[#1a1a1a] border border-[#333] rounded-md p-4 flex flex-col items-center justify-center gap-2">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="max-w-full max-h-[calc(100vh-220px)] border border-[#333] shadow-lg"
              style={{
                aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}`,
                cursor: currentSlide?.userImage ? (isDragging ? 'grabbing' : 'grab') : 'default',
              }}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseLeave}
            />
            <div className="flex items-center gap-4">
              {currentSlide?.userImage && (
                <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                  Drag on canvas to reposition image
                </div>
              )}
              <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                Slide {currentSlideIndex + 1} of {slides.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden canvas for export */}
      <canvas
        ref={exportCanvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="hidden"
      />
    </main>
  )
}
