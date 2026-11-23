import type { FulfillmentStatus, OrderStatus, PaymentStatus } from '../../types/api';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};
export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  unpaid: 'Chưa thanh toán (COD)',
  paid: 'Đã thanh toán',
  refunded: 'Đã hoàn tiền',
};
export const FULFILLMENT_STATUS_LABEL: Record<FulfillmentStatus, string> = {
  unfulfilled: 'Chưa giao',
  packing: 'Đang chuẩn bị hàng',
  shipped: 'Đang giao',
  delivered: 'Đã giao',
  returned: 'Đã hoàn trả',
};
export const BUSINESS_STATUS_LABEL = {
  pending: 'Đang chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Chưa được duyệt',
} as const;
