import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { CategoryNode, Collection, ProductCard, ProductDetail, StoreInfo } from '../types/api';
import { api, apiPaged, toQuery } from './api';

// Query keys live here so the same data is shared between pages (and can be pre-filled in tests).

export interface ProductListParams {
  q?: string;
  category?: string;
  collection?: string;
  audience?: string[];
  need?: string[];
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'name_asc';
  page?: number;
  pageSize?: number;
}

export const queryKeys = {
  store: ['store'] as const,
  categories: ['categories'] as const,
  collections: ['collections'] as const,
  products: (params: ProductListParams) => ['products', params] as const,
  product: (slug: string) => ['product', slug] as const,
  page: (slug: string) => ['page', slug] as const,
};

/** Store info for header/footer. Null fields are shown as "[Cập nhật]". */
export function useStoreInfo() {
  return useQuery({ queryKey: queryKeys.store, queryFn: () => api<StoreInfo>('/api/store'), staleTime: 5 * 60_000 });
}

export function useCategories() {
  return useQuery({ queryKey: queryKeys.categories, queryFn: () => api<CategoryNode[]>('/api/categories'), staleTime: 5 * 60_000 });
}

export function useCollections() {
  return useQuery({ queryKey: queryKeys.collections, queryFn: () => api<Collection[]>('/api/collections'), staleTime: 5 * 60_000 });
}

export function useProducts(params: ProductListParams) {
  return useQuery({
    queryKey: queryKeys.products(params),
    queryFn: ({ signal }) => apiPaged<ProductCard>(`/api/products${toQuery({ ...params })}`, { signal }),
    placeholderData: keepPreviousData,
  });
}

export function useProduct(slug: string) {
  return useQuery({ queryKey: queryKeys.product(slug), queryFn: ({ signal }) => api<ProductDetail>(`/api/products/${encodeURIComponent(slug)}`, { signal }) });
}
