import { Voucher } from '../types';

export const INITIAL_VOUCHERS: Voucher[] = [
  {
    id: 'vc-freeship-xtra',
    code: 'FREESHIP30K',
    title: 'Miễn Phí Vận Chuyển Xtra',
    description: 'Giảm tối đa 30.000₫ cho đơn từ 99.000₫',
    type: 'freeship',
    value: 30000,
    minOrder: 99000,
    maxDiscount: 30000,
    expiry: 'Còn 3 ngày',
    usedCount: 1420,
    totalCount: 5000,
    isSaved: true
  },
  {
    id: 'vc-discount-50k',
    code: 'VIETSHOP50K',
    title: 'Giảm 50K Đơn Hàng Siêu Sale',
    description: 'Giảm ngay 50.000₫ cho đơn từ 299.000₫ toàn sàn',
    type: 'discount_amount',
    value: 50000,
    minOrder: 299000,
    maxDiscount: 50000,
    expiry: 'Còn 2 ngày',
    usedCount: 2890,
    totalCount: 3000,
    isSaved: true
  },
  {
    id: 'vc-percent-15',
    code: 'SALE15PCT',
    title: 'Giảm 15% Cho Khách Hàng Mới',
    description: 'Giảm 15% tối đa 40.000₫ cho đơn từ 150.000₫',
    type: 'discount_percent',
    value: 15,
    minOrder: 150000,
    maxDiscount: 40000,
    expiry: 'Còn 5 ngày',
    usedCount: 890,
    totalCount: 2000,
    isSaved: false
  },
  {
    id: 'vc-coinback-20k',
    code: 'HOANXU20K',
    title: 'Hoàn Xu Xtra 20.000 Xu',
    description: 'Hoàn 100% xu tối đa 20.000 VIETSHOP Xu',
    type: 'coin_back',
    value: 20000,
    minOrder: 199000,
    maxDiscount: 20000,
    expiry: 'Còn 7 ngày',
    usedCount: 4200,
    totalCount: 5000,
    isSaved: false
  }
];
