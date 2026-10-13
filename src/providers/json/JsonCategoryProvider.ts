import { CategoryProvider } from '../contracts';
import { CategoryData } from '../../types/data';
import rawCategories from '../../data/categories.json';

const categoriesList = rawCategories as CategoryData[];

export class JsonCategoryProvider implements CategoryProvider {
  async getAll(): Promise<CategoryData[]> {
    return [...categoriesList];
  }

  async getBySlug(slug: string): Promise<CategoryData | null> {
    const item = categoriesList.find((c) => c.slug === slug);
    return item ? { ...item } : null;
  }
}

export const jsonCategoryProvider = new JsonCategoryProvider();
