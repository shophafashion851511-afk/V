import React, { useState } from 'react';
import { Product } from '../types';
import { formatVND } from '../utils/formatters';
import { 
  X, Star, ShoppingCart, Zap, ShieldCheck, Truck, RotateCcw, 
  Heart, Share2, Check, Plus, Minus, 
  Edit3, Play, Film, Image as ImageIcon, Sparkles,
  Award, Clock, MapPin, ChevronRight, CheckCircle2,
  Volume2, VolumeX, ExternalLink
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  allProducts?: Product[];
  onSelectProduct?: (product: Product) => void;
  onClose: () => void;
  onAddToCart: (product: Product, variations: Record<string, string>, quantity: number) => void;
  onBuyNow: (product: Product, variations: Record<string, string>, quantity: number) => void;
  onEditProduct?: (product: Product) => void;
  isSellerMode?: boolean;
}

const isYouTubeUrl = (url?: string) => {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
};

const getYouTubeEmbedUrl = (url: string) => {
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&playsinline=1&rel=0`;
  }
  if (url.includes('youtube.com/watch')) {
    const match = url.match(/[?&]v=([^&]+)/);
    const id = match ? match[1] : '';
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&playsinline=1&rel=0`;
  }
  if (url.includes('youtube.com/shorts/')) {
    const id = url.split('youtube.com/shorts/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&playsinline=1&rel=0`;
  }
  return url;
};

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  allProducts = [],
  onSelectProduct,
  onClose,
  onAddToCart,
  onBuyNow,
  onEditProduct,
  isSellerMode = false
}) => {
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [activeMediaType, setActiveMediaType] = useState<'image' | 'video'>(
    product.videoUrl ? 'image' : 'image'
  );
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  // Selected variations
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (product.variations && product.variations.length > 0) {
      product.variations.forEach(v => {
        if (v.options.length > 0) {
          initial[v.name] = v.options[0].label;
        }
      });
    }
    return initial;
  });

  // Extract all distinct images (up to 4)
  const allImages = [product.image, ...(product.gallery || [])].filter(
    (img, idx, arr) => img && arr.indexOf(img) === idx
  );

  const handleAddToCart = () => {
    onAddToCart(product, selectedVariations, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleBuyNow = () => {
    onBuyNow(product, selectedVariations, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Sticky Header with Close Button */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {product.isMall && (
              <span className="bg-[#ee4d2d] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                Chính Hãng 100%
              </span>
            )}
            <span className="text-xs font-semibold text-slate-500 truncate max-w-md hidden sm:inline">
              {product.categoryName} &gt; {product.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isSellerMode && (
              <button
                onClick={() => onEditProduct && onEditProduct(product)}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Chỉnh Sửa (4 Ảnh, Video, Size/Màu)</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
          
          {/* Main Top Section: Image/Video Gallery + Purchase Information */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Left: Media Player & Gallery (5 cols) */}
            <div className="md:col-span-5 space-y-3">
              
              {/* Media Mode Switcher (If video is present) */}
              {product.videoUrl && (
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setActiveMediaType('image')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      activeMediaType === 'image'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Hình Ảnh ({allImages.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMediaType('video')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      activeMediaType === 'video'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-purple-600 hover:text-purple-700 bg-purple-50'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Xem Video</span>
                  </button>
                </div>
              )}

              {/* Main Media Display */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner flex items-center justify-center">
                {activeMediaType === 'video' && product.videoUrl ? (
                  isYouTubeUrl(product.videoUrl) ? (
                    <iframe
                      src={getYouTubeEmbedUrl(product.videoUrl)}
                      title={product.name}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center bg-black">
                      <video
                        key={product.videoUrl}
                        src={product.videoUrl}
                        controls
                        autoPlay
                        muted={isMuted}
                        playsInline
                        preload="auto"
                        onError={() => setVideoError(true)}
                        className="w-full h-full object-contain bg-black"
                      >
                        Trình duyệt của bạn không hỗ trợ phát video này.
                      </video>

                      {/* Sound Control Overlay Button */}
                      <button
                        type="button"
                        onClick={() => setIsMuted(!isMuted)}
                        className="absolute bottom-3 right-3 z-20 bg-black/75 hover:bg-black/90 text-white text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-xs cursor-pointer shadow-md transition"
                        title={isMuted ? 'Bật âm thanh video' : 'Tắt âm thanh'}
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5 text-amber-300" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                        <span className="font-semibold text-[11px]">{isMuted ? 'Bật tiếng' : 'Tắt tiếng'}</span>
                      </button>

                      {/* Fallback if video error */}
                      {videoError && (
                        <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-4 text-center text-white space-y-2 z-10">
                          <Film className="w-8 h-8 text-amber-400" />
                          <p className="text-xs font-semibold">Video đang được xử lý hoặc định dạng chưa hỗ trợ trực tiếp</p>
                          <a
                            href={product.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-orange-300 hover:underline flex items-center gap-1 font-bold"
                          >
                            <span>Mở video trong tab mới</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <img
                    src={selectedImage || product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                )}

                {/* Discount Badge */}
                {product.discountPercent > 0 && activeMediaType === 'image' && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-red-600 font-black text-xs px-2.5 py-1 rounded-xl shadow-md">
                    GIẢM {product.discountPercent}%
                  </div>
                )}
              </div>

              {/* Media Thumbnails Strip */}
              <div className="flex gap-2 overflow-x-auto pb-1 items-center">
                
                {/* Video Thumbnail Button (If available) */}
                {product.videoUrl && (
                  <button
                    type="button"
                    onClick={() => setActiveMediaType('video')}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer bg-slate-900 flex flex-col items-center justify-center text-white ${
                      activeMediaType === 'video'
                        ? 'border-purple-600 ring-2 ring-purple-400 scale-95 shadow-md'
                        : 'border-slate-300 opacity-85 hover:opacity-100'
                    }`}
                  >
                    <Play className="w-5 h-5 fill-purple-400 text-purple-400" />
                    <span className="text-[9px] font-black tracking-wider uppercase mt-1">Video</span>
                  </button>
                )}

                {/* All Photo Thumbnails */}
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSelectedImage(img);
                      setActiveMediaType('image');
                    }}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      activeMediaType === 'image' && selectedImage === img
                        ? 'border-[#ee4d2d] ring-2 ring-orange-300 scale-95 shadow-md'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[8px] font-bold text-center py-0.5">
                      Ảnh {i + 1}
                    </span>
                  </button>
                ))}
              </div>

              {/* Action share & like */}
              <div className="flex items-center justify-between pt-2 text-xs text-slate-500 border-t border-slate-100">
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#ee4d2d]">
                  <Share2 className="w-4 h-4" />
                  <span>Chia sẻ sản phẩm</span>
                </div>
                <div className="flex items-center gap-1 cursor-pointer hover:text-red-500">
                  <Heart className="w-4 h-4 text-red-500 fill-red-500/20" />
                  <span>Yêu thích ({product.reviewCount + 380})</span>
                </div>
              </div>
            </div>

            {/* Right: Product Details & Purchase Form (7 cols) */}
            <div className="md:col-span-7 space-y-4">
              
              {/* Title & Badges */}
              <div>
                <h1 className="text-base sm:text-xl font-bold text-slate-900 leading-snug">
                  {product.name}
                </h1>
                
                {/* Ratings & Sold */}
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs">
                  <div className="flex items-center gap-1 text-[#ee4d2d] border-r border-slate-200 pr-3">
                    <span className="font-extrabold text-sm underline">{product.rating}</span>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>

                  <div className="border-r border-slate-200 pr-3">
                    <span className="font-bold text-slate-800">{product.reviewCount}</span>
                    <span className="text-slate-500 ml-1">Đánh Giá</span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-800">{product.soldCountDisplay}</span>
                    <span className="text-slate-500 ml-1">Đã Bán</span>
                  </div>
                </div>
              </div>

              {/* Price Container */}
              <div className="bg-orange-50/60 p-4 rounded-2xl border border-orange-100 flex flex-wrap items-baseline gap-3">
                {product.originalPrice > product.price && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatVND(product.originalPrice)}
                  </span>
                )}
                <span className="text-2xl sm:text-3xl font-black text-[#ee4d2d]">
                  {formatVND(product.price)}
                </span>
                {product.discountPercent > 0 && (
                  <span className="bg-[#ee4d2d] text-white text-xs font-black px-2 py-0.5 rounded-full uppercase">
                    -{product.discountPercent}% GIẢM
                  </span>
                )}
                {product.isFlashSale && (
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    Giá Flash Sale Trong Ngày
                  </span>
                )}
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <RotateCcw className="w-4 h-4 text-[#ee4d2d] shrink-0" />
                  <span>15 Ngày Đổi Trả</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Chính Hãng</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Freeship Xtra 0Đ</span>
                </div>
              </div>

              {/* Variations (Màu sắc, Size...) */}
              {product.variations && product.variations.length > 0 ? (
                product.variations.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-2 bg-slate-50/70 p-3 rounded-2xl border border-slate-200">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
                      <span>{group.name}:</span>
                      <span className="text-[#ee4d2d] font-bold text-xs bg-white px-2 py-0.5 rounded-lg border border-orange-200">
                        {selectedVariations[group.name] || 'Chưa chọn'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.options.map((opt) => {
                        const isSelected = selectedVariations[group.name] === opt.label;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSelectedVariations(prev => ({ ...prev, [group.name]: opt.label }))}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'border-[#ee4d2d] bg-white text-[#ee4d2d] shadow-sm ring-2 ring-[#ee4d2d]/30'
                                : 'border-slate-300 text-slate-700 hover:border-slate-400 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#ee4d2d]" />}
                            <span>{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                /* Default fallback variations if none set */
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                  <span className="font-bold">Phân loại & Kích cỡ:</span>
                  <span className="font-semibold text-slate-800">Tiêu Chuẩn / Freesize Chính Hãng</span>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="flex items-center gap-4 pt-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Số Lượng:</span>
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 cursor-pointer disabled:opacity-40"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 cursor-pointer disabled:opacity-40"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-slate-500">
                  {product.stock} sản phẩm có sẵn trong kho
                </span>
              </div>

              {/* Action Buttons (Add to Cart & Buy Now) */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-5 rounded-2xl border-2 border-[#ee4d2d] bg-orange-50 hover:bg-orange-100 text-[#ee4d2d] font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Thêm Vào Giỏ Hàng</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] hover:from-[#d73211] hover:to-[#e64a19] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 transition-all cursor-pointer active:scale-98"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Mua Ngay</span>
                </button>
              </div>

              {/* Toast Feedback */}
              {addedToast && (
                <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-1">
                  <Check className="w-4 h-4" />
                  <span>Đã thêm sản phẩm vào giỏ hàng thành công!</span>
                </div>
              )}

            </div>

          </div>

          {/* Product Description & Specs */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 space-y-4">
            <h3 className="font-black text-sm sm:text-base text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
              CHI TIẾT SẢN PHẨM & MÔ TẢ
            </h3>

            {/* Specs table */}
            {product.specifications && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="flex gap-2 p-2 rounded-lg bg-slate-50">
                    <span className="w-32 text-slate-400 font-medium">{key}:</span>
                    <span className="text-slate-800 font-semibold flex-1">{val}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Description Text */}
            <div className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
              {product.description}
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 space-y-4">
            <h3 className="font-black text-sm sm:text-base text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
              ĐÁNH GIÁ SẢN PHẨM ({product.reviewCount})
            </h3>

            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-4">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src={rev.userAvatar} alt={rev.userName} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{rev.userName}</p>
                          <div className="flex text-amber-400">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400">{rev.date}</span>
                    </div>

                    {rev.variation && (
                      <p className="text-[11px] text-slate-400">Phân loại: {rev.variation}</p>
                    )}

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">Chưa có bình luận nào cho sản phẩm này.</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
