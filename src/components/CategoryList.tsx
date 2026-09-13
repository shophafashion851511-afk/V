import React from 'react';
import { Category } from '../types';
import { 
  Shirt, Sparkles, Smartphone, Headphones, Laptop, 
  Heart, Home, Footprints, Activity, ShoppingBag, Grid 
} from 'lucide-react';

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  title?: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Shirt,
  Sparkles,
  Smartphone,
  Headphones,
  Laptop,
  Heart,
  Home,
  Footprints,
  Activity,
  ShoppingBag
};

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  title = 'DANH MỤC SẢN PHẨM'
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm sm:text-base">
          <Grid className="w-5 h-5 text-[#ee4d2d]" />
          <span>{title}</span>
        </div>
        {selectedCategory !== 'all' && (
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs text-[#ee4d2d] hover:underline font-semibold cursor-pointer"
          >
            Xem tất cả ngành hàng
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2">
        {/* "All" Category Pill */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-orange-50 border-[#ee4d2d] text-[#ee4d2d] shadow-sm'
              : 'border-slate-100 hover:border-orange-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-orange-100/60 text-[#ee4d2d] flex items-center justify-center font-bold text-xs">
            🔥 ALL
          </div>
          <span className="text-[11px] font-bold line-clamp-1">Tất Cả</span>
        </button>

        {categories.map((cat) => {
          const IconComp = ICON_MAP[cat.icon] || ShoppingBag;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer group ${
                isSelected
                  ? 'bg-orange-50 border-[#ee4d2d] text-[#ee4d2d] shadow-sm'
                  : 'border-slate-100 hover:border-orange-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent"></div>
              </div>
              <span className="text-[11px] font-semibold leading-tight line-clamp-2 h-7 flex items-center justify-center">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
