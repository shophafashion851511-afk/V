import React, { useState, useEffect } from 'react';
import { 
  Product, Category, Order, Voucher, ShopSettings, 
  SellerSubTab, OrderStatus, SiteConfig, ProductVariationGroup,
  SellerRegistrationApplication, WithdrawalRequest, WalletTransaction,
  MarketingCampaign, UserRole, ProductReview
} from '../types';
import { formatVND, getStatusBadgeInfo } from '../utils/formatters';
import { HtmlExportView } from './HtmlExportView';
import { AdminSupervisionView } from './AdminSupervisionView';
import { WalletWithdrawalView } from './WalletWithdrawalView';
import { SellerMarketingView } from './SellerMarketingView';
import { SiteManagementView } from './SiteManagementView';
import { 
  Package, PlusCircle, ClipboardList, Ticket, BarChart3, 
  Settings, Search, Edit3, Trash2, Copy, Eye, EyeOff, 
  CheckCircle, ArrowUpRight, DollarSign, ShoppingBag, 
  RotateCcw, Sparkles, Image, Check, AlertTriangle, Lock, KeyRound, Type, LayoutTemplate,
  Video, Upload, Play, Film, Palette, Ruler, Tag, Plus, X, FileCode,
  ShieldCheck, Wallet, Truck, CreditCard, Building2, Send,
  Star, MessageSquare, ThumbsUp, User, Scale, Box, Info, Store, Camera
} from 'lucide-react';
import { CARRIER_OPTIONS, calculateCarrierFee, formatWeight, formatDimensions } from '../utils/shipping';

