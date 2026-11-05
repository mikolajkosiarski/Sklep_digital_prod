export function formatMoney(priceMinor: number): string {
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(
    priceMinor / 100,
  );
}
