import catalog from '../data/shop-content.json';
import salesData from '../data/etsy-sales-all-time.json';
import { readSalesSnapshot } from './sales';
import { absoluteUrl } from './paths';
import { getOffer } from './offers';

export interface DigitalProduct {
  id: string;
  designCount: number;
  title: string;
  description: string;
  formatLabel: string;
  files: string;
  brushes: boolean;
  delivery: string;
  cover?: string;
  coverAlt?: string;
}

export interface PhysicalProduct {
  slug: string;
  priceMinor: number;
  title: string;
  description: string;
  group: string;
  image: string;
  webImage?: string;
  alt: string;
  imageWidth: number;
  imageHeight: number;
}

export const digitalProducts: DigitalProduct[] = catalog.digital.map((product) => ({
  ...product,
  designCount: getOffer(product.id).designCount,
}));
export const physicalProducts: PhysicalProduct[] = catalog.physical;
export const { counts: sales, note: salesSourceNote } = readSalesSnapshot(salesData);
export const featuredProducts = digitalProducts.filter(({ id }) =>
  ['100', '121', '300', '200'].includes(id),
);

export const digitalPath = (product: DigitalProduct) => `/digital/${product.id}/`;
export const physicalPath = (product: PhysicalProduct) => `/physical/${product.slug}/`;
/** File name of the listing cover inside src/assets/listings. */
export const coverFile = (product: DigitalProduct) =>
  product.cover ?? `etsy-${product.id}-cover.jpg`;
export const hasSales = (product: DigitalProduct) => Object.hasOwn(sales, product.id);

export function collectionSchema<T extends { title: string }>(
  name: string,
  products: T[],
  path: (product: T) => string,
  site: URL | undefined,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: product.title,
        url: absoluteUrl(path(product), site),
      })),
    },
  };
}
