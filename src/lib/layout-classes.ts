/**
 * Below the `sm` breakpoint a product grid becomes one horizontal, snapping
 * row that bleeds to the screen edge; the next card stays partly visible so
 * the row reads as scrollable. From `sm` up the grid styles apply unchanged.
 * Full class names are kept in source so Tailwind can detect them.
 */
export const mobileProductRail = [
  'max-sm:flex max-sm:max-w-none max-sm:gap-4',
  'max-sm:-mx-6 max-sm:px-6 max-sm:pb-4',
  'max-sm:overflow-x-auto max-sm:overscroll-x-contain',
  'max-sm:snap-x max-sm:snap-mandatory max-sm:scroll-px-6',
  'max-sm:*:shrink-0 max-sm:*:basis-4/5 max-sm:*:snap-start',
].join(' ');
