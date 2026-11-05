import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
import { coverFile, type DigitalProduct } from './catalog';
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

/** A 1200 px JPEG of a listing image for link previews and structured data. */
export async function getSocialImage(file: string): Promise<string> {
  const source = images[`../assets/listings/${file}`];
  if (!source) throw new Error(`Missing listing image: ${file}`);
  const image = await getImage({
    src: source,
    width: Math.min(1200, source.width),
    format: 'jpeg',
    quality: 82,
  });
  return image.src;
}

export async function getProductGallery(product: DigitalProduct) {
  return Promise.all(
    [
      ...getOffer(product.id).gallery,
      {
        file: coverFile(product),
        alt:
          product.coverAlt ??
          `${product.title} — original ${product.designCount}-design listing cover`,
      },
    ].map(prepareListingImage),
  );
}
