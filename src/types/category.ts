export interface Category {
  id: string;
  slug: string;
  name: string;
  petType: 'dog' | 'cat' | 'both';
  description: string;
  productCount: number;
}
