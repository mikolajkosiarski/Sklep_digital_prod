import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
import { coverSource, type DigitalProduct } from './catalog';
import { getOffer, type OfferImage } from './offers';

const images = import.meta.glob<ImageMetadata>('../assets/listings/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});

export async function prepareListingImage(image: OfferImage) {
  const source = images[`../assets/listings/${image.file}`];
  if (!source) throw new Error(`Missing listing image: ${image.file}`);
  const width = Math.min(1600, source.width);
  const optimized = await getImage({
    src: source,
    width,
    widths: [...new Set([160, 480, 800, 1200, width].filter((size) => size <= width))],
    format: 'webp',
    quality: 82,
  });
  return {
    src: optimized.src,
    srcset: optimized.srcSet.attribute,
    alt: image.alt,
    width,
    height: Math.round((source.height / source.width) * width),
  };
}

export async function getProductGallery(product: DigitalProduct) {
  return Promise.all(
    [
      ...getOffer(product.id).gallery,
      {
        file: coverSource(product).split('/').at(-1)!,
        alt:
          product.coverAlt ??
          `${product.title} — original ${product.designCount}-design listing cover`,
      },
    ].map(prepareListingImage),
  );
}
