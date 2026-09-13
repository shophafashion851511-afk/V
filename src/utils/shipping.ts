import { ProductDimensions } from '../types';

export interface CarrierOption {
  id: string;
  code: string;
  name: string;
  shortName: string;
  estimatedDelivery: string;
  estimatedDays?: string;
  baseFee: number; // For package <= 500g
  extraPer500g: number;
  maxInstantWeight?: number;
  description: string;
  badgeColor: string;
}

export const CARRIER_OPTIONS: CarrierOption[] = [
  {
    id: 'spx',
    code: 'SPX',
    name: 'SPX Express (Giao hàng tiết kiệm & nhanh)',
    shortName: 'SPX Express',
    estimatedDelivery: '1 - 2 ngày',
    baseFee: 16500,
    extraPer500g: 5000,
    description: 'Mạng lưới bưu cục phủ sóng 63 tỉnh thành, tối ưu chi phí người bán',
    badgeColor: 'bg-orange-500 text-white'
  },
  {
    id: 'ghn',
    code: 'GHN',
    name: 'Giao Hàng Nhanh (GHN Express)',
    shortName: 'GHN Express',
    estimatedDelivery: '1 - 3 ngày',
    baseFee: 22000,
    extraPer500g: 6000,
    description: 'Giao hàng nhanh toàn quốc, hỗ trợ đối soát COD 24/7',
    badgeColor: 'bg-blue-600 text-white'
  },
  {
    id: 'vtp',
    code: 'VTP',
    name: 'Viettel Post (Bưu Chính Viettel Toàn Quốc)',
    shortName: 'Viettel Post',
    estimatedDelivery: '2 - 4 ngày',
    baseFee: 18000,
    extraPer500g: 5000,
    description: 'Bảo đảm an toàn hàng hóa, nhận hàng tận nơi vùng sâu vùng xa',
    badgeColor: 'bg-red-600 text-white'
  },
  {
    id: 'jt',
    code: 'JT',
    name: 'J&T Express (Chuyển Phát Nhanh J&T)',
    shortName: 'J&T Express',
    estimatedDelivery: '1 - 3 ngày',
    baseFee: 19500,
    extraPer500g: 5500,
    description: 'Ứng dụng công nghệ theo dõi lộ trình thời gian thực',
    badgeColor: 'bg-rose-600 text-white'
  },
  {
    id: 'instant',
    code: 'HOATOC',
    name: 'Giao Hỏa Tốc (2 Giờ Nội Thành)',
    shortName: 'Hỏa Tốc 2H',
    estimatedDelivery: '1 - 2 giờ',
    baseFee: 35000,
    extraPer500g: 10000,
    maxInstantWeight: 5000,
    description: 'Nhận hàng ngay trong 120 phút qua Grab/Ahamove/Be nội thành',
    badgeColor: 'bg-emerald-600 text-white'
  }
];

/**
 * Tính phí vận chuyển theo trọng lượng thực tế hoặc quy đổi thể tích
 * Trọng lượng quy đổi (g) = (Dài x Rộng x Cao) / 6 (cm3/6)
 */
export function calculateCarrierFee(
  carrierId: string,
  weightInGrams: number = 300,
  dimensions?: ProductDimensions
): number {
  const carrier = CARRIER_OPTIONS.find(c => c.id === carrierId) || CARRIER_OPTIONS[0];
  
  // Trọng lượng quy đổi từ kích thước (cm) nếu có: dài * rộng * cao / 6
  let volumetricWeight = 0;
  if (dimensions && dimensions.length > 0 && dimensions.width > 0 && dimensions.height > 0) {
    volumetricWeight = Math.round((dimensions.length * dimensions.width * dimensions.height) / 6);
  }

  const effectiveWeight = Math.max(weightInGrams || 300, volumetricWeight);

  if (carrier.id === 'instant') {
    if (effectiveWeight <= 2000) return 35000;
    const extraBlocks = Math.ceil((effectiveWeight - 2000) / 1000);
    return 35000 + extraBlocks * 10000;
  }

  if (effectiveWeight <= 500) {
    return carrier.baseFee;
  }

  const extraBlocks = Math.ceil((effectiveWeight - 500) / 500);
  return carrier.baseFee + extraBlocks * carrier.extraPer500g;
}

export function formatWeight(weightInGrams?: number): string {
  if (!weightInGrams || weightInGrams <= 0) return '300g';
  if (weightInGrams >= 1000) {
    return `${(weightInGrams / 1000).toFixed(weightInGrams % 1000 === 0 ? 0 : 2)} kg`;
  }
  return `${Math.round(weightInGrams)} g`;
}

export function formatDimensions(dim?: ProductDimensions): string {
  if (!dim || (!dim.length && !dim.width && !dim.height)) {
    return 'Tiêu chuẩn (25 × 15 × 5 cm)';
  }
  return `${dim.length || 0} × ${dim.width || 0} × ${dim.height || 0} cm`;
}

export function generateTrackingNumber(carrierCode: string = 'SPX'): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let rand = '';
  for (let i = 0; i < 9; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${carrierCode}${rand}`;
}
