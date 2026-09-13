import React, { useState } from 'react';
import { 
  SiteConfig, Category, ShopSettings 
} from '../types';
import { 
  LayoutTemplate, Image, Type, Grid, Tag, ShieldCheck, 
  Phone, Mail, MapPin, KeyRound, Plus, Trash2, Edit3, 
  Check, Eye, EyeOff, Lock, Sparkles, RefreshCw, Upload, ExternalLink,
  ChevronRight, AlertCircle, Laptop, ShoppingBag, Shirt,
  Smartphone, Headphones, Heart, Home, Footprints, Activity, User
} from 'lucide-react';

interface SiteManagementViewProps {
  siteConfig: SiteConfig;
  shopSettings: ShopSettings;
  categories: Category[];
  onSaveSiteConfig: (newConfig: SiteConfig) => void;
  onUpdateShopSettings: (newSettings: ShopSettings) => void;
  onUpdateCategories: (categories: Category[]) => void;
  onPreviewBuyerMode: () => void;
}

type TabKey = 'banners' | 'branding' | 'categories' | 'sections' | 'trust' | 'footer' | 'security';

const SAMPLE_BANNER_PRESETS = [
  {
    name: 'Siêu Sale 9.9 Rực Rỡ',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80',
    title: 'ĐẠI HỘI SIÊU SALE VIETSHOP 9.9',
    subtitle: 'Voucher 500K • Miễn Phí Vận Chuyển 0Đ • Giảm Sốc 50%',
    tag: 'Đại Tiệc Mua Sắm'
  },
  {
    name: 'Thời Trang & Phong Cách',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
    title: 'BST THỜI TRANG HÈ MỚI NHẤT',
    subtitle: 'Săn Deal Hàng Hiệu Chuẩn Xu Hướng • Freeship Toàn Quốc',
    tag: 'Xu Hướng Mới'
  },
  {
    name: 'Công Nghệ & Điện Tử',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&auto=format&fit=crop&q=80',
    title: 'TECH ZONE - ĐIỆN TỬ CÔNG NGHỆ 2026',
    subtitle: 'Smartphone, Laptop, Phụ Kiện Giảm Sốc Đến 60%',
    tag: 'Công Nghệ Đỉnh Cao'
  },
  {
    name: 'Mỹ Phẩm & Sắc Đẹp',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&auto=format&fit=crop&q=80',
    title: 'THIÊN ĐƯỜNG MỸ PHẨM CHÍNH HÃNG',
    subtitle: '100% Auth Có Bill • Đổi Trả Miễn Phí 15 Ngày',
    tag: 'Chính Hãng 100%'
  },
  {
    name: 'Gia Dụng & Đời Sống',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&auto=format&fit=crop&q=80',
    title: 'NÂNG TẦM KHÔNG GIAN SỐNG',
    subtitle: 'Đồ Gia Dụng Tiện Ích • Giảm Giá Đến 40%',
    tag: 'Tổ Ấm Yêu Thương'
  }
];

