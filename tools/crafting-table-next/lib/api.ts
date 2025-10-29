// API utilities for fetching real-world data

import type { TidalData, ShipData } from './canvas-utils'

export async function fetchTidalData(): Promise<TidalData> {
  try {
    // Find nearest tidal station to Felixstowe
    const stationUrl = `https://environment.data.gov.uk/flood-monitoring/id/stations?type=TideGauge&lat=52.06&long=1.35&dist=50`
    const stationResp = await fetch(stationUrl)
    const stationData = await stationResp.json()

    if (stationData.items && stationData.items.length > 0) {
      // Prefer Harwich (E71439) as it's closest to Felixstowe (~12km vs Lowestoft ~50km)
      let station = stationData.items.find((s: any) => s.stationReference === 'E71439')
      // Fallback to first available if Harwich not found
      if (!station) {
        station = stationData.items[0]
      }
      const stationId = station.stationReference || station.notation

      // Get latest reading
      const readingUrl = `https://environment.data.gov.uk/flood-monitoring/id/stations/${stationId}/readings?latest`
      const readingResp = await fetch(readingUrl)
      const readingData = await readingResp.json()

      if (readingData.items && readingData.items.length > 0) {
        const reading = readingData.items[0]
        return {
          type: 'tidal',
          level: reading.value,
          unit: reading.unitName || 'mAOD',
          station: station.label,
          time: new Date(reading.dateTime),
          // Store additional metadata for future use
          stationId: stationId,
          coordinates: station.lat && station.long ? {
            lat: station.lat,
            long: station.long
          } : undefined,
        } as TidalData
      }
    }
  } catch (error) {
    console.log('Could not fetch tidal data, using simulated:', error)
  }

  // Fallback to simulated data
  return {
    type: 'tidal',
    level: Math.random() * 4 - 1,
    unit: 'mAOD',
    station: 'Simulated',
    time: new Date(),
  }
}

export async function fetchShipData(): Promise<ShipData> {
  // Simulated ship data
  // In production, this could integrate with AIS data or port APIs
  const ships = Math.floor(Math.random() * 15) + 5
  const arrivals = Math.floor(ships * 0.6)
  const departures = ships - arrivals

  return {
    type: 'ships',
    total: ships,
    arrivals,
    departures,
    flow: arrivals - departures,
    time: new Date(),
  }
}

/**
 * Fetch historical tidal data for a specific timestamp
 * Uses UK Environment Agency API with date range query
 */
export async function fetchHistoricalTidalData(timestamp: Date): Promise<TidalData> {
  try {
    // Use Harwich station (E71439) - closest to Felixstowe
    const stationId = 'E71439'

    // Create a time window around the target timestamp (±30 minutes)
    const startDate = new Date(timestamp.getTime() - 30 * 60 * 1000)
    const endDate = new Date(timestamp.getTime() + 30 * 60 * 1000)

    const startISO = startDate.toISOString()
    const endISO = endDate.toISOString()

    // Query historical readings
    const readingUrl = `https://environment.data.gov.uk/flood-monitoring/id/stations/${stationId}/readings?startdate=${startISO}&enddate=${endISO}`
    const readingResp = await fetch(readingUrl)
    const readingData = await readingResp.json()

    if (readingData.items && readingData.items.length > 0) {
      // Find the reading closest to our target timestamp
      let closestReading = readingData.items[0]
      let minDiff = Math.abs(new Date(closestReading.dateTime).getTime() - timestamp.getTime())

      for (const reading of readingData.items) {
        const diff = Math.abs(new Date(reading.dateTime).getTime() - timestamp.getTime())
        if (diff < minDiff) {
          minDiff = diff
          closestReading = reading
        }
      }

      return {
        type: 'tidal',
        level: closestReading.value,
        unit: closestReading.unitName || 'mAOD',
        station: 'Harwich',
        time: new Date(closestReading.dateTime),
        stationId: stationId,
        coordinates: {
          lat: 51.948,
          long: 1.292
        },
      } as TidalData
    }
  } catch (error) {
    console.log('Could not fetch historical tidal data, using simulation:', error)
  }

  // Fallback to simulated tidal data using harmonic approximation
  // This provides realistic tidal patterns when API data is unavailable
  return simulateTidalData(timestamp)
}

/**
 * Simulate tidal data for a given timestamp using harmonic approximation
 * Uses a simplified tidal model based on the time of day
 */
function simulateTidalData(timestamp: Date): TidalData {
  // Extract hour as decimal (e.g., 14:30 = 14.5)
  const hours = timestamp.getHours() + timestamp.getMinutes() / 60

  // Tidal cycle is approximately 12.4 hours (semidiurnal)
  // Use sine wave to approximate tidal height
  const tidalCycle = 12.4
  const tideLevel = 2 * Math.sin((hours / tidalCycle) * Math.PI * 2) + 1

  return {
    type: 'tidal',
    level: Number(tideLevel.toFixed(2)),
    unit: 'mAOD',
    station: 'Harwich (Simulated)',
    time: timestamp,
    stationId: 'E71439',
    coordinates: {
      lat: 51.948,
      long: 1.292
    },
  }
}
