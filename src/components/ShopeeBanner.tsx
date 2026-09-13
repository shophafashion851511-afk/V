import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Zap, Truck, ShieldCheck, 
  Coins, Ticket, Globe, Smartphone, Gift, Edit3,
  Volume2, VolumeX, Film, Wallet
} from 'lucide-react';
import { SiteConfig } from '../types';

interface BannerProps {
  siteConfig?: SiteConfig;
  onQuickActionClick?: (action: string) => void;
  onOpenEdit?: () => void;
}

const DEFAULT_SLIDES = [
  {
    id: 1,
    title: 'SIÊU ĐẠI HỘI SALE 9.9',
    subtitle: 'Voucher 500K • Miễn Phí Vận Chuyển 0Đ • Giảm 50%',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    tag: 'Đại Tiệc Mua Sắm'
  },
  {
    id: 2,
    title: 'VIETSHOP - SIÊU THỊ TRỰC TUYẾN 100% CHÍNH HÃNG',
    subtitle: 'Đổi Trả 15 Ngày • Freeship Xtra • Hàng Chuẩn Giá Tốt',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
    tag: 'Siêu Thị Trực Tuyến'
  },
  {
    id: 3,
    title: 'TECH ZONE - ĐIỆN TỬ CÔNG NGHỆ 2026',
    subtitle: 'Tai Nghe, Laptop, Smartphone Giảm Sốc Đến 60%',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    tag: 'Công Nghệ 2026'
  }
];

const SERVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  flash_sale: Zap,
  freeship: Truck,
  mall: ShieldCheck,
  vouchers: Ticket,
  coin_back: Coins,
  global: Globe,
  recharge: Smartphone,
  rewards: Gift,
  wallet: Wallet,
  shopeepay: Wallet
};