export const SiteManagementView: React.FC<SiteManagementViewProps> = ({
  siteConfig,
  shopSettings,
  categories,
  onSaveSiteConfig,
  onUpdateShopSettings,
  onUpdateCategories,
  onPreviewBuyerMode
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('banners');
  const [formConfig, setFormConfig] = useState<SiteConfig>({ ...siteConfig });
  const [shopNameInput, setShopNameInput] = useState(shopSettings.shopName || 'VIETSHOP');
  const [shopTaglineInput, setShopTaglineInput] = useState(shopSettings.shopTagline || 'Siêu Thị Trực Tuyến Hàng Đầu');
  const [shopAvatarInput, setShopAvatarInput] = useState(shopSettings.shopAvatar || '');
  const [adminNameInput, setAdminNameInput] = useState(shopSettings.adminName || 'Nguyễn Quản Trị');
  const [adminAvatarInput, setAdminAvatarInput] = useState(shopSettings.adminAvatar || '');
  const [adminRoleTitleInput, setAdminRoleTitleInput] = useState(shopSettings.adminRoleTitle || 'Quản Trị Viên Sàn');
  
  // Category management local state
  const [catList, setCatList] = useState<Category[]>([...categories]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');

  const [notification, setNotification] = useState<string | null>(null);
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSaveAll = () => {
    onSaveSiteConfig(formConfig);
    onUpdateShopSettings({
      ...shopSettings,
      shopName: shopNameInput,
      shopTagline: shopTaglineInput,
      shopAvatar: shopAvatarInput || shopSettings.shopAvatar,
      adminName: adminNameInput.trim() || 'Nguyễn Quản Trị',
      adminAvatar: adminAvatarInput.trim() || shopSettings.adminAvatar,
      adminRoleTitle: adminRoleTitleInput.trim() || 'Quản Trị Viên Sàn'
    });
    onUpdateCategories(catList);
    showToast('✅ Đã lưu toàn bộ thay đổi và cập nhật trang thành công!');
  };

  // Banner slide operations
  const handleUpdateSlide = (index: number, field: string, val: string) => {
    const updated = [...formConfig.heroSlides];
    updated[index] = { ...updated[index], [field]: val };
    setFormConfig(prev => ({ ...prev, heroSlides: updated }));
  };

  const handleAddSlide = () => {
    const newSlide = {
      id: Date.now(),
      title: 'BANNER KHUYẾN MÃI MỚI',
      subtitle: 'Ưu đãi cực sốc • Miễn phí vận chuyển toàn quốc',
      tag: 'Khuyến Mãi Hot',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80'
    };
    setFormConfig(prev => ({ ...prev, heroSlides: [...prev.heroSlides, newSlide] }));
    showToast('Đã thêm 1 banner trượt mới!');
  };

  const handleDeleteSlide = (index: number) => {
    if (formConfig.heroSlides.length <= 1) {
      alert('Trang cần ít nhất 1 banner trình chiếu!');
      return;
    }
    const updated = formConfig.heroSlides.filter((_, i) => i !== index);
    setFormConfig(prev => ({ ...prev, heroSlides: updated }));
    showToast('Đã xóa banner');
  };

  const handleApplyPresetToSlide = (slideIndex: number, preset: typeof SAMPLE_BANNER_PRESETS[0]) => {
    const updated = [...formConfig.heroSlides];
    updated[slideIndex] = {
      ...updated[slideIndex],
      title: preset.title,
      subtitle: preset.subtitle,
      tag: preset.tag,
      image: preset.image
    };
    setFormConfig(prev => ({ ...prev, heroSlides: updated }));
    showToast(`Đã áp dụng mẫu: ${preset.name}`);
  };

  // Mini banner operations
  const handleUpdateMiniBanner = (index: number, field: string, val: string) => {
    const updated = [...formConfig.miniBanners];
    updated[index] = { ...updated[index], [field]: val };
    setFormConfig(prev => ({ ...prev, miniBanners: updated }));
  };

  // Category operations
  const handleAddCategory = () => {
    if (!newCatName.trim()) {
      alert('Vui lòng nhập tên danh mục!');
      return;
    }
    const newCat: Category = {
      id: 'cat_' + Date.now().toString().slice(-6),
      name: newCatName.trim(),
      icon: 'ShoppingBag',
      image: newCatImage.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80',
      itemCount: 0
    };
    setCatList(prev => [...prev, newCat]);
    setNewCatName('');
    setNewCatImage('');
    showToast(`Đã thêm danh mục mới: ${newCat.name}`);
  };

  const handleDeleteCategory = (catId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này khỏi trang chủ?')) {
      setCatList(prev => prev.filter(c => c.id !== catId));
      showToast('Đã xóa danh mục');
    }
  };

  const handleSaveEditCategory = (catId: string) => {
    if (!editingCatName.trim()) return;
    setCatList(prev => prev.map(c => c.id === catId ? { ...c, name: editingCatName.trim() } : c));
    setEditingCatId(null);
    showToast('Đã cập nhật tên danh mục');
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/80 space-y-6">
      
      {/* Toast Notification */}
      {notification && (
        <div className="p-4 bg-emerald-600 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between shadow-xl animate-in fade-in slide-in-from-top-2 sticky top-4 z-50">
          <div className="flex items-center gap-2.5">
            <Check className="w-5 h-5 bg-white/20 p-1 rounded-full shrink-0" />
            <span>{notification}</span>
          </div>
          <button 
            onClick={onPreviewBuyerMode}
            className="px-3 py-1 bg-white text-emerald-800 rounded-lg text-xs font-black hover:bg-emerald-50 cursor-pointer transition-colors"
          >
            Xem Thử Ngay →
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl shadow-md">
              <LayoutTemplate className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-slate-900">
              Quản Lý & Sửa Chữa Toàn Trang VIETSHOP
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Tùy chỉnh toàn bộ nội dung, hình ảnh banner, thông tin thương hiệu, danh mục và chữ hiển thị trên toàn bộ website. Thay đổi áp dụng ngay lập tức cho người mua.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={onPreviewBuyerMode}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-slate-600" />
            <span>Xem Thử Trang Mua Sắm</span>
          </button>

          <button
            onClick={handleSaveAll}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-[#ee4d2d] to-orange-500 hover:from-[#d73211] text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-transform active:scale-95 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>LƯU TẤT CẢ THAY ĐỔI</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 border-b border-slate-100">
        {[
          { id: 'banners', label: '🖼️ Banners & Slide Trình Chiếu', desc: 'Slider chính & Mini banner' },
          { id: 'branding', label: '🏷️ Tên Sàn, Logo & Thông Báo', desc: 'Top bar, slogan, tìm kiếm' },
          { id: 'categories', label: '📦 Quản Lý Danh Mục Ngành Hàng', desc: 'Thêm, sửa, xóa danh mục' },
          { id: 'sections', label: '⚡ Cấu Hình Khối Trang Chủ & Tiện Ích', desc: 'Flash sale, gợi ý, 8 dịch vụ' },
          { id: 'trust', label: '🛡️ 4 Cam Kết Uy Tín', desc: 'Chính hãng, đổi trả, freeship' },
          { id: 'footer', label: '📞 Chân Trang & Hotline CSKH', desc: 'Giới thiệu, email, địa chỉ' },
          { id: 'security', label: '🔒 Mật Khẩu Quản Trị', desc: 'Đổi mật khẩu truy cập' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as TabKey)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === t.id
                ? 'bg-orange-50 text-[#ee4d2d] border border-orange-200 shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 border border-transparent'
            }`}
          >
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: BANNERS & SLIDES */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                1. Hệ Thống Banner Slider Lớn (Hero Banner Carousel)
              </h3>
              <p className="text-xs text-slate-500">Các banner chuyển động tự động xuất hiện ở vị trí trang trọng nhất đầu trang.</p>
            </div>
            <button
              onClick={handleAddSlide}
              className="px-3 py-1.5 bg-[#ee4d2d] hover:bg-[#d73211] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Banner Slide</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {formConfig.heroSlides.map((slide, idx) => (
              <div key={slide.id || idx} className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-[#ee4d2d] flex items-center justify-center font-black text-xs">
                      {idx + 1}
                    </span>
                    <span className="font-extrabold text-sm text-slate-800">
                      Banner Slide #{idx + 1}: {slide.title}
                    </span>
                  </div>
                  {formConfig.heroSlides.length > 1 && (
                    <button
                      onClick={() => handleDeleteSlide(idx)}
                      className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer p-1 rounded-lg hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa Slide Này</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Image Preview */}
                  <div className="lg:col-span-5 space-y-2">
                    <div className="relative aspect-[21/9] rounded-xl overflow-hidden border border-slate-300 bg-slate-200 group">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                        Xem Trước Hiển Thị
                      </div>
                      <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md font-bold">
                        {slide.tag || 'Khuyến Mãi'}
                      </span>
                    </div>

                    {/* Presets dropdown */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">Mẫu banner có sẵn gợi ý:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {SAMPLE_BANNER_PRESETS.map((p, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => handleApplyPresetToSlide(idx, p)}
                            className="px-2 py-1 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-lg text-[10px] font-bold text-slate-700 hover:text-[#ee4d2d] cursor-pointer transition-colors"
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="lg:col-span-7 space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Link Ảnh Banner (URL):</label>
                      <input
                        type="text"
                        value={slide.image}
                        onChange={(e) => handleUpdateSlide(idx, 'image', e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#ee4d2d]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Tiêu Đề Lớn (Title):</label>
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => handleUpdateSlide(idx, 'title', e.target.value)}
                          placeholder="SIÊU ĐẠI HỘI SALE..."
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold focus:outline-none focus:border-[#ee4d2d]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Huy Hiệu Tag Góc:</label>
                        <input
                          type="text"
                          value={slide.tag || ''}
                          onChange={(e) => handleUpdateSlide(idx, 'tag', e.target.value)}
                          placeholder="Đại Tiệc Mua Sắm"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#ee4d2d]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Phụ Đề Khuyến Mãi (Subtitle):</label>
                      <input
                        type="text"
                        value={slide.subtitle}
                        onChange={(e) => handleUpdateSlide(idx, 'subtitle', e.target.value)}
                        placeholder="Voucher 500K • Miễn Phí Vận Chuyển 0Đ..."
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-600 focus:outline-none focus:border-[#ee4d2d]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 2 Mini Banners */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-3">
              2. Hai Banner Phụ Cố Định (Mini Banners Bên Phải Slider)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formConfig.miniBanners.map((mb, mIdx) => (
                <div key={mb.id || mIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={mb.image}
                      alt={mb.title}
                      className="w-24 h-16 rounded-xl object-cover border border-slate-300 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-[#ee4d2d] bg-orange-100 px-2 py-0.5 rounded-md">
                        Banner Phụ #{mIdx + 1}
                      </span>
                      <h4 className="font-bold text-xs text-slate-800 truncate mt-1">{mb.title}</h4>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Tiêu đề banner phụ:</label>
                      <input
                        type="text"
                        value={mb.title}
                        onChange={(e) => handleUpdateMiniBanner(mIdx, 'title', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#ee4d2d]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Thẻ tag ưu đãi:</label>
                      <input
                        type="text"
                        value={mb.tag}
                        onChange={(e) => handleUpdateMiniBanner(mIdx, 'tag', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#ee4d2d]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Link ảnh (URL):</label>
                      <input
                        type="text"
                        value={mb.image}
                        onChange={(e) => handleUpdateMiniBanner(mIdx, 'image', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#ee4d2d]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BRANDING & HEADERS */}
      {activeTab === 'branding' && (
        <div className="space-y-5">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Type className="w-4 h-4 text-[#ee4d2d]" />
              <span>Tên Sàn Thương Mại & Nhận Diện Thương Hiệu</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-xs text-slate-700 block mb-1">
                  Tên Sàn / Thương Hiệu (Hiển thị Logo & Tiêu đề):
                </label>
                <input
                  type="text"
                  value={shopNameInput}
                  onChange={(e) => setShopNameInput(e.target.value)}
                  placeholder="VIETSHOP"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl font-black text-slate-900 focus:outline-none focus:border-[#ee4d2d]"
                />
              </div>

              <div>
                <label className="font-bold text-xs text-slate-700 block mb-1">
                  Khẩu Hiệu / Slogan Thương Hiệu:
                </label>
                <input
                  type="text"
                  value={shopTaglineInput}
                  onChange={(e) => setShopTaglineInput(e.target.value)}
                  placeholder="Siêu Thị Trực Tuyến Hàng Đầu Việt Nam"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-700 focus:outline-none focus:border-[#ee4d2d]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-xs text-slate-700 block mb-1">
                Link Ảnh Logo / Avatar Gian Hàng:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shopAvatarInput}
                  onChange={(e) => setShopAvatarInput(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#ee4d2d]"
                />
                {shopAvatarInput && (
                  <img
                    src={shopAvatarInput}
                    alt="Logo"
                    className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sửa Thông Tin & Ảnh Quản Trị Viên */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-purple-50/40 to-slate-50 border-2 border-indigo-200 space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
              <h3 className="font-black text-indigo-950 text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-600" />
                <span>Hồ Sơ & Thông Tin Quản Trị Viên Sàn (Admin Profile)</span>
              </h3>
              <span className="text-[10px] bg-indigo-200 text-indigo-900 font-black px-2 py-0.5 rounded-md">
                Admin Settings
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-xs text-slate-800 block mb-1">
                  Tên Quản Trị Viên (Họ và Tên):
                </label>
                <input
                  type="text"
                  value={adminNameInput}
                  onChange={(e) => setAdminNameInput(e.target.value)}
                  placeholder="VD: Nguyễn Quản Trị, Admin VIETSHOP..."
                  className="w-full px-3.5 py-2 text-xs bg-white border border-indigo-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="font-bold text-xs text-slate-800 block mb-1">
                  Chức Danh / Vai Trò:
                </label>
                <input
                  type="text"
                  value={adminRoleTitleInput}
                  onChange={(e) => setAdminRoleTitleInput(e.target.value)}
                  placeholder="VD: Quản Trị Viên Sàn, Admin Trưởng..."
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-xs text-slate-800 block mb-1">
                  Ảnh Đại Diện Quản Trị Viên (Avatar):
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="shrink-0">
                    <img
                      src={adminAvatarInput || shopAvatarInput}
                      alt="Admin Preview"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-400 shadow-sm bg-indigo-900"
                    />
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={adminAvatarInput}
                        onChange={(e) => setAdminAvatarInput(e.target.value)}
                        placeholder="Dán link ảnh đại diện quản trị (https://...)"
                        className="flex-1 px-3.5 py-2 text-xs bg-white border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                      <label className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Tải Ảnh Từ Máy</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  setAdminAvatarInput(event.target?.result as string);
                                  showToast('Đã tải ảnh đại diện quản trị!');
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4 text-[#ee4d2d]" />
              <span>Thanh Thông Báo & Ô Tìm Kiếm</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-xs text-slate-700 block mb-1">
                  Dòng Chữ Chạy Thông Báo Trên Cùng (Top Announcement Strip):
                </label>
                <input
                  type="text"
                  value={formConfig.topAnnouncement}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, topAnnouncement: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#ee4d2d]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-xs text-slate-700 block mb-1">
                    Chữ Gợi Ý Trong Ô Tìm Kiếm (Search Placeholder):
                  </label>
                  <input
                    type="text"
                    value={formConfig.searchPlaceholder}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, searchPlaceholder: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#ee4d2d]"
                  />
                </div>

                <div>
                  <label className="font-bold text-xs text-slate-700 block mb-1">
                    Nhãn Nút Giỏ Hàng (Cart Button Label):
                  </label>
                  <input
                    type="text"
                    value={formConfig.cartButtonLabel || 'Giỏ Hàng'}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, cartButtonLabel: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#ee4d2d]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-xs text-slate-700 block mb-1">
                  Từ Khóa Hot Gợi Ý Dưới Ô Tìm Kiếm (Cách nhau bởi dấu phẩy):
                </label>
                <input
                  type="text"
                  value={formConfig.popularKeywords || 'Áo Thun, Váy Nữ, Giày Sneaker, Son Môi, Tai Nghe Bluetooth'}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, popularKeywords: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#ee4d2d]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                Quản Lý Danh Mục Ngành Hàng Trang Chủ ({catList.length} ngành hàng)
              </h3>
              <p className="text-xs text-slate-500">Người mua sẽ duyệt sản phẩm theo các danh mục trực quan này.</p>
            </div>
          </div>

          {/* Add New Category Box */}
          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 space-y-3">
            <h4 className="font-black text-xs text-orange-950 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#ee4d2d]" />
              <span>Thêm Ngành Hàng Mới Lên Trang</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Tên ngành hàng (VD: Đồ Chơi & Mẹ Bé)..."
                  className="w-full px-3 py-2 text-xs bg-white border border-orange-300 rounded-xl focus:outline-none focus:border-[#ee4d2d]"
                />
              </div>
              <div className="sm:col-span-5">
                <input
                  type="text"
                  value={newCatImage}
                  onChange={(e) => setNewCatImage(e.target.value)}
                  placeholder="Link ảnh minh họa (URL)..."
                  className="w-full px-3 py-2 text-xs bg-white border border-orange-300 rounded-xl focus:outline-none focus:border-[#ee4d2d]"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  onClick={handleAddCategory}
                  className="w-full py-2 bg-[#ee4d2d] hover:bg-[#d73211] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm Ngay</span>
                </button>
              </div>
            </div>
          </div>

          {/* Current Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {catList.map(cat => (
              <div
                key={cat.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
                  />
                  <div className="min-w-0 flex-1">
                    {editingCatId === cat.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={editingCatName}
                          onChange={(e) => setEditingCatName(e.target.value)}
                          className="px-2 py-1 text-xs bg-white border border-orange-400 rounded-lg w-full focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEditCategory(cat.id)}
                          className="p-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-extrabold text-xs text-slate-800 truncate">{cat.name}</h4>
                        <span className="text-[10px] text-slate-400 block font-medium">Mã: {cat.id}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {editingCatId !== cat.id && (
                    <button
                      onClick={() => {
                        setEditingCatId(cat.id);
                        setEditingCatName(cat.name);
                      }}
                      className="p-1.5 text-slate-500 hover:text-[#ee4d2d] rounded-lg hover:bg-white cursor-pointer"
                      title="Sửa tên"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white cursor-pointer"
                    title="Xóa danh mục"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: HOMEPAGE SECTIONS & SERVICES */}
      {activeTab === 'sections' && (
        <div className="space-y-5">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Grid className="w-4 h-4 text-[#ee4d2d]" />
              <span>Tiêu Đề Các Khối Nội Dung Trên Trang Chủ</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-xs text-slate-700 block mb-1">
                  Tiêu Đề Khối Danh Mục:
                </label>
                <input
                  type="text"
                  value={formConfig.categoriesSectionTitle || 'DANH MỤC SẢN PHẨM'}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, categoriesSectionTitle: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#ee4d2d]"
                />
              </div>

              <div>
                <label className="font-bold text-xs text-slate-700 block mb-1">
                  Tiêu Đề Khối Flash Sale:
                </label>
                <input
                  type="text"
                  value={formConfig.flashSaleTitle || 'FLASH SALE CHỚP NHOÁNG'}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, flashSaleTitle: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#ee4d2d]"
                />
              </div>

              <div>
                <label className="font-bold text-xs text-slate-700 block mb-1">
                  Tiêu Đề Khối Gợi Ý Hôm Nay:
                </label>
                <input
                  type="text"
                  value={formConfig.discoveryTitle || 'GỢI Ý HÔM NAY - DÀNH RIÊNG CHO BẠN'}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, discoveryTitle: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#ee4d2d]"
                />
              </div>

              <div>
                <label className="font-bold text-xs text-slate-700 block mb-1">
                  Chữ Nút Tải Thêm Sản Phẩm:
                </label>
                <input
                  type="text"
                  value={formConfig.loadMoreButtonText || 'Xem Thêm Sản Phẩm Gợi Ý'}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, loadMoreButtonText: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#ee4d2d]"
                />
              </div>
            </div>
          </div>

          {/* Fast Services */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ee4d2d]" />
              <span>Tên 8 Dịch Vụ Nhanh (Icons tròn dưới banner)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {formConfig.fastServices.map((fs, fIdx) => (
                <div key={fs.id} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 block">Dịch vụ #{fIdx + 1}</span>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block">Tên dịch vụ:</label>
                    <input
                      type="text"
                      value={fs.label}
                      onChange={(e) => {
                        const updated = [...formConfig.fastServices];
                        updated[fIdx] = { ...updated[fIdx], label: e.target.value };
                        setFormConfig(prev => ({ ...prev, fastServices: updated }));
                      }}
                      className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#ee4d2d] font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block">Mô tả ngắn:</label>
                    <input
                      type="text"
                      value={fs.desc || ''}
                      onChange={(e) => {
                        const updated = [...formConfig.fastServices];
                        updated[fIdx] = { ...updated[fIdx], desc: e.target.value };
                        setFormConfig(prev => ({ ...prev, fastServices: updated }));
                      }}
                      className="w-full px-2 py-1 text-[11px] bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#ee4d2d]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TRUST BADGES */}
      {activeTab === 'trust' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#ee4d2d]" />
              <span>4 Khối Cam Kết Uy Tín Khách Hàng (Trust Badges)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Badge 1 */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-black text-[#ee4d2d]">Cam kết 1: Hàng Chính Hãng</span>
                <input
                  type="text"
                  value={formConfig.trustBadge1Title || '100% Hàng Chính Hãng'}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, trustBadge1Title: e.target.value }))}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  placeholder="Tiêu đề"
                />
                <input
                  type="text"
                  value={formConfig.trustBadge1Desc || 'Cam kết hoàn tiền 100% nếu phát hiện hàng giả'}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, trustBadge1Desc: e.target.value }))}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                  placeholder="Mô tả phụ"
                />
              </div>

              {/* Badge 2 */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-black text-[#ee4d2d]">Cam kết 2: Đổi Trả Miễn Phí</span>
                <input
                  type="text"
                  value={formConfig.trustBadge2Title || 'Đổi Trả 15 Ngày'}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, trustBadge2Title: e.target.value }))}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  placeholder="Tiêu đề"
                />
                <input
                  type="text"
                  value={formConfig.trustBadge2Desc || 'Miễn phí trả hàng trong vòng 15 ngày'}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, trustBadge2Desc: e.target.value }))}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                  placeholder="Mô tả phụ"
                />
              </div>

              {/* Badge 3 */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-black text-[#ee4d2d]">Cam kết 3: Vận Chuyển Toàn Quốc</span>
                <input
                  type="text"
                  value={formConfig.trustBadge3Title || 'Miễn Phí Vận Chuyển'}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, trustBadge3Title: e.target.value }))}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  placeholder="Tiêu đề"
                />
                <input
                  type="text"
                  value={formConfig.trustBadge3Desc || 'Giao hàng siêu tốc và hỗ trợ phí ship 0Đ'}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, trustBadge3Desc: e.target.value }))}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                  placeholder="Mô tả phụ"
                />
              </div>

              {/* Badge 4 */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-black text-[#ee4d2d]">Cam kết 4: Chăm Sóc Khách Hàng</span>
                <input
                  type="text"
                  value={formConfig.trustBadge4Title || 'Hỗ Trợ 24/7'}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, trustBadge4Title: e.target.value }))}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  placeholder="Tiêu đề"
                />
                <input
                  type="text"
                  value={formConfig.trustBadge4Desc || 'Đội ngũ tư vấn tận tình chu đáo qua hotline và chat AI'}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, trustBadge4Desc: e.target.value }))}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                  placeholder="Mô tả phụ"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: FOOTER & CONTACT */}
      {activeTab === 'footer' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#ee4d2d]" />
              <span>Thông Tin Liên Hệ, Chân Trang & Bản Quyền</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-xs text-slate-700 block mb-1">
                  Giới Thiệu Ngắn Chân Trang (Footer About):
                </label>
                <textarea
                  rows={2}
                  value={formConfig.footerAbout}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, footerAbout: e.target.value }))}
                  className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#ee4d2d]"
                  placeholder="VIETSHOP - Nền tảng thương mại điện tử hàng đầu..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-xs text-slate-700 block mb-1">Hotline CSKH:</label>
                  <input
                    type="text"
                    value={formConfig.footerHotline}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, footerHotline: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#ee4d2d]"
                    placeholder="1900 1221"
                  />
                </div>

                <div>
                  <label className="font-bold text-xs text-slate-700 block mb-1">Email Hỗ Trợ:</label>
                  <input
                    type="text"
                    value={formConfig.footerEmail}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, footerEmail: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#ee4d2d]"
                    placeholder="support@vietshop.vn"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-xs text-slate-700 block mb-1">
                  Địa Chỉ Trụ Sở / Kho Hàng Hiển Thị Chân Trang:
                </label>
                <input
                  type="text"
                  value={formConfig.footerAddress || ''}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, footerAddress: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#ee4d2d]"
                  placeholder="Trụ sở chính: Tòa nhà Landmark, 720A Điện Biên Phủ, TP. Hồ Chí Minh & Hà Nội"
                />
              </div>

              <div>
                <label className="font-bold text-xs text-slate-700 block mb-1">
                  Dòng Chữ Bản Quyền Dưới Cùng (Footer Copyright):
                </label>
                <input
                  type="text"
                  value={formConfig.footerCopyright || ''}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, footerCopyright: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#ee4d2d]"
                  placeholder="© 2026 VIETSHOP - Siêu Thị Trực Tuyến Hàng Đầu. Tất cả các quyền được bảo lưu."
                />
              </div>

              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <label className="font-bold text-xs text-slate-800 block">
                      Hiển Thị Chữ "Kênh Người Bán" Ở Chân Trang (Footer):
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Chỉ quản trị mới có thể thay đổi hoặc xoá chữ Kênh Người Bán ở bên dưới trang.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormConfig(prev => ({ ...prev, showFooterSellerLink: prev.showFooterSellerLink === false ? true : false }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                      formConfig.showFooterSellerLink !== false
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {formConfig.showFooterSellerLink !== false ? '✓ Đang Hiển Thị' : '✕ Đã Xoá / Ẩn'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: SECURITY & PASSWORD */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-600" />
              <span>Bảo Vệ & Mật Khẩu Truy Cập Quản Trị VIETSHOP</span>
            </h3>

            <div className="max-w-md space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-xs text-slate-700 block">
                    Mật Khẩu Đăng Nhập Quản Trị Hệ Thống:
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="text-xs text-slate-500 hover:text-purple-600 flex items-center gap-1 cursor-pointer transition font-medium"
                  >
                    {showAdminPassword ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Ẩn mật khẩu</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem mật khẩu</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    value={formConfig.adminPassword || formConfig.sellerPassword || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormConfig(prev => ({ ...prev, adminPassword: val, sellerPassword: val }));
                    }}
                    placeholder="Nhập mật khẩu quản trị kín..."
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl font-mono font-bold text-purple-700 focus:outline-none focus:border-purple-600 tracking-wider"
                  />
                </div>
                <div className="p-3 mt-2.5 bg-purple-50/70 border border-purple-200/80 rounded-xl text-[11px] text-purple-900 space-y-1">
                  <span className="font-bold flex items-center gap-1.5 text-purple-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    Chỉ người quản trị mới được biết mật khẩu này
                  </span>
                  <p className="text-slate-600">
                    Mật khẩu này được bảo mật an toàn tuyệt đối và không bao giờ hiển thị trên giao diện người mua hoặc trang chủ. Sau khi đổi, nhấn "Lưu Tất Cả Thay Đổi" bên dưới để áp dụng.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Action Bar */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-orange-50 to-amber-50 p-4 sm:p-5 rounded-2xl border border-orange-200">
        <div className="text-xs text-orange-950 font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-600 shrink-0" />
          <span>Mọi nội dung sau khi nhấn <strong>"Lưu Tất Cả"</strong> sẽ lập tức hiển thị trên trang người mua.</span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={onPreviewBuyerMode}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Eye className="w-4 h-4 text-slate-600" />
            <span>Xem Thử Trang Mua Sắm</span>
          </button>

          <button
            onClick={handleSaveAll}
            className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-[#ee4d2d] to-orange-500 hover:from-[#d73211] text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>LƯU TẤT CẢ THAY ĐỔI</span>
          </button>
        </div>
      </div>

    </div>
  );
};
