import { PetProvider } from '../contracts';
import { PetTypeData } from '../../types/data';
import { PetProfile } from '../../types/pet';
import rawPetTypes from '../../data/pet-types.json';
import rawCustomer from '../../data/customer.json';

let memoryPets = [...(rawCustomer.pets as PetProfile[])];

export class JsonPetProvider implements PetProvider {
  async getPetTypes(): Promise<PetTypeData[]> {
    return [...(rawPetTypes as PetTypeData[])];
  }

  async getAll(): Promise<PetProfile[]> {
    return [...memoryPets];
  }

  async getCustomerPets(customerId: string): Promise<PetProfile[]> {
    return memoryPets.filter((p) => p.customerId === customerId);
  }

  async getById(id: string): Promise<PetProfile | null> {
    const item = memoryPets.find((p) => p.id === id);
    return item ? { ...item } : null;
  }

  async savePet(petData: Partial<PetProfile>): Promise<PetProfile> {
    if (petData.id) {
      const idx = memoryPets.findIndex((p) => p.id === petData.id);
      if (idx !== -1) {
        memoryPets[idx] = { ...memoryPets[idx], ...petData } as PetProfile;
        return { ...memoryPets[idx] };
      }
    }

    const newPet: PetProfile = {
      id: `pet-${Date.now()}`,
      customerId: petData.customerId || 'cust-eleanor-vance',
      name: petData.name || 'New Companion',
      species: petData.species || 'dog',
      breed: petData.breed || 'Mixed Breed',
      ageYears: petData.ageYears || 1,
      ageMonths: petData.ageMonths || 0,
      weightLbs: petData.weightLbs || 25,
      activityLevel: petData.activityLevel || 'moderate',
      dietaryRestrictions: petData.dietaryRestrictions || [],
      primaryFoodProductId: petData.primaryFoodProductId,
      calculatedBagCadenceWeeks: petData.calculatedBagCadenceWeeks || 4,
      notes: petData.notes,
    };

    memoryPets.push(newPet);
    return { ...newPet };
  }

  async deletePet(id: string): Promise<boolean> {
    const prevLen = memoryPets.length;
    memoryPets = memoryPets.filter((p) => p.id !== id);
    return memoryPets.length < prevLen;
  }
}

export const jsonPetProvider = new JsonPetProvider();
