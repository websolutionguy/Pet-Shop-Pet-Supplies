import { Metadata } from 'next';
import { Product } from '../types/product';
import { BlogData } from '../types/data';
import companyData from '../data/company.json';
import siteData from '../data/site.json';
import reviewsData from '../data/reviews.json';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://rowanandhound.com';

export const NATURAL_SEO_KEYWORDS = [
  'pet shop',
  'pet supplies',
  'dog food',
  'cat food',
  'pet treats',
  'pet food subscription',
  'pet supply subscription',
  'pet food reorder',
  'dog food delivery',
  'cat litter subscription',
  'small-batch kibble',
  'Pacific Northwest pet provisions',
  'single-protein dog food',
  'feline hydration broth',
  'natural yak chews',
];

export interface PageMetadataOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  authors?: string[];
  keywords?: string[];
  noIndex?: boolean;
}

export function createCanonicalUrl(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath === '/' ? '' : cleanPath}`;
}

export function generatePageMetadata(options: PageMetadataOptions): Metadata {
  const {
    title,
    description,
    path = '',
    image = '/src/assets/images/hero_dog_natural_1790396014202.jpg',
    type = 'website',
    publishedTime,
    authors,
    keywords = NATURAL_SEO_KEYWORDS,
    noIndex = false,
  } = options;

  const canonical = createCanonicalUrl(path);
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image.startsWith('/') ? '' : '/'}${image}`;

  const metadata: Metadata = {
    title: {
      absolute: title,
    },
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteData.name,
      locale: 'en_US',
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
      ...(authors ? { authors } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  };

  return metadata;
}

// ==========================================
// Schema.org Structured Data Generators
// ==========================================

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'PetStore'],
    '@id': `${SITE_URL}/#organization`,
    name: companyData.name,
    legalName: companyData.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    description: companyData.founderStory,
    telephone: siteData.supportPhone,
    email: siteData.contactEmail,
    foundingDate: `${companyData.foundedYear}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteData.address.street,
      addressLocality: siteData.address.city,
      addressRegion: siteData.address.state,
      postalCode: siteData.address.postalCode,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 45.5152,
      longitude: -122.6784,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '10:00',
        closes: '17:00',
      },
    ],
    sameAs: [
      siteData.socialLinks.instagram,
      siteData.socialLinks.facebook,
    ],
    priceRange: '$$',
  };
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: siteData.name,
    description: siteData.meta.description,
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/shop?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: createCanonicalUrl(item.path),
    })),
  };
}

export function buildProductSchema(product: Product) {
  const allImages = [product.primaryImage, ...(product.galleryImages || [])].filter(Boolean);
  const images = allImages.length > 0
    ? allImages.map((img) => (img.startsWith('http') ? img : `${SITE_URL}${img.startsWith('/') ? '' : '/'}${img}`))
    : [`${SITE_URL}/src/assets/images/product_venison_kibble_1790396027749.jpg`];

  // Match actual reviews from reviews.json
  const productReviews = (reviewsData as any[]).filter(
    (r) => r.productId === product.id
  );

  const aggregateRating =
    productReviews.length > 0
      ? {
          '@type': 'AggregateRating',
          ratingValue: Number(
            (
              productReviews.reduce((sum, r) => sum + r.rating, 0) /
              productReviews.length
            ).toFixed(1)
          ),
          reviewCount: productReviews.length,
          bestRating: 5,
          worstRating: 1,
        }
      : product.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewCount || 1,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: images,
    description: product.fullDescription || product.shortDescription,
    sku: product.variants?.[0]?.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Rowan & Hound Supply Co.',
    },
    category: product.categoryName,
    offers: {
      '@type': 'Offer',
      price: product.basePrice,
      priceCurrency: 'USD',
      priceValidUntil: '2027-12-31',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: `${SITE_URL}/products/${product.slug}`,
      seller: {
        '@type': 'Organization',
        name: companyData.name,
      },
    },
    ...(aggregateRating ? { aggregateRating } : {}),
  };
}

export function buildArticleSchema(post: BlogData) {
  const imageUrl = post.heroImage
    ? post.heroImage.startsWith('http')
      ? post.heroImage
      : `${SITE_URL}${post.heroImage.startsWith('/') ? '' : '/'}${post.heroImage}`
    : `${SITE_URL}/src/assets/images/hero_dog_natural_1790396014202.jpg`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: [imageUrl],
    datePublished: post.publishedDate,
    dateModified: post.publishedDate,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: companyData.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/journal/${post.slug}`,
    },
  };
}

export function buildFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
