// src/types/api.ts
import { Coordinates } from './common';

export interface GeocodeResponse {
  coordinates: Coordinates;
  formatted_address: string;
}

export interface SearchProvidersResponse {
  providers: SearchResult[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Coordinates {
    latitude: number;
    longitude: number;
  }
  
  export interface GeocodeResult {
    coordinates: Coordinates;
    formatted_address: string;
  }