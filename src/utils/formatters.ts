export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount).replace('₫', '₫');
}

export function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'tr';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

export function generateOrderCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'SP';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getStatusBadgeInfo(status: string): { label: string; bg: string; text: string } {
  switch (status) {
    case 'pending':
      return { label: 'Chờ xác nhận', bg: 'bg-amber-100', text: 'text-amber-700' };
    case 'processing':
      return { label: 'Đang chuẩn bị hàng', bg: 'bg-blue-100', text: 'text-blue-700' };
    case 'shipping':
      return { label: 'Đang giao hàng', bg: 'bg-purple-100', text: 'text-purple-700' };
    case 'delivered':
      return { label: 'Đã giao thành công', bg: 'bg-emerald-100', text: 'text-emerald-700' };
    case 'cancelled':
      return { label: 'Đã hủy', bg: 'bg-red-100', text: 'text-red-700' };
    case 'refund_pending':
      return { label: 'Yêu cầu trả hàng/hoàn tiền', bg: 'bg-rose-100', text: 'text-rose-700' };
    case 'refunded':
      return { label: 'Đã trả hàng/hoàn tiền', bg: 'bg-slate-200', text: 'text-slate-800' };
    default:
      return { label: status, bg: 'bg-slate-100', text: 'text-slate-700' };
  }
}
