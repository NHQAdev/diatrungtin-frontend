import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { CartItemInput, Quote } from '../../types/api';

/**
 * Server-side prices for the current cart (POST /api/checkout/quote). The server is the only
 * source of truth for prices, stock and shipping; the cart only stores what was picked.
 */
export function useQuote(items: CartItemInput[]) {
  return useQuery({
    queryKey: ['quote', items] as const,
    queryFn: ({ signal }) => api<Quote>('/api/checkout/quote', { method: 'POST', body: { items }, signal }),
    enabled: items.length > 0,
    // Keep showing the last prices while a quantity change is being re-priced.
    placeholderData: keepPreviousData,
    staleTime: 0,
    refetchOnWindowFocus: true,
    retry: false,
  });
}

export const lineKey = (line: { variantId: string; extraBeads: number }) => `${line.variantId}:${line.extraBeads}`;
