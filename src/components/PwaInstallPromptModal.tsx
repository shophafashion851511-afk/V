import React, { useState, useEffect } from 'react';
import { 
  Smartphone, Download, Share2, PlusSquare, CheckCircle2, 
  X, Zap, Sparkles, ShieldCheck, ChevronRight, Bell,
  ArrowDown, Check, ArrowRight, HelpCircle
} from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';

interface PwaInstallPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
}

export const PwaInstallPromptModal: React.FC<PwaInstallPromptModalProps> = ({
  isOpen,
  onClose,
  onOpen
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'auto' | 'ios' | 'android'>('auto');
  const [installSuccess, setInstallSuccess] = useState(false);
  const [installError, setInstallError] = useState<string | null>(null);

  // Set default tab based on detected device
  useEffect(() => {
    if (isIOS) {
      setActiveTab('ios');
    } else if (isAndroid) {
      setActiveTab('android');
    } else {
      setActiveTab('auto');
    }
  }, [isIOS, isAndroid]);

  const handleNativeInstall = async () => {
    setInstallError(null);
    try {
      const result = await install();
      if (result === 'accepted') {
        setInstallSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2500);
      } else if (result === 'unsupported') {
        // Switch to manual guide tab
        if (isIOS) {
          setActiveTab('ios');
        } else {
          setActiveTab('android');
        }
      }
    } catch {
      setInstallError('Không thể mở hộp thoại cài đặt tự động. Vui lòng xem hướng dẫn chi tiết bên dưới!');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white text-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header with App Branding */}
        <div className="bg-gradient-to-r from-[#ee4d2d] via-[#ff5722] to-[#f43f5e] p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white cursor-pointer transition"
            title="Đóng hộp thoại"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5 pr-8">
            <div className="relative">
              <img
                src="/pwa-192x192.png"
                alt="VIETSHOP Icon"
                className="w-14 h-14 rounded-2xl shadow-lg border-2 border-white/40 object-cover bg-white"
                onError={(e) => {
                  // Fallback to SVG if PNG fails
                  (e.target as HTMLImageElement).src = '/icon.svg';
                }}
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full ring-2 ring-white">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="bg-white/20 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  VIETSHOP App
                </span>
                <span className="text-[11px] text-yellow-200 font-semibold flex items-center gap-0.5">
                  ⭐ 4.9/5 (1.2M lượt tải)
                </span>
              </div>
              <h2 className="text-lg font-black tracking-tight leading-snug mt-0.5">
                Cài Đặt VIETSHOP Vào Điện Thoại
              </h2>
              <p className="text-xs text-white/90">
                Thêm ứng dụng vào Màn hình chính – Mua sắm siêu tốc 1 chạm!
              </p>
            </div>
          </div>
        </div>

        {/* Device Switcher Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 shrink-0">
          <button
            onClick={() => setActiveTab('auto')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'auto'
                ? 'border-[#ee4d2d] text-[#ee4d2d] bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Cài Tự Động</span>
          </button>
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'android'
                ? 'border-[#ee4d2d] text-[#ee4d2d] bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android / Chrome</span>
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'ios'
                ? 'border-[#ee4d2d] text-[#ee4d2d] bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>iPhone / Safari</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 custom-scrollbar text-xs">
          {installSuccess ? (
            <div className="py-8 text-center space-y-3 animate-in zoom-in duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-base font-black text-slate-900">Cài Đặt Ứng Dụng Thành Công!</h3>
              <p className="text-slate-600 max-w-xs mx-auto text-xs">
                Biểu tượng VIETSHOP đã được thêm vào màn hình chính của bạn. Hãy mở app ngay để trải nghiệm mua sắm mượt mà nhất!
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition"
              >
                Hoàn Tất
              </button>
            </div>
          ) : (
            <>
              {/* Tab 1: Auto / Quick install */}
              {activeTab === 'auto' && (
                <div className="space-y-4">
                  {/* Action card */}
                  <div className="bg-orange-50/80 border border-orange-200 rounded-2xl p-4 text-center space-y-3">
                    <div className="inline-flex items-center gap-1.5 bg-orange-100 text-[#ee4d2d] font-bold text-[11px] px-3 py-1 rounded-full">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Công nghệ Progressive Web App (PWA)</span>
                    </div>
                    
                    <p className="text-slate-700 leading-relaxed font-medium">
                      Cài đặt trực tiếp từ trình duyệt chỉ trong <strong>2 giây</strong>, không tốn bộ nhớ máy (~2MB), không cần qua kho ứng dụng CH Play hay App Store phức tạp!
                    </p>

                    {isInstallable ? (
                      <button
                        onClick={handleNativeInstall}
                        className="w-full py-3 bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] hover:from-orange-600 hover:to-orange-700 text-white font-black text-sm rounded-xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 cursor-pointer transition transform active:scale-98"
                      >
                        <Download className="w-4 h-4" />
                        <span>Cài Đặt VIETSHOP Ngay Bây Giờ</span>
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <button
                          onClick={handleNativeInstall}
                          className="w-full py-3 bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] hover:from-orange-600 hover:to-orange-700 text-white font-black text-sm rounded-xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 cursor-pointer transition transform active:scale-98"
                        >
                          <Download className="w-4 h-4" />
                          <span>Nhấn Để Cài Đặt Vào Máy</span>
                        </button>
                        <p className="text-[11px] text-slate-500">
                          {isIOS 
                            ? '👉 Bạn đang dùng iPhone? Xem tab "iPhone / Safari" bên trên để thêm vào MH chính.'
                            : '👉 Trình duyệt hỗ trợ cài đặt trực tiếp trên Android Chrome & Samsung Internet.'}
                        </p>
                      </div>
                    )}

                    {installError && (
                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] text-left">
                        {installError}
                      </div>
                    )}
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">Mở Nhanh 1 Chạm</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Không cần gõ lại link web</div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">Săn Voucher Sớm</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Báo mã 0Đ & Flash Sale</div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">Siêu Tiết Kiệm</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Chỉ ~2MB bộ nhớ & data</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Android / Chrome Step Guide */}
              {activeTab === 'android' && (
                <div className="space-y-3">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-2.5">
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      <span>Hướng Dẫn Cài Đặt Trên Điện Thoại Android:</span>
                    </h4>

                    <ol className="space-y-3 text-slate-700">
                      <li className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                          1
                        </span>
                        <div>
                          <p className="font-bold text-slate-900">Bấm nút Cài đặt tự động hoặc Menu trình duyệt</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Nếu có nút <strong className="text-[#ee4d2d]">"Cài đặt ứng dụng"</strong> xuất hiện trên thanh địa chỉ, hãy bấm vào đó.
                          </p>
                        </div>
                      </li>

                      <li className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                          2
                        </span>
                        <div>
                          <p className="font-bold text-slate-900">Nhấn biểu tượng Menu 3 chấm (⋮)</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Tại góc trên cùng bên phải trình duyệt Chrome / Cốc Cốc / Samsung Internet.
                          </p>
                        </div>
                      </li>

                      <li className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                          3
                        </span>
                        <div>
                          <p className="font-bold text-slate-900">Chọn "Cài đặt ứng dụng" hoặc "Thêm vào màn hình chính"</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Chọn <strong>Cài đặt (Install)</strong> để ứng dụng hiển thị độc lập không có thanh địa chỉ trình duyệt.
                          </p>
                        </div>
                      </li>
                    </ol>
                  </div>

                  {/* Android Quick Action button */}
                  <button
                    onClick={handleNativeInstall}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Thử Cài Đặt Ngay</span>
                  </button>
                </div>
              )}

              {/* Tab 3: iOS iPhone / iPad Step Guide */}
              {activeTab === 'ios' && (
                <div className="space-y-3">
                  <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-200">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-2.5 text-sky-900">
                      <Share2 className="w-4 h-4 text-sky-600" />
                      <span>Hướng Dẫn Cho iPhone / iPad (Trình Duyệt Safari):</span>
                    </h4>

                    <ol className="space-y-3 text-slate-700">
                      <li className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-sky-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                          1
                        </span>
                        <div>
                          <p className="font-bold text-slate-900 flex items-center gap-1">
                            Bấm nút <strong className="text-sky-600">Chia sẻ</strong> 
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px]">
                              <Share2 className="w-3 h-3 mr-0.5" /> Share
                            </span>
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Nằm ở thanh công cụ dưới cùng của màn hình Safari trên iPhone.
                          </p>
                        </div>
                      </li>

                      <li className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-sky-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                          2
                        </span>
                        <div>
                          <p className="font-bold text-slate-900 flex items-center gap-1">
                            Cuộn xuống và chọn <strong className="text-sky-600">"Thêm vào MH chính"</strong>
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px]">
                              <PlusSquare className="w-3 h-3 mr-0.5" /> Add to Home Screen
                            </span>
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Biểu tượng hình ô vuông có dấu cộng (+) bên trong.
                          </p>
                        </div>
                      </li>

                      <li className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-sky-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                          3
                        </span>
                        <div>
                          <p className="font-bold text-slate-900">
                            Nhấn <strong className="text-sky-600">"Thêm" (Add)</strong> ở góc trên bên phải
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Hoàn tất! Logo VIETSHOP màu cam sẽ xuất hiện ngay trên màn hình điện thoại iPhone của bạn.
                          </p>
                        </div>
                      </li>
                    </ol>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>Lưu ý: Trên iOS, tính năng thêm vào màn hình chính chỉ hoạt động khi bạn mở trang bằng trình duyệt <strong>Safari</strong> mặc định của Apple.</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-xl transition cursor-pointer"
          >
            Để sau
          </button>

          {!installSuccess && (
            <button
              onClick={() => {
                if (activeTab === 'auto' && isInstallable) {
                  handleNativeInstall();
                } else {
                  handleNativeInstall();
                }
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Tiến Hành Cài Đặt</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Also export a Quick Floating Banner / Trigger Button
interface PwaQuickBannerProps {
  onOpenModal: () => void;
}

export const PwaQuickBanner: React.FC<PwaQuickBannerProps> = ({ onOpenModal }) => {
  const { isInstalled } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);

  // If already in standalone mode, hide
  if (isInstalled) return null;

  return (
    <>
      {/* 1. Mobile Bottom Notification Banner (shown if not dismissed) */}
      {!isDismissed && (
        <aside 
          aria-label="Thanh cài đặt ứng dụng VIETSHOP"
          className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:w-96 z-40 bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-2xl border border-orange-500/30 backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300 flex items-center justify-between gap-3"
        >
          <div 
            onClick={onOpenModal}
            className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
          >
            <div className="relative shrink-0">
              <img
                src="/pwa-192x192.png"
                alt="VIETSHOP"
                className="w-10 h-10 rounded-xl object-cover border border-white/20"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/icon.svg';
                }}
              />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ee4d2d]"></span>
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-black text-white flex items-center gap-1.5">
                <span>Cài Đặt VIETSHOP App</span>
                <span className="bg-[#ee4d2d] text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full text-white">
                  Miễn phí
                </span>
              </div>
              <p className="text-[10px] text-slate-300 truncate mt-0.5">
                Thêm vào màn hình chính điện thoại để mua sắm mượt mà
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onOpenModal}
              className="px-3 py-1.5 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Cài Đặt</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDismissed(true);
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
              title="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* 2. Floating Quick Pill if banner is dismissed so user can ALWAYS re-open anytime */}
      {isDismissed && (
        <button
          onClick={onOpenModal}
          className="fixed bottom-6 left-4 sm:bottom-6 sm:left-6 z-40 bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] hover:from-orange-600 hover:to-orange-700 text-white px-3.5 py-2.5 rounded-full shadow-2xl border border-white/30 flex items-center gap-2 font-bold text-xs cursor-pointer transition transform hover:scale-105 active:scale-95 ring-4 ring-orange-200/50"
          title="Cài đặt VIETSHOP vào điện thoại"
        >
          <Smartphone className="w-4 h-4 text-yellow-300" />
          <span>📲 Cài Đặt App</span>
        </button>
      )}
    </>
  );
};
