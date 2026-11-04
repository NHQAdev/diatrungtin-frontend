import { useQuery } from '@tanstack/react-query';
import type { StoreInfo } from '../types/api';
import { api } from './api';

/** Store info for header/footer. Null fields are shown as "[Cập nhật]". */
export function useStoreInfo() {
  return useQuery({ queryKey: ['store'], queryFn: () => api<StoreInfo>('/api/store'), staleTime: 5 * 60_000 });
}
