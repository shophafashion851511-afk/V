import React, { useState } from 'react';
import { SiteConfig, ShopSettings } from '../types';
import { 
  X, Check, Edit3, Image, Sparkles, Sliders, 
  Lock, RotateCcw, AlertCircle, Type, LayoutTemplate,
  Eye, EyeOff
} from 'lucide-react';

interface LiveTextEditorModalProps {
  siteConfig: SiteConfig;
  shopSettings: ShopSettings;
  onSaveSiteConfig: (config: SiteConfig) => void;
  onSaveShopSettings: (settings: ShopSettings) => void;
  onClose: () => void;
  onResetToDefault: () => void;
}

export const LiveTextEditorModal: React.FC<LiveTextEditorModalProps> = ({
  siteConfig,
  shopSettings,
  onSaveSiteConfig,
  onSaveShopSettings,
  onClose,
  onResetToDefault
}) => {
  const [activeTab, setActiveTab] = useState<'banners' | 'texts' | 'services' | 'security'>('banners');
  const [configForm, setConfigForm] = useState<SiteConfig>({ ...siteConfig });
  const [shopForm, setShopForm] = useState<ShopSettings>({ ...shopSettings });
  const [showPassword, setShowPassword] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSiteConfig(configForm);
    onSaveShopSettings(shopForm);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleUpdateSlide = (index: number, field: string, value: string) => {
    setConfigForm(prev => {
      const slides = [...prev.heroSlides];
      slides[index] = { ...slides[index], [field]: value };
      return { ...prev, heroSlides: slides };
    });
  };

  const handleUpdateMiniBanner = (index: number, field: string, value: string) => {
    setConfigForm(prev => {
      const minis = [...prev.miniBanners];
      minis[index] = { ...minis[index], [field]: value };
      return { ...prev, miniBanners: minis };
    });
  };

  const handleUpdateServiceLabel = (index: number, label: string) => {
    setConfigForm(prev => {
      const services = [...prev.fastServices];
      services[index] = { ...services[index], label };
      return { ...prev, fastServices: services };
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#ee4d2d] flex items-center justify-center font-bold">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Chỉnh Sửa Toàn Bộ Chữ & Banner Trang Web
              </h2>
              <p className="text-xs text-slate-500">
                Thay đổi mọi tiêu đề, banner trượt, nút dịch vụ và mật khẩu kênh người bán.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1.5 py-3 border-b border-slate-100 overflow-x-auto shrink-0 custom-scrollbar">
          {[
            { id: 'banners', label: '🖼️ Banner Trượt & Mini Banner' },
            { id: 'texts', label: '✍️ Tiêu Đề, Thông Báo & Chữ Trang Chủ' },
            { id: 'services', label: '⚡ 8 Nút Dịch Vụ Nhanh' },
            { id: 'security', label: '🔐 Mật Khẩu Kênh Người Bán' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#ee4d2d] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSaveAll} className="flex-1 overflow-y-auto py-4 space-y-6 text-xs custom-scrollbar pr-1">
          
          {/* TAB 1: BANNERS & SLIDES */}
          {activeTab === 'banners' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-3">1. Ba Slide Banner Chính (Hero Slider)</h3>
                <div className="space-y-4">
                  {configForm.heroSlides.map((slide, idx) => (
                    <div key={slide.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between font-bold text-slate-700">
                        <span>Slide #{idx + 1}</span>
                        <span className="text-[10px] text-orange-600 font-mono">ID: {slide.id}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-semibold text-slate-600 block mb-1">Tiêu Đề Lớn (Title)</label>
                          <input
                            type="text"
                            value={slide.title}
                            onChange={(e) => handleUpdateSlide(idx, 'title', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-600 block mb-1">Thẻ Huy Hiệu (Tag nhỏ)</label>
                          <input
                            type="text"
                            value={slide.tag}
                            onChange={(e) => handleUpdateSlide(idx, 'tag', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-600 block mb-1">Mô Tả / Phụ Đề (Subtitle)</label>
                        <input
                          type="text"
                          value={slide.subtitle}
                          onChange={(e) => handleUpdateSlide(idx, 'subtitle', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-600 block mb-1">URL Hình Ảnh Nền Slide</label>
                        <input
                          type="text"
                          value={slide.image}
                          onChange={(e) => handleUpdateSlide(idx, 'image', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini Banners */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm mb-3">2. Hai Banner Mini Bên Phải</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {configForm.miniBanners.map((mini, idx) => (
                    <div key={mini.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="font-bold text-slate-700">Banner Phải #{idx + 1}</div>
                      <div>
                        <label className="font-semibold text-slate-600 block mb-1">Tag Nhãn</label>
                        <input
                          type="text"
                          value={mini.tag}
                          onChange={(e) => handleUpdateMiniBanner(idx, 'tag', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-600 block mb-1">Tiêu Đề Banner</label>
                        <input
                          type="text"
                          value={mini.title}
                          onChange={(e) => handleUpdateMiniBanner(idx, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-600 block mb-1">URL Hình Ảnh</label>
                        <input
                          type="text"
                          value={mini.image}
                          onChange={(e) => handleUpdateMiniBanner(idx, 'image', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TEXTS & SECTION HEADINGS */}
          {activeTab === 'texts' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 text-sm">Thanh Thông Báo & Tìm Kiếm</h4>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Thanh thông báo chạy trên đầu trang (Announcement)</label>
                  <input
                    type="text"
                    value={configForm.topAnnouncement}
                    onChange={(e) => setConfigForm(prev => ({ ...prev, topAnnouncement: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Placeholder ô tìm kiếm</label>
                  <input
                    type="text"
                    value={configForm.searchPlaceholder}
                    onChange={(e) => setConfigForm(prev => ({ ...prev, searchPlaceholder: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 text-sm">Tiêu Đề Các Mục Trên Trang</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Tiêu đề Flash Sale</label>
                    <input
                      type="text"
                      value={configForm.flashSaleTitle}
                      onChange={(e) => setConfigForm(prev => ({ ...prev, flashSaleTitle: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-red-600"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Tiêu đề Gợi Ý Hôm Nay</label>
                    <input
                      type="text"
                      value={configForm.discoveryTitle}
                      onChange={(e) => setConfigForm(prev => ({ ...prev, discoveryTitle: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 text-sm">Chân Trang (Footer) & Thông Tin Liên Hệ</h4>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Giới thiệu ngắn về Shop</label>
                  <textarea
                    rows={2}
                    value={configForm.footerAbout}
                    onChange={(e) => setConfigForm(prev => ({ ...prev, footerAbout: e.target.value }))}
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Hotline CSKH</label>
                    <input
                      type="text"
                      value={configForm.footerHotline}
                      onChange={(e) => setConfigForm(prev => ({ ...prev, footerHotline: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Email hỗ trợ</label>
                    <input
                      type="text"
                      value={configForm.footerEmail}
                      onChange={(e) => setConfigForm(prev => ({ ...prev, footerEmail: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 8 FAST SERVICES BUTTONS */}
          {activeTab === 'services' && (
            <div className="space-y-3">
              <p className="text-slate-500 text-xs">Chỉnh sửa tên hiển thị của 8 biểu tượng tròn ngay bên dưới banner chính:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {configForm.fastServices.map((service, idx) => (
                  <div key={service.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${service.color} flex items-center justify-center font-bold text-xs shrink-0 shadow-sm`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <label className="font-semibold text-slate-500 text-[10px] block">Nút #{idx + 1} ({service.id})</label>
                      <input
                        type="text"
                        value={service.label}
                        onChange={(e) => handleUpdateServiceLabel(idx, e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-800 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SELLER SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 max-w-lg">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                <Lock className="w-4 h-4 text-[#ee4d2d]" />
                <span>Cài Đặt Mật Khẩu Kênh Người Bán</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 block">Mật Khẩu Kênh Người Bán</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-slate-500 hover:text-[#ee4d2d] flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Ẩn mật khẩu</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Hiện mật khẩu</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={configForm.sellerPassword || ''}
                  onChange={(e) => setConfigForm(prev => ({ ...prev, sellerPassword: e.target.value }))}
                  placeholder="Nhập mật khẩu quản trị..."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-black text-slate-900 font-mono text-sm tracking-wide focus:outline-none focus:border-[#ee4d2d]"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Mật khẩu được lưu trữ an toàn và bảo vệ toàn bộ quyền quản trị cửa hàng của bạn.
                </p>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-950 text-[11px] space-y-1">
                <strong className="block">🔒 Bảo Mật Nghiêm Ngặt:</strong>
                <p>Mật khẩu của bạn không bao giờ hiển thị công khai cho khách hàng khi ghé thăm trang web.</p>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (confirm('Bạn có muốn đặt lại toàn bộ chữ và banner về cấu hình VIETSHOP mặc định?')) {
                  onResetToDefault();
                  onClose();
                }
              }}
              className="text-slate-400 hover:text-red-600 font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi Phục Chữ Gốc</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                Hủy Bỏ
              </button>

              <button
                type="submit"
                className="flex-1 sm:flex-initial px-6 py-2.5 bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] hover:from-[#d73211] text-white font-black rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{savedSuccess ? 'Đã Lưu Thành Công!' : 'Lưu Thay Đổi Ngay'}</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