export const ShopeeBanner: React.FC<BannerProps> = ({ 
  siteConfig, 
  onQuickActionClick,
  onOpenEdit
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isBannerMuted, setIsBannerMuted] = useState(true);

  const heroSlides = siteConfig?.heroSlides?.length ? siteConfig.heroSlides : DEFAULT_SLIDES;
  const miniBanners = siteConfig?.miniBanners?.length ? siteConfig.miniBanners : [
    {
      id: 1,
      tag: 'Ưu đãi độc quyền',
      title: 'Voucher Freeship 0Đ Toàn Quốc',
      image: 'https://images.unsplash.com/photo-1526178613552-2b45c6c302f0?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      tag: 'Flash Sale Mỗi Ngày',
      title: 'Đồng Giá Từ 9K - Bảo Đảm Hoàn Tiền',
      image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&auto=format&fit=crop&q=80'
    }
  ];

  const fastServices = siteConfig?.fastServices?.length ? siteConfig.fastServices : [
    { id: 'wallet', label: 'Ví VIETSHOP Pay', color: 'bg-[#ee4d2d] text-white' },
    { id: 'flash_sale', label: 'Khung Giờ Săn Sale', color: 'bg-orange-500 text-white' },
    { id: 'freeship', label: 'Miễn Phí Ship 0Đ', color: 'bg-emerald-500 text-white' },
    { id: 'mall', label: 'Hàng Chính Hãng', color: 'bg-red-500 text-white' },
    { id: 'vouchers', label: 'Mã Giảm Giá', color: 'bg-amber-500 text-white' },
    { id: 'coin_back', label: 'Hoàn Xu 50%', color: 'bg-yellow-500 text-white' },
    { id: 'global', label: 'Hàng Quốc Tế', color: 'bg-blue-500 text-white' },
    { id: 'rewards', label: 'VIETSHOP Rewards', color: 'bg-pink-500 text-white' }
  ];

  // Auto-slide running timer every 3.8s
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [heroSlides.length, isPaused]);

  return (
    <div className="space-y-3 sm:space-y-4 relative group/banner">
      
      {/* 1. RUNNING MARQUEE BANNER (BANNER CHẠY CHỮ THÔNG BÁO SIÊU THỊ LIÊN TỤC) */}
      <div className="bg-gradient-to-r from-orange-600 via-[#ee4d2d] to-rose-600 text-white py-2 px-3 rounded-2xl shadow-sm overflow-hidden relative flex items-center border border-orange-400/30">
        <div className="bg-yellow-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-lg flex items-center gap-1 shrink-0 z-10 shadow-xs mr-2 uppercase tracking-wide">
          <Zap className="w-3 h-3 fill-slate-950 animate-pulse text-slate-950" />
          <span>HOT DEAL</span>
        </div>
        
        <div className="overflow-hidden flex-1 relative whitespace-nowrap">
          <div className="animate-marquee text-xs font-bold flex items-center gap-8 text-orange-50 tracking-wide">
            <span className="flex items-center gap-1.5">
              🔥 <b>VIETSHOP SIÊU THỊ TRỰC TUYẾN:</b> Miễn phí vận chuyển 0Đ toàn quốc đơn từ 0Đ!
            </span>
            <span className="flex items-center gap-1.5">
              🛡️ <b>CAM KẾT 100% CHÍNH HÃNG:</b> Hoàn tiền 200% nếu hàng giả • Bảo hành 12-24 tháng 1 đổi 1!
            </span>
            <span className="flex items-center gap-1.5">
              🔄 <b>ĐỔI TRẢ MIỄN PHÍ 15 NGÀY:</b> Trả hàng nhận lại tiền tận nhà siêu tốc!
            </span>
            <span className="flex items-center gap-1.5">
              ⚡ <b>FLASH SALE KHUNG GIỜ VÀNG:</b> Giảm sốc đến 70% mỗi ngày lúc 00:00 - 09:00 - 12:00 - 21:00!
            </span>
            <span className="flex items-center gap-1.5">
              🎁 <b>VOUCHER THÀNH VIÊN MỚI:</b> Nhận ngay mã giảm 50.000₫ & tích xu không giới hạn!
            </span>
            {/* Duplicated for seamless continuous scroll loop */}
            <span className="flex items-center gap-1.5">
              🔥 <b>VIETSHOP SIÊU THỊ TRỰC TUYẾN:</b> Miễn phí vận chuyển 0Đ toàn quốc đơn từ 0Đ!
            </span>
            <span className="flex items-center gap-1.5">
              🛡️ <b>CAM KẾT 100% CHÍNH HÃNG:</b> Hoàn tiền 200% nếu hàng giả • Bảo hành 12-24 tháng 1 đổi 1!
            </span>
          </div>
        </div>
      </div>

      {/* Banner Container */}

      {/* Top Banner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        
        {/* Main Hero Slider (Tự động chạy chuyển slide mượt mà) */}
        <div 
          className="lg:col-span-2 relative aspect-[21/9] sm:aspect-[2/1] rounded-2xl overflow-hidden shadow-md group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                idx === currentSlide 
                  ? 'opacity-100 scale-100 z-10' 
                  : 'opacity-0 scale-105 z-0 pointer-events-none'
              }`}
            >
              {slide.videoUrl ? (
                <div className="relative w-full h-full bg-black">
                  <video
                    key={slide.videoUrl}
                    src={slide.videoUrl}
                    autoPlay
                    loop
                    muted={isBannerMuted}
                    playsInline
                    className="w-full h-full object-cover brightness-75"
                  />
                  <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 z-20">
                    <Film className="w-3 h-3 text-purple-300" />
                    <span>Video Giới Thiệu</span>
                  </div>
                </div>
              ) : (
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover brightness-75"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-5 sm:p-8 flex flex-col justify-end text-white pointer-events-none">
                <span className="inline-block w-fit bg-[#ee4d2d] text-white text-[11px] font-extrabold px-3 py-0.5 rounded-full mb-2 uppercase tracking-wide shadow-xs">
                  {slide.tag}
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight drop-shadow-md">
                  {slide.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium line-clamp-1">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          ))}

          {/* Sound Control for Active Banner Video */}
          {heroSlides[currentSlide]?.videoUrl && (
            <button
              type="button"
              onClick={() => setIsBannerMuted(!isBannerMuted)}
              className="absolute top-3 right-3 z-30 bg-black/65 hover:bg-black/85 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-xs cursor-pointer shadow-md transition"
              title={isBannerMuted ? 'Bật âm thanh video banner' : 'Tắt âm thanh'}
            >
              {isBannerMuted ? <VolumeX className="w-3.5 h-3.5 text-amber-300" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              <span className="font-semibold text-[11px]">{isBannerMuted ? 'Bật tiếng' : 'Tắt tiếng'}</span>
            </button>
          )}

          {/* Slider Prev / Next Controls */}
          <button
            onClick={() => setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={() => setCurrentSlide(prev => (prev + 1) % heroSlides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Dots Indicator & Auto-running Progress */}
          <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentSlide ? 'bg-[#ee4d2d] w-6' : 'bg-white/60 hover:bg-white w-2'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 2 Right Mini Banners */}
        <div className="hidden lg:flex flex-col gap-3">
          {miniBanners.slice(0, 2).map((banner, idx) => (
            <div 
              key={banner.id || idx}
              onClick={() => {
                if (idx === 0 && onQuickActionClick) onQuickActionClick('freeship');
                if (idx === 1 && onQuickActionClick) onQuickActionClick('flash_sale');
              }}
              className="flex-1 relative rounded-2xl overflow-hidden shadow-md group cursor-pointer"
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent p-4 flex flex-col justify-center text-white">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wide">{banner.tag}</span>
                <h3 className="text-base font-extrabold leading-snug drop-shadow-sm">{banner.title}</h3>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Quick Access Services / Circle icons */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4 text-center">
          {fastServices.map((item) => {
            const Icon = SERVICE_ICONS[item.id] || Zap;
            return (
              <button
                key={item.id}
                onClick={() => onQuickActionClick && onQuickActionClick(item.id)}
                className="flex flex-col items-center gap-2 group cursor-pointer hover:-translate-y-0.5 transition-transform"
              >
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${item.color} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-700 group-hover:text-[#ee4d2d] transition-colors leading-tight line-clamp-2">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
