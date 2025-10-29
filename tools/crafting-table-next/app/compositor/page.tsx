'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { createAssetMetadata } from '@/lib/metadata'
import { createCompanionJSON } from '@/lib/metadata'

interface Layer {
  id: string
  name: string
  imageUrl: string
  opacity: number
  visible: boolean
}

const CANVAS_SIZE = 800

export default function CompositorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [layers, setLayers] = useState<Layer[]>([])
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      const newLayer: Layer = {
        id: Date.now().toString(),
        name: file.name,
        imageUrl: url,
        opacity: 100,
        visible: true,
      }
      setLayers((prev) => [...prev, newLayer])
      renderComposite([...layers, newLayer])
    }
  }

  const renderComposite = (layersToRender: Layer[] = layers) => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    // Render each visible layer
    layersToRender
      .filter((layer) => layer.visible)
      .forEach((layer) => {
        const img = new Image()
        img.onload = () => {
          ctx.globalAlpha = layer.opacity / 100
          ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE)
          ctx.globalAlpha = 1
        }
        img.src = layer.imageUrl
      })
  }

  const updateLayerOpacity = (layerId: string, opacity: number) => {
    const updatedLayers = layers.map((layer) =>
      layer.id === layerId ? { ...layer, opacity } : layer
    )
    setLayers(updatedLayers)
    renderComposite(updatedLayers)
  }

  const toggleLayerVisibility = (layerId: string) => {
    const updatedLayers = layers.map((layer) =>
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    )
    setLayers(updatedLayers)
    renderComposite(updatedLayers)
  }

  const deleteLayer = (layerId: string) => {
    const updatedLayers = layers.filter((layer) => layer.id !== layerId)
    setLayers(updatedLayers)
    renderComposite(updatedLayers)
  }

  const handleExport = () => {
    if (!canvasRef.current) return

    const filename = `composite-${Date.now()}.png`

    // Create comprehensive metadata including all layer information
    const metadata = createAssetMetadata(
      'compositor',
      {
        canvasSize: CANVAS_SIZE,
        layerCount: layers.length,
        layers: layers.map(layer => ({
          name: layer.name,
          opacity: layer.opacity,
          visible: layer.visible,
        })),
      }
    )

    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        link.click()
        URL.revokeObjectURL(url)

        // Create companion JSON file
        createCompanionJSON(metadata, filename)
      }
    })
  }

  const selectedLayer = layers.find((l) => l.id === selectedLayerId)

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">
            ← Back to Apps
          </Link>
          <h1 className="text-4xl font-bold mb-2">Compositor</h1>
          <p className="text-muted-foreground">
            Combine multiple assets into layered compositions
          </p>
        </header>

        <div className="grid lg:grid-cols-[400px_1fr] gap-6">
          {/* Controls Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Layer</CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Layers ({layers.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {layers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No layers yet. Upload an image to start.</p>
                ) : (
                  layers.map((layer) => (
                    <div
                      key={layer.id}
                      className={`p-3 border rounded cursor-pointer transition-colors ${
                        selectedLayerId === layer.id ? 'border-primary bg-accent' : 'border-border'
                      }`}
                      onClick={() => setSelectedLayerId(layer.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium truncate">{layer.name}</span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleLayerVisibility(layer.id)
                            }}
                          >
                            {layer.visible ? '👁️' : '👁️‍🗨️'}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteLayer(layer.id)
                            }}
                          >
                            🗑️
                          </Button>
                        </div>
                      </div>
                      {selectedLayerId === layer.id && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Opacity</span>
                            <span>{layer.opacity}%</span>
                          </div>
                          <Slider
                            value={[layer.opacity]}
                            onValueChange={([v]) => updateLayerOpacity(layer.id, v)}
                            min={0}
                            max={100}
                            step={1}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {layers.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <Button onClick={handleExport} variant="secondary" className="w-full">
                    Download Composite
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-8 bg-card border rounded-lg p-8 flex items-center justify-center min-h-[600px]">
            {layers.length > 0 ? (
              <canvas
                ref={canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                className="max-w-full max-h-[600px] border shadow-lg"
              />
            ) : (
              <div className="text-center text-muted-foreground">
                <p>Upload images to create a composite</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
