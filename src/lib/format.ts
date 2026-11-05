const vnd = new Intl.NumberFormat('vi-VN');

/** 1250000 → "1.250.000 đ" (as in the design) */
export function formatVnd(amount: number): string {
  return `${vnd.format(amount)} đ`;
}

const dateTime = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' });

export function formatDateTime(value: string | Date): string {
  return dateTime.format(typeof value === 'string' ? new Date(value) : value);
}
