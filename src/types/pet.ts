export type PetSpecies = 'dog' | 'cat' | 'small-pets' | 'bird' | 'fish';
export type PetSize = 'small' | 'medium' | 'large' | 'giant';

export interface PetProfile {
  id: string;
  customerId: string;
  name: string;
  species: PetSpecies;
  breed: string;
  ageYears: number;
  ageMonths?: number;
  size?: PetSize;
  weightLbs?: number;
  activityLevel?: 'low' | 'moderate' | 'high' | 'working';
  dietaryRestrictions: string[];
  dietPreferences?: string[];
  favoriteProductIds?: string[];
  primaryFoodProductId?: string;
  calculatedBagCadenceWeeks?: number;
  notes?: string;
}

