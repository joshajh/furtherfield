'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FURTHERFIELD_CONFIG, type ContentType } from '@/lib/config'
import { exportSVGFile, exportSVGAsPNG } from '@/lib/svg-utils'
import { createAssetMetadata } from '@/lib/metadata'
import type { AssetMetadata } from '@/lib/metadata'
import { MetadataPreview } from '@/components/ui/metadata-preview'

const MARK_SIZE = 128

export default function MarkGeneratorPage() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [contentType, setContentType] = useState<ContentType>('article')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [previewMetadata, setPreviewMetadata] = useState<AssetMetadata | null>(null)

  const generateMark = () => {
    if (!svgRef.current) return

    const svg = svgRef.current
    const typeData = FURTHERFIELD_CONFIG.taxonomy.contentTypes[contentType]

    // Clear existing
    while (svg.children.length > 1) {
      svg.removeChild(svg.lastChild!)
    }

    const centerX = MARK_SIZE / 2
    const centerY = MARK_SIZE / 2
    const size = 60

    // Draw shape based on content type
    const shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    shape.setAttribute('x', String(centerX - size / 2))
    shape.setAttribute('y', String(centerY - size / 2))
    shape.setAttribute('width', String(size))
    shape.setAttribute('height', String(size))
    shape.setAttribute('fill', typeData.color)
    shape.setAttribute('stroke', '#000000')
    shape.setAttribute('stroke-width', '2')
    svg.appendChild(shape)

    // Add tag indicators as small circles around the shape
    selectedTags.forEach((tag, i) => {
      const angle = (i / selectedTags.length) * Math.PI * 2
      const radius = size * 0.8
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      circle.setAttribute('cx', String(x))
      circle.setAttribute('cy', String(y))
      circle.setAttribute('r', '6')
      circle.setAttribute('fill', '#000000')
      svg.appendChild(circle)
    })
  }

  useEffect(() => {
    generateMark()
  }, [contentType, selectedTags])

  // Update metadata preview whenever parameters change
  useEffect(() => {
    const metadata = createAssetMetadata(
      'mark-generator',
      {
        contentType,
        selectedTags,
      },
      undefined,
      {
        contentType,
        tags: selectedTags,
      }
    )
    setPreviewMetadata(metadata)
  }, [contentType, selectedTags])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleExportSVG = () => {
    if (!svgRef.current) return

    // Create comprehensive metadata including taxonomy
    const metadata = createAssetMetadata(
      'mark-generator',
      {
        contentType,
        selectedTags,
      },
      undefined,
      {
        contentType,
        tags: selectedTags,
      }
    )

    exportSVGFile(svgRef.current, `mark-${contentType}-${Date.now()}.svg`, metadata)
  }

  const handleExportPNG = () => {
    if (!svgRef.current) return

    // Create comprehensive metadata including taxonomy
    const metadata = createAssetMetadata(
      'mark-generator',
      {
        contentType,
        selectedTags,
      },
      undefined,
      {
        contentType,
        tags: selectedTags,
      }
    )

    exportSVGAsPNG(svgRef.current, `mark-${contentType}-${Date.now()}.png`, MARK_SIZE, metadata)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">
            ← Back to Apps
          </Link>
          <h1 className="text-4xl font-bold mb-2">Mark Generator</h1>
          <p className="text-muted-foreground">
            Create geometric marks that encode content type and tags
          </p>
        </header>

        <div className="grid lg:grid-cols-[400px_1fr] gap-6">
          {/* Controls Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(FURTHERFIELD_CONFIG.taxonomy.contentTypes).map(([key, type]) => (
                    <Button
                      key={key}
                      variant={contentType === key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setContentType(key as ContentType)}
                    >
                      {type.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(FURTHERFIELD_CONFIG.taxonomy.tags).slice(0, 8).map((tag) => (
                    <Button
                      key={tag}
                      variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

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
              width={MARK_SIZE}
              height={MARK_SIZE}
              viewBox={`0 0 ${MARK_SIZE} ${MARK_SIZE}`}
              className="border shadow-lg"
              style={{ width: '300px', height: '300px' }}
            >
              <rect width={MARK_SIZE} height={MARK_SIZE} fill="white" />
            </svg>
          </div>
        </div>
      </div>
    </main>
  )
}
