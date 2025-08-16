export interface CarListing {
  id: string;
  title: string;
  price: number;
  year: number;
  make: string;
  model: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  exteriorColor: string;
  interiorColor: string;
  bodyType: string;
  description: string;
  features: string[];
  images: string[];
  location: string;
  sellerId: string;
  sellerName: string;
  sellerType: 'private' | 'dealer';
  createdAt: string;
  updatedAt: string;
}

export type CarBodyType = 
  | 'sedan' 
  | 'suv' 
  | 'truck' 
  | 'coupe' 
  | 'convertible' 
  | 'wagon' 
  | 'hatchback' 
  | 'van' 
  | 'minivan';

export type FuelType = 
  | 'gasoline' 
  | 'diesel' 
  | 'electric' 
  | 'hybrid' 
  | 'plugin_hybrid' 
  | 'natural_gas' 
  | 'other';

export type TransmissionType = 
  | 'automatic' 
  | 'manual' 
  | 'semi-automatic' 
  | 'cvt';

export interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  make?: string;
  model?: string;
  maxMileage?: number;
  bodyType?: CarBodyType[];
  fuelType?: FuelType[];
  transmission?: TransmissionType[];
  sellerType?: 'private' | 'dealer' | 'both';
  keyword?: string;
  location?: string;
  radius?: number;
}