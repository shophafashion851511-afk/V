import React from 'react';
import { Product } from '../types';
import { formatVND } from '../utils/formatters';
import { Star, MapPin, Truck, Coins, Edit3, Trash2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpen: (product: Product) => void;
  onQuickEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  isSellerMode?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpen,
  onQuickEdit,
  onDelete,
  isSellerMode = false
}) => {
  return (
    <div
      onClick={() => onOpen(product)}
      className="group bg-white rounded-xl border border-slate-200/80 hover:border-orange-400 hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col overflow-hidden relative"
    >
      {/* Top Left Badges (Chính Hãng / Yêu Thích) */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
        {product.isMall && (
          <span className="bg-[#ee4d2d] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm uppercase tracking-tight">
            Chính Hãng
          </span>
        )}
        {product.isFavorite && !product.isMall && (
          <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
            Yêu thích+
          </span>
        )}
      </div>

      {/* Top Right Discount Tag */}
      {product.discountPercent > 0 && (
        <div className="absolute top-0 right-0 bg-yellow-400 text-red-600 font-black text-[11px] px-2 py-1 rounded-bl-xl z-10 shadow-sm flex flex-col items-center leading-tight">
          <span>-{product.discountPercent}%</span>
          <span className="text-[8px] text-slate-900 font-extrabold uppercase">GIẢM</span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* FreeShip Xtra & Coin Badges at bottom of image */}
        <div className="absolute bottom-1.5 left-1.5 right-1.5 flex flex-wrap gap-1">
          {product.isFreeshipXtra && (
            <span className="bg-emerald-600/95 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-sm backdrop-blur-xs">
              <Truck className="w-2.5 h-2.5" />
              <span>Freeship Xtra</span>
            </span>
          )}
          <span className="bg-amber-600/95 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-sm backdrop-blur-xs">
            <Coins className="w-2.5 h-2.5" />
            <span>Hoàn Xu</span>
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2 group-hover:text-[#ee4d2d] transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Vouchers / Special Tags */}
          <div className="mt-1 flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-[#ee4d2d] border border-[#ee4d2d] px-1 rounded-xs bg-orange-50">
              Giảm {formatVND(product.price * 0.1)}
            </span>
          </div>
        </div>

        {/* Price & Rating & Location */}
        <div className="space-y-1.5 pt-1">
          {/* Prices */}
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-black text-[#ee4d2d]">
              {formatVND(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[11px] text-slate-400 line-through">
                {formatVND(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Star & Sold Count */}
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-700">{product.rating}</span>
            </div>
            <span>Đã bán {product.soldCountDisplay}</span>
          </div>

          {/* Location & Stock */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{product.location}</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">Tồn: {product.stock}</span>
          </div>
        </div>

        {/* Seller Quick Action bar if in Seller Mode */}
        {isSellerMode && (
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onQuickEdit && onQuickEdit(product)}
              className="flex-1 py-1 px-2 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center gap-1 border border-blue-200"
            >
              <Edit3 className="w-3 h-3" />
              <span>Sửa</span>
            </button>
            <button
              onClick={() => onDelete && onDelete(product.id)}
              className="py-1 px-2 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center border border-red-200"
              title="Xóa sản phẩm"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
