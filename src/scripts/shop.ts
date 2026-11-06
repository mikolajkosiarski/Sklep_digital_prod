// Filters and sorting for /shop/. Every product is already in the HTML; this
// script only hides, reorders and reports. Filter groups combine with AND, the
// options inside one group with OR. The state is mirrored in the URL so a
// filtered view can be shared or reloaded.
const shop = document.querySelector<HTMLElement>('[data-shop]');
if (shop) {
  const form = shop.querySelector<HTMLFormElement>('[data-shop-filters]');
  const sortBox = shop.querySelector<HTMLElement>('[data-shop-sort]');
  const sort = sortBox?.querySelector<HTMLSelectElement>('select');
  const grid = shop.querySelector<HTMLElement>('[data-shop-items]');
  const count = shop.querySelector<HTMLElement>('[data-shop-count]');
  const empty = shop.querySelector<HTMLElement>('[data-shop-empty]');
  const clear = shop.querySelector<HTMLButtonElement>('[data-shop-clear]');
  const price = form?.querySelector<HTMLInputElement>('input[name="price"]');
  const priceValue = form?.querySelector<HTMLOutputElement>('output');
  const items = Array.from(shop.querySelectorAll<HTMLElement>('[data-shop-item]'));

  if (form && sort && grid && count && empty && price && priceValue) {
    const groups = ['style', 'format', 'size'] as const;
    const sorters: Record<string, (a: HTMLElement, b: HTMLElement) => number> = {
      popular: (a, b) => num(b, 'sales') - num(a, 'sales') || num(a, 'index') - num(b, 'index'),
      'price-asc': (a, b) => num(a, 'price') - num(b, 'price'),
      'price-desc': (a, b) => num(b, 'price') - num(a, 'price'),
      name: (a, b) => (a.dataset.title ?? '').localeCompare(b.dataset.title ?? '', 'en'),
      designs: (a, b) => num(b, 'designs') - num(a, 'designs'),
    };
    function num(item: HTMLElement, key: string) {
      return Number(item.dataset[key] ?? 0);
    }
    const checked = (group: string) =>
      Array.from(form.querySelectorAll<HTMLInputElement>(`input[name="${group}"]:checked`)).map(
        (input) => input.value,
      );
    const matches = (item: HTMLElement, group: (typeof groups)[number], values: string[]) => {
      if (!values.length) return true;
      if (group === 'style') {
        const styles = (item.dataset.styles ?? '').split(' ');
        return values.some((value) => styles.includes(value));
      }
      return values.includes(item.dataset[group] ?? '');
    };

    const apply = (updateURL: boolean) => {
      const selected = Object.fromEntries(groups.map((group) => [group, checked(group)]));
      const maxMinor = Number(price.value) * 100;
      priceValue.textContent = `€${price.value}`;
      let visible = 0;
      for (const item of items) {
        const show =
          num(item, 'price') <= maxMinor &&
          groups.every((group) => matches(item, group, selected[group]));
        item.hidden = !show;
        if (show) visible++;
      }
      const order = sorters[sort.value] ? sort.value : 'popular';
      [...items].sort(sorters[order]).forEach((item) => grid.append(item));
      count.textContent = `${visible} ${visible === 1 ? 'collection' : 'collections'}`;
      empty.hidden = visible > 0;
      if (updateURL) {
        const next = new URL(location.href);
        for (const group of groups) {
          next.searchParams.delete(group);
          for (const value of selected[group]) next.searchParams.append(group, value);
        }
        if (price.value === price.max) next.searchParams.delete('max');
        else next.searchParams.set('max', price.value);
        if (order === 'popular') next.searchParams.delete('sort');
        else next.searchParams.set('sort', order);
        history.replaceState(null, '', next);
      }
    };

    // Restore a shared or reloaded view, ignoring values that are not options.
    const params = new URLSearchParams(location.search);
    for (const group of groups)
      for (const value of params.getAll(group)) {
        const input = form.querySelector<HTMLInputElement>(
          `input[name="${group}"][value="${CSS.escape(value)}"]`,
        );
        if (input) input.checked = true;
      }
    const max = Number(params.get('max'));
    if (Number.isFinite(max) && max >= Number(price.min) && max <= Number(price.max))
      price.value = String(max);
    const sortParam = params.get('sort');
    if (sortParam && sorters[sortParam]) sort.value = sortParam;

    form.addEventListener('input', () => apply(true));
    form.addEventListener('submit', (event) => event.preventDefault());
    // A reset event fires before the inputs change, so apply on the next frame.
    form.addEventListener('reset', () => requestAnimationFrame(() => apply(true)));
    sort.addEventListener('change', () => apply(true));
    clear?.addEventListener('click', () => {
      form.reset();
      form.querySelector<HTMLInputElement>('input')?.focus();
    });

    // Below the lg breakpoint the filters start collapsed so products come first.
    const panel = form.querySelector<HTMLDetailsElement>('[data-shop-panel]');
    const active = form.querySelector<HTMLElement>('[data-shop-active]');
    const wide = matchMedia('(min-width: 62rem)');
    const syncPanel = () => {
      if (panel) panel.open = wide.matches;
    };
    wide.addEventListener('change', syncPanel);
    syncPanel();
    const showActive = () => {
      if (!active) return;
      const n =
        form.querySelectorAll('input[type="checkbox"]:checked').length +
        (price.value === price.max ? 0 : 1);
      active.textContent = n ? `${n} active` : '';
    };
    form.addEventListener('input', showActive);
    form.addEventListener('reset', () => requestAnimationFrame(showActive));
    showActive();

    form.hidden = false;
    if (sortBox) sortBox.hidden = false;
    apply(false);
  }
}
