import { Address } from './common';
import { PetProfile } from './pet';

export interface CustomerProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  defaultShippingAddress: Address;
  pets: PetProfile[];
  memberSince: string;
  hasActiveSubscription: boolean;
  totalSavedWithSubscriptions: number;
}
