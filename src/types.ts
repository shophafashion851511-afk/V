export interface ProductVariationOption {
  id: string;
  label: string;
  priceDelta?: number;
  stock?: number;
  image?: string;
}

export interface ProductVariationGroup {
  name: string; // e.g. "Màu sắc", "Kích cỡ", "Phân loại"
  options: ProductVariationOption[];
}

export interface ShopInfo {
  id: string;
  name: string;
  avatar: string;
  isOfficial: boolean;
  rating: number;
  responseRate: string;
  responseSpeed: string;
  joinDate: string;
  productsCount: number;
  followersCount: string;
}

export interface ProductReview {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  variation?: string;
  images?: string[];
  likes: number;
}

export interface ProductDimensions {
  length: number; // cm
  width: number;  // cm
  height: number; // cm
}

export interface ProductShippingConfig {
  carrierId?: string;
  carrierName?: string;
  carrierFee?: number;
  useStandardCarrierRate?: boolean;
  freeShipByShop?: boolean;
  allowedCarriers?: string[];
}

export interface CustomerUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  provider: 'google' | 'facebook' | 'phone';
  createdAt: string;
  address?: string;
  city?: string;
}

export interface OrderTimelineStep {
  status: string;
  title: string;
  description: string;
  time?: string;
  completed: boolean;
  current?: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  image: string;
  gallery: string[];
  videoUrl?: string;
  videoThumbnail?: string;
  category: string;
  categoryName: string;
  rating: number;
  reviewCount: number;
  soldCount: number;
  soldCountDisplay: string;
  stock: number;
  location: string;
  isMall: boolean;
  isFavorite: boolean;
  isFreeshipXtra: boolean;
  isFlashSale: boolean;
  flashSaleStockTotal?: number;
  flashSaleSold?: number;
  description: string;
  specifications?: Record<string, string>;
  variations?: ProductVariationGroup[];
  reviews?: ProductReview[];
  shopInfo: ShopInfo;
  tags?: string[];
  isActive?: boolean;
  updatedAt?: string;
  // Shipping, stock & package parameters
  dimensions?: ProductDimensions;
  weight?: number; // Cân nặng đóng gói (gram)
  shippingConfig?: ProductShippingConfig;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  itemCount: number;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedVariations: Record<string, string>;
  quantity: number;
  price: number;
  selected: boolean;
}

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  type: 'freeship' | 'discount_percent' | 'discount_amount' | 'coin_back';
  value: number;
  minOrder: number;
  maxDiscount?: number;
  expiry: string;
  usedCount: number;
  totalCount: number;
  isSaved?: boolean;
}

export type OrderStatus = 'pending' | 'processing' | 'shipping' | 'delivered' | 'cancelled' | 'refund_pending' | 'refunded';

export type UserRole = 'customer' | 'seller' | 'vendor' | 'admin';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  shopId?: string;
  createdAt: string;
}

export interface SellerRegistrationApplication {
  id: string;
  userId: string;
  applicantName: string;
  phone: string;
  email: string;
  shopName: string;
  taxOrIdNumber: string; // Mã số thuế / CCCD
  bankName: string; // Tên ngân hàng
  bankAccountNumber: string; // Số tài khoản ngân hàng
  bankAccountHolder: string; // Tên chủ tài khoản
  warehouseAddress: string; // Địa chỉ kho lấy hàng
  businessCategory: string; // Ngành hàng kinh doanh chính
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface WalletTransaction {
  id: string;
  shopId?: string;
  type: 'order_revenue' | 'withdrawal' | 'refund' | 'bonus';
  amount: number;
  description: string;
  createdAt: string;
  status: 'completed' | 'pending' | 'rejected';
  bankInfo?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
}

export interface BuyerWalletTransaction {
  id: string;
  type: 'deposit' | 'payment' | 'refund' | 'withdraw' | 'reward';
  amount: number; // positive for deposit/refund/reward, negative for payment/withdraw
  title: string;
  description: string;
  createdAt: string;
  orderCode?: string;
  method?: string; // e.g. VietQR, Napas, Thẻ ATM
  status: 'completed' | 'pending' | 'failed';
}

export interface BuyerLinkedBank {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  cardType: 'napas' | 'visa' | 'mastercard';
  isDefault?: boolean;
}

export interface BuyerWallet {
  balance: number;
  coins: number;
  isKycVerified: boolean;
  linkedBanks: BuyerLinkedBank[];
  transactions: BuyerWalletTransaction[];
}

export interface WithdrawalRequest {
  id: string;
  shopId: string;
  shopName: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  note?: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  type: 'combo' | 'shock_deal' | 'voucher';
  description: string;
  discountValue: number; // e.g. 15 (%) or fixed amount
  targetProducts?: string[];
  minQuantity?: number;
  validUntil: string;
  isActive: boolean;
}

export interface SupportedCarrier {
  id: string;
  name: string;
  code: string;
  isEnabled: boolean;
  estimatedDelivery: string;
  baseFee: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
}

export interface Order {
  id: string;
  orderCode: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  coinsUsed: number;
  total: number;
  status: OrderStatus;
  shippingMethod: 'instant' | 'fast' | 'saving';
  paymentMethod: 'cod' | 'shopeepay' | 'credit' | 'bank';
  customerInfo: CustomerInfo;
  shopId?: string;
  refundReason?: string;
  // Customer account link
  userId?: string;
  userEmail?: string;
  userPhone?: string;
  userProvider?: 'google' | 'facebook' | 'phone';
  // Carrier & shipping specifics
  carrierName?: string;
  carrierCode?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  totalWeight?: number; // gram
  dimensions?: ProductDimensions;
  timeline?: OrderTimelineStep[];
}

export interface ShopSettings {
  shopName: string;
  shopTagline: string;
  shopAvatar: string;
  shopBanner: string;
  adminName?: string;
  adminAvatar?: string;
  adminRoleTitle?: string;
  responseRate: string;
  address: string;
  coinsBalance: number;
  walletBalance: number;
  taxNumber?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountHolder?: string;
  supportedCarriers?: SupportedCarrier[];
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  videoUrl?: string;
}

export interface MiniBanner {
  id: number;
  tag: string;
  title: string;
  image: string;
}

export interface FastServiceItem {
  id: string;
  label: string;
  color: string;
  desc?: string;
}

export interface SiteConfig {
  sellerPassword?: string;
  adminPassword?: string;
  isPasswordProtected: boolean;
  showFooterSellerLink?: boolean;
  topAnnouncement: string;
  searchPlaceholder: string;
  popularKeywords?: string;
  cartButtonLabel?: string;
  heroSlides: HeroSlide[];
  miniBanners: MiniBanner[];
  fastServices: FastServiceItem[];
  categoriesSectionTitle?: string;
  flashSaleTitle: string;
  flashSaleCountdownText?: string;
  discoveryTitle: string;
  loadMoreButtonText?: string;
  trustBadge1Title?: string;
  trustBadge1Desc?: string;
  trustBadge2Title?: string;
  trustBadge2Desc?: string;
  trustBadge3Title?: string;
  trustBadge3Desc?: string;
  trustBadge4Title?: string;
  trustBadge4Desc?: string;
  footerAbout: string;
  footerHotline: string;
  footerEmail: string;
  footerAddress?: string;
  footerCopyright?: string;
}

export type ViewMode = 'buyer' | 'seller' | 'admin';

export type SellerSubTab = 
  | 'products' 
  | 'add_product' 
  | 'orders' 
  | 'vouchers' 
  | 'marketing' 
  | 'analytics' 
  | 'wallet'
  | 'shop_settings' 
  | 'html_export';
