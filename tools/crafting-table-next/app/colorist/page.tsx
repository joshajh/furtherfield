'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { FURTHERFIELD_CONFIG, type PaletteName } from '@/lib/config'
import { createAssetMetadata } from '@/lib/metadata'
import { createCompanionJSON } from '@/lib/metadata'

export default function ColoristPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [selectedPalette, setSelectedPalette] = useState<PaletteName>('monochrome')
  const [intensity, setIntensity] = useState(50)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setImageUrl(url)

      // Load image onto canvas
      const img = new Image()
      img.onload = () => {
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d')
          if (ctx) {
            canvasRef.current.width = img.width
            canvasRef.current.height = img.height
            ctx.drawImage(img, 0, 0)
          }
        }
      }
      img.src = url
    }
  }

  const applyColorFilter = () => {
    if (!canvasRef.current || !imageUrl) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Reload original image
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0)

      // Apply color overlay
      const colors = FURTHERFIELD_CONFIG.palettes[selectedPalette]
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      colors.forEach((color, i) => {
        gradient.addColorStop(i / (colors.length - 1), color)
      })

      ctx.globalCompositeOperation = 'multiply'
      ctx.globalAlpha = intensity / 100
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
    }
    img.src = imageUrl
  }

  const handleExport = () => {
    if (!canvasRef.current) return

    const filename = `colorized-${Date.now()}.png`

    // Create comprehensive metadata
    const metadata = createAssetMetadata(
      'colorist',
      {
        palette: selectedPalette,
        intensity,
        originalFilename: selectedFile?.name,
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

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">
            ← Back to Apps
          </Link>
          <h1 className="text-4xl font-bold mb-2">Colorist</h1>
          <p className="text-muted-foreground">
            Apply color palettes and gradients to your assets
          </p>
        </header>

        <div className="grid lg:grid-cols-[400px_1fr] gap-6">
          {/* Controls Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Asset</CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {selectedFile && (
                  <p className="mt-2 text-sm text-muted-foreground">{selectedFile.name}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Palette</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(FURTHERFIELD_CONFIG.palettes).map(([key, colors]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedPalette(key as PaletteName)}
                      className={`aspect-square rounded border-2 transition-all ${
                        selectedPalette === key ? 'border-primary scale-110' : 'border-border'
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${colors.join(', ')})`,
                      }}
                      title={key}
                    />
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Intensity</label>
                    <span className="text-sm text-muted-foreground">{intensity}%</span>
                  </div>
                  <Slider value={[intensity]} onValueChange={([v]) => setIntensity(v)} min={0} max={100} step={1} />
                </div>

                <Button onClick={applyColorFilter} disabled={!imageUrl} className="w-full">
                  Apply Colors
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Button onClick={handleExport} disabled={!imageUrl} variant="secondary" className="w-full">
                  Download PNG
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-8 bg-card border rounded-lg p-8 flex items-center justify-center min-h-[600px]">
            {imageUrl ? (
              <canvas ref={canvasRef} className="max-w-full max-h-[600px] border shadow-lg" />
            ) : (
              <div className="text-center text-muted-foreground">
                <p>Upload an image to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
