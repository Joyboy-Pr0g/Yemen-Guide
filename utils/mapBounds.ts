export interface MapBounds {
  lat_min: number
  lat_max: number
  lng_min: number
  lng_max: number
}

export const YEMEN_MAP_CENTER: [number, number] = [15.5, 48.5]
export const YEMEN_DEFAULT_ZOOM = 6

export function boundsToParams(bounds: MapBounds): Record<string, string> {
  return {
    lat_min: bounds.lat_min.toFixed(6),
    lat_max: bounds.lat_max.toFixed(6),
    lng_min: bounds.lng_min.toFixed(6),
    lng_max: bounds.lng_max.toFixed(6),
  }
}

export function boundsFromLeaflet(
  southWest: { lat: number; lng: number },
  northEast: { lat: number; lng: number },
): MapBounds {
  return {
    lat_min: southWest.lat,
    lat_max: northEast.lat,
    lng_min: southWest.lng,
    lng_max: northEast.lng,
  }
}

export function boundsEqual(a: MapBounds | null, b: MapBounds | null, epsilon = 0.0001): boolean {
  if (!a || !b) return false
  return (
    Math.abs(a.lat_min - b.lat_min) < epsilon
    && Math.abs(a.lat_max - b.lat_max) < epsilon
    && Math.abs(a.lng_min - b.lng_min) < epsilon
    && Math.abs(a.lng_max - b.lng_max) < epsilon
  )
}
