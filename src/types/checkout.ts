import { Address } from './common';
import { DeliveryMethodId } from '../services/cartService';

export interface CustomerFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  subscribeNewsletter: boolean;
}

export interface ShippingAddressFormData {
  fullName: string;
  streetLine1: string;
  streetLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  deliveryInstructions: string;
}

export interface PaymentFormData {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  billingSameAsShipping: boolean;
  billingStreet?: string;
  billingCity?: string;
  billingState?: string;
  billingPostalCode?: string;
}

export interface CheckoutFormErrors {
  // Customer errors
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  // Shipping errors
  streetLine1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  // Payment errors
  cardholderName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvc?: string;
  billingStreet?: string;
  billingCity?: string;
  billingPostalCode?: string;
  // General error
  form?: string;
}
