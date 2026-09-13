import React, { useState } from 'react';
import { CartItem, Voucher } from '../types';
import { formatVND } from '../utils/formatters';
import { 
  X, Trash2, Plus, Minus, Ticket, Coins, Truck, 
  ShoppingBag, ArrowRight, Check, ShieldCheck 
} from 'lucide-react';

interface CartModalProps {
  cart: CartItem[];
  vouchers: Voucher[];
  coinsBalance: number;
  onClose: () => void;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onToggleSelect: (cartItemId: string) => void;
  onToggleSelectAll: (select: boolean) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: (appliedVoucher: Voucher | null, useCoins: boolean) => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  cart,
  vouchers,
  coinsBalance,
  onClose,
  onUpdateQuantity,
  onToggleSelect,
  onToggleSelectAll,
  onRemoveItem,
  onProceedToCheckout
}) => {
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(vouchers[0] || null);
  const [useCoins, setUseCoins] = useState(false);
  const [showVoucherList, setShowVoucherList] = useState(false);

  const selectedItems = cart.filter(item => item.selected);
  const allSelected = cart.length > 0 && selectedItems.length === cart.length;

  const rawSubtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Calculate Voucher discount
  let voucherDiscount = 0;
  if (selectedVoucher && rawSubtotal >= selectedVoucher.minOrder) {
    if (selectedVoucher.type === 'discount_amount') {
      voucherDiscount = selectedVoucher.value;
    } else if (selectedVoucher.type === 'discount_percent') {
      voucherDiscount = Math.min(
        selectedVoucher.maxDiscount || 50000,
        Math.round((rawSubtotal * selectedVoucher.value) / 100)
      );
    } else if (selectedVoucher.type === 'freeship') {
      voucherDiscount = selectedVoucher.value;
    }
  }

  // Coins Discount (up to 20.000 xu max or 20% of order)
  const coinsDeduction = useCoins ? Math.min(coinsBalance, Math.min(20000, rawSubtotal * 0.2)) : 0;
  const estimatedShipping = selectedItems.length > 0 ? 30000 : 0;
  const totalPayment = Math.max(0, rawSubtotal + estimatedShipping - voucherDiscount - coinsDeduction);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] text-white px-5 sm:px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6" />
            <h2 className="text-lg sm:text-xl font-black tracking-tight">
              Giỏ Hàng Của Bạn ({cart.length} sản phẩm)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {cart.length === 0 ? (
          <div className="p-12 text-center space-y-4 my-auto">
            <div className="w-20 h-20 mx-auto rounded-full bg-orange-100 text-[#ee4d2d] flex items-center justify-center">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Giỏ hàng của bạn còn trống</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Hãy dạo một vòng VIETSHOP Store và chọn ngay những món đồ siêu hời nhé!
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#ee4d2d] text-white font-bold text-xs rounded-xl shadow-md hover:bg-[#d73211] transition-colors cursor-pointer"
            >
              Mua Sắm Ngay
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
            
            {/* Top Freeship Banner */}
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">Đã đủ điều kiện nhận <strong>Miễn Phí Vận Chuyển 0Đ</strong>!</span>
              </div>
              <span className="text-emerald-700 font-bold hidden sm:inline">Tiết kiệm 30.000₫</span>
            </div>

            {/* Select All Checkbox bar */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onToggleSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded text-[#ee4d2d] focus:ring-[#ee4d2d] accent-[#ee4d2d] cursor-pointer"
                />
                <span>Chọn tất cả ({cart.length} món)</span>
              </label>
              <span className="text-slate-500">Đã chọn: {selectedItems.length} sản phẩm</span>
            </div>

            {/* Cart Items List */}
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 ${
                    item.selected ? 'bg-orange-50/40 border-orange-200' : 'bg-white border-slate-200 opacity-80'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => onToggleSelect(item.id)}
                    className="w-4 h-4 rounded text-[#ee4d2d] focus:ring-[#ee4d2d] accent-[#ee4d2d] cursor-pointer shrink-0 mt-1 sm:mt-0"
                  />

                  {/* Image */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-slate-200 shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2">
                      {item.product.name}
                    </h4>
                    
                    {/* Variations */}
                    {Object.keys(item.selectedVariations).length > 0 && (
                      <div className="flex flex-wrap gap-1 text-[11px] text-slate-500">
                        <span className="bg-slate-100 px-2 py-0.5 rounded">
                          Phân loại: {Object.values(item.selectedVariations).join(', ')}
                        </span>
                      </div>
                    )}

                    {/* Unit price */}
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-xs sm:text-sm font-bold text-[#ee4d2d]">
                        {formatVND(item.price)}
                      </span>
                      {item.product.originalPrice > item.price && (
                        <span className="text-[11px] text-slate-400 line-through">
                          {formatVND(item.product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper & Subtotal */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs sm:text-sm font-black text-slate-900">
                        {formatVND(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Shopee Voucher & Shopee Xu Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              
              {/* Shopee Voucher Bar */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-800 font-bold">
                    <Ticket className="w-4 h-4 text-[#ee4d2d]" />
                    <span>VIETSHOP Voucher</span>
                  </div>
                  <button
                    onClick={() => setShowVoucherList(!showVoucherList)}
                    className="text-xs text-[#ee4d2d] font-bold hover:underline cursor-pointer"
                  >
                    {selectedVoucher ? 'Đổi Voucher' : 'Chọn Voucher'}
                  </button>
                </div>

                {selectedVoucher && (
                  <div className="p-2 rounded-xl bg-orange-50 border border-orange-200 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#ee4d2d]">{selectedVoucher.title}</p>
                      <p className="text-[11px] text-slate-500">{selectedVoucher.description}</p>
                    </div>
                    <span className="font-bold text-emerald-600">-{formatVND(voucherDiscount)}</span>
                  </div>
                )}

                {/* Voucher Dropdown Picker */}
                {showVoucherList && (
                  <div className="pt-2 border-t border-slate-100 space-y-2 max-h-40 overflow-y-auto">
                    {vouchers.map(vc => (
                      <div
                        key={vc.id}
                        onClick={() => {
                          setSelectedVoucher(vc);
                          setShowVoucherList(false);
                        }}
                        className={`p-2 rounded-xl border text-xs cursor-pointer flex items-center justify-between ${
                          selectedVoucher?.id === vc.id
                            ? 'bg-orange-50 border-[#ee4d2d] text-[#ee4d2d]'
                            : 'hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div>
                          <p className="font-bold">{vc.code} - {vc.title}</p>
                          <p className="text-[10px] text-slate-500">{vc.description}</p>
                        </div>
                        {selectedVoucher?.id === vc.id && <Check className="w-4 h-4" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Shopee Xu Deduction */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Dùng VIETSHOP Xu</p>
                    <p className="text-[11px] text-slate-500">
                      Số dư: {coinsBalance.toLocaleString()} Xu (Giảm tối đa 20.000₫)
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useCoins}
                    onChange={(e) => setUseCoins(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ee4d2d]"></div>
                </label>
              </div>

            </div>

          </div>
        )}

        {/* Footer with Checkout Summary */}
        {cart.length > 0 && (
          <div className="bg-slate-50 px-4 sm:px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start text-xs text-slate-600">
                <span>Tổng tiền hàng ({selectedItems.length} món):</span>
                <span className="font-semibold text-slate-900">{formatVND(rawSubtotal)}</span>
              </div>
              <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                <span className="text-xs font-bold text-slate-600">Tổng thanh toán:</span>
                <span className="text-xl sm:text-2xl font-black text-[#ee4d2d]">
                  {formatVND(totalPayment)}
                </span>
              </div>
              {(voucherDiscount > 0 || coinsDeduction > 0) && (
                <p className="text-[11px] text-emerald-600 font-semibold">
                  Đã tiết kiệm được: {formatVND(voucherDiscount + coinsDeduction)}
                </p>
              )}
            </div>

            <button
              onClick={() => onProceedToCheckout(selectedVoucher, useCoins)}
              disabled={selectedItems.length === 0}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] hover:from-[#d73211] hover:to-[#e64a19] disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 transition-all cursor-pointer"
            >
              <span>Mua Hàng ({selectedItems.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
