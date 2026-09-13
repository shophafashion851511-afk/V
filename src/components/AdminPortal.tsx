import React, { useState } from 'react';
import { 
  SiteConfig, ShopSettings, Category, Product, Order, Voucher,
  SellerRegistrationApplication, WithdrawalRequest, WalletTransaction,
  MarketingCampaign, UserRole, OrderStatus
} from '../types';
import { SiteManagementView } from './SiteManagementView';
import { AdminSupervisionView } from './AdminSupervisionView';
import { SellerCenter } from './SellerCenter';
import { storage } from '../utils/storage';
import { formatVND } from '../utils/formatters';
import { 
  ShieldCheck, LayoutTemplate, Store, Package, ShoppingBag, 
  Lock, Eye, EyeOff, Check, AlertCircle, ArrowLeft, KeyRound,
  Trash2, Sparkles, ExternalLink, RefreshCw, ToggleLeft, ToggleRight,
  HelpCircle, CheckCircle2, Sliders, ShieldAlert
} from 'lucide-react';

interface AdminPortalProps {
  siteConfig: SiteConfig;
  shopSettings: ShopSettings;
  categories: Category[];
  products: Product[];
  orders: Order[];
  vouchers: Voucher[];
  applications: SellerRegistrationApplication[];
  withdrawals: WithdrawalRequest[];
  transactions?: WalletTransaction[];
  marketingCampaigns?: MarketingCampaign[];
  currentRole?: UserRole;
  onSaveSiteConfig: (newConfig: SiteConfig) => void;
  onUpdateShopSettings: (newSettings: ShopSettings) => void;
  onUpdateCategories: (categories: Category[]) => void;
  onApproveApplication: (appId: string) => void;
  onRejectApplication: (appId: string, reason?: string) => void;
  onApproveWithdrawal: (withdrawalId: string) => void;
  onRejectWithdrawal: (withdrawalId: string, reason?: string) => void;
  onUpdateProducts: (products: Product[]) => void;
  onUpdateOrders: (orders: Order[]) => void;
  onAddProduct?: (newProduct: Product) => void;
  onUpdateProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  onUpdateOrderStatus?: (orderId: string, status: OrderStatus) => void;
  onAddVoucher?: (voucher: Voucher) => void;
  onDeleteVoucher?: (voucherId: string) => void;
  onResetAllData?: () => void;
  onOpenEditModal?: (product: Product) => void;
  onOpenAiAssistant?: () => void;
  onAddTransaction?: (tx: WalletTransaction) => void;
  onAddWithdrawal?: (wd: WithdrawalRequest) => void;
  onAddMarketingCampaign?: (camp: MarketingCampaign) => void;
  onToggleMarketingCampaign?: (campId: string) => void;
  onDeleteMarketingCampaign?: (campId: string) => void;
  onChangeRole?: (role: UserRole) => void;
  onBackToBuyer: () => void;
  onLogoutAdmin: () => void;
}

type AdminTab = 'site_content' | 'seller_center' | 'supervision' | 'products' | 'orders' | 'security';

