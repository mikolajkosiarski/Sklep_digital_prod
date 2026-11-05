import {
  digitalProducts,
  physicalProducts,
  coverFile,
  digitalPath,
  physicalPath,
  sales,
} from './catalog';
import { getOffer } from './offers';
import { prepareListingImage } from './product-media';
import { asset, url } from './paths';

export interface StoreProduct {
  key: string;
  kind: 'digital' | 'physical';
  title: string;
  href: string;
  priceMinor: number;
  maxQuantity: number;
  meta: string;
  sales?: number;
  image: { src: string; srcset?: string; alt: string; width: number; height: number };
}
const digital: StoreProduct[] = await Promise.all(
  digitalProducts.map(async (product) => ({
    key: `digital:${product.id}`,
    kind: 'digital' as const,
    title: product.title,
    href: url(digitalPath(product)),
    priceMinor: getOffer(product.id).priceMinor,
    maxQuantity: 1,
    meta: `${product.designCount} designs · ${product.brushes ? 'PNG + brushes' : 'PNG'}`,
    sales: sales[product.id],
    image: await prepareListingImage({
      file: coverFile(product),
      alt: product.coverAlt ?? `${product.title} listing cover`,
    }),
  })),
);
const physical: StoreProduct[] = physicalProducts.map((product) => ({
  key: `physical:${product.slug}`,
  kind: 'physical',
  title: product.title,
  href: url(physicalPath(product)),
  priceMinor: product.priceMinor,
  maxQuantity: 99,
  meta: 'T-shirt concept',
  image: {
    src: asset(product.image),
    srcset: product.webImage
      ? `${asset(product.webImage)}-480.webp 480w, ${asset(product.webImage)}-960.webp 960w`
      : undefined,
    alt: product.alt,
    width: product.imageWidth,
    height: product.imageHeight,
  },
}));
export const storeProducts: StoreProduct[] = [...digital, ...physical];
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
