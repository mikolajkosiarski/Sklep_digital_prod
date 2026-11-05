import { getCollection, type CollectionEntry } from 'astro:content';
import offerData from '../data/digital-offers.json';
import catalog from '../data/shop-content.json';

export type DigitalOffer = CollectionEntry<'products'>['data'];
export type OfferImage = DigitalOffer['gallery'][number];

// Historical Etsy prices are references, not live checkout offers.
export const priceReference = offerData.priceReference;

// Astro validates every entry before cards or product pages read its metadata.
export const offerEntries = await getCollection('products');
const catalogIds = new Set(catalog.digital.map(({ id }) => id));
const offers = new Map(offerEntries.map((entry) => [entry.id, entry.data]));
const listingFiles = import.meta.glob('../assets/listings/*.{jpg,jpeg,png,webp}');

for (const { id, data } of offerEntries) {
  if (!catalogIds.has(id)) {
    throw new Error(`Product description ${id}.md has no matching catalogue product`);
  }
  if (new Set(data.relatedIds).size !== data.relatedIds.length) {
    throw new Error(`Duplicate related product in ${id}.md`);
  }
  for (const relatedId of data.relatedIds) {
    if (relatedId === id || !offers.has(relatedId)) {
      throw new Error(`Invalid related product ${relatedId} in ${id}.md`);
    }
  }
  const mediaFiles = data.gallery.map(({ file }) => file);
  if (data.video) mediaFiles.push(data.video.poster);
  for (const file of mediaFiles) {
    if (!Object.hasOwn(listingFiles, `../assets/listings/${file}`)) {
      throw new Error(`Missing local listing image ${file} in ${id}.md`);
    }
  }
}

for (const id of catalogIds) {
  if (!offers.has(id)) throw new Error(`Missing product description ${id}.md`);
}

export function getOffer(id: string): DigitalOffer {
  const offer = offers.get(id);
  if (!offer) throw new Error(`Missing product details for digital collection ${id}`);
  return offer;
}
