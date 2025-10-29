'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { fetchHistoricalTidalData } from '@/lib/api'
import { extractTimestamp, parseManualTimestamp } from '@/lib/timestamp-utils'
import type { ExtractedTimestamp } from '@/lib/timestamp-utils'
import { createWavyLine, calculateWaveParameters, exportSVGFile, exportSVGAsPNG } from '@/lib/svg-utils'
import { generateFilename } from '@/lib/canvas-utils'
import type { TidalData } from '@/lib/canvas-utils'
import { createAssetMetadata } from '@/lib/metadata'
import type { AssetMetadata } from '@/lib/metadata'
import { MetadataPreview } from '@/components/ui/metadata-preview'

const CANVAS_SIZE = 800

export default function TideTablePage() {
  const svgRef = useRef<SVGSVGElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Step tracking
  const [currentStep, setCurrentStep] = useState(1)

  // Step 1: File upload
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  // Step 2: Timestamp extraction & review
  const [extractedTimestamp, setExtractedTimestamp] = useState<ExtractedTimestamp | null>(null)
  const [manualTimestamp, setManualTimestamp] = useState('')
  const [finalTimestamp, setFinalTimestamp] = useState<Date | null>(null)

  // Step 3: Historical tide data
  const [tidalData, setTidalData] = useState<TidalData | null>(null)
  const [isLoadingTide, setIsLoadingTide] = useState(false)

  // Step 4: Grid generation
  const [gridSize, setGridSize] = useState(20)
  const [waveAmplitude, setWaveAmplitude] = useState(15)
  const [waveFrequency, setWaveFrequency] = useState(2)
  const [previewMetadata, setPreviewMetadata] = useState<AssetMetadata | null>(null)

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadedFile(file)

    // Extract timestamp from file
    const result = await extractTimestamp(file)
    setExtractedTimestamp(result)
    setFinalTimestamp(result.timestamp)
    setCurrentStep(2)
  }

  // Handle manual timestamp change
  const handleManualTimestampChange = (value: string) => {
    setManualTimestamp(value)
    const parsed = parseManualTimestamp(value)
    if (parsed) {
      setFinalTimestamp(parsed)
    }
  }

  // Confirm timestamp and fetch historical tide data
  const handleConfirmTimestamp = async () => {
    if (!finalTimestamp) return

    setIsLoadingTide(true)
    setCurrentStep(3)

    try {
      const tideData = await fetchHistoricalTidalData(finalTimestamp)
      setTidalData(tideData)

      // Auto-generate grid with fetched data
      generateGrid(tideData)
      setCurrentStep(4)
    } finally {
      setIsLoadingTide(false)
    }
  }

  // Generate grid
  const generateGrid = (currentData: TidalData = tidalData!) => {
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

  // Update metadata preview whenever parameters change
  useEffect(() => {
    if (tidalData && finalTimestamp && uploadedFile) {
      const isSimulated = tidalData.station.includes('Simulated')

      const metadata = createAssetMetadata(
        'tide-table',
        {
          gridSize,
          waveAmplitude,
          waveFrequency,
        },
        tidalData
      )

      // Add source asset information
      ;(metadata as any).sourceAsset = {
        type: getAssetType(uploadedFile),
        filename: uploadedFile.name,
        originalTimestamp: finalTimestamp.toISOString(),
        timestampSource: extractedTimestamp?.source || 'manual',
      }

      // Mark data quality
      ;(metadata.dataSource as any).dataQuality = isSimulated ? 'simulated' : 'actual'

      setPreviewMetadata(metadata)
    }
  }, [gridSize, waveAmplitude, waveFrequency, tidalData, finalTimestamp, uploadedFile, extractedTimestamp])

  // Update grid when parameters change
  useEffect(() => {
    if (tidalData) {
      generateGrid(tidalData)
    }
  }, [gridSize, waveAmplitude, waveFrequency])

  const handleExportSVG = () => {
    if (!svgRef.current || !previewMetadata) return
    const filename = generateFilename('tide-table', 'svg', 'historical')
    exportSVGFile(svgRef.current, filename, previewMetadata)
  }

  const handleExportPNG = () => {
    if (!svgRef.current || !previewMetadata) return
    const filename = generateFilename('tide-table', 'png', 'historical')
    exportSVGAsPNG(svgRef.current, filename, CANVAS_SIZE, previewMetadata)
  }

  const handleReset = () => {
    setUploadedFile(null)
    setExtractedTimestamp(null)
    setManualTimestamp('')
    setFinalTimestamp(null)
    setTidalData(null)
    setPreviewMetadata(null)
    setCurrentStep(1)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">
            ← Back to Apps
          </Link>
          <h1 className="text-4xl font-bold mb-2">Tide Table</h1>
          <p className="text-muted-foreground">
            Generate grids from historical maritime data based on your asset&apos;s original timestamp
          </p>
        </header>

        <div className="grid lg:grid-cols-[450px_1fr] gap-6">
          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Step 1: Upload File */}
            <Card className={currentStep >= 1 ? '' : 'opacity-50'}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <CardTitle>Upload Asset</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.json"
                  onChange={handleFileUpload}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {uploadedFile && (
                  <div className="bg-muted p-3 rounded text-sm">
                    <div className="font-medium truncate">{uploadedFile.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Upload an image or JSON file. We&apos;ll extract the timestamp from EXIF data or metadata.
                </p>
              </CardContent>
            </Card>

            {/* Step 2: Review Timestamp */}
            <Card className={currentStep >= 2 ? '' : 'opacity-50 pointer-events-none'}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <CardTitle>Review Timestamp</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {extractedTimestamp && (
                  <div className="bg-muted p-3 rounded space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Extracted:</span>{' '}
                      {extractedTimestamp.timestamp.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Source:</span>{' '}
                      <span className="capitalize">{extractedTimestamp.source}</span>
                      {' '}
                      <span className={`text-xs ${
                        extractedTimestamp.confidence === 'high' ? 'text-green-600' :
                        extractedTimestamp.confidence === 'medium' ? 'text-yellow-600' :
                        'text-orange-600'
                      }`}>
                        ({extractedTimestamp.confidence} confidence)
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Manual Override (optional)</label>
                  <Input
                    type="datetime-local"
                    value={manualTimestamp}
                    onChange={(e) => handleManualTimestampChange(e.target.value)}
                    placeholder="YYYY-MM-DD HH:MM"
                  />
                  <p className="text-xs text-muted-foreground">
                    Override the extracted timestamp if needed
                  </p>
                </div>

                {finalTimestamp && (
                  <div className="bg-primary/10 p-3 rounded text-sm">
                    <div className="font-medium">Using timestamp:</div>
                    <div className="text-lg">{finalTimestamp.toLocaleString()}</div>
                  </div>
                )}

                <Button
                  onClick={handleConfirmTimestamp}
                  disabled={!finalTimestamp || isLoadingTide}
                  className="w-full"
                >
                  {isLoadingTide ? 'Fetching Historical Data...' : 'Confirm & Fetch Tide Data'}
                </Button>
              </CardContent>
            </Card>

            {/* Step 3: Historical Tide Data */}
            <Card className={currentStep >= 3 ? '' : 'opacity-50 pointer-events-none'}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <CardTitle>Historical Maritime Data</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {tidalData ? (
                  <div className="bg-muted p-3 rounded text-sm space-y-1">
                    <div className="font-medium">
                      {tidalData.station}
                      {tidalData.station.includes('Simulated') && (
                        <span className="ml-2 text-xs text-orange-600">(Simulated)</span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Tide Level:</span> {tidalData.level.toFixed(2)} {tidalData.unit}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      At: {tidalData.time.toLocaleString()}
                    </div>
                    {!tidalData.station.includes('Simulated') && (
                      <div className="text-xs text-green-600 mt-2">
                        ✓ Real historical data from UK Environment Agency
                      </div>
                    )}
                    {tidalData.station.includes('Simulated') && (
                      <div className="text-xs text-orange-600 mt-2">
                        Historical API data unavailable - using tidal simulation
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Waiting for timestamp confirmation...
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step 4: Grid Parameters */}
            <Card className={currentStep >= 4 ? '' : 'opacity-50 pointer-events-none'}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <CardTitle>Grid Parameters</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                  The grid visualizes maritime conditions from {finalTimestamp?.toLocaleDateString()}
                </p>
              </CardContent>
            </Card>

            {/* Export */}
            {currentStep >= 4 && (
              <>
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

                <Button onClick={handleReset} variant="outline" className="w-full">
                  ↻ Start Over
                </Button>
              </>
            )}
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-8 bg-card border rounded-lg p-8 flex items-center justify-center min-h-[600px]">
            {currentStep >= 4 ? (
              <svg
                ref={svgRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
                className="max-w-full h-auto border shadow-lg"
              >
                <rect width={CANVAS_SIZE} height={CANVAS_SIZE} fill="white" />
              </svg>
            ) : (
              <div className="text-center text-muted-foreground space-y-4">
                <div className="text-6xl">🌊</div>
                <p className="text-lg font-medium">Tide Table</p>
                <p className="text-sm max-w-md">
                  Upload an asset to visualize the maritime conditions from when it was originally created
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

function getAssetType(file: File): string {
  if (file.type.startsWith('image/')) return 'image'
  if (file.type.includes('json')) return 'json'
  return 'file'
}
