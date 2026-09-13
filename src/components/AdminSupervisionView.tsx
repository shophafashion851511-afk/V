import React, { useState } from 'react';
import { 
  ShieldCheck, CheckCircle2, XCircle, AlertTriangle, 
  Store, Wallet, Users, ArrowUpRight, Search, Clock, 
  FileText, ExternalLink, Filter, Check, Eye, Lock, Unlock,
  CreditCard, RefreshCw, Send, Sparkles, Building2
} from 'lucide-react';
import { SellerRegistrationApplication, WithdrawalRequest, Order, Product } from '../types';
import { formatVND } from '../utils/formatters';
import { playSuccessChime } from '../utils/audio';

interface AdminSupervisionViewProps {
  applications: SellerRegistrationApplication[];
  withdrawals: WithdrawalRequest[];
  orders: Order[];
  products: Product[];
  onApproveApplication: (appId: string) => void;
  onRejectApplication: (appId: string, reason?: string) => void;
  onApproveWithdrawal: (withdrawalId: string) => void;
  onRejectWithdrawal: (withdrawalId: string, reason?: string) => void;
  onRefreshData?: () => void;
}

export const AdminSupervisionView: React.FC<AdminSupervisionViewProps> = ({
  applications,
  withdrawals,
  orders,
  products,
  onApproveApplication,
  onRejectApplication,
  onApproveWithdrawal,
  onRejectWithdrawal,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'applications' | 'stores' | 'withdrawals' | 'audit'>('applications');
  const [appFilter, setAppFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedApp, setSelectedApp] = useState<SellerRegistrationApplication | null>(null);
  const [rejectReasonModal, setRejectReasonModal] = useState<{ id: string; type: 'app' | 'withdrawal' } | null>(null);
  const [reasonText, setReasonText] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Mock stores for platform management
  const [stores, setStores] = useState([
    {
      id: 'shop-01',
      name: 'VIETSHOP Official Mall',
      owner: 'Ban Quản Trị VIETSHOP',
      phone: '19001221',
      productsCount: products.length,
      revenue: orders.reduce((s, o) => s + o.total, 0),
      status: 'active',
      badge: 'Mall Chính Hãng',
      joinedAt: '2026-01-01'
    },
    {
      id: 'shop-02',
      name: 'Mai Beauty & Cosmetics Korea',
      owner: 'Trần Thị Mai',
      phone: '0933445566',
      productsCount: 42,
      revenue: 89400000,
      status: 'active',
      badge: 'Shop Yêu Thích',
      joinedAt: '2026-08-29'
    },
    {
      id: 'shop-03',
      name: 'An Phát Computer & Tech',
      owner: 'Lê Văn An',
      phone: '0988776655',
      productsCount: 18,
      revenue: 124000000,
      status: 'active',
      badge: 'Shop Yêu Thích+',
      joinedAt: '2026-08-15'
    }
  ]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleToggleStoreStatus = (storeId: string) => {
    setStores(prev => prev.map(s => {
      if (s.id === storeId) {
        const nextStatus = s.status === 'active' ? 'suspended' : 'active';
        showToast(`Đã chuyển trạng thái shop "${s.name}" sang: ${nextStatus === 'active' ? 'Hoạt động' : 'Tạm khóa'}`);
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const filteredApps = applications.filter(a => {
    if (appFilter === 'all') return true;
    return a.status === appFilter;
  });

  const pendingAppsCount = applications.filter(a => a.status === 'pending').length;
  const pendingWdCount = withdrawals.filter(w => w.status === 'pending').length;
  const totalPlatformRevenue = orders.reduce((s, o) => s + o.total, 0) + 213400000;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner: Admin Command Center */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-purple-500/30 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Ban Quản Trị & Giám Sát VIETSHOP</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Trung Tâm Kiểm Duyệt & Vận Hành Sàn Thương Mại
            </h2>
            <p className="text-xs text-purple-200/80 max-w-2xl">
              Giám sát hồ sơ đăng ký người bán mới, quản lý trạng thái các gian hàng, phê duyệt lệnh giải ngân ví Napas 24/7 và đảm bảo an toàn thương mại.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onRefreshData && (
              <button
                onClick={onRefreshData}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Đồng bộ</span>
              </button>
            )}
            <div className="px-4 py-2 rounded-xl bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-500/30">
              Role: System SuperAdmin
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="p-3 bg-purple-600 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Metric Quick Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
            <span>Hồ Sơ Chờ Duyệt</span>
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-amber-600">
            {pendingAppsCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Tổng {applications.length} hồ sơ đăng ký
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
            <span>Rút Tiền Ví Chờ Duyệt</span>
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-blue-600">
            {pendingWdCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Giải ngân Napas 24/7 tự động
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
            <span>Gian Hàng Hoạt Động</span>
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600">
              <Store className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {stores.filter(s => s.status === 'active').length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Trên 8 danh mục hàng hóa
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
            <span>Doanh Số Giám Sát Toàn Sàn</span>
            <span className="p-1.5 rounded-lg bg-purple-100 text-purple-600">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-purple-700">
            {formatVND(totalPlatformRevenue)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Tổng giao dịch thực tế
          </div>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto custom-scrollbar text-xs">
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'applications'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Hồ Sơ Đăng Ký Người Bán</span>
          {pendingAppsCount > 0 && (
            <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded-full">
              {pendingAppsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('stores')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'stores'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Quản Lý Gian Hàng ({stores.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'withdrawals'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Kiểm Duyệt Rút Tiền Ví</span>
          {pendingWdCount > 0 && (
            <span className="bg-blue-400 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
              {pendingWdCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'audit'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Nhật Ký Giám Sát Real-Time</span>
        </button>
      </div>

      {/* TAB 1: SELLER REGISTRATION APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span>Danh Sách Đơn Xin Mở Gian Hàng Bán Hàng</span>
                <span className="text-xs font-normal text-slate-500">
                  (Yêu cầu CCCD, Mã số thuế & Tài khoản ngân hàng)
                </span>
              </h3>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setAppFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer ${
                  appFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                Tất cả ({applications.length})
              </button>
              <button
                onClick={() => setAppFilter('pending')}
                className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer ${
                  appFilter === 'pending' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                Chờ duyệt ({pendingAppsCount})
              </button>
              <button
                onClick={() => setAppFilter('approved')}
                className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer ${
                  appFilter === 'approved' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                Đã duyệt
              </button>
            </div>
          </div>

          {filteredApps.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Không có hồ sơ nào trong trạng thái này.
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase text-[11px]">
                    <th className="p-3">Mã & Ngày nộp</th>
                    <th className="p-3">Tên Gian Hàng / Chủ Shop</th>
                    <th className="p-3">Ngành Hàng & Địa Chỉ Kho</th>
                    <th className="p-3">Mã Thuế / CCCD & Ngân Hàng</th>
                    <th className="p-3 text-center">Trạng Thái</th>
                    <th className="p-3 text-right">Thao Tác Quản Trị</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-slate-800">{app.id}</div>
                        <div className="text-[10px] text-slate-400">{app.submittedAt}</div>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-purple-900 text-sm flex items-center gap-1.5">
                          <Store className="w-3.5 h-3.5 text-[#ee4d2d]" />
                          <span>{app.shopName}</span>
                        </div>
                        <div className="text-slate-600 font-medium">{app.applicantName}</div>
                        <div className="text-[11px] text-slate-400">{app.phone} • {app.email}</div>
                      </td>

                      <td className="p-3 max-w-xs">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px] mb-1">
                          {app.businessCategory}
                        </span>
                        <div className="text-slate-600 line-clamp-2 text-[11px]">
                          {app.warehouseAddress}
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="font-mono text-slate-800 font-bold">
                          CCCD/MST: {app.taxOrIdNumber}
                        </div>
                        <div className="text-slate-600 text-[11px] mt-0.5">
                          {app.bankName}
                        </div>
                        <div className="font-mono text-slate-700 font-semibold text-[11px]">
                          STK: {app.bankAccountNumber} ({app.bankAccountHolder})
                        </div>
                      </td>

                      <td className="p-3 text-center">
                        {app.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">
                            <Clock className="w-3 h-3" />
                            <span>Chờ Duyệt</span>
                          </span>
                        )}
                        {app.status === 'approved' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Đã Kích Hoạt</span>
                          </span>
                        )}
                        {app.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-700">
                            <XCircle className="w-3 h-3" />
                            <span>Từ Chối</span>
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-right">
                        {app.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                onApproveApplication(app.id);
                                playSuccessChime();
                                showToast(`Đã phê duyệt và kích hoạt quyền Người bán cho gian hàng: ${app.shopName}`);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Phê Duyệt</span>
                            </button>

                            <button
                              onClick={() => {
                                setRejectReasonModal({ id: app.id, type: 'app' });
                                setReasonText('Thông tin CCCD hoặc số tài khoản ngân hàng chưa khớp với chủ sở hữu.');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs cursor-pointer"
                            >
                              <span>Từ chối</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">Đã xử lý xong</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: STORE MANAGEMENT & LOCK/UNLOCK */}
      {activeTab === 'stores' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900">
              Quản Lý Gian Hàng & Trạng Thái Kinh Doanh Toàn Sàn
            </h3>
            <span className="text-xs text-slate-500">
              Quyền quản trị có thể tạm khóa gian hàng vi phạm chính sách
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stores.map((s) => (
              <div key={s.id} className="p-4 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold mb-1">
                      {s.badge}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{s.name}</h4>
                    <p className="text-xs text-slate-500">Chủ shop: {s.owner} • {s.phone}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    s.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {s.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Sản phẩm</span>
                    <span className="font-bold text-slate-800">{s.productsCount} SP</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Doanh số</span>
                    <span className="font-bold text-emerald-600">{formatVND(s.revenue)}</span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Tham gia: {s.joinedAt}</span>
                  <button
                    onClick={() => handleToggleStoreStatus(s.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                      s.status === 'active'
                        ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    {s.status === 'active' ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Tạm Khóa Shop</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Mở Khóa Lại</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WITHDRAWAL APPROVAL */}
      {activeTab === 'withdrawals' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-purple-600" />
                <span>Kiểm Duyệt & Giải Ngân Lệnh Rút Tiền Ví Doanh Thu</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Chuyển khoản tự động qua cổng thanh toán Napas 24/7 sau khi Ban Quản Trị phê duyệt.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase text-[11px]">
                  <th className="p-3">Mã Lệnh & Thời Gian</th>
                  <th className="p-3">Gian Hàng Yêu Cầu</th>
                  <th className="p-3">Số Tiền Rút</th>
                  <th className="p-3">Ngân Hàng & Tài Khoản Thụ Hưởng</th>
                  <th className="p-3 text-center">Trạng Thái</th>
                  <th className="p-3 text-right">Phê Duyệt & Giải Ngân</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {withdrawals.map((wd) => (
                  <tr key={wd.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-800">{wd.id}</div>
                      <div className="text-[10px] text-slate-400">{wd.requestedAt}</div>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-slate-900">{wd.shopName}</div>
                      <div className="text-[11px] text-slate-400">ID: {wd.shopId}</div>
                    </td>

                    <td className="p-3">
                      <div className="font-black text-base text-[#ee4d2d]">
                        {formatVND(wd.amount)}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-semibold text-slate-800">{wd.bankName}</div>
                      <div className="font-mono text-slate-700 font-bold text-[11px]">
                        STK: {wd.accountNumber}
                      </div>
                      <div className="text-slate-500 text-[10px] uppercase">
                        Chủ TK: {wd.accountHolder}
                      </div>
                    </td>

                    <td className="p-3 text-center">
                      {wd.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 animate-pulse">
                          <Clock className="w-3 h-3" />
                          <span>Chờ Giải Ngân</span>
                        </span>
                      )}
                      {wd.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Đã Chuyển Tiền</span>
                        </span>
                      )}
                      {wd.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-700">
                          <XCircle className="w-3 h-3" />
                          <span>Đã Từ Chối</span>
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-right">
                      {wd.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              onApproveWithdrawal(wd.id);
                              playSuccessChime();
                              showToast(`Đã giải ngân thành công ${formatVND(wd.amount)} tới ${wd.accountHolder} qua Napas 24/7`);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Duyệt & Giải Ngân 24/7</span>
                          </button>

                          <button
                            onClick={() => {
                              setRejectReasonModal({ id: wd.id, type: 'withdrawal' });
                              setReasonText('Số dư chưa đủ điều kiện rút hoặc thông tin tài khoản không hợp lệ.');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs cursor-pointer"
                          >
                            <span>Từ chối</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          {wd.note || 'Hoàn tất giao dịch'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <span>Nhật Ký Giám Sát Hoạt Động Hệ Thống (Audit Log)</span>
          </h3>

          <div className="space-y-3 text-xs">
            {[
              { time: 'Vừa xong', user: 'Admin', event: 'Giám sát vận hành hệ thống Quản Trị VIETSHOP', level: 'info' },
              { time: '5 phút trước', user: 'Seller (VIETSHOP Official)', event: 'Cập nhật giá và tồn kho sản phẩm', level: 'info' },
              { time: '18 phút trước', user: 'Khách hàng (Nguyễn Văn Hùng)', event: 'Gửi đơn đăng ký mở gian hàng mới: Hùng Sport', level: 'warning' },
              { time: '1 giờ trước', user: 'Hệ thống tự động', event: 'Đồng bộ đối soát tiền với cổng Napas 24/7', level: 'success' },
              { time: '3 giờ trước', user: 'Admin', event: 'Phê duyệt kích hoạt gian hàng: Mai Beauty & Cosmetics', level: 'success' }
            ].map((log, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  <div>
                    <span className="font-bold text-slate-800">{log.event}</span>
                    <span className="text-[11px] text-slate-500 block">Tác tử: {log.user}</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectReasonModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">
              Lý Do Từ Chối {rejectReasonModal.type === 'app' ? 'Hồ Sơ Gian Hàng' : 'Yêu Cầu Rút Tiền'}
            </h4>
            <textarea
              rows={3}
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
              className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-purple-600"
              placeholder="Nhập lý do gửi về cho người bán..."
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setRejectReasonModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (rejectReasonModal.type === 'app') {
                    onRejectApplication(rejectReasonModal.id, reasonText);
                  } else {
                    onRejectWithdrawal(rejectReasonModal.id, reasonText);
                  }
                  setRejectReasonModal(null);
                  showToast('Đã gửi thông báo từ chối kèm lý do');
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer"
              >
                Xác Nhận Từ Chối
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
