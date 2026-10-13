import { ProductCadence } from '../types/product';

export const STORE_NAME = 'Rowan & Hound Supply Co.';
export const STORE_TAGLINE = 'Independent pet nutrition & thoughtful provisions';
export const STORE_LOCATION = '142 Market St, Portland, OR · Established 2018';
export const STORE_HOURS = 'Mon–Sat: 9:00 AM – 7:00 PM · Sun: 10:00 AM – 5:00 PM';

export const SUBSCRIPTION_DISCOUNT_PERCENT = 10;
export const FREE_SHIPPING_THRESHOLD = 49.0;
export const FLAT_SHIPPING_FEE = 5.95;
export const ESTIMATED_TAX_RATE = 0.075;

export interface CadenceDetail {
  id: ProductCadence;
  label: string;
  shortLabel: string;
  intervalDays: number;
  description: string;
}

export const CADENCE_OPTIONS: Record<ProductCadence, CadenceDetail> = {
  '2-weeks': {
    id: '2-weeks',
    label: 'Every 2 Weeks',
    shortLabel: '2 wks',
    intervalDays: 14,
    description: 'Active dogs or multi-pet households',
  },
  '4-weeks': {
    id: '4-weeks',
    label: 'Every 4 Weeks',
    shortLabel: '4 wks',
    intervalDays: 28,
    description: 'Standard monthly replenishment (Recommended)',
  },
  '6-weeks': {
    id: '6-weeks',
    label: 'Every 6 Weeks',
    shortLabel: '6 wks',
    intervalDays: 42,
    description: 'Medium breeds & moderate intake',
  },
  '8-weeks': {
    id: '8-weeks',
    label: 'Every 8 Weeks',
    shortLabel: '8 wks',
    intervalDays: 56,
    description: 'Small breeds, supplements & long-lasting chews',
  },
  '12-weeks': {
    id: '12-weeks',
    label: 'Every 12 Weeks',
    shortLabel: '12 wks',
    intervalDays: 84,
    description: 'Quarterly replenishment for supplements & large items',
  },
};
