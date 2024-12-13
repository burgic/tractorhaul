// src/components/client/ServiceSearch.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../services/supabaseClient';
import { geocodePostcode } from '../../lib/geocoding';
import { SearchFilters, SearchResult, ServiceType } from '../../types';

interface ServiceSearchProps {
  type: ServiceType;
}

export const ServiceSearch: React.FC<ServiceSearchProps> = ({ type }) => {
  const [filters, setFilters] = useState<Partial<SearchFilters>>({
    type,
    maxDistance: 50
  });
  const [isSearching, setIsSearching] = useState(false);

  // Fetch countries
  const { data: countries } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('country_codes')
        .select('country_name, country_code');
      if (error) throw error;
      return data;
    },
  });

  // Fetch specialties based on type
  const { data: specialties } = useQuery({
    queryKey: ['specialties', type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(type === 'inspector' ? 'tractor_brands' : 'cargo_types')
        .select('id, name');
      if (error) throw error;
      return data;
    },
  });

  // Search results query
  const { data: results, isLoading } = useQuery({
    queryKey: ['search', filters],
    queryFn: async () => {
      if (!isSearching || !filters.postcode || !filters.country) return null;

      const geocodeResult = await geocodePostcode(filters.postcode, filters.country);

      const { data, error } = await supabase.rpc('search_providers', {
        p_type: type,
        p_latitude: geocodeResult.coordinates.latitude,
        p_longitude: geocodeResult.coordinates.longitude,
        p_radius: filters.maxDistance,
        p_specialties: filters.brands || filters.cargoTypes
      });

      if (error) throw error;
      return data as SearchResult[];
    },
    enabled: isSearching,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filters.postcode && filters.country) {
      setIsSearching(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Search Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Postcode</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Enter postcode"
                value={filters.postcode || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, postcode: e.target.value }))}
              />
            </div>

            <div>
              <label className="block mb-1">Country</label>
              <select
                className="w-full p-2 border rounded"
                value={filters.country || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
              >
                <option value="">Select country</option>
                {countries?.map((country) => (
                  <option key={country.country_code} value={country.country_code}>
                    {country.country_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1">Search Radius (km): {filters.maxDistance}km</label>
            <input
              type="range"
              min="10"
              max="200"
              value={filters.maxDistance || 50}
              onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: Number(e.target.value) }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1">{type === 'inspector' ? 'Brands' : 'Cargo Types'}</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {specialties?.map((specialty) => (
                <label key={specialty.id} className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    value={specialty.id}
                    onChange={(e) => {
                      const specialtyKey = type === 'inspector' ? 'brands' : 'cargoTypes';
                      const currentSpecialties = filters[specialtyKey] || [];
                      setFilters(prev => ({
                        ...prev,
                        [specialtyKey]: e.target.checked
                          ? [...currentSpecialties, specialty.id]
                          : currentSpecialties.filter(id => id !== specialty.id)
                      }));
                    }}
                  />
                  {specialty.name}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
            disabled={!filters.postcode || !filters.country || isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="text-center">Loading results...</div>
      ) : results?.length ? (
        <div className="space-y-4">
          {results.map((result) => (
            <SearchResultCard key={result.id} result={result} type={type} />
          ))}
        </div>
      ) : isSearching ? (
        <div className="text-center">No results found</div>
      ) : null}
    </div>
  );
};

interface SearchResultCardProps {
  result: SearchResult;
  type: ServiceType;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ result, type }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <div className="flex justify-between">
      <div>
        <h3 className="text-lg font-medium">{result.name}</h3>
        <div className="text-sm text-gray-600 mt-1">
          {result.distance.toFixed(1)} km away
        </div>
        {result.rating && (
          <div className="mt-1">
            Rating: {result.rating.toFixed(1)} ⭐
          </div>
        )}
      </div>
      
      <div className="text-right text-sm">
        {result.contact_phone && (
          <div className="mb-1">
            📞 {result.contact_phone}
          </div>
        )}
        {result.contact_email && (
          <div>
            ✉️ {result.contact_email}
          </div>
        )}
      </div>
    </div>

    {result.price_range && (
      <div className="mt-2 text-sm">
        <strong>Price Range:</strong> {result.price_range}
      </div>
    )}

    {type === 'inspector' && result.brands && (
      <div className="mt-2 text-sm">
        <strong>Brands:</strong> {result.brands.map(b => b.name).join(', ')}
      </div>
    )}

    {type === 'haulier' && result.cargo_types && (
      <div className="mt-2 text-sm">
        <strong>Cargo Types:</strong> {result.cargo_types.map(c => c.name).join(', ')}
      </div>
    )}
  </div>
);