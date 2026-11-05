export interface SalesSnapshot {
  asOf: string;
  period: string;
  metric: string;
  products: { pack: string; transactions: number; renewals: number }[];
}

/** Keep transaction counts distinct from renewals and retain the evidence date. */
export function readSalesSnapshot(data: SalesSnapshot) {
  if (data.period !== 'all-time' || data.metric !== 'salesTransactions') {
    throw new Error('Expected all-time Etsy sales transactions.');
  }
  const date = new Date(`${data.asOf}T00:00:00Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(data.asOf) ||
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== data.asOf
  ) {
    throw new Error('Sales evidence needs a valid ISO snapshot date.');
  }
  if (!Array.isArray(data.products)) throw new Error('Sales evidence needs a product list.');
  const counts: Record<string, number> = {};
  for (const { pack, transactions, renewals } of data.products) {
    if (typeof pack !== 'string' || !/^\d+$/.test(pack) || Object.hasOwn(counts, pack)) {
      throw new Error('Each pack must have a unique numeric identifier.');
    }
    if (![transactions, renewals].every((value) => Number.isSafeInteger(value) && value >= 0)) {
      throw new Error('Sales and renewal counts must be non-negative integers.');
    }
    counts[pack] = transactions;
  }
  const asOfLabel = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
  return { counts, note: `All-time Etsy sales transactions per listing, as of ${asOfLabel}.` };
}
