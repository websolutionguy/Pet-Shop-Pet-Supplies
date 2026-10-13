import { CustomerProvider } from '../providers/contracts';
import { jsonCustomerProvider } from '../providers/json/JsonCustomerProvider';
import { CustomerProfile } from '../types/customer';
import { ICustomerRepository } from './contracts';

export class CustomerService implements ICustomerRepository {
  private provider: CustomerProvider;

  constructor(provider: CustomerProvider = jsonCustomerProvider) {
    this.provider = provider;
  }

  setProvider(provider: CustomerProvider) {
    this.provider = provider;
  }

  async getCurrentCustomer(): Promise<CustomerProfile> {
    return this.provider.getCurrentCustomer();
  }

  async updateCustomer(profile: Partial<CustomerProfile>): Promise<CustomerProfile> {
    return this.provider.updateCustomer(profile);
  }
}

export const customerService = new CustomerService();
