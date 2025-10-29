'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { fetchTidalData, fetchShipData } from '@/lib/api'
import { createWavyLine, calculateWaveParameters, exportSVGFile, exportSVGAsPNG } from '@/lib/svg-utils'
import { generateFilename } from '@/lib/canvas-utils'
import type { DataSource } from '@/lib/canvas-utils'
import { createAssetMetadata } from '@/lib/metadata'
import type { AssetMetadata } from '@/lib/metadata'
import { MetadataPreview } from '@/components/ui/metadata-preview'

const CANVAS_SIZE = 800

export default function GridGeneratorPage() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [gridSize, setGridSize] = useState(20)
  const [waveAmplitude, setWaveAmplitude] = useState(15)
  const [waveFrequency, setWaveFrequency] = useState(2)
  const [dataSourceType, setDataSourceType] = useState<'tidal' | 'ships'>('tidal')
  const [dataSource, setDataSource] = useState<DataSource | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewMetadata, setPreviewMetadata] = useState<AssetMetadata | null>(null)

  useEffect(() => {
    handleFetchData()
  }, [])

  const handleFetchData = async () => {
    setIsGenerating(true)
    try {
      const data = dataSourceType === 'tidal' ? await fetchTidalData() : await fetchShipData()
      setDataSource(data)
      generateGrid(data)
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    handleFetchData()
  }, [dataSourceType])

  // Update metadata preview whenever parameters change
  useEffect(() => {
    if (dataSource) {
      const metadata = createAssetMetadata(
        'grid-generator',
        {
          gridSize,
          waveAmplitude,
          waveFrequency,
        },
        dataSource
      )
      setPreviewMetadata(metadata)
    }
  }, [gridSize, waveAmplitude, waveFrequency, dataSource])

  const generateGrid = (currentData: DataSource = dataSource) => {
    if (!svgRef.current || !currentData) return

    const svg = svgRef.current
    const waveParams = calculateWaveParameters(waveAmplitude, waveFrequency, currentData)
    const cellSize = CANVAS_SIZE / gridSize

    // Clear existing paths (keep only the background rect)
    while (svg.children.length > 1) {
      svg.removeChild(svg.lastChild!)
    }

    // Draw horizontal lines with waves
    for (let i = 0; i <= gridSize; i++) {
      const y = i * cellSize
      const pathD = createWavyLine(0, y, CANVAS_SIZE, y, waveParams, 'horizontal', i)
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', pathD)
      path.setAttribute('stroke', '#000000')
      path.setAttribute('stroke-width', '1')
      path.setAttribute('fill', 'none')
      svg.appendChild(path)
    }

    // Draw vertical lines with waves
    for (let i = 0; i <= gridSize; i++) {
      const x = i * cellSize
      const pathD = createWavyLine(x, 0, x, CANVAS_SIZE, waveParams, 'vertical', i)
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', pathD)
      path.setAttribute('stroke', '#000000')
      path.setAttribute('stroke-width', '1')
      path.setAttribute('fill', 'none')
      svg.appendChild(path)
    }
  }

  const handleGenerate = () => {
    generateGrid()
  }

  const handleExportSVG = () => {
    if (!svgRef.current || !dataSource) return
    const filename = generateFilename('grid', 'svg', dataSourceType)

    // Create comprehensive metadata
    const metadata = createAssetMetadata(
      'grid-generator',
      {
        gridSize,
        waveAmplitude,
        waveFrequency,
      },
      dataSource
    )

    exportSVGFile(svgRef.current, filename, metadata)
  }

  const handleExportPNG = () => {
    if (!svgRef.current || !dataSource) return
    const filename = generateFilename('grid', 'png', dataSourceType)

    // Create comprehensive metadata
    const metadata = createAssetMetadata(
      'grid-generator',
      {
        gridSize,
        waveAmplitude,
        waveFrequency,
      },
      dataSource
    )

    exportSVGAsPNG(svgRef.current, filename, CANVAS_SIZE, metadata)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">
            ← Back to Apps
          </Link>
          <h1 className="text-4xl font-bold mb-2">Grid Generator</h1>
          <p className="text-muted-foreground">
            Dynamic grids influenced by Felixstowe&apos;s maritime data
          </p>
        </header>

        <div className="grid lg:grid-cols-[400px_1fr] gap-6">
          {/* Controls Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Settings</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        ℹ️ How it works
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>How Live Data Influences the Grid</DialogTitle>
                        <DialogDescription>
                          The grid patterns are shaped by real-time maritime data from Felixstowe
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6 text-sm">
                        <div>
                          <p className="text-foreground leading-relaxed mb-4">
                            The sliders you adjust set the <strong>base values</strong>. The live data then <strong>modulates</strong> these
                            to create unique patterns that reflect real-world conditions at that moment.
                          </p>
                        </div>

                        <div className="space-y-3">
                          <h3 className="font-semibold text-base">🌊 Tidal Flow Mode</h3>
                          <p className="text-muted-foreground">
                            Uses tide levels from the UK Environment Agency (typically -2m to +4m above ordnance datum)
                          </p>

                          <div className="bg-muted p-3 rounded space-y-2">
                            <div>
                              <strong className="text-foreground">Wave Amplitude (height):</strong>
                              <p className="text-muted-foreground mt-1">
                                • Low tide → waves are 50% of your slider value<br/>
                                • High tide → waves are 100% of your slider value<br/>
                                <em>Higher tides create bigger waves</em>
                              </p>
                            </div>
                            <div>
                              <strong className="text-foreground">Wave Frequency (repetition):</strong>
                              <p className="text-muted-foreground mt-1">
                                • Low tide → slower, stretched waves (80%)<br/>
                                • High tide → faster, compressed waves (120%)<br/>
                                <em>High tide brings more frequent wave cycles</em>
                              </p>
                            </div>
                            <div>
                              <strong className="text-foreground">Phase (offset):</strong>
                              <p className="text-muted-foreground mt-1">
                                Creates a rotational shift based on the tide&apos;s current position in its cycle
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h3 className="font-semibold text-base">🚢 Ship Movement Mode</h3>
                          <p className="text-muted-foreground">
                            Uses simulated port traffic data (total ships and flow direction)
                          </p>

                          <div className="bg-muted p-3 rounded space-y-2">
                            <div>
                              <strong className="text-foreground">Wave Amplitude (height):</strong>
                              <p className="text-muted-foreground mt-1">
                                More ships in port → bigger waves<br/>
                                <em>Port activity creates visual disturbance</em>
                              </p>
                            </div>
                            <div>
                              <strong className="text-foreground">Wave Frequency (repetition):</strong>
                              <p className="text-muted-foreground mt-1">
                                • More departures → slower waves (50-100%)<br/>
                                • More arrivals → faster waves (100-150%)<br/>
                                <em>Ships arriving create incoming wave patterns</em>
                              </p>
                            </div>
                            <div>
                              <strong className="text-foreground">Phase (offset):</strong>
                              <p className="text-muted-foreground mt-1">
                                Flow direction determines wave orientation
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <p className="text-muted-foreground italic">
                            Each grid is a unique snapshot of Felixstowe&apos;s maritime state.
                            The same settings will produce different patterns depending on the time of day,
                            tide state, or port activity—making each grid a true data visualization.
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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
                      <SelectItem value="tidal">Tidal Flow</SelectItem>
                      <SelectItem value="ships">Ship Movement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Grid Size</label>
                    <span className="text-sm text-muted-foreground">{gridSize}</span>
                  </div>
                  <Slider value={[gridSize]} onValueChange={([v]) => setGridSize(v)} min={5} max={50} step={1} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Wave Amplitude</label>
                    <span className="text-sm text-muted-foreground">{waveAmplitude}</span>
                  </div>
                  <Slider
                    value={[waveAmplitude]}
                    onValueChange={([v]) => setWaveAmplitude(v)}
                    min={0}
                    max={30}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Wave Frequency</label>
                    <span className="text-sm text-muted-foreground">{waveFrequency.toFixed(1)}</span>
                  </div>
                  <Slider
                    value={[waveFrequency]}
                    onValueChange={([v]) => setWaveFrequency(v)}
                    min={1}
                    max={4}
                    step={0.1}
                  />
                </div>

                <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
                  {isGenerating ? 'Generating...' : 'Generate New Grid'}
                </Button>
              </CardContent>
            </Card>

            {dataSource && (
              <Card>
                <CardHeader>
                  <CardTitle>Current Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {dataSource.type === 'tidal' ? (
                    <>
                      <div>
                        <span className="font-medium">Station:</span> {dataSource.station}
                      </div>
                      <div>
                        <span className="font-medium">Tide Level:</span> {dataSource.level.toFixed(2)}{' '}
                        {dataSource.unit}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Last updated: {dataSource.time.toLocaleTimeString()}
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="font-medium">Total Vessels:</span> {dataSource.total}
                      </div>
                      <div>
                        <span className="font-medium">Arrivals:</span> {dataSource.arrivals} |{' '}
                        <span className="font-medium">Departures:</span> {dataSource.departures}
                      </div>
                      <div>
                        <span className="font-medium">Net Flow:</span> {dataSource.flow > 0 ? '+' : ''}
                        {dataSource.flow}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Last updated: {dataSource.time.toLocaleTimeString()}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="pt-6 space-y-2">
                <Button onClick={handleExportSVG} variant="secondary" className="w-full">
                  Download SVG
                </Button>
                <Button onClick={handleExportPNG} variant="secondary" className="w-full">
                  Download PNG
                </Button>
              </CardContent>
            </Card>

            <MetadataPreview metadata={previewMetadata} />
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-8 bg-card border rounded-lg p-8 flex items-center justify-center min-h-[600px]">
            <svg
              ref={svgRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
              className="max-w-full h-auto border shadow-lg"
            >
              <rect width={CANVAS_SIZE} height={CANVAS_SIZE} fill="white" />
            </svg>
          </div>
        </div>
      </div>
    </main>
  )
}
