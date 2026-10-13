import { BlogProvider } from '../contracts';
import { BlogData } from '../../types/data';
import rawBlog from '../../data/blog.json';

const blogList = rawBlog as BlogData[];

export class JsonBlogProvider implements BlogProvider {
  async getAll(): Promise<BlogData[]> {
    return [...blogList];
  }

  async getBySlug(slug: string): Promise<BlogData | null> {
    const item = blogList.find((b) => b.slug === slug);
    return item ? { ...item } : null;
  }

  async getByCategory(category: string): Promise<BlogData[]> {
    if (!category || category === 'All') return [...blogList];
    return blogList.filter(
      (b) => b.category.toLowerCase() === category.toLowerCase()
    );
  }
}

export const jsonBlogProvider = new JsonBlogProvider();
