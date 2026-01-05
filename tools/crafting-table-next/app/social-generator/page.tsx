'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  KeystonesRenderer,
  generateFilename,
  downloadCanvasAsImage,
  downloadCanvasAsJPG,
  type GridData,
  type DataSource,
} from '@/lib/canvas-utils'
import { fetchTidalData, fetchShipData } from '@/lib/api'
import { createAssetMetadata } from '@/lib/metadata'

const CANVAS_WIDTH = 1080
const CANVAS_HEIGHT = 1350

interface AppState {
  headlineLine1: string
  headlineLine2: string
  subheadLeft: string
  subheadRight: string
  supportingText: string
  userImage: HTMLImageElement | null
  imageOffsetX: number
  imageOffsetY: number
  gridData: GridData | null
  dataSource: DataSource | null
}

export default function SocialGeneratorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<KeystonesRenderer | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [state, setState] = useState<AppState>({
    headlineLine1: 'Reimagine',
    headlineLine2: 'This Coastal Town',
    subheadLeft: 'Live Action Role Play',
    subheadRight: 'Felixstowe',
    supportingText: 'Supporting Secondary Text',
    userImage: null,
    imageOffsetX: 0,
    imageOffsetY: 0,
    gridData: null,
    dataSource: null,
  })

  const [gridSize, setGridSize] = useState(20)
  const [waveAmount, setWaveAmount] = useState(15)
  const [dataSourceType, setDataSourceType] = useState<'tidal' | 'ships'>('tidal')
  const [isGenerating, setIsGenerating] = useState(false)
  const [assetsLoaded, setAssetsLoaded] = useState(false)
  const [jpgQuality, setJpgQuality] = useState(92)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Initialize renderer and load assets
  useEffect(() => {
    if (canvasRef.current && !rendererRef.current) {
      rendererRef.current = new KeystonesRenderer(canvasRef.current)
      rendererRef.current.loadAssets().then(() => {
        setAssetsLoaded(true)
      })
    }
  }, [])

  // Re-render when state changes
  const renderCanvas = useCallback(() => {
    if (!rendererRef.current || !canvasRef.current) return

    const config = {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      headlineLine1: state.headlineLine1,
      headlineLine2: state.headlineLine2,
      subheadLeft: state.subheadLeft,
      subheadRight: state.subheadRight,
      supportingText: state.supportingText,
      userImage: state.userImage,
      imageOffsetX: state.imageOffsetX,
      imageOffsetY: state.imageOffsetY,
      gridData: state.gridData,
      dataSource: state.dataSource,
    }

    rendererRef.current.render(config)
  }, [state])

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

      setState((prev) => ({
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

    const img = new Image()
    img.onload = () => {
      setState((prev) => ({
        ...prev,
        userImage: img,
      }))
    }
    img.src = URL.createObjectURL(file)
  }

  // Handle image drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file || !file.type.startsWith('image/')) return

    const img = new Image()
    img.onload = () => {
      setState((prev) => ({
        ...prev,
        userImage: img,
      }))
    }
    img.src = URL.createObjectURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Image position dragging on canvas
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!state.userImage) return
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !state.userImage) return

    const canvas = canvasRef.current
    if (!canvas) return

    // Calculate the scale factor between displayed canvas and actual canvas
    const rect = canvas.getBoundingClientRect()
    const scaleX = CANVAS_WIDTH / rect.width
    const scaleY = CANVAS_HEIGHT / rect.height

    // Calculate delta in canvas coordinates
    const deltaX = (e.clientX - dragStart.x) * scaleX
    const deltaY = (e.clientY - dragStart.y) * scaleY

    // Convert to percentage offset (-100 to 100)
    // Sensitivity: moving 200px on canvas = full range
    const sensitivityX = 0.5
    const sensitivityY = 0.5

    const newOffsetX = Math.max(-100, Math.min(100, state.imageOffsetX + deltaX * sensitivityX))
    const newOffsetY = Math.max(-100, Math.min(100, state.imageOffsetY + deltaY * sensitivityY))

    setState((prev) => ({
      ...prev,
      imageOffsetX: newOffsetX,
      imageOffsetY: newOffsetY,
    }))

    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleCanvasMouseUp = () => {
    setIsDragging(false)
  }

  const handleCanvasMouseLeave = () => {
    setIsDragging(false)
  }

  // Export handlers
  const handleExportPNG = () => {
    if (!canvasRef.current) return
    const filename = generateFilename('keystones-social', 'png')
    const metadata = createAssetMetadata(
      'social-generator',
      {
        headlineLine1: state.headlineLine1,
        headlineLine2: state.headlineLine2,
        subheadLeft: state.subheadLeft,
        subheadRight: state.subheadRight,
        supportingText: state.supportingText,
        gridSize,
        waveAmount,
      },
      state.dataSource || undefined
    )
    downloadCanvasAsImage(canvasRef.current, filename, metadata)
  }

  const handleExportJPG = () => {
    if (!canvasRef.current) return
    const filename = generateFilename('keystones-social', 'jpg')
    downloadCanvasAsJPG(canvasRef.current, filename, jpgQuality / 100)
  }

  // Reset handler
  const handleReset = () => {
    if (confirm('Reset all fields? This will clear your current work.')) {
      setState({
        headlineLine1: 'Reimagine',
        headlineLine2: 'This Coastal Town',
        subheadLeft: 'Live Action Role Play',
        subheadRight: 'Felixstowe',
        supportingText: 'Supporting Secondary Text',
        userImage: null,
        imageOffsetX: 0,
        imageOffsetY: 0,
        gridData: null,
        dataSource: null,
      })
      setGridSize(20)
      setWaveAmount(15)
    }
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 font-mono uppercase tracking-wide">Reimagine This Social Generator</h1>
          <p className="text-muted-foreground font-mono text-sm">Create social graphics with dynamic marine data grids</p>
        </header>

        <div className="grid lg:grid-cols-[400px_1fr] gap-6">
          {/* Controls Panel */}
          <div className="space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto pr-2">
            {/* Headline */}
            <div className="card-gradient rounded-md border border-[#0F0E0E] p-5">
              <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[#0F0E0E] border-b border-[#0F0E0E] pb-2 mb-4">Headline</h3>
              <div className="space-y-4 relative z-10">
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase tracking-wider text-[#0F0E0E]">Line 1 (italic)</label>
                  <Input
                    value={state.headlineLine1}
                    onChange={(e) => setState((prev) => ({ ...prev, headlineLine1: e.target.value }))}
                    placeholder="Reimagine"
                    className="font-mono bg-transparent border-[#0F0E0E] text-[#0F0E0E] placeholder:text-[#555659] focus:bg-[rgba(245,235,180,0.85)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase tracking-wider text-[#0F0E0E]">Line 2</label>
                  <Input
                    value={state.headlineLine2}
                    onChange={(e) => setState((prev) => ({ ...prev, headlineLine2: e.target.value }))}
                    placeholder="This Coastal Town"
                    className="font-mono bg-transparent border-[#0F0E0E] text-[#0F0E0E] placeholder:text-[#555659] focus:bg-[rgba(245,235,180,0.85)]"
                  />
                </div>
              </div>
            </div>

            {/* Subheads */}
            <div className="card-gradient rounded-md border border-[#0F0E0E] p-5">
              <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[#0F0E0E] border-b border-[#0F0E0E] pb-2 mb-4">Subheads</h3>
              <div className="space-y-4 relative z-10">
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase tracking-wider text-[#0F0E0E]">Left tag</label>
                  <Input
                    value={state.subheadLeft}
                    onChange={(e) => setState((prev) => ({ ...prev, subheadLeft: e.target.value }))}
                    placeholder="Live Action Role Play"
                    className="font-mono bg-transparent border-[#0F0E0E] text-[#0F0E0E] placeholder:text-[#555659] focus:bg-[rgba(245,235,180,0.85)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase tracking-wider text-[#0F0E0E]">Right tag</label>
                  <Input
                    value={state.subheadRight}
                    onChange={(e) => setState((prev) => ({ ...prev, subheadRight: e.target.value }))}
                    placeholder="Felixstowe"
                    className="font-mono bg-transparent border-[#0F0E0E] text-[#0F0E0E] placeholder:text-[#555659] focus:bg-[rgba(245,235,180,0.85)]"
                  />
                </div>
              </div>
            </div>

            {/* Grid Controls */}
            <div className="card-gradient rounded-md border border-[#0F0E0E] p-5">
              <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[#0F0E0E] border-b border-[#0F0E0E] pb-2 mb-4">Grid Pattern</h3>
              <div className="space-y-4 relative z-10">
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

                {state.dataSource && (
                  <div className="bg-[rgba(245,235,180,0.85)] p-3 rounded text-sm space-y-1 font-mono text-[#0F0E0E]">
                    <div className="font-semibold uppercase text-xs tracking-wider">Data Used:</div>
                    {state.dataSource.type === 'tidal' ? (
                      <>
                        <div className="text-xs">{state.dataSource.station}</div>
                        <div className="text-xs">
                          {state.dataSource.level.toFixed(2)} {state.dataSource.unit}
                        </div>
                        <div className="text-xs text-[#555659]">{state.dataSource.time.toLocaleTimeString()}</div>
                      </>
                    ) : (
                      <>
                        <div className="text-xs">Total Ships: {state.dataSource.total}</div>
                        <div className="text-xs">
                          Flow: {state.dataSource.flow > 0 ? '+' : ''}
                          {state.dataSource.flow}
                        </div>
                        <div className="text-xs text-[#555659]">{state.dataSource.time.toLocaleTimeString()}</div>
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
                  {state.userImage ? (
                    <div className="space-y-2">
                      <div className="font-mono text-xs uppercase tracking-wider text-[#0F0E0E]">Image loaded</div>
                      <div className="font-mono text-xs text-[#555659]">{state.userImage.width} × {state.userImage.height}px</div>
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

                {state.userImage && (
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
                  value={state.supportingText}
                  onChange={(e) => setState((prev) => ({ ...prev, supportingText: e.target.value }))}
                  placeholder="Supporting Secondary Text"
                  className="font-mono bg-transparent border-[#0F0E0E] text-[#0F0E0E] placeholder:text-[#555659] focus:bg-[rgba(245,235,180,0.85)]"
                />
              </div>
            </div>

            {/* Export */}
            <div className="card-gradient rounded-md border border-[#0F0E0E] p-5">
              <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[#0F0E0E] border-b border-[#0F0E0E] pb-2 mb-4">Export</h3>
              <div className="space-y-3 relative z-10">
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
                cursor: state.userImage ? (isDragging ? 'grabbing' : 'grab') : 'default',
              }}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseLeave}
            />
            {state.userImage && (
              <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                Drag on canvas to reposition image
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
