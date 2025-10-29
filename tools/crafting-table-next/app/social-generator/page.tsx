'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FURTHERFIELD_CONFIG, type ContentType, type PaletteName } from '@/lib/config'
import { CanvasRenderer, generateFilename, downloadCanvasAsImage, type GridData, type DataSource } from '@/lib/canvas-utils'
import { fetchTidalData, fetchShipData } from '@/lib/api'
import { createAssetMetadata } from '@/lib/metadata'

type Format = 'square' | 'portrait'

interface AppState {
  format: Format
  width: number
  height: number
  gridData: GridData | null
  dataSource: DataSource | null
  palette: PaletteName
  colorMode: 'gradient' | 'solid'
  mainText: string
  textSize: number
  textColor: string
  contentType: ContentType
  tags: string[]
  footerStyle: 'numeric' | 'text'
  currentStep: number
}

export default function SocialGeneratorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [state, setState] = useState<AppState>({
    format: 'square',
    width: 1080,
    height: 1080,
    gridData: null,
    dataSource: null,
    palette: 'monochrome',
    colorMode: 'gradient',
    mainText: '',
    textSize: 48,
    textColor: '#1f2937',
    contentType: 'article',
    tags: [],
    footerStyle: 'text',
    currentStep: 1,
  })

  const [gridSize, setGridSize] = useState(15)
  const [waveAmount, setWaveAmount] = useState(20)
  const [dataSourceType, setDataSourceType] = useState<'tidal' | 'ships'>('tidal')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (canvasRef.current) {
      const renderer = new CanvasRenderer(canvasRef.current)
      renderer.clearCanvas(state.width, state.height, '#ffffff')
    }
  }, [state.width, state.height])

  const handleFormatChange = (format: Format) => {
    const width = 1080
    const height = format === 'square' ? 1080 : 1350

    setState((prev) => ({
      ...prev,
      format,
      width,
      height,
      currentStep: Math.max(prev.currentStep, 2),
    }))

    if (canvasRef.current) {
      canvasRef.current.width = width
      canvasRef.current.height = height
      const renderer = new CanvasRenderer(canvasRef.current)
      renderer.clearCanvas(width, height, '#ffffff')
    }
  }

  const handleGenerateGrid = async () => {
    if (!canvasRef.current) return

    setIsGenerating(true)
    try {
      // Fetch data
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
        currentStep: Math.max(prev.currentStep, 3),
      }))

      // Draw grid
      const renderer = new CanvasRenderer(canvasRef.current)
      renderer.clearCanvas(state.width, state.height, '#ffffff')
      renderer.drawGrid(gridData, state.width, state.height)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleApplyColors = () => {
    if (!canvasRef.current || !state.gridData) return

    const colors = FURTHERFIELD_CONFIG.palettes[state.palette]
    const renderer = new CanvasRenderer(canvasRef.current)

    // Redraw grid
    renderer.clearCanvas(state.width, state.height, '#ffffff')
    renderer.drawGrid(state.gridData, state.width, state.height)

    // Apply gradient if selected
    if (state.colorMode === 'gradient') {
      renderer.applyGradient(colors, state.width, state.height)
    }

    setState((prev) => ({ ...prev, currentStep: Math.max(prev.currentStep, 4) }))
  }

  const handleUpdateText = () => {
    if (!canvasRef.current || !state.gridData || !state.mainText) return

    const colors = FURTHERFIELD_CONFIG.palettes[state.palette]
    const renderer = new CanvasRenderer(canvasRef.current)

    // Redraw everything
    renderer.clearCanvas(state.width, state.height, '#ffffff')
    renderer.drawGrid(state.gridData, state.width, state.height)

    if (state.colorMode === 'gradient') {
      renderer.applyGradient(colors, state.width, state.height)
    }

    // Draw text
    renderer.drawText(state.mainText, state.textSize, state.textColor, state.width, state.height)

    setState((prev) => ({ ...prev, currentStep: Math.max(prev.currentStep, 5) }))
  }

  const handleUpdateFooter = () => {
    if (!canvasRef.current || !state.gridData) return

    const colors = FURTHERFIELD_CONFIG.palettes[state.palette]
    const renderer = new CanvasRenderer(canvasRef.current)

    // Redraw everything
    renderer.clearCanvas(state.width, state.height, '#ffffff')
    renderer.drawGrid(state.gridData, state.width, state.height)

    if (state.colorMode === 'gradient') {
      renderer.applyGradient(colors, state.width, state.height)
    }

    if (state.mainText) {
      renderer.drawText(state.mainText, state.textSize, state.textColor, state.width, state.height)
    }

    // Generate footer label
    let contentTypeLabel = ''
    if (state.footerStyle === 'numeric') {
      const typeCode = Object.keys(FURTHERFIELD_CONFIG.taxonomy.contentTypes).indexOf(state.contentType) + 1
      const tagCodes = state.tags
        .map((tag) => Object.keys(FURTHERFIELD_CONFIG.taxonomy.tags).indexOf(tag) + 1)
        .join(',')
      contentTypeLabel = `Type: ${typeCode}  Tags: ${tagCodes || 'none'}`
    } else {
      const typeName = FURTHERFIELD_CONFIG.taxonomy.contentTypes[state.contentType].name
      const tagNames = state.tags.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')
      contentTypeLabel = `${typeName}${tagNames ? ' · ' + tagNames : ''}`
    }

    // Draw footer
    renderer.drawFooter(state.width, state.height, contentTypeLabel, state.dataSource)
  }

  const handleExport = () => {
    if (!canvasRef.current) return
    const filename = generateFilename('social', 'png', state.format)

    // Create comprehensive metadata
    const metadata = createAssetMetadata(
      'social-generator',
      {
        format: state.format,
        width: state.width,
        height: state.height,
        gridSize,
        waveAmount,
        palette: state.palette,
        colorMode: state.colorMode,
        mainText: state.mainText,
        textSize: state.textSize,
        textColor: state.textColor,
        footerStyle: state.footerStyle,
      },
      state.dataSource || undefined,
      {
        contentType: state.contentType,
        tags: state.tags,
      }
    )

    downloadCanvasAsImage(canvasRef.current, filename, metadata)
  }

  const handleReset = () => {
    if (confirm('Start over? This will clear your current work.')) {
      setState({
        format: 'square',
        width: 1080,
        height: 1080,
        gridData: null,
        dataSource: null,
        palette: 'monochrome',
        colorMode: 'gradient',
        mainText: '',
        textSize: 48,
        textColor: '#1f2937',
        contentType: 'article',
        tags: [],
        footerStyle: 'text',
        currentStep: 1,
      })

      if (canvasRef.current) {
        const renderer = new CanvasRenderer(canvasRef.current)
        renderer.clearCanvas(1080, 1080, '#ffffff')
      }
    }
  }

  const toggleTag = (tag: string) => {
    setState((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }))
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">
            ← Back to Apps
          </Link>
          <h1 className="text-4xl font-bold mb-2">Social Graphics Generator</h1>
          <p className="text-muted-foreground">Streamlined workflow for social media assets</p>
        </header>

        <div className="grid lg:grid-cols-[450px_1fr] gap-6">
          {/* Controls Panel */}
          <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
            {/* Step 1: Format */}
            <Card className={state.currentStep >= 1 ? '' : 'opacity-50'}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <CardTitle>Format</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={state.format === 'square' ? 'default' : 'outline'}
                    className="h-auto flex-col py-4"
                    onClick={() => handleFormatChange('square')}
                  >
                    <div className="w-16 h-16 border-2 border-current rounded mb-2" />
                    <div className="font-bold">Square</div>
                    <div className="text-xs">1080×1080</div>
                  </Button>
                  <Button
                    variant={state.format === 'portrait' ? 'default' : 'outline'}
                    className="h-auto flex-col py-4"
                    onClick={() => handleFormatChange('portrait')}
                  >
                    <div className="w-12 h-16 border-2 border-current rounded mb-2" />
                    <div className="font-bold">Portrait</div>
                    <div className="text-xs">1080×1350</div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Generate Grid */}
            <Card className={state.currentStep >= 2 ? '' : 'opacity-50 pointer-events-none'}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <CardTitle>Grid Pattern</CardTitle>
                </div>
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
                  <Slider value={[gridSize]} onValueChange={([v]) => setGridSize(v)} min={8} max={25} step={1} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Wave Intensity</label>
                    <span className="text-sm text-muted-foreground">{waveAmount}</span>
                  </div>
                  <Slider value={[waveAmount]} onValueChange={([v]) => setWaveAmount(v)} min={5} max={50} step={1} />
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
                        <div>{state.dataSource.time.toLocaleTimeString()}</div>
                      </>
                    ) : (
                      <>
                        <div>Total Ships: {state.dataSource.total}</div>
                        <div>
                          Flow: {state.dataSource.flow > 0 ? '+' : ''}
                          {state.dataSource.flow}
                        </div>
                        <div>{state.dataSource.time.toLocaleTimeString()}</div>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step 3: Colors */}
            <Card className={state.currentStep >= 3 ? '' : 'opacity-50 pointer-events-none'}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <CardTitle>Colors</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Palette</label>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(FURTHERFIELD_CONFIG.palettes).map(([key, colors]) => (
                      <button
                        key={key}
                        onClick={() => setState((prev) => ({ ...prev, palette: key as PaletteName }))}
                        className={`aspect-square rounded border-2 transition-all ${
                          state.palette === key ? 'border-primary scale-110' : 'border-border'
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${colors.join(', ')})`,
                        }}
                        title={key}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Apply As</label>
                  <Select value={state.colorMode} onValueChange={(v: 'gradient' | 'solid') => setState((prev) => ({ ...prev, colorMode: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gradient">Gradient</SelectItem>
                      <SelectItem value="solid">Solid Colors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleApplyColors} className="w-full">
                  Apply Colors
                </Button>
              </CardContent>
            </Card>

            {/* Step 4: Content */}
            <Card className={state.currentStep >= 4 ? '' : 'opacity-50 pointer-events-none'}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <CardTitle>Content</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Main Text</label>
                  <Input
                    value={state.mainText}
                    onChange={(e) => setState((prev) => ({ ...prev, mainText: e.target.value }))}
                    placeholder="Event title, announcement, etc."
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Text Size</label>
                    <span className="text-sm text-muted-foreground">{state.textSize}</span>
                  </div>
                  <Slider
                    value={[state.textSize]}
                    onValueChange={([v]) => setState((prev) => ({ ...prev, textSize: v }))}
                    min={24}
                    max={96}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Text Color</label>
                  <Select value={state.textColor} onValueChange={(v) => setState((prev) => ({ ...prev, textColor: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="#1f2937">Dark Gray</SelectItem>
                      <SelectItem value="#ffffff">White</SelectItem>
                      <SelectItem value="#4b5563">Medium Gray</SelectItem>
                      <SelectItem value="#000000">Black</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleUpdateText} className="w-full">
                  Update Text
                </Button>
              </CardContent>
            </Card>

            {/* Step 5: Classification */}
            <Card className={state.currentStep >= 5 ? '' : 'opacity-50 pointer-events-none'}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    5
                  </div>
                  <CardTitle>Classification</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(FURTHERFIELD_CONFIG.taxonomy.contentTypes).map(([key, type]) => (
                      <Button
                        key={key}
                        variant={state.contentType === key ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setState((prev) => ({ ...prev, contentType: key as ContentType }))}
                      >
                        {type.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags (select multiple)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(FURTHERFIELD_CONFIG.taxonomy.tags).slice(0, 6).map((tag) => (
                      <Button
                        key={tag}
                        variant={state.tags.includes(tag) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag.charAt(0).toUpperCase() + tag.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Footer Style</label>
                  <Select value={state.footerStyle} onValueChange={(v: 'numeric' | 'text') => setState((prev) => ({ ...prev, footerStyle: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="numeric">Numeric Code</SelectItem>
                      <SelectItem value="text">Full Text</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleUpdateFooter} className="w-full">
                  Update Footer
                </Button>
              </CardContent>
            </Card>

            {/* Export */}
            <Card>
              <CardContent className="pt-6 space-y-2">
                <Button onClick={handleExport} className="w-full" size="lg">
                  ⬇ Download PNG
                </Button>
                <Button onClick={handleReset} variant="secondary" className="w-full">
                  ↻ Start Over
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-8 bg-card border rounded-lg p-8 flex items-center justify-center min-h-[600px]">
            <canvas
              ref={canvasRef}
              width={1080}
              height={1080}
              className="max-w-full max-h-[calc(100vh-200px)] border shadow-lg"
            />
          </div>
        </div>
      </div>
    </main>
  )
}
