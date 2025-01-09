// src/pages/client/SearchProviders.tsx
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../services/supabaseClient';

interface SearchFilters {
  type: 'inspector' | 'haulier';
  postcode: string;
  maxDistance: number;
  brands?: string[];
  cargoTypes?: string[];
}

const SearchProviders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>({
    type: (searchParams.get('type') as 'inspector' | 'haulier') || 'inspector',
    postcode: '',
    maxDistance: 50
  });

  // Fetch specialties based on type
  const { data: specialties } = useQuery({
    queryKey: ['specialties', filters.type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(filters.type === 'inspector' ? 'tractor_brands' : 'cargo_types')
        .select('id, name');
      if (error) throw error;
      return data;
    }
  });

  // Fetch providers
  const { data: providers, isLoading } = useQuery({
    queryKey: ['providers', filters],
    queryFn: async () => {
      if (!filters.postcode) return [];

      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('type', filters.type)
        .eq('active', true);

      if (error) throw error;
      return data;
    },
    enabled: !!filters.postcode
  });

  const handleTypeChange = (type: 'inspector' | 'haulier') => {
    setFilters({ ...filters, type });
    setSearchParams({ type });
  };

  const handleSpecialtyChange = (specialtyId: string) => {
    const key = filters.type === 'inspector' ? 'brands' : 'cargoTypes';
    const current = filters[key] || [];
    setFilters({
      ...filters,
      [key]: current.includes(specialtyId)
        ? current.filter(id => id !== specialtyId)
        : [...current, specialtyId]
    });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>
        Find {filters.type === 'inspector' ? 'Tractor Inspectors' : 'Hauliers'}
      </h1>

      {/* Search Filters */}
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px' 
      }}>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Type:</label>
            <select 
              value={filters.type}
              onChange={(e) => handleTypeChange(e.target.value as 'inspector' | 'haulier')}
              style={{ padding: '8px', borderRadius: '4px' }}
            >
              <option value="inspector">Inspector</option>
              <option value="haulier">Haulier</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Postcode:</label>
            <input
              type="text"
              value={filters.postcode}
              onChange={(e) => setFilters({ ...filters, postcode: e.target.value })}
              placeholder="Enter postcode"
              style={{ padding: '8px', borderRadius: '4px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Max Distance: {filters.maxDistance}km
            </label>
            <input
              type="range"
              min="10"
              max="200"
              value={filters.maxDistance}
              onChange={(e) => setFilters({ ...filters, maxDistance: Number(e.target.value) })}
              style={{ width: '200px' }}
            />
          </div>
        </div>

        {specialties && specialties.length > 0 && (
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              {filters.type === 'inspector' ? 'Brands:' : 'Cargo Types:'}
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {specialties.map((specialty) => (
                <label key={specialty.id} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="checkbox"
                    checked={filters[filters.type === 'inspector' ? 'brands' : 'cargoTypes']?.includes(specialty.id)}
                    onChange={() => handleSpecialtyChange(specialty.id)}
                  />
                  {specialty.name}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
      ) : providers && providers.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {providers.map((provider) => (
            <div 
              key={provider.id} 
              style={{ 
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: 'white'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0' }}>{provider.name}</h3>
                  {provider.distance && (
                    <p style={{ margin: '0', color: '#666' }}>
                      {provider.distance.toFixed(1)} km away
                    </p>
                  )}
                  {provider.rating && (
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      Rating: {provider.rating.toFixed(1)} ⭐
                    </p>
                  )}
                </div>
                <button 
                  style={{ 
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          {filters.postcode ? 'No providers found' : 'Enter a postcode to search'}
        </div>
      )}
    </div>
  );
};

export default SearchProviders;