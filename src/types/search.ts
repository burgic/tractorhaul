
// src/types/search.ts
import { ServiceType } from './common';

export interface SearchFilters {
  postcode: string;
  country: string;
  type: ServiceType;
  brands?: string[];
  cargoTypes?: string[];
  maxDistance?: number;
  minRating?: number;
}

export interface SearchResult {
    id: string;
    name: string;
    type: ServiceType;
    contact_email: string | null;
    contact_phone: string | null;
    distance: number;
    rating?: number;
    price_range?: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    brands?: Array<{ id: string; name: string }>;
    cargo_types?: Array<{ id: string; name: string }>;
  }

  export interface SearchParams {
    postcode: string;
    country: string;
    type: ServiceType;
    radius?: number;
    specialties?: string[];
  }
  