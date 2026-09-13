import { Product, Category, CartItem, Order, Voucher, ShopSettings, SiteConfig, CustomerUser, BuyerWallet, BuyerWalletTransaction, BuyerLinkedBank } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { INITIAL_VOUCHERS } from '../data/initialVouchers';
import { INITIAL_CATEGORIES } from '../data/categories';

const STORAGE_KEYS = {
  PRODUCTS: 'shopee_store_products',
  CATEGORIES: 'vietshop_store_categories',
  CART: 'shopee_store_cart',
  ORDERS: 'shopee_store_orders',
  VOUCHERS: 'shopee_store_vouchers',
  SHOP_SETTINGS: 'shopee_store_settings',
  SITE_CONFIG: 'shopee_store_site_config',
  COINS: 'shopee_store_coins',
  CUSTOMER_USER: 'vietshop_customer_user',
  REGISTERED_BUYERS: 'vietshop_registered_buyers',
  REGISTERED_SELLERS: 'vietshop_registered_sellers',
  BUYER_WALLET: 'vietshop_buyer_wallet'
};

export interface RegisteredBuyer {
  id: string;
  phone: string;
  name: string;
  password?: string;
  address?: string;
  city?: string;
  createdAt: string;
}

export interface RegisteredSeller {
  id: string;
  phone: string;
  shopName: string;
  ownerName: string;
  password?: string;
  category?: string;
  createdAt: string;
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  sellerPassword: '54321',
  adminPassword: '54321',
  isPasswordProtected: true,
  showFooterSellerLink: false,
  topAnnouncement: 'VIETSHOP bao ship 0Đ - Đăng ký nhận ngay 100k • Hàng ngàn mã giảm giá 50%',
  searchPlaceholder: 'VIETSHOP bao ship 0Đ - Tìm kiếm sản phẩm, thương hiệu...',
  heroSlides: [
    {
      id: 1,
      title: 'SIÊU ĐẠI HỘI SALE VIETSHOP 9.9',
      subtitle: 'Voucher 500K • Miễn Phí Vận Chuyển 0Đ • Giảm Sốc 50%',
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
  popularKeywords: 'Áo Thun, Váy Nữ, Giày Sneaker, Son Môi, Tai Nghe Bluetooth, Nồi Chiên',
  cartButtonLabel: 'Giỏ Hàng',
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
  footerAbout: 'VIETSHOP - Nền tảng thương mại điện tử hàng đầu Việt Nam. Mua sắm an toàn, bảo đảm và tiện lợi.',
  footerHotline: '1900 1221 (8h00 - 21h00 hàng ngày)',
  footerEmail: 'support@vietshop.vn',
  footerAddress: 'Trụ sở chính: Tòa nhà Landmark, 720A Điện Biên Phủ, TP. Hồ Chí Minh & Hà Nội',
  footerCopyright: '© 2026 VIETSHOP - Siêu Thị Trực Tuyến Hàng Đầu. Tất cả các quyền được bảo lưu.'
};

export const DEFAULT_CARRIERS = [
  { id: 'c1', name: 'SPX Express (Shopee/VietShop Xpress)', code: 'SPX', isEnabled: true, estimatedDelivery: '1-2 ngày', baseFee: 16500 },
  { id: 'c2', name: 'Giao Hàng Nhanh (GHN Express)', code: 'GHN', isEnabled: true, estimatedDelivery: '1-3 ngày', baseFee: 22000 },
  { id: 'c3', name: 'Viettel Post (Toàn Quốc)', code: 'VTP', isEnabled: true, estimatedDelivery: '2-4 ngày', baseFee: 18000 },
  { id: 'c4', name: 'J&T Express', code: 'JT', isEnabled: true, estimatedDelivery: '1-3 ngày', baseFee: 19500 },
  { id: 'c5', name: 'Hỏa Tốc 2H Nội Thành', code: 'INSTANT', isEnabled: true, estimatedDelivery: '1-2 giờ', baseFee: 35000 }
];

export const DEFAULT_SHOP_SETTINGS: ShopSettings = {
  shopName: 'VIETSHOP',
  shopTagline: 'VIETSHOP - Chính hãng 100% • Miễn phí vận chuyển toàn quốc • Đổi trả 15 ngày',
  shopAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
  shopBanner: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=1200&auto=format&fit=crop&q=80',
  adminName: 'Quản Trị VIETSHOP',
  adminAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
  adminRoleTitle: 'Ban Điều Hành & Quản Trị Viên Sàn',
  responseRate: '99%',
  address: 'Kho tổng VIETSHOP, KCN Tân Bình, Hà Nội & TP. Hồ Chí Minh',
  coinsBalance: 50000,
  walletBalance: 24500000,
  taxNumber: '0315998822',
  bankName: 'VietinBank',
  bankAccountNumber: '101889977665',
  bankAccountHolder: 'CONG TY CP VIETSHOP',
  supportedCarriers: DEFAULT_CARRIERS
};

const SAMPLE_INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-sample-01',
    orderCode: 'SP98234710',
    createdAt: '2026-08-31 14:20',
    items: [
      {
        id: 'cart-init-1',
        productId: 'sp-01',
        product: INITIAL_PRODUCTS[0],
        selectedVariations: { 'Màu sắc': 'Đen Trơn', 'Kích cỡ': 'Size L (60-75kg)' },
        quantity: 2,
        price: 129000,
        selected: true
      }
    ],
    subtotal: 258000,
    shippingFee: 25000,
    discountAmount: 55000,
    coinsUsed: 10000,
    total: 218000,
    status: 'shipping',
    shippingMethod: 'fast',
    paymentMethod: 'cod',
    customerInfo: {
      name: 'Nguyễn Văn Hùng',
      phone: '0912345678',
      address: 'Số 18 ngõ 45 phố Trần Thái Tông, Cầu Giấy',
      city: 'Hà Nội',
      note: 'Giao giờ hành chính giúp em'
    }
  },
  {
    id: 'ord-sample-02',
    orderCode: 'SP77321944',
    createdAt: '2026-09-01 09:15',
    items: [
      {
        id: 'cart-init-2',
        productId: 'sp-02',
        product: INITIAL_PRODUCTS[1],
        selectedVariations: { 'Màu Sắc': 'Trắng Tinh Khôi' },
        quantity: 1,
        price: 389000,
        selected: true
      }
    ],
    subtotal: 389000,
    shippingFee: 30000,
    discountAmount: 30000,
    coinsUsed: 0,
    total: 389000,
    status: 'pending',
    shippingMethod: 'instant',
    paymentMethod: 'shopeepay',
    customerInfo: {
      name: 'Lê Thu Hà',
      phone: '0988776655',
      address: 'Tòa Landmark 81, P.22, Bình Thạnh',
      city: 'TP. Hồ Chí Minh'
    }
  }
];

