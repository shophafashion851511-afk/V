import React, { useState } from 'react';
import { 
  Wallet, ArrowUpRight, ArrowDownLeft, CreditCard, 
  Send, Clock, CheckCircle2, AlertCircle, Building2, 
  ShieldCheck, RefreshCw, DollarSign, History, Sparkles,
  ChevronDown, Check, Info, Lock
} from 'lucide-react';
import { ShopSettings, WalletTransaction, WithdrawalRequest, Order } from '../types';
import { formatVND } from '../utils/formatters';
import { playSuccessChime } from '../utils/audio';

interface WalletWithdrawalViewProps {
  shopSettings: ShopSettings;
  transactions: WalletTransaction[];
  withdrawals: WithdrawalRequest[];
  orders: Order[];
  onUpdateShopSettings: (settings: ShopSettings) => void;
  onAddTransaction: (tx: WalletTransaction) => void;
  onAddWithdrawal: (wd: WithdrawalRequest) => void;
}

const VIETNAM_BANKS = [
  { id: 'vtb', name: 'VietinBank', fullName: 'Ngân hàng TMCP Công Thương Việt Nam', code: 'CTG', logo: '🔵' },
  { id: 'vcb', name: 'Vietcombank', fullName: 'Ngân hàng Ngoại Thương Việt Nam', code: 'VCB', logo: '🟢' },
  { id: 'bidv', name: 'BIDV', fullName: 'Ngân hàng Đầu tư & Phát triển Việt Nam', code: 'BID', logo: '🟢' },
  { id: 'tcb', name: 'Techcombank', fullName: 'Ngân hàng Kỹ Thương Việt Nam', code: 'TCB', logo: '🔴' },
  { id: 'mb', name: 'MB Bank', fullName: 'Ngân hàng Quân Đội', code: 'MBB', logo: '🔵' },
  { id: 'acb', name: 'ACB', fullName: 'Ngân hàng Á Châu', code: 'ACB', logo: '🔵' },
  { id: 'vpb', name: 'VPBank', fullName: 'Ngân hàng Việt Nam Thịnh Vượng', code: 'VPB', logo: '🟢' },
  { id: 'tpb', name: 'TPBank', fullName: 'Ngân hàng Tiên Phong', code: 'TPB', logo: '🟣' },
  { id: 'stb', name: 'Sacombank', fullName: 'Ngân hàng Sài Gòn Thương Tín', code: 'STB', logo: '🔵' },
  { id: 'hdb', name: 'HDBank', fullName: 'Ngân hàng Phát triển TP.HCM', code: 'HDB', logo: '🔴' },
  { id: 'agribank', name: 'Agribank', fullName: 'Ngân hàng Nông nghiệp & PTNT Việt Nam', code: 'VBA', logo: '🔴' },
  { id: 'vib', name: 'VIB', fullName: 'Ngân hàng Quốc Tế', code: 'VIB', logo: '🔵' },
  { id: 'shb', name: 'SHB', fullName: 'Ngân hàng Sài Gòn - Hà Nội', code: 'SHB', logo: '🟠' },
  { id: 'msb', name: 'MSB', fullName: 'Ngân hàng Hàng Hải Việt Nam', code: 'MSB', logo: '🔴' },
  { id: 'ocb', name: 'OCB', fullName: 'Ngân hàng Phương Đông', code: 'OCB', logo: '🟢' },
  { id: 'lpbank', name: 'LPBank', fullName: 'Ngân hàng Lộc Phát Việt Nam', code: 'LPB', logo: '🟠' },
  { id: 'momo', name: 'Ví MoMo', fullName: 'Ví Điện Tử MoMo', code: 'MOMO', logo: '🌸' },
  { id: 'zalopay', name: 'Ví ZaloPay', fullName: 'Ví Điện Tử ZaloPay', code: 'ZLP', logo: '🔵' }
];

const QUICK_AMOUNTS = [500000, 1000000, 2000000, 5000000, 10000000];

