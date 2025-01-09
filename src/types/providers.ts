
// src/types/providers.ts

export type ServiceType = 'inspector' | 'haulier';

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
    brands?: { id: string; name: string }[]; // Ensure brands is defined
    cargo_types?: { id: string; name: string }[]; // Add this line
  }

export interface TractorBrand {
  id: string;
  name: string;
}

export interface CargoType {
  id: string;
  name: string;
}

export interface ProviderFormData {
    name: string;
    type: ServiceType;
    contact_email: string;
    contact_phone?: string;
    address: string;
    postcode: string;
    country: string;
    price_range?: string | null;
    notes?: string | null;
    brands?: string[];
    cargo_types?: string[];
  }
  
  export interface Country {
    country_code: string;
    country_name: string;
  }
  
  export interface GeocodeResult {
    latitude: number;
    longitude: number;
  }

export interface Inspector extends Provider {
  type: 'inspector';
  brands: TractorBrand[];
}

export interface Haulier extends Provider {
  type: 'haulier';
  cargo_types: CargoType[];
}