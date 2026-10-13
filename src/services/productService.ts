import { ProductProvider } from '../providers/contracts';
import { ProviderFactory } from '../providers/factory';
import { jsonProductProvider } from '../providers/json/JsonProductProvider';
import { ProductData, BrandData, ProductTypeData } from '../types/data';
import { Product, ProductCadence } from '../types/product';
import { ProductFilterParams } from './contracts';

export function mapProductDataToProduct(data: ProductData): Product {
  const cadenceOptions = (data.frequencyOptions || ['4-weeks']) as ProductCadence[];
  const normalizedPetType =
    data.petType === 'dogs' || data.petType === 'dog'
      ? 'dog'
      : data.petType === 'cats' || data.petType === 'cat'
      ? 'cat'
      : 'both';

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    brand: data.brand,
    petType: normalizedPetType,
    categoryId: data.category,
    categoryName: data.category
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase()),
    shortDescription: data.shortDescription,
    fullDescription: data.description,
    primaryImage: data.thumbnail || data.images?.[0] || '',
    galleryImages: data.gallery || data.images || [],
    basePrice: data.price,
    compareAtPrice: data.compareAtPrice,
    unitMeasurement: data.weight || 'per package',
    keyBenefits: data.benefits || [],
    features: data.features || [],
    ingredients: data.ingredients || [],
    relatedProductIds: data.relatedProducts || [],
    guaranteedAnalysis: data.nutrition
      ? {
          crudeProtein: data.nutrition.crudeProtein,
          crudeFat: data.nutrition.crudeFat,
          crudeFiber: data.nutrition.crudeFiber,
          moisture: data.nutrition.moisture,
        }
      : undefined,
    variants:
      data.sizes && data.sizes.length > 0
        ? data.sizes.map((s, idx) => ({
            id: `var-${data.id}-${idx}`,
            name: s,
            sizeOrWeight: s,
            sku: `${data.id.toUpperCase()}-${idx + 1}`,
            price:
              idx === 0
                ? data.price
                : Number((data.price * (1 + idx * 0.75)).toFixed(2)),
            compareAtPrice: data.compareAtPrice
              ? Number((data.compareAtPrice * (1 + idx * 0.75)).toFixed(2))
              : undefined,
            inStock: data.availability === 'in-stock',
            inventoryCount: 30,
          }))
        : [
            {
              id: `var-${data.id}-std`,
              name: 'Standard',
              sizeOrWeight: data.weight || 'Standard',
              sku: `${data.id.toUpperCase()}-STD`,
              price: data.price,
              compareAtPrice: data.compareAtPrice,
              inStock: data.availability === 'in-stock',
              inventoryCount: 30,
            },
          ],
    subscription: {
      eligible: data.subscriptionEligible,
      discountPercentage: data.subscriptionDiscount || 10,
      defaultCadence: (cadenceOptions[1] || cadenceOptions[0] || '4-weeks') as ProductCadence,
      cadenceOptions: cadenceOptions.length > 0 ? cadenceOptions : ['4-weeks'],
      benefitsSummary: [
        `${data.subscriptionDiscount || 10}% recurring savings on every delivery`,
        'Guaranteed fresh batch allocation',
        'Pause, skip or reschedule with one click',
      ],
    },
    inStock: data.availability === 'in-stock',
    isFeatured: data.featured,
    isQuickReorderCandidate: data.reorderEligible,
    isNew: data.new,
    rawPetType: data.petType,
    productType: data.productType,
    sizes: data.sizes || [],
    rating: 4.9,
    reviewCount: 42,
    dietaryTags: data.tags || [],
  };
}

export class ProductService {
  private provider: ProductProvider;

  constructor(provider: ProductProvider = ProviderFactory.getProductProvider()) {
    this.provider = provider;
  }

  setProvider(provider: ProductProvider) {
    this.provider = provider;
  }

  async getAll(filters?: ProductFilterParams): Promise<Product[]> {
    const rawList = await this.provider.getAll({
      petType: filters?.petType,
      category: filters?.categorySlug,
      subscriptionOnly: filters?.subscriptionOnly,
      query: filters?.searchQuery,
      sortBy: filters?.sortBy,
    });

    return rawList.map(mapProductDataToProduct);
  }

  // Exact Phase 2 API method aliases
  async getProducts(filters?: ProductFilterParams): Promise<Product[]> {
    return this.getAll(filters);
  }

  async getRawProducts(filters?: ProductFilterParams): Promise<ProductData[]> {
    return this.provider.getAll({
      petType: filters?.petType,
      category: filters?.categorySlug,
      subscriptionOnly: filters?.subscriptionOnly,
      query: filters?.searchQuery,
      sortBy: filters?.sortBy,
    });
  }

  async getById(id: string): Promise<Product | null> {
    const raw = await this.provider.getById(id);
    return raw ? mapProductDataToProduct(raw) : null;
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.getById(id);
  }

  async getBySlug(slug: string): Promise<Product | null> {
    const raw = await this.provider.getBySlug(slug);
    return raw ? mapProductDataToProduct(raw) : null;
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    return this.getBySlug(slug);
  }

  async getFeatured(): Promise<Product[]> {
    const rawList = await this.provider.getFeatured();
    return rawList.map(mapProductDataToProduct);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return this.getFeatured();
  }

  async getProductsByPetType(petType: string): Promise<Product[]> {
    return this.getAll({ petType });
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.getAll({ categorySlug: category });
  }

  async getSubscriptionProducts(): Promise<Product[]> {
    return this.getAll({ subscriptionOnly: true });
  }

  async getReorderEligibleProducts(): Promise<Product[]> {
    const rawList = await this.provider.getReorderCandidates();
    return rawList.map(mapProductDataToProduct);
  }

  async getReorderCandidates(): Promise<Product[]> {
    return this.getReorderEligibleProducts();
  }

  async search(query: string): Promise<Product[]> {
    const rawList = await this.provider.search(query);
    return rawList.map(mapProductDataToProduct);
  }

  async searchProducts(query: string): Promise<Product[]> {
    return this.search(query);
  }

  async getRelatedProducts(productId: string): Promise<Product[]> {
    const current = await this.provider.getById(productId);
    if (!current || !current.relatedProducts || current.relatedProducts.length === 0) {
      return [];
    }

    const relatedPromises = current.relatedProducts.map((relId) => this.provider.getById(relId));
    const results = await Promise.all(relatedPromises);
    return results.filter((r): r is ProductData => r !== null).map(mapProductDataToProduct);
  }

  async getBrands(): Promise<BrandData[]> {
    if (this.provider.getBrands) {
      return this.provider.getBrands();
    }
    return [];
  }

  async getProductTypes(): Promise<ProductTypeData[]> {
    if (this.provider.getProductTypes) {
      return this.provider.getProductTypes();
    }
    return [];
  }
}

export const productService = new ProductService();
