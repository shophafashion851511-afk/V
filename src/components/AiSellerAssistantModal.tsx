import React, { useState } from 'react';
import { 
  Bot, Sparkles, Plus, Wand2, Check, ArrowRight, 
  X, RefreshCw, ShoppingBag, Tag, Image, FileText, 
  Sliders, Layers, Zap, CheckCircle2 
} from 'lucide-react';
import { Product, Category, Voucher } from '../types';
import { formatVND } from '../utils/formatters';

interface AiSellerAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  products: Product[];
  onAddProduct: (newProduct: Product) => void;
  onUpdateProduct: (updatedProduct: Product) => void;
  onAddVoucher?: (voucher: Voucher) => void;
}

export const AiSellerAssistantModal: React.FC<AiSellerAssistantModalProps> = ({
  isOpen,
  onClose,
  categories,
  products,
  onAddProduct,
  onUpdateProduct,
  onAddVoucher
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'optimize' | 'voucher'>('create');
  
  // Create state
  const [createPrompt, setCreatePrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || 'fashion_men');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProduct, setGeneratedProduct] = useState<Product | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Optimize state
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedProduct, setOptimizedProduct] = useState<Product | null>(null);

  // Voucher generator state
  const [voucherPrompt, setVoucherPrompt] = useState('Chiến dịch kích cầu siêu sale cuối tuần giảm 20%');
  const [isGeneratingVoucher, setIsGeneratingVoucher] = useState(false);
  const [generatedVoucher, setGeneratedVoucher] = useState<Voucher | null>(null);

  if (!isOpen) return null;

  const handleGenerateProduct = async () => {
    if (!createPrompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setGeneratedProduct(null);

    try {
      const response = await fetch('/api/ai/seller-generate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: createPrompt,
          categoryId: selectedCategory,
          categories
        })
      });

      if (!response.ok) throw new Error('Lỗi máy chủ');
      const data = await response.json();
      if (data.product) {
        setGeneratedProduct(data.product);
      }
    } catch (err) {
      console.error(err);
      alert('Không thể tạo sản phẩm bằng AI lúc này. Vui lòng thử lại!');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishGeneratedProduct = () => {
    if (!generatedProduct) return;
    onAddProduct(generatedProduct);
    setSuccessToast(`Đã thêm sản phẩm "${generatedProduct.name}" vào cửa hàng thành công!`);
    setGeneratedProduct(null);
    setCreatePrompt('');
    setTimeout(() => {
      setSuccessToast(null);
      onClose();
    }, 1800);
  };

  const handleOptimizeProduct = async () => {
    const target = products.find(p => p.id === selectedProductId);
    if (!target || isOptimizing) return;
    setIsOptimizing(true);
    setOptimizedProduct(null);

    try {
      const response = await fetch('/api/ai/seller-optimize-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: target })
      });

      if (!response.ok) throw new Error('Lỗi máy chủ');
      const data = await response.json();
      if (data.product) {
        setOptimizedProduct(data.product);
      }
    } catch (err) {
      console.error(err);
      alert('Không thể tối ưu sản phẩm lúc này. Vui lòng thử lại!');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleApplyOptimization = () => {
    if (!optimizedProduct) return;
    onUpdateProduct(optimizedProduct);
    setSuccessToast(`Đã cập nhật nội dung chuẩn SEO cho sản phẩm thành công!`);
    setTimeout(() => {
      setSuccessToast(null);
      onClose();
    }, 1500);
  };

  const handleGenerateVoucher = () => {
    setIsGeneratingVoucher(true);
    setTimeout(() => {
      const randomCode = 'AI' + Math.floor(1000 + Math.random() * 9000);
      const newVc: Voucher = {
        id: 'vc-ai-' + Date.now(),
        code: randomCode,
        title: `Voucher AI Siêu Ưu Đãi Giảm 35K`,
        description: `Giảm ngay 35.000₫ cho đơn hàng từ 199.000₫ toàn sàn VIETSHOP`,
        type: 'discount_amount',
        value: 35000,
        minOrder: 199000,
        maxDiscount: 35000,
        expiry: 'Còn 7 ngày',
        usedCount: 0,
        totalCount: 1000,
        isSaved: true
      };
      setGeneratedVoucher(newVc);
      setIsGeneratingVoucher(false);
    }, 800);
  };

  const handlePublishVoucher = () => {
    if (!generatedVoucher || !onAddVoucher) return;
    onAddVoucher(generatedVoucher);
    setSuccessToast(`Đã tạo mã giảm giá ${generatedVoucher.code} thành công!`);
    setTimeout(() => {
      setSuccessToast(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-900 flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight">AI Trợ Lý Bán Hàng & Tự Động Hóa Shop</h3>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  AI Copilot
                </span>
              </div>
              <p className="text-xs text-slate-300">Tự động tạo sản phẩm, viết bài chuẩn SEO và tạo mã giảm giá</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2.5 rounded-t-2xl font-bold text-xs flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'create'
                ? 'bg-white text-[#ee4d2d] border-[#ee4d2d] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>1-Click Tạo Sản Phẩm Mới Bằng AI</span>
          </button>

          <button
            onClick={() => setActiveTab('optimize')}
            className={`px-4 py-2.5 rounded-t-2xl font-bold text-xs flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'optimize'
                ? 'bg-white text-blue-600 border-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Tối Ưu Tiêu Đề & SEO Mô Tả Bằng AI</span>
          </button>

          <button
            onClick={() => setActiveTab('voucher')}
            className={`px-4 py-2.5 rounded-t-2xl font-bold text-xs flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'voucher'
                ? 'bg-white text-amber-600 border-amber-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Tạo Voucher & Chiến Dịch Bằng AI</span>
          </button>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white">
          
          {/* TAB 1: AUTO GENERATE PRODUCT */}
          {activeTab === 'create' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200/70 space-y-3">
                <div className="flex items-center gap-2 font-black text-slate-800 text-sm">
                  <Sparkles className="w-4 h-4 text-[#ee4d2d]" />
                  <span>Mô tả ngắn gọn sản phẩm bạn muốn đăng bán</span>
                </div>
                <p className="text-xs text-slate-600">
                  AI sẽ tự động sinh tên sản phẩm chuẩn SEO TMĐT, giá bán hợp lý, tỷ lệ giảm giá, phân loại (màu, size), thông số kỹ thuật và mô tả bán hàng chuyên nghiệp.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={createPrompt}
                      onChange={(e) => setCreatePrompt(e.target.value)}
                      placeholder="Ví dụ: Áo polo nam thể thao cao cấp chống nhăn thấm hút mồ hôi..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#ee4d2d] focus:ring-1 focus:ring-[#ee4d2d] text-xs outline-none bg-white font-medium"
                    />
                  </div>
                  <div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-[#ee4d2d] text-xs outline-none bg-white font-medium cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Example prompt pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[11px] font-bold text-slate-500 py-1">Gợi ý mẫu:</span>
                  {[
                    'Áo khoác gió unisex chống nước 2 lớp',
                    'Tai nghe bluetooth chụp tai chống ồn 40h',
                    'Bình giữ nhiệt inox 316 hiển thị nhiệt độ',
                    'Giày sneaker thể thao nam êm ái thoáng khí',
                    'Son kem lì mịn môi lâu trôi không khô môi'
                  ].map((example, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCreatePrompt(example)}
                      className="px-2.5 py-1 bg-white hover:bg-orange-100/60 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      {example}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleGenerateProduct}
                    disabled={!createPrompt.trim() || isGenerating}
                    className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] hover:from-[#d73211] hover:to-[#e64a19] disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 cursor-pointer transition-all"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>AI Đang Soạn Dữ Liệu Sản Phẩm...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        <span>Tạo Toàn Bộ Thông Tin Sản Phẩm Bằng AI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Generated Product Preview Card */}
              {generatedProduct && (
                <div className="p-5 rounded-2xl border-2 border-emerald-400 bg-emerald-50/20 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                    <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Kết Quả AI Tạo Thành Công - Sẵn Sàng Đăng Bán</span>
                    </div>
                    <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                      Chuẩn VIETSHOP Chính Hãng
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    <div className="md:col-span-4 space-y-2">
                      <img
                        src={generatedProduct.image}
                        alt="Preview"
                        className="w-full aspect-square rounded-2xl object-cover border border-slate-200 shadow-sm"
                      />
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Giá bán:</span>
                          <span className="font-black text-[#ee4d2d]">{formatVND(generatedProduct.price)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Giá niêm yết:</span>
                          <span className="line-through text-slate-400">{formatVND(generatedProduct.originalPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Giảm giá:</span>
                          <span className="font-bold text-red-600">-{generatedProduct.discountPercent}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Tồn kho:</span>
                          <span className="font-bold text-slate-800">{generatedProduct.stock} cái</span>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-8 space-y-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                          {generatedProduct.categoryName}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-base mt-1">
                          {generatedProduct.name}
                        </h4>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-700">Phân loại hàng (Variations):</span>
                        <div className="flex flex-wrap gap-2">
                          {generatedProduct.variations?.map((grp, i) => (
                            <div key={i} className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1">
                              <strong>{grp.name}:</strong> {grp.options.map(o => o.label).join(', ')}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-700">Mô tả sản phẩm:</span>
                        <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700 max-h-36 overflow-y-auto whitespace-pre-line custom-scrollbar">
                          {generatedProduct.description}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {generatedProduct.tags?.map((t, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md">
                            #{t}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 flex gap-3">
                        <button
                          onClick={handlePublishGeneratedProduct}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                        >
                          <Check className="w-4 h-4" />
                          <span>Đăng Bán Ngay Vào Cửa Hàng (1-Click)</span>
                        </button>
                        <button
                          onClick={handleGenerateProduct}
                          className="px-4 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                        >
                          Tạo Lại Khác
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: OPTIMIZE EXISTING PRODUCT */}
          {activeTab === 'optimize' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
                <div className="flex items-center gap-2 font-black text-slate-800 text-sm">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Chọn sản phẩm trong kho để AI viết lại tiêu đề & mô tả chuẩn SEO</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="flex-1 px-3 py-2.5 rounded-xl border border-slate-300 text-xs outline-none bg-white font-medium cursor-pointer"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({formatVND(p.price)})</option>
                    ))}
                  </select>

                  <button
                    onClick={handleOptimizeProduct}
                    disabled={isOptimizing}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-600/20"
                  >
                    {isOptimizing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>AI Đang Tối Ưu SEO...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Tối Ưu Bài Viết Này</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {optimizedProduct && (
                <div className="p-5 rounded-2xl border-2 border-blue-400 bg-blue-50/20 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <h4 className="font-extrabold text-blue-900 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    Bản Tối Ưu Bằng AI Sẵn Sàng Áp Dụng:
                  </h4>

                  <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 text-xs">
                    <div>
                      <span className="font-bold text-slate-500">Tiêu đề tối ưu mới:</span>
                      <p className="font-extrabold text-slate-900 mt-0.5">{optimizedProduct.name}</p>
                    </div>

                    <div>
                      <span className="font-bold text-slate-500">Mô tả bán hàng chuẩn SEO:</span>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700 mt-1 whitespace-pre-line max-h-48 overflow-y-auto custom-scrollbar">
                        {optimizedProduct.description}
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-slate-500">Tags từ khóa:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {optimizedProduct.tags?.map((t, i) => (
                          <span key={i} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold text-[11px]">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      onClick={handleApplyOptimization}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Cập Nhật Ngay Vào Sản Phẩm</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AI VOUCHER GENERATOR */}
          {activeTab === 'voucher' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 font-black text-slate-800 text-sm">
                  <Tag className="w-4 h-4 text-amber-600" />
                  <span>Tự động tạo chiến dịch mã giảm giá kích cầu mua sắm</span>
                </div>
                <p className="text-xs text-slate-600">
                  AI sẽ tính toán mã voucher, mức giảm tối ưu để thu hút người mua mà vẫn bảo toàn lợi nhuận cho cửa hàng.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={voucherPrompt}
                    onChange={(e) => setVoucherPrompt(e.target.value)}
                    placeholder="Mục tiêu chiến dịch (VD: Flash sale tối nay, Khách hàng mới...)"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none bg-white font-medium"
                  />
                  <button
                    onClick={handleGenerateVoucher}
                    disabled={isGeneratingVoucher}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    {isGeneratingVoucher ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    <span>Tạo Voucher Bằng AI</span>
                  </button>
                </div>
              </div>

              {generatedVoucher && (
                <div className="p-5 rounded-2xl border-2 border-amber-400 bg-amber-50/30 space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="font-black text-xs text-[#ee4d2d] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                        {generatedVoucher.code}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">{generatedVoucher.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{generatedVoucher.description}</p>
                      <p className="text-[11px] text-slate-400 mt-1">Hạn dùng: {generatedVoucher.expiry} • Số lượng: {generatedVoucher.totalCount}</p>
                    </div>

                    <button
                      onClick={handlePublishVoucher}
                      className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Kích Hoạt Voucher Ngay</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
