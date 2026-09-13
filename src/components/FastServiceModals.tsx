import React, { useState } from 'react';
import { 
  X, Truck, ShieldCheck, Ticket, Coins, Globe, Smartphone, 
  Gift, CheckCircle2, Copy, Sparkles, Zap, ArrowRight, Award, AlertCircle,
  Flame, Clock, Bell, Check
} from 'lucide-react';
import { Voucher, Product } from '../types';
import { formatVND } from '../utils/formatters';

interface FastServiceModalsProps {
  activeModal: string | null;
  onClose: () => void;
  vouchers: Voucher[];
  onToggleSaveVoucher: (id: string) => void;
  coinsBalance: number;
  onAddCoins: (amount: number) => void;
  onFilterMall?: () => void;
  onFilterFreeship?: () => void;
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
  onFilterFlashSale?: () => void;
}

export const FastServiceModals: React.FC<FastServiceModalsProps> = ({
  activeModal,
  onClose,
  vouchers,
  onToggleSaveVoucher,
  coinsBalance,
  onAddCoins,
  onFilterMall,
  onFilterFreeship,
  products = [],
  onSelectProduct,
  onFilterFlashSale
}) => {
  // States for sub-modal actions
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [claimedDailyCoins, setClaimedDailyCoins] = useState(false);
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<string | null>(null);
  const [wheelRotation, setWheelRotation] = useState(0);

  // Flash sale slot state
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('09:00');
  const [notifiedSlots, setNotifiedSlots] = useState<boolean>(false);

  // Phone recharge state
  const [phoneCarrier, setPhoneCarrier] = useState('Viettel');
  const [phoneNumber, setPhoneNumber] = useState('0988123456');
  const [topupAmount, setTopupAmount] = useState(50000);
  const [rechargeSuccess, setRechargeSuccess] = useState(false);

  if (!activeModal) return null;

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleClaimDailyCoins = () => {
    if (!claimedDailyCoins) {
      onAddCoins(1000);
      setClaimedDailyCoins(true);
    }
  };

  const handleSpinWheel = () => {
    if (wheelSpinning) return;
    setWheelSpinning(true);
    setWheelResult(null);

    const randomDeg = 1440 + Math.floor(Math.random() * 360);
    setWheelRotation(prev => prev + randomDeg);

    setTimeout(() => {
      setWheelSpinning(false);
      const prizes = [
        '+5.000 VIETSHOP Xu',
        'Voucher Giảm 50K Đơn 0Đ',
        'Mã Miễn Phí Vận Chuyển Toàn Quốc',
        '+2.000 VIETSHOP Xu',
        'Voucher Giảm 30K Đơn Hàng'
      ];
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
      setWheelResult(randomPrize);
      if (randomPrize.includes('Xu')) {
        const xuAmount = randomPrize.includes('5.000') ? 5000 : 2000;
        onAddCoins(xuAmount);
      }
    }, 3000);
  };

  const handleRechargeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRechargeSuccess(true);
    setTimeout(() => {
      setRechargeSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors z-10"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 0. KHUNG GIỜ SĂN SALE MODAL */}
        {activeModal === 'flash_sale' && (
          <div className="space-y-5 text-xs">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 shrink-0">
                <Flame className="w-6 h-6 fill-amber-300 text-amber-300 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">Khung Giờ Săn Sale Chớp Nhoáng</h3>
                  <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-current" /> Đang Diễn Ra
                  </span>
                </div>
                <p className="text-slate-500 text-xs">Đồng giá từ 9K • Giảm sốc đến 70% • Mở bán theo khung giờ vàng trong ngày</p>
              </div>
            </div>

            {/* Time Slots Bar */}
            <div className="space-y-2">
              <p className="font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                <span>Các khung giờ săn sale trong ngày:</span>
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                {[
                  { time: '00:00', label: 'Săn Đêm', status: 'ended', desc: 'Đã qua' },
                  { time: '09:00', label: 'Cà Phê Sale', status: 'active', desc: 'Đang diễn ra' },
                  { time: '12:00', label: 'Nghỉ Trưa', status: 'upcoming', desc: 'Sắp tới' },
                  { time: '15:00', label: 'Trà Chiều', status: 'upcoming', desc: 'Sắp tới' },
                  { time: '18:00', label: 'Tan Ca 9K', status: 'upcoming', desc: 'Sắp tới' },
                  { time: '21:00', label: 'Tiệc Nửa Đêm', status: 'upcoming', desc: 'Sắp tới' }
                ].map((slot, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedTimeSlot(slot.time)}
                    className={`p-2 sm:p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center ${
                      selectedTimeSlot === slot.time
                        ? 'bg-gradient-to-b from-orange-500 to-[#ee4d2d] text-white border-[#ee4d2d] shadow-md shadow-orange-500/25 scale-102 font-bold'
                        : slot.status === 'active'
                          ? 'bg-orange-50 border-orange-300 text-orange-700 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-black text-sm">{slot.time}</span>
                    <span className={`text-[10px] font-semibold mt-0.5 ${selectedTimeSlot === slot.time ? 'text-orange-100' : ''}`}>
                      {slot.label}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full mt-1 font-bold ${
                      selectedTimeSlot === slot.time 
                        ? 'bg-white/20 text-white' 
                        : slot.status === 'active'
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-slate-200 text-slate-600'
                    }`}>
                      {slot.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Countdown Banner */}
            <div className="p-3.5 bg-gradient-to-r from-orange-500 via-[#ee4d2d] to-red-600 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2 text-center sm:text-left">
                <Flame className="w-5 h-5 text-yellow-300 fill-yellow-300 shrink-0" />
                <div>
                  <span className="font-bold text-xs">KHUNG GIỜ {selectedTimeSlot} ĐANG SĂN SỐC:</span>
                  <p className="text-[11px] text-orange-100">Số lượng có hạn, nhanh tay kẻo hết!</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-3 py-1.5 rounded-xl text-xs font-mono font-bold">
                <span className="text-[10px] text-orange-200 font-sans mr-1">KẾT THÚC TRONG:</span>
                <span className="bg-slate-900 text-white px-1.5 py-0.5 rounded">01</span>:
                <span className="bg-slate-900 text-white px-1.5 py-0.5 rounded">42</span>:
                <span className="bg-slate-900 text-white px-1.5 py-0.5 rounded">18</span>
              </div>
            </div>

            {/* Flash Sale Product Deals List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#ee4d2d] fill-[#ee4d2d]" />
                  <span>Sản Phẩm Flash Sale Tiêu Biểu ({selectedTimeSlot})</span>
                </h4>
                <span className="text-[11px] text-slate-500">Giảm giá đến 70%</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                {(products.filter(p => p.isFlashSale && p.isActive !== false).length > 0 
                  ? products.filter(p => p.isFlashSale && p.isActive !== false)
                  : products.slice(0, 6)
                ).map((item, idx) => (
                  <div 
                    key={item.id || idx}
                    className="p-3 bg-slate-50 hover:bg-orange-50/40 rounded-2xl border border-slate-200/80 hover:border-orange-300 transition-all flex gap-3 items-center group cursor-pointer"
                    onClick={() => {
                      if (onSelectProduct) {
                        onSelectProduct(item);
                        onClose();
                      }
                    }}
                  >
                    <div className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-white">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <span className="absolute top-0 right-0 bg-red-600 text-white font-black text-[9px] px-1 rounded-bl">
                        -{item.discountPercent || 50}%
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-slate-800 text-xs line-clamp-1 group-hover:text-[#ee4d2d] transition-colors">
                        {item.name}
                      </h5>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="font-black text-[#ee4d2d] text-sm">{formatVND(item.price)}</span>
                        <span className="text-[10px] text-slate-400 line-through">{formatVND(item.originalPrice || item.price * 1.5)}</span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 h-2 bg-red-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full" style={{ width: `${80 + (idx * 3) % 18}%` }} />
                        </div>
                        <span className="text-[9px] font-bold text-red-600 whitespace-nowrap">ĐÃ BÁN {80 + (idx * 3) % 18}%</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectProduct) {
                          onSelectProduct(item);
                          onClose();
                        }
                      }}
                      className="px-2.5 py-1.5 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-bold text-[11px] rounded-xl shrink-0 shadow-xs cursor-pointer"
                    >
                      Săn Ngay
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-slate-600 text-xs">
                <Bell className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Bật thông báo để không bỏ lỡ đợt flash sale tiếp theo</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setNotifiedSlots(prev => !prev)}
                  className="w-full sm:w-auto px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-300 transition-colors cursor-pointer"
                >
                  {notifiedSlots ? '✓ Đã Bật Nhắc Nhở' : '🔔 Nhắc Tôi'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onFilterFlashSale) {
                      onFilterFlashSale();
                    } else {
                      document.getElementById('flash-sale-section')?.scrollIntoView({ behavior: 'smooth' });
                    }
                    onClose();
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-black rounded-xl shadow-md cursor-pointer transition-colors"
                >
                  Xem Gian Hàng Flash Sale
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 1. FREESHIP MODAL */}
        {activeModal === 'freeship' && (
          <div className="space-y-5 text-xs">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Trung Tâm Miễn Phí Vận Chuyển 0Đ</h3>
                <p className="text-slate-500 text-xs">Thu thập mã Freeship Xtra & Freeship Đơn Từ 0Đ toàn quốc</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'Freeship Giảm 15.000₫', desc: 'Đơn Tối Thiểu 0Đ', code: 'FREE0D', badge: 'Mỗi Ngày' },
                { title: 'Freeship Xtra Giảm 30.000₫', desc: 'Đơn Tối Thiểu 45.000₫', code: 'FREEXTRA', badge: 'Xtra' },
                { title: 'Freeship Hỏa Tốc Giảm 25.000₫', desc: 'Giao Nhanh 2H Nội Thành', code: 'HOATOC25', badge: 'Hỏa Tốc' },
                { title: 'Freeship Toàn Quốc 70.000₫', desc: 'Đơn Tối Thiểu 300.000₫', code: 'FREESHIPMAX', badge: 'Toàn Quốc' }
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">{item.badge}</span>
                    <span className="font-mono font-bold text-emerald-800 text-[11px]">{item.code}</span>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">{item.title}</h4>
                    <p className="text-slate-500 text-[11px]">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => handleCopyCode(item.code)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1 shadow-sm cursor-pointer transition-colors"
                  >
                    {copiedCode === item.code ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === item.code ? 'Đã Lưu Mã!' : 'Lưu Mã Miễn Phí'}</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Xem ngay các sản phẩm hỗ trợ Freeship Xtra</p>
                <p className="text-slate-500 text-[11px]">Hơn 100+ mặt hàng miễn phí ship đang mở bán</p>
              </div>
              <button
                onClick={() => {
                  if (onFilterFreeship) onFilterFreeship();
                  onClose();
                }}
                className="px-4 py-2 bg-[#ee4d2d] text-white font-bold rounded-xl shadow-md cursor-pointer shrink-0"
              >
                Lọc Sản Phẩm Freeship
              </button>
            </div>
          </div>
        )}

        {/* 2. SHOPEE MALL MODAL */}
        {activeModal === 'mall' && (
          <div className="space-y-5 text-xs">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-500/30 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">VIETSHOP - Hàng Chính Hãng 100%</h3>
                  <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">CHÍNH HÃNG</span>
                </div>
                <p className="text-slate-500 text-xs">Thương hiệu hàng đầu • Bảo đảm chất lượng • Đổi trả 15 ngày</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100 space-y-1.5">
                <span className="text-2xl">🛡️</span>
                <h4 className="font-bold text-slate-900">100% Chính Hãng</h4>
                <p className="text-[11px] text-slate-500">Hoàn tiền 200% nếu phát hiện hàng giả, hàng nhái.</p>
              </div>
              <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100 space-y-1.5">
                <span className="text-2xl">🔄</span>
                <h4 className="font-bold text-slate-900">Đổi Trả 15 Ngày</h4>
                <p className="text-[11px] text-slate-500">Miễn phí đổi trả hàng nếu không ưng ý trong 15 ngày.</p>
              </div>
              <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100 space-y-1.5">
                <span className="text-2xl">🚚</span>
                <h4 className="font-bold text-slate-900">Miễn Phí Vận Chuyển</h4>
                <p className="text-[11px] text-slate-500">Giao nhanh toàn quốc và tặng kèm voucher Freeship.</p>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-2xl flex items-center justify-between">
              <div>
                <p className="font-bold text-sm">Xem Bộ Sưu Tập Hàng Chính Hãng</p>
                <p className="text-red-100 text-[11px]">Được chứng thực từ các thương hiệu và nhà cung cấp uy tín</p>
              </div>
              <button
                onClick={() => {
                  if (onFilterMall) onFilterMall();
                  onClose();
                }}
                className="px-4 py-2 bg-white text-red-600 font-black rounded-xl shadow-md cursor-pointer shrink-0"
              >
                Xem Hàng Chính Hãng Ngay
              </button>
            </div>
          </div>
        )}

        {/* 3. VOUCHER KHO MODAL */}
        {activeModal === 'vouchers' && (
          <div className="space-y-5 text-xs">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Kho Mã Giảm Giá VIETSHOP</h3>
                <p className="text-slate-500 text-xs">Thu thập mã giảm giá và áp dụng khi thanh toán đơn hàng</p>
              </div>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar pr-1">
              {vouchers.map(v => (
                <div key={v.id} className="p-3.5 rounded-2xl border border-amber-200 bg-amber-50/40 flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-[#ee4d2d] bg-white px-2 py-0.5 rounded-md border border-orange-300">
                        {v.code}
                      </span>
                      <strong className="text-slate-900 text-xs">{v.title}</strong>
                    </div>
                    <p className="text-slate-500 text-[11px]">{v.description} • {v.expiry}</p>
                    <p className="text-slate-400 text-[10px]">Đơn tối thiểu: {formatVND(v.minOrder)}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleCopyCode(v.code)}
                      className="px-3 py-1.5 bg-white border border-amber-300 text-amber-800 font-bold rounded-xl hover:bg-amber-100 cursor-pointer"
                    >
                      {copiedCode === v.code ? 'Đã sao chép!' : 'Copy Mã'}
                    </button>
                    <button
                      onClick={() => onToggleSaveVoucher(v.id)}
                      className={`px-3 py-1.5 font-bold rounded-xl cursor-pointer ${
                        v.isSaved
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#ee4d2d] text-white hover:bg-[#d73211]'
                      }`}
                    >
                      {v.isSaved ? 'Đã Lưu ✓' : 'Lưu Mã'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. HOÀN XU & ĐIỂM DANH MODAL */}
        {activeModal === 'coin_back' && (
          <div className="space-y-5 text-xs">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-yellow-500 text-white flex items-center justify-center shadow-lg shadow-yellow-500/30 shrink-0">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">VIETSHOP Xu & Điểm Danh Mỗi Ngày</h3>
                <p className="text-slate-500 text-xs">Số dư hiện tại: <strong className="text-amber-600 font-black">{coinsBalance.toLocaleString()} Xu</strong> (tương đương {formatVND(coinsBalance)})</p>
              </div>
            </div>

            {/* Daily Check-in Card */}
            <div className="p-5 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-slate-900 rounded-3xl shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] bg-white/40 px-2 py-0.5 rounded-full font-bold uppercase">Điểm danh hôm nay</span>
                  <h4 className="text-lg font-black mt-0.5">Nhận Ngay +1.000 VIETSHOP Xu Miễn Phí</h4>
                </div>
                <Coins className="w-10 h-10 text-white/90" />
              </div>
              
              <button
                onClick={handleClaimDailyCoins}
                disabled={claimedDailyCoins}
                className={`w-full py-3 rounded-2xl font-black text-xs transition-all shadow-md cursor-pointer ${
                  claimedDailyCoins
                    ? 'bg-emerald-700 text-white cursor-default'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {claimedDailyCoins ? '✓ Đã Nhận Thành Công 1.000 Xu Hôm Nay!' : '🎁 BẤM VÀO ĐÂY ĐỂ ĐIỂM DANH NHẬN 1.000 XU'}
              </button>
            </div>

            {/* Coin Perks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <h5 className="font-bold text-slate-900">Trừ trực tiếp khi mua sắm</h5>
                <p className="text-slate-500 text-[11px] mt-0.5">1 Xu = 1 VNĐ. Áp dụng tối đa đến 50.000đ cho mỗi đơn hàng.</p>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <h5 className="font-bold text-slate-900">Hoàn Xu Đến 50%</h5>
                <p className="text-slate-500 text-[11px] mt-0.5">Mua các sản phẩm gắn nhãn Hoàn Xu Xtra để tích lũy thêm.</p>
              </div>
            </div>
          </div>
        )}

        {/* 5. HÀNG QUỐC TẾ MODAL */}
        {activeModal === 'global' && (
          <div className="space-y-5 text-xs">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">VIETSHOP Hàng Quốc Tế</h3>
                <p className="text-slate-500 text-xs">Hàng nhập khẩu trực tiếp từ Hàn Quốc, Nhật Bản, Trung Quốc, Thái Lan</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-1">
                <span className="font-bold text-blue-900">✈️ Giao Hàng Xuyên Biên Giới</span>
                <p className="text-slate-600 text-[11px]">Thời gian vận chuyển chuẩn chỉ từ 5-7 ngày làm việc.</p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-1">
                <span className="font-bold text-blue-900">🏷️ Không Phát Sinh Thuế Phí</span>
                <p className="text-slate-600 text-[11px]">Giá hiển thị đã bao gồm toàn bộ thuế và phí nhập khẩu.</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
            >
              Khám Phá Gian Hàng Quốc Tế
            </button>
          </div>
        )}

        {/* 6. NẠP THẺ & TIỆN ÍCH MODAL */}
        {activeModal === 'recharge' && (
          <div className="space-y-5 text-xs">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Nạp Thẻ Điện Thoại & Hóa Đơn Dịch Vụ</h3>
                <p className="text-slate-500 text-xs">Chiết khấu trực tiếp 5% • Nạp tiền siêu tốc 30 giây</p>
              </div>
            </div>

            {rechargeSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-3xl text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-black text-slate-900">Nạp Tiền Thành Công!</h4>
                <p className="text-slate-600 text-xs">Đã nạp {formatVND(topupAmount)} cho số điện thoại {phoneNumber} ({phoneCarrier}).</p>
              </div>
            ) : (
              <form onSubmit={handleRechargeSubmit} className="space-y-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Chọn Nhà Mạng</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Viettel', 'Vinaphone', 'Mobifone'].map(carrier => (
                      <button
                        type="button"
                        key={carrier}
                        onClick={() => setPhoneCarrier(carrier)}
                        className={`py-2 rounded-xl font-bold border transition-colors cursor-pointer ${
                          phoneCarrier === carrier
                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {carrier}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Số Điện Thoại</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Mệnh Giá Nạp</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[20000, 50000, 100000, 200000].map(amt => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => setTopupAmount(amt)}
                        className={`p-2.5 rounded-xl text-center border font-black transition-colors cursor-pointer ${
                          topupAmount === amt
                            ? 'bg-purple-50 border-purple-600 text-purple-700'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{formatVND(amt)}</span>
                        <span className="block text-[9px] text-emerald-600 font-semibold mt-0.5">Giảm 5%</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex justify-between items-center text-xs">
                  <span className="text-slate-600">Thanh toán sau chiết khấu:</span>
                  <strong className="text-purple-700 text-sm font-black">{formatVND(topupAmount * 0.95)}</strong>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl shadow-lg shadow-purple-500/20 cursor-pointer"
                >
                  Xác Nhận Nạp Thẻ Ngay
                </button>
              </form>
            )}
          </div>
        )}

        {/* 7. REWARDS & VÒNG QUAY MAY MẮN MODAL */}
        {activeModal === 'rewards' && (
          <div className="space-y-5 text-xs text-center">
            <div className="flex items-center justify-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-lg shadow-pink-500/30 shrink-0">
                <Gift className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-black text-slate-900">VIETSHOP Rewards - Vòng Quay May Mắn</h3>
                <p className="text-slate-500 text-xs">Quay thưởng mỗi ngày nhận Xu và Voucher giảm giá</p>
              </div>
            </div>

            {/* Wheel UI */}
            <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
              <div 
                className="w-full h-full rounded-full border-8 border-pink-400 shadow-2xl flex items-center justify-center bg-gradient-to-tr from-pink-500 via-amber-400 to-rose-500 transition-transform duration-3000 ease-out"
                style={{ transform: `rotate(${wheelRotation}deg)` }}
              >
                <div className="text-white font-black text-xs rotate-45 select-none">
                  🎁 QUAY NGAY 🎯
                </div>
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-4 h-6 bg-red-600 rounded-b-md shadow-md z-10" />
            </div>

            {wheelResult && (
              <div className="p-3.5 bg-pink-50 border border-pink-200 rounded-2xl text-pink-900 font-bold animate-bounce">
                🎉 Chúc mừng bạn đã trúng: <span className="text-[#ee4d2d] font-black">{wheelResult}</span>
              </div>
            )}

            <button
              onClick={handleSpinWheel}
              disabled={wheelSpinning}
              className={`w-full py-3.5 rounded-2xl font-black text-xs text-white shadow-lg transition-all cursor-pointer ${
                wheelSpinning
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 shadow-pink-500/30'
              }`}
            >
              {wheelSpinning ? 'Đang quay may mắn...' : '🎯 BẤM ĐỂ QUAY VÒNG QUAY MAY MẮN (MIỄN PHÍ)'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
