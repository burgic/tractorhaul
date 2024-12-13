// src/lib/distance.ts

// Types for location data
export interface Coordinates {
    latitude: number;
    longitude: number;
  }
  
  export interface LocationData {
    id: string;
    coordinates: Coordinates;
    [key: string]: any;
  }
  
  // Earth's radius in kilometers
  const EARTH_RADIUS_KM = 6371;
  
  /**
   * Calculate distance between two points using the Haversine formula
   */
  export function calculateDistance(
    point1: Coordinates,
    point2: Coordinates
  ): number {
    const toRad = (x: number): number => (x * Math.PI) / 180;
  
    const dLat = toRad(point2.latitude - point1.latitude);
    const dLon = toRad(point2.longitude - point1.longitude);
  
    const lat1 = toRad(point1.latitude);
    const lat2 = toRad(point2.latitude);
  
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return EARTH_RADIUS_KM * c;
  }
  
  /**
   * Sort locations by distance from a given point
   */
  export function sortByDistance(
    origin: Coordinates,
    locations: LocationData[]
  ): LocationData[] {
    return [...locations].sort((a, b) => {
      const distanceA = calculateDistance(origin, a.coordinates);
      const distanceB = calculateDistance(origin, b.coordinates);
      return distanceA - distanceB;
    });
  }
  
  /**
   * Filter locations within a given radius
   */
  export function filterByRadius(
    origin: Coordinates,
    locations: LocationData[],
    radiusKm: number
  ): LocationData[] {
    return locations.filter(location => {
      const distance = calculateDistance(origin, location.coordinates);
      return distance <= radiusKm;
    });
  }
  
  /**
   * Format distance for display
   */
  export function formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}m`;
    }
    return `${distanceKm.toFixed(1)}km`;
  }