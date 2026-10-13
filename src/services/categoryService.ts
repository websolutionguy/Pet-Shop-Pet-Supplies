import { CategoryProvider } from '../providers/contracts';
import { ProviderFactory } from '../providers/factory';
import { jsonCategoryProvider } from '../providers/json/JsonCategoryProvider';
import { CategoryData } from '../types/data';
import { Category } from '../types/category';

export function mapCategoryDataToCategory(data: CategoryData): Category {
  const isDog = data.petTypes.includes('dogs');
  const isCat = data.petTypes.includes('cats');

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    petType: isDog && isCat ? 'both' : isDog ? 'dog' : 'cat',
    description: data.description,
    productCount: data.productCount,
  };
}

export class CategoryService {
  private provider: CategoryProvider;

  constructor(provider: CategoryProvider = ProviderFactory.getCategoryProvider()) {
    this.provider = provider;
  }

  setProvider(provider: CategoryProvider) {
    this.provider = provider;
  }

  async getAll(): Promise<Category[]> {
    const rawList = await this.provider.getAll();
    return rawList.map(mapCategoryDataToCategory);
  }

  async getRawCategories(): Promise<CategoryData[]> {
    return this.provider.getAll();
  }

  async getBySlug(slug: string): Promise<Category | null> {
    const raw = await this.provider.getBySlug(slug);
    return raw ? mapCategoryDataToCategory(raw) : null;
  }

  async getRawBySlug(slug: string): Promise<CategoryData | null> {
    return this.provider.getBySlug(slug);
  }
}

export const categoryService = new CategoryService();
