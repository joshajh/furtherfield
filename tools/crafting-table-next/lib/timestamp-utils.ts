// Timestamp extraction utilities for Tide Table tool

import exifr from 'exifr'
import { readCompanionJSON } from './metadata'

export type TimestampSource = 'exif' | 'json' | 'file' | 'manual'

export interface ExtractedTimestamp {
  timestamp: Date
  source: TimestampSource
  confidence: 'high' | 'medium' | 'low'
  originalFilename?: string
}

/**
 * Extract timestamp from an image file using EXIF data
 */
export async function extractTimestampFromImage(file: File): Promise<ExtractedTimestamp | null> {
  try {
    const exifData = await exifr.parse(file, {
      pick: ['DateTimeOriginal', 'CreateDate', 'ModifyDate'],
    })

    if (exifData) {
      // Prefer DateTimeOriginal (when photo was taken)
      if (exifData.DateTimeOriginal) {
        return {
          timestamp: new Date(exifData.DateTimeOriginal),
          source: 'exif',
          confidence: 'high',
          originalFilename: file.name,
        }
      }

      // Fallback to CreateDate
      if (exifData.CreateDate) {
        return {
          timestamp: new Date(exifData.CreateDate),
          source: 'exif',
          confidence: 'medium',
          originalFilename: file.name,
        }
      }

      // Fallback to ModifyDate
      if (exifData.ModifyDate) {
        return {
          timestamp: new Date(exifData.ModifyDate),
          source: 'exif',
          confidence: 'low',
          originalFilename: file.name,
        }
      }
    }
  } catch (error) {
    console.log('Failed to extract EXIF data:', error)
  }

  return null
}

/**
 * Extract timestamp from a Crafting Table companion JSON file
 */
export async function extractTimestampFromJSON(file: File): Promise<ExtractedTimestamp | null> {
  try {
    const metadata = await readCompanionJSON(file)

    if (metadata && metadata.timestamp) {
      return {
        timestamp: new Date(metadata.timestamp),
        source: 'json',
        confidence: 'high',
        originalFilename: file.name,
      }
    }
  } catch (error) {
    console.log('Failed to parse JSON metadata:', error)
  }

  return null
}

/**
 * Extract timestamp from file's last modified date
 */
export function extractTimestampFromFile(file: File): ExtractedTimestamp {
  return {
    timestamp: new Date(file.lastModified),
    source: 'file',
    confidence: 'low',
    originalFilename: file.name,
  }
}

/**
 * Main function to extract timestamp from any file type
 * Tries multiple methods in order of reliability
 */
export async function extractTimestamp(file: File): Promise<ExtractedTimestamp> {
  const fileType = file.type.toLowerCase()
  const fileName = file.name.toLowerCase()

  // Try JSON metadata first if it's a .json file
  if (fileName.endsWith('.json') || fileType.includes('json')) {
    const jsonResult = await extractTimestampFromJSON(file)
    if (jsonResult) return jsonResult
  }

  // Try EXIF for image files
  if (fileType.startsWith('image/')) {
    const exifResult = await extractTimestampFromImage(file)
    if (exifResult) return exifResult
  }

  // Fallback to file modification time
  return extractTimestampFromFile(file)
}

/**
 * Parse a manual timestamp string
 */
export function parseManualTimestamp(dateString: string): Date | null {
  try {
    const parsed = new Date(dateString)
    if (!isNaN(parsed.getTime())) {
      return parsed
    }
  } catch (error) {
    console.log('Failed to parse date string:', error)
  }
  return null
}