interface SellerCenterProps {
  products: Product[];
  categories: Category[];
  orders: Order[];
  vouchers: Voucher[];
  shopSettings: ShopSettings;
  siteConfig?: SiteConfig;
  currentRole?: UserRole;
  applications?: SellerRegistrationApplication[];
  withdrawals?: WithdrawalRequest[];
  transactions?: WalletTransaction[];
  marketingCampaigns?: MarketingCampaign[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (newProduct: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onAddVoucher: (newVoucher: Voucher) => void;
  onDeleteVoucher: (voucherId: string) => void;
  onUpdateShopSettings: (settings: ShopSettings) => void;
  onUpdateSiteConfig?: (config: SiteConfig) => void;
  onResetAllData: () => void;
  onOpenEditModal: (product: Product) => void;
  onBackToBuyer: () => void;
  onOpenAiAssistant?: () => void;
  onApproveApplication?: (appId: string) => void;
  onRejectApplication?: (appId: string, reason?: string) => void;
  onApproveWithdrawal?: (withdrawalId: string) => void;
  onRejectWithdrawal?: (withdrawalId: string, reason?: string) => void;
  onAddTransaction?: (tx: WalletTransaction) => void;
  onAddWithdrawal?: (wd: WithdrawalRequest) => void;
  onAddMarketingCampaign?: (camp: MarketingCampaign) => void;
  onToggleMarketingCampaign?: (campId: string) => void;
  onDeleteMarketingCampaign?: (campId: string) => void;
  onChangeRole?: (role: UserRole) => void;
  onUpdateCategories?: (categories: Category[]) => void;
}

export const SellerCenter: React.FC<SellerCenterProps> = ({
  products,
  categories,
  orders,
  vouchers,
  shopSettings,
  siteConfig,
  currentRole = 'seller',
  applications = [],
  withdrawals = [],
  transactions = [],
  marketingCampaigns = [],
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onAddVoucher,
  onDeleteVoucher,
  onUpdateShopSettings,
  onUpdateSiteConfig,
  onUpdateCategories,
  onResetAllData,
  onOpenEditModal,
  onBackToBuyer,
  onOpenAiAssistant,
  onApproveApplication,
  onRejectApplication,
  onApproveWithdrawal,
  onRejectWithdrawal,
  onAddTransaction,
  onAddWithdrawal,
  onAddMarketingCampaign,
  onToggleMarketingCampaign,
  onDeleteMarketingCampaign,
  onChangeRole
}) => {
  const [activeSubTab, setActiveSubTab] = useState<SellerSubTab>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');

  // Site Config state for the site_content tab
  const [siteContentSubFilter, setSiteContentSubFilter] = useState<'all' | 'header' | 'banners' | 'services' | 'sections' | 'trust' | 'footer'>('all');
  const [siteContentSearch, setSiteContentSearch] = useState<string>('');
  
  const [siteConfigForm, setSiteConfigForm] = useState<SiteConfig>(siteConfig || {
    sellerPassword: '851011',
    isPasswordProtected: true,
    topAnnouncement: 'VIETSHOP bao ship 0Đ - Đăng ký nhận ngay 100k • Hàng ngàn mã giảm giá 50%',
    searchPlaceholder: 'VIETSHOP bao ship 0Đ - Tìm kiếm sản phẩm, thương hiệu...',
    popularKeywords: 'Áo Thun, Váy Nữ, Giày Sneaker, Son Môi, Tai Nghe Bluetooth, Nồi Chiên',
    cartButtonLabel: 'Giỏ Hàng',
    heroSlides: [
      {
        id: 1,
        title: 'SIÊU ĐẠI HỘI SALE VIETSHOP 9.9',
        subtitle: 'Voucher 500K • Miễn Phí Vận Chuyển 0Đ • Giảm 50%',
        tag: 'Đại Tiệc Mua Sắm',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80'
      },
      {
        id: 2,
        title: 'VIETSHOP - SIÊU THỊ TRỰC TUYẾN CHÍNH HÃNG',
        subtitle: 'Đổi Trả 15 Ngày • Freeship Xtra • Hàng Chuẩn Giá Tốt',
        tag: 'Siêu Thị Trực Tuyến',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80'
      },
      {
        id: 3,
        title: 'TECH ZONE - ĐIỆN TỬ CÔNG NGHỆ',
        subtitle: 'Tai Nghe, Laptop, Smartphone Giảm Sốc Đến 60%',
        tag: 'Công Nghệ 2026',
        image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&auto=format&fit=crop&q=80'
      }
    ],
    miniBanners: [
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
    ],
    fastServices: [
      { id: 'flash_sale', label: 'Khung Giờ Săn Sale', color: 'bg-orange-500 text-white', desc: 'Đồng giá 9k & Giảm sốc 50%' },
      { id: 'freeship', label: 'Miễn Phí Ship 0Đ', color: 'bg-emerald-500 text-white', desc: 'Nhận 3 mã freeship toàn quốc' },
      { id: 'mall', label: 'Hàng Chính Hãng', color: 'bg-red-500 text-white', desc: 'Chính hãng 100% đổi trả 15 ngày' },
      { id: 'vouchers', label: 'Mã Giảm Giá', color: 'bg-amber-500 text-white', desc: 'Kho voucher lên đến 500.000₫' },
      { id: 'coin_back', label: 'Hoàn Xu 50%', color: 'bg-yellow-500 text-white', desc: 'Điểm danh nhận xu mỗi ngày' },
      { id: 'global', label: 'Hàng Quốc Tế', color: 'bg-blue-500 text-white', desc: 'Giao hàng chuẩn quốc tế siêu tốc' },
      { id: 'recharge', label: 'Nạp Thẻ & Dịch Vụ', color: 'bg-purple-500 text-white', desc: 'Nạp điện thoại, 4G chiết khấu 5%' },
      { id: 'rewards', label: 'VIETSHOP Rewards', color: 'bg-pink-500 text-white', desc: 'Vòng quay may mắn & quà tặng VIP' }
    ],
    categoriesSectionTitle: 'DANH MỤC SẢN PHẨM',
    flashSaleTitle: 'FLASH SALE CHỚP NHOÁNG',
    flashSaleCountdownText: 'KẾT THÚC TRONG',
    discoveryTitle: 'GỢI Ý HÔM NAY - DÀNH RIÊNG CHO BẠN',
    loadMoreButtonText: 'Xem Thêm Sản Phẩm Gợi Ý',
    trustBadge1Title: '100% Hàng Chính Hãng',
    trustBadge1Desc: 'Đền 200% nếu phát hiện hàng giả',
    trustBadge2Title: 'Miễn Phí Vận Chuyển',
    trustBadge2Desc: 'Giao hàng 0Đ toàn quốc đơn từ 0Đ',
    trustBadge3Title: 'Đổi Trả Dễ Dàng',
    trustBadge3Desc: 'Đổi trả miễn phí trong 15 ngày',
    trustBadge4Title: 'Hỗ Trợ 24/7',
    trustBadge4Desc: 'Đội ngũ tư vấn tận tình chu đáo',
    footerAbout: 'VIETSHOP - Nền tảng thương mại điện tử hàng đầu Việt Nam.',
    footerHotline: '1900 1221 (8h00 - 21h00 hàng ngày)',
    footerEmail: 'support@vietshop.vn',
    footerAddress: 'Trụ sở chính: Tòa nhà Landmark, 720A Điện Biên Phủ, TP. Hồ Chí Minh & Hà Nội',
    footerCopyright: '© 2026 VIETSHOP - Siêu Thị Trực Tuyến Hàng Đầu. Tất cả các quyền được bảo lưu.'
  });

  useEffect(() => {
    if (siteConfig) {
      setSiteConfigForm(prev => ({
        ...prev,
        ...siteConfig,
        popularKeywords: siteConfig.popularKeywords ?? prev.popularKeywords ?? 'Áo Thun, Váy Nữ, Giày Sneaker, Son Môi, Tai Nghe Bluetooth, Nồi Chiên',
        cartButtonLabel: siteConfig.cartButtonLabel ?? prev.cartButtonLabel ?? 'Giỏ Hàng',
        categoriesSectionTitle: siteConfig.categoriesSectionTitle ?? prev.categoriesSectionTitle ?? 'DANH MỤC SẢN PHẨM',
        flashSaleCountdownText: siteConfig.flashSaleCountdownText ?? prev.flashSaleCountdownText ?? 'KẾT THÚC TRONG',
        loadMoreButtonText: siteConfig.loadMoreButtonText ?? prev.loadMoreButtonText ?? 'Xem Thêm Sản Phẩm Gợi Ý',
        trustBadge1Title: siteConfig.trustBadge1Title ?? prev.trustBadge1Title ?? '100% Hàng Chính Hãng',
        trustBadge1Desc: siteConfig.trustBadge1Desc ?? prev.trustBadge1Desc ?? 'Đền 200% nếu phát hiện hàng giả',
        trustBadge2Title: siteConfig.trustBadge2Title ?? prev.trustBadge2Title ?? 'Miễn Phí Vận Chuyển',
        trustBadge2Desc: siteConfig.trustBadge2Desc ?? prev.trustBadge2Desc ?? 'Giao hàng 0Đ toàn quốc đơn từ 0Đ',
        trustBadge3Title: siteConfig.trustBadge3Title ?? prev.trustBadge3Title ?? 'Đổi Trả Dễ Dàng',
        trustBadge3Desc: siteConfig.trustBadge3Desc ?? prev.trustBadge3Desc ?? 'Đổi trả miễn phí trong 15 ngày',
        trustBadge4Title: siteConfig.trustBadge4Title ?? prev.trustBadge4Title ?? 'Hỗ Trợ 24/7',
        trustBadge4Desc: siteConfig.trustBadge4Desc ?? prev.trustBadge4Desc ?? 'Đội ngũ tư vấn tận tình chu đáo',
        footerAddress: siteConfig.footerAddress ?? prev.footerAddress ?? 'Trụ sở chính: Tòa nhà Landmark, 720A Điện Biên Phủ, TP. Hồ Chí Minh & Hà Nội',
        footerCopyright: siteConfig.footerCopyright ?? prev.footerCopyright ?? '© 2026 VIETSHOP - Siêu Thị Trực Tuyến Hàng Đầu. Tất cả các quyền được bảo lưu.'
      }));
    }
  }, [siteConfig]);

  // Add Product Form State
  const [newProd, setNewProd] = useState<Partial<Product>>({
    name: '',
    price: 199000,
    originalPrice: 299000,
    category: categories[0]?.id || 'fashion_men',
    categoryName: categories[0]?.name || 'Thời Trang Nam',
    stock: 100,
    rating: 5.0,
    soldCount: 128,
    soldCountDisplay: '128',
    reviewCount: 2,
    location: 'Hà Nội',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    description: 'Sản phẩm chính hãng chất lượng cao, bảo hành 12 tháng, đổi trả 15 ngày.',
    isMall: true,
    isFavorite: true,
    isFreeshipXtra: true,
    isFlashSale: false
  });

  // Shipping & Logistics states for new product
  const [newProdWeight, setNewProdWeight] = useState<number>(350);
  const [newProdLength, setNewProdLength] = useState<number>(25);
  const [newProdWidth, setNewProdWidth] = useState<number>(15);
  const [newProdHeight, setNewProdHeight] = useState<number>(8);
  const [newProdFreeShipByShop, setNewProdFreeShipByShop] = useState<boolean>(false);
  const [newProdAllowedCarriers, setNewProdAllowedCarriers] = useState<string[]>(['spx', 'ghn', 'vtp', 'jt']);

  // Custom Reviews for New Product (1, 2 or more reviews)
  const [newProdReviews, setNewProdReviews] = useState<ProductReview[]>([
    {
      id: 'rev-init-1',
      userName: 'Nguyễn Thu Hà',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      date: 'Hôm qua',
      variation: 'Màu Đen - Size L',
      comment: 'Sản phẩm đóng gói rất cẩn thận, giao hàng siêu nhanh. Chất liệu chuẩn đẹp đúng như mô tả, mặc lên form rất tôn dáng. 5 sao cho shop!',
      likes: 12
    },
    {
      id: 'rev-init-2',
      userName: 'Trần Minh Quân',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      date: '3 ngày trước',
      variation: 'Màu Trắng - Size XL',
      comment: 'Mua lần thứ 2 của shop rồi vẫn cực kỳ hài lòng. Nhân viên tư vấn nhiệt tình, hàng chính hãng nguyên tem mác. Sẽ tiếp tục ủng hộ dài dài!',
      likes: 8
    }
  ]);

  const handleAddNewReview = () => {
    const newRev: ProductReview = {
      id: 'rev-' + Date.now().toString().slice(-6),
      userName: 'Khách hàng thân thiết',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      date: 'Vừa xong',
      variation: newProdColors[0] ? `Màu ${newProdColors[0]} - Size ${newProdSizes[0] || 'M'}` : undefined,
      comment: 'Giao hàng nhanh, hàng đúng như quảng cáo, rất đáng tiền!',
      likes: 1
    };
    setNewProdReviews(prev => [...prev, newRev]);
  };

  const handleUpdateReview = (idx: number, field: keyof ProductReview, value: any) => {
    setNewProdReviews(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleRemoveReview = (idx: number) => {
    setNewProdReviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handlePopulatePresetReviews = () => {
    setNewProdReviews([
      {
        id: 'rev-p1-' + Date.now(),
        userName: 'Nguyễn Thu Hà',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        rating: 5,
        date: 'Hôm qua',
        variation: newProdColors[0] ? `Màu ${newProdColors[0]} - Size ${newProdSizes[0] || 'M'}` : 'Màu Đen - Size L',
        comment: 'Sản phẩm đóng gói rất cẩn thận, giao hàng siêu nhanh. Chất liệu chuẩn đẹp đúng như mô tả, mặc lên form rất tôn dáng. 5 sao cho shop!',
        likes: 15
      },
      {
        id: 'rev-p2-' + Date.now(),
        userName: 'Trần Minh Quân',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        rating: 5,
        date: '3 ngày trước',
        variation: newProdColors[1] ? `Màu ${newProdColors[1]} - Size ${newProdSizes[1] || 'XL'}` : 'Màu Trắng - Size XL',
        comment: 'Mua lần thứ 2 của shop rồi vẫn cực kỳ hài lòng. Nhân viên tư vấn nhiệt tình, hàng chính hãng nguyên tem mác. Sẽ tiếp tục ủng hộ dài dài!',
        likes: 9
      }
    ]);
  };

  // Add Product Media & Variations State (4 images & 1 video, size & color)
  const [newProdImages, setNewProdImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    '',
    '',
    ''
  ]);
  const [newProdVideo, setNewProdVideo] = useState<string>('');
  const [newProdColors, setNewProdColors] = useState<string[]>(['Đen', 'Trắng']);
  const [newProdSizes, setNewProdSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [newColorInput, setNewColorInput] = useState<string>('');
  const [newSizeInput, setNewSizeInput] = useState<string>('');

  // Password visibility states
  const [showSellerPassword, setShowSellerPassword] = useState<boolean>(false);
  const [showNewPasswordInput, setShowNewPasswordInput] = useState<boolean>(false);

  const handleNewProdImageSlotChange = (index: number, val: string) => {
    setNewProdImages(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleNewProdImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          handleNewProdImageSlotChange(index, ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewProdVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setNewProdVideo(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // New Voucher Form State
  const [newVoucherData, setNewVoucherData] = useState<Partial<Voucher>>({
    code: 'SHOP',
    title: 'Giảm 20K Cho Đơn Từ 100K',
    description: 'Mã giảm giá độc quyền từ Shop',
    type: 'discount_amount',
    value: 20000,
    minOrder: 100000,
    maxDiscount: 20000,
    expiry: 'Còn 7 ngày',
    totalCount: 1000
  });

  // Settings State
  const [settingsForm, setSettingsForm] = useState<ShopSettings>({ ...shopSettings });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Analytics
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  const totalItemsSold = products.reduce((sum, p) => sum + p.soldCount, 0);

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategoryFilter === 'all' || p.category === selectedCategoryFilter;
    const matchSearch = !searchQuery.trim() || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Filter orders
  const filteredOrders = orders.filter(o => {
    if (orderFilterStatus === 'all') return true;
    return o.status === orderFilterStatus;
  });

  // Quick Inline Edit Price / Stock
  const handleInlineUpdate = (product: Product, field: 'price' | 'stock', value: number) => {
    const updated: Product = {
      ...product,
      [field]: value,
      discountPercent: field === 'price' && product.originalPrice > value
        ? Math.round(((product.originalPrice - value) / product.originalPrice) * 100)
        : product.discountPercent
    };
    onUpdateProduct(updated);
    showNotification(`Đã cập nhật ${field === 'price' ? 'giá' : 'tồn kho'} sản phẩm #${product.id}`);
  };

  // Handle Add Product Submit
  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name?.trim()) {
      alert('Vui lòng nhập tên sản phẩm!');
      return;
    }

    const foundCat = categories.find(c => c.id === newProd.category);
    const orig = Number(newProd.originalPrice) || Number(newProd.price) || 100000;
    const sale = Number(newProd.price) || 100000;
    const discount = orig > sale ? Math.round(((orig - sale) / orig) * 100) : 0;

    const validImages = newProdImages.filter(img => img && img.trim() !== '');
    const mainImg = validImages[0] || newProd.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';

    const variations: ProductVariationGroup[] = [];
    if (newProdColors.length > 0) {
      variations.push({
        name: 'Màu sắc',
        options: newProdColors.map((c, i) => ({ id: `col-${i}`, label: c }))
      });
    }
    if (newProdSizes.length > 0) {
      variations.push({
        name: 'Kích cỡ',
        options: newProdSizes.map((s, i) => ({ id: `sz-${i}`, label: s }))
      });
    }

    const soldNum = Number(newProd.soldCount) || 0;
    const soldDisplay = newProd.soldCountDisplay?.trim() || (soldNum >= 1000 ? (soldNum / 1000).toFixed(1) + 'k' : soldNum.toString());
    const finalRating = Number(newProd.rating) || 5.0;
    const finalReviews = newProdReviews.filter(r => r.comment.trim() !== '' || r.userName.trim() !== '');
    const finalReviewCount = Number(newProd.reviewCount) || (finalReviews.length > 0 ? finalReviews.length : 1);

    const created: Product = {
      id: 'sp-' + Date.now().toString().slice(-6),
      name: newProd.name,
      price: sale,
      originalPrice: orig,
      discountPercent: discount,
      image: mainImg,
      gallery: validImages.length > 0 ? validImages : [mainImg],
      videoUrl: newProdVideo.trim() ? newProdVideo.trim() : undefined,
      variations: variations.length > 0 ? variations : undefined,
      category: newProd.category || 'fashion_men',
      categoryName: foundCat ? foundCat.name : 'Thời Trang Nam',
      rating: finalRating,
      reviewCount: finalReviewCount,
      soldCount: soldNum,
      soldCountDisplay: soldDisplay,
      reviews: finalReviews.length > 0 ? finalReviews : undefined,
      stock: Number(newProd.stock) || 50,
      weight: Number(newProdWeight) || 350,
      dimensions: {
        length: Number(newProdLength) || 25,
        width: Number(newProdWidth) || 15,
        height: Number(newProdHeight) || 8
      },
      shippingConfig: {
        useStandardCarrierRate: true,
        freeShipByShop: newProdFreeShipByShop,
        allowedCarriers: newProdAllowedCarriers
      },
      location: newProd.location || 'Hà Nội',
      isMall: Boolean(newProd.isMall),
      isFavorite: Boolean(newProd.isFavorite),
      isFreeshipXtra: Boolean(newProd.isFreeshipXtra),
      isFlashSale: Boolean(newProd.isFlashSale),
      description: newProd.description || 'Mô tả sản phẩm chất lượng cao.',
      shopInfo: {
        id: 'my-shop-01',
        name: shopSettings.shopName,
        avatar: shopSettings.shopAvatar,
        isOfficial: true,
        rating: 4.9,
        responseRate: shopSettings.responseRate,
        responseSpeed: 'trong vài phút',
        joinDate: 'Vừa xong',
        productsCount: products.length + 1,
        followersCount: '10.5k'
      },
      isActive: true,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    onAddProduct(created);
    showNotification(`Đã thêm mới thành công sản phẩm: ${created.name}`);
    setActiveSubTab('products');
  };

  // Duplicate product
  const handleDuplicate = (p: Product) => {
    const dup: Product = {
      ...p,
      id: 'sp-' + Date.now().toString().slice(-6),
      name: p.name + ' (Bản Sao)',
      soldCount: 0,
      soldCountDisplay: '0',
      reviewCount: 0
    };
    onAddProduct(dup);
    showNotification(`Đã nhân bản sản phẩm: ${dup.name}`);
  };

  // Handle Add Voucher
  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoucherData.code?.trim()) return;

    const vc: Voucher = {
      id: 'vc-' + Date.now().toString().slice(-6),
      code: newVoucherData.code.toUpperCase(),
      title: newVoucherData.title || 'Voucher Shop',
      description: newVoucherData.description || 'Giảm giá đơn hàng',
      type: newVoucherData.type || 'discount_amount',
      value: Number(newVoucherData.value) || 20000,
      minOrder: Number(newVoucherData.minOrder) || 100000,
      maxDiscount: Number(newVoucherData.maxDiscount) || 20000,
      expiry: newVoucherData.expiry || 'Còn 7 ngày',
      usedCount: 0,
      totalCount: Number(newVoucherData.totalCount) || 1000,
      isSaved: true
    };

    onAddVoucher(vc);
    showNotification(`Đã tạo mã giảm giá: ${vc.code}`);
    setNewVoucherData({
      code: '',
      title: '',
      description: '',
      value: 20000,
      minOrder: 100000
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner for Seller Center */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-indigo-500/20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={shopSettings.adminAvatar || shopSettings.shopAvatar}
              alt={shopSettings.adminName || shopSettings.shopName}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-indigo-400 shadow-lg shrink-0 bg-indigo-900"
            />
            <button
              onClick={() => setActiveSubTab('shop_settings')}
              className="absolute -bottom-1.5 -right-1.5 p-1 bg-[#ee4d2d] hover:bg-[#d73211] text-white rounded-lg shadow-md cursor-pointer transition border border-white"
              title="Đổi ảnh đại diện & tên quản trị"
            >
              <Camera className="w-3 h-3" />
            </button>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Quản Trị VIETSHOP
              </h1>
              <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1 shadow-sm">
                <ShieldCheck className="w-3 h-3" />
                <span>{shopSettings.adminRoleTitle || (currentRole === 'admin' ? 'Quản Trị Viên Sàn' : 'Người Bán (Seller)')}</span>
              </span>
            </div>
            <p className="text-xs text-indigo-200 mt-1 max-w-xl line-clamp-1">
              Quản trị viên: <span className="font-bold text-white underline decoration-indigo-400 underline-offset-2">{shopSettings.adminName || 'Nguyễn Quản Trị'}</span> • Gian hàng: {shopSettings.shopName}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Sửa Nhanh Hồ Sơ Quản Trị Button */}
          <button
            onClick={() => setActiveSubTab('shop_settings')}
            className="px-3.5 py-2 bg-indigo-800/90 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer border border-indigo-400/40"
            title="Chỉnh sửa tên và ảnh đại diện của quản trị viên"
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-300" />
            <span>Sửa Ảnh & Tên Quản Trị</span>
          </button>
          {/* Quick Role Toggle */}
          {onChangeRole && (
            <div className="bg-white/10 p-1 rounded-xl flex items-center gap-1 text-xs">
              <span className="text-[10px] text-indigo-200 px-1 font-semibold">Vai trò:</span>
              <button
                onClick={() => onChangeRole('seller')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                  currentRole === 'seller' || currentRole === 'vendor' ? 'bg-[#ee4d2d] text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                Người Bán
              </button>
              <button
                onClick={() => onChangeRole('admin')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                  currentRole === 'admin' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                Admin Sàn
              </button>
            </div>
          )}

          {onOpenAiAssistant && (
            <button
              onClick={onOpenAiAssistant}
              className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/25 transition-all cursor-pointer ring-1 ring-white/20"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>AI Trợ Lý Bán Hàng</span>
            </button>
          )}

          <button
            onClick={() => setActiveSubTab('add_product')}
            className="px-3.5 py-2 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Thêm SP</span>
          </button>

          <button
            onClick={onBackToBuyer}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Về Mua Sắm</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="p-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Seller Sub-Nav Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-200/80 flex gap-1 overflow-x-auto custom-scrollbar">
        {[
          { id: 'products', label: '📦 Quản Lý Sản Phẩm', count: products.length },
          { id: 'orders', label: '📋 Quản Lý Đơn Hàng', count: orders.length },
          { 
            id: 'wallet', 
            label: '💰 Ví Doanh Thu & Rút Tiền', 
            count: withdrawals.filter(w => w.status === 'pending').length > 0 
              ? withdrawals.filter(w => w.status === 'pending').length 
              : undefined 
          },
          { id: 'marketing', label: '🎯 Combo & Deal Sốc', count: marketingCampaigns.length },
          { id: 'add_product', label: '➕ Thêm Sản Phẩm' },
          { id: 'vouchers', label: '🎟️ Mã Giảm Giá Shop', count: vouchers.length },
          { id: 'analytics', label: '📊 Doanh Thu & Thống Kê' },
          { id: 'shop_settings', label: '⚙️ Cài Đặt Shop & Vận Chuyển' },
          { id: 'html_export', label: '💻 Mã HTML & Tải File' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as SellerSubTab)}
            className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === tab.id
                ? 'bg-[#ee4d2d] text-white shadow-md shadow-orange-500/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeSubTab === tab.id 
                  ? 'bg-white/20 text-white' 
                  : 'bg-slate-200 text-slate-700'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: PRODUCT MANAGEMENT & INLINE EDITING */}
      {activeSubTab === 'products' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên sản phẩm..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#ee4d2d]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#ee4d2d] font-semibold text-slate-700"
              >
                <option value="all">Tất cả ngành hàng</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <button
                onClick={() => setActiveSubTab('add_product')}
                className="px-4 py-2 bg-[#ee4d2d] text-white text-xs font-bold rounded-xl flex items-center gap-1 shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Thêm Mới</span>
              </button>
            </div>
          </div>

          {/* Product Data Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Sản Phẩm</th>
                  <th className="p-3">Tên Shop Dưới SP (Sửa chữ)</th>
                  <th className="p-3">Danh Mục</th>
                  <th className="p-3">Giá Bán (Sửa nhanh)</th>
                  <th className="p-3">Tồn Kho</th>
                  <th className="p-3">Đã Bán</th>
                  <th className="p-3">Huy Hiệu</th>
                  <th className="p-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map(prod => (
                  <tr key={prod.id} className={`hover:bg-orange-50/30 transition-colors ${prod.isActive === false ? 'opacity-50' : ''}`}>
                    
                    {/* Image & Title */}
                    <td className="p-3">
                      <div className="flex items-center gap-3 min-w-[220px]">
                        <img src={prod.image} alt={prod.name} className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{prod.name}</p>
                          <p className="text-[10px] text-slate-400">ID: #{prod.id} • {prod.location}</p>
                        </div>
                      </div>
                    </td>

                    {/* Tên Shop Dưới SP (Sửa chữ) */}
                    <td className="p-3">
                      <div className="flex items-center gap-1.5 min-w-[150px]">
                        <Store className="w-3.5 h-3.5 text-[#ee4d2d] shrink-0" />
                        <input
                          type="text"
                          defaultValue={prod.shopInfo?.name || 'VIETSHOP Official'}
                          onBlur={(e) => {
                            const val = e.target.value.trim() || 'VIETSHOP Official';
                            onUpdateProduct({
                              ...prod,
                              shopInfo: {
                                ...(prod.shopInfo || {
                                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
                                  location: prod.location || 'TP. Hồ Chí Minh',
                                  rating: 4.9,
                                  responseRate: '99%',
                                  followers: '45.8k',
                                  isOfficial: true
                                }),
                                name: val
                              }
                            });
                            showNotification(`Đã đổi tên shop của "${prod.name}" thành: ${val}`);
                          }}
                          className="w-full px-2 py-1 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#ee4d2d]"
                          title="Nhấp vào để sửa chữ tên shop bên dưới sản phẩm này, nhấn ra ngoài để lưu"
                          placeholder="Tên shop..."
                        />
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-3 text-slate-600 font-semibold whitespace-nowrap">
                      {prod.categoryName}
                    </td>

                    {/* Inline Editable Price */}
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          defaultValue={prod.price}
                          onBlur={(e) => handleInlineUpdate(prod, 'price', Number(e.target.value))}
                          className="w-24 px-2 py-1 text-xs font-bold text-[#ee4d2d] bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#ee4d2d]"
                          title="Nhấp để sửa giá và bấm ra ngoài để lưu"
                        />
                        <span className="text-[10px] text-slate-400">₫</span>
                      </div>
                    </td>

                    {/* Inline Editable Stock */}
                    <td className="p-3">
                      <input
                        type="number"
                        defaultValue={prod.stock}
                        onBlur={(e) => handleInlineUpdate(prod, 'stock', Number(e.target.value))}
                        className="w-16 px-2 py-1 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#ee4d2d]"
                        title="Nhấp để sửa tồn kho"
                      />
                    </td>

                    {/* Sold count */}
                    <td className="p-3 text-slate-700 font-semibold whitespace-nowrap">
                      {prod.soldCountDisplay}
                    </td>

                    {/* Badges */}
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1 max-w-[140px]">
                        {prod.isMall && <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">Chính Hãng</span>}
                        {prod.isFavorite && <span className="text-[9px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold">Yêu thích</span>}
                        {prod.isFlashSale && <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">FlashSale</span>}
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onOpenEditModal(prod)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer"
                          title="Chỉnh sửa chi tiết"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(prod)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                          title="Nhân bản"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            onUpdateProduct({ ...prod, isActive: prod.isActive === false ? true : false });
                            showNotification(`Đã ${prod.isActive === false ? 'hiện' : 'ẩn'} sản phẩm #${prod.id}`);
                          }}
                          className={`p-1.5 rounded-lg cursor-pointer ${
                            prod.isActive === false ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                          title={prod.isActive === false ? 'Bật hiển thị' : 'Tạm ẩn sản phẩm'}
                        >
                          {prod.isActive === false ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${prod.name}"?`)) {
                              onDeleteProduct(prod.id);
                              showNotification(`Đã xóa sản phẩm #${prod.id}`);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ADD NEW PRODUCT FORM */}
      {activeSubTab === 'add_product' && (
        <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-200/80">
          <div className="pb-4 border-b border-slate-100 mb-6">
            <h2 className="text-lg font-black text-slate-900">Thêm Sản Phẩm Mới Lên Sàn VIETSHOP</h2>
            <p className="text-xs text-slate-500 mt-0.5">Điền thông tin và hình ảnh để sản phẩm xuất hiện ngay lập tức trên sàn.</p>
          </div>

          <form onSubmit={handleCreateProductSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
            {/* Left Form (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tên sản phẩm *</label>
                <input
                  type="text"
                  value={newProd.name}
                  onChange={(e) => setNewProd(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ví dụ: Áo Thun Polo Nam Cotton Cao Cấp Co Giãn 4 Chiều..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#ee4d2d] font-semibold text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Danh mục sản phẩm *</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#ee4d2d] font-medium"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nơi gửi hàng (Kho)</label>
                  <input
                    type="text"
                    value={newProd.location}
                    onChange={(e) => setNewProd(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Hà Nội, TP. Hồ Chí Minh..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#ee4d2d]"
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#ee4d2d]">Giá bán khuyến mãi (VNĐ) *</label>
                  <input
                    type="number"
                    value={newProd.price}
                    onChange={(e) => setNewProd(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#ee4d2d] font-black text-sm text-[#ee4d2d]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Giá gốc gạch ngang (VNĐ)</label>
                  <input
                    type="number"
                    value={newProd.originalPrice}
                    onChange={(e) => setNewProd(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#ee4d2d] font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center justify-between">
                    <span>Số lượng tồn kho *</span>
                    <span className="text-[10px] text-emerald-600 font-extrabold bg-emerald-50 px-1.5 py-0.2 rounded">Sẵn hàng</span>
                  </label>
                  <input
                    type="number"
                    value={newProd.stock}
                    onChange={(e) => setNewProd(prev => ({ ...prev, stock: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#ee4d2d] font-black text-slate-900"
                    required
                  />
                </div>
              </div>

              {/* Shipping, Weight, Dimensions & Carrier Rates (Vận chuyển, Tồn kho, Kích thước, Cân nặng, Phí ship do bên vận chuyển quy định) */}
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
                    Tồn kho: {newProd.stock || 0} SP
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
                        {formatWeight(newProdWeight)}
                      </span>
                    </div>
                    <input
                      type="number"
                      min="1"
                      value={newProdWeight}
                      onChange={(e) => setNewProdWeight(Math.max(1, Number(e.target.value) || 1))}
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
                          onClick={() => setNewProdWeight(w)}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                            newProdWeight === w
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
                        Quy đổi: {formatWeight(Math.round((newProdLength * newProdWidth * newProdHeight) / 6))}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5 font-semibold">Dài (cm)</span>
                        <input
                          type="number"
                          min="1"
                          value={newProdLength}
                          onChange={(e) => setNewProdLength(Math.max(1, Number(e.target.value) || 1))}
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-center font-bold text-slate-800 focus:bg-white focus:border-[#ee4d2d]"
                          required
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5 font-semibold">Rộng (cm)</span>
                        <input
                          type="number"
                          min="1"
                          value={newProdWidth}
                          onChange={(e) => setNewProdWidth(Math.max(1, Number(e.target.value) || 1))}
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-center font-bold text-slate-800 focus:bg-white focus:border-[#ee4d2d]"
                          required
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5 font-semibold">Cao (cm)</span>
                        <input
                          type="number"
                          min="1"
                          value={newProdHeight}
                          onChange={(e) => setNewProdHeight(Math.max(1, Number(e.target.value) || 1))}
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-center font-bold text-slate-800 focus:bg-white focus:border-[#ee4d2d]"
                          required
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Quy chuẩn: Dài × Rộng × Cao ({newProdLength} × {newProdWidth} × {newProdHeight} cm)
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
                        checked={newProdFreeShipByShop}
                        onChange={(e) => setNewProdFreeShipByShop(e.target.checked)}
                        className="rounded text-[#ee4d2d] focus:ring-orange-400 cursor-pointer"
                      />
                      <span className="font-semibold text-slate-700">Shop tài trợ Freeship cho khách</span>
                    </label>
                  </div>

                  {/* Live Carrier Rates Estimated Preview */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {CARRIER_OPTIONS.map(carrier => {
                      const estimatedFee = newProdFreeShipByShop ? 0 : calculateCarrierFee(
                        carrier.id,
                        newProdWeight,
                        { length: newProdLength, width: newProdWidth, height: newProdHeight }
                      );
                      const isSelected = newProdAllowedCarriers.includes(carrier.id);

                      return (
                        <div
                          key={carrier.id}
                          onClick={() => {
                            setNewProdAllowedCarriers(prev => 
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
                            {newProdFreeShipByShop ? (
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

              {/* 4 Image Slots (Tối đa 4 ảnh từ máy hoặc link mạng) */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 pb-2">
                  <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Image className="w-4 h-4 text-blue-600" />
                    <span>Thư Viện 4 Hình Ảnh Sản Phẩm (Tối đa 4 ảnh)</span>
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Tải từ máy tính/điện thoại hoặc dán link online
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {[0, 1, 2, 3].map((slotIdx) => {
                    const imgVal = newProdImages[slotIdx] || '';
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
                              onClick={() => handleNewProdImageSlotChange(slotIdx, '')}
                              className="text-red-500 hover:text-red-700 font-bold text-[10px] flex items-center gap-0.5 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" /> Xóa
                            </button>
                          )}
                        </div>

                        <div className="flex gap-2 items-center">
                          <div className="w-14 h-14 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 shrink-0 overflow-hidden flex items-center justify-center relative">
                            {imgVal ? (
                              <img src={imgVal} alt={`slot-${slotIdx}`} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[10px] text-slate-400 font-medium text-center px-1">Chưa có</span>
                            )}
                          </div>

                          <div className="flex-1 space-y-1.5">
                            <label className="w-full py-1.5 px-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer transition text-[11px]">
                              <Upload className="w-3.5 h-3.5 text-blue-600" />
                              <span>Tải Từ Máy / ĐT</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => handleNewProdImageUpload(slotIdx, e)} 
                                className="hidden" 
                              />
                            </label>

                            <input
                              type="text"
                              value={imgVal}
                              onChange={(e) => handleNewProdImageSlotChange(slotIdx, e.target.value)}
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

              {/* 1 Video Slot (Tải từ máy hoặc link mạng) */}
              <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-3">
                <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                  <h3 className="font-bold text-purple-950 text-xs flex items-center gap-1.5">
                    <Film className="w-4 h-4 text-purple-600" />
                    <span>Video Giới Thiệu Sản Phẩm (1 Video)</span>
                  </h3>
                  {newProdVideo && (
                    <button
                      type="button"
                      onClick={() => setNewProdVideo('')}
                      className="text-red-500 hover:text-red-700 font-bold text-[10px] flex items-center gap-0.5 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Xóa Video
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                  <div className="space-y-2">
                    <label className="text-slate-700 font-bold block text-[11px]">
                      Tải video từ máy (.mp4, .webm, .mov) hoặc dán link online:
                    </label>
                    <div className="flex gap-2">
                      <label className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition shrink-0 text-xs">
                        <Video className="w-3.5 h-3.5" />
                        <span>Tải Video Từ Máy</span>
                        <input 
                          type="file" 
                          accept="video/*" 
                          onChange={handleNewProdVideoUpload} 
                          className="hidden" 
                        />
                      </label>
                    </div>

                    <input
                      type="text"
                      value={newProdVideo}
                      onChange={(e) => setNewProdVideo(e.target.value)}
                      placeholder="Dán đường dẫn link video (https://...mp4, webm...)"
                      className="w-full px-3 py-2 bg-white border border-purple-300 rounded-xl text-xs focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    {newProdVideo ? (
                      <div className="p-2 bg-slate-900 rounded-xl">
                        <p className="text-[10px] text-purple-300 font-bold mb-1 flex items-center gap-1">
                          <Play className="w-3 h-3 text-purple-400" /> Khung xem thử Video:
                        </p>
                        <video 
                          src={newProdVideo} 
                          controls 
                          className="w-full h-28 rounded-lg object-contain bg-black"
                        >
                          Trình duyệt không hỗ trợ thẻ video.
                        </video>
                      </div>
                    ) : (
                      <div className="h-28 border-2 border-dashed border-purple-300 rounded-xl bg-purple-50/40 flex flex-col items-center justify-center text-purple-400 gap-1 p-2 text-center">
                        <Video className="w-5 h-5 stroke-1" />
                        <span className="text-[11px] font-medium">Chưa có video giới thiệu</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Variations: Size & Color */}
              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-4">
                <div className="border-b border-amber-200 pb-2">
                  <h3 className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-amber-600" />
                    <span>Mục Kích Cỡ (Size) & Màu Sắc Sản Phẩm</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Tạo tùy chọn để người mua dễ dàng lựa chọn kích cỡ và màu sắc ưng ý
                  </p>
                </div>

                {/* Colors */}
                <div className="bg-white p-3 rounded-xl border border-amber-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                      <Palette className="w-3.5 h-3.5 text-pink-500" />
                      <span>1. Nhóm Màu Sắc ({newProdColors.length} màu)</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {['Đen', 'Trắng', 'Xám', 'Xanh Navy', 'Đỏ Đô', 'Vàng', 'Hồng', 'Be'].map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          if (!newProdColors.includes(preset)) {
                            setNewProdColors(prev => [...prev, preset]);
                          }
                        }}
                        className={`px-2 py-0.5 rounded-lg border text-[11px] font-medium transition cursor-pointer ${
                          newProdColors.includes(preset)
                            ? 'bg-pink-100 text-pink-700 border-pink-300 font-bold'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={newColorInput}
                      onChange={(e) => setNewColorInput(e.target.value)}
                      placeholder="Hoặc tự nhập màu sắc khác..."
                      className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const trimmed = newColorInput.trim();
                        if (trimmed && !newProdColors.includes(trimmed)) {
                          setNewProdColors(prev => [...prev, trimmed]);
                          setNewColorInput('');
                        }
                      }}
                      className="px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Thêm
                    </button>
                  </div>

                  {newProdColors.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {newProdColors.map(c => (
                        <span key={c} className="px-2.5 py-0.5 bg-pink-50 border border-pink-200 text-pink-800 rounded-lg font-bold text-xs flex items-center gap-1">
                          <span>{c}</span>
                          <button
                            type="button"
                            onClick={() => setNewProdColors(prev => prev.filter(x => x !== c))}
                            className="hover:text-red-600 text-slate-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sizes */}
                <div className="bg-white p-3 rounded-xl border border-amber-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                      <Ruler className="w-3.5 h-3.5 text-blue-500" />
                      <span>2. Nhóm Kích Cỡ (Size) ({newProdSizes.length} size)</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {['S', 'M', 'L', 'XL', '2XL', '3XL', 'Freesize', '39', '40', '41', '42'].map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          if (!newProdSizes.includes(preset)) {
                            setNewProdSizes(prev => [...prev, preset]);
                          }
                        }}
                        className={`px-2 py-0.5 rounded-lg border text-[11px] font-medium transition cursor-pointer ${
                          newProdSizes.includes(preset)
                            ? 'bg-blue-100 text-blue-700 border-blue-300 font-bold'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={newSizeInput}
                      onChange={(e) => setNewSizeInput(e.target.value)}
                      placeholder="Hoặc tự nhập kích cỡ khác..."
                      className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const trimmed = newSizeInput.trim();
                        if (trimmed && !newProdSizes.includes(trimmed)) {
                          setNewProdSizes(prev => [...prev, trimmed]);
                          setNewSizeInput('');
                        }
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Thêm
                    </button>
                  </div>

                  {newProdSizes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {newProdSizes.map(s => (
                        <span key={s} className="px-2.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg font-bold text-xs flex items-center gap-1">
                          <span>{s}</span>
                          <button
                            type="button"
                            onClick={() => setNewProdSizes(prev => prev.filter(x => x !== s))}
                            className="hover:text-red-600 text-slate-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Badges Checkboxes */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="font-bold text-slate-800 block">Thiết Lập Ưu Đãi & Huy Hiệu</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProd.isMall}
                      onChange={(e) => setNewProd(prev => ({ ...prev, isMall: e.target.checked }))}
                      className="w-4 h-4 text-red-600 rounded"
                    />
                    <span className="font-semibold text-red-600">Hàng Chính Hãng</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProd.isFavorite}
                      onChange={(e) => setNewProd(prev => ({ ...prev, isFavorite: e.target.checked }))}
                      className="w-4 h-4 text-orange-600 rounded"
                    />
                    <span className="font-semibold text-orange-600">Yêu Thích+</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProd.isFreeshipXtra}
                      onChange={(e) => setNewProd(prev => ({ ...prev, isFreeshipXtra: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="font-semibold text-emerald-600">Freeship Xtra</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProd.isFlashSale}
                      onChange={(e) => setNewProd(prev => ({ ...prev, isFlashSale: e.target.checked }))}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span className="font-semibold text-amber-600">Flash Sale</span>
                  </label>
                </div>
              </div>

              {/* Star Rating (*) & Sold Count Settings */}
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-3">
                <div className="border-b border-amber-200 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h3 className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                      <span>Thiết Lập Số Sao (*) & Số Lượng Bán (Đã Bán)</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Tùy chỉnh số sao uy tín và số lượng đã bán để hiển thị nổi bật trên thẻ sản phẩm & trang chi tiết
                    </p>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full shrink-0">
                    Tăng tỷ lệ chốt đơn
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
                      <span className="text-[#ee4d2d] font-black text-sm">{Number(newProd.rating) || 5.0} ⭐</span>
                    </label>
                    
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      value={newProd.rating ?? 5.0}
                      onChange={(e) => {
                        const val = Math.min(5, Math.max(1, parseFloat(e.target.value) || 5.0));
                        setNewProd(prev => ({ ...prev, rating: val }));
                      }}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-amber-500"
                    />

                    {/* Quick Rating Presets */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {[5.0, 4.9, 4.8, 4.7].map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setNewProd(prev => ({ ...prev, rating: r }))}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
                            newProd.rating === r
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
                      <span className="text-slate-500 text-[11px]">Thực tế: {newProd.soldCount || 0}</span>
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={newProd.soldCount ?? 128}
                      onChange={(e) => {
                        const num = parseInt(e.target.value, 10) || 0;
                        const disp = num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num.toString();
                        setNewProd(prev => ({ 
                          ...prev, 
                          soldCount: num,
                          soldCountDisplay: disp
                        }));
                      }}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-amber-500"
                    />

                    {/* Quick Sold Presets */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {[50, 128, 520, 1200, 3500].map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            const disp = s >= 1000 ? (s / 1000).toFixed(1) + 'k' : s.toString();
                            setNewProd(prev => ({ 
                              ...prev, 
                              soldCount: s,
                              soldCountDisplay: disp
                            }));
                          }}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
                            newProd.soldCount === s
                              ? 'bg-orange-500 text-white border-orange-600'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-orange-50'
                          }`}
                        >
                          {s >= 1000 ? (s / 1000).toFixed(1) + 'k' : s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chữ hiển thị đã bán (tùy biến) */}
                  <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-2">
                    <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span>Chữ hiển thị "Đã bán"</span>
                      <span className="text-[10px] text-slate-400">Hiển thị thẻ</span>
                    </label>

                    <input
                      type="text"
                      value={newProd.soldCountDisplay ?? '128'}
                      onChange={(e) => setNewProd(prev => ({ ...prev, soldCountDisplay: e.target.value }))}
                      placeholder="VD: 128 hoặc 1.2k hoặc 3.5k đã bán"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-amber-500 font-semibold"
                    />

                    <p className="text-[10px] text-slate-400">
                      Sẽ hiển thị: "Đã bán {newProd.soldCountDisplay || newProd.soldCount || 0}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Reviews Section */}
              <div className="p-4 bg-orange-50/70 rounded-2xl border border-orange-200 space-y-3">
                <div className="border-b border-orange-200 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-orange-950 text-xs flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-orange-600" />
                      <span>Nhận Xét & Đánh Giá Của Khách Hàng ({newProdReviews.length} nhận xét)</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Tự thêm 1, 2 hoặc nhiều nhận xét thực tế kèm số sao để hiển thị nổi bật dưới sản phẩm
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handlePopulatePresetReviews}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[11px] font-bold flex items-center gap-1 shadow-xs transition cursor-pointer"
                      title="Nạp nhanh 2 nhận xét 5 sao mẫu"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Nạp Mẫu 2 Nhận Xét 5★</span>
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

                {/* Review Items */}
                <div className="space-y-3">
                  {newProdReviews.map((rev, rIdx) => (
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
                          {/* Rating Stars Selector */}
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
                        {/* Tên khách hàng */}
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

                        {/* Ngày đánh giá */}
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

                        {/* Phân loại đã mua */}
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

                      {/* Nội dung bình luận */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                          <span>Nội dung nhận xét của khách:</span>
                          <span className="text-[10px] text-slate-400">Hiển thị ở mục Đánh giá sản phẩm</span>
                        </label>
                        <textarea
                          rows={2}
                          value={rev.comment}
                          onChange={(e) => handleUpdateReview(rIdx, 'comment', e.target.value)}
                          placeholder="Nhập lời khen, cảm nhận chất lượng, giao hàng..."
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-orange-500 leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}

                  {newProdReviews.length === 0 && (
                    <div className="p-4 bg-white rounded-xl border-2 border-dashed border-orange-200 text-center space-y-2">
                      <p className="text-xs text-slate-500">Chưa có nhận xét nào. Thêm nhận xét giúp sản phẩm uy tín hơn rất nhiều!</p>
                      <button
                        type="button"
                        onClick={handlePopulatePresetReviews}
                        className="px-3 py-1.5 bg-orange-100 text-orange-700 font-bold text-xs rounded-xl hover:bg-orange-200 transition cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Nạp ngay 2 nhận xét 5 sao mẫu</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Mô tả sản phẩm</label>
                <textarea
                  rows={4}
                  value={newProd.description}
                  onChange={(e) => setNewProd(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#ee4d2d]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] hover:from-[#d73211] text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-5 h-5" />
                <span>ĐĂNG BÁN SẢN PHẨM NGAY</span>
              </button>

            </div>

            {/* Right: Live Preview Card (4 cols) */}
            <div className="lg:col-span-4 space-y-3">
              <label className="font-bold text-slate-700 block">Xem Trước Thẻ Sản Phẩm (Live Preview)</label>
              <div className="bg-white rounded-2xl border-2 border-orange-200 p-3 shadow-md space-y-2">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={newProdImages[0] || newProd.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  {newProd.isMall && (
                    <span className="absolute top-2 left-2 bg-[#ee4d2d] text-white text-[8px] font-black px-1.5 py-0.5 rounded">
                      Chính Hãng
                    </span>
                  )}
                  {Number(newProd.originalPrice) > Number(newProd.price) && (
                    <span className="absolute top-0 right-0 bg-yellow-400 text-red-600 text-[10px] font-black px-1.5 py-0.5 rounded-bl-lg">
                      -{Math.round(((Number(newProd.originalPrice) - Number(newProd.price)) / Number(newProd.originalPrice)) * 100)}%
                    </span>
                  )}
                </div>

                {/* Media indicators */}
                <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1 font-semibold text-blue-600">
                    <Image className="w-3.5 h-3.5" /> {newProdImages.filter(x => x.trim()).length} ảnh
                  </span>
                  {newProdVideo.trim() && (
                    <span className="flex items-center gap-1 font-semibold text-purple-600">
                      <Film className="w-3.5 h-3.5" /> Có Video
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-slate-800 line-clamp-2">
                  {newProd.name || 'Tên sản phẩm mẫu...'}
                </h4>

                <div className="flex items-baseline gap-2">
                  <span className="text-base font-black text-[#ee4d2d]">
                    {formatVND(Number(newProd.price) || 0)}
                  </span>
                  {Number(newProd.originalPrice) > Number(newProd.price) && (
                    <span className="text-xs text-slate-400 line-through">
                      {formatVND(Number(newProd.originalPrice) || 0)}
                    </span>
                  )}
                </div>

                {/* Variations Preview */}
                {(newProdColors.length > 0 || newProdSizes.length > 0) && (
                  <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px]">
                    {newProdColors.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-slate-400 font-medium">Màu:</span>
                        {newProdColors.slice(0, 3).map(c => (
                          <span key={c} className="px-1.5 py-0.2 bg-pink-50 text-pink-700 rounded text-[10px] font-bold">
                            {c}
                          </span>
                        ))}
                        {newProdColors.length > 3 && <span className="text-slate-400 text-[10px]">+{newProdColors.length - 3}</span>}
                      </div>
                    )}
                    {newProdSizes.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-slate-400 font-medium">Size:</span>
                        {newProdSizes.slice(0, 4).map(s => (
                          <span key={s} className="px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded text-[10px] font-bold">
                            {s}
                          </span>
                        ))}
                        {newProdSizes.length > 4 && <span className="text-slate-400 text-[10px]">+{newProdSizes.length - 4}</span>}
                      </div>
                    )}
                  </div>
                )}

                {/* Rating & Sold live preview */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-700">{Number(newProd.rating) || 5.0}</span>
                    <span className="text-slate-400 text-[10px]">({newProdReviews.length} đánh giá)</span>
                  </div>
                  <span className="font-semibold text-slate-700">Đã bán {newProd.soldCountDisplay || newProd.soldCount || 0}</span>
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                  <span>Kho: {newProd.location || 'Hà Nội'}</span>
                  <span>Tồn: {newProd.stock || 0}</span>
                </div>
              </div>

              {/* Live Reviews Preview Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-orange-500" />
                    <span>Xem Trước Nhận Xét ({newProdReviews.length})</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                    Hiển thị ở trang chi tiết
                  </span>
                </div>

                {newProdReviews.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-2">Chưa thêm nhận xét nào</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                    {newProdReviews.map((rev, idx) => (
                      <div key={rev.id || idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <img src={rev.userAvatar} alt={rev.userName} className="w-6 h-6 rounded-full object-cover" />
                            <span className="font-bold text-slate-800 text-[11px]">{rev.userName}</span>
                          </div>
                          <div className="flex text-amber-400">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-2.5 h-2.5 fill-current" />
                            ))}
                          </div>
                        </div>
                        {rev.variation && (
                          <div className="text-[10px] text-slate-400">Phân loại: {rev.variation}</div>
                        )}
                        <p className="text-[11px] text-slate-600 line-clamp-2">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TAB: SITE MANAGEMENT & COMPREHENSIVE EDITOR */}
      {activeSubTab === 'site_content' && (
        <SiteManagementView
          siteConfig={siteConfigForm}
          shopSettings={shopSettings}
          categories={categories}
          onSaveSiteConfig={(newCfg) => {
            setSiteConfigForm(newCfg);
            if (onUpdateSiteConfig) {
              onUpdateSiteConfig(newCfg);
            }
            showNotification('Đã cập nhật toàn bộ nội dung và cấu hình trang web!');
          }}
          onUpdateShopSettings={onUpdateShopSettings}
          onUpdateCategories={(newCats) => {
            if (onUpdateCategories) {
              onUpdateCategories(newCats);
            }
            showNotification('Đã cập nhật danh mục ngành hàng thành công!');
          }}
          onPreviewBuyerMode={onBackToBuyer}
        />
      )}
      {activeSubTab === 'orders' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900">Danh Sách Đơn Hàng Cần Xử Lý</h2>
              <p className="text-xs text-slate-500">Cập nhật trạng thái giao hàng và theo dõi đơn từ người mua.</p>
            </div>

            {/* Status Filter */}
            <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'pending', label: 'Chờ xác nhận' },
                { id: 'processing', label: 'Đang chuẩn bị' },
                { id: 'shipping', label: 'Đang giao' },
                { id: 'delivered', label: 'Đã giao' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setOrderFilterStatus(st.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                    orderFilterStatus === st.id ? 'bg-[#ee4d2d] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.map(order => {
              const badge = getStatusBadgeInfo(order.status);
              return (
                <div key={order.id} className="p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3 bg-slate-50/50">
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900">Mã đơn: #{order.orderCode}</span>
                      <span className="text-slate-400">• {order.createdAt}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="text-xs text-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-400">Khách hàng:</span> <strong className="text-slate-900">{order.customerInfo.name}</strong> ({order.customerInfo.phone})
                    </div>
                    <div>
                      <span className="text-slate-400">Địa chỉ:</span> {order.customerInfo.address}, {order.customerInfo.city}
                    </div>
                  </div>

                  {/* Items in order */}
                  <div className="space-y-1.5 text-xs">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between items-center py-1">
                        <div className="flex items-center gap-2">
                          <img src={item.product.image} alt={item.product.name} className="w-8 h-8 rounded-lg object-cover" />
                          <span className="font-medium text-slate-800">{item.product.name} x {item.quantity}</span>
                        </div>
                        <span className="font-bold text-slate-900">{formatVND(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer & Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-200">
                    <div className="text-xs">
                      <span className="text-slate-500">Tổng thanh toán: </span>
                      <strong className="text-[#ee4d2d] text-sm">{formatVND(order.total)}</strong>
                      <span className="text-slate-400 ml-2 font-mono uppercase">({order.paymentMethod})</span>
                    </div>

                    {/* Status Changer Buttons */}
                    <div className="flex gap-1.5">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => {
                            onUpdateOrderStatus(order.id, 'processing');
                            showNotification(`Đã duyệt đơn #${order.orderCode} sang Đang chuẩn bị hàng!`);
                          }}
                          className="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
                        >
                          Duyệt Đơn Hàng
                        </button>
                      )}
                      {order.status === 'processing' && (
                        <button
                          onClick={() => {
                            onUpdateOrderStatus(order.id, 'shipping');
                            showNotification(`Đã giao đơn #${order.orderCode} cho shipper!`);
                          }}
                          className="px-3 py-1.5 bg-purple-600 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
                        >
                          Giao Cho Đơn Vị Vận Chuyển
                        </button>
                      )}
                      {order.status === 'shipping' && (
                        <button
                          onClick={() => {
                            onUpdateOrderStatus(order.id, 'delivered');
                            showNotification(`🎉 Đơn #${order.orderCode} đã giao thành công! +${formatVND(order.total)} đã tự động chuyển vào Ví VIETSHOP của gian hàng!`);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
                        >
                          Xác Nhận Đã Giao Thành Công
                        </button>
                      )}
                      {order.status !== 'cancelled' && order.status !== 'delivered' && (
                        <button
                          onClick={() => {
                            if (confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
                              onUpdateOrderStatus(order.id, 'cancelled');
                              showNotification(`Đã hủy đơn #${order.orderCode}`);
                            }
                          }}
                          className="px-3 py-1.5 bg-slate-200 hover:bg-red-100 text-slate-700 hover:text-red-700 font-bold text-xs rounded-xl cursor-pointer"
                        >
                          Hủy Đơn
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: VOUCHERS MANAGEMENT */}
      {activeSubTab === 'vouchers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Create Voucher Form (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
            <h3 className="font-black text-slate-900 text-base">Tạo Mã Giảm Giá Mới</h3>
            <form onSubmit={handleCreateVoucher} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mã Voucher (Code) *</label>
                <input
                  type="text"
                  value={newVoucherData.code}
                  onChange={(e) => setNewVoucherData(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="SHOP30K, SALE20..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl uppercase font-black text-[#ee4d2d]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tiêu đề khuyến mãi</label>
                <input
                  type="text"
                  value={newVoucherData.title}
                  onChange={(e) => setNewVoucherData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Giảm 30K cho đơn từ 200K"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Loại giảm giá</label>
                  <select
                    value={newVoucherData.type}
                    onChange={(e) => setNewVoucherData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="discount_amount">Số tiền cố định (₫)</option>
                    <option value="discount_percent">Phần trăm (%)</option>
                    <option value="freeship">Miễn phí ship</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mức giảm</label>
                  <input
                    type="number"
                    value={newVoucherData.value}
                    onChange={(e) => setNewVoucherData(prev => ({ ...prev, value: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Đơn hàng tối thiểu (VNĐ)</label>
                <input
                  type="number"
                  value={newVoucherData.minOrder}
                  onChange={(e) => setNewVoucherData(prev => ({ ...prev, minOrder: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#ee4d2d] text-white font-bold rounded-xl shadow-md cursor-pointer"
              >
                Tạo Mã Giảm Giá
              </button>
            </form>
          </div>

          {/* Vouchers List (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
            <h3 className="font-black text-slate-900 text-base">Danh Sách Mã Giảm Giá Đang Hoạt Động ({vouchers.length})</h3>
            <div className="space-y-3">
              {vouchers.map(vc => (
                <div key={vc.id} className="p-3.5 rounded-2xl border border-orange-200 bg-orange-50/40 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-[#ee4d2d] bg-white px-2 py-0.5 rounded-md border border-orange-300">
                        {vc.code}
                      </span>
                      <span className="font-bold text-slate-800">{vc.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{vc.description} • {vc.expiry}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Đã dùng: {vc.usedCount} / {vc.totalCount} lượt</p>
                  </div>
                  <button
                    onClick={() => {
                      onDeleteVoucher(vc.id);
                      showNotification(`Đã xóa voucher ${vc.code}`);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ANALYTICS */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-400 font-bold">Tổng Doanh Thu Cửa Hàng</span>
              <p className="text-2xl font-black text-[#ee4d2d] mt-1">{formatVND(totalRevenue)}</p>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">↑ +18% so với tuần trước</span>
            </div>
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-400 font-bold">Tổng Đơn Hàng</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{orders.length} Đơn</p>
              <span className="text-[11px] text-blue-600 font-semibold mt-1 block">Tỉ lệ hoàn thành 98.5%</span>
            </div>
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-400 font-bold">Lượt Bán Sản Phẩm</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">{totalItemsSold.toLocaleString()} Món</p>
              <span className="text-[11px] text-slate-500 mt-1 block">{products.length} mặt hàng đang hoạt động</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Top Sản Phẩm Bán Chạy Nhất</h3>
            <div className="space-y-3">
              {products.slice(0, 5).map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-[#ee4d2d] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                      <span className="text-[10px] text-slate-400">Đã bán: {p.soldCountDisplay}</span>
                    </div>
                  </div>
                  <span className="font-black text-slate-900">{formatVND(p.price)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SHOP SETTINGS */}
      {activeSubTab === 'shop_settings' && (
        <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-200/80 space-y-6 max-w-3xl">
          <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-black text-slate-900">Cấu Hình Quản Trị & Thông Tin Shop</h2>
              <p className="text-xs text-slate-500">Chỉnh sửa tên và ảnh của Quản trị viên, sửa chữ các shop bên dưới sản phẩm và thương hiệu.</p>
            </div>
            <span className="self-start sm:self-auto px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full font-bold text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Hồ Sơ Quản Trị</span>
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onUpdateShopSettings(settingsForm);
              showNotification('Đã lưu thông tin Quản trị viên và Cửa hàng thành công!');
            }}
            className="space-y-6 text-xs"
          >
            {/* 1. MỤC CHỈNH SỬA ẢNH VÀ TÊN QUẢN TRỊ VIÊN */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-purple-50/50 to-slate-50 border-2 border-indigo-200/90 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-indigo-950 text-sm">1. Sửa Tên & Ảnh Ban Quản Trị</h3>
                    <p className="text-[11px] text-indigo-600/80">Tùy chỉnh họ tên, ảnh đại diện và chức danh của Quản trị viên hiển thị trên hệ thống</p>
                  </div>
                </div>
                <span className="text-[10px] bg-indigo-200 text-indigo-900 font-black px-2 py-0.5 rounded-md">
                  Admin Profile
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Tên Quản Trị Viên */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Tên Quản Trị Viên (Họ và Tên) *
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.adminName ?? 'Nguyễn Quản Trị'}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, adminName: e.target.value }))}
                    placeholder="VD: Nguyễn Quản Trị, Ban Quản Trị VIETSHOP..."
                    className="w-full px-3.5 py-2.5 bg-white border border-indigo-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Hiển thị ở góc trên cùng trang quản trị và dưới tiêu đề sàn
                  </span>
                </div>

                {/* Chức danh Quản Trị */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Chức Danh / Vai Trò Quản Trị
                  </label>
                  <input
                    type="text"
                    value={settingsForm.adminRoleTitle ?? 'Quản Trị Viên Sàn'}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, adminRoleTitle: e.target.value }))}
                    placeholder="VD: Tổng Quản Trị Viên Sàn, Admin Trưởng..."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Huy hiệu phân quyền hiển thị cạnh tên quản trị
                  </span>
                </div>

                {/* Ảnh Đại Diện Quản Trị Viên (Avatar) */}
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-800 block mb-1">
                    Ảnh Đại Diện Quản Trị Viên (Avatar) *
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="relative group shrink-0">
                      <img
                        src={settingsForm.adminAvatar || settingsForm.shopAvatar}
                        alt="Admin Avatar Preview"
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-400 shadow-md bg-indigo-900"
                      />
                      <span className="absolute -bottom-1 -right-1 bg-indigo-600 text-white rounded-md p-0.5 text-[9px] font-bold">
                        Preview
                      </span>
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={settingsForm.adminAvatar ?? ''}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, adminAvatar: e.target.value }))}
                          placeholder="Dán link ảnh URL quản trị (https://...)"
                          className="flex-1 px-3.5 py-2 bg-white border border-indigo-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <label className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Tải Ảnh Từ Máy / ĐT</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  if (event.target?.result) {
                                    setSettingsForm(prev => ({
                                      ...prev,
                                      adminAvatar: event.target?.result as string
                                    }));
                                    showNotification('Đã tải ảnh đại diện quản trị viên!');
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Ảnh mẫu avatar nhanh */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span className="text-[10px] text-slate-500 font-bold">Chọn ảnh mẫu nhanh:</span>
                        {[
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                        ].map((sampleUrl, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSettingsForm(prev => ({ ...prev, adminAvatar: sampleUrl }));
                              showNotification(`Đã chọn ảnh mẫu #${idx + 1}`);
                            }}
                            className="w-7 h-7 rounded-lg overflow-hidden border border-indigo-200 hover:border-indigo-600 transition cursor-pointer"
                          >
                            <img src={sampleUrl} alt="Sample" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. MỤC SỬA CHỮ CÁC SHOP BÊN DƯỚI SẢN PHẨM */}
            <div className="p-5 rounded-2xl bg-amber-50/80 border-2 border-amber-300/80 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-amber-950 text-sm">2. Sửa Chữ Các Shop Bên Dưới Sản Phẩm</h3>
                    <p className="text-[11px] text-amber-700">Đổi chữ tên shop hiển thị bên dưới từng sản phẩm hoặc áp dụng hàng loạt cho tất cả {products.length} sản phẩm</p>
                  </div>
                </div>
                <span className="text-[10px] bg-amber-200 text-amber-900 font-black px-2 py-0.5 rounded-md">
                  Tên Shop Dưới SP
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Tên Shop Cần Đặt Cho Sản Phẩm:
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={settingsForm.shopName}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, shopName: e.target.value }))}
                      placeholder="VD: VIETSHOP Mall, Cửa Hàng Chính Hãng, Shop Xu Hướng..."
                      className="flex-1 px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const targetShopName = settingsForm.shopName.trim() || 'VIETSHOP Official';
                        products.forEach(p => {
                          onUpdateProduct({
                            ...p,
                            shopInfo: {
                              ...(p.shopInfo || {
                                avatar: settingsForm.shopAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
                                location: p.location || 'TP. Hồ Chí Minh',
                                rating: 4.9,
                                responseRate: '99%',
                                followers: '45.8k',
                                isOfficial: true
                              }),
                              name: targetShopName
                            }
                          });
                        });
                        showNotification(`Đã đổi tên shop của tất cả ${products.length} sản phẩm thành: "${targetShopName}"!`);
                      }}
                      className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                      <Check className="w-4 h-4" />
                      <span>Áp Dụng Cho Tất Cả {products.length} Sản Phẩm</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-white/80 rounded-xl border border-amber-200 text-[11px] text-slate-600 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">Mẹo quản lý tên shop:</span> Bạn cũng có thể vào tab <strong className="text-orange-600">"📦 Quản Lý Sản Phẩm"</strong> để chỉnh sửa chữ tên shop của từng sản phẩm riêng biệt ngay tại cột <strong>"Tên Shop Dưới SP (Sửa chữ)"</strong> hoặc bấm nút chỉnh sửa chi tiết.
                  </div>
                </div>
              </div>
            </div>

            {/* 3. MỤC THÔNG TIN THƯƠNG HIỆU GIAN HÀNG CHUNG */}
            <div className="space-y-4 pt-2">
              <h3 className="font-black text-slate-800 text-sm border-b border-slate-200 pb-2">
                3. Thông Tin Thương Hiệu & Điểm Thưởng
              </h3>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Khẩu Hiệu Thương Hiệu / Tagline</label>
                <input
                  type="text"
                  value={settingsForm.shopTagline}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, shopTagline: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Logo / Avatar Cửa Hàng Chung (URL)</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={settingsForm.shopAvatar}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, shopAvatar: e.target.value }))}
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-[11px]"
                  />
                  <img src={settingsForm.shopAvatar} alt="Shop Avatar" className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0" />
                </div>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Số dư VIETSHOP Xu người dùng có sẵn</label>
              <input
                type="number"
                value={settingsForm.coinsBalance}
                onChange={(e) => setSettingsForm(prev => ({ ...prev, coinsBalance: Number(e.target.value) }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-amber-600"
              />
            </div>

            {/* Tax & Bank Information for Payouts */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span>THÔNG TIN THUẾ & TÀI KHOẢN NGÂN HÀNG RÚT TIỀN</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Thông tin được mã hóa bảo mật để đối soát doanh thu và rút tiền tự động qua Napas 24/7.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="font-bold text-slate-700 block text-xs mb-1">Mã Số Thuế / CCCD Gian Hàng</label>
                  <input
                    type="text"
                    value={settingsForm.taxNumber || ''}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, taxNumber: e.target.value }))}
                    placeholder="Ví dụ: 0315889922 hoặc CCCD 12 số"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block text-xs mb-1">Ngân Hàng Thụ Hưởng</label>
                  <input
                    type="text"
                    value={settingsForm.bankName || ''}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, bankName: e.target.value }))}
                    placeholder="Ví dụ: VietinBank, Vietcombank, MB Bank..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block text-xs mb-1">Số Tài Khoản Ngân Hàng</label>
                  <input
                    type="text"
                    value={settingsForm.bankAccountNumber || ''}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, bankAccountNumber: e.target.value }))}
                    placeholder="Ví dụ: 101889977665"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block text-xs mb-1">Tên Chủ Tài Khoản (In hoa không dấu)</label>
                  <input
                    type="text"
                    value={settingsForm.bankAccountHolder || ''}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, bankAccountHolder: e.target.value.toUpperCase() }))}
                    placeholder="Ví dụ: NGUYEN VAN A"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl uppercase font-bold text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Supported Shipping Carriers */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <span>ĐƠN VỊ VẬN CHUYỂN LIÊN KẾT (SPX, GHN, VIETTEL POST...)</span>
                </div>
                <span className="text-[11px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">
                  Lấy Hàng Tận Nơi
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Bật/tắt các hãng vận chuyển bạn muốn giao hàng cho khách. Hệ thống tự động đẩy vận đơn qua API khi người mua chốt đơn.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {[
                  { id: 'SPX Express', name: 'SPX Express', logo: '🚀', note: 'Giao nhanh hỏa tốc' },
                  { id: 'Giao Hàng Nhanh (GHN)', name: 'GHN Logistics', logo: '📦', note: 'Mạng lưới 63 tỉnh' },
                  { id: 'Viettel Post', name: 'Viettel Post', logo: '📮', note: 'Giao vùng xa tốt' },
                  { id: 'J&T Express', name: 'J&T Express', logo: '⚡', note: 'Hỗ trợ COD 24/7' }
                ].map(carrier => {
                  const isChecked = settingsForm.supportedCarriers?.includes(carrier.id) ?? true;
                  return (
                    <div
                      key={carrier.id}
                      onClick={() => {
                        const current = settingsForm.supportedCarriers || ['SPX Express', 'Giao Hàng Nhanh (GHN)', 'Viettel Post'];
                        const next = current.includes(carrier.id)
                          ? current.filter(c => c !== carrier.id)
                          : [...current, carrier.id];
                        setSettingsForm(prev => ({ ...prev, supportedCarriers: next }));
                      }}
                      className={`p-3 rounded-xl border-2 transition-all cursor-pointer select-none ${
                        isChecked 
                          ? 'border-blue-500 bg-blue-50/50' 
                          : 'border-slate-200 bg-slate-50 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg">{carrier.logo}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 text-blue-600 rounded cursor-pointer pointer-events-none"
                        />
                      </div>
                      <div className="font-bold text-slate-900 text-xs mt-2">{carrier.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{carrier.note}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-black text-sm rounded-xl shadow-md cursor-pointer flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Lưu Toàn Bộ Cài Đặt Shop & Mật Khẩu</span>
            </button>
          </form>

          {/* Reset Demo Data */}
          <div className="pt-6 border-t border-red-100 space-y-3">
            <h4 className="font-bold text-red-600 text-sm flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Khôi Phục Dữ Liệu Gốc</span>
            </h4>
            <p className="text-xs text-slate-500">
              Xóa mọi thay đổi tạm thời và tải lại toàn bộ danh sách sản phẩm, đơn hàng, mã giảm giá mẫu của VIETSHOP.
            </p>

            {showResetConfirm ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl space-y-3">
                <p className="text-xs font-bold text-red-700">Bạn có chắc chắn muốn đặt lại toàn bộ dữ liệu về mặc định?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onResetAllData();
                      setShowResetConfirm(false);
                      showNotification('Đã khôi phục toàn bộ dữ liệu demo gốc!');
                    }}
                    className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Đồng Ý Khôi Phục
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Hủy Bỏ
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="px-5 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt Lại Về Dữ Liệu Demo Gốc</span>
              </button>
            )}
          </div>

        </div>
      )}

      {/* TAB: ADMIN SUPERVISION VIEW */}
      {activeSubTab === 'admin_supervision' && (
        <AdminSupervisionView
          applications={applications}
          withdrawals={withdrawals}
          orders={orders}
          products={products}
          onApproveApplication={onApproveApplication || (() => {})}
          onRejectApplication={onRejectApplication || (() => {})}
          onApproveWithdrawal={onApproveWithdrawal || (() => {})}
          onRejectWithdrawal={onRejectWithdrawal || (() => {})}
          onRefreshData={() => showNotification('Đã đồng bộ dữ liệu quản trị mới nhất!')}
        />
      )}

      {/* TAB: WALLET & WITHDRAWAL VIEW */}
      {activeSubTab === 'wallet' && (
        <WalletWithdrawalView
          shopSettings={shopSettings}
          transactions={transactions}
          withdrawals={withdrawals}
          orders={orders}
          onUpdateShopSettings={onUpdateShopSettings}
          onAddTransaction={onAddTransaction || (() => {})}
          onAddWithdrawal={onAddWithdrawal || (() => {})}
        />
      )}

      {/* TAB: MARKETING VIEW */}
      {activeSubTab === 'marketing' && (
        <SellerMarketingView
          campaigns={marketingCampaigns}
          products={products}
          onAddCampaign={onAddMarketingCampaign || (() => {})}
          onToggleCampaign={onToggleMarketingCampaign || (() => {})}
          onDeleteCampaign={onDeleteMarketingCampaign || (() => {})}
        />
      )}

      {/* HTML Code & Download Tab */}
      {activeSubTab === 'html_export' && (
        <HtmlExportView
          products={products}
          categories={categories}
          vouchers={vouchers}
          siteConfig={siteConfig}
          shopSettings={shopSettings}
        />
      )}

    </div>
  );
};
