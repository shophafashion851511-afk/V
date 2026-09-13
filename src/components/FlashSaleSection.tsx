import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { formatVND } from '../utils/formatters';
import { Flame, ChevronRight, Zap } from 'lucide-react';

interface FlashSaleProps {
  products: Product[];
  onOpenProduct: (product: Product) => void;
  onViewAllFlashSale?: () => void;
  title?: string;
  countdownLabel?: string;
}

export const FlashSaleSection: React.FC<FlashSaleProps> = ({
  products,
  onOpenProduct,
  onViewAllFlashSale,
  title = 'FLASH SALE',
  countdownLabel = 'KẾT THÚC TRONG'
}) => {
  const flashSaleProducts = products.filter(p => p.isFlashSale && p.isActive !== false);

  // Countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 3, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (flashSaleProducts.length === 0) return null;

  return (
    <div id="flash-sale-section" className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 space-y-4">
      {/* Flash Sale Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-orange-500 text-white font-black text-base sm:text-lg px-3 py-1 rounded-xl shadow-md shadow-red-500/20">
            <Flame className="w-5 h-5 fill-amber-300 text-amber-300 animate-bounce" />
            <span>{title}</span>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
            <span className="text-[11px] text-slate-400 font-semibold mr-1 hidden sm:inline">{countdownLabel}:</span>
            <span className="bg-slate-900 text-white px-2 py-1 rounded-md">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span>:</span>
            <span className="bg-slate-900 text-white px-2 py-1 rounded-md">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span>:</span>
            <span className="bg-slate-900 text-white px-2 py-1 rounded-md text-yellow-300">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        <button
          onClick={onViewAllFlashSale}
          className="text-xs sm:text-sm font-bold text-[#ee4d2d] hover:text-[#d73211] flex items-center gap-1 cursor-pointer"
        >
          <span>Xem tất cả khung giờ</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Product Cards Row / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {flashSaleProducts.slice(0, 5).map((product) => {
          const totalStock = product.flashSaleStockTotal || 100;
          const sold = product.flashSaleSold || 60;
          const percentSold = Math.min(100, Math.round((sold / totalStock) * 100));

          return (
            <div
              key={product.id}
              onClick={() => onOpenProduct(product)}
              className="group bg-white rounded-xl border border-slate-100 hover:border-orange-300 hover:shadow-xl transition-all cursor-pointer flex flex-col p-2.5 relative"
            >
              {/* Discount Tag */}
              <div className="absolute top-0 right-0 bg-yellow-400 text-red-600 font-extrabold text-[11px] px-2 py-1 rounded-bl-xl rounded-tr-xl z-10 shadow-sm flex flex-col items-center leading-none">
                <span>-{product.discountPercent}%</span>
                <span className="text-[8px] text-slate-800 font-bold uppercase mt-0.5">GIẢM</span>
              </div>

              {/* Product Image */}
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-50 mb-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.isMall && (
                  <span className="absolute bottom-1.5 left-1.5 bg-[#ee4d2d] text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                    Chính Hãng
                  </span>
                )}
              </div>

              {/* Price & Name */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 line-clamp-1 group-hover:text-[#ee4d2d] transition-colors">
                    {product.name}
                  </h4>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-sm sm:text-base font-extrabold text-[#ee4d2d]">
                      {formatVND(product.price)}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-2.5">
                  <div className="relative w-full h-4 bg-orange-100 rounded-full overflow-hidden flex items-center justify-center">
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentSold}%` }}
                    />
                    <div className="relative z-10 text-[9px] font-extrabold text-white flex items-center gap-1 drop-shadow-sm px-1">
                      <Zap className="w-2.5 h-2.5 fill-yellow-300 text-yellow-300" />
                      <span>ĐÃ BÁN {sold}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
