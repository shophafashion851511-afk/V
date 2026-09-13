import React from 'react';
import { 
  Store, ShieldCheck, ArrowRight, Wallet, 
  TrendingUp, Sparkles, CheckCircle2, UserCheck, 
  Layers, PackagePlus, Zap, BellRing 
} from 'lucide-react';
import { UserRole } from '../types';

interface SellerChannelBannerProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onOpenRegisterModal: () => void;
  onGoToSellerDashboard: () => void;
  pendingApplicationsCount?: number;
}

export const SellerChannelBanner: React.FC<SellerChannelBannerProps> = ({
  currentRole,
  onChangeRole,
  onOpenRegisterModal,
  onGoToSellerDashboard,
  pendingApplicationsCount = 1
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-[#1f1641] to-[#31132b] text-white shadow-xl border border-white/10 p-5 sm:p-7 transition-all">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-[#ee4d2d]/30 to-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left info column */}
        <div className="space-y-3.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-orange-500 to-[#ee4d2d] text-white shadow-md shadow-orange-500/30">
              <Store className="w-3.5 h-3.5" />
              <span>Kênh Người Bán & Quản Trị VIETSHOP</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
              <Sparkles className="w-3 h-3" />
              <span>Phí Sàn 0Đ Tháng Đầu</span>
            </span>
            {pendingApplicationsCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 border border-amber-500/40 text-amber-300 animate-pulse">
                <BellRing className="w-3 h-3" />
                <span>{pendingApplicationsCount} hồ sơ chờ duyệt</span>
              </span>
            )}
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Khởi Nghiệp Bán Hàng Cùng VIETSHOP Mall
              <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400 hidden sm:inline shrink-0" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Hệ sinh thái thương mại điện tử chuyên nghiệp: quản lý sản phẩm đa biến thể, tra cứu đơn hàng real-time, ví rút tiền 24/7 và hệ thống giám sát toàn diện từ Ban Quản Trị VIETSHOP.
            </p>
          </div>

          {/* Core Feature Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
            <div className="flex items-center gap-1.5 text-slate-200 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">Phân quyền RBAC</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-200 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5">
              <PackagePlus className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span className="truncate">Kho & Biến thể</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-200 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5">
              <Wallet className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <span className="truncate">Ví rút tiền Napas</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-200 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">Giám sát toàn sàn</span>
            </div>
          </div>
        </div>

        {/* Right CTA & Role Switcher */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenRegisterModal}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#ee4d2d] to-orange-500 hover:from-[#d73211] hover:to-orange-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>Đăng Ký Mở Gian Hàng 0Đ</span>
            </button>

            <button
              onClick={onGoToSellerDashboard}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Layers className="w-4 h-4 text-orange-400" />
              <span>Vào Quản Trị VIETSHOP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Role Toggle Bar */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-2 flex items-center justify-between gap-2 text-xs">
            <span className="text-slate-400 text-[11px] font-medium pl-1">
              Chế độ xem:
            </span>
            <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-xl">
              <button
                onClick={() => onChangeRole('customer')}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  currentRole === 'customer' 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Khách Mua
              </button>
              <button
                onClick={() => onChangeRole('seller')}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  currentRole === 'seller' || currentRole === 'vendor' 
                    ? 'bg-[#ee4d2d] text-white shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Người Bán
              </button>
              <button
                onClick={() => onChangeRole('admin')}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  currentRole === 'admin' 
                    ? 'bg-purple-600 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Quản Trị Sàn
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
