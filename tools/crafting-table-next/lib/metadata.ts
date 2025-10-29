// Metadata utilities for encoding comprehensive provenance data in exported assets
// This enables future programmatic access and novel interfaces

import type { TidalData, ShipData, DataSource } from './canvas-utils'
import type { ContentType } from './config'

export interface AssetMetadata {
  id: string
  app: string
  version: string
  timestamp: string
  creator: string
  license: string
  taxonomy?: {
    contentType: ContentType
    tags: string[]
  }
  parameters: Record<string, any>
  dataSource?: TidalDataSnapshot | ShipDataSnapshot
}

export interface TidalDataSnapshot {
  type: 'tidal'
  station: string
  stationId?: string
  level: number
  unit: string
  coordinates?: {
    lat: number
    long: number
  }
  timestamp: string
}

export interface ShipDataSnapshot {
  type: 'ships'
  total: number
  arrivals: number
  departures: number
  flow: number
  timestamp: string
}

/**
 * Generates a unique ID for an asset
 * Format: ff-{timestamp}-{random}
 */
export function generateAssetId(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  return `ff-${timestamp}-${random}`
}

/**
 * Creates comprehensive metadata for an exported asset
 */
export function createAssetMetadata(
  app: string,
  parameters: Record<string, any>,
  dataSource?: DataSource,
  taxonomy?: { contentType: ContentType; tags: string[] }
): AssetMetadata {
  const metadata: AssetMetadata = {
    id: generateAssetId(),
    app,
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    creator: 'Crafting Table',
    license: 'CC BY-SA 4.0',
    parameters,
  }

  if (taxonomy) {
    metadata.taxonomy = taxonomy
  }

  if (dataSource) {
    if (dataSource.type === 'tidal') {
      metadata.dataSource = {
        type: 'tidal',
        station: dataSource.station,
        stationId: (dataSource as any).stationId,
        level: dataSource.level,
        unit: dataSource.unit,
        coordinates: (dataSource as any).coordinates,
        timestamp: dataSource.time.toISOString(),
      }
    } else if (dataSource.type === 'ships') {
      metadata.dataSource = {
        type: 'ships',
        total: dataSource.total,
        arrivals: dataSource.arrivals,
        departures: dataSource.departures,
        flow: dataSource.flow,
        timestamp: dataSource.time.toISOString(),
      }
    }
  }

  return metadata
}

/**
 * Embeds metadata into an SVG element
 * Creates a standards-compliant SVG <metadata> element
 */
export function embedSVGMetadata(
  svgElement: SVGSVGElement,
  metadata: AssetMetadata
): SVGSVGElement {
  const svg = svgElement.cloneNode(true) as SVGSVGElement

  // Create metadata element
  const metadataElement = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'metadata'
  )

  // Add namespace for RDF (optional but standards-compliant)
  metadataElement.setAttribute('xmlns:dc', 'http://purl.org/dc/elements/1.1/')
  metadataElement.setAttribute('xmlns:cc', 'http://creativecommons.org/ns#')
  metadataElement.setAttribute('xmlns:rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')

  // Create a text node with JSON data
  const jsonData = document.createTextNode(
    '\n' + JSON.stringify(metadata, null, 2) + '\n'
  )
  metadataElement.appendChild(jsonData)

  // Insert as first child (after any existing metadata)
  const existingMetadata = svg.querySelector('metadata')
  if (existingMetadata) {
    svg.replaceChild(metadataElement, existingMetadata)
  } else {
    svg.insertBefore(metadataElement, svg.firstChild)
  }

  return svg
}

/**
 * Extracts metadata from an SVG string
 * Useful for reading back metadata from exported files
 */
export function extractSVGMetadata(svgString: string): AssetMetadata | null {
  try {
    const metadataMatch = svgString.match(/<metadata[^>]*>([\s\S]*?)<\/metadata>/)
    if (!metadataMatch) return null

    const metadataContent = metadataMatch[1].trim()
    // Try to parse as JSON
    const jsonMatch = metadataContent.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null

    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Failed to extract SVG metadata:', error)
    return null
  }
}

/**
 * Creates a companion JSON file for PNG exports
 * Downloads both the PNG and its metadata JSON
 */
export function createCompanionJSON(
  metadata: AssetMetadata,
  pngFilename: string
): void {
  const jsonFilename = pngFilename.replace(/\.png$/, '.json')
  const jsonContent = JSON.stringify(metadata, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = jsonFilename
  link.click()

  URL.revokeObjectURL(url)
}

/**
 * Reads metadata from a companion JSON file
 * Useful for future interfaces that need to access the provenance data
 */
export async function readCompanionJSON(jsonFile: File): Promise<AssetMetadata | null> {
  try {
    const text = await jsonFile.text()
    return JSON.parse(text) as AssetMetadata
  } catch (error) {
    console.error('Failed to read companion JSON:', error)
    return null
  }
}
