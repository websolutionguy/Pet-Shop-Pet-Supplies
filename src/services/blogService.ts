import { BlogProvider } from '../providers/contracts';
import { ProviderFactory } from '../providers/factory';
import { jsonBlogProvider } from '../providers/json/JsonBlogProvider';
import { BlogData } from '../types/data';

export class BlogService {
  private provider: BlogProvider;

  constructor(provider: BlogProvider = ProviderFactory.getBlogProvider()) {
    this.provider = provider;
  }

  setProvider(provider: BlogProvider) {
    this.provider = provider;
  }

  /**
   * Retrieves all published journal posts.
   */
  async getPosts(): Promise<BlogData[]> {
    return this.provider.getAll();
  }

  /**
   * Retrieves a single post by slug.
   */
  async getPostBySlug(slug: string): Promise<BlogData | null> {
    return this.provider.getBySlug(slug);
  }

  /**
   * Retrieves posts filtered by editorial category.
   */
  async getPostsByCategory(category: string): Promise<BlogData[]> {
    if (this.provider.getByCategory) {
      return this.provider.getByCategory(category);
    }
    const all = await this.provider.getAll();
    if (!category || category === 'All') return all;
    return all.filter((b) => b.category.toLowerCase() === category.toLowerCase());
  }

  async getAll(): Promise<BlogData[]> {
    return this.getPosts();
  }

  async getArticles(): Promise<BlogData[]> {
    return this.getPosts();
  }

  async getBySlug(slug: string): Promise<BlogData | null> {
    return this.getPostBySlug(slug);
  }

  async getArticleBySlug(slug: string): Promise<BlogData | null> {
    return this.getPostBySlug(slug);
  }

  async getRecentArticles(limit = 3): Promise<BlogData[]> {
    const list = await this.getPosts();
    return list
      .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
      .slice(0, limit);
  }
}

export const blogService = new BlogService();
