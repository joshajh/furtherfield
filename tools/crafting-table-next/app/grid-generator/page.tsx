'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { fetchTidalData, fetchShipData } from '@/lib/api'
import { createWavyLine, calculateWaveParameters, exportSVGFile, exportSVGAsPNG } from '@/lib/svg-utils'
import { generateFilename } from '@/lib/canvas-utils'
import type { DataSource } from '@/lib/canvas-utils'
import { createAssetMetadata } from '@/lib/metadata'

const CANVAS_SIZE = 800

export default function GridGeneratorPage() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [gridSize, setGridSize] = useState(20)
  const [waveAmplitude, setWaveAmplitude] = useState(15)
  const [waveFrequency, setWaveFrequency] = useState(2)
  const [dataSourceType, setDataSourceType] = useState<'tidal' | 'ships'>('tidal')
  const [dataSource, setDataSource] = useState<DataSource | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

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

  const generateGrid = (currentData: DataSource | null = dataSource) => {
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
    const filename = generateFilename('RTCT-grid', 'svg', dataSourceType)

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
    const filename = generateFilename('RTCT-grid', 'png', dataSourceType)

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
    <main className="min-h-screen bg-[#F6F8FB]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <Link href="/" className="font-mono text-xs uppercase tracking-wider text-[#555659] hover:text-[#0F0E0E] mb-4 inline-block">
            ← Crafting Table
          </Link>
          <h1 className="text-3xl font-bold font-mono uppercase tracking-wide text-[#0F0E0E]">Grid Generator</h1>
          <p className="font-mono text-sm text-[#555659] mt-2">
            Generate wave-distorted grids from live tidal and ship data
          </p>
        </header>

        <div className="grid lg:grid-cols-[400px_1fr] gap-6">
          {/* Controls Panel */}
          <div className="space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto pr-2">
            {/* Data Source */}
            <div className="card-gradient rounded-md border border-[#0F0E0E] p-5">
              <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[#0F0E0E] border-b border-[#0F0E0E] pb-2 mb-4">Data Source</h3>
              <div className="space-y-4 relative z-10">
                <Select value={dataSourceType} onValueChange={(v: 'tidal' | 'ships') => setDataSourceType(v)}>
                  <SelectTrigger className="font-mono bg-transparent border-[#0F0E0E] text-[#0F0E0E]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="font-mono">
                    <SelectItem value="tidal">Live Tidal Data</SelectItem>
                    <SelectItem value="ships">Ship Movements</SelectItem>
                  </SelectContent>
                </Select>

                {dataSource && (
                  <div className="bg-[rgba(245,235,180,0.85)] p-3 rounded text-sm space-y-1 font-mono text-[#0F0E0E]">
                    <div className="font-semibold uppercase text-xs tracking-wider">Current Data:</div>
                    {dataSource.type === 'tidal' ? (
                      <>
                        <div className="text-xs">{dataSource.station}</div>
                        <div className="text-xs">
                          {dataSource.level.toFixed(2)} {dataSource.unit}
                        </div>
                        <div className="text-xs text-[#555659]">{dataSource.time.toLocaleTimeString()}</div>
                      </>
                    ) : (
                      <>
                        <div className="text-xs">Total Ships: {dataSource.total}</div>
                        <div className="text-xs">
                          Flow: {dataSource.flow > 0 ? '+' : ''}{dataSource.flow}
                        </div>
                        <div className="text-xs text-[#555659]">{dataSource.time.toLocaleTimeString()}</div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Grid Settings */}
            <div className="card-gradient rounded-md border border-[#0F0E0E] p-5">
              <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[#0F0E0E] border-b border-[#0F0E0E] pb-2 mb-4">Grid Settings</h3>
              <div className="space-y-4 relative z-10">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="font-mono text-xs uppercase tracking-wider text-[#0F0E0E]">Grid Size</label>
                    <span className="font-mono text-xs text-[#555659]">{gridSize}</span>
                  </div>
                  <Slider value={[gridSize]} onValueChange={([v]) => setGridSize(v)} min={5} max={50} step={1} className="[&_[role=slider]]:bg-[#0F0E0E]" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="font-mono text-xs uppercase tracking-wider text-[#0F0E0E]">Wave Amplitude</label>
                    <span className="font-mono text-xs text-[#555659]">{waveAmplitude}</span>
                  </div>
                  <Slider
                    value={[waveAmplitude]}
                    onValueChange={([v]) => setWaveAmplitude(v)}
                    min={0}
                    max={30}
                    step={1}
                    className="[&_[role=slider]]:bg-[#0F0E0E]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="font-mono text-xs uppercase tracking-wider text-[#0F0E0E]">Wave Frequency</label>
                    <span className="font-mono text-xs text-[#555659]">{waveFrequency.toFixed(1)}</span>
                  </div>
                  <Slider
                    value={[waveFrequency]}
                    onValueChange={([v]) => setWaveFrequency(v)}
                    min={1}
                    max={4}
                    step={0.1}
                    className="[&_[role=slider]]:bg-[#0F0E0E]"
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full font-mono uppercase tracking-wider bg-[#0F0E0E] text-[#F6F8FB] hover:bg-[rgba(200,255,0,0.85)] hover:text-[#0F0E0E] border border-[#0F0E0E]"
                >
                  {isGenerating ? 'Generating...' : 'Generate Grid'}
                </Button>
              </div>
            </div>

            {/* Export */}
            <div className="card-gradient rounded-md border border-[#0F0E0E] p-5">
              <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[#0F0E0E] border-b border-[#0F0E0E] pb-2 mb-4">Export</h3>
              <div className="space-y-3 relative z-10">
                <Button
                  onClick={handleExportSVG}
                  className="w-full font-mono uppercase tracking-wider bg-[#0F0E0E] text-[#F6F8FB] hover:bg-[rgba(200,255,0,0.85)] hover:text-[#0F0E0E] border border-[#0F0E0E]"
                >
                  Download SVG
                </Button>
                <Button
                  onClick={handleExportPNG}
                  className="w-full font-mono uppercase tracking-wider bg-transparent text-[#0F0E0E] border border-[#0F0E0E] hover:bg-[rgba(245,235,180,0.85)]"
                >
                  Download PNG
                </Button>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-4 bg-[#1a1a1a] border border-[#333] rounded-md p-4 flex flex-col items-center justify-center">
            <svg
              ref={svgRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
              className="max-w-full h-auto border border-[#333] shadow-lg"
            >
              <rect width={CANVAS_SIZE} height={CANVAS_SIZE} fill="white" />
            </svg>
          </div>
        </div>
      </div>
    </main>
  )
}
