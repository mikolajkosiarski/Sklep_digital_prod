import { getCollection, type CollectionEntry } from 'astro:content';

export type JournalEntry = CollectionEntry<'journal'>;
export const JOURNAL_PAGE_SIZE = 6;

/** One publication order for home, archive and previous/next navigation. */
export async function getJournalEntries(): Promise<JournalEntry[]> {
  const entries = await getCollection('journal');
  return entries.sort(
    (a, b) =>
      b.data.published.localeCompare(a.data.published) ||
      a.data.order - b.data.order ||
      a.id.localeCompare(b.id),
  );
}

export function journalDate(value: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}
