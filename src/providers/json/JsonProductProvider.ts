import { ProductProvider, ProductFilterOptions } from '../contracts';
import { ProductData, BrandData, ProductTypeData } from '../../types/data';
import rawProducts from '../../data/products.json';
import rawBrands from '../../data/brands.json';
import rawProductTypes from '../../data/product-types.json';

const productsList = rawProducts as ProductData[];

export class JsonProductProvider implements ProductProvider {
  async getAll(filters?: ProductFilterOptions): Promise<ProductData[]> {
    let list = [...productsList];

    if (!filters) return list;

    if (filters.petType && filters.petType !== 'all') {
      const targetPet = filters.petType.toLowerCase();
      list = list.filter(
        (p) =>
          p.petType.toLowerCase() === targetPet ||
          p.petType.toLowerCase() === 'all' ||
          (targetPet === 'dog' && p.petType.toLowerCase() === 'dogs') ||
          (targetPet === 'dogs' && p.petType.toLowerCase() === 'dog') ||
          (targetPet === 'cat' && p.petType.toLowerCase() === 'cats') ||
          (targetPet === 'cats' && p.petType.toLowerCase() === 'cat')
      );
    }

    if (filters.category && filters.category !== 'all') {
      const targetCat = filters.category.toLowerCase();
      list = list.filter(
        (p) =>
          p.category.toLowerCase() === targetCat ||
          p.category.toLowerCase().includes(targetCat)
      );
    }

    if (filters.subscriptionOnly) {
      list = list.filter((p) => p.subscriptionEligible);
    }

    if (filters.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          list.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          list.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          // default stable
          break;
        case 'featured':
        default:
          list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
      }
    }

    return list;
  }

  async getById(id: string): Promise<ProductData | null> {
    const item = productsList.find((p) => p.id === id);
    return item ? { ...item } : null;
  }

  async getBySlug(slug: string): Promise<ProductData | null> {
    const item = productsList.find((p) => p.slug === slug);
    return item ? { ...item } : null;
  }

  async getFeatured(): Promise<ProductData[]> {
    return productsList.filter((p) => p.featured);
  }

  async getReorderCandidates(): Promise<ProductData[]> {
    return productsList.filter((p) => p.reorderEligible);
  }

  async search(query: string): Promise<ProductData[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return productsList.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }

  async getBrands(): Promise<BrandData[]> {
    return rawBrands as BrandData[];
  }

  async getProductTypes(): Promise<ProductTypeData[]> {
    return rawProductTypes as ProductTypeData[];
  }
}

export const jsonProductProvider = new JsonProductProvider();
