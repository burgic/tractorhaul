
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

export interface SearchResult extends Provider {
  distance: number;
  brands?: TractorBrand[];
  cargo_types?: CargoType[];
}