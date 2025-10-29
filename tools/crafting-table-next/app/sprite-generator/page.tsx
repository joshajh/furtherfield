'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FURTHERFIELD_CONFIG } from '@/lib/config'
import { createAssetMetadata } from '@/lib/metadata'
import { createCompanionJSON } from '@/lib/metadata'

const SPRITE_SIZE = 64
const PIXEL_SIZE = 8

type SpriteType = 'person' | 'flora' | 'fauna' | 'maritime'

export default function SpriteGeneratorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [spriteType, setSpriteType] = useState<SpriteType>('person')
  const [complexity, setComplexity] = useState(5)
  const [colorDensity, setColorDensity] = useState(50)

  const generateSprite = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE)

    const colors = FURTHERFIELD_CONFIG.palettes.monochrome
    const pixelsPerRow = SPRITE_SIZE / PIXEL_SIZE

    // Generate symmetric sprite
    for (let y = 0; y < pixelsPerRow; y++) {
      for (let x = 0; x < pixelsPerRow / 2; x++) {
        if (Math.random() * 100 < colorDensity) {
          const colorIndex = Math.floor(Math.random() * complexity)
          const color = colors[colorIndex % colors.length]

          ctx.fillStyle = color
          // Left side
          ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE)
          // Right side (mirrored)
          ctx.fillRect((pixelsPerRow - x - 1) * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE)
        }
      }
    }
  }

  useEffect(() => {
    generateSprite()
  }, [])

  const handleExport = () => {
    if (!canvasRef.current) return

    const filename = `sprite-${spriteType}-${Date.now()}.png`

    // Create comprehensive metadata
    const metadata = createAssetMetadata(
      'sprite-generator',
      {
        spriteType,
        complexity,
        colorDensity,
        spriteSize: SPRITE_SIZE,
        pixelSize: PIXEL_SIZE,
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
          <h1 className="text-4xl font-bold mb-2">Sprite Generator</h1>
          <p className="text-muted-foreground">
            Generate 8-bit pixel art sprites with procedural variations
          </p>
        </header>

        <div className="grid lg:grid-cols-[400px_1fr] gap-6">
          {/* Controls Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sprite Type</label>
                  <Select value={spriteType} onValueChange={(v: SpriteType) => setSpriteType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="person">Person</SelectItem>
                      <SelectItem value="flora">Flora</SelectItem>
                      <SelectItem value="fauna">Fauna</SelectItem>
                      <SelectItem value="maritime">Maritime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Complexity</label>
                    <span className="text-sm text-muted-foreground">{complexity}</span>
                  </div>
                  <Slider value={[complexity]} onValueChange={([v]) => setComplexity(v)} min={2} max={7} step={1} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Color Density</label>
                    <span className="text-sm text-muted-foreground">{colorDensity}%</span>
                  </div>
                  <Slider
                    value={[colorDensity]}
                    onValueChange={([v]) => setColorDensity(v)}
                    min={20}
                    max={80}
                    step={1}
                  />
                </div>

                <Button onClick={generateSprite} className="w-full">
                  Generate New Sprite
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Button onClick={handleExport} variant="secondary" className="w-full">
                  Download PNG
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-8 bg-card border rounded-lg p-8 flex items-center justify-center min-h-[600px]">
            <canvas
              ref={canvasRef}
              width={SPRITE_SIZE}
              height={SPRITE_SIZE}
              className="border shadow-lg"
              style={{ width: '400px', height: '400px', imageRendering: 'pixelated' }}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
