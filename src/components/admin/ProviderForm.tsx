// src/components/admin/ProviderForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '../../services/supabaseClient';
import { geocodePostcode } from '../../lib/geocoding';
import { Provider, ServiceType } from '../../types';

// Form validation schema
const providerFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  type: z.enum(['inspector', 'haulier']),
  contact_email: z.string().email('Invalid email address'),
  contact_phone: z.string().optional(),
  address: z.string().min(5, 'Address is required'),
  postcode: z.string().min(1, 'Postcode is required'),
  country: z.string().min(1, 'Country is required'),
  price_range: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  brands: z.array(z.string()).optional(),
  cargo_types: z.array(z.string()).optional(),
});

type ProviderFormData = z.infer<typeof providerFormSchema>;

interface ProviderFormProps {
  initialData?: Provider;
  type: ServiceType;
  onSuccess: () => void;
}

export const ProviderForm: React.FC<ProviderFormProps> = ({
  initialData,
  type,
  onSuccess,
}) => {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const isEditing = !!initialData;

  const defaultValues: ProviderFormData = {
    type,
    name: initialData?.name ?? '',
    contact_email: initialData?.contact_email ?? null,
    contact_phone: initialData?.contact_phone ?? null,
    address: initialData?.address ?? '',
    postcode: initialData?.postcode ?? '',
    country: initialData?.country ?? '',
    price_range: initialData?.price_range ?? null,
    notes: initialData?.notes ?? null,
    brands: initialData?.brands?.map(b => b.id) ?? [],
    cargo_types: initialData?.cargo_types?.map(c => c.id) ?? [],
  }:
  

  const { register, handleSubmit, formState: { errors }, setValue, watch } = 
  useForm<ProviderFormData>({
    resolver: zodResolver(providerFormSchema),
    defaultValues: initialData ? {
      type,
      name: initialData.name ?? '',
      contact_email: initialData.contact_email ?? '',
      contact_phone: initialData.contact_phone ?? '',
      address: initialData.address ?? '',
      postcode: initialData.postcode ?? '',
      country: initialData.country ?? '',
      price_range: initialData.price_range ?? '',
      notes: initialData.notes ?? '',
      brands: initialData.brands ?? [],
      cargo_types: initialData.cargo_types ?? [],
    } : {
      type,
      name: '',
      contact_email: '',
      contact_phone: '',
      address: '',
      postcode: '',
      country: '',
      price_range: '',
      notes: '',
      brands: [],
      cargo_types: [],
    },
  });

  // Fetch countries for dropdown
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

  // Fetch brands or cargo types based on provider type
  const { data: specialties } = useQuery({
    queryKey: [type === 'inspector' ? 'brands' : 'cargo_types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(type === 'inspector' ? 'tractor_brands' : 'cargo_types')
        .select('id, name');
      if (error) throw error;
      return data;
    },
  });

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: async (data: ProviderFormData) => {
      try {
        // Geocode the postcode
        const coords = await geocodePostcode(data.postcode, data.country);
        
        const providerData = {
          ...data,
          coordinates: `POINT(${coords.longitude} ${coords.latitude})`,
          updated_at: new Date().toISOString(),
        };

        if (isEditing && initialData) {
          const { error } = await supabase
            .from('providers')
            .update(providerData)
            .eq('id', initialData.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('providers')
            .insert([providerData]);
          if (error) throw error;
        }
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      onSuccess();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const onSubmit = async (data: ProviderFormData) => {
    setError(null);
    mutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl mb-4">{isEditing ? 'Edit' : 'Create'} {type}</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            {...register('name')}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            {...register('contact_email')}
          />
          {errors.contact_email && (
            <span className="text-red-500 text-sm">{errors.contact_email.message}</span>
          )}
        </div>

        <div>
          <label className="block mb-1">Phone</label>
          <input
            type="tel"
            className="w-full p-2 border rounded"
            {...register('contact_phone')}
          />
        </div>

        <div>
          <label className="block mb-1">Address</label>
          <textarea
            className="w-full p-2 border rounded"
            {...register('address')}
          />
          {errors.address && (
            <span className="text-red-500 text-sm">{errors.address.message}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Postcode</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              {...register('postcode')}
            />
            {errors.postcode && (
              <span className="text-red-500 text-sm">{errors.postcode.message}</span>
            )}
          </div>

          <div>
            <label className="block mb-1">Country</label>
            <select
              className="w-full p-2 border rounded"
              {...register('country')}
            >
              <option value="">Select country</option>
              {countries?.map((country) => (
                <option key={country.country_code} value={country.country_code}>
                  {country.country_name}
                </option>
              ))}
            </select>
            {errors.country && (
              <span className="text-red-500 text-sm">{errors.country.message}</span>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-1">Price Range</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="e.g. £50-100 per hour"
            {...register('price_range')}
          />
        </div>

        <div>
          <label className="block mb-1">{type === 'inspector' ? 'Brands' : 'Cargo Types'}</label>
          <div className="grid grid-cols-3 gap-2">
            {specialties?.map((specialty) => (
              <label key={specialty.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={specialty.id}
                  {...register(type === 'inspector' ? 'brands' : 'cargo_types')}
                />
                <span>{specialty.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-1">Notes</label>
          <textarea
            className="w-full p-2 border rounded"
            {...register('notes')}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => onSuccess()}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
          >
            {mutation.isPending ? 'Saving...' : isEditing ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};