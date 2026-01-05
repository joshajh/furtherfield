'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">
            ← Back to Apps
          </Link>
          <h1 className="text-4xl font-bold mb-2">Keystones Social Generator</h1>
          <p className="text-muted-foreground">Create social graphics with dynamic marine data grids</p>
        </header>

        <div className="grid lg:grid-cols-[400px_1fr] gap-6">
          {/* Controls Panel */}
          <div className="space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto pr-2">
            {/* Headline */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Headline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">Line 1 (italic)</label>
                  <Input
                    value={state.headlineLine1}
                    onChange={(e) => setState((prev) => ({ ...prev, headlineLine1: e.target.value }))}
                    placeholder="Reimagine"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">Line 2</label>
                  <Input
                    value={state.headlineLine2}
                    onChange={(e) => setState((prev) => ({ ...prev, headlineLine2: e.target.value }))}
                    placeholder="This Coastal Town"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Subheads */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Subheads</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">Left tag</label>
                  <Input
                    value={state.subheadLeft}
                    onChange={(e) => setState((prev) => ({ ...prev, subheadLeft: e.target.value }))}
                    placeholder="Live Action Role Play"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">Right tag</label>
                  <Input
                    value={state.subheadRight}
                    onChange={(e) => setState((prev) => ({ ...prev, subheadRight: e.target.value }))}
                    placeholder="Felixstowe"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Grid Controls */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Grid Pattern</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Source</label>
                  <Select value={dataSourceType} onValueChange={(v: 'tidal' | 'ships') => setDataSourceType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tidal">Live Tidal Data</SelectItem>
                      <SelectItem value="ships">Ship Movements</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Grid Density</label>
                    <span className="text-sm text-muted-foreground">{gridSize}</span>
                  </div>
                  <Slider value={[gridSize]} onValueChange={([v]) => setGridSize(v)} min={10} max={30} step={1} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Wave Intensity</label>
                    <span className="text-sm text-muted-foreground">{waveAmount}</span>
                  </div>
                  <Slider value={[waveAmount]} onValueChange={([v]) => setWaveAmount(v)} min={5} max={30} step={1} />
                </div>

                <Button onClick={handleGenerateGrid} disabled={isGenerating} className="w-full">
                  {isGenerating ? 'Generating...' : 'Generate Grid from Live Data'}
                </Button>

                {state.dataSource && (
                  <div className="bg-muted p-3 rounded text-sm space-y-1">
                    <div className="font-medium">Data Used:</div>
                    {state.dataSource.type === 'tidal' ? (
                      <>
                        <div>{state.dataSource.station}</div>
                        <div>
                          {state.dataSource.level.toFixed(2)} {state.dataSource.unit}
                        </div>
                        <div className="text-muted-foreground">{state.dataSource.time.toLocaleTimeString()}</div>
                      </>
                    ) : (
                      <>
                        <div>Total Ships: {state.dataSource.total}</div>
                        <div>
                          Flow: {state.dataSource.flow > 0 ? '+' : ''}
                          {state.dataSource.flow}
                        </div>
                        <div className="text-muted-foreground">{state.dataSource.time.toLocaleTimeString()}</div>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {state.userImage ? (
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Image loaded</div>
                      <div className="text-xs">{state.userImage.width} × {state.userImage.height}px</div>
                      <Button variant="outline" size="sm">Change Image</Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-sm">Drop image here or click to upload</div>
                      <div className="text-xs text-muted-foreground">PNG, JPG recommended</div>
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
                  <div className="text-xs text-muted-foreground pt-2">
                    Drag on preview to reposition
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Supporting Text */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Supporting Text</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={state.supportingText}
                  onChange={(e) => setState((prev) => ({ ...prev, supportingText: e.target.value }))}
                  placeholder="Supporting Secondary Text"
                />
              </CardContent>
            </Card>

            {/* Export */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Export</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleExportPNG} className="w-full">
                  Download PNG
                </Button>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm">JPG Quality</label>
                    <span className="text-sm text-muted-foreground">{jpgQuality}%</span>
                  </div>
                  <Slider value={[jpgQuality]} onValueChange={([v]) => setJpgQuality(v)} min={50} max={100} step={1} />
                </div>
                <Button onClick={handleExportJPG} variant="outline" className="w-full">
                  Download JPG
                </Button>
                <Button onClick={handleReset} variant="ghost" className="w-full text-muted-foreground">
                  Reset All
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-4 bg-card border rounded-lg p-4 flex flex-col items-center justify-center gap-2">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="max-w-full max-h-[calc(100vh-220px)] border shadow-lg"
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
              <div className="text-xs text-muted-foreground">
                Drag on canvas to reposition image
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