export const WalletWithdrawalView: React.FC<WalletWithdrawalViewProps> = ({
  shopSettings,
  transactions,
  withdrawals,
  orders,
  onUpdateShopSettings,
  onAddTransaction,
  onAddWithdrawal
}) => {
  const currentBalance = shopSettings.walletBalance ?? 24500000;

  // Withdrawal form states
  const [withdrawType, setWithdrawType] = useState<'account' | 'card'>('account');
  const [selectedBankName, setSelectedBankName] = useState(shopSettings.bankName || 'VietinBank');
  const [bankAccountNumber, setBankAccountNumber] = useState(shopSettings.bankAccountNumber || '101889977665');
  const [bankAccountHolder, setBankAccountHolder] = useState(shopSettings.bankAccountHolder || 'CONG TY CP VIETSHOP');
  const [bankBranch, setBankBranch] = useState('Chi nhánh Hà Nội');
  const [saveAsDefault, setSaveAsDefault] = useState(true);

  const [withdrawAmount, setWithdrawAmount] = useState<number>(2000000);
  const [customAmountInput, setCustomAmountInput] = useState<string>('');
  const [withdrawNote, setWithdrawNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Tab states
  const [activeTab, setActiveTab] = useState<'withdraw' | 'withdrawals_list' | 'transactions'>('withdraw');
  const [txFilter, setTxFilter] = useState<'all' | 'in' | 'out'>('all');
  const [notification, setNotification] = useState<string | null>(null);

  // Calculate pending revenue from shipping orders
  const pendingRevenue = orders
    .filter(o => o.status === 'shipping' || o.status === 'pending')
    .reduce((sum, o) => sum + o.total, 0);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4500);
  };

  const finalAmount = customAmountInput ? parseInt(customAmountInput, 10) : withdrawAmount;

  const handleCreateWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    const cleanAccount = bankAccountNumber.trim().replace(/\s+/g, '');
    const cleanHolder = bankAccountHolder.trim();

    if (!selectedBankName) {
      setFormError('Vui lòng chọn ngân hàng thụ hưởng!');
      return;
    }

    if (!cleanAccount || cleanAccount.length < 6) {
      setFormError(withdrawType === 'card' ? 'Vui lòng điền đúng số thẻ ATM / thẻ ghi nợ (từ 8-19 số)!' : 'Vui lòng điền đúng số tài khoản ngân hàng!');
      return;
    }

    if (!cleanHolder || cleanHolder.length < 3) {
      setFormError('Vui lòng điền đầy đủ Họ và Tên chủ tài khoản/thẻ (viết hoa không dấu)!');
      return;
    }

    if (!finalAmount || finalAmount <= 0) {
      setFormError('Vui lòng nhập số tiền cần rút hợp lệ!');
      return;
    }

    if (finalAmount < 50000) {
      setFormError('Số tiền rút tối thiểu là 50.000 VNĐ!');
      return;
    }

    if (finalAmount > currentBalance) {
      setFormError(`Số dư khả dụng không đủ! Hiện tại ví chỉ có ${formatVND(currentBalance)}.`);
      return;
    }

    setIsSubmitting(true);

    const newWd: WithdrawalRequest = {
      id: 'wd-' + Date.now().toString(36),
      shopId: 'shop-vietshop-official',
      shopName: shopSettings.shopName || 'VIETSHOP Store',
      amount: finalAmount,
      bankName: selectedBankName,
      accountNumber: cleanAccount,
      accountHolder: cleanHolder.toUpperCase(),
      status: 'pending',
      requestedAt: new Date().toLocaleString('vi-VN'),
      note: withdrawNote.trim() || `Rút ${formatVND(finalAmount)} về ${selectedBankName} (${cleanAccount})`
    };

    const newTx: WalletTransaction = {
      id: 'tx-' + Date.now().toString(36),
      shopId: 'shop-vietshop-official',
      type: 'withdrawal',
      amount: -finalAmount,
      description: `Rút tiền về ${selectedBankName} - ${withdrawType === 'card' ? 'Số thẻ' : 'STK'} ${cleanAccount} (${cleanHolder.toUpperCase()})`,
      createdAt: new Date().toLocaleString('vi-VN'),
      status: 'pending'
    };

    try {
      // 1. Call server API
      await fetch('/api/seller/wallet/withdraw', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-role': 'seller'
        },
        body: JSON.stringify({
          amount: finalAmount,
          bankName: selectedBankName,
          accountNumber: cleanAccount,
          accountHolder: cleanHolder.toUpperCase(),
          withdrawType
        })
      }).catch(() => {});

      // 2. Deduct balance locally
      const updatedBalance = currentBalance - finalAmount;
      const updatedSettings = {
        ...shopSettings,
        walletBalance: updatedBalance,
        ...(saveAsDefault ? {
          bankName: selectedBankName,
          bankAccountNumber: cleanAccount,
          bankAccountHolder: cleanHolder.toUpperCase()
        } : {})
      };
      
      onUpdateShopSettings(updatedSettings);
      onAddTransaction(newTx);
      onAddWithdrawal(newWd);
      
      playSuccessChime();
      showToast(`🎉 Lệnh rút ${formatVND(finalAmount)} về ${selectedBankName} (${cleanAccount}) đã khởi tạo thành công! Tiền sẽ về tài khoản ngân hàng trong 1-5 phút (Napas 24/7).`);
      
      // Reset form amount
      setCustomAmountInput('');
      setWithdrawNote('');
      setActiveTab('withdrawals_list');
    } catch (err: any) {
      setFormError('Lỗi xử lý: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTx = transactions.filter(tx => {
    if (txFilter === 'in') return tx.amount > 0;
    if (txFilter === 'out') return tx.amount < 0;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {notification && (
        <div className="p-4 bg-emerald-600 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-3 shadow-xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Balance Card */}
        <div className="bg-gradient-to-br from-[#ee4d2d] via-orange-600 to-amber-600 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Wallet className="w-32 h-32" />
          </div>
          
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider text-orange-200 flex items-center gap-1.5">
                <Wallet className="w-4 h-4" />
                <span>Số Dư Ví VIETSHOP Khả Dụng</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black tracking-wide">
                Napas 24/7
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-black tracking-tight">
              {formatVND(currentBalance)}
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs text-orange-100">
              <ShieldCheck className="w-4 h-4 text-yellow-300 shrink-0" />
              <span>Rút về tài khoản ngân hàng & thẻ ATM tức thì (1-5 phút)</span>
            </div>
          </div>
        </div>

        {/* Pending Revenue Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span className="font-bold">Doanh Thu Chờ Quyết Toán</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600">
              {formatVND(pendingRevenue)}
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Tiền từ các đơn hàng đang giao. Sau khi khách nhận hàng thành công, tiền sẽ tự động chuyển ngay vào Ví VIETSHOP của bạn.
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Đơn hàng đang giao:</span>
            <span className="font-bold text-slate-900 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
              {orders.filter(o => o.status === 'shipping' || o.status === 'processing').length} đơn
            </span>
          </div>
        </div>

        {/* Bank Account Config Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span className="font-bold">Tài Khoản Ngân Hàng Mặc Định</span>
              <Building2 className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="space-y-1">
              <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <span>{shopSettings.bankName || selectedBankName}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">Chính</span>
              </div>
              <div className="font-mono text-slate-700 font-black text-base tracking-wider">
                {shopSettings.bankAccountNumber || bankAccountNumber}
              </div>
              <div className="text-xs text-slate-500 font-bold uppercase">
                {shopSettings.bankAccountHolder || bankAccountHolder}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Mã số thuế / CCCD: {shopSettings.taxNumber || '0315998822'}</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Đã xác thực
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('withdraw')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'withdraw'
              ? 'bg-[#ee4d2d] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ArrowDownLeft className="w-4 h-4" />
          <span>Rút Tiền Về Ngân Hàng</span>
        </button>

        <button
          onClick={() => setActiveTab('withdrawals_list')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'withdrawals_list'
              ? 'bg-[#ee4d2d] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Lệnh Rút Tiền Đã Tạo ({withdrawals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'transactions'
              ? 'bg-[#ee4d2d] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Biến Động Số Dư ({transactions.length})</span>
        </button>
      </div>

      {/* TAB 1: WITHDRAW FORM */}
      {activeTab === 'withdraw' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Interactive Withdrawal Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#ee4d2d] flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Điền Thông Tin Rút Tiền Về Ngân Hàng</h3>
                  <p className="text-xs text-slate-500">Nhập đầy đủ số tài khoản/thẻ và số tiền cần chuyển về ngân hàng của bạn</p>
                </div>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                Miễn phí rút tiền 0đ
              </span>
            </div>

            {formError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateWithdrawal} className="space-y-4 text-xs">
              
              {/* 1. Method: Bank Account vs Bank Card */}
              <div>
                <label className="font-black text-slate-800 uppercase tracking-wide block mb-2">
                  1. Hình thức nhận tiền:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setWithdrawType('account')}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center gap-3 ${
                      withdrawType === 'account'
                        ? 'border-[#ee4d2d] bg-orange-50/70 text-[#ee4d2d] ring-1 ring-[#ee4d2d]'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                      withdrawType === 'account' ? 'bg-[#ee4d2d] text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-xs">Số Tài Khoản (STK)</div>
                      <div className="text-[10px] text-slate-500">Chuyển khoản Napas 24/7</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWithdrawType('card')}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center gap-3 ${
                      withdrawType === 'card'
                        ? 'border-[#ee4d2d] bg-orange-50/70 text-[#ee4d2d] ring-1 ring-[#ee4d2d]'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                      withdrawType === 'card' ? 'bg-[#ee4d2d] text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-xs">Số Thẻ ATM / Napas</div>
                      <div className="text-[10px] text-slate-500">Rút qua số in trên thẻ</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 2. Choose Bank */}
              <div>
                <label className="font-black text-slate-800 uppercase tracking-wide block mb-1.5">
                  2. Ngân hàng thụ hưởng: <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedBankName}
                    onChange={(e) => setSelectedBankName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 bg-white focus:outline-none focus:border-[#ee4d2d] cursor-pointer appearance-none text-xs"
                    required
                  >
                    {VIETNAM_BANKS.map(b => (
                      <option key={b.id} value={b.name}>
                        {b.logo} {b.name} - {b.fullName} ({b.code})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* 3. Account / Card Number */}
              <div>
                <label className="font-black text-slate-800 uppercase tracking-wide block mb-1.5">
                  3. {withdrawType === 'card' ? 'Số Thẻ ATM / Thẻ Ghi Nợ (In trên mặt thẻ)' : 'Số Tài Khoản Ngân Hàng'}: <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder={withdrawType === 'card' ? 'VD: 9704 2200 xxxx xxxx' : 'VD: 101889977665'}
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 text-sm focus:outline-none focus:border-[#ee4d2d] focus:bg-white"
                  />
                  <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              {/* 4. Account Holder Name */}
              <div>
                <label className="font-black text-slate-800 uppercase tracking-wide block mb-1.5">
                  4. Họ và Tên Chủ {withdrawType === 'card' ? 'Thẻ' : 'Tài Khoản'}: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: NGUYEN VAN HUNG (Viết in hoa, không dấu)"
                  value={bankAccountHolder}
                  onChange={(e) => setBankAccountHolder(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold uppercase text-slate-900 text-xs focus:outline-none focus:border-[#ee4d2d] focus:bg-white"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Lưu ý: Tên chủ tài khoản phải trùng khớp chính xác với thông tin đăng ký tại ngân hàng.
                </span>
              </div>

              {/* 5. Branch (Optional) */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Chi nhánh ngân hàng (Tùy chọn):
                </label>
                <input
                  type="text"
                  placeholder="VD: Chi nhánh Hà Nội, Chi nhánh TP.HCM..."
                  value={bankBranch}
                  onChange={(e) => setBankBranch(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#ee4d2d]"
                />
              </div>

              {/* 6. Amount to withdraw */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-black text-slate-800 uppercase tracking-wide">
                    5. Số tiền cần rút (VNĐ): <span className="text-red-500">*</span>
                  </label>
                  <span className="text-slate-500 text-xs">
                    Số dư: <strong className="text-[#ee4d2d]">{formatVND(currentBalance)}</strong>
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    min={50000}
                    max={currentBalance}
                    step={10000}
                    required
                    value={customAmountInput || withdrawAmount}
                    onChange={(e) => {
                      setCustomAmountInput(e.target.value);
                      setWithdrawAmount(Number(e.target.value) || 0);
                    }}
                    placeholder="Nhập số tiền cần rút (VD: 2000000)"
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-300 font-black text-slate-900 text-lg focus:outline-none focus:border-[#ee4d2d]"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    VNĐ
                  </span>
                </div>

                {/* Quick amount buttons */}
                <div className="space-y-1.5 mt-2.5">
                  <span className="text-[11px] font-semibold text-slate-500 block">Chọn nhanh số tiền:</span>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                    {QUICK_AMOUNTS.map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setWithdrawAmount(amt);
                          setCustomAmountInput('');
                        }}
                        className={`py-1.5 px-2 rounded-xl border text-[11px] font-bold cursor-pointer transition ${
                          finalAmount === amt
                            ? 'border-[#ee4d2d] bg-orange-50 text-[#ee4d2d]'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {formatVND(amt)}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setWithdrawAmount(currentBalance);
                      setCustomAmountInput('');
                    }}
                    className="w-full py-2 px-3 rounded-xl border border-dashed border-[#ee4d2d] text-[#ee4d2d] bg-orange-50/50 hover:bg-orange-50 font-black text-xs cursor-pointer mt-1 flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Rút toàn bộ số dư khả dụng: {formatVND(currentBalance)}</span>
                  </button>
                </div>
              </div>

              {/* 7. Save as default */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="save-default-chk"
                  checked={saveAsDefault}
                  onChange={(e) => setSaveAsDefault(e.target.checked)}
                  className="w-4 h-4 text-[#ee4d2d] rounded accent-[#ee4d2d] cursor-pointer"
                />
                <label htmlFor="save-default-chk" className="text-xs text-slate-700 font-semibold cursor-pointer">
                  Lưu thông tin tài khoản ngân hàng này làm mặc định cho các lần rút sau
                </label>
              </div>

              {/* 8. Note (Optional) */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Ghi chú rút tiền (Tùy chọn):</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Rút doanh thu bán hàng đợt 1 tháng này..."
                  value={withdrawNote}
                  onChange={(e) => setWithdrawNote(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#ee4d2d]"
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isSubmitting || currentBalance <= 0}
                className="w-full py-3.5 rounded-2xl bg-[#ee4d2d] hover:bg-[#d73211] text-white font-black text-sm shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Hệ thống Napas đang kết nối giải ngân...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>XÁC NHẬN RÚT {formatVND(finalAmount)} VỀ NGÂN HÀNG</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Withdrawal Summary & Security Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Live Calculation Box */}
            <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-extrabold text-xs uppercase text-slate-300">Chi Tiết Lệnh Rút Tiền</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-black px-2 py-0.5 rounded-md border border-emerald-500/30">
                  Napas 24/7
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Số dư hiện tại:</span>
                  <span className="font-bold text-white">{formatVND(currentBalance)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Số tiền rút:</span>
                  <span className="font-black text-[#ee4d2d] text-sm">-{formatVND(finalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí sàn VIETSHOP:</span>
                  <span className="font-bold text-emerald-400">0₫ (Miễn phí 100%)</span>
                </div>
                <div className="flex justify-between">
                  <span>Hình thức:</span>
                  <span className="font-bold text-white">{withdrawType === 'card' ? 'Số Thẻ ATM' : 'Tài Khoản (STK)'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ngân hàng nhận:</span>
                  <span className="font-bold text-yellow-300">{selectedBankName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Số tài khoản/thẻ:</span>
                  <span className="font-mono font-bold text-white">{bankAccountNumber || 'Chưa điền'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Chủ thụ hưởng:</span>
                  <span className="font-bold text-white uppercase">{bankAccountHolder || 'Chưa điền'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Thời gian nhận tiền:</span>
                  <span className="font-bold text-emerald-400">1 - 5 phút (Tức thì)</span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="font-bold text-xs text-slate-400">Số dư ví còn lại sau rút:</span>
                  <span className="font-black text-base text-emerald-400">
                    {formatVND(Math.max(0, currentBalance - finalAmount))}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Guarantee Box */}
            <div className="bg-emerald-50 rounded-3xl p-5 border border-emerald-200 text-xs space-y-2 text-emerald-900">
              <div className="font-black flex items-center gap-1.5 text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Bảo Mật Giao Dịch Tài Chính</span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                Hệ thống rút tiền VIETSHOP kết nối trực tiếp với cổng thanh toán liên ngân hàng Napas 24/7. Tiền được giải ngân thẳng vào tài khoản của người bán ngay khi xác nhận lệnh.
              </p>
            </div>

            {/* Quick Link to Recent Withdrawals */}
            {withdrawals.length > 0 && (
              <div className="bg-white rounded-3xl p-4 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Lệnh rút gần nhất:</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('withdrawals_list')}
                    className="text-[#ee4d2d] font-bold hover:underline cursor-pointer"
                  >
                    Xem tất cả ({withdrawals.length})
                  </button>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-black text-slate-900">{formatVND(withdrawals[0].amount)}</div>
                    <div className="text-[11px] text-slate-500">{withdrawals[0].bankName} • {withdrawals[0].accountNumber}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    {withdrawals[0].status === 'approved' ? 'Đã giải ngân' : 'Đang xử lý'}
                  </span>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* TAB 2: WITHDRAWALS LIST */}
      {activeTab === 'withdrawals_list' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-black text-slate-900 text-base">Danh Sách Lệnh Rút Tiền Về Ngân Hàng</h3>
              <p className="text-xs text-slate-500">Theo dõi tiến trình giải ngân các khoản tiền người bán đã yêu cầu rút về tài khoản</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('withdraw')}
              className="px-3.5 py-2 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>+ Tạo Lệnh Rút Mới</span>
            </button>
          </div>

          {withdrawals.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Bạn chưa có lệnh rút tiền nào.
            </div>
          ) : (
            <div className="space-y-3">
              {withdrawals.map((wd) => (
                <div key={wd.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#ee4d2d] flex items-center justify-center font-bold shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-black text-slate-900 text-sm">
                        Rút {formatVND(wd.amount)} về {wd.bankName}
                      </div>
                      <div className="text-slate-500 text-xs flex items-center gap-2 mt-0.5">
                        <span className="font-mono font-semibold">STK/Thẻ: {wd.accountNumber}</span>
                        <span>•</span>
                        <span className="font-bold text-slate-700">{wd.accountHolder}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Thời gian: {wd.requestedAt} {wd.note && `• Ghi chú: ${wd.note}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      wd.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : wd.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {wd.status === 'approved' ? '✓ Đã giải ngân thành công' : wd.status === 'rejected' ? '✕ Từ chối' : '⏳ Đang chuyển tiền Napas 24/7'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TRANSACTIONS HISTORY */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-slate-700" />
              <h3 className="font-black text-slate-900 text-base">Lịch Sử Biến Động Số Dư Ví VIETSHOP</h3>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setTxFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer ${
                  txFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                Tất cả ({transactions.length})
              </button>
              <button
                onClick={() => setTxFilter('in')}
                className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer ${
                  txFilter === 'in' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                Tiền Vào (+)
              </button>
              <button
                onClick={() => setTxFilter('out')}
                className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer ${
                  txFilter === 'out' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                Tiền Ra (-)
              </button>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[520px] overflow-y-auto custom-scrollbar pr-1">
            {filteredTx.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                Chưa có giao dịch nào trong mục này.
              </div>
            ) : (
              filteredTx.map(tx => (
                <div 
                  key={tx.id} 
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                      tx.amount > 0 
                        ? 'bg-emerald-100 text-emerald-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {tx.amount > 0 ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{tx.description}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{tx.createdAt}</span>
                        <span>•</span>
                        <span className="font-mono text-slate-500">{tx.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`font-black text-sm ${
                      tx.amount > 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {tx.amount > 0 ? `+${formatVND(tx.amount)}` : formatVND(tx.amount)}
                    </div>
                    <span className="inline-block text-[10px] font-semibold text-slate-500 mt-0.5">
                      {tx.status === 'completed' ? 'Thành công' : 'Đang xử lý'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};
