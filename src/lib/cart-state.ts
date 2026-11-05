export interface CartLine {
  key: string;
  quantity: number;
}
export interface CartProduct {
  key: string;
  priceMinor: number;
  maxQuantity: number;
}
export const cartStorageKey = 'visamore-cart-v1';

/** Storage contains IDs and quantities only. Prices always come from the catalogue. */
export function parseCart(raw: string | null, products: readonly CartProduct[]): CartLine[] {
  if (!raw || raw.length > 10000) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (
      !data ||
      typeof data !== 'object' ||
      !('version' in data) ||
      data.version !== 1 ||
      !('items' in data) ||
      !Array.isArray(data.items) ||
      data.items.length > 100
    )
      return [];
    const allowed = new Map(products.map((product) => [product.key, product]));
    const result = new Map<string, number>();
    for (const item of data.items) {
      if (
        !item ||
        typeof item !== 'object' ||
        typeof item.key !== 'string' ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity < 1
      )
        continue;
      const product = allowed.get(item.key);
      if (!product || item.quantity > product.maxQuantity) continue;
      result.set(
        item.key,
        Math.min(product.maxQuantity, (result.get(item.key) ?? 0) + item.quantity),
      );
    }
    return [...result].map(([key, quantity]) => ({ key, quantity }));
  } catch {
    return [];
  }
}
export function serializeCart(items: readonly CartLine[]): string {
  return JSON.stringify({ version: 1, items });
}
export function setCartQuantity(
  items: readonly CartLine[],
  key: string,
  quantity: number,
  products: readonly CartProduct[],
): CartLine[] {
  const product = products.find((entry) => entry.key === key);
  if (!product || !Number.isSafeInteger(quantity) || quantity < 0 || quantity > product.maxQuantity)
    return [...items];
  const next = items.filter((item) => item.key !== key);
  if (quantity) next.push({ key, quantity });
  return next;
}
export function cartTotalMinor(
  items: readonly CartLine[],
  products: readonly CartProduct[],
): number {
  const prices = new Map(products.map((product) => [product.key, product.priceMinor]));
  return items.reduce((total, item) => total + (prices.get(item.key) ?? 0) * item.quantity, 0);
}
