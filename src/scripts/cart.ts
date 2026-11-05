import {
  cartStorageKey,
  parseCart,
  serializeCart,
  setCartQuantity,
  cartTotalMinor,
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
  let items: CartLine[] = [];
  const read = () => {
    try {
      items = parseCart(localStorage.getItem(cartStorageKey), products);
    } catch {
      /* Keep this tab's cart when storage is blocked. */
    }
  };
  const render = () => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll<HTMLElement>('[data-cart-count]').forEach((node) => {
      node.textContent = String(count);
    });
    document.querySelectorAll<HTMLElement>('[data-cart-empty]').forEach((node) => {
      node.hidden = items.length > 0;
    });
    document.querySelectorAll<HTMLElement>('[data-cart-filled]').forEach((node) => {
      node.hidden = items.length === 0;
    });
    document.querySelectorAll<HTMLElement>('[data-cart-row]').forEach((row) => {
      const line = items.find((item) => item.key === row.dataset.cartRow);
      row.hidden = !line;
      if (!line) return;
      const product = known.get(line.key)!;
      const quantity = row.querySelector<HTMLInputElement>('[data-cart-quantity]');
      if (quantity) quantity.value = String(line.quantity);
      row.querySelectorAll<HTMLButtonElement>('[data-cart-step]').forEach((button) => {
        const next = line.quantity + Number(button.dataset.cartStep);
        button.disabled = next < 1 || next > product.maxQuantity;
      });
      const total = row.querySelector<HTMLElement>('[data-line-total]');
      if (total) total.textContent = formatMoney(line.quantity * product.priceMinor);
    });
    document.querySelectorAll<HTMLElement>('[data-cart-total]').forEach((node) => {
      node.textContent = formatMoney(cartTotalMinor(items, products));
    });
  };
  const save = (message: string) => {
    try {
      localStorage.setItem(cartStorageKey, serializeCart(items));
    } catch {
      message += ' This cart is kept only in this tab.';
    }
    render();
    if (status) status.textContent = message;
  };
  document.querySelectorAll<HTMLButtonElement>('[data-cart-add]').forEach((button) => {
    const key = button.dataset.cartAdd;
    if (!key || !known.has(key)) return;
    button.disabled = false;
    button.setAttribute('aria-label', `Add ${known.get(key)!.title} to cart`);
    button.addEventListener('click', () => {
      read();
      const product = known.get(key)!;
      const current = items.find((item) => item.key === key)?.quantity ?? 0;
      if (current >= product.maxQuantity) {
        if (status)
          status.textContent = `${product.title} is already in your cart${product.maxQuantity > 1 ? ' at the quantity limit' : ''}.`;
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
  document.querySelectorAll<HTMLButtonElement>('[data-cart-step]').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.cartKey;
      const step = Number(button.dataset.cartStep);
      if (!key || !known.has(key) || ![-1, 1].includes(step)) return;
      read();
      const line = items.find((item) => item.key === key);
      if (!line) return;
      const next = line.quantity + step;
      if (next < 1 || next > known.get(key)!.maxQuantity) return;
      items = setCartQuantity(items, key, next, products);
      save('Cart quantity updated.');
    });
  });
  document.querySelectorAll<HTMLInputElement>('[data-cart-quantity]').forEach((input) => {
    const updateQuantity = (commit: boolean) => {
      const key = input.dataset.cartQuantity;
      if (!key || !known.has(key)) return;
      const quantity = Number(input.value);
      if (
        !input.value ||
        !Number.isSafeInteger(quantity) ||
        quantity < 1 ||
        quantity > known.get(key)!.maxQuantity
      ) {
        if (commit) {
          render();
          if (status) status.textContent = 'Choose a quantity from 1 to 99.';
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
  addEventListener('storage', (event) => {
    if (event.key === cartStorageKey || event.key === null) {
      read();
      render();
    }
  });
  read();
  render();
}
