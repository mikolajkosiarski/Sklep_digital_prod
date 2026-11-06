// Demo checkout. Nothing typed here is sent anywhere: a valid form stores only
// an order number, the product keys and the total for the account page to show,
// then empties the cart.
import {
  cartStorageKey,
  cartTotalMinor,
  demoOrderKey,
  normalisePromoCode,
  parseCart,
  promoDiscountMinor,
  promoStorageKey,
  type CartProduct,
} from '../lib/cart-state';
import { url } from '../lib/paths';

const form = document.querySelector<HTMLFormElement>('[data-checkout]');
const catalog = document.querySelector('#cart-catalog');
if (form && catalog?.textContent) {
  const products: CartProduct[] = JSON.parse(catalog.textContent);
  const errors = form.querySelector<HTMLElement>('[data-checkout-errors]');
  const errorList = errors?.querySelector('ul');
  const invoice = form.querySelector<HTMLInputElement>('[data-invoice-toggle]');
  const invoiceFields = form.querySelector<HTMLElement>('[data-invoice-fields]');
  const deliveryLabel = form.querySelector<HTMLElement>('[data-checkout-delivery]');

  const syncInvoice = () => {
    if (!invoice || !invoiceFields) return;
    invoiceFields.hidden = !invoice.checked;
    invoiceFields.querySelectorAll('input').forEach((input) => {
      input.required = invoice.checked;
      if (!invoice.checked) input.removeAttribute('aria-invalid');
    });
  };
  const syncDelivery = () => {
    const chosen = form.querySelector<HTMLInputElement>('input[name="delivery"]:checked');
    if (deliveryLabel && chosen) deliveryLabel.textContent = chosen.dataset.deliveryLabel ?? '';
  };
  const labelFor = (field: HTMLInputElement) => {
    if (field.type === 'checkbox') return field.closest('label')?.textContent?.trim() ?? '';
    return form.querySelector(`label[for="${field.id}"]`)?.textContent?.trim() ?? field.name;
  };

  invoice?.addEventListener('change', syncInvoice);
  form.addEventListener('change', (event) => {
    if ((event.target as HTMLInputElement).name === 'delivery') syncDelivery();
    const field = event.target as HTMLInputElement;
    if (field.checkValidity()) field.removeAttribute('aria-invalid');
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const fields = Array.from(form.querySelectorAll<HTMLInputElement>('input'));
    const invalid = fields.filter((field) => !field.checkValidity());
    fields.forEach((field) => field.toggleAttribute('aria-invalid', invalid.includes(field)));
    if (invalid.length && errors && errorList) {
      errorList.replaceChildren(
        ...invalid.map((field) => {
          const item = document.createElement('li');
          const link = document.createElement('a');
          link.href = `#${field.id || field.name}`;
          link.textContent = labelFor(field);
          link.addEventListener('click', (click) => {
            click.preventDefault();
            field.focus();
          });
          item.append(link);
          return item;
        }),
      );
      errors.hidden = false;
      errors.querySelector('a')?.focus();
      return;
    }
    if (errors) errors.hidden = true;

    let items: ReturnType<typeof parseCart> = [];
    let promo: string | null = null;
    try {
      items = parseCart(localStorage.getItem(cartStorageKey), products);
      promo = normalisePromoCode(localStorage.getItem(promoStorageKey));
    } catch {
      /* Storage blocked: nothing to order. */
    }
    if (!items.length) {
      location.href = url('/cart/');
      return;
    }
    const subtotal = cartTotalMinor(items, products);
    const order = {
      number: `VM-${1043 + Math.floor(Math.random() * 900)}`,
      date: new Date().toISOString().slice(0, 10),
      items: items.map(({ key }) => key),
      totalMinor: subtotal - promoDiscountMinor(subtotal, promo),
    };
    try {
      sessionStorage.setItem(demoOrderKey, JSON.stringify(order));
      localStorage.removeItem(cartStorageKey);
      localStorage.removeItem(promoStorageKey);
    } catch {
      /* The confirmation still shows; the cart may stay filled. */
    }
    location.href = url('/account/?order=success');
  });

  syncInvoice();
  syncDelivery();
}
