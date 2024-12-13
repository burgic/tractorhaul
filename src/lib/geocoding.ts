// src/lib/geocoding.ts
import { GeocodeResult } from '../types';

const GEOCODING_API_KEY = import.meta.env.VITE_GEOCODING_API_KEY;

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formatted_address: string;
}

export async function geocodePostcode(
  postcode: string,
  country: string
): Promise<GeocodeResult> {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        `${postcode}, ${country}`
      )}&key=${GEOCODING_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Geocoding failed');
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error('No results found for this address');
    }

    const result = data.results[0];
    return {
        coordinates: {
            latitude: result.geometry.lat,
            longitude: result.geometry.lng
          },
      formatted_address: result.formatted,
    };
  } catch (error: any) {
    throw new Error(`Geocoding error: ${error.message}`);
  }
}