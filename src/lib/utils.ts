import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ProductCadence } from '../types/product';
import { CADENCE_OPTIONS, SUBSCRIPTION_DISCOUNT_PERCENT } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function calculateSubscriptionPrice(basePrice: number, discountPercent = SUBSCRIPTION_DISCOUNT_PERCENT): number {
  const discount = (basePrice * discountPercent) / 100;
  return Number((basePrice - discount).toFixed(2));
}

export function formatCadenceLabel(cadence?: ProductCadence): string {
  if (!cadence || !CADENCE_OPTIONS[cadence]) return 'One-time delivery';
  return CADENCE_OPTIONS[cadence].label;
}

export function calculateNextShipDate(daysFromNow = 28): string {
  const target = new Date();
  target.setDate(target.getDate() + daysFromNow);
  return target.toISOString().split('T')[0];
}

export function formatHumanDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}
