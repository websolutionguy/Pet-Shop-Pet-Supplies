import { PetProvider } from '../contracts';
import { PetTypeData } from '../../types/data';
import { PetProfile } from '../../types/pet';
import { ApiClient, defaultApiClient } from './apiClient';

/**
 * REST API Pet Provider
 *
 * Implements PetProvider connecting to future backend endpoints:
 * - GET /api/pets
 * - GET /api/pets/:id
 * - POST /api/pets
 * - PATCH /api/pets/:id
 * - DELETE /api/pets/:id
 */
export class ApiPetProvider implements PetProvider {
  private client: ApiClient;

  constructor(client: ApiClient = defaultApiClient) {
    this.client = client;
  }

  /**
   * GET /api/pets
   */
  async getAll(): Promise<PetProfile[]> {
    return this.client.get<PetProfile[]>('/api/pets');
  }

  /**
   * GET /api/pets?customerId=:customerId
   */
  async getCustomerPets(customerId: string): Promise<PetProfile[]> {
    return this.client.get<PetProfile[]>('/api/pets', { customerId });
  }

  /**
   * GET /api/pets/:id
   */
  async getById(id: string): Promise<PetProfile | null> {
    try {
      return await this.client.get<PetProfile>(`/api/pets/${id}`);
    } catch (err: any) {
      if (err.status === 404) return null;
      throw err;
    }
  }

  /**
   * POST /api/pets or PATCH /api/pets/:id
   */
  async savePet(pet: Partial<PetProfile>): Promise<PetProfile> {
    if (pet.id) {
      return this.client.patch<PetProfile>(`/api/pets/${pet.id}`, pet);
    }
    return this.client.post<PetProfile>('/api/pets', pet);
  }

  /**
   * DELETE /api/pets/:id
   */
  async deletePet(id: string): Promise<boolean> {
    await this.client.delete(`/api/pets/${id}`);
    return true;
  }

  /**
   * GET /api/pets/types
   */
  async getPetTypes(): Promise<PetTypeData[]> {
    return this.client.get<PetTypeData[]>('/api/pets/types');
  }
}

export const apiPetProvider = new ApiPetProvider();
