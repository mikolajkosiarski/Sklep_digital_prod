import { getCollection, type CollectionEntry } from 'astro:content';

export type InformationEntry = CollectionEntry<'information'>;
export const informationPath = (entry: InformationEntry) => `/${entry.id}/`;
export async function getInformationEntries() {
  return (await getCollection('information')).sort(
    (a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id),
  );
}
