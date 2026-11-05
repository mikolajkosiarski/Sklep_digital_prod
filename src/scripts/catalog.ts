// All products are rendered in HTML. Filtering enhances the existing catalog.
const catalog = document.querySelector<HTMLElement>('[data-catalog]');
if (catalog) {
  const filters = catalog.querySelector<HTMLElement>('.catalog-filters');
  const buttons = Array.from(catalog.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const items = Array.from(catalog.querySelectorAll<HTMLElement>('.catalog-item'));
  const status = catalog.querySelector<HTMLElement>('.catalog-result');
  const apply = (filter: string | null | undefined, updateURL: boolean) => {
    const selected = buttons.some((button) => button.dataset.filter === filter) ? filter : 'all';
    let count = 0;
    items.forEach((item) => {
      item.hidden = selected !== 'all' && item.dataset.category !== selected;
      if (!item.hidden) count++;
    });
    buttons.forEach((button) =>
      button.setAttribute('aria-pressed', String(button.dataset.filter === selected)),
    );
    if (status) status.textContent = `${count} ${status.dataset.noun}`;
    if (updateURL) {
      const next = new URL(location.href);
      if (selected === 'all' || !selected) next.searchParams.delete('filter');
      else next.searchParams.set('filter', selected);
      history.replaceState(null, '', next);
    }
  };
  buttons.forEach((button) =>
    button.addEventListener('click', () => apply(button.dataset.filter, true)),
  );
  addEventListener('popstate', () =>
    apply(new URLSearchParams(location.search).get('filter'), false),
  );
  apply(new URLSearchParams(location.search).get('filter'), false);
  if (filters) filters.hidden = buttons.length === 0;
}