export const storage = {
  getProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (data) return JSON.parse(data);
    } catch {}
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  },

  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch {}
  },

  getCart(): CartItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CART);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  },

  saveCart(cart: CartItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {}
  },

  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (data) return JSON.parse(data);
    } catch {}
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SAMPLE_INITIAL_ORDERS));
    return SAMPLE_INITIAL_ORDERS;
  },

  saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {}
  },

  getVouchers(): Voucher[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VOUCHERS);
      if (data) return JSON.parse(data);
    } catch {}
    localStorage.setItem(STORAGE_KEYS.VOUCHERS, JSON.stringify(INITIAL_VOUCHERS));
    return INITIAL_VOUCHERS;
  },

  saveVouchers(vouchers: Voucher[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.VOUCHERS, JSON.stringify(vouchers));
    } catch {}
  },

  getShopSettings(): ShopSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SHOP_SETTINGS);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.shopName === 'Shopee Official Mall' || !parsed.shopName) {
          parsed.shopName = 'VIETSHOP';
          parsed.shopTagline = 'VIETSHOP - Chính hãng 100% • Miễn phí vận chuyển toàn quốc • Đổi trả 15 ngày';
        }
        return { ...DEFAULT_SHOP_SETTINGS, ...parsed };
      }
    } catch {}
    localStorage.setItem(STORAGE_KEYS.SHOP_SETTINGS, JSON.stringify(DEFAULT_SHOP_SETTINGS));
    return DEFAULT_SHOP_SETTINGS;
  },

  saveShopSettings(settings: ShopSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SHOP_SETTINGS, JSON.stringify(settings));
    } catch {}
  },

  getSiteConfig(): SiteConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SITE_CONFIG);
      if (data) {
        const parsed = JSON.parse(data);
        // Ensure secret password defaults to '54321' if legacy/unset
        if (parsed.sellerPassword === 'admin' || parsed.sellerPassword === '851011' || !parsed.sellerPassword) {
          parsed.sellerPassword = '54321';
        }
        if (parsed.adminPassword === 'admin' || parsed.adminPassword === '851011' || !parsed.adminPassword) {
          parsed.adminPassword = '54321';
        }
        if (parsed.showFooterSellerLink === undefined || parsed.showFooterSellerLink === true) {
          parsed.showFooterSellerLink = false;
        }
        return { ...DEFAULT_SITE_CONFIG, ...parsed };
      }
    } catch {}
    localStorage.setItem(STORAGE_KEYS.SITE_CONFIG, JSON.stringify(DEFAULT_SITE_CONFIG));
    return DEFAULT_SITE_CONFIG;
  },

  saveSiteConfig(config: SiteConfig): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SITE_CONFIG, JSON.stringify(config));
    } catch {}
  },

  getAdminPassword(): string {
    const config = this.getSiteConfig();
    return config.adminPassword || '54321';
  },

  saveAdminPassword(newPassword: string): void {
    const config = this.getSiteConfig();
    config.adminPassword = newPassword;
    config.sellerPassword = newPassword;
    this.saveSiteConfig(config);
  },

  changeAdminPassword(oldPass: string, newPass: string): { success: boolean; message: string } {
    const current = this.getAdminPassword();
    if (oldPass !== current) {
      return { success: false, message: 'Mật khẩu quản trị hiện tại không chính xác!' };
    }
    if (!newPass || newPass.trim().length < 4) {
      return { success: false, message: 'Mật khẩu quản trị mới phải có ít nhất 4 ký tự!' };
    }
    this.saveAdminPassword(newPass.trim());
    return { success: true, message: 'Đổi mật khẩu quản trị hệ thống thành công!' };
  },

  toggleFooterSellerLink(show?: boolean): boolean {
    const config = this.getSiteConfig();
    const nextState = show !== undefined ? show : !config.showFooterSellerLink;
    config.showFooterSellerLink = nextState;
    this.saveSiteConfig(config);
    return nextState;
  },

  getCategories(): Category[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (data) return JSON.parse(data);
    } catch {}
    return INITIAL_CATEGORIES;
  },

  saveCategories(categories: Category[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch {}
  },

  resetAllData(): void {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SAMPLE_INITIAL_ORDERS));
    localStorage.setItem(STORAGE_KEYS.VOUCHERS, JSON.stringify(INITIAL_VOUCHERS));
    localStorage.setItem(STORAGE_KEYS.SHOP_SETTINGS, JSON.stringify(DEFAULT_SHOP_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.SITE_CONFIG, JSON.stringify(DEFAULT_SITE_CONFIG));
  },

  getCurrentRole(): 'customer' | 'seller' | 'vendor' | 'admin' {
    try {
      const r = localStorage.getItem('vietshop_user_role');
      if (r === 'admin' || r === 'seller' || r === 'vendor' || r === 'customer') return r;
    } catch {}
    return 'seller'; // default in developer preview for easy inspection
  },

  setCurrentRole(role: 'customer' | 'seller' | 'vendor' | 'admin'): void {
    try {
      localStorage.setItem('vietshop_user_role', role);
    } catch {}
  },

  getApplications(): any[] {
    try {
      const data = localStorage.getItem('vietshop_seller_applications');
      if (data) return JSON.parse(data);
    } catch {}
    const sampleApps = [
      {
        id: 'app-001',
        userId: 'usr-customer-1',
        applicantName: 'Nguyễn Văn Hùng',
        phone: '0912345678',
        email: 'hung.nguyen@gmail.com',
        shopName: 'Hùng Sport - Thời Trang Thể Thao',
        taxOrIdNumber: '031489201948',
        bankName: 'Vietcombank',
        bankAccountNumber: '9988112233',
        bankAccountHolder: 'NGUYEN VAN HUNG',
        warehouseAddress: 'Số 18 Ngõ 45 Trần Thái Tông, Cầu Giấy, Hà Nội',
        businessCategory: 'Thời Trang Nam & Thể Thao',
        status: 'pending',
        submittedAt: '2026-09-02 10:30'
      },
      {
        id: 'app-002',
        userId: 'usr-customer-2',
        applicantName: 'Trần Thị Mai',
        phone: '0933445566',
        email: 'mai.tran@gmail.com',
        shopName: 'Mai Beauty & Cosmetics Korea',
        taxOrIdNumber: '079201994821',
        bankName: 'Techcombank',
        bankAccountNumber: '19034567890123',
        bankAccountHolder: 'TRAN THI MAI',
        warehouseAddress: '25 Lê Văn Sỹ, Phường 13, Quận 3, TP. Hồ Chí Minh',
        businessCategory: 'Sắc Đẹp & Mỹ Phẩm',
        status: 'approved',
        submittedAt: '2026-08-28 14:00',
        reviewedAt: '2026-08-29 09:15'
      }
    ];
    localStorage.setItem('vietshop_seller_applications', JSON.stringify(sampleApps));
    return sampleApps;
  },

  saveApplications(apps: any[]): void {
    try {
      localStorage.setItem('vietshop_seller_applications', JSON.stringify(apps));
    } catch {}
  },

  getWithdrawals(): any[] {
    try {
      const data = localStorage.getItem('vietshop_withdrawals');
      if (data) return JSON.parse(data);
    } catch {}
    const sampleWd = [
      {
        id: 'wd-001',
        shopId: 'shop-vietshop-official',
        shopName: 'VIETSHOP Official Store',
        amount: 5000000,
        bankName: 'VietinBank',
        accountNumber: '101889977665',
        accountHolder: 'CONG TY CP VIETSHOP',
        status: 'approved',
        requestedAt: '2026-09-02 08:30',
        processedAt: '2026-09-02 09:15',
        note: 'Đã giải ngân qua Napas 24/7'
      },
      {
        id: 'wd-002',
        shopId: 'shop-mai-beauty',
        shopName: 'Mai Beauty & Cosmetics Korea',
        amount: 2500000,
        bankName: 'Techcombank',
        accountNumber: '19034567890123',
        accountHolder: 'TRAN THI MAI',
        status: 'pending',
        requestedAt: '2026-09-03 14:10',
        note: 'Yêu cầu rút doanh thu bán hàng tuần 35'
      }
    ];
    localStorage.setItem('vietshop_withdrawals', JSON.stringify(sampleWd));
    return sampleWd;
  },

  saveWithdrawals(wds: any[]): void {
    try {
      localStorage.setItem('vietshop_withdrawals', JSON.stringify(wds));
    } catch {}
  },

  getTransactions(): any[] {
    try {
      const data = localStorage.getItem('vietshop_wallet_transactions');
      if (data) return JSON.parse(data);
    } catch {}
    const sampleTx = [
      {
        id: 'tx-001',
        shopId: 'shop-vietshop-official',
        type: 'order_revenue',
        amount: 218000,
        description: 'Doanh thu từ đơn hàng #SP98234710',
        createdAt: '2026-08-31 16:45',
        status: 'completed'
      },
      {
        id: 'tx-002',
        shopId: 'shop-vietshop-official',
        type: 'order_revenue',
        amount: 1590000,
        description: 'Doanh thu từ đơn hàng #SP66391002',
        createdAt: '2026-09-01 11:20',
        status: 'completed'
      },
      {
        id: 'tx-003',
        shopId: 'shop-vietshop-official',
        type: 'withdrawal',
        amount: -5000000,
        description: 'Rút tiền về VietinBank STK 101889977665',
        createdAt: '2026-09-02 08:30',
        status: 'completed'
      }
    ];
    localStorage.setItem('vietshop_wallet_transactions', JSON.stringify(sampleTx));
    return sampleTx;
  },

  saveTransactions(txs: any[]): void {
    try {
      localStorage.setItem('vietshop_wallet_transactions', JSON.stringify(txs));
    } catch {}
  },

  getMarketingCampaigns(): any[] {
    try {
      const data = localStorage.getItem('vietshop_marketing_campaigns');
      if (data) return JSON.parse(data);
    } catch {}
    const initialCampaigns = [
      {
        id: 'mkt-01',
        name: 'Combo Mua 2 Giảm 10% Siêu Tiết Kiệm',
        type: 'combo',
        description: 'Áp dụng khi mua từ 2 sản phẩm bất kỳ trong gian hàng',
        discountValue: 10,
        minQuantity: 2,
        validUntil: '2026-09-30',
        isActive: true
      },
      {
        id: 'mkt-02',
        name: 'Deal Sốc Mua Kèm Quà Tặng 0Đ',
        type: 'shock_deal',
        description: 'Mua sản phẩm chính được tặng kèm phụ kiện/quà tặng 0Đ',
        discountValue: 50,
        validUntil: '2026-09-15',
        isActive: true
      }
    ];
    localStorage.setItem('vietshop_marketing_campaigns', JSON.stringify(initialCampaigns));
    return initialCampaigns;
  },

  saveMarketingCampaigns(campaigns: any[]): void {
    try {
      localStorage.setItem('vietshop_marketing_campaigns', JSON.stringify(campaigns));
    } catch {}
  },

  getCustomerUser(): CustomerUser | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOMER_USER);
      if (data) {
        const user = JSON.parse(data);
        // Xoá tài khoản người mua thử nghiệm (Nguyễn Văn Khang, phone 0988776655 hoặc preset)
        if (user && (user.phone === '0988776655' || user.id === 'buyer-default-1' || user.name === 'Nguyễn Văn Khang' || (user.id && user.id.startsWith('usr-preset-')))) {
          localStorage.removeItem(STORAGE_KEYS.CUSTOMER_USER);
          return null;
        }
        return user;
      }
    } catch {}
    return null;
  },

  saveCustomerUser(user: CustomerUser): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMER_USER, JSON.stringify(user));
    } catch {}
  },

  removeCustomerUser(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.CUSTOMER_USER);
    } catch {}
  },

  getRegisteredBuyers(): RegisteredBuyer[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REGISTERED_BUYERS);
      if (data) {
        const buyers: RegisteredBuyer[] = JSON.parse(data);
        // Xoá bỏ hoàn toàn tài khoản người mua thử nghiệm
        const filtered = buyers.filter(b => b.phone !== '0988776655' && b.id !== 'buyer-default-1' && b.name !== 'Nguyễn Văn Khang');
        if (filtered.length !== buyers.length) {
          localStorage.setItem(STORAGE_KEYS.REGISTERED_BUYERS, JSON.stringify(filtered));
        }
        return filtered;
      }
    } catch {}
    // Không tạo tài khoản thử nghiệm mặc định
    return [];
  },

  saveRegisteredBuyer(buyer: RegisteredBuyer): void {
    try {
      const existing = this.getRegisteredBuyers();
      const idx = existing.findIndex(b => b.phone === buyer.phone);
      if (idx >= 0) {
        existing[idx] = { ...existing[idx], ...buyer };
      } else {
        existing.unshift(buyer);
      }
      localStorage.setItem(STORAGE_KEYS.REGISTERED_BUYERS, JSON.stringify(existing));
    } catch {}
  },

  // ===== VÍ VIETSHOP (VIETSHOP PAY) =====
  getBuyerWallet(): BuyerWallet {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BUYER_WALLET);
      if (data) return JSON.parse(data);
    } catch {}

    const initialWallet: BuyerWallet = {
      balance: 2500000, // 2.500.000₫ số dư ban đầu trong Ví VIETSHOP Pay
      coins: 50000,
      isKycVerified: true,
      linkedBanks: [
        {
          id: 'bank-1',
          bankName: 'Vietcombank',
          accountNumber: '•••• •••• 9988',
          accountHolder: 'CHU TAI KHOAN VIETSHOP',
          cardType: 'napas',
          isDefault: true
        }
      ],
      transactions: [
        {
          id: 'tx-w-001',
          type: 'deposit',
          amount: 3000000,
          title: 'Nạp tiền vào Ví VIETSHOP',
          description: 'Nạp nhanh qua VietQR 24/7 từ Vietcombank',
          createdAt: new Date(Date.now() - 86400000 * 2).toLocaleDateString('vi-VN') + ' 10:15',
          method: 'VietQR Napas 247',
          status: 'completed'
        },
        {
          id: 'tx-w-002',
          type: 'payment',
          amount: -550000,
          title: 'Thanh toán đơn hàng VIETSHOP',
          description: 'Thanh toán thành công đơn hàng thời trang',
          createdAt: new Date(Date.now() - 86400000).toLocaleDateString('vi-VN') + ' 14:20',
          orderCode: 'SP98234710',
          method: 'Ví VIETSHOP Pay',
          status: 'completed'
        },
        {
          id: 'tx-w-003',
          type: 'reward',
          amount: 50000,
          title: 'Ưu đãi hoàn tiền Ví VIETSHOP',
          description: 'Hoàn 10% giá trị đơn hàng vào số dư ví',
          createdAt: new Date(Date.now() - 86400000).toLocaleDateString('vi-VN') + ' 14:25',
          method: 'VIETSHOP Rewards',
          status: 'completed'
        }
      ]
    };

    try {
      localStorage.setItem(STORAGE_KEYS.BUYER_WALLET, JSON.stringify(initialWallet));
    } catch {}
    return initialWallet;
  },

  saveBuyerWallet(wallet: BuyerWallet): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BUYER_WALLET, JSON.stringify(wallet));
    } catch {}
  },

  topUpBuyerWallet(amount: number, bankName = 'Vietcombank'): BuyerWallet {
    const current = this.getBuyerWallet();
    const newTx: BuyerWalletTransaction = {
      id: 'tx-w-' + Date.now(),
      type: 'deposit',
      amount,
      title: 'Nạp tiền vào Ví VIETSHOP',
      description: `Nạp thành công ${amount.toLocaleString('vi-VN')}₫ từ ${bankName}`,
      createdAt: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      method: 'VietQR / Chuyển khoản 247',
      status: 'completed'
    };

    const updated: BuyerWallet = {
      ...current,
      balance: current.balance + amount,
      transactions: [newTx, ...current.transactions]
    };

    this.saveBuyerWallet(updated);
    return updated;
  },

  withdrawFromBuyerWallet(amount: number, bankName: string, accountNumber: string): { success: boolean; message: string; wallet: BuyerWallet } {
    const current = this.getBuyerWallet();
    if (current.balance < amount) {
      return { success: false, message: 'Số dư ví VIETSHOP không đủ để rút tiền!', wallet: current };
    }

    const newTx: BuyerWalletTransaction = {
      id: 'tx-w-' + Date.now(),
      type: 'withdraw',
      amount: -amount,
      title: 'Rút tiền về tài khoản ngân hàng',
      description: `Rút ${amount.toLocaleString('vi-VN')}₫ về ${bankName} (${accountNumber})`,
      createdAt: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      method: `Chuyển về ${bankName}`,
      status: 'completed'
    };

    const updated: BuyerWallet = {
      ...current,
      balance: current.balance - amount,
      transactions: [newTx, ...current.transactions]
    };

    this.saveBuyerWallet(updated);
    return { success: true, message: 'Rút tiền thành công! Tiền sẽ về tài khoản sau 1-3 phút.', wallet: updated };
  },

  payWithBuyerWallet(amount: number, orderCode: string): { success: boolean; message: string; wallet: BuyerWallet } {
    const current = this.getBuyerWallet();
    if (current.balance < amount) {
      return { success: false, message: 'Số dư ví VIETSHOP không đủ thanh toán. Vui lòng nạp thêm!', wallet: current };
    }

    const newTx: BuyerWalletTransaction = {
      id: 'tx-w-' + Date.now(),
      type: 'payment',
      amount: -amount,
      title: 'Thanh toán đơn hàng VIETSHOP',
      description: `Thanh toán thành công đơn hàng #${orderCode}`,
      createdAt: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      orderCode,
      method: 'Ví VIETSHOP Pay',
      status: 'completed'
    };

    const updated: BuyerWallet = {
      ...current,
      balance: current.balance - amount,
      transactions: [newTx, ...current.transactions]
    };

    this.saveBuyerWallet(updated);
    return { success: true, message: 'Thanh toán qua Ví VIETSHOP thành công!', wallet: updated };
  },

  refundToBuyerWallet(amount: number, orderCode: string, reason = 'Hoàn tiền tự động cho đơn hàng'): BuyerWallet {
    const current = this.getBuyerWallet();
    const newTx: BuyerWalletTransaction = {
      id: 'tx-w-' + Date.now(),
      type: 'refund',
      amount,
      title: 'Hoàn tiền vào Ví VIETSHOP',
      description: `${reason} #${orderCode}`,
      createdAt: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      orderCode,
      method: 'Ví VIETSHOP Pay',
      status: 'completed'
    };

    const updated: BuyerWallet = {
      ...current,
      balance: current.balance + amount,
      transactions: [newTx, ...current.transactions]
    };

    this.saveBuyerWallet(updated);
    return updated;
  },

  getRegisteredSellers(): RegisteredSeller[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REGISTERED_SELLERS);
      if (data) return JSON.parse(data);
    } catch {}
    // Default initial registered seller for instant testing
    const defaultSellers: RegisteredSeller[] = [
      {
        id: 'seller-default-1',
        phone: '0912345678',
        shopName: 'VIETSHOP Official Store',
        ownerName: 'Hà Hoàng Thu',
        password: '123456',
        category: 'Thiết Bị Điện Gia Dụng',
        createdAt: new Date().toISOString()
      }
    ];
    try {
      localStorage.setItem(STORAGE_KEYS.REGISTERED_SELLERS, JSON.stringify(defaultSellers));
    } catch {}
    return defaultSellers;
  },

  saveRegisteredSeller(seller: RegisteredSeller): void {
    try {
      const existing = this.getRegisteredSellers();
      const idx = existing.findIndex(s => s.phone === seller.phone);
      if (idx >= 0) {
        existing[idx] = { ...existing[idx], ...seller };
      } else {
        existing.unshift(seller);
      }
      localStorage.setItem(STORAGE_KEYS.REGISTERED_SELLERS, JSON.stringify(existing));
    } catch {}
  }
};
