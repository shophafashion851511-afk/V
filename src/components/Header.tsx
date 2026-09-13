import React, { useState } from 'react';
import { 
  Search, ShoppingCart, Bell, HelpCircle, Globe, Store, 
  User, ChevronDown, Sparkles, X, CheckCircle2, ArrowRight, Lock,
  Package, LogIn, LogOut, Phone, Mail, Flame, Truck, Tag, Check, UserPlus, Wallet,
  ShieldCheck, Smartphone
} from 'lucide-react';
import { CartItem, ViewMode, SiteConfig, CustomerUser } from '../types';
import { formatVND } from '../utils/formatters';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  cart: CartItem[];
  onOpenCart: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectCategory?: (catId: string) => void;
  onOpenProduct?: (productId: string) => void;
  siteConfig?: SiteConfig;
  shopName?: string;
  onOpenAdminLogin?: () => void;
  isAdminAuthenticated?: boolean;
  onOpenSellerLogin?: () => void;
  isSellerAuthenticated?: boolean;
  onOpenHelp?: (tab?: string) => void;
  onOpenSellerRegister?: () => void;
  currentCustomer?: CustomerUser | null;
  onOpenCustomerAuth?: (mode?: 'register' | 'login') => void;
  onLogoutCustomer?: () => void;
  onOpenOrderTracking?: () => void;
  onOpenWallet?: () => void;
  walletBalance?: number;
  onOpenInstallModal?: () => void;
}

