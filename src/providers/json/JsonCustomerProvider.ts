import { CustomerProvider } from '../contracts';
import { CustomerProfile } from '../../types/customer';
import rawCustomer from '../../data/customer.json';

let currentProfile = { ...(rawCustomer as CustomerProfile) };

export class JsonCustomerProvider implements CustomerProvider {
  async getCurrentCustomer(): Promise<CustomerProfile> {
    return { ...currentProfile };
  }

  async updateCustomer(profile: Partial<CustomerProfile>): Promise<CustomerProfile> {
    currentProfile = {
      ...currentProfile,
      ...profile,
    };
    return { ...currentProfile };
  }
}

export const jsonCustomerProvider = new JsonCustomerProvider();
