import {
  BESTSELLER_SALES,
  digitalProducts,
  coverFile,
  productCode,
  productPath,
  sales,
  styleLabels,
  type StyleKey,
} from './catalog';
import { getOffer } from './offers';
import { prepareListingImage } from './product-media';
import { url } from './paths';

export interface StoreProduct {
  key: string;
  id: string;
  code: string;
  title: string;
  href: string;
  priceMinor: number;
  /** Regular price, only during a genuine promotion. */
  compareAtMinor?: number;
  maxQuantity: number;
  meta: string;
  styles: StyleKey[];
  styleNames: string[];
  designCount: number;
  brushes: boolean;
  sales?: number;
  badge?: string;
  rating?: { average: number; count: number };
  image: { src: string; srcset?: string; alt: string; width: number; height: number };
}

export const storeProducts: StoreProduct[] = await Promise.all(
  digitalProducts.map(async (product) => {
    const offer = getOffer(product.id);
    const sold = sales[product.id];
    return {
      key: `digital:${product.id}`,
      id: product.id,
      code: productCode(product.id),
      title: product.title,
      href: url(productPath(product)),
      priceMinor: offer.priceMinor,
      compareAtMinor: offer.compareAtMinor,
      maxQuantity: 1,
      meta: `${product.designCount} designs · ${product.brushes ? 'PNG + brushes' : 'PNG'}`,
      styles: product.styles,
      styleNames: product.styles.map((style) => styleLabels[style]),
      designCount: product.designCount,
      brushes: product.brushes,
      sales: sold,
      // A promotion outranks the sales label; both come from recorded data.
      badge: offer.compareAtMinor
        ? 'Sale'
        : sold !== undefined && sold >= BESTSELLER_SALES
          ? 'Bestseller'
          : undefined,
      rating: offer.rating && { average: offer.rating.average, count: offer.rating.count },
      image: await prepareListingImage({
        file: coverFile(product),
        alt: product.coverAlt ?? `${product.title} listing cover`,
      }),
    };
  }),
);
const byKey = new Map(storeProducts.map((product) => [product.key, product]));
for (const product of storeProducts) {
  if (!Number.isSafeInteger(product.priceMinor) || product.priceMinor <= 0)
    throw new Error(`Invalid working price for ${product.key}`);
}
export function getStoreProduct(key: string): StoreProduct {
  const product = byKey.get(key);
  if (!product) throw new Error(`Unknown store product ${key}`);
  return product;
}
