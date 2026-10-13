'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PetProfile } from '../types/pet';
import { petService } from '../services/petService';

const PETS_STORAGE_KEY = 'rowan_hound_pet_profiles_v1';

interface PetProfileContextType {
  pets: PetProfile[];
  selectedPetId: string; // 'all' or specific pet id
  selectedPet: PetProfile | null;
  selectPet: (petId: string) => void;
  addPet: (petData: Omit<PetProfile, 'id' | 'customerId'>) => PetProfile;
  updatePet: (id: string, updates: Partial<PetProfile>) => void;
  deletePet: (id: string) => void;
  toggleFavoriteProduct: (petId: string, productId: string) => void;
  isFavoriteProduct: (petId: string, productId: string) => boolean;
  isLoading: boolean;
}

const PetProfileContext = createContext<PetProfileContextType | null>(null);

export function PetProfileProvider({ children }: { children: React.ReactNode }) {
  const [pets, setPets] = useState<PetProfile[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize pets from localStorage or JSON template
  useEffect(() => {
    async function loadPets() {
      try {
        if (typeof window !== 'undefined') {
          const stored = window.localStorage.getItem(PETS_STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setPets(parsed);
              setIsLoading(false);
              return;
            }
          }
        }

        // Fallback to initial customer pets
        const loaded = await petService.getByCustomerId('cust-eleanor-vance');
        const enriched: PetProfile[] = loaded.map((pet) => {
          if (pet.name.toLowerCase().includes('barnaby')) {
            return {
              ...pet,
              size: 'large',
              dietPreferences: ['Poultry-Free', 'High-Protein', 'Ancient Spelt'],
              favoriteProductIds: [
                'prod-venison-ancient-grains',
                'prod-beef-liver-bites',
                'prod-salmon-skin-chews',
              ],
            };
          }
          if (pet.name.toLowerCase().includes('milo')) {
            return {
              ...pet,
              size: 'medium',
              dietPreferences: ['Grain-Free', 'Seafood Lover', 'Sensitive Digestion'],
              favoriteProductIds: ['prod-cat-whitefish-kelp', 'prod-wild-salmon-oil'],
            };
          }
          return {
            ...pet,
            size: pet.weightLbs && pet.weightLbs > 50 ? 'large' : 'medium',
            dietPreferences: pet.dietaryRestrictions || [],
            favoriteProductIds: [],
          };
        });

        setPets(enriched);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(PETS_STORAGE_KEY, JSON.stringify(enriched));
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadPets();
  }, []);

  // Save changes to localStorage
  const persistPets = useCallback((updatedPets: PetProfile[]) => {
    setPets(updatedPets);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(PETS_STORAGE_KEY, JSON.stringify(updatedPets));
      } catch {
        // Storage fail-safe
      }
    }
  }, []);

  const addPet = useCallback(
    (petData: Omit<PetProfile, 'id' | 'customerId'>): PetProfile => {
      const newPet: PetProfile = {
        ...petData,
        id: `pet-custom-${Date.now()}`,
        customerId: 'cust-eleanor-vance',
        favoriteProductIds: petData.favoriteProductIds || [],
        dietaryRestrictions: petData.dietaryRestrictions || [],
        dietPreferences: petData.dietPreferences || [],
      };

      const updated = [...pets, newPet];
      persistPets(updated);
      setSelectedPetId(newPet.id);
      return newPet;
    },
    [pets, persistPets]
  );

  const updatePet = useCallback(
    (id: string, updates: Partial<PetProfile>) => {
      const updated = pets.map((p) => (p.id === id ? { ...p, ...updates } : p));
      persistPets(updated);
    },
    [pets, persistPets]
  );

  const deletePet = useCallback(
    (id: string) => {
      const updated = pets.filter((p) => p.id !== id);
      persistPets(updated);
      if (selectedPetId === id) {
        setSelectedPetId('all');
      }
    },
    [pets, selectedPetId, persistPets]
  );

  const toggleFavoriteProduct = useCallback(
    (petId: string, productId: string) => {
      const updated = pets.map((p) => {
        if (p.id !== petId) return p;
        const currentFavorites = p.favoriteProductIds || [];
        const isFav = currentFavorites.includes(productId);
        const newFavorites = isFav
          ? currentFavorites.filter((id) => id !== productId)
          : [...currentFavorites, productId];
        return {
          ...p,
          favoriteProductIds: newFavorites,
        };
      });
      persistPets(updated);
    },
    [pets, persistPets]
  );

  const isFavoriteProduct = useCallback(
    (petId: string, productId: string) => {
      const found = pets.find((p) => p.id === petId);
      return Boolean(found?.favoriteProductIds?.includes(productId));
    },
    [pets]
  );

  const selectedPet = pets.find((p) => p.id === selectedPetId) || null;

  return (
    <PetProfileContext.Provider
      value={{
        pets,
        selectedPetId,
        selectedPet,
        selectPet: setSelectedPetId,
        addPet,
        updatePet,
        deletePet,
        toggleFavoriteProduct,
        isFavoriteProduct,
        isLoading,
      }}
    >
      {children}
    </PetProfileContext.Provider>
  );
}

export function usePetProfile() {
  const context = useContext(PetProfileContext);
  if (!context) {
    throw new Error('usePetProfile must be used within a PetProfileProvider');
  }
  return context;
}
