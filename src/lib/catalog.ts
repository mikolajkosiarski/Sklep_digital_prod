import catalog from '../data/shop-content.json';
import salesData from '../data/etsy-sales-all-time.json';
import { readSalesSnapshot } from './sales';
import { absoluteUrl } from './paths';
import { getOffer } from './offers';

export const styleLabels = {
  gothic: 'Gothic',
  tribal: 'Tribal & neotribal',
  cybersigilism: 'Cybersigilism',
  ornamental: 'Ornamental & frames',
  coquette: 'Coquette',
} as const;
export type StyleKey = keyof typeof styleLabels;

export interface DigitalProduct {
  id: string;
  designCount: number;
  title: string;
  styles: StyleKey[];
  description: string;
  formatLabel: string;
  files: string;
  brushes: boolean;
  delivery: string;
  cover?: string;
  coverAlt?: string;
}

export const digitalProducts: DigitalProduct[] = catalog.digital.map((product) => {
  for (const style of product.styles)
    if (!Object.hasOwn(styleLabels, style))
      throw new Error(`Unknown style ${style} for collection ${product.id}`);
  return {
    ...product,
    styles: product.styles as StyleKey[],
    designCount: getOffer(product.id).designCount,
  };
});
/** Shop product code shown on product pages and in the cart. */
export const productCode = (id: string) => `VM-${id.padStart(3, '0')}`;
/** Etsy sales threshold for the Bestseller label; counts come from the sales snapshot. */
export const BESTSELLER_SALES = 100;
export const { counts: sales, note: salesSourceNote } = readSalesSnapshot(salesData);
export const featuredProducts = digitalProducts.filter(({ id }) =>
  ['100', '121', '300', '200'].includes(id),
);

export const productPath = (product: DigitalProduct) => `/shop/${product.id}/`;
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
