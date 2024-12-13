// src/types/database.ts

export type UserRole = 'admin' | 'client';

export type ServiceType = 'inspector' | 'haulier';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Provider {
  id: string;
  type: ServiceType;
  name: string;
  contact_email: string | null;
  contact_phone: string | null;
  address: string;
  postcode: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  rating: number | null;
  price_range: string | null;
  notes: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  distance?: number; // Added during search results
  cargo_types?: string[];
}

export interface TractorBrand {
  id: string;
  name: string;
}

export interface CargoType {
  id: string;
  name: string;
}

export interface Review {
  id: string;
  provider_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface SearchFilters {
  postcode: string;
  country: string;
  type: ServiceType;
  brands?: string[]; // For inspectors
  cargoTypes?: string[]; // For hauliers
  maxDistance?: number;
  minRating?: number;
}

export interface SearchResult extends Provider {
  distance: number;
  brands?: TractorBrand[]; // For inspectors
  cargoTypes?: CargoType[]; // For hauliers
  reviews: Review[];
}

