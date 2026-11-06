import {
  cartStorageKey,
  parseCart,
  serializeCart,
  setCartQuantity,
  cartTotalMinor,
  demoPromoCodes,
  normalisePromoCode,
  promoDiscountMinor,
  promoStorageKey,
  type CartLine,
  type CartProduct,
} from '../lib/cart-state';
import { formatMoney } from '../lib/money';
interface Product extends CartProduct {
  title: string;
}
const data = document.querySelector('#cart-catalog');
if (data?.textContent) {
  const products: Product[] = JSON.parse(data.textContent);
  const known = new Map(products.map((product) => [product.key, product]));
  const status = document.querySelector<HTMLElement>('[data-cart-status]');
  const toast = document.querySelector<HTMLElement>('[data-cart-toast]');
  const toastLink = document.querySelector<HTMLElement>('[data-cart-toast-link]');
  const onCartPage = document.querySelector('[data-cart-row]') !== null;
  let toastTimer: number | undefined;
  let items: CartLine[] = [];
  let promo: string | null = null;
  // Shown visually for a few seconds and announced through the same live region.
  const announce = (message: string) => {
    if (!status) return;
    status.textContent = message;
    if (!toast || onCartPage) return;
    if (toastLink) toastLink.hidden = false;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      if (toast.contains(document.activeElement)) return;
      toast.classList.remove('is-visible');
      if (toastLink) toastLink.hidden = true;
    }, 5000);
  };
  const read = () => {
    try {
      items = parseCart(localStorage.getItem(cartStorageKey), products);
      promo = normalisePromoCode(localStorage.getItem(promoStorageKey));
    } catch {
      /* Keep this tab's cart when storage is blocked. */
    }
  };
  const setText = (selector: string, text: string) =>
    document.querySelectorAll<HTMLElement>(selector).forEach((node) => {
      node.textContent = text;
    });
  const render = () => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    setText('[data-cart-count]', String(count));
    setText('[data-cart-noun]', count === 1 ? 'item' : 'items');
    document.querySelectorAll<HTMLButtonElement>('[data-cart-add]').forEach((button) => {
      const product = known.get(button.dataset.cartAdd ?? '');
      if (!product) return;
      const quantity = items.find((item) => item.key === product.key)?.quantity ?? 0;
      const full = quantity >= product.maxQuantity;
      const label = button.querySelector<HTMLElement>('.terminal-button__label');
      if (label) label.textContent = full ? 'In cart' : 'Add to cart';
      button.dataset.inCart = String(quantity > 0);
      button.setAttribute(
        'aria-label',
        full ? `${product.title} is in your cart` : `Add ${product.title} to cart`,
      );
    });
    document.querySelectorAll<HTMLElement>('[data-cart-empty]').forEach((node) => {
      node.hidden = items.length > 0;
    });
    document.querySelectorAll<HTMLElement>('[data-cart-filled]').forEach((node) => {
      node.hidden = items.length === 0;
    });
    // Cart table rows and the shorter checkout summary rows.
    document.querySelectorAll<HTMLElement>('[data-cart-row], [data-summary-row]').forEach((row) => {
      const key = row.dataset.cartRow ?? row.dataset.summaryRow;
      const line = items.find((item) => item.key === key);
      row.hidden = !line;
      if (!line) return;
      const product = known.get(line.key)!;
      const quantity = row.querySelector<HTMLInputElement>('[data-cart-quantity]');
      if (quantity) quantity.value = String(line.quantity);
      const total = row.querySelector<HTMLElement>('[data-line-total]');
      if (total) total.textContent = formatMoney(line.quantity * product.priceMinor);
    });
    const subtotal = cartTotalMinor(items, products);
    const discount = promoDiscountMinor(subtotal, promo);
    setText('[data-cart-subtotal]', formatMoney(subtotal));
    setText('[data-cart-discount]', `−${formatMoney(discount)}`);
    setText('[data-cart-promo-label]', promo ? `(${promo})` : '');
    document.querySelectorAll<HTMLElement>('[data-cart-discount-row]').forEach((row) => {
      row.hidden = discount === 0;
    });
    setText('[data-cart-total]', formatMoney(subtotal - discount));
  };
  const save = (message: string) => {
    try {
      localStorage.setItem(cartStorageKey, serializeCart(items));
      if (promo) localStorage.setItem(promoStorageKey, promo);
      else localStorage.removeItem(promoStorageKey);
    } catch {
      message += ' This cart is kept only in this tab.';
    }
    render();
    announce(message);
  };
  document.querySelectorAll<HTMLButtonElement>('[data-cart-add]').forEach((button) => {
    const key = button.dataset.cartAdd;
    if (!key || !known.has(key)) return;
    button.disabled = false;
    button.addEventListener('click', () => {
      read();
      const product = known.get(key)!;
      const current = items.find((item) => item.key === key)?.quantity ?? 0;
      if (current >= product.maxQuantity) {
        announce(
          `${product.title} is already in your cart${product.maxQuantity > 1 ? ' at the quantity limit' : ''}.`,
        );
        return;
      }
      items = setCartQuantity(items, key, current + 1, products);
      save(`${product.title} added to cart.`);
    });
  });
  document.querySelectorAll<HTMLButtonElement>('[data-cart-remove]').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.cartRemove;
      if (!key || !known.has(key)) return;
      const rows = [...document.querySelectorAll<HTMLElement>('[data-cart-row]')].filter(
        (row) => !row.hidden,
      );
      const index = rows.findIndex((row) => row.dataset.cartRow === key);
      const next = rows[index + 1] ?? rows[index - 1];
      read();
      items = setCartQuantity(items, key, 0, products);
      save(`${known.get(key)!.title} removed from cart.`);
      (
        next?.querySelector<HTMLButtonElement>('[data-cart-remove]') ??
        document.querySelector<HTMLAnchorElement>('[data-cart-empty] a')
      )?.focus();
    });
  });
  document.querySelectorAll<HTMLInputElement>('[data-cart-quantity]').forEach((input) => {
    const updateQuantity = (commit: boolean) => {
      const key = input.dataset.cartQuantity;
      const product = key ? known.get(key) : undefined;
      if (!key || !product) return;
      const quantity = Number(input.value);
      if (
        !input.value ||
        !Number.isSafeInteger(quantity) ||
        quantity < 1 ||
        quantity > product.maxQuantity
      ) {
        if (commit) {
          render();
          announce(
            product.maxQuantity === 1
              ? 'Each digital collection is licensed once per order.'
              : `Choose a quantity from 1 to ${product.maxQuantity}.`,
          );
        }
        return;
      }
      read();
      items = setCartQuantity(items, key, quantity, products);
      save('Cart quantity updated.');
    };
    input.addEventListener('input', () => updateQuantity(false));
    input.addEventListener('change', () => updateQuantity(true));
  });
  document.querySelectorAll<HTMLFormElement>('[data-cart-promo]').forEach((form) => {
    const input = form.querySelector<HTMLInputElement>('input');
    const message = form.querySelector<HTMLElement>('[data-cart-promo-status]');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!input) return;
      read();
      const code = normalisePromoCode(input.value);
      if (!input.value.trim()) {
        promo = null;
        save('Promo code removed.');
        if (message) message.textContent = '';
        return;
      }
      if (!code) {
        if (message) message.textContent = 'This code is not valid.';
        input.setAttribute('aria-invalid', 'true');
        return;
      }
      promo = code;
      input.value = code;
      input.removeAttribute('aria-invalid');
      save(`Promo code ${code} applied.`);
      if (message)
        message.textContent = `${code} applied: ${demoPromoCodes[code]}% off the subtotal.`;
    });
  });
  addEventListener('storage', (event) => {
    if (event.key === cartStorageKey || event.key === promoStorageKey || event.key === null) {
      read();
      render();
    }
  });
  read();
  const promoInput = document.querySelector<HTMLInputElement>('[data-cart-promo] input');
  if (promoInput && promo) promoInput.value = promo;
  render();
}
