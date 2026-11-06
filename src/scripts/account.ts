// Demo account panel: shows the order just placed in the demo checkout, keeps
// the section menu in sync and lets the sample address be edited in the page.
// Nothing is saved on a server.
import { demoOrderKey } from '../lib/cart-state';
import { formatMoney } from '../lib/money';

const titles: Record<string, string> = JSON.parse(
  document.querySelector('#account-titles')?.textContent || '{}',
);

// 1. Confirmation after the demo checkout.
const success = document.querySelector<HTMLElement>('[data-order-success]');
if (success && new URLSearchParams(location.search).get('order') === 'success') {
  try {
    const raw = sessionStorage.getItem(demoOrderKey);
    const order = raw ? JSON.parse(raw) : null;
    const valid =
      order &&
      typeof order.number === 'string' &&
      /^VM-\d{4}$/.test(order.number) &&
      typeof order.date === 'string' &&
      Array.isArray(order.items) &&
      Number.isSafeInteger(order.totalMinor);
    if (valid) {
      success.querySelector('[data-order-number]')!.textContent = order.number;
      success.querySelector('[data-order-total]')!.textContent = formatMoney(order.totalMinor);
      success.hidden = false;
      const template = document.querySelector<HTMLTemplateElement>('[data-order-template]');
      const rows = document.querySelector('[data-order-rows]');
      if (template && rows) {
        const row = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
        row.querySelector('[data-cell="number"]')!.textContent = order.number;
        row.querySelector('[data-cell="date"]')!.textContent = new Intl.DateTimeFormat('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }).format(new Date(`${order.date}T12:00:00Z`));
        row.querySelector('[data-cell="total"]')!.textContent = formatMoney(order.totalMinor);
        const list = row.querySelector('[data-cell="items"]')!;
        for (const key of order.items) {
          if (typeof key !== 'string' || !titles[key]) continue;
          const item = document.createElement('li');
          item.textContent = titles[key];
          list.append(item);
        }
        rows.prepend(row);
        const count = document.querySelector('[data-order-count]');
        if (count) count.textContent = String(Number(count.textContent) + 1);
      }
      success.tabIndex = -1;
      success.focus();
    }
  } catch {
    /* No confirmation without session storage. */
  }
}

// 2. Section menu: mark the section in view.
const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.account-nav a[href^="#"]'));
const mark = (id: string) =>
  links.forEach((link) => {
    if (link.hash === `#${id}`) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting);
    if (visible.length) mark(visible[0].target.id);
  },
  { rootMargin: '-20% 0px -60% 0px' },
);
links.forEach((link) => {
  const section = document.getElementById(link.hash.slice(1));
  if (section) observer.observe(section);
  link.addEventListener('click', () => mark(link.hash.slice(1)));
});

// 3. Address editing, kept in the page only.
const address = document.querySelector<HTMLElement>('[data-address]');
const edit = address?.querySelector<HTMLButtonElement>('[data-address-edit]');
const form = address?.querySelector<HTMLFormElement>('[data-address-form]');
const status = address?.querySelector<HTMLElement>('[data-address-status]');
if (address && edit && form) {
  const toggle = (open: boolean) => {
    form.hidden = !open;
    edit.setAttribute('aria-expanded', String(open));
    if (open) form.querySelector('input')?.focus();
    else edit.focus();
  };
  edit.addEventListener('click', () => toggle(form.hidden === true));
  address.querySelector('[data-address-cancel]')?.addEventListener('click', () => toggle(false));
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    for (const input of Array.from(form.querySelectorAll('input'))) {
      const target = address.querySelector(`[data-field="${input.name}"]`);
      if (target) target.textContent = input.value.trim();
    }
    if (status) status.textContent = 'Address updated on this page. The demo does not store it.';
    toggle(false);
  });
}

// 4. Settings form.
const settings = document.querySelector<HTMLFormElement>('[data-settings-form]');
settings?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!settings.reportValidity()) return;
  const note = settings.querySelector('[data-settings-status]');
  if (note) note.textContent = 'Settings saved on this page. The demo does not store them.';
});
