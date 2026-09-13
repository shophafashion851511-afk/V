import React, { useState, useEffect } from 'react';
import { CartItem, Voucher, CustomerInfo, Order, CustomerUser, OrderTimelineStep } from '../types';
import { formatVND, generateOrderCode } from '../utils/formatters';
import { 
  X, MapPin, Truck, CreditCard, ShieldCheck, 
  CheckCircle2, ArrowRight, AlertCircle, Package,
  Sparkles, ExternalLink, UserCheck, Clock, CheckCircle
} from 'lucide-react';
import { CARRIER_OPTIONS, calculateCarrierFee, generateTrackingNumber, formatWeight, formatDimensions } from '../utils/shipping';

interface CheckoutModalProps {
  items: CartItem[];
  voucher: Voucher | null;
  useCoins: boolean;
  coinsBalance: number;
  onClose: () => void;
  onSuccessOrder: (order: Order) => void;
  currentCustomer?: CustomerUser | null;
  onOpenCustomerAuth?: () => void;
  onOpenOrderTracking?: (orderId?: string) => void;
  walletBalance?: number;
  onOpenWallet?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  items,
  voucher,
  useCoins,
  coinsBalance,
  onClose,
  onSuccessOrder,
  currentCustomer,
  onOpenCustomerAuth,
  onOpenOrderTracking,
  walletBalance,
  onOpenWallet
}) => {
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: currentCustomer?.name || 'Nguyễn Văn A',
    phone: currentCustomer?.phone || '0987654321',
    address: 'Số 123 Đường Cầu Giấy, Phường Dịch Vọng, Quận Cầu Giấy',
    city: 'Hà Nội',
    note: 'Gọi điện trước khi giao hàng'
  });

  const [selectedCarrierId, setSelectedCarrierId] = useState<string>('spx');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'shopeepay' | 'credit' | 'bank'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<Order | null>(null);

  useEffect(() => {
    if (currentCustomer) {
      setCustomer(prev => ({
        ...prev,
        name: currentCustomer.name || prev.name,
        phone: currentCustomer.phone || prev.phone
      }));
    }
  }, [currentCustomer]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Total weight and max dimensions of package
  const totalWeight = items.reduce((sum, item) => {
    const itemWeight = item.product.weight || 300;
    return sum + (itemWeight * item.quantity);
  }, 0);

  const maxDimensions = items.reduce((max, item) => {
    const d = item.product.dimensions;
    return {
      length: Math.max(max.length, d?.length || 25),
      width: Math.max(max.width, d?.width || 15),
      height: Math.max(max.height, (d?.height || 5) * Math.min(item.quantity, 3))
    };
  }, { length: 25, width: 15, height: 5 });

  // Calculate carrier fees
  const selectedCarrier = CARRIER_OPTIONS.find(c => c.id === selectedCarrierId) || CARRIER_OPTIONS[0];
  const calculatedShippingFee = calculateCarrierFee(selectedCarrier.id, totalWeight, maxDimensions);

  // Check if any product has free ship sponsored by shop
  const hasFreeShipShop = items.some(i => i.product.isFreeshipXtra || i.product.shippingConfig?.freeShipByShop);
  const shippingFee = hasFreeShipShop ? 0 : calculatedShippingFee;

  // Voucher discount
  let voucherDiscount = 0;
  if (voucher && subtotal >= voucher.minOrder) {
    if (voucher.type === 'discount_amount') {
      voucherDiscount = voucher.value;
    } else if (voucher.type === 'discount_percent') {
      voucherDiscount = Math.min(voucher.maxDiscount || 50000, Math.round((subtotal * voucher.value) / 100));
    } else if (voucher.type === 'freeship') {
      voucherDiscount = Math.min(calculatedShippingFee, voucher.value);
    }
  }

  // Coins
  const coinsUsed = useCoins ? Math.min(coinsBalance, Math.min(20000, subtotal * 0.2)) : 0;
  const total = Math.max(0, subtotal + shippingFee - voucherDiscount - coinsUsed);

  const handlePlaceOrder = () => {
    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
      alert('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ giao hàng!');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const trackingNum = generateTrackingNumber(selectedCarrier.code);
      const currentTime = new Date().toLocaleString('vi-VN');

      const initialTimeline: OrderTimelineStep[] = [
        {
          status: 'ordered',
          title: 'Đặt hàng thành công',
          description: `Đơn hàng đã được tạo qua hệ thống VIETSHOP`,
          time: currentTime,
          completed: true,
          current: true
        },
        {
          status: 'confirmed',
          title: 'Người bán xác nhận',
          description: 'Shop đang chuẩn bị kiện hàng và đóng gói theo quy chuẩn',
          time: 'Dự kiến trong 2 giờ',
          completed: false
        },
        {
          status: 'picked_up',
          title: `${selectedCarrier.shortName} đã lấy hàng`,
          description: `Đã bàn giao bưu tá với mã vận đơn: ${trackingNum}`,
          completed: false
        },
        {
          status: 'delivering',
          title: 'Đang giao hàng',
          description: 'Bưu tá đang trên tuyến giao tới địa chỉ nhận',
          completed: false
        },
        {
          status: 'delivered',
          title: 'Giao hàng thành công',
          description: 'Khách hàng nhận hàng và đồng kiểm',
          completed: false
        }
      ];

      const newOrder: Order = {
        id: 'ord-' + Date.now(),
        orderCode: generateOrderCode(),
        createdAt: currentTime,
        items,
        subtotal,
        shippingFee,
        discountAmount: voucherDiscount,
        coinsUsed,
        total,
        status: 'pending',
        shippingMethod: (selectedCarrier.id === 'instant' ? 'instant' : 'fast') as any,
        paymentMethod,
        customerInfo: customer,
        userId: currentCustomer?.id,
        userEmail: currentCustomer?.email,
        userPhone: currentCustomer?.phone || customer.phone,
        userProvider: currentCustomer?.provider,
        carrierName: selectedCarrier.name,
        trackingNumber: trackingNum,
        dimensions: maxDimensions,
        totalWeight,
        timeline: initialTimeline
      };

      setIsSubmitting(false);
      setOrderComplete(newOrder);
      onSuccessOrder(newOrder);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] text-white px-5 sm:px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <h2 className="text-base sm:text-lg font-black tracking-tight">
              Thanh Toán Đơn Hàng VIETSHOP
            </h2>
          </div>
          {!orderComplete && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        {orderComplete ? (
          <div className="p-6 sm:p-8 space-y-5 overflow-y-auto custom-scrollbar">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900">Đặt Hàng Thành Công!</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Mã đơn hàng: <strong className="text-[#ee4d2d]">{orderComplete.orderCode}</strong> • Mã vận đơn: <strong className="text-blue-600">{orderComplete.trackingNumber}</strong>
                </p>
              </div>
            </div>

            {/* Mục Đơn Hàng Của Bạn - Theo dõi tiến trình */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200 p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-orange-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#ee4d2d]" />
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">Mục Đơn Hàng Của Bạn</h4>
                    <p className="text-[11px] text-slate-500">Theo dõi thời gian thực tiến trình vận chuyển đơn hàng này</p>
                  </div>
                </div>

                {currentCustomer ? (
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-orange-200 text-xs shadow-xs">
                    <img src={currentCustomer.avatar} alt={currentCustomer.name} className="w-5 h-5 rounded-full object-cover" />
                    <span className="font-bold text-slate-800">{currentCustomer.name}</span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-orange-100 text-[#ee4d2d] rounded-md uppercase">
                      {currentCustomer.provider === 'google' ? 'Gmail' : currentCustomer.provider === 'phone' ? 'SĐT' : 'Facebook'}
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenCustomerAuth) onOpenCustomerAuth();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ee4d2d] hover:bg-[#d73211] text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Đăng nhập để lưu vào "Đơn Hàng Của Bạn"</span>
                  </button>
                )}
              </div>

              {/* Progress Stepper Preview */}
              <div className="bg-white rounded-xl p-3 border border-orange-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600 font-semibold text-[11px]">
                  <span>Đơn vị vận chuyển: <strong className="text-slate-900">{orderComplete.carrierName}</strong></span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-lg font-bold">Chờ người bán gửi hàng</span>
                </div>

                {/* Mini Steps */}
                <div className="grid grid-cols-4 gap-1 text-center pt-2">
                  <div className="space-y-1">
                    <div className="w-6 h-6 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">✓</div>
                    <div className="text-[10px] font-bold text-slate-800">Đặt đơn</div>
                  </div>
                  <div className="space-y-1">
                    <div className="w-6 h-6 mx-auto rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs animate-pulse">⏳</div>
                    <div className="text-[10px] font-bold text-amber-700">Đóng gói</div>
                  </div>
                  <div className="space-y-1">
                    <div className="w-6 h-6 mx-auto rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs">3</div>
                    <div className="text-[10px] font-medium text-slate-400">Đang giao</div>
                  </div>
                  <div className="space-y-1">
                    <div className="w-6 h-6 mx-auto rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs">4</div>
                    <div className="text-[10px] font-medium text-slate-400">Đã nhận</div>
                  </div>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenOrderTracking) onOpenOrderTracking(orderComplete.id);
                }}
                className="w-full py-3 bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] hover:from-[#d73211] text-white font-black text-sm rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <Package className="w-4 h-4" />
                <span>XEM TIẾN TRÌNH CHI TIẾT ĐƠN HÀNG CỦA BẠN</span>
              </button>
            </div>

            {/* Order Details summary */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Người nhận:</span>
                <span className="font-bold text-slate-800">{orderComplete.customerInfo.name} ({orderComplete.customerInfo.phone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Địa chỉ:</span>
                <span className="font-semibold text-slate-800 text-right">{orderComplete.customerInfo.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kiện hàng:</span>
                <span className="font-semibold text-slate-800">{formatWeight(orderComplete.totalWeight)} • {formatDimensions(orderComplete.dimensions)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-500">Tổng thanh toán:</span>
                <span className="font-extrabold text-sm text-[#ee4d2d]">{formatVND(orderComplete.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phương thức:</span>
                <span className="font-semibold text-slate-800 uppercase">{orderComplete.paymentMethod}</span>
              </div>
            </div>

            <div className="text-center pt-1">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Đóng & Tiếp Tục Mua Sắm
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
            
            {/* Delivery Address Form */}
            <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#ee4d2d] uppercase tracking-wide">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Địa Chỉ Nhận Hàng</span>
                </div>
                {currentCustomer && (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full lowercase first-letter:uppercase">
                    Tài khoản: {currentCustomer.name}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">Họ & Tên người nhận</label>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) => setCustomer(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#ee4d2d]"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">Số điện thoại</label>
                  <input
                    type="text"
                    value={customer.phone}
                    onChange={(e) => setCustomer(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#ee4d2d]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-slate-600 block mb-1 font-medium">Địa chỉ chi tiết (Số nhà, đường, phường/xã, quận/huyện)</label>
                  <input
                    type="text"
                    value={customer.address}
                    onChange={(e) => setCustomer(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#ee4d2d]"
                  />
                </div>
              </div>
            </div>

            {/* Products List Summary */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Sản Phẩm Đặt Mua ({items.length})
                </h4>
                <span className="text-[11px] text-slate-500 font-medium">
                  Tổng khối lượng: <strong>{formatWeight(totalWeight)}</strong> • Kích thước: <strong>{formatDimensions(maxDimensions)}</strong>
                </span>
              </div>

              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate">{item.product.name}</p>
                        <p className="text-[11px] text-slate-400">
                          {Object.values(item.selectedVariations).join(', ')} x {item.quantity} {item.product.weight ? `(${formatWeight(item.product.weight)})` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0">
                      {formatVND(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Carrier Options with Fees regulated by Carrier */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wide">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Đơn Vị Vận Chuyển & Phí Ship Quy Định</span>
                </div>
                {hasFreeShipShop && (
                  <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Freeship Xtra: 0₫
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {CARRIER_OPTIONS.map(carrier => {
                  const fee = hasFreeShipShop ? 0 : calculateCarrierFee(carrier.id, totalWeight, maxDimensions);
                  const isSelected = selectedCarrierId === carrier.id;

                  return (
                    <button
                      key={carrier.id}
                      type="button"
                      onClick={() => setSelectedCarrierId(carrier.id)}
                      className={`p-3 rounded-xl border text-left text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-orange-50 border-[#ee4d2d] text-orange-950 ring-2 ring-orange-300'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-center font-bold">
                        <span className="flex items-center gap-1.5 truncate">
                          <span className={`w-2 h-2 rounded-full ${carrier.badgeColor.split(' ')[0]}`} />
                          <span className="truncate">{carrier.shortName}</span>
                        </span>
                        <span className="text-[#ee4d2d] shrink-0 font-extrabold">
                          {hasFreeShipShop ? '0₫ (Free)' : formatVND(fee)}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">{carrier.estimatedDelivery} • {carrier.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
                <CreditCard className="w-4 h-4 text-purple-600" />
                <span>Phương Thức Thanh Toán</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'cod', title: 'COD (Tiền mặt)', desc: 'Thanh toán khi nhận' },
                  { id: 'shopeepay', title: 'Ví VIETSHOP Pay', desc: 'Giảm thêm voucher' },
                  { id: 'bank', title: 'Chuyển khoản QR', desc: 'VietQR / Napas' },
                  { id: 'credit', title: 'Thẻ Tín Dụng', desc: 'Visa / Mastercard' }
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPaymentMethod(p.id as any)}
                    className={`p-2.5 rounded-xl border text-center text-xs cursor-pointer transition-all ${
                      paymentMethod === p.id
                        ? 'bg-orange-50 border-[#ee4d2d] text-[#ee4d2d] font-bold ring-1 ring-[#ee4d2d]'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="block font-semibold">{p.title}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{p.desc}</span>
                  </button>
                ))}
              </div>

              {paymentMethod === 'shopeepay' && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ee4d2d] to-orange-500 text-white flex items-center justify-center font-black text-xs shadow-xs">
                      VP
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900">
                        Số dư Ví VIETSHOP: <span className="text-[#ee4d2d]">{walletBalance !== undefined ? formatVND(walletBalance) : '2.500.000₫'}</span>
                      </div>
                      <div className="text-[11px] text-emerald-700 font-semibold">Thanh toán tức thì 0đ phí • Tích lũy 5% xu</div>
                    </div>
                  </div>
                  {onOpenWallet && (
                    <button
                      type="button"
                      onClick={onOpenWallet}
                      className="px-2.5 py-1 bg-white border border-orange-300 text-[#ee4d2d] rounded-xl font-bold hover:bg-orange-100 transition cursor-pointer text-[11px] shadow-2xs"
                    >
                      + Nạp Thêm
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Order Price Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Tổng tiền hàng:</span>
                <span>{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Phí vận chuyển ({selectedCarrier.shortName}):</span>
                <span>{hasFreeShipShop ? <span className="line-through text-slate-400 mr-1.5">{formatVND(calculatedShippingFee)}</span> : null}<span className="font-bold text-slate-900">{formatVND(shippingFee)}</span></span>
              </div>
              {voucherDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Voucher giảm giá:</span>
                  <span>-{formatVND(voucherDiscount)}</span>
                </div>
              )}
              {coinsUsed > 0 && (
                <div className="flex justify-between text-amber-600 font-semibold">
                  <span>Dùng {coinsUsed.toLocaleString()} Xu:</span>
                  <span>-{formatVND(coinsUsed)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-200 pt-2">
                <span>Tổng Thanh Toán:</span>
                <span className="text-[#ee4d2d] text-lg font-black">{formatVND(total)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handlePlaceOrder}
              className="w-full py-3.5 bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] hover:from-[#d73211] text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition"
            >
              {isSubmitting ? (
                <span>Đang xử lý đơn hàng...</span>
              ) : (
                <>
                  <span>ĐẶT HÀNG NGAY • {formatVND(total)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </div>
        )}
      </div>
    </div>
  );
};
