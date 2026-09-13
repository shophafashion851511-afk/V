import React, { useState, useEffect, useMemo } from 'react';
import { 
  Product, Category, CartItem, Order, Voucher, 
  ShopSettings, ViewMode, OrderStatus, SiteConfig,
  SellerRegistrationApplication, WithdrawalRequest, WalletTransaction,
  MarketingCampaign, UserRole, CustomerUser, BuyerWallet
} from './types';
import { storage } from './utils/storage';
import { playSuccessChime } from './utils/audio';
import { INITIAL_CATEGORIES } from './data/categories';
import { Header } from './components/Header';
import { ShopeeBanner } from './components/ShopeeBanner';
import { SellerRegistrationModal } from './components/SellerRegistrationModal';
import { CategoryList } from './components/CategoryList';
import { FlashSaleSection } from './components/FlashSaleSection';
import { QuickVoucherBar } from './components/QuickVoucherBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { EditProductModal } from './components/EditProductModal';
import { CartModal } from './components/CartModal';
import { CheckoutModal } from './components/CheckoutModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { CustomerOrderTrackingModal } from './components/CustomerOrderTrackingModal';
import { SellerCenter } from './components/SellerCenter';
import { SellerLoginModal } from './components/SellerLoginModal';
import { AdminPortal } from './components/AdminPortal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { LiveTextEditorModal } from './components/LiveTextEditorModal';
import { FastServiceModals } from './components/FastServiceModals';
import { FooterInfoModal, FooterTabType } from './components/FooterInfoModal';
import { AiCustomerChatModal } from './components/AiCustomerChatModal';
import { AiSellerAssistantModal } from './components/AiSellerAssistantModal';
import { VietshopWalletModal } from './components/VietshopWalletModal';
import { PwaInstallPromptModal, PwaQuickBanner } from './components/PwaInstallPromptModal';
import { 
  Sparkles, Filter, SlidersHorizontal, ArrowUpDown, 
  ShieldCheck, Truck, RotateCcw, Award, Store, Plus, Edit3,
  Bot, MessageSquare, Wand2, Zap
} from 'lucide-react';

