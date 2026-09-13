import React, { useState } from 'react';
import { Product, Category, ProductVariationGroup, ProductReview } from '../types';
import { formatVND } from '../utils/formatters';
import { 
  X, Save, Image, Trash2, CheckCircle2, Video, 
  Upload, Play, Film, Palette, Ruler, Plus, Tag,
  Star, MessageSquare, Sparkles, Scale, Box, Truck, Info, Store
} from 'lucide-react';
import { CARRIER_OPTIONS, calculateCarrierFee, formatWeight, formatDimensions } from '../utils/shipping';

interface EditProductModalProps {
  product: Product;
  categories: Category[];
  onClose: () => void;
  onSave: (updatedProduct: Product) => void;
}

const PRESET_COLORS = ['Đen', 'Trắng', 'Xám', 'Xanh Navy', 'Đỏ Đô', 'Vàng', 'Hồng', 'Be', 'Xanh Rêu', 'Nâu'];
const PRESET_SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL', 'Freesize', '38', '39', '40', '41', '42', '43'];

export const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  categories,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Product>({ 
    ...product,
    gallery: product.gallery || []
  });

  // Extract initial 4 images: product.image is slot 0, remaining in gallery are slots 1, 2, 3
  const initialImages: string[] = [
    product.image || '',
    (product.gallery && product.gallery[0] !== product.image ? product.gallery[0] : product.gallery?.[1]) || '',
    product.gallery?.[2] || '',
    product.gallery?.[3] || ''
  ];
  // Ensure array has 4 items
  const [images, setImages] = useState<string[]>([
    initialImages[0] || '',
    initialImages[1] || '',
    initialImages[2] || '',
    initialImages[3] || ''
  ]);

  const [videoUrl, setVideoUrl] = useState<string>(product.videoUrl || '');

  // Extract variations (Color & Size)
  const existingColorGroup = product.variations?.find(
    v => v.name.toLowerCase().includes('màu') || v.name.toLowerCase().includes('color')
  );
  const existingSizeGroup = product.variations?.find(
    v => v.name.toLowerCase().includes('kích') || v.name.toLowerCase().includes('size')
  );

  const [colors, setColors] = useState<string[]>(
    existingColorGroup?.options.map(o => o.label) || []
  );
  const [sizes, setSizes] = useState<string[]>(
    existingSizeGroup?.options.map(o => o.label) || []
  );

  const [newColorInput, setNewColorInput] = useState('');
  const [newSizeInput, setNewSizeInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Shipping & Logistics states
  const [weight, setWeight] = useState<number>(product.weight || 350);
  const [dimensions, setDimensions] = useState<{ length: number; width: number; height: number }>(
    product.dimensions || { length: 25, width: 15, height: 8 }
  );
  const [freeShipByShop, setFreeShipByShop] = useState<boolean>(
    Boolean(product.shippingConfig?.freeShipByShop)
  );
  const [allowedCarriers, setAllowedCarriers] = useState<string[]>(
    product.shippingConfig?.allowedCarriers || ['spx', 'ghn', 'vtp', 'jt']
  );

  // Shop Info State (Sửa chữ các shop bên dưới sản phẩm)
  const [shopNameState, setShopNameState] = useState<string>(
    product.shopInfo?.name || 'VIETSHOP Official'
  );
  const [shopAvatarState, setShopAvatarState] = useState<string>(
    product.shopInfo?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
  );
  const [shopLocationState, setShopLocationState] = useState<string>(
    product.shopInfo?.location || product.location || 'TP. Hồ Chí Minh'
  );
  const [shopRatingState, setShopRatingState] = useState<number>(
    product.shopInfo?.rating || 4.9
  );
  const [shopFollowersState, setShopFollowersState] = useState<string>(
    product.shopInfo?.followers || '45.8k'
  );
  const [shopIsOfficial, setShopIsOfficial] = useState<boolean>(
    product.shopInfo?.isOfficial ?? Boolean(product.isMall)
  );

  // Reviews State
  const [reviews, setReviews] = useState<ProductReview[]>(
    product.reviews && product.reviews.length > 0 ? product.reviews : []
  );

  const handleAddNewReview = () => {
    const newRev: ProductReview = {
      id: 'rev-' + Date.now().toString().slice(-6),
      userName: 'Khách hàng thân thiết',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      date: 'Vừa xong',
      variation: colors[0] ? `Màu ${colors[0]} - Size ${sizes[0] || 'M'}` : undefined,
      comment: 'Giao hàng nhanh, hàng đúng như quảng cáo, rất đáng tiền!',
      likes: 1
    };
    setReviews(prev => [...prev, newRev]);
  };

  const handleUpdateReview = (idx: number, field: keyof ProductReview, value: any) => {
    setReviews(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleRemoveReview = (idx: number) => {
    setReviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handlePopulatePresetReviews = () => {
    setReviews([
      {
        id: 'rev-p1-' + Date.now(),
        userName: 'Nguyễn Thu Hà',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        rating: 5,
        date: 'Hôm qua',
        variation: colors[0] ? `Màu ${colors[0]} - Size ${sizes[0] || 'M'}` : 'Màu Đen - Size L',
        comment: 'Sản phẩm đóng gói rất cẩn thận, giao hàng siêu nhanh. Chất liệu chuẩn đẹp đúng như mô tả, mặc lên form rất tôn dáng. 5 sao cho shop!',
        likes: 15
      },
      {
        id: 'rev-p2-' + Date.now(),
        userName: 'Trần Minh Quân',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        rating: 5,
        date: '3 ngày trước',
        variation: colors[1] ? `Màu ${colors[1]} - Size ${sizes[1] || 'XL'}` : 'Màu Trắng - Size XL',
        comment: 'Mua lần thứ 2 của shop rồi vẫn cực kỳ hài lòng. Nhân viên tư vấn nhiệt tình, hàng chính hãng nguyên tem mác. Sẽ tiếp tục ủng hộ dài dài!',
        likes: 9
      }
    ]);
  };

  // Update a specific image slot
  const handleImageSlotChange = (index: number, value: string) => {
    setImages(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  // Upload image from computer/device for a specific slot
  const handleImageSlotUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          handleImageSlotChange(index, uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload video from computer/device
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setVideoUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Variation handlers
  const handleAddColor = (color: string) => {
    const trimmed = color.trim();
    if (trimmed && !colors.includes(trimmed)) {
      setColors(prev => [...prev, trimmed]);
      setNewColorInput('');
    }
  };

  const handleRemoveColor = (colorToRemove: string) => {
    setColors(prev => prev.filter(c => c !== colorToRemove));
  };

  const handleAddSize = (size: string) => {
    const trimmed = size.trim();
    if (trimmed && !sizes.includes(trimmed)) {
      setSizes(prev => [...prev, trimmed]);
      setNewSizeInput('');
    }
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setSizes(prev => prev.filter(s => s !== sizeToRemove));
  };

  // Helper for price calculation
  const handlePriceChange = (price: number) => {
    const orig = formData.originalPrice || price;
    const discount = orig > price ? Math.round(((orig - price) / orig) * 100) : 0;
    setFormData(prev => ({
      ...prev,
      price,
      discountPercent: discount
    }));
  };

  const handleOriginalPriceChange = (origPrice: number) => {
    const currentPrice = formData.price;
    const discount = origPrice > currentPrice ? Math.round(((origPrice - currentPrice) / origPrice) * 100) : 0;
    setFormData(prev => ({
      ...prev,
      originalPrice: origPrice,
      discountPercent: discount
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên sản phẩm!');
      return;
    }

    // Process 4 images: slot 0 is main image, all non-empty are in gallery
    const validImages = images.filter(img => img.trim() !== '');
    const mainImg = validImages[0] || formData.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';

    // Construct variations
    const updatedVariations: ProductVariationGroup[] = [];
    if (colors.length > 0) {
      updatedVariations.push({
        name: 'Màu sắc',
        options: colors.map((c, idx) => ({ id: `col-${idx}`, label: c }))
      });
    }
    if (sizes.length > 0) {
      updatedVariations.push({
        name: 'Kích cỡ',
        options: sizes.map((s, idx) => ({ id: `sz-${idx}`, label: s }))
      });
    }

    // Preserve any other custom variation groups that might have existed
    formData.variations?.forEach(g => {
      const lower = g.name.toLowerCase();
      if (!lower.includes('màu') && !lower.includes('color') && !lower.includes('kích') && !lower.includes('size')) {
        updatedVariations.push(g);
      }
    });

    const soldNum = Number(formData.soldCount) || 0;
    const soldDisplay = formData.soldCountDisplay?.trim() || (soldNum >= 1000 ? (soldNum / 1000).toFixed(1) + 'k' : soldNum.toString());
    const finalRating = Number(formData.rating) || 5.0;
    const validReviews = reviews.filter(r => r.comment.trim() !== '' || r.userName.trim() !== '');

    const updated: Product = {
      ...formData,
      stock: Number(formData.stock) || 0,
      weight: Number(weight) || 350,
      dimensions: {
        length: Number(dimensions.length) || 25,
        width: Number(dimensions.width) || 15,
        height: Number(dimensions.height) || 8
      },
      shippingConfig: {
        useStandardCarrierRate: true,
        freeShipByShop: freeShipByShop,
        allowedCarriers: allowedCarriers
      },
      rating: finalRating,
      soldCount: soldNum,
      soldCountDisplay: soldDisplay,
      reviewCount: Number(formData.reviewCount) || (validReviews.length > 0 ? validReviews.length : 1),
      reviews: validReviews.length > 0 ? validReviews : undefined,
      image: mainImg,
      gallery: validImages.length > 0 ? validImages : [mainImg],
      videoUrl: videoUrl.trim() ? videoUrl.trim() : undefined,
      variations: updatedVariations.length > 0 ? updatedVariations : undefined,
      shopInfo: {
        name: shopNameState.trim() || 'VIETSHOP Official',
        avatar: shopAvatarState.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        location: shopLocationState.trim() || formData.location || 'TP. Hồ Chí Minh',
        rating: Number(shopRatingState) || 4.9,
        responseRate: product.shopInfo?.responseRate || '99%',
        followers: shopFollowersState.trim() || '45.8k',
        isOfficial: shopIsOfficial
      },
      location: shopLocationState.trim() || formData.location || 'TP. Hồ Chí Minh',
      updatedAt: new Date().toISOString().split('T')[0]
    };

    onSave(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <span>Chỉnh Sửa Sản Phẩm #{formData.id}</span>
              {saveSuccess && (
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Đã lưu thành công!
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500">Cập nhật 4 hình ảnh, video giới thiệu và tùy chọn Size / Màu sắc</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto pr-1 py-4 space-y-5 text-xs">
          
          {/* Section 1: Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Tên Sản Phẩm *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-bold text-slate-900 text-sm"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Ngành Hàng / Danh Mục *</label>
              <select
                value={formData.category}
                onChange={(e) => {
                  const catId = e.target.value;
                  const cat = categories.find(c => c.id === catId);
                  setFormData(prev => ({
                    ...prev,
                    category: catId,
                    categoryName: cat?.name || prev.categoryName
                  }));
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white font-medium"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Số Lượng Kho Hàng (Stock) *</label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Giá Bán Khuyến Mãi (₫) *</label>
              <input
                type="number"
                step="1000"
                min="0"
                value={formData.price}
                onChange={(e) => handlePriceChange(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white font-black text-blue-600 text-sm"
              />
              <span className="text-[11px] text-slate-500 mt-0.5 block">{formatVND(formData.price)}</span>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Giá Gốc Chưa Giảm (₫)</label>
              <input
                type="number"
                step="1000"
                min="0"
                value={formData.originalPrice || formData.price}
                onChange={(e) => handleOriginalPriceChange(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white font-medium"
              />
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                {formatVND(formData.originalPrice || formData.price)} (Giảm {formData.discountPercent || 0}%)
              </span>
            </div>
          </div>

          {/* Section: Chỉnh Sửa Thông Tin Cửa Hàng / Tên Shop Bên Dưới Sản Phẩm */}
          <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/90 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-amber-200 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-xs">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">Cửa Hàng / Tên Shop Hiển Thị Dưới Sản Phẩm</h3>
                  <p className="text-[11px] text-slate-500">Chỉnh sửa chữ tên shop, ảnh đại diện shop và vị trí gian hàng của sản phẩm này</p>
                </div>
              </div>
              <span className="text-[10px] bg-amber-200/70 text-amber-900 font-bold px-2 py-0.5 rounded-md self-start sm:self-auto">
                Quản Trị Shop
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Tên Shop */}
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-800 block mb-1">
                  Tên Cửa Hàng / Tên Shop (Hiển thị dưới sản phẩm) *
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={shopNameState}
                    onChange={(e) => setShopNameState(e.target.value)}
                    placeholder="VD: VIETSHOP Mall, Thời Trang Cao Cấp Hà Nội, Shop Phụ Kiện..."
                    className="w-full pl-9 pr-3.5 py-2 bg-white border border-amber-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Chữ này sẽ hiển thị trực tiếp ở dòng tên shop bên dưới sản phẩm trên trang chủ và trang chi tiết.
                </span>
              </div>

              {/* Ảnh đại diện Shop */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Ảnh Đại Diện Shop (Avatar URL hoặc tải lên)
                </label>
                <div className="flex gap-2 items-center">
                  <div className="w-10 h-10 rounded-xl border border-amber-300 bg-white overflow-hidden shrink-0">
                    <img src={shopAvatarState} alt="Shop Avatar" className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="text"
                    value={shopAvatarState}
                    onChange={(e) => setShopAvatarState(e.target.value)}
                    placeholder="Link URL ảnh shop..."
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none"
                  />
                  <label className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5 text-amber-600" />
                    <span>Tải ảnh</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) setShopAvatarState(event.target.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Vị trí shop */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Vị Trí Cửa Hàng / Tỉnh Thành Gửi Hàng
                </label>
                <input
                  type="text"
                  value={shopLocationState}
                  onChange={(e) => setShopLocationState(e.target.value)}
                  placeholder="VD: TP. Hồ Chí Minh, Hà Nội, Đà Nẵng..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>

              {/* Đánh giá shop & Followers */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="font-bold text-slate-800 block mb-1">Đánh Giá Shop (Sao)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={shopRatingState}
                    onChange={(e) => setShopRatingState(parseFloat(e.target.value) || 4.9)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="flex-1">
                  <label className="font-bold text-slate-800 block mb-1">Người Theo Dõi</label>
                  <input
                    type="text"
                    value={shopFollowersState}
                    onChange={(e) => setShopFollowersState(e.target.value)}
                    placeholder="VD: 45.8k"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Official badge */}
              <div className="flex items-center gap-2 pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 bg-white px-3.5 py-2 rounded-xl border border-slate-300">
                  <input
                    type="checkbox"
                    checked={shopIsOfficial}
                    onChange={(e) => setShopIsOfficial(e.target.checked)}
                    className="rounded text-[#ee4d2d] focus:ring-orange-400 cursor-pointer"
                  />
                  <span>Gian hàng Chính Hãng (Mall / Official Store)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section: Logistics, Weight, Dimensions & Carrier Rates (Vận chuyển, Tồn kho, Kích thước, Cân nặng, Phí ship) */}
          <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-orange-200 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#ee4d2d] text-white flex items-center justify-center shadow-xs">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">Vận Chuyển & Kích Thước Đóng Gói (Do Bên Vận Chuyển Quy Định)</h3>
                  <p className="text-[11px] text-slate-500">Cân nặng, kích thước sau đóng gói để tính phí ship tự động chính xác cho khách</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                Tồn kho: {formData.stock || 0} SP
              </span>
            </div>

            {/* Weight and Dimensions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Weight */}
              <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-orange-100 shadow-xs">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-[#ee4d2d]" />
                    <span>Cân nặng đóng gói (gram) *</span>
                  </label>
                  <span className="text-[11px] font-extrabold text-[#ee4d2d] bg-orange-50 px-2 py-0.5 rounded-md">
                    {formatWeight(weight)}
                  </span>
                </div>
                <input
                  type="number"
                  min="1"
                  value={weight}
                  onChange={(e) => setWeight(Math.max(1, Number(e.target.value) || 1))}
                  placeholder="Ví dụ: 350"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#ee4d2d] font-bold text-slate-800"
                  required
                />
                {/* Weight Quick Presets */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] text-slate-400 font-semibold">Chọn nhanh:</span>
                  {[100, 250, 500, 1000, 2000].map(w => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setWeight(w)}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                        weight === w
                          ? 'bg-[#ee4d2d] text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {formatWeight(w)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dimensions */}
              <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-orange-100 shadow-xs">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Box className="w-4 h-4 text-[#ee4d2d]" />
                    <span>Kích thước đóng gói (cm) *</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Quy đổi: {formatWeight(Math.round((dimensions.length * dimensions.width * dimensions.height) / 6))}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5 font-semibold">Dài (cm)</span>
                    <input
                      type="number"
                      min="1"
                      value={dimensions.length}
                      onChange={(e) => setDimensions(prev => ({ ...prev, length: Math.max(1, Number(e.target.value) || 1) }))}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-center font-bold text-slate-800 focus:bg-white focus:border-[#ee4d2d]"
                      required
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5 font-semibold">Rộng (cm)</span>
                    <input
                      type="number"
                      min="1"
                      value={dimensions.width}
                      onChange={(e) => setDimensions(prev => ({ ...prev, width: Math.max(1, Number(e.target.value) || 1) }))}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-center font-bold text-slate-800 focus:bg-white focus:border-[#ee4d2d]"
                      required
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5 font-semibold">Cao (cm)</span>
                    <input
                      type="number"
                      min="1"
                      value={dimensions.height}
                      onChange={(e) => setDimensions(prev => ({ ...prev, height: Math.max(1, Number(e.target.value) || 1) }))}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-center font-bold text-slate-800 focus:bg-white focus:border-[#ee4d2d]"
                      required
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">
                  Quy chuẩn: Dài × Rộng × Cao ({dimensions.length} × {dimensions.width} × {dimensions.height} cm)
                </p>
              </div>
            </div>

            {/* Carrier Rates & Shipping Fee Rule by Carrier */}
            <div className="bg-white p-3.5 rounded-xl border border-orange-100 space-y-3 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-slate-800 text-xs">
                    Phí vận chuyển được tính tự động theo quy định của đơn vị vận chuyển
                  </span>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs bg-slate-50 hover:bg-orange-50 px-3 py-1.5 rounded-lg border border-slate-200 transition">
                  <input
                    type="checkbox"
                    checked={freeShipByShop}
                    onChange={(e) => setFreeShipByShop(e.target.checked)}
                    className="rounded text-[#ee4d2d] focus:ring-orange-400 cursor-pointer"
                  />
                  <span className="font-semibold text-slate-700">Shop tài trợ Freeship cho khách</span>
                </label>
              </div>

              {/* Live Carrier Rates Estimated Preview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {CARRIER_OPTIONS.map(carrier => {
                  const estimatedFee = freeShipByShop ? 0 : calculateCarrierFee(
                    carrier.id,
                    weight,
                    dimensions
                  );
                  const isSelected = allowedCarriers.includes(carrier.id);

                  return (
                    <div
                      key={carrier.id}
                      onClick={() => {
                        setAllowedCarriers(prev => 
                          prev.includes(carrier.id) 
                            ? (prev.length > 1 ? prev.filter(c => c !== carrier.id) : prev)
                            : [...prev, carrier.id]
                        );
                      }}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-[#ee4d2d] bg-orange-50/50 shadow-xs ring-1 ring-[#ee4d2d]' 
                          : 'border-slate-200 bg-slate-50 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[11px] text-slate-800">{carrier.name}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                          {carrier.estimatedDelivery}
                        </span>
                      </div>
                      <div className="text-[11px] font-black text-[#ee4d2d]">
                        {freeShipByShop ? (
                          <span className="text-emerald-600 font-bold">Miễn phí 0₫</span>
                        ) : (
                          formatVND(estimatedFee)
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 block truncate">
                        {carrier.description}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: 4 Image Slots (Tối đa 4 ảnh từ máy hoặc từ link mạng) */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Image className="w-4 h-4 text-blue-600" />
                <span>Thư Viện 4 Hình Ảnh Sản Phẩm</span>
              </h3>
              <span className="text-[11px] text-slate-500">
                Hỗ trợ cả tải trực tiếp từ máy/điện thoại và dán link web trực tuyến
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {[0, 1, 2, 3].map((slotIdx) => {
                const imgVal = images[slotIdx] || '';
                const isCover = slotIdx === 0;

                return (
                  <div key={slotIdx} className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <span>Ảnh {slotIdx + 1}</span>
                        {isCover && (
                          <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded-md font-extrabold">
                            Ảnh Đại Diện Chính
                          </span>
                        )}
                      </span>
                      {imgVal && (
                        <button
                          type="button"
                          onClick={() => handleImageSlotChange(slotIdx, '')}
                          className="text-red-500 hover:text-red-700 font-bold text-[10px] flex items-center gap-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> Xóa ảnh
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2 items-center">
                      <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 shrink-0 overflow-hidden flex items-center justify-center relative">
                        {imgVal ? (
                          <img src={imgVal} alt={`slot-${slotIdx}`} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium text-center px-1">Chưa có ảnh</span>
                        )}
                      </div>

                      <div className="flex-1 space-y-1.5">
                        <label className="w-full py-1.5 px-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer transition">
                          <Upload className="w-3.5 h-3.5 text-blue-600" />
                          <span>Tải Từ Máy / ĐT</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleImageSlotUpload(slotIdx, e)} 
                            className="hidden" 
                          />
                        </label>

                        <input
                          type="text"
                          value={imgVal}
                          onChange={(e) => handleImageSlotChange(slotIdx, e.target.value)}
                          placeholder="Hoặc dán URL link ảnh..."
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-[11px] focus:bg-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: 1 Video Slot (Tải từ máy hoặc link mạng) */}
          <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-3">
            <div className="flex items-center justify-between border-b border-purple-200 pb-2">
              <h3 className="font-bold text-purple-950 text-sm flex items-center gap-1.5">
                <Film className="w-4 h-4 text-purple-600" />
                <span>Video Giới Thiệu Sản Phẩm (1 Video)</span>
              </h3>
              {videoUrl && (
                <button
                  type="button"
                  onClick={() => setVideoUrl('')}
                  className="text-red-500 hover:text-red-700 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Xóa Video
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
              <div className="space-y-2">
                <label className="text-slate-700 font-bold block text-[11px]">
                  Tải lên video từ thiết bị (.mp4, .webm, .mov) hoặc dán link online:
                </label>
                <div className="flex gap-2">
                  <label className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition shrink-0">
                    <Video className="w-3.5 h-3.5" />
                    <span>Tải Video Từ Máy</span>
                    <input 
                      type="file" 
                      accept="video/*" 
                      onChange={handleVideoUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>

                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Dán đường dẫn link video (https://...mp4, webm...)"
                  className="w-full px-3 py-2 bg-white border border-purple-300 rounded-xl text-xs focus:outline-none focus:border-purple-600"
                />
                <p className="text-[11px] text-slate-500">
                  Video hiển thị trực tiếp trên giao diện chi tiết, giúp khách xem cận cảnh chất liệu và kiểu dáng!
                </p>
              </div>

              {/* Video Player Preview */}
              <div>
                {videoUrl ? (
                  <div className="p-2 bg-slate-900 rounded-xl">
                    <p className="text-[10px] text-purple-300 font-bold mb-1 flex items-center gap-1">
                      <Play className="w-3 h-3 text-purple-400" /> Khung xem thử Video sản phẩm:
                    </p>
                    <video 
                      src={videoUrl} 
                      controls 
                      className="w-full h-32 rounded-lg object-contain bg-black"
                    >
                      Trình duyệt không hỗ trợ thẻ video.
                    </video>
                  </div>
                ) : (
                  <div className="h-32 border-2 border-dashed border-purple-300 rounded-xl bg-purple-50/40 flex flex-col items-center justify-center text-purple-400 gap-1 p-2 text-center">
                    <Video className="w-6 h-6 stroke-1" />
                    <span className="text-[11px] font-medium">Chưa có video cho sản phẩm này</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Size & Color Variations (Mục Size, Màu Sắc) */}
          <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-4">
            <div className="border-b border-amber-200 pb-2">
              <h3 className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-amber-600" />
                <span>Phân Loại Sản Phẩm: Kích Cỡ (Size) & Màu Sắc</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Khách hàng có thể bấm chọn kích cỡ và màu sắc tương ứng khi đặt hàng
              </p>
            </div>

            {/* Màu Sắc (Color) */}
            <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-pink-500" />
                  <span>1. Nhóm Màu Sắc ({colors.length} màu đã thêm)</span>
                </span>
              </div>

              {/* Preset buttons */}
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400">Chọn nhanh các màu phổ biến:</span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_COLORS.map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAddColor(preset)}
                      className={`px-2 py-1 rounded-lg border text-[11px] font-medium transition cursor-pointer ${
                        colors.includes(preset)
                          ? 'bg-pink-100 text-pink-700 border-pink-300'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Add Color Input */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newColorInput}
                  onChange={(e) => setNewColorInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddColor(newColorInput);
                    }
                  }}
                  placeholder="Nhập màu sắc khác (ví dụ: Xanh bạc hà, Nâu cà phê...)"
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-pink-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddColor(newColorInput)}
                  className="px-3.5 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm Màu
                </button>
              </div>

              {/* Current Colors Badges */}
              {colors.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {colors.map((c) => (
                    <span 
                      key={c}
                      className="px-2.5 py-1 bg-pink-50 border border-pink-200 text-pink-800 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>{c}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(c)}
                        className="hover:text-red-600 cursor-pointer text-slate-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Kích Cỡ (Size) */}
            <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Ruler className="w-4 h-4 text-blue-500" />
                  <span>2. Nhóm Kích Cỡ (Size) ({sizes.length} size đã thêm)</span>
                </span>
              </div>

              {/* Preset buttons */}
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400">Chọn nhanh các size thông dụng:</span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_SIZES.map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAddSize(preset)}
                      className={`px-2 py-1 rounded-lg border text-[11px] font-medium transition cursor-pointer ${
                        sizes.includes(preset)
                          ? 'bg-blue-100 text-blue-700 border-blue-300'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Add Size Input */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newSizeInput}
                  onChange={(e) => setNewSizeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSize(newSizeInput);
                    }
                  }}
                  placeholder="Nhập kích cỡ khác (ví dụ: XXL, 44, Size 29...)"
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddSize(newSizeInput)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm Size
                </button>
              </div>

              {/* Current Sizes Badges */}
              {sizes.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {sizes.map((s) => (
                    <span 
                      key={s}
                      className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(s)}
                        className="hover:text-red-600 cursor-pointer text-slate-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Badges & Flags */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Huy Hiệu & Ưu Đãi</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isMall}
                  onChange={(e) => setFormData(prev => ({ ...prev, isMall: e.target.checked }))}
                  className="rounded text-red-600"
                />
                <span className="font-bold text-red-600">VIETSHOP Mall</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFavorite}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFavorite: e.target.checked }))}
                  className="rounded text-orange-600"
                />
                <span className="font-bold text-orange-600">Yêu Thích+</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFreeshipXtra}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFreeshipXtra: e.target.checked }))}
                  className="rounded text-emerald-600"
                />
                <span className="font-bold text-emerald-600">Freeship Xtra</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFlashSale}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFlashSale: e.target.checked }))}
                  className="rounded text-amber-600"
                />
                <span className="font-bold text-amber-600">Flash Sale</span>
              </label>
            </div>
          </div>

          {/* Section 6: Star Rating (*) & Sold Count */}
          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-3">
            <div className="border-b border-amber-200 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h3 className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>Thiết Lập Số Sao (*) & Số Lượng Bán (Đã Bán)</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Tùy chỉnh số sao và số lượng đã bán hiển thị trên catalog và chi tiết sản phẩm
                </p>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full shrink-0">
                ⭐ {formData.rating ?? 5.0} • Đã bán {formData.soldCountDisplay || formData.soldCount || 0}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Số sao đánh giá */}
              <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <span>Số sao đánh giá (*)</span>
                  </span>
                  <span className="text-[#ee4d2d] font-black text-sm">{Number(formData.rating) || 5.0} ⭐</span>
                </label>
                
                <input
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="5.0"
                  value={formData.rating ?? 5.0}
                  onChange={(e) => {
                    const val = Math.min(5, Math.max(1, parseFloat(e.target.value) || 5.0));
                    setFormData(prev => ({ ...prev, rating: val }));
                  }}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-amber-500"
                />

                <div className="flex flex-wrap gap-1 pt-1">
                  {[5.0, 4.9, 4.8, 4.7].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rating: r }))}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
                        formData.rating === r
                          ? 'bg-amber-500 text-white border-amber-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50'
                      }`}
                    >
                      ⭐ {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Số lượng đã bán */}
              <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Số lượng đã bán (số)</span>
                  <span className="text-slate-500 text-[11px]">Thực tế: {formData.soldCount || 0}</span>
                </label>

                <input
                  type="number"
                  min="0"
                  value={formData.soldCount ?? 128}
                  onChange={(e) => {
                    const num = parseInt(e.target.value, 10) || 0;
                    const disp = num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num.toString();
                    setFormData(prev => ({ 
                      ...prev, 
                      soldCount: num,
                      soldCountDisplay: disp
                    }));
                  }}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-amber-500"
                />

                <div className="flex flex-wrap gap-1 pt-1">
                  {[50, 128, 520, 1200, 3500].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        const disp = s >= 1000 ? (s / 1000).toFixed(1) + 'k' : s.toString();
                        setFormData(prev => ({ 
                          ...prev, 
                          soldCount: s,
                          soldCountDisplay: disp
                        }));
                      }}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
                        formData.soldCount === s
                          ? 'bg-orange-500 text-white border-orange-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-orange-50'
                      }`}
                    >
                      {s >= 1000 ? (s / 1000).toFixed(1) + 'k' : s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chữ hiển thị đã bán */}
              <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Chữ hiển thị "Đã bán"</span>
                  <span className="text-[10px] text-slate-400">Hiển thị thẻ</span>
                </label>

                <input
                  type="text"
                  value={formData.soldCountDisplay ?? '128'}
                  onChange={(e) => setFormData(prev => ({ ...prev, soldCountDisplay: e.target.value }))}
                  placeholder="VD: 128 hoặc 1.2k hoặc 3.5k đã bán"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-amber-500 font-semibold"
                />

                <p className="text-[10px] text-slate-400">
                  Sẽ hiển thị: "Đã bán {formData.soldCountDisplay || formData.soldCount || 0}"
                </p>
              </div>
            </div>
          </div>

          {/* Section 7: Customer Reviews */}
          <div className="p-4 bg-orange-50/70 rounded-2xl border border-orange-200 space-y-3">
            <div className="border-b border-orange-200 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-orange-950 text-xs flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-orange-600" />
                  <span>Nhận Xét & Đánh Giá Của Khách Hàng ({reviews.length} nhận xét)</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Thêm, sửa đổi hoặc xóa nhận xét hiển thị ở mục Đánh giá sản phẩm
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handlePopulatePresetReviews}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[11px] font-bold flex items-center gap-1 shadow-xs transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Nạp Mẫu 2 Đánh Giá 5★</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddNewReview}
                  className="px-2.5 py-1 bg-[#ee4d2d] hover:bg-[#d73211] text-white rounded-xl text-[11px] font-bold flex items-center gap-1 shadow-xs transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Thêm Nhận Xét</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {reviews.map((rev, rIdx) => (
                <div key={rev.id || rIdx} className="bg-white p-3.5 rounded-xl border border-orange-200/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-black flex items-center justify-center">
                        {rIdx + 1}
                      </span>
                      <span className="font-bold text-xs text-slate-800">
                        Nhận xét #{rIdx + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                        {[1, 2, 3, 4, 5].map(starNum => (
                          <button
                            key={starNum}
                            type="button"
                            onClick={() => handleUpdateReview(rIdx, 'rating', starNum)}
                            className="p-0.5 hover:scale-125 transition cursor-pointer"
                          >
                            <Star 
                              className={`w-3.5 h-3.5 ${
                                starNum <= rev.rating 
                                  ? 'text-amber-400 fill-amber-400' 
                                  : 'text-slate-200'
                              }`} 
                            />
                          </button>
                        ))}
                        <span className="text-[10px] font-extrabold text-amber-800 ml-1">
                          {rev.rating}★
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveReview(rIdx)}
                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg text-xs transition cursor-pointer"
                        title="Xóa nhận xét này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 text-xs">
                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 block">Tên khách hàng</label>
                      <input
                        type="text"
                        value={rev.userName}
                        onChange={(e) => handleUpdateReview(rIdx, 'userName', e.target.value)}
                        placeholder="VD: Nguyễn Thu Hà"
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-orange-500 font-semibold"
                      />
                    </div>

                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 block">Thời gian nhận xét</label>
                      <input
                        type="text"
                        value={rev.date}
                        onChange={(e) => handleUpdateReview(rIdx, 'date', e.target.value)}
                        placeholder="VD: Hôm qua, 2 ngày trước"
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 block">Phân loại mua (Màu / Size)</label>
                      <input
                        type="text"
                        value={rev.variation || ''}
                        onChange={(e) => handleUpdateReview(rIdx, 'variation', e.target.value)}
                        placeholder="VD: Màu Đen - Size L"
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                      <span>Nội dung nhận xét:</span>
                      <span className="text-[10px] text-slate-400">Hiển thị ở mục Đánh giá</span>
                    </label>
                    <textarea
                      rows={2}
                      value={rev.comment}
                      onChange={(e) => handleUpdateReview(rIdx, 'comment', e.target.value)}
                      placeholder="Lời đánh giá nhận xét..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-orange-500 leading-relaxed"
                    />
                  </div>
                </div>
              ))}

              {reviews.length === 0 && (
                <div className="p-4 bg-white rounded-xl border-2 border-dashed border-orange-200 text-center space-y-2">
                  <p className="text-xs text-slate-500">Chưa có nhận xét nào cho sản phẩm này.</p>
                  <button
                    type="button"
                    onClick={handlePopulatePresetReviews}
                    className="px-3 py-1.5 bg-orange-100 text-orange-700 font-bold text-xs rounded-xl hover:bg-orange-200 transition cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Nạp ngay 2 nhận xét mẫu</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Section 6: Description */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Mô Tả Chi Tiết Sản Phẩm</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Mô tả chất liệu, nguồn gốc xuất xứ, thông số kỹ thuật, bảo hành..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 text-xs"
            />
          </div>

          {/* Sticky/Fixed Action Footer */}
          <div className="pt-3 flex justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Thay Đổi Sản Phẩm</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