export const AdminPortal: React.FC<AdminPortalProps> = ({
  siteConfig,
  shopSettings,
  categories,
  products,
  orders,
  vouchers,
  applications,
  withdrawals,
  transactions = [],
  marketingCampaigns = [],
  currentRole = 'admin',
  onSaveSiteConfig,
  onUpdateShopSettings,
  onUpdateCategories,
  onApproveApplication,
  onRejectApplication,
  onApproveWithdrawal,
  onRejectWithdrawal,
  onUpdateProducts,
  onUpdateOrders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onAddVoucher,
  onDeleteVoucher,
  onResetAllData,
  onOpenEditModal,
  onOpenAiAssistant,
  onAddTransaction,
  onAddWithdrawal,
  onAddMarketingCampaign,
  onToggleMarketingCampaign,
  onDeleteMarketingCampaign,
  onChangeRole,
  onBackToBuyer,
  onLogoutAdmin
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('site_content');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Change Password Form State
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPasswordChars, setShowPasswordChars] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Footer Seller Link Visibility
  const [showFooterSellerLink, setShowFooterSellerLink] = useState<boolean>(() => {
    return siteConfig.showFooterSellerLink !== false;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Change Password Submit
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    const currentPass = storage.getAdminPassword();
    if (oldPasswordInput !== currentPass) {
      setPasswordError('Mật khẩu quản trị hiện tại không chính xác!');
      return;
    }
    if (!newPasswordInput.trim() || newPasswordInput.trim().length < 4) {
      setPasswordError('Mật khẩu quản trị mới phải có ít nhất 4 ký tự!');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordError('Mật khẩu mới và xác nhận mật khẩu không khớp nhau!');
      return;
    }

    storage.saveAdminPassword(newPasswordInput.trim());
    onSaveSiteConfig({
      ...siteConfig,
      adminPassword: newPasswordInput.trim(),
      sellerPassword: newPasswordInput.trim()
    });

    setPasswordSuccess('Đổi mật khẩu quản trị hệ thống thành công! Mật khẩu mới đã được lưu an toàn.');
    setOldPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    showToast('Đã đổi mật khẩu Quản Trị thành công!');
  };

  // Toggle or Delete Footer Seller Channel Link
  const handleToggleFooterSeller = (enable: boolean) => {
    setShowFooterSellerLink(enable);
    const updated = { ...siteConfig, showFooterSellerLink: enable };
    onSaveSiteConfig(updated);
    storage.saveSiteConfig(updated);
    showToast(enable 
      ? 'Đã BẬT hiển thị chữ "Kênh Người Bán" ở cuối trang!' 
      : 'Đã XOÁ / ẨN hoàn toàn chữ "Kênh Người Bán" ở cuối trang!'
    );
  };

  // Handle Delete Product from Admin
  const handleDeleteProduct = (productId: string, productName: string) => {
    if (window.confirm(`Bạn có chắc muốn xoá sản phẩm "${productName}" khỏi sàn VIETSHOP?`)) {
      const updated = products.filter(p => p.id !== productId);
      onUpdateProducts(updated);
      showToast(`Đã xoá sản phẩm "${productName}" thành công!`);
    }
  };

  // Count pending items
  const pendingAppsCount = applications.filter(a => a.status === 'pending').length;
  const pendingWithdrawalsCount = withdrawals.filter(w => w.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-16">
      {/* Top Banner Header for Admin */}
      <div className="bg-slate-900 text-white border-b border-slate-800 shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Left Brand info */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-[#ee4d2d] flex items-center justify-center shadow-md shadow-purple-500/30">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                      VIETSHOP ADMIN PORTAL
                    </h1>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/30 text-purple-300 border border-purple-400/30">
                      Tối Cao
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Khu vực Quản Trị Hệ Thống Toàn Sàn • Độc lập và bảo mật riêng biệt
                  </p>
                </div>
              </div>

              {/* Mobile back button */}
              <button
                onClick={onBackToBuyer}
                className="md:hidden p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                title="Về Trang Mua Sắm"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Right Action buttons */}
            <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
              <button
                onClick={() => setActiveTab('seller_center')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'seller_center'
                    ? 'bg-gradient-to-r from-orange-500 to-[#ee4d2d] text-white shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-orange-300 border border-orange-500/30'
                }`}
                title="Mở Kênh Người Bán & Quản Trị Gian Hàng"
              >
                <Store className="w-3.5 h-3.5 text-orange-400" />
                <span>🏪 Kênh Người Bán</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'security'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Đổi Mật Khẩu Quản Trị</span>
              </button>

              <button
                onClick={onBackToBuyer}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Trang Mua Sắm</span>
              </button>

              <button
                onClick={onLogoutAdmin}
                className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Đăng Xuất</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="max-w-7xl mx-auto px-4 mt-3">
          <div className="p-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-4 space-y-4">
        
        {/* Navigation Tabs Bar */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-200 flex gap-1.5 overflow-x-auto custom-scrollbar">
          {[
            { 
              id: 'site_content', 
              label: '🛠️ Cấu Hình Toàn Trang',
              desc: 'Banner, Tiêu đề, Dịch vụ nhanh, Hotline' 
            },
            { 
              id: 'seller_center', 
              label: '🏪 Kênh Người Bán (Quản Trị Shop)', 
              desc: 'Đăng bán SP, kho hàng, marketing, ví doanh thu' 
            },
            { 
              id: 'supervision', 
              label: '🛡️ Phê Duyệt & Giám Sát', 
              count: pendingAppsCount + pendingWithdrawalsCount,
              desc: 'Duyệt gian hàng, rút tiền'
            },
            { 
              id: 'products', 
              label: '📦 Kho Hàng Toàn Sàn', 
              count: products.length,
              desc: 'Kiểm soát kho hàng toàn sàn'
            },
            { 
              id: 'orders', 
              label: '📋 Quản Lý Đơn Hàng', 
              count: orders.length,
              desc: 'Theo dõi đơn hàng khách mua'
            },
            { 
              id: 'security', 
              label: '🔒 Bảo Mật Quản Trị',
              desc: 'Đổi mật khẩu kín & Bảo vệ Kênh Người Bán'
            },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-md shadow-purple-600/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === tab.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: CẤU HÌNH & SỬA CHỮA TOÀN TRANG (SITE CONTENT & BANNERS) */}
        {/* ========================================================================= */}
        {activeTab === 'site_content' && (
          <SiteManagementView
            siteConfig={siteConfig}
            shopSettings={shopSettings}
            categories={categories}
            onSaveSiteConfig={onSaveSiteConfig}
            onUpdateShopSettings={onUpdateShopSettings}
            onUpdateCategories={onUpdateCategories}
            onPreviewBuyerMode={onBackToBuyer}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB: KÊNH NGƯỜI BÁN & QUẢN TRỊ SHOP (TÍCH HỢP NỘI BỘ TRONG QUẢN TRỊ) */}
        {/* ========================================================================= */}
        {activeTab === 'seller_center' && (
          <div className="space-y-4">
            {/* Banner Thông Báo Đã Bảo Vệ An Toàn */}
            <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-[#ee4d2d] text-white flex items-center justify-center font-black shrink-0 shadow-md shadow-orange-500/20">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    Kênh Người Bán Đang Chạy Trong Quản Trị Hệ Thống
                  </h3>
                  <p className="text-xs text-slate-600">
                    Kênh Người Bán đã được di chuyển vào bên trong khu vực Quản Trị Hệ Thống và ẩn hoàn toàn khỏi giao diện người mua bên ngoài trang.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl shrink-0 border border-emerald-300 flex items-center gap-1.5 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Đã Ẩn Khỏi Trang Chủ</span>
              </span>
            </div>

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
              onUpdateProduct={onUpdateProduct || (() => {})}
              onAddProduct={onAddProduct || (() => {})}
              onDeleteProduct={onDeleteProduct || ((id) => onUpdateProducts(products.filter(p => p.id !== id)))}
              onUpdateOrderStatus={onUpdateOrderStatus || (() => {})}
              onAddVoucher={onAddVoucher || (() => {})}
              onDeleteVoucher={onDeleteVoucher || (() => {})}
              onUpdateShopSettings={onUpdateShopSettings}
              onUpdateSiteConfig={onSaveSiteConfig}
              onUpdateCategories={onUpdateCategories}
              onResetAllData={onResetAllData || (() => {})}
              onOpenEditModal={onOpenEditModal || (() => {})}
              onBackToBuyer={onBackToBuyer}
              onOpenAiAssistant={onOpenAiAssistant}
              onApproveApplication={onApproveApplication}
              onRejectApplication={onRejectApplication}
              onApproveWithdrawal={onApproveWithdrawal}
              onRejectWithdrawal={onRejectWithdrawal}
              onAddTransaction={onAddTransaction}
              onAddWithdrawal={onAddWithdrawal}
              onAddMarketingCampaign={onAddMarketingCampaign}
              onToggleMarketingCampaign={onToggleMarketingCampaign}
              onDeleteMarketingCampaign={onDeleteMarketingCampaign}
              onChangeRole={onChangeRole}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PHÊ DUYỆT GIAN HÀNG & GIÁM SÁT TOÀN SÀN */}
        {/* ========================================================================= */}
        {activeTab === 'supervision' && (
          <AdminSupervisionView
            applications={applications}
            withdrawals={withdrawals}
            orders={orders}
            products={products}
            onApproveApplication={onApproveApplication}
            onRejectApplication={onRejectApplication}
            onApproveWithdrawal={onApproveWithdrawal}
            onRejectWithdrawal={onRejectWithdrawal}
            onRefreshData={() => showToast('Đã đồng bộ lại dữ liệu giám sát sàn!')}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 3: QUẢN LÝ TẤT CẢ SẢN PHẨM TRÊN SÀN */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-slate-900 text-base">
                  Danh Sách Toàn Bộ Sản Phẩm Sàn VIETSHOP ({products.length} sản phẩm)
                </h3>
                <p className="text-xs text-slate-500">
                  Quản trị viên có quyền kiểm tra, duyệt và xóa sản phẩm vi phạm tiêu chuẩn cộng đồng.
                </p>
              </div>
              <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                Tổng giá trị hàng hoá: {formatVND(products.reduce((s, p) => s + p.price * (p.stock || 10), 0))}
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Sản Phẩm</th>
                    <th className="p-3">Danh Mục</th>
                    <th className="p-3">Giá Bán</th>
                    <th className="p-3">Đã Bán</th>
                    <th className="p-3">Tồn Kho</th>
                    <th className="p-3">Đánh Giá</th>
                    <th className="p-3 text-right">Thao Tác Quản Trị</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 flex items-center gap-2.5">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" 
                        />
                        <div className="min-w-0 max-w-xs">
                          <div className="font-bold text-slate-900 truncate" title={product.name}>
                            {product.name}
                          </div>
                          <div className="text-[10px] text-slate-400">ID: {product.id}</div>
                        </div>
                      </td>
                      <td className="p-3 font-medium text-slate-600">
                        {categories.find(c => c.id === product.category)?.name || product.category}
                      </td>
                      <td className="p-3 font-bold text-red-600">
                        {formatVND(product.price)}
                      </td>
                      <td className="p-3 text-slate-600">
                        {product.sold || 0}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          (product.stock || 0) < 10 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {product.stock || 0}
                        </span>
                      </td>
                      <td className="p-3 text-amber-500 font-bold">
                        ★ {product.rating || 5.0}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Gỡ bỏ</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: QUẢN LÝ TOÀN BỘ ĐƠN HÀNG TRÊN SÀN */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-slate-900 text-base">
                  Quản Lý Toàn Bộ Đơn Hàng Sàn ({orders.length} đơn hàng)
                </h3>
                <p className="text-xs text-slate-500">
                  Giám sát tiến độ giao nhận, thanh toán qua Ví VIETSHOP hoặc COD toàn sàn.
                </p>
              </div>
              <div className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
                Doanh thu tổng: {formatVND(orders.reduce((s, o) => s + o.total, 0))}
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <ShoppingBag className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p>Chưa có đơn hàng nào phát sinh trên sàn.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(order => (
                  <div key={order.id} className="p-4 rounded-2xl border border-slate-200 hover:border-purple-300 transition-colors bg-white">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2 mb-3">
                      <div>
                        <span className="font-mono font-bold text-purple-700 text-sm">#{order.id}</span>
                        <span className="text-xs text-slate-400 ml-2">Ngày đặt: {order.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">
                          Khách: <strong>{order.customerName}</strong> ({order.phone})
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                          {order.paymentMethod === 'vietshop_wallet' ? 'Ví VIETSHOP Pay' : order.paymentMethod}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {order.status === 'completed' ? 'Đã Giao Thành Công' : order.status === 'delivering' ? 'Đang Vận Chuyển' : 'Chờ Xác Nhận'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="truncate max-w-md">{it.name} x{it.quantity}</span>
                          <span className="font-semibold text-slate-900">{formatVND(it.price * it.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center">
                      <div className="text-[11px] text-slate-500">
                        Địa chỉ: {order.address}
                      </div>
                      <div className="text-sm font-black text-red-600">
                        Tổng tiền: {formatVND(order.total)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: BẢO MẬT & CÀI ĐẶT RIÊNG QUẢN TRỊ */}
        {/* ========================================================================= */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            
            {/* 1. Form Đổi Mật Khẩu Quản Trị */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Đổi Mật Khẩu Quản Trị Hệ Thống (Chỉ Quản Trị Mới Có Quyền)
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Mật khẩu này dùng để mở khóa toàn bộ quyền Quản Trị VIETSHOP ở đầu trang. Không một ai bên ngoài hoặc người bán có thể biết mật khẩu này.
                  </p>
                </div>
              </div>

              {passwordError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Mật khẩu Quản Trị hiện tại *</label>
                    <button
                      type="button"
                      onClick={() => setShowPasswordChars(!showPasswordChars)}
                      className="text-[11px] text-slate-500 hover:text-purple-600 flex items-center gap-1 cursor-pointer font-medium"
                    >
                      {showPasswordChars ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showPasswordChars ? 'Ẩn ký tự' : 'Hiện ký tự'}</span>
                    </button>
                  </div>
                  <input
                    type={showPasswordChars ? 'text' : 'password'}
                    value={oldPasswordInput}
                    onChange={(e) => setOldPasswordInput(e.target.value)}
                    placeholder="Nhập mật khẩu đang dùng (mặc định ban đầu: 54321)..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-purple-600 font-mono tracking-wider"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Mật khẩu Quản Trị MỚI *</label>
                    <input
                      type={showPasswordChars ? 'text' : 'password'}
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      placeholder="Tối thiểu 4 ký tự..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-purple-700 focus:bg-white focus:outline-none focus:border-purple-600 font-mono tracking-wider"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Xác nhận mật khẩu MỚI *</label>
                    <input
                      type={showPasswordChars ? 'text' : 'password'}
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      placeholder="Nhập lại mật khẩu mới..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-purple-700 focus:bg-white focus:outline-none focus:border-purple-600 font-mono tracking-wider"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 text-white font-black text-xs sm:text-sm rounded-xl shadow-md shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>LƯU & ĐỔI MẬT KHẨU MỚI</span>
                </button>
              </form>
            </div>

            {/* 2. Cài Đặt Hiển Thị / Xoá Chữ Kênh Người Bán Ở Cuối Trang (Footer) */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Store className="w-5 h-5 text-orange-600" />
                    <h3 className="text-base font-black text-slate-900">
                      Bảo Mật Kênh Người Bán (Đã Đưa Vào Nội Bộ Quản Trị)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                    Theo yêu cầu của bạn: <strong>Kênh Người Bán đã được tích hợp trực tiếp vào bên trong Quản Trị Hệ Thống</strong> (Tab "🏪 Kênh Người Bán"). Đồng thời, toàn bộ nút đăng ký, đăng nhập và liên kết Kênh Người Bán trên Header và Trang chủ đã được ẩn đi, chỉ có quản trị viên sau khi đăng nhập quản trị mới truy cập được.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('seller_center')}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-[#ee4d2d] hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Store className="w-4 h-4" />
                  <span>Mở Kênh Người Bán Ngay</span>
                </button>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 font-bold">
                  <span>Trạng thái hiển thị ngoài trang chủ:</span>
                  {showFooterSellerLink ? (
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Đang cho phép hiển thị chữ ở chân trang
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-lg flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Đã Ẩn / Xoá Hoàn Toàn Khỏi Toàn Bộ Giao Diện Người Mua
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {showFooterSellerLink ? (
                    <button
                      type="button"
                      onClick={() => handleToggleFooterSeller(false)}
                      className="px-4 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Tắt / Ẩn Khỏi Trang Ngay</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleToggleFooterSeller(true)}
                      className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>Cho Phép Hiện Lại</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