export default function App() {
  // Global persistent states
  const [products, setProducts] = useState<Product[]>(() => storage.getProducts());
  const [categories, setCategories] = useState<Category[]>(() => storage.getCategories());
  const [cart, setCart] = useState<CartItem[]>(() => storage.getCart());
  const [orders, setOrders] = useState<Order[]>(() => storage.getOrders());
  const [vouchers, setVouchers] = useState<Voucher[]>(() => storage.getVouchers());
  const [shopSettings, setShopSettings] = useState<ShopSettings>(() => storage.getShopSettings());
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => storage.getSiteConfig());

  // Role-Based Access Control & Channel Data
  const [currentRole, setCurrentRole] = useState<UserRole>(() => storage.getCurrentRole());
  const [applications, setApplications] = useState<SellerRegistrationApplication[]>(() => storage.getApplications());
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => storage.getWithdrawals());
  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => storage.getTransactions());
  const [marketingCampaigns, setMarketingCampaigns] = useState<MarketingCampaign[]>(() => storage.getMarketingCampaigns());
  const [isSellerRegistrationOpen, setIsSellerRegistrationOpen] = useState(false);

  // UI state
  const [viewMode, setViewMode] = useState<ViewMode>('buyer');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutVoucher, setCheckoutVoucher] = useState<Voucher | null>(null);
  const [checkoutUseCoins, setCheckoutUseCoins] = useState(false);

  // Modals state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isSellerLoginOpen, setIsSellerLoginOpen] = useState(false);
  const [isLiveTextEditorOpen, setIsLiveTextEditorOpen] = useState(false);
  const [activeFastServiceModal, setActiveFastServiceModal] = useState<string | null>(null);
  const [footerModalTab, setFooterModalTab] = useState<FooterTabType | null>(null);
  const [isSellerAuthenticated, setIsSellerAuthenticated] = useState(false);
  const [isAiCustomerChatOpen, setIsAiCustomerChatOpen] = useState(false);
  const [isAiSellerAssistantOpen, setIsAiSellerAssistantOpen] = useState(false);

  // Customer Authentication & Order Tracking
  const [currentCustomer, setCurrentCustomer] = useState<CustomerUser | null>(() => storage.getCustomerUser());
  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);
  const [customerAuthInitialMode, setCustomerAuthInitialMode] = useState<'register' | 'login'>('register');
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);

  // Buyer Wallet (Ví VIETSHOP Pay)
  const [buyerWallet, setBuyerWallet] = useState<BuyerWallet>(() => storage.getBuyerWallet());
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  // PWA Install Modal state (Tự động gợi ý cài đặt vào điện thoại khi mở trang VIETSHOP)
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Auto-prompt to install when opening VIETSHOP page
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    
    if (!isStandalone) {
      const hasDismissedToday = sessionStorage.getItem('vietshop_install_dismissed_session');
      if (!hasDismissedToday) {
        const timer = setTimeout(() => {
          setIsInstallModalOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Sorting & Filtering for Buyer Grid
  const [sortOption, setSortOption] = useState<'popular' | 'latest' | 'top_sales' | 'price_asc' | 'price_desc'>('popular');
  const [filterOnlyMall, setFilterOnlyMall] = useState(false);
  const [filterOnlyFreeship, setFilterOnlyFreeship] = useState(false);

  // Sync state changes to storage
  useEffect(() => {
    storage.saveProducts(products);
  }, [products]);

  useEffect(() => {
    storage.saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    storage.saveCart(cart);
  }, [cart]);

  useEffect(() => {
    storage.saveOrders(orders);
  }, [orders]);

  useEffect(() => {
    storage.saveVouchers(vouchers);
  }, [vouchers]);

  useEffect(() => {
    storage.saveShopSettings(shopSettings);
  }, [shopSettings]);

  useEffect(() => {
    storage.saveSiteConfig(siteConfig);
  }, [siteConfig]);

  useEffect(() => {
    storage.setCurrentRole(currentRole);
  }, [currentRole]);

  useEffect(() => {
    storage.saveApplications(applications);
  }, [applications]);

  useEffect(() => {
    storage.saveWithdrawals(withdrawals);
  }, [withdrawals]);

  useEffect(() => {
    storage.saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    storage.saveMarketingCampaigns(marketingCampaigns);
  }, [marketingCampaigns]);

  // Handlers for Seller Applications & Admin Supervision
  const handleApproveApplication = async (appId: string) => {
    try {
      await fetch(`/api/admin/sellers/${appId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-role': 'admin' }
      }).catch(() => {});
    } catch {}

    const app = applications.find(a => a.id === appId);
    if (app) {
      setShopSettings(prev => ({
        ...prev,
        shopName: app.shopName,
        bankName: app.bankName,
        bankAccountNumber: app.bankAccountNumber,
        bankAccountHolder: app.bankAccountHolder
      }));
    }

    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'approved' as const } : a));
  };

  const handleRejectApplication = async (appId: string, reason: string = 'Hồ sơ chưa đạt tiêu chuẩn') => {
    try {
      await fetch(`/api/admin/sellers/${appId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-role': 'admin' },
        body: JSON.stringify({ reason })
      }).catch(() => {});
    } catch {}

    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'rejected' as const, rejectReason: reason } : a));
  };

  // Handlers for Wallet & Withdrawals
  const handleApproveWithdrawal = async (withdrawalId: string) => {
    try {
      await fetch(`/api/admin/withdrawals/${withdrawalId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-role': 'admin' }
      }).catch(() => {});
    } catch {}

    setWithdrawals(prev => prev.map(w => w.id === withdrawalId ? { ...w, status: 'completed' as const, completedAt: new Date().toLocaleString('vi-VN') } : w));
    setTransactions(prev => prev.map(tx => tx.description.includes(withdrawalId) || tx.status === 'pending' ? { ...tx, status: 'completed' as const } : tx));
  };

  const handleRejectWithdrawal = async (withdrawalId: string, reason: string = 'Thông tin tài khoản ngân hàng không khớp') => {
    try {
      await fetch(`/api/admin/withdrawals/${withdrawalId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-role': 'admin' },
        body: JSON.stringify({ reason })
      }).catch(() => {});
    } catch {}

    // Refund amount back to wallet balance if rejected
    const target = withdrawals.find(w => w.id === withdrawalId);
    if (target && target.status === 'pending') {
      setShopSettings(prev => ({
        ...prev,
        walletBalance: (prev.walletBalance ?? 24500000) + target.amount
      }));
    }

    setWithdrawals(prev => prev.map(w => w.id === withdrawalId ? { ...w, status: 'rejected' as const, rejectReason: reason } : w));
  };

  const handleAddTransaction = (tx: WalletTransaction) => {
    setTransactions(prev => [tx, ...prev]);
  };

  const handleAddWithdrawal = (wd: WithdrawalRequest) => {
    setWithdrawals(prev => [wd, ...prev]);
  };

  // Marketing Campaigns Handlers
  const handleAddMarketingCampaign = (camp: MarketingCampaign) => {
    setMarketingCampaigns(prev => [camp, ...prev]);
  };

  const handleToggleMarketingCampaign = (campId: string) => {
    setMarketingCampaigns(prev => prev.map(c => c.id === campId ? { ...c, isActive: !c.isActive } : c));
  };

  const handleDeleteMarketingCampaign = (campId: string) => {
    setMarketingCampaigns(prev => prev.filter(c => c.id !== campId));
  };

  // Handle Cart Operations
  const handleAddToCart = (product: Product, variations: Record<string, string>, quantity: number) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(
        item => item.productId === product.id && 
        JSON.stringify(item.selectedVariations) === JSON.stringify(variations)
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }

      const newItem: CartItem = {
        id: 'cart-' + Date.now(),
        productId: product.id,
        product,
        selectedVariations: variations,
        quantity,
        price: product.price,
        selected: true
      };
      return [newItem, ...prev];
    });
  };

  const handleBuyNow = (product: Product, variations: Record<string, string>, quantity: number) => {
    handleAddToCart(product, variations, quantity);
    setActiveDetailProduct(null);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => item.id === cartItemId ? { ...item, quantity: newQty } : item));
  };

  const handleToggleSelectCartItem = (cartItemId: string) => {
    setCart(prev => prev.map(item => item.id === cartItemId ? { ...item, selected: !item.selected } : item));
  };

  const handleToggleSelectAllCart = (select: boolean) => {
    setCart(prev => prev.map(item => ({ ...item, selected: select })));
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const handleProceedToCheckout = (appliedVoucher: Voucher | null, useCoins: boolean) => {
    setCheckoutVoucher(appliedVoucher);
    setCheckoutUseCoins(useCoins);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (newOrder: Order) => {
    // Add to orders
    setOrders(prev => [newOrder, ...prev]);

    // Deduct from buyer wallet if paid via VIETSHOP Pay
    if (newOrder.paymentMethod === 'shopeepay') {
      storage.payWithBuyerWallet(newOrder.total, newOrder.orderCode);
      setBuyerWallet(storage.getBuyerWallet());
    }

    // Remove ordered items from cart
    setCart(prev => prev.filter(item => !item.selected));

    // Reduce product stock & increment sold count
    setProducts(prev => {
      return prev.map(p => {
        const orderItem = newOrder.items.find(i => i.productId === p.id);
        if (orderItem) {
          const newStock = Math.max(0, p.stock - orderItem.quantity);
          const newSold = p.soldCount + orderItem.quantity;
          return {
            ...p,
            stock: newStock,
            soldCount: newSold,
            soldCountDisplay: newSold >= 1000 ? (newSold / 1000).toFixed(1) + 'k' : newSold.toString()
          };
        }
        return p;
      });
    });
  };

  // Product CRUD operations
  const handleUpdateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  // Order Status update & Automatic Revenue Transfer to Vietshop Wallet
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder && targetOrder.status !== 'delivered' && status === 'delivered') {
      const revenueAmount = targetOrder.total;
      setShopSettings(prev => {
        const currentBal = prev.walletBalance ?? 24500000;
        return {
          ...prev,
          walletBalance: currentBal + revenueAmount
        };
      });

      const revenueTx: WalletTransaction = {
        id: 'tx-rev-' + Date.now().toString(36),
        shopId: targetOrder.shopId || 'shop-vietshop-official',
        type: 'order_revenue',
        amount: revenueAmount,
        description: `Doanh thu đơn hàng #${targetOrder.orderCode} giao thành công`,
        createdAt: new Date().toLocaleString('vi-VN'),
        status: 'completed'
      };
      setTransactions(prev => [revenueTx, ...prev]);
      playSuccessChime();
    }

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  // Customer Authentication & Tracking operations
  const handleCustomerLoginSuccess = (user: CustomerUser) => {
    setCurrentCustomer(user);
    storage.saveCustomerUser(user);
    setIsCustomerAuthOpen(false);
  };

  const handleCustomerLogout = () => {
    setCurrentCustomer(null);
    storage.removeCustomerUser();
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        if (o.paymentMethod === 'shopeepay') {
          storage.refundToBuyerWallet(o.total, o.orderCode, 'Hoàn tiền hủy đơn hàng');
          setBuyerWallet(storage.getBuyerWallet());
        }
        return { ...o, status: 'cancelled' };
      }
      return o;
    }));
  };

  // Buyer Wallet Handlers
  const handleTopUpWallet = (amount: number, bankName?: string) => {
    const updated = storage.topUpBuyerWallet(amount, bankName);
    setBuyerWallet(updated);
  };

  const handleWithdrawWallet = (amount: number, bankName: string, accountNumber: string) => {
    const res = storage.withdrawFromBuyerWallet(amount, bankName, accountNumber);
    if (res.success) {
      setBuyerWallet(storage.getBuyerWallet());
    }
    return res;
  };

  // Voucher operations
  const handleAddVoucher = (newVoucher: Voucher) => {
    setVouchers(prev => [newVoucher, ...prev]);
  };

  const handleDeleteVoucher = (voucherId: string) => {
    setVouchers(prev => prev.filter(v => v.id !== voucherId));
  };

  const handleToggleSaveVoucher = (voucherId: string) => {
    setVouchers(prev => prev.map(v => v.id === voucherId ? { ...v, isSaved: !v.isSaved } : v));
  };

  // Coins increment (from games/rewards)
  const handleAddCoins = (amount: number) => {
    setShopSettings(prev => ({ ...prev, coinsBalance: prev.coinsBalance + amount }));
  };

  // Reset demo data
  const handleResetAllData = () => {
    storage.resetAllData();
    setProducts(storage.getProducts());
    setCategories(storage.getCategories());
    setCart([]);
    setOrders(storage.getOrders());
    setVouchers(storage.getVouchers());
    setShopSettings(storage.getShopSettings());
    setSiteConfig(storage.getSiteConfig());
  };

  // Filtered & Sorted products for Buyer grid
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => p.isActive !== false);

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    if (filterOnlyMall) {
      result = result.filter(p => p.isMall);
    }

    if (filterOnlyFreeship) {
      result = result.filter(p => p.isFreeshipXtra);
    }

    // Sort
    if (sortOption === 'latest') {
      result = [...result].reverse();
    } else if (sortOption === 'top_sales') {
      result = [...result].sort((a, b) => b.soldCount - a.soldCount);
    } else if (sortOption === 'price_asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price_desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, selectedCategory, searchQuery, filterOnlyMall, filterOnlyFreeship, sortOption]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Shopee / VIETSHOP Header */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectCategory={(catId) => setSelectedCategory(catId)}
        onOpenProduct={(productId) => {
          const found = products.find(p => p.id === productId);
          if (found) setActiveDetailProduct(found);
        }}
        siteConfig={siteConfig}
        shopName={shopSettings.shopName || 'VIETSHOP'}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        isAdminAuthenticated={isAdminAuthenticated}
        isSellerAuthenticated={isSellerAuthenticated}
        onOpenSellerLogin={() => {
          if (isSellerAuthenticated) {
            setViewMode(viewMode === 'seller' ? 'buyer' : 'seller');
          } else {
            setIsSellerLoginOpen(true);
          }
        }}
        onOpenHelp={(tab) => setFooterModalTab((tab as FooterTabType) || 'help_center')}
        currentCustomer={currentCustomer}
        onOpenCustomerAuth={(mode) => {
          setCustomerAuthInitialMode(mode || 'register');
          setIsCustomerAuthOpen(true);
        }}
        onLogoutCustomer={handleCustomerLogout}
        onOpenOrderTracking={() => {
          setTrackingOrderId(null);
          setIsOrderTrackingOpen(true);
        }}
        onOpenWallet={() => setIsWalletOpen(true)}
        walletBalance={buyerWallet.balance}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        
        {/* ADMIN MANAGEMENT MODE */}
        {viewMode === 'admin' ? (
          <AdminPortal
            siteConfig={siteConfig}
            shopSettings={shopSettings}
            categories={categories}
            products={products}
            orders={orders}
            vouchers={vouchers}
            applications={applications}
            withdrawals={withdrawals}
            transactions={transactions}
            marketingCampaigns={marketingCampaigns}
            currentRole={currentRole}
            onSaveSiteConfig={setSiteConfig}
            onUpdateShopSettings={setShopSettings}
            onUpdateCategories={(newCats) => setCategories(newCats)}
            onApproveApplication={handleApproveApplication}
            onRejectApplication={handleRejectApplication}
            onApproveWithdrawal={handleApproveWithdrawal}
            onRejectWithdrawal={handleRejectWithdrawal}
            onUpdateProducts={(newProds) => setProducts(newProds)}
            onUpdateOrders={(newOrders) => setOrders(newOrders)}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddVoucher={handleAddVoucher}
            onDeleteVoucher={handleDeleteVoucher}
            onResetAllData={handleResetAllData}
            onOpenEditModal={(p) => setEditingProduct(p)}
            onOpenAiAssistant={() => setIsAiSellerAssistantOpen(true)}
            onAddTransaction={handleAddTransaction}
            onAddWithdrawal={handleAddWithdrawal}
            onAddMarketingCampaign={handleAddMarketingCampaign}
            onToggleMarketingCampaign={handleToggleMarketingCampaign}
            onDeleteMarketingCampaign={handleDeleteMarketingCampaign}
            onChangeRole={(newRole) => setCurrentRole(newRole)}
            onBackToBuyer={() => setViewMode('buyer')}
            onLogoutAdmin={() => {
              setIsAdminAuthenticated(false);
              setViewMode('buyer');
            }}
          />
        ) : viewMode === 'seller' ? (
          <SellerCenter
            products={products}
            categories={categories}
            orders={orders}
            vouchers={vouchers}
            shopSettings={shopSettings}
            siteConfig={siteConfig}
            currentRole={currentRole}
            applications={applications}
            withdrawals={withdrawals}
            transactions={transactions}
            marketingCampaigns={marketingCampaigns}
            onUpdateProduct={handleUpdateProduct}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddVoucher={handleAddVoucher}
            onDeleteVoucher={handleDeleteVoucher}
            onUpdateShopSettings={setShopSettings}
            onUpdateSiteConfig={setSiteConfig}
            onResetAllData={handleResetAllData}
            onOpenEditModal={(p) => setEditingProduct(p)}
            onBackToBuyer={() => setViewMode('buyer')}
            onOpenAiAssistant={() => setIsAiSellerAssistantOpen(true)}
            onApproveApplication={handleApproveApplication}
            onRejectApplication={handleRejectApplication}
            onApproveWithdrawal={handleApproveWithdrawal}
            onRejectWithdrawal={handleRejectWithdrawal}
            onAddTransaction={handleAddTransaction}
            onAddWithdrawal={handleAddWithdrawal}
            onAddMarketingCampaign={handleAddMarketingCampaign}
            onToggleMarketingCampaign={handleToggleMarketingCampaign}
            onDeleteMarketingCampaign={handleDeleteMarketingCampaign}
            onChangeRole={(newRole) => setCurrentRole(newRole)}
            onUpdateCategories={(newCats) => setCategories(newCats)}
          />
        ) : (
          /* BUYER MARKETPLACE MODE */
          <div className="space-y-6">
            
            {/* Banner & Quick Access Icons (Only show when not searching) */}
            {!searchQuery && selectedCategory === 'all' && (
              <>
                <ShopeeBanner
                  siteConfig={siteConfig}
                  onQuickActionClick={(action) => {
                    if (action === 'wallet' || action === 'shopeepay') {
                      setIsWalletOpen(true);
                    } else {
                      setActiveFastServiceModal(action);
                    }
                  }}
                />

                {/* Quick Voucher Strip */}
                <QuickVoucherBar
                  vouchers={vouchers}
                  onToggleSaveVoucher={handleToggleSaveVoucher}
                />
              </>
            )}

            {/* Categories Grid */}
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={(catId) => setSelectedCategory(catId)}
              title={siteConfig.categoriesSectionTitle}
            />

            {/* Flash Sale Section */}
            {!searchQuery && selectedCategory === 'all' && (
              <section id="flash-sale-section">
                <FlashSaleSection
                  products={products}
                  title={siteConfig.flashSaleTitle}
                  onOpenProduct={(p) => setActiveDetailProduct(p)}
                />
              </section>
            )}

            {/* Daily Discovery & Product Catalog */}
            <section className="space-y-4">
              
              {/* Filter & Sort Bar */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#ee4d2d] flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">
                      {searchQuery
                        ? `Kết quả tìm kiếm cho: "${searchQuery}" (${filteredProducts.length})`
                        : selectedCategory !== 'all'
                        ? `Sản phẩm ngành: ${categories.find(c => c.id === selectedCategory)?.name || ''} (${filteredProducts.length})`
                        : (siteConfig.discoveryTitle || 'GỢI Ý HÔM NAY - DÀNH RIÊNG CHO BẠN')}
                    </h2>
                  </div>
                </div>

                {/* Sorters & Filters */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-500 font-bold hidden sm:inline">Sắp xếp theo:</span>
                  
                  <button
                    onClick={() => setSortOption('popular')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                      sortOption === 'popular' ? 'bg-[#ee4d2d] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Phổ Biến
                  </button>

                  <button
                    onClick={() => setSortOption('latest')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                      sortOption === 'latest' ? 'bg-[#ee4d2d] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Mới Nhất
                  </button>

                  <button
                    onClick={() => setSortOption('top_sales')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                      sortOption === 'top_sales' ? 'bg-[#ee4d2d] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Bán Chạy
                  </button>

                  {/* Price dropdown */}
                  <select
                    value={sortOption.startsWith('price') ? sortOption : ''}
                    onChange={(e) => setSortOption(e.target.value as any)}
                    className="px-3 py-1.5 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border-0 focus:outline-none cursor-pointer"
                  >
                    <option value="">Giá: Mặc định</option>
                    <option value="price_asc">Giá: Thấp đến Cao</option>
                    <option value="price_desc">Giá: Cao đến Thấp</option>
                  </select>

                  {/* Badges Filters */}
                  <button
                    onClick={() => setFilterOnlyMall(!filterOnlyMall)}
                    className={`px-2.5 py-1.5 rounded-xl font-bold border transition-colors cursor-pointer ${
                      filterOnlyMall ? 'bg-red-50 border-red-500 text-red-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Hàng Chính Hãng
                  </button>

                  <button
                    onClick={() => setFilterOnlyFreeship(!filterOnlyFreeship)}
                    className={`px-2.5 py-1.5 rounded-xl font-bold border transition-colors cursor-pointer ${
                      filterOnlyFreeship ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Freeship Xtra
                  </button>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-slate-200">
                  <div className="w-16 h-16 mx-auto rounded-full bg-orange-100 text-[#ee4d2d] flex items-center justify-center font-bold text-2xl">
                    🔍
                  </div>
                  <h3 className="text-base font-bold text-slate-800">Không tìm thấy sản phẩm phù hợp</h3>
                  <p className="text-xs text-slate-400">Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc nhé!</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setFilterOnlyMall(false);
                      setFilterOnlyFreeship(false);
                    }}
                    className="px-5 py-2 bg-[#ee4d2d] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    Xóa Bộ Lọc
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOpen={(p) => setActiveDetailProduct(p)}
                      onQuickEdit={(p) => setEditingProduct(p)}
                      onDelete={handleDeleteProduct}
                      isSellerMode={false}
                    />
                  ))}
                </div>
              )}

            </section>
          </div>
        )}

      </main>

      {/* Product Detail Modal */}
      {activeDetailProduct && (
        <ProductDetailModal
          product={activeDetailProduct}
          allProducts={products}
          onSelectProduct={(p) => setActiveDetailProduct(p)}
          onClose={() => setActiveDetailProduct(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onEditProduct={(p) => {
            setActiveDetailProduct(null);
            setEditingProduct(p);
          }}
          isSellerMode={viewMode === 'seller'}
        />
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          categories={categories}
          onClose={() => setEditingProduct(null)}
          onSave={handleUpdateProduct}
        />
      )}

      {/* Cart Drawer / Modal */}
      {isCartOpen && (
        <CartModal
          cart={cart}
          vouchers={vouchers}
          coinsBalance={shopSettings.coinsBalance}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={handleUpdateCartQuantity}
          onToggleSelect={handleToggleSelectCartItem}
          onToggleSelectAll={handleToggleSelectAllCart}
          onRemoveItem={handleRemoveCartItem}
          onProceedToCheckout={handleProceedToCheckout}
        />
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          items={cart.filter(i => i.selected)}
          voucher={checkoutVoucher}
          useCoins={checkoutUseCoins}
          coinsBalance={shopSettings.coinsBalance}
          onClose={() => setIsCheckoutOpen(false)}
          onSuccessOrder={handleOrderSuccess}
          currentCustomer={currentCustomer}
          onOpenCustomerAuth={() => setIsCustomerAuthOpen(true)}
          onOpenOrderTracking={(orderId) => {
            setTrackingOrderId(orderId || null);
            setIsOrderTrackingOpen(true);
          }}
          walletBalance={buyerWallet.balance}
          onOpenWallet={() => setIsWalletOpen(true)}
        />
      )}

      {/* Customer Authentication Modal (Facebook, Gmail, Số điện thoại) */}
      <CustomerAuthModal
        isOpen={isCustomerAuthOpen}
        onClose={() => setIsCustomerAuthOpen(false)}
        initialMode={customerAuthInitialMode}
        onSuccessLogin={handleCustomerLoginSuccess}
      />

      {/* VIETSHOP WALLET MODAL (Ví Điện Tử VIETSHOP Pay) */}
      <VietshopWalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        wallet={buyerWallet}
        onTopUp={handleTopUpWallet}
        onWithdraw={handleWithdrawWallet}
      />

      {/* Customer Order Tracking Modal (Đơn hàng của bạn) */}
      <CustomerOrderTrackingModal
        isOpen={isOrderTrackingOpen}
        onClose={() => setIsOrderTrackingOpen(false)}
        orders={orders}
        currentCustomer={currentCustomer}
        initialSelectedOrderId={trackingOrderId}
        onOpenLoginModal={() => {
          setIsOrderTrackingOpen(false);
          setIsCustomerAuthOpen(true);
        }}
        onCancelOrder={handleCancelOrder}
        onOpenCustomerSupport={() => {
          setIsOrderTrackingOpen(false);
          setIsAiCustomerChatOpen(true);
        }}
      />

      {/* Fast Services Interactive Modals (8 Buttons under Banner) */}
      <FastServiceModals
        activeModal={activeFastServiceModal}
        onClose={() => setActiveFastServiceModal(null)}
        vouchers={vouchers}
        onToggleSaveVoucher={handleToggleSaveVoucher}
        coinsBalance={shopSettings.coinsBalance}
        onAddCoins={handleAddCoins}
        products={products}
        onSelectProduct={(p) => setActiveDetailProduct(p)}
        onFilterFlashSale={() => {
          document.getElementById('flash-sale-section')?.scrollIntoView({ behavior: 'smooth' });
          setActiveFastServiceModal(null);
        }}
        onFilterMall={() => {
          setFilterOnlyMall(true);
          setActiveFastServiceModal(null);
        }}
        onFilterFreeship={() => {
          setFilterOnlyFreeship(true);
          setActiveFastServiceModal(null);
        }}
      />

      {/* Admin Login Modal (Mật khẩu bí mật 54321 cho Quản Trị Hệ Thống Đầu Trang) */}
      {isAdminLoginOpen && (
        <AdminLoginModal
          onSuccess={() => {
            setIsAdminAuthenticated(true);
            setIsAdminLoginOpen(false);
            setViewMode('admin');
          }}
          onClose={() => setIsAdminLoginOpen(false)}
        />
      )}

      {/* Seller Login & Password Verification Modal (Khoá bảo vệ Kênh Người Bán) */}
      {isSellerLoginOpen && (
        <SellerLoginModal
          correctPassword={siteConfig.sellerPassword || '54321'}
          onClose={() => setIsSellerLoginOpen(false)}
          onSuccessLogin={(role) => {
            if (role) setCurrentRole(role);
            setIsSellerAuthenticated(true);
            setIsSellerLoginOpen(false);
            setViewMode('seller');
          }}
          onSuccess={() => {
            setIsSellerAuthenticated(true);
            setIsSellerLoginOpen(false);
            setViewMode('seller');
          }}
          onUpdateShopSettings={(newSettings) => {
            setShopSettings(prev => ({ ...prev, ...newSettings }));
          }}
          onOpenFullRegistration={() => {
            setIsSellerLoginOpen(false);
            setIsSellerRegistrationOpen(true);
          }}
        />
      )}

      {/* Seller Registration Modal (Quy trình nộp hồ sơ mở gian hàng) */}
      <SellerRegistrationModal
        isOpen={isSellerRegistrationOpen}
        onClose={() => setIsSellerRegistrationOpen(false)}
        onSubmitApplication={(newApp) => {
          setApplications(prev => [newApp, ...prev]);
        }}
      />

      {/* Live Visual Text & Banner Editor Modal */}
      {isLiveTextEditorOpen && (
        <LiveTextEditorModal
          siteConfig={siteConfig}
          onClose={() => setIsLiveTextEditorOpen(false)}
          onSave={(updatedConfig) => {
            setSiteConfig(updatedConfig);
            setIsLiveTextEditorOpen(false);
          }}
        />
      )}

      {/* Footer Info Modal (Trung tâm trợ giúp, hướng dẫn, thanh toán, tuyển dụng...) */}
      {footerModalTab && (
        <FooterInfoModal
          initialTab={footerModalTab}
          shopName={shopSettings.shopName || 'VIETSHOP'}
          onClose={() => setFooterModalTab(null)}
          onOpenInstallModal={() => {
            setFooterModalTab(null);
            setIsInstallModalOpen(true);
          }}
        />
      )}

      {/* PWA Install Prompt Modal (Hộp thoại hướng dẫn & nút cài đặt ứng dụng vào điện thoại) */}
      <PwaInstallPromptModal
        isOpen={isInstallModalOpen}
        onClose={() => {
          setIsInstallModalOpen(false);
          sessionStorage.setItem('vietshop_install_dismissed_session', 'true');
        }}
      />

      {/* PWA Quick Floating Banner / Trigger for Mobile & Desktop */}
      <PwaQuickBanner
        onOpenModal={() => setIsInstallModalOpen(true)}
      />

      {/* AI Customer Chat Assistant Modal (Tự động tư vấn sản phẩm, tìm kiếm từ khóa, mã voucher) */}
      <AiCustomerChatModal
        isOpen={isAiCustomerChatOpen}
        onClose={() => setIsAiCustomerChatOpen(false)}
        products={products}
        vouchers={vouchers}
        shopSettings={shopSettings}
        onOpenProduct={(productId) => {
          const found = products.find(p => p.id === productId);
          if (found) {
            setActiveDetailProduct(found);
            setIsAiCustomerChatOpen(false);
          }
        }}
        onAddToCart={handleAddToCart}
        onToggleSaveVoucher={handleToggleSaveVoucher}
      />

      {/* AI Seller Assistant Modal (Tạo sản phẩm tự động, tối ưu thông tin, tạo voucher bằng AI) */}
      <AiSellerAssistantModal
        isOpen={isAiSellerAssistantOpen}
        onClose={() => setIsAiSellerAssistantOpen(false)}
        categories={categories}
        products={products}
        onAddProduct={(newProd) => {
          handleAddProduct(newProd);
        }}
        onUpdateProduct={(upProd) => {
          handleUpdateProduct(upProd);
        }}
        onAddVoucher={(newVc) => {
          handleAddVoucher(newVc);
        }}
      />

      {/* Floating AI Assistant Action Widget for Buyer Mode */}
      {viewMode === 'buyer' && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
          <div className="bg-slate-900/90 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xl backdrop-blur-xs flex items-center gap-1.5 border border-white/10 animate-bounce duration-1000 hidden sm:flex">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Cần tư vấn chọn đồ? Chat với AI ngay!</span>
          </div>
          
          <button
            onClick={() => setIsAiCustomerChatOpen(true)}
            aria-label="Mở Trợ Lý AI VIETSHOP"
            className="group relative bg-gradient-to-r from-[#ee4d2d] via-orange-500 to-amber-500 hover:from-[#d73211] hover:to-orange-600 text-white p-3.5 sm:p-4 rounded-full shadow-2xl shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2.5 ring-4 ring-orange-200/50"
          >
            <div className="relative">
              <Bot className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full"></span>
            </div>
            <span className="font-extrabold text-xs sm:text-sm tracking-tight pr-1">
              AI Trợ Lý VIETSHOP
            </span>
          </button>
        </div>
      )}

      {/* VIETSHOP Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">CHĂM SÓC KHÁCH HÀNG</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li onClick={() => setFooterModalTab('help_center')} className="hover:text-[#ee4d2d] cursor-pointer transition-colors">
                  Trung Tâm Trợ Giúp {shopSettings.shopName || 'VIETSHOP'}
                </li>
                <li onClick={() => setFooterModalTab('shopping_guide')} className="hover:text-[#ee4d2d] cursor-pointer transition-colors">
                  Hướng Dẫn Mua Hàng & Săn Voucher
                </li>
                <li onClick={() => setFooterModalTab('payment_shipping')} className="hover:text-[#ee4d2d] cursor-pointer transition-colors">
                  Thanh Toán & Vận Chuyển Hỏa Tốc
                </li>
                <li onClick={() => setFooterModalTab('return_refund')} className="hover:text-[#ee4d2d] cursor-pointer transition-colors">
                  Trả Hàng & Hoàn Tiền 15 Ngày
                </li>
                <li onClick={() => setFooterModalTab('contact')} className="hover:text-[#ee4d2d] cursor-pointer transition-colors">
                  Liên Hệ Hotline & Tổng Đài Chăm Sóc
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">VỀ {shopSettings.shopName || 'VIETSHOP'}</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li onClick={() => setFooterModalTab('about_us')} className="hover:text-[#ee4d2d] cursor-pointer transition-colors">
                  Giới Thiệu Về {shopSettings.shopName || 'VIETSHOP'} Việt Nam
                </li>
                <li onClick={() => setFooterModalTab('careers')} className="hover:text-[#ee4d2d] cursor-pointer transition-colors">
                  Tuyển Dụng & Cơ Hội Nghề Nghiệp
                </li>
                <li onClick={() => setFooterModalTab('terms')} className="hover:text-[#ee4d2d] cursor-pointer transition-colors">
                  Điều Khoản Dịch Vụ
                </li>
                <li onClick={() => setFooterModalTab('privacy')} className="hover:text-[#ee4d2d] cursor-pointer transition-colors">
                  Chính Sách Bảo Mật
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">THANH TOÁN & VẬN CHUYỂN</h4>
              <p className="text-[11px] text-slate-500 mb-2.5">Nhấn để xem hướng dẫn chi tiết từng cổng:</p>
              <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-700">
                {['VIETSHOP Pay', 'Visa / Master', 'COD Tiền Mặt', 'VietQR', 'VIETSHOP Xpress', 'GHTK / GHN'].map((method) => (
                  <button
                    key={method}
                    onClick={() => {
                      if (method === 'VIETSHOP Pay') {
                        setIsWalletOpen(true);
                      } else {
                        setFooterModalTab('payment_shipping');
                      }
                    }}
                    className="p-1.5 bg-slate-100 hover:bg-orange-100 hover:text-orange-700 rounded transition-colors cursor-pointer"
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">LIÊN HỆ & TẢI ỨNG DỤNG</h4>
              <p className="text-[11px] text-slate-500 mb-1">
                {siteConfig.footerAbout || `${shopSettings.shopName || 'VIETSHOP'} - Nền tảng thương mại điện tử hàng đầu.`}
              </p>
              <p 
                onClick={() => setFooterModalTab('contact')}
                className="text-[11px] font-semibold text-slate-700 mb-2 hover:text-[#ee4d2d] cursor-pointer"
              >
                Hotline: {siteConfig.footerHotline || '1900 1221 (8h00 - 21h00)'}
              </p>
              <div className="flex gap-2 items-center">
                <div 
                  onClick={() => setIsInstallModalOpen(true)}
                  className="w-16 h-16 bg-white hover:bg-orange-50 rounded-xl flex flex-col items-center justify-center text-[10px] font-bold text-slate-700 border border-slate-200 shadow-xs cursor-pointer text-center p-1 group transition"
                  title="Cài đặt VIETSHOP vào điện thoại"
                >
                  <img
                    src="/pwa-192x192.png"
                    alt="VIETSHOP"
                    className="w-8 h-8 rounded-lg mb-0.5 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/icon.svg';
                    }}
                  />
                  <span className="text-[9px] font-bold text-[#ee4d2d] leading-none">Cài App</span>
                </div>
                <div className="space-y-1 text-[10px]">
                  <button 
                    onClick={() => setIsInstallModalOpen(true)}
                    className="block w-full text-left px-2 py-1 bg-slate-100 hover:bg-orange-100 hover:text-orange-700 rounded font-semibold cursor-pointer transition"
                  >
                    📲 Cài đặt cho iPhone (iOS)
                  </button>
                  <button 
                    onClick={() => setIsInstallModalOpen(true)}
                    className="block w-full text-left px-2 py-1 bg-slate-100 hover:bg-orange-100 hover:text-orange-700 rounded font-semibold cursor-pointer transition"
                  >
                    📲 Cài đặt cho Android
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-[11px] gap-2">
            <span>© 2026 {shopSettings.shopName || 'VIETSHOP'} - Siêu Thị Trực Tuyến. Tất cả các quyền được bảo lưu.</span>
            <div className="flex items-center gap-3">
              <span onClick={() => setFooterModalTab('terms')} className="hover:text-slate-600 cursor-pointer">Điều khoản</span>
              <span>•</span>
              <span onClick={() => setFooterModalTab('privacy')} className="hover:text-slate-600 cursor-pointer">Bảo mật</span>
              <span>•</span>
              <span onClick={() => setFooterModalTab('contact')} className="hover:text-slate-600 cursor-pointer">Liên hệ</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
