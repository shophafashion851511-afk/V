import React from 'react';
import { Voucher } from '../types';
import { Ticket, Check } from 'lucide-react';

interface QuickVoucherBarProps {
  vouchers: Voucher[];
  onToggleSaveVoucher: (voucherId: string) => void;
}

export const QuickVoucherBar: React.FC<QuickVoucherBarProps> = ({
  vouchers,
  onToggleSaveVoucher
}) => {
  return (
    <div className="bg-gradient-to-r from-orange-500 via-[#ee4d2d] to-red-500 rounded-2xl p-4 text-white shadow-md space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-black text-sm sm:text-base">
          <Ticket className="w-5 h-5 fill-yellow-300 text-yellow-300" />
          <span>KHO VOUCHER VIETSHOP SIÊU SALE - LƯU MÃ NGAY</span>
        </div>
        <span className="text-[11px] bg-white/20 px-2.5 py-0.5 rounded-full font-semibold hidden sm:inline">
          Áp dụng ngay khi thanh toán
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {vouchers.map((vc) => (
          <div
            key={vc.id}
            className="bg-white text-slate-800 rounded-xl p-3 flex items-center justify-between border-l-4 border-[#ee4d2d] shadow-sm"
          >
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs text-[#ee4d2d] bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
                  {vc.code}
                </span>
                <span className="font-bold text-xs truncate">{vc.title}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 truncate">{vc.description}</p>
              <p className="text-[9px] text-slate-400 mt-0.5">{vc.expiry}</p>
            </div>

            <button
              onClick={() => onToggleSaveVoucher(vc.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                vc.isSaved
                  ? 'bg-slate-100 text-emerald-600 border border-emerald-300'
                  : 'bg-[#ee4d2d] text-white hover:bg-[#d73211] shadow-xs'
              }`}
            >
              {vc.isSaved ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Đã Lưu</span>
                </>
              ) : (
                <span>Lưu Mã</span>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
