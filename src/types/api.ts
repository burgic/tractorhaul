// src/types/api.ts
import type { Provider } from './providers';

export interface GeocodeResponse {
    latitude: number;
    longitude: number;
    formatted_address: string;
}

export interface SearchProvidersResponse {
  providers: Provider[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Coordinates {
    latitude: number;
    longitude: number;
  }
  
  export interface GeocodeResult {
    latitude: number;
    longitude: number;
    formatted_address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  }