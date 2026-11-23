import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { StatusMessage } from '../../components/ui/StatusMessage';
import { apiPaged } from '../../lib/api';
import { formatDateTime, formatVnd } from '../../lib/format';
import type { FulfillmentStatus, OrderStatus, PaymentStatus } from '../../types/api';
import { AccountCard } from './AccountCard';
import { FULFILLMENT_STATUS_LABEL, ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL } from './labels';

interface OrderRow {
  code: string;
  createdAt: string;
  total: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
}

const PAGE_SIZE = 10;

export function OrdersSection() {
  const [page, setPage] = useState(1);
  const orders = useQuery({
    queryKey: ['account-orders', page],
    queryFn: () => apiPaged<OrderRow>(`/api/account/orders?page=${page}&pageSize=${PAGE_SIZE}`),
    placeholderData: keepPreviousData,
  });

  return (
    <AccountCard title="Đơn hàng" description="Các đơn bạn đã đặt khi đăng nhập.">
      {orders.isPending ? (
        <StatusMessage kind="loading">Đang tải đơn hàng…</StatusMessage>
      ) : orders.isError ? (
        <StatusMessage kind="error" action={<button type="button" onClick={() => orders.refetch()} className="font-semibold underline">Thử lại</button>}>
          Chưa tải được đơn hàng.
        </StatusMessage>
      ) : orders.data.data.length === 0 ? (
        <StatusMessage
          kind="empty"
          action={
            <Link to="/san-pham" className="inline-flex h-11 items-center rounded-md bg-brand px-6 font-semibold text-on-brand hover:bg-brand-dark">
              Mua sắm ngay
            </Link>
          }
        >
          Bạn chưa có đơn hàng nào.
        </StatusMessage>
      ) : (
        <>
          <ul className="divide-y divide-line">
            {orders.data.data.map((order) => (
              <li key={order.code} className="grid gap-1 py-4 first:pt-0 md:grid-cols-[1fr_auto] md:items-center md:gap-6">
                <div>
                  <p className="font-semibold text-ink">Đơn {order.code}</p>
                  <p className="text-sm text-ink-muted">{formatDateTime(order.createdAt)}</p>
                </div>
                <div className="md:text-right">
                  <p className="font-semibold text-ink">{formatVnd(order.total)}</p>
                  <p className="text-sm text-ink-muted">
                    {ORDER_STATUS_LABEL[order.orderStatus]}
                    {order.orderStatus !== 'cancelled' && ` · ${FULFILLMENT_STATUS_LABEL[order.fulfillmentStatus]} · ${PAYMENT_STATUS_LABEL[order.paymentStatus]}`}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          {orders.data.meta.totalPages > 1 && (
            <nav aria-label="Phân trang đơn hàng" className="mt-6 flex items-center justify-between text-[15px]">
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="h-11 rounded-md border border-line px-4 font-semibold disabled:opacity-40">
                Trang trước
              </button>
              <span className="text-ink-muted">
                Trang {page}/{orders.data.meta.totalPages}
              </span>
              <button type="button" disabled={page >= orders.data.meta.totalPages} onClick={() => setPage((p) => p + 1)} className="h-11 rounded-md border border-line px-4 font-semibold disabled:opacity-40">
                Trang sau
              </button>
            </nav>
          )}
        </>
      )}
    </AccountCard>
  );
}
