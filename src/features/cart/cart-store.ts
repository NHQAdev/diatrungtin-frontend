import { useSyncExternalStore } from 'react';
import type { CartItemInput } from '../../types/api';

// The cart lives in the browser (localStorage), for guests and logged-in customers alike.
// It only stores WHAT the customer picked. Prices shown in the cart/checkout always come from
// POST /api/checkout/quote — the saved name/price below is just for a quick first render.

export interface CartItem extends CartItemInput {
  /** Snapshot for display only; never sent to the server. */
  display: { productName: string; productSlug: string; variantName: string; imageUrl: string | null; unitPrice: number };
}

const STORAGE_KEY = 'dtt-cart-v1';
const MAX_QUANTITY = 99;

/** The same variant with a different number of extra beads is a separate line. */
const lineKey = (item: Pick<CartItem, 'variantId' | 'extraBeads'>) => `${item.variantId}:${item.extraBeads}`;

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as CartItem[]).filter((item) => typeof item?.variantId === 'string' && item.quantity > 0) : [];
  } catch {
    return [];
  }
}

let items: CartItem[] = typeof localStorage === 'undefined' ? [] : load();
const listeners = new Set<() => void>();

function save(next: CartItem[]) {
  items = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Private mode / storage full: the cart still works for this tab.
  }
  listeners.forEach((listener) => listener());
}

// Keep several open tabs in sync.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
      items = load();
      listeners.forEach((listener) => listener());
    }
  });
}

export const cart = {
  add(item: CartItem) {
    const existing = items.find((line) => lineKey(line) === lineKey(item));
    if (existing) {
      save(items.map((line) => (line === existing ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + item.quantity), display: item.display } : line)));
    } else {
      save([...items, { ...item, quantity: Math.min(MAX_QUANTITY, item.quantity) }]);
    }
  },
  setQuantity(variantId: string, extraBeads: number, quantity: number) {
    if (quantity <= 0) return cart.remove(variantId, extraBeads);
    save(items.map((line) => (lineKey(line) === lineKey({ variantId, extraBeads }) ? { ...line, quantity: Math.min(MAX_QUANTITY, quantity) } : line)));
  },
  remove(variantId: string, extraBeads: number) {
    save(items.filter((line) => lineKey(line) !== lineKey({ variantId, extraBeads })));
  },
  clear() {
    save([]);
  },
  /** What the backend needs for /checkout/quote and /orders. */
  toRequestItems(lines: CartItem[] = items): CartItemInput[] {
    return lines.map(({ variantId, quantity, extraBeads }) => ({ variantId, quantity, extraBeads }));
  },
};

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useCart() {
  const lines = useSyncExternalStore(subscribe, () => items, () => items);
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  return { lines, count };
}
