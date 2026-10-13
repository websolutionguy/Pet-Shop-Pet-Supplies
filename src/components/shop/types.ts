export interface ShopFilterState {
  searchQuery: string;
  pet: string; // 'all' | 'dog' | 'cat' | 'small-pets' | 'bird' | 'fish'
  category: string; // slug or 'all'
  brand: string; // brand name or 'all'
  productType: string; // productType id or 'all'
  priceRange: string; // 'all' | 'under-25' | '25-50' | '50-100' | 'over-100'
  subscriptionOnly: boolean;
  reorderOnly: boolean;
  inStockOnly: boolean;
  sort: string; // 'featured' | 'price-low' | 'price-high' | 'rating' | 'new'
}

export const DEFAULT_FILTER_STATE: ShopFilterState = {
  searchQuery: '',
  pet: 'all',
  category: 'all',
  brand: 'all',
  productType: 'all',
  priceRange: 'all',
  subscriptionOnly: false,
  reorderOnly: false,
  inStockOnly: false,
  sort: 'featured',
};

export const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured & House Favorites' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'rating', label: 'Customer Rating' },
  { id: 'new', label: 'Fresh Batches & New' },
];

export const PET_FILTER_OPTIONS = [
  { id: 'all', label: 'All Companions' },
  { id: 'dog', label: 'Dogs' },
  { id: 'cat', label: 'Cats' },
  { id: 'small-pets', label: 'Small Pets' },
  { id: 'bird', label: 'Birds' },
  { id: 'fish', label: 'Fish' },
];

export const PRICE_RANGE_OPTIONS = [
  { id: 'all', label: 'All Prices' },
  { id: 'under-25', label: 'Under $25', min: 0, max: 24.99 },
  { id: '25-50', label: '$25 to $50', min: 25, max: 50 },
  { id: '50-100', label: '$50 to $100', min: 50, max: 100 },
  { id: 'over-100', label: 'Over $100', min: 100, max: Infinity },
];