const TRENDING_KEYWORDS = [
  'Áo thun oversize',
  'Tai nghe bluetooth',
  'Son kem lì',
  'Giày sneaker',
  'Nồi chiên không dầu',
  'Ốp lưng iPhone',
  'Bình giữ nhiệt 1000ml'
];

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  cart,
  onOpenCart,
  searchQuery,
  setSearchQuery,
  onSelectCategory,
  siteConfig,
  shopName = 'VIETSHOP',
  onOpenAdminLogin,
  isAdminAuthenticated,
  onOpenSellerLogin,
  isSellerAuthenticated,
  onOpenHelp,
  onOpenSellerRegister,
  currentCustomer,
  onOpenCustomerAuth,
  onLogoutCustomer,
  onOpenOrderTracking,
  onOpenWallet,
  walletBalance,
  onOpenInstallModal
}) => {
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifTab, setNotifTab] = useState<'all' | 'promos' | 'orders'>('all');
  const [allRead, setAllRead] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartAmount = cart.filter(i => i.selected).reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
  };

  const activeKeywords = siteConfig?.popularKeywords
    ? siteConfig.popularKeywords.split(',').map(s => s.trim()).filter(Boolean)
    : TRENDING_KEYWORDS;

  const handleAdminButtonClick = () => {
    if (viewMode === 'admin') {
      setViewMode('buyer');
    } else {
      if (isAdminAuthenticated) {
        setViewMode('admin');
      } else if (onOpenAdminLogin) {
        onOpenAdminLogin();
      } else {
        setViewMode('admin');
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-b from-[#ee4d2d] to-[#ff5722] text-white shadow-md">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 border-b border-white/15 overflow-x-hidden">
        <div className="flex items-center justify-between text-xs py-1.5 font-medium gap-2">
          {/* Left links */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={handleAdminButtonClick}
              className="flex items-center gap-1.5 hover:text-white/80 transition-colors bg-white/15 hover:bg-white/25 px-2.5 py-0.5 rounded-full font-semibold cursor-pointer shadow-xs"
              title="Khu vực Quản trị Hệ Thống VIETSHOP (Bảo mật bằng mật khẩu riêng)"
            >
              {viewMode === 'admin' ? (
                <>
                  <Store className="w-3.5 h-3.5" />
                  <span>← Về Trang Mua Sắm</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-yellow-300" />
                  <span>🛡️ Quản Trị Hệ Thống</span>
                </>
              )}
            </button>

            {/* 2. Gian Hàng Người Bán (Kênh Người Bán & Đăng Bán Hàng) */}
            <button
              onClick={() => {
                if (viewMode === 'seller') {
                  setViewMode('buyer');
                } else {
                  if (isSellerAuthenticated) {
                    setViewMode('seller');
                  } else if (onOpenSellerLogin) {
                    onOpenSellerLogin();
                  } else {
                    setViewMode('seller');
                  }
                }
              }}
              className={`flex items-center gap-1.5 transition-all px-2.5 py-0.5 rounded-full font-bold cursor-pointer shadow-xs ${
                viewMode === 'seller'
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 ring-2 ring-white/50'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
              title="Kênh Quản Trị Gian Hàng Người Bán (Đăng bán sản phẩm, quản lý đơn hàng & ví doanh thu)"
            >
              {viewMode === 'seller' ? (
                <>
                  <span>← Về Mua Sắm</span>
                </>
              ) : (
                <>
                  <Store className="w-3.5 h-3.5 text-yellow-300" />
                  <span>🏪 Gian Hàng Người Bán</span>
                </>
              )}
            </button>

            <span className="text-white/40 hidden sm:inline">|</span>
            <span className="hidden lg:inline hover:text-white/80 cursor-pointer">
              {siteConfig?.topAnnouncement || 'VIETSHOP bao ship 0Đ - Đăng ký nhận ngay 100k'}
            </span>
          </div>

          {/* Right links */}
          <div className="flex items-center gap-4">
            <div>
              <button 
                onClick={() => setNotificationOpen(true)}
                className="flex items-center gap-1 hover:text-white/80 cursor-pointer"
                title="Xem thông báo hệ thống và ưu đãi"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Thông Báo</span>
                <span className="w-2 h-2 rounded-full bg-yellow-300"></span>
              </button>

              {/* Centered Modal for Notifications so it is NEVER hidden or clipped */}
              {notificationOpen && (
                <div 
                  className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
                  onClick={() => setNotificationOpen(false)}
                >
                  <div 
                    className="bg-white text-slate-800 rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-5 sm:p-6 relative animate-in zoom-in-95 duration-150 text-xs flex flex-col max-h-[85vh]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#ee4d2d] flex items-center justify-center font-bold">
                          <Bell className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-black text-slate-900">Thông Báo VIETSHOP</h3>
                          <p className="text-[11px] text-slate-500">Khuyến mãi, ưu đãi voucher và cập nhật đơn mua</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setNotificationOpen(false)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Filter Tabs & Mark as read */}
                    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 shrink-0 gap-2">
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setNotifTab('all')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            notifTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Tất Cả
                        </button>
                        <button
                          type="button"
                          onClick={() => setNotifTab('promos')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            notifTab === 'promos' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Khuyến Mãi
                        </button>
                        <button
                          type="button"
                          onClick={() => setNotifTab('orders')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            notifTab === 'orders' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Đơn Mua
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setAllRead(true)}
                        className="text-[11px] font-bold text-[#ee4d2d] hover:underline cursor-pointer flex items-center gap-1 shrink-0"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{allRead ? 'Đã đọc tất cả' : 'Đánh dấu đã đọc'}</span>
                      </button>
                    </div>

                    {/* Notification List */}
                    <div className="py-3 space-y-2.5 overflow-y-auto pr-1 custom-scrollbar flex-1">
                      {/* Notif 1: Promo */}
                      {(notifTab === 'all' || notifTab === 'promos') && (
                        <div className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          allRead ? 'bg-slate-50 border-slate-200' : 'bg-orange-50/70 border-orange-200 hover:bg-orange-100/70'
                        }`}>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-black text-[#ee4d2d] text-xs">Siêu Đại Hội Sale VIETSHOP 9.9!</h4>
                                <span className="text-[10px] text-slate-400">10 phút trước</span>
                              </div>
                              <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                                Hàng ngàn mã giảm giá 50%, voucher 500k và miễn phí vận chuyển 0Đ đã có trong kho voucher của bạn. Nhấn để áp dụng ngay!
                              </p>
                              <div className="mt-2 flex items-center gap-2">
                                <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-md">Voucher 500K</span>
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">Freeship 0Đ</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Notif 2: Order Update */}
                      {(notifTab === 'all' || notifTab === 'orders') && (
                        <div 
                          onClick={() => {
                            setNotificationOpen(false);
                            if (onOpenOrderTracking) onOpenOrderTracking();
                          }}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                            allRead ? 'bg-slate-50 border-slate-200' : 'bg-blue-50/70 border-blue-200 hover:bg-blue-100/70'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                              <Truck className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-slate-900 text-xs">Cập Nhật Tiến Trình Đơn Mua #SP98234710</h4>
                                <span className="text-[10px] text-slate-400">1 giờ trước</span>
                              </div>
                              <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                                Kiện hàng của bạn đã được đối tác SPX Express bàn giao cho bưu tá giao hàng. Vui lòng để ý điện thoại để nhận hàng.
                              </p>
                              <div className="mt-2 flex items-center gap-1.5 text-blue-600 font-bold text-[11px]">
                                <span>Xem chi tiết lộ trình đơn mua</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Notif 3: Flash sale */}
                      {(notifTab === 'all' || notifTab === 'promos') && (
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-red-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                              <Flame className="w-4 h-4 fill-current" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-slate-900 text-xs">Khung Giờ Flash Sale Sắp Mở Bán</h4>
                                <span className="text-[10px] text-slate-400">Hôm nay</span>
                              </div>
                              <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                                Khung giờ vàng 12:00 hôm nay đồng giá 9K và giảm giá đến 70% toàn bộ phụ kiện công nghệ và thời trang.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Notif 4: Wallet coin */}
                      {(notifTab === 'all') && (
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-xl bg-yellow-500 text-white flex items-center justify-center shrink-0 shadow-sm font-bold">
                              🪙
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-slate-900 text-xs">Cộng 1.000 Xu VIETSHOP</h4>
                                <span className="text-[10px] text-slate-400">Hôm qua</span>
                              </div>
                              <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                                Bạn đã hoàn thành điểm danh nhận xu hàng ngày. Xu dùng để giảm trực tiếp vào đơn mua tiếp theo.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setNotificationOpen(false);
                          if (onOpenOrderTracking) onOpenOrderTracking();
                        }}
                        className="w-full py-2.5 bg-gradient-to-r from-orange-600 to-[#ee4d2d] hover:from-orange-700 hover:to-[#d73211] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition"
                      >
                        <Package className="w-4 h-4" />
                        <span>Xem Lộ Trình Đơn Mua</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Tracking button: renamed to 'Đơn Mua' */}
            <button
              onClick={onOpenOrderTracking}
              className="flex items-center gap-1.5 hover:text-white/90 bg-white/15 hover:bg-white/25 px-2.5 py-0.5 rounded-full cursor-pointer transition font-semibold"
              title="Xem và tra cứu tiến trình đơn mua của bạn"
            >
              <Package className="w-3.5 h-3.5 text-yellow-300" />
              <span>Đơn Mua</span>
            </button>

            {/* Customer User Account */}
            {currentCustomer ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 hover:text-white/90 cursor-pointer font-bold bg-white/20 hover:bg-white/30 px-2.5 py-0.5 rounded-full transition"
                >
                  <img
                    src={currentCustomer.avatar}
                    alt={currentCustomer.name}
                    className="w-4 h-4 rounded-full object-cover border border-white/40"
                  />
                  <span className="max-w-[110px] truncate">{currentCustomer.name}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                      <img
                        src={currentCustomer.avatar}
                        alt={currentCustomer.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-900 truncate">{currentCustomer.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {currentCustomer.provider === 'google' && '📧 Gmail: ' + currentCustomer.email}
                          {currentCustomer.provider === 'phone' && '📱 SĐT: ' + currentCustomer.phone}
                          {currentCustomer.provider === 'facebook' && '🌐 Facebook: ' + (currentCustomer.email || currentCustomer.name)}
                        </div>
                      </div>
                    </div>

                    <div className="py-2 space-y-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          if (onOpenOrderTracking) onOpenOrderTracking();
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-orange-50 hover:text-[#ee4d2d] flex items-center gap-2 font-bold cursor-pointer transition"
                      >
                        <Package className="w-4 h-4 text-[#ee4d2d]" />
                        <span>Tiến trình đơn mua</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          if (onOpenWallet) onOpenWallet();
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-orange-50 hover:text-[#ee4d2d] flex items-center gap-2 font-bold cursor-pointer transition"
                      >
                        <Wallet className="w-4 h-4 text-[#ee4d2d]" />
                        <span>Ví VIETSHOP Pay (Số dư & Nạp/Rút)</span>
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          if (onLogoutCustomer) onLogoutCustomer();
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-red-50 text-red-600 flex items-center gap-2 font-bold cursor-pointer transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Đăng xuất tài khoản</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenCustomerAuth && onOpenCustomerAuth('login')}
                className="flex items-center gap-1.5 hover:text-white/90 cursor-pointer font-bold bg-white text-[#ee4d2d] hover:bg-orange-50 px-3 py-0.5 rounded-full shadow-xs transition shrink-0"
                title="Đăng nhập hoặc đăng ký tài khoản VIETSHOP"
              >
                <User className="w-3.5 h-3.5" />
                <span>Tài Khoản</span>
              </button>
            )}

            {/* Ví VIETSHOP Button */}
            <button
              onClick={onOpenWallet}
              className="flex items-center gap-1 hover:bg-white/30 transition-colors bg-white/20 px-2.5 py-0.5 rounded-full font-bold cursor-pointer text-xs shrink-0 shadow-xs"
              title="Mở Ví VIETSHOP Pay (Số dư, Nạp/Rút)"
            >
              <Wallet className="w-3.5 h-3.5 text-yellow-300" />
              <span className="hidden sm:inline">Ví:</span>
              <span className="text-yellow-200 font-extrabold">{walletBalance !== undefined ? formatVND(walletBalance) : '2.500.000₫'}</span>
            </button>

            <div 
              onClick={() => {
                if (onOpenHelp) onOpenHelp('help_center');
              }}
              className="hidden sm:flex items-center gap-1 hover:text-white/80 cursor-pointer shrink-0"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Hỗ Trợ</span>
            </div>

            <div 
              onClick={() => {
                if (onOpenHelp) onOpenHelp('about_us');
              }}
              className="hidden md:flex items-center gap-1.5 hover:text-white/80 cursor-pointer font-semibold bg-white/20 px-2.5 py-0.5 rounded-full shrink-0"
            >
              <User className="w-3.5 h-3.5" />
              <span>{shopName} VIP Club</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Search & Logo Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          
          {/* Brand Logo */}
          <div 
            onClick={() => {
              setViewMode('buyer');
              if (onSelectCategory) onSelectCategory('all');
              setSearchQuery('');
            }}
            className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white text-[#ee4d2d] rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-black/10">
              <ShoppingCart className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-sm font-['Plus_Jakarta_Sans',sans-serif]">
                  {shopName || 'VIETSHOP'}
                </span>
                <span className="text-[10px] bg-yellow-300 text-slate-900 font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                  SIÊU THỊ
                </span>
              </div>
              <p className="text-[10px] text-white/85 hidden sm:block tracking-wide font-medium">
                Siêu Thị Mua Sắm Trực Tuyến & Quản Trị Cửa Hàng
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-3xl relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="flex items-center bg-white rounded-xl shadow-lg overflow-hidden p-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={siteConfig?.searchPlaceholder || "VIETSHOP bao ship 0Đ - Đăng ký nhận ngay 100k..."}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-slate-800 focus:outline-none placeholder:text-slate-400"
                />
                
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] hover:from-[#d73211] hover:to-[#e64a19] text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg flex items-center justify-center transition-all cursor-pointer font-bold shadow-sm"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </form>

            {/* Auto suggestions */}
            {showSuggestions && (
              <div 
                className="absolute left-0 right-0 top-full mt-2 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                onMouseLeave={() => setShowSuggestions(false)}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#ee4d2d]" />
                    Tìm Kiếm Phổ Biến & Gợi Ý
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">Nhấn để tìm</span>
                </div>
                <div className="pt-2 flex flex-wrap gap-2">
                  {activeKeywords.map((kw, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSearchQuery(kw);
                        setShowSuggestions(false);
                      }}
                      className="text-xs bg-slate-100 hover:bg-orange-50 hover:text-[#ee4d2d] text-slate-700 px-3 py-1.5 rounded-xl transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{kw}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Trending Sub-tags */}
            <div className="hidden md:flex items-center gap-3 mt-1.5 text-[11px] text-white/90 overflow-hidden text-ellipsis whitespace-nowrap">
              {activeKeywords.slice(0, 6).map((tag, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSearchQuery(tag)}
                  className="hover:text-yellow-200 hover:underline transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Cart Icon & Trigger */}
          <div className="relative shrink-0">
            <button
              onClick={onOpenCart}
              onMouseEnter={() => setShowCartPreview(true)}
              onMouseLeave={() => setShowCartPreview(false)}
              className="relative p-2.5 sm:p-3 hover:bg-white/20 rounded-2xl transition-colors cursor-pointer group"
              aria-label="Xem giỏ hàng"
            >
              <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-[#ee4d2d] font-black text-xs px-2 py-0.5 rounded-full shadow-md border-2 border-[#ee4d2d] animate-pulse">
                  {totalCartCount > 99 ? '99+' : totalCartCount}
                </span>
              )}
            </button>

            {/* Cart Preview Hover Popover */}
            {showCartPreview && totalCartCount > 0 && (
              <div 
                className="absolute right-0 top-full mt-2 w-80 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 hidden sm:block"
                onMouseEnter={() => setShowCartPreview(true)}
                onMouseLeave={() => setShowCartPreview(false)}
              >
                <div className="text-xs font-bold text-slate-500 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span>Sản Phẩm Vừa Thêm ({totalCartCount})</span>
                  <span className="text-[#ee4d2d]">{formatVND(totalCartAmount)}</span>
                </div>
                
                <div className="py-2 space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                  {cart.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-2.5 p-1.5 hover:bg-slate-50 rounded-xl">
                      <img src={item.product.image} alt={item.product.name} className="w-11 h-11 object-cover rounded-lg border border-slate-200 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{item.product.name}</p>
                        <p className="text-[11px] text-slate-400">Số lượng: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-bold text-[#ee4d2d] shrink-0">
                        {formatVND(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                  {cart.length > 3 && (
                    <p className="text-[11px] text-center text-slate-400">
                      Và {cart.length - 3} sản phẩm khác trong giỏ hàng...
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{cart.length} món hàng</span>
                  <button
                    onClick={onOpenCart}
                    className="bg-[#ee4d2d] hover:bg-[#d73211] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 shadow-md shadow-orange-500/20 cursor-pointer"
                  >
                    <span>Xem Giỏ Hàng</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
