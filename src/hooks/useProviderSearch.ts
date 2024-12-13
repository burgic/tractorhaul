// src/hooks/useProviderSearch.ts
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../services/supabaseClient';
import { geocodePostcode } from '../lib/geocoding';
import type { Provider, ServiceType } from '../types/database';


interface UseProviderSearchResult {
  providers: Array<Provider & { distance: number }>;
  isLoading: boolean;
  error: Error | null;
  search: (params: SearchParams) => void;
}

export function useProviderSearch(): UseProviderSearchResult {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  const { data: providers = [], isLoading, error } = useQuery({
    queryKey: ['providers', searchParams],
    queryFn: async () => {
      if (!searchParams) return [];

      // First geocode the postcode
      const { latitude, longitude } = await geocodePostcode(
        searchParams.postcode,
        searchParams.country
      );

      // Query the database using PostGIS
      const { data, error } = await supabase.rpc(
        'find_providers_in_radius',
        {
          search_lat: latitude,
          search_lon: longitude,
          radius_km: searchParams.radius || 50,
          provider_type: searchParams.type
        }
      );

      if (error) throw error;

      // If specialties filter is provided, filter results
      let results = data;
      if (searchParams.specialties?.length) {
        results = await filterBySpecialties(data, searchParams.specialties);
      }

      return results;
    },
    enabled: !!searchParams
  });

  const search = (params: SearchParams) => {
    setSearchParams(params);
  };

  return {
    providers,
    isLoading,
    error: error as Error | null,
    search
  };
}

// Helper function to filter by specialties
async function filterBySpecialties(
  providers: Provider[],
  specialtyIds: string[]
): Promise<Provider[]> {
  const { data: relationships } = await supabase
    .from(providers[0]?.type === 'inspector' ? 'inspector_brands' : 'haulier_cargo_types')
    .select('provider_id, specialty_id')
    .in('specialty_id', specialtyIds);

  if (!relationships) return providers;

  const validProviderIds = new Set(relationships.map(r => r.provider_id));
  return providers.filter(p => validProviderIds.has(p.id));
}