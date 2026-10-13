import { BundleProvider } from '../contracts';
import { BundleData } from '../../types/data';
import rawBundles from '../../data/bundles.json';

const bundlesList = rawBundles as BundleData[];

export class JsonBundleProvider implements BundleProvider {
  async getAll(): Promise<BundleData[]> {
    return [...bundlesList];
  }

  async getBySlug(slug: string): Promise<BundleData | null> {
    const item = bundlesList.find((b) => b.slug === slug);
    return item ? { ...item } : null;
  }
}

export const jsonBundleProvider = new JsonBundleProvider();
