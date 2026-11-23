import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { queryKeys } from '../../lib/queries';
import type { Customer } from '../../types/api';

/**
 * Store the logged-in customer (or null after logout). Prices depend on the account (business
 * price list), so every other cached query is refetched.
 */
export function useSetCurrentCustomer() {
  const queryClient = useQueryClient();
  return useCallback(
    async (customer: Customer | null) => {
      queryClient.setQueryData(queryKeys.me, customer);
      await queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] !== 'me' });
    },
    [queryClient],
  );
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_PATTERN = /^(0|\+?84)[0-9]{9}$/;
