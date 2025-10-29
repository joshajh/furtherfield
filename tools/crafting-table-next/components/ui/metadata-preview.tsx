'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { AssetMetadata } from '@/lib/metadata'

interface MetadataPreviewProps {
  metadata: AssetMetadata | null
  title?: string
}

export function MetadataPreview({ metadata, title = 'Metadata Preview' }: MetadataPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted')

  if (!metadata) {
    return null
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(metadata, null, 2))
  }

  return (
    <Card className="text-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{title}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 text-xs"
            >
              Copy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-7 text-xs"
            >
              {isExpanded ? '▼' : '▶'}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 space-y-3">
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'formatted' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('formatted')}
              className="h-7 text-xs flex-1"
            >
              Formatted
            </Button>
            <Button
              variant={viewMode === 'raw' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('raw')}
              className="h-7 text-xs flex-1"
            >
              Raw JSON
            </Button>
          </div>

          {viewMode === 'formatted' ? (
            <div className="space-y-2 font-mono">
              <div className="grid grid-cols-[80px_1fr] gap-x-2 gap-y-1">
                <span className="text-muted-foreground">ID:</span>
                <span className="truncate" title={metadata.id}>{metadata.id}</span>

                <span className="text-muted-foreground">App:</span>
                <span>{metadata.app}</span>

                <span className="text-muted-foreground">Version:</span>
                <span>{metadata.version}</span>

                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(metadata.timestamp).toLocaleString()}</span>

                <span className="text-muted-foreground">Creator:</span>
                <span>{metadata.creator}</span>

                <span className="text-muted-foreground">License:</span>
                <span>{metadata.license}</span>
              </div>

              {metadata.taxonomy && (
                <div className="pt-2 border-t">
                  <div className="font-semibold mb-1">Taxonomy</div>
                  <div className="grid grid-cols-[80px_1fr] gap-x-2 gap-y-1">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{metadata.taxonomy.contentType}</span>

                    <span className="text-muted-foreground">Tags:</span>
                    <span>{metadata.taxonomy.tags.join(', ') || 'none'}</span>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t">
                <div className="font-semibold mb-1">Parameters</div>
                <div className="bg-muted p-2 rounded overflow-auto max-h-32">
                  <pre className="text-[10px]">
                    {JSON.stringify(metadata.parameters, null, 2)}
                  </pre>
                </div>
              </div>

              {metadata.dataSource && (
                <div className="pt-2 border-t">
                  <div className="font-semibold mb-1">
                    Data Source: {metadata.dataSource.type === 'tidal' ? 'Tidal' : 'Ships'}
                  </div>
                  <div className="bg-muted p-2 rounded overflow-auto max-h-32">
                    <pre className="text-[10px]">
                      {JSON.stringify(metadata.dataSource, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-muted p-2 rounded overflow-auto max-h-64">
              <pre className="text-[10px] font-mono">
                {JSON.stringify(metadata, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
