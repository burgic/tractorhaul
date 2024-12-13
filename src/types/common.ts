// src/types/common.ts
export type UserRole = 'admin' | 'client';
export type ServiceType = 'inspector' | 'haulier';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Address {
  street: string;
  city: string;
  postcode: string;
  country: string;
}



