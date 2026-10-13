import {
  ProductProvider,
  SubscriptionProvider,
  OrderProvider,
  PetProvider,
  CategoryProvider,
  ReviewProvider,
  BlogProvider,
  BundleProvider,
} from './contracts';
import {
  jsonProductProvider,
  jsonSubscriptionProvider,
  jsonOrderProvider,
  jsonPetProvider,
  jsonCategoryProvider,
  jsonReviewProvider,
  jsonBlogProvider,
  jsonBundleProvider,
} from './json';
import {
  apiProductProvider,
  apiSubscriptionProvider,
  apiOrderProvider,
  apiPetProvider,
  apiCategoryProvider,
  apiReviewProvider,
  apiBlogProvider,
  apiBundleProvider,
} from './api';

export type DataSourceType = 'json' | 'api';

/**
 * Configure default data source.
 * When NEXT_PUBLIC_DATA_SOURCE='api', services will automatically
 * route through the REST API Providers instead of JSON data.
 */
export const CURRENT_DATA_SOURCE: DataSourceType =
  (process.env.NEXT_PUBLIC_DATA_SOURCE as DataSourceType) || 'json';

export class ProviderFactory {
  static getProductProvider(type: DataSourceType = CURRENT_DATA_SOURCE): ProductProvider {
    return type === 'api' ? apiProductProvider : jsonProductProvider;
  }

  static getSubscriptionProvider(type: DataSourceType = CURRENT_DATA_SOURCE): SubscriptionProvider {
    return type === 'api' ? apiSubscriptionProvider : jsonSubscriptionProvider;
  }

  static getOrderProvider(type: DataSourceType = CURRENT_DATA_SOURCE): OrderProvider {
    return type === 'api' ? apiOrderProvider : jsonOrderProvider;
  }

  static getPetProvider(type: DataSourceType = CURRENT_DATA_SOURCE): PetProvider {
    return type === 'api' ? apiPetProvider : jsonPetProvider;
  }

  static getCategoryProvider(type: DataSourceType = CURRENT_DATA_SOURCE): CategoryProvider {
    return type === 'api' ? apiCategoryProvider : jsonCategoryProvider;
  }

  static getReviewProvider(type: DataSourceType = CURRENT_DATA_SOURCE): ReviewProvider {
    return type === 'api' ? apiReviewProvider : jsonReviewProvider;
  }

  static getBlogProvider(type: DataSourceType = CURRENT_DATA_SOURCE): BlogProvider {
    return type === 'api' ? apiBlogProvider : jsonBlogProvider;
  }

  static getBundleProvider(type: DataSourceType = CURRENT_DATA_SOURCE): BundleProvider {
    return type === 'api' ? apiBundleProvider : jsonBundleProvider;
  }
}
