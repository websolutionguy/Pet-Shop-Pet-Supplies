import { PetProvider } from '../providers/contracts';
import { ProviderFactory } from '../providers/factory';
import { jsonPetProvider } from '../providers/json/JsonPetProvider';
import { PetProfile } from '../types/pet';
import { PetTypeData } from '../types/data';
import { ProductCadence } from '../types/product';

export class PetService {
  private provider: PetProvider;

  constructor(provider: PetProvider = ProviderFactory.getPetProvider()) {
    this.provider = provider;
  }

  setProvider(provider: PetProvider) {
    this.provider = provider;
  }

  async getAll(): Promise<PetProfile[]> {
    return this.provider.getAll();
  }

  async deletePet(id: string): Promise<boolean> {
    if (this.provider.deletePet) {
      return this.provider.deletePet(id);
    }
    return false;
  }

  async getPetTypes(): Promise<PetTypeData[]> {
    return this.provider.getPetTypes();
  }

  async getByCustomerId(customerId: string): Promise<PetProfile[]> {
    return this.provider.getCustomerPets(customerId);
  }

  async getCustomerPets(customerId: string): Promise<PetProfile[]> {
    return this.getByCustomerId(customerId);
  }

  async getById(id: string): Promise<PetProfile | null> {
    return this.provider.getById(id);
  }

  async getPetById(id: string): Promise<PetProfile | null> {
    return this.getById(id);
  }

  async savePet(petData: Partial<PetProfile>): Promise<PetProfile> {
    return this.provider.savePet(petData);
  }

  calculatePetCadence(
    weightLbs: number,
    packageWeightLbs = 14
  ): {
    recommendedWeeks: number;
    recommendedCadence: ProductCadence;
    dailyIntakeCups: number;
    estimatedDaysPerBag: number;
  } {
    // Canine daily intake rule of thumb: ~0.5 cup per 12.5 lbs body weight
    const dailyIntakeCups = Number(Math.max(0.5, (weightLbs / 25) * 1.5).toFixed(1));
    // 1 lb of dry kibble ~ 4 measuring cups
    const totalCupsInBag = packageWeightLbs * 4;
    const estimatedDaysPerBag = Math.round(totalCupsInBag / dailyIntakeCups);
    const weeksExact = estimatedDaysPerBag / 7;

    let recommendedCadence: ProductCadence = '4-weeks';
    let recommendedWeeks = 4;

    if (weeksExact <= 2.5) {
      recommendedCadence = '2-weeks';
      recommendedWeeks = 2;
    } else if (weeksExact <= 4.5) {
      recommendedCadence = '4-weeks';
      recommendedWeeks = 4;
    } else if (weeksExact <= 6.5) {
      recommendedCadence = '6-weeks';
      recommendedWeeks = 6;
    } else if (weeksExact <= 9.5) {
      recommendedCadence = '8-weeks';
      recommendedWeeks = 8;
    } else {
      recommendedCadence = '12-weeks';
      recommendedWeeks = 12;
    }

    return {
      recommendedWeeks,
      recommendedCadence,
      dailyIntakeCups,
      estimatedDaysPerBag,
    };
  }
}

export const petService = new PetService();
