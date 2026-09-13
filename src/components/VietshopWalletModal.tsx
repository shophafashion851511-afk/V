import React, { useState } from 'react';
import { 
  Wallet, ArrowDownLeft, ArrowUpRight, Plus, RefreshCw, X, ShieldCheck, 
  CheckCircle2, CreditCard, Building2, QrCode, Sparkles, Copy, ChevronRight, 
  History, AlertCircle, Eye, EyeOff, Lock, Check, Gift, Zap
} from 'lucide-react';
import { BuyerWallet, BuyerWalletTransaction, BuyerLinkedBank } from '../types';
import { formatVND } from '../utils/formatters';

interface VietshopWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: BuyerWallet;
  onTopUp: (amount: number, bankName?: string) => void;
  onWithdraw: (amount: number, bankName: string, accountNumber: string) => { success: boolean; message: string };
  onOpenVouchers?: () => void;
}

const POPULAR_BANKS = [
  { id: 'vcb', name: 'Vietcombank', code: 'VCB', logo: '🟢' },
  { id: 'mb', name: 'MB Bank (Quân Đội)', code: 'MBB', logo: '🔵' },
  { id: 'tcb', name: 'Techcombank', code: 'TCB', logo: '🔴' },
  { id: 'vtb', name: 'VietinBank', code: 'CTG', logo: '🔵' },
  { id: 'bidv', name: 'BIDV', code: 'BID', logo: '🟢' },
  { id: 'acb', name: 'ACB Bank', code: 'ACB', logo: '🔵' },
  { id: 'tp', name: 'TPBank', code: 'TPB', logo: '🟣' }
];

const PRESET_TOPUP_AMOUNTS = [100000, 200000, 500000, 1000000, 2000000, 5000000];

export const VietshopWalletModal: React.FC<VietshopWalletModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onTopUp,
  onWithdraw,
  onOpenVouchers
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'topup' | 'withdraw' | 'history' | 'cards'>('overview');
  const [showBalance, setShowBalance] = useState(true);
  
  // Topup state
  const [topUpAmount, setTopUpAmount] = useState<number>(500000);
  const [customTopUpInput, setCustomTopUpInput] = useState<string>('');
  const [selectedTopUpMethod, setSelectedTopUpMethod] = useState<'vietqr' | 'napas' | 'visa'>('vietqr');
  const [isProcessingTopUp, setIsProcessingTopUp] = useState(false);
  const [topUpSuccessNotice, setTopUpSuccessNotice] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState<number>(500000);
  const [selectedBankId, setSelectedBankId] = useState<string>(wallet.linkedBanks[0]?.id || '');
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);
  const [withdrawNotice, setWithdrawNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // History filter
  const [historyFilter, setHistoryFilter] = useState<'all' | 'deposit' | 'payment' | 'refund' | 'withdraw'>('all');

  // Add card state
  const [newBankName, setNewBankName] = useState('Techcombank');
  const [newAccountNumber, setNewAccountNumber] = useState('');
  const [newAccountHolder, setNewAccountHolder] = useState('');
  const [linkedBanksList, setLinkedBanksList] = useState<BuyerLinkedBank[]>(wallet.linkedBanks);

  if (!isOpen) return null;

  const handleExecuteTopUp = () => {
    const finalAmount = customTopUpInput ? parseInt(customTopUpInput, 10) : topUpAmount;
    if (!finalAmount || finalAmount < 10000) {
      alert('Vui lòng nạp tối thiểu 10.000₫');
      return;
    }
    setIsProcessingTopUp(true);
    setTimeout(() => {
      onTopUp(finalAmount, selectedTopUpMethod === 'vietqr' ? 'VietQR Napas 24/7' : 'Ngân hàng liên kết');
      setIsProcessingTopUp(false);
      setTopUpSuccessNotice(`Đã nạp thành công +${formatVND(finalAmount)} vào Ví VIETSHOP!`);
      setTimeout(() => {
        setTopUpSuccessNotice(null);
        setActiveTab('overview');
      }, 1500);
    }, 800);
  };

  const handleExecuteWithdraw = () => {
    if (withdrawAmount <= 0) {
      setWithdrawNotice({ type: 'error', text: 'Vui lòng nhập số tiền rút hợp lệ!' });
      return;
    }
    if (withdrawAmount > wallet.balance) {
      setWithdrawNotice({ type: 'error', text: 'Số dư khả dụng không đủ để thực hiện lệnh rút!' });
      return;
    }
    const targetBank = linkedBanksList.find(b => b.id === selectedBankId) || linkedBanksList[0];
    if (!targetBank) {
      setWithdrawNotice({ type: 'error', text: 'Vui lòng liên kết tài khoản ngân hàng trước!' });
      return;
    }

    setIsProcessingWithdraw(true);
    setTimeout(() => {
      const res = onWithdraw(withdrawAmount, targetBank.bankName, targetBank.accountNumber);
      setIsProcessingWithdraw(false);
      if (res.success) {
        setWithdrawNotice({ type: 'success', text: res.message });
        setTimeout(() => {
          setWithdrawNotice(null);
          setActiveTab('overview');
        }, 1500);
      } else {
        setWithdrawNotice({ type: 'error', text: res.message });
      }
    }, 900);
  };

  const handleAddBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountNumber.trim() || !newAccountHolder.trim()) {
      alert('Vui lòng nhập đầy đủ số tài khoản và tên chủ thẻ!');
      return;
    }
    const newBank: BuyerLinkedBank = {
      id: 'bank-' + Date.now(),
      bankName: newBankName,
      accountNumber: newAccountNumber.replace(/\s+/g, ''),
      accountHolder: newAccountHolder.toUpperCase(),
      cardType: 'napas',
      isDefault: linkedBanksList.length === 0
    };
    setLinkedBanksList([newBank, ...linkedBanksList]);
    setNewAccountNumber('');
    setNewAccountHolder('');
    alert(`Đã liên kết thành công tài khoản ${newBankName}!`);
  };

  const filteredTransactions = wallet.transactions.filter(t => {
    if (historyFilter === 'all') return true;
    return t.type === historyFilter;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 relative my-auto max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ee4d2d] to-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/25">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Ví VIETSHOP Pay</h2>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Đã kích hoạt KYC
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Ví điện tử thanh toán an toàn, bảo mật 2 lớp PCI-DSS chuẩn Ngân hàng
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl my-3 text-xs font-bold shrink-0 overflow-x-auto custom-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-3 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-[#ee4d2d]" />
            <span>Tổng Quan Ví</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('topup'); setTopUpSuccessNotice(null); }}
            className={`py-2 px-3 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'topup' ? 'bg-[#ee4d2d] text-white shadow-sm shadow-orange-500/25' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>+ Nạp Tiền</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('withdraw'); setWithdrawNotice(null); }}
            className={`py-2 px-3 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'withdraw' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-yellow-300" />
            <span>Rút Về Ngân Hàng</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cards')}
            className={`py-2 px-3 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'cards' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
            <span>Liên Kết Thẻ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`py-2 px-3 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'history' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5 text-purple-600" />
            <span>Lịch Sử</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Virtual Wallet Card */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ee4d2d] via-orange-600 to-rose-700 text-white p-5 sm:p-6 shadow-xl shadow-orange-500/20">
                {/* Background ambient watermarks */}
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 -mb-12 w-40 h-40 bg-yellow-400/15 rounded-full blur-xl pointer-events-none" />

                <div className="relative z-10 flex flex-col justify-between h-full min-h-[160px]">
                  {/* Card Top Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-sm">
                        VP
                      </div>
                      <div>
                        <span className="text-xs font-semibold tracking-wider text-orange-100 uppercase">Thẻ Ví Trực Tuyến</span>
                        <div className="text-sm font-black tracking-wide">VIETSHOP PAY PLATINUM</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium">
                      <Lock className="w-3 h-3 text-yellow-300" />
                      <span>NAPAS 247</span>
                    </div>
                  </div>

                  {/* Card Balance Center */}
                  <div className="my-4">
                    <div className="flex items-center gap-2 text-xs text-orange-100">
                      <span>Số dư khả dụng</span>
                      <button 
                        onClick={() => setShowBalance(!showBalance)}
                        className="hover:text-white transition cursor-pointer p-0.5"
                        title={showBalance ? "Ẩn số dư" : "Hiện số dư"}
                      >
                        {showBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5">
                      {showBalance ? formatVND(wallet.balance) : '•••••••• ₫'}
                    </div>
                    <div className="text-xs text-orange-200 mt-1 flex items-center gap-2">
                      <span>Xu tích lũy: <strong className="text-yellow-300 font-bold">{(wallet.coins || 0).toLocaleString('vi-VN')} Xu</strong></span>
                      <span>•</span>
                      <span>Hạn mức ngày: <strong>50.000.000₫</strong></span>
                    </div>
                  </div>

                  {/* Card Bottom Row Actions */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/20">
                    <button
                      onClick={() => setActiveTab('topup')}
                      className="py-2 px-3 rounded-xl bg-white text-[#ee4d2d] font-black text-xs shadow-md hover:bg-orange-50 transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ArrowDownLeft className="w-3.5 h-3.5" />
                      <span>+ Nạp Tiền</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('withdraw')}
                      className="py-2 px-3 rounded-xl bg-black/30 hover:bg-black/40 text-white font-bold text-xs backdrop-blur-md transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 text-yellow-300" />
                      <span>Rút Tiền</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('history')}
                      className="py-2 px-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-md transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>Biến Động</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Exclusive Perks Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-amber-900">Hoàn Tiền Đến 10%</div>
                    <div className="text-[11px] text-amber-700 mt-0.5">Tự động cộng lại ví khi thanh toán đơn hàng</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-emerald-900">Miễn Phí Nạp Rút 24/7</div>
                    <div className="text-[11px] text-emerald-700 mt-0.5">0đ phí nạp chuyển khoản qua mã VietQR</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-blue-900">Bảo Hiểm Giao Dịch</div>
                    <div className="text-[11px] text-blue-700 mt-0.5">Hoàn 100% tiền nếu đơn hàng bị sự cố</div>
                  </div>
                </div>
              </div>

              {/* Recent Activity Mini List */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wide">
                    Giao Dịch Gần Nhất
                  </span>
                  <button
                    onClick={() => setActiveTab('history')}
                    className="text-xs font-bold text-[#ee4d2d] hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Xem tất cả</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {wallet.transactions.slice(0, 3).map((tx) => (
                    <div 
                      key={tx.id} 
                      className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          tx.amount > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                        }`}>
                          {tx.amount > 0 ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-800 truncate">{tx.title}</div>
                          <div className="text-[10px] text-slate-400">{tx.createdAt} • {tx.method || 'Ví VIETSHOP'}</div>
                        </div>
                      </div>
                      <div className={`font-black text-xs shrink-0 ${
                        tx.amount > 0 ? 'text-emerald-600' : 'text-slate-800'
                      }`}>
                        {tx.amount > 0 ? `+${formatVND(tx.amount)}` : `-${formatVND(Math.abs(tx.amount))}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TOP-UP (NẠP TIỀN) */}
          {activeTab === 'topup' && (
            <div className="space-y-4">
              {topUpSuccessNotice && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{topUpSuccessNotice}</span>
                </div>
              )}

              {/* Choose Preset Amount */}
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-2 uppercase tracking-wide">
                  1. Chọn số tiền cần nạp
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_TOPUP_AMOUNTS.map((amt) => {
                    const isSelected = topUpAmount === amt && !customTopUpInput;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => { setTopUpAmount(amt); setCustomTopUpInput(''); }}
                        className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                          isSelected
                            ? 'bg-orange-50 border-[#ee4d2d] text-[#ee4d2d] font-black shadow-xs ring-1 ring-[#ee4d2d]'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 font-bold'
                        }`}
                      >
                        <div className="text-xs">{formatVND(amt)}</div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2.5">
                  <div className="relative">
                    <input
                      type="number"
                      value={customTopUpInput}
                      onChange={(e) => setCustomTopUpInput(e.target.value)}
                      placeholder="Hoặc tự nhập số tiền khác (VD: 350000)"
                      className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-[#ee4d2d]"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">₫</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Option */}
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-2 uppercase tracking-wide">
                  2. Chọn nguồn tiền nạp
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTopUpMethod('vietqr')}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      selectedTopUpMethod === 'vietqr'
                        ? 'bg-orange-50 border-[#ee4d2d] text-[#ee4d2d] ring-1 ring-[#ee4d2d]'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <QrCode className="w-5 h-5 text-[#ee4d2d]" />
                      <span className="text-[9px] bg-red-100 text-red-700 font-black px-1.5 py-0.5 rounded">Ưu tiên</span>
                    </div>
                    <div>
                      <div className="font-extrabold text-xs">Mã VietQR 24/7</div>
                      <div className="text-[10px] text-slate-500">Mọi app ngân hàng</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTopUpMethod('napas')}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      selectedTopUpMethod === 'napas'
                        ? 'bg-orange-50 border-[#ee4d2d] text-[#ee4d2d] ring-1 ring-[#ee4d2d]'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-extrabold text-xs">Thẻ ATM Napas</div>
                      <div className="text-[10px] text-slate-500">Thẻ nội địa</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTopUpMethod('visa')}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      selectedTopUpMethod === 'visa'
                        ? 'bg-orange-50 border-[#ee4d2d] text-[#ee4d2d] ring-1 ring-[#ee4d2d]'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <CreditCard className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-extrabold text-xs">Visa / Mastercard</div>
                      <div className="text-[10px] text-slate-500">Thẻ quốc tế</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* VietQR Dynamic Preview Box */}
              {selectedTopUpMethod === 'vietqr' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-sm shrink-0 text-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=VIETSHOP_TOPUP_${customTopUpInput || topUpAmount}`}
                      alt="VietQR Code"
                      className="w-28 h-28 mx-auto"
                    />
                    <span className="text-[9px] font-bold text-slate-500 mt-1 block">Quét bằng App Ngân hàng</span>
                  </div>

                  <div className="flex-1 space-y-1.5 text-xs text-slate-600 w-full">
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span>Ngân hàng thụ hưởng:</span>
                      <strong className="text-slate-900">Vietcombank (VCB)</strong>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 pb-1">
                      <span>Số tài khoản:</span>
                      <div className="flex items-center gap-1">
                        <strong className="text-slate-900 font-mono">9988 2233 4455</strong>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText('998822334455');
                            setCopiedAccount(true);
                            setTimeout(() => setCopiedAccount(false), 1500);
                          }}
                          className="text-[#ee4d2d] hover:text-orange-700 p-1"
                          title="Sao chép số tài khoản"
                        >
                          {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span>Chủ tài khoản:</span>
                      <strong className="text-slate-900">CONG TY CO PHAN VIETSHOP</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Số tiền nạp:</span>
                      <strong className="text-[#ee4d2d] font-black text-sm">
                        {formatVND(customTopUpInput ? parseInt(customTopUpInput, 10) : topUpAmount)}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                onClick={handleExecuteTopUp}
                disabled={isProcessingTopUp}
                className="w-full py-3 bg-[#ee4d2d] hover:bg-orange-600 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-orange-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessingTopUp ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang xác thực nạp tiền qua cổng Napas...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>XÁC NHẬN NẠP {formatVND(customTopUpInput ? parseInt(customTopUpInput, 10) : topUpAmount)} VÀO VÍ</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 3: WITHDRAW (RÚT TIỀN VỀ NGÂN HÀNG) */}
          {activeTab === 'withdraw' && (
            <div className="space-y-4">
              {withdrawNotice && (
                <div className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2 animate-in fade-in ${
                  withdrawNotice.type === 'success' 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                    : 'bg-rose-50 border-rose-300 text-rose-800'
                }`}>
                  {withdrawNotice.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                  <span>{withdrawNotice.text}</span>
                </div>
              )}

              {/* Current balance reminder */}
              <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-semibold">Số dư khả dụng để rút:</span>
                  <div className="text-lg font-black text-[#ee4d2d]">{formatVND(wallet.balance)}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setWithdrawAmount(wallet.balance)}
                  className="px-3 py-1 bg-white border border-orange-300 text-[#ee4d2d] rounded-xl text-xs font-bold hover:bg-orange-100 transition cursor-pointer"
                >
                  Rút toàn bộ
                </button>
              </div>

              {/* Withdrawal Amount Input */}
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5 uppercase tracking-wide">
                  Số tiền muốn rút (VNĐ)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(parseInt(e.target.value, 10) || 0)}
                    placeholder="VD: 500000"
                    className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ee4d2d]"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">₫</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Phí giao dịch: <strong className="text-emerald-600">0₫ (Miễn phí)</strong> • Thời gian xử lý: 1-3 phút
                </span>
              </div>

              {/* Select Bank */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">
                    Tài khoản ngân hàng nhận tiền
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('cards')}
                    className="text-xs text-[#ee4d2d] font-bold hover:underline cursor-pointer"
                  >
                    + Thêm tài khoản mới
                  </button>
                </div>

                <div className="space-y-2">
                  {linkedBanksList.map((bank) => (
                    <div
                      key={bank.id}
                      onClick={() => setSelectedBankId(bank.id)}
                      className={`p-3 rounded-2xl border flex items-center justify-between transition cursor-pointer ${
                        selectedBankId === bank.id
                          ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          {bank.bankName.slice(0, 3).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-extrabold text-xs text-slate-900">{bank.bankName}</div>
                          <div className="text-xs font-mono text-slate-600">{bank.accountNumber} • {bank.accountHolder}</div>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center">
                        {selectedBankId === bank.id && (
                          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Withdraw */}
              <button
                type="button"
                onClick={handleExecuteWithdraw}
                disabled={isProcessingWithdraw || wallet.balance <= 0}
                className="w-full py-3 bg-slate-900 hover:bg-black text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessingWithdraw ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Hệ thống Napas đang giải ngân...</span>
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="w-4 h-4 text-yellow-300" />
                    <span>XÁC NHẬN RÚT {formatVND(withdrawAmount)} VỀ TÀI KHOẢN</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 4: LINKED BANKS & CARDS */}
          {activeTab === 'cards' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide block mb-2">
                  Tài khoản ngân hàng đã liên kết ({linkedBanksList.length})
                </span>

                <div className="space-y-2">
                  {linkedBanksList.map((bank) => (
                    <div key={bank.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-800">
                          <Building2 className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                            <span>{bank.bankName}</span>
                            {bank.isDefault && (
                              <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-bold">Mặc định</span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 font-mono">{bank.accountNumber} • {bank.accountHolder}</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600">Đã kích hoạt</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Bank Form */}
              <form onSubmit={handleAddBank} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide block">
                  + Liên kết thêm tài khoản ngân hàng
                </span>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 mb-1 block">Chọn Ngân Hàng</label>
                  <select
                    value={newBankName}
                    onChange={(e) => setNewBankName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#ee4d2d]"
                  >
                    {POPULAR_BANKS.map(b => (
                      <option key={b.id} value={b.name}>{b.logo} {b.name} ({b.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 mb-1 block">Số Tài Khoản</label>
                  <input
                    type="text"
                    value={newAccountNumber}
                    onChange={(e) => setNewAccountNumber(e.target.value)}
                    placeholder="VD: 1903668899"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#ee4d2d]"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 mb-1 block">Tên Chủ Tài Khoản (In hoa không dấu)</label>
                  <input
                    type="text"
                    value={newAccountHolder}
                    onChange={(e) => setNewAccountHolder(e.target.value)}
                    placeholder="VD: NGUYEN VAN A"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 uppercase focus:outline-none focus:border-[#ee4d2d]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  Xác Nhận Liên Kết Ngay
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: TRANSACTION HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {/* History Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'deposit', label: '+ Nạp tiền' },
                  { id: 'payment', label: '- Thanh toán' },
                  { id: 'refund', label: '+ Hoàn tiền' },
                  { id: 'withdraw', label: '- Rút tiền' }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setHistoryFilter(f.id as any)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      historyFilter === f.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {filteredTransactions.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-xs">
                  Chưa có giao dịch nào trong mục này.
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredTransactions.map((tx) => (
                    <div 
                      key={tx.id}
                      className="p-3 bg-white rounded-2xl border border-slate-200 hover:border-orange-300 transition flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                          tx.amount > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {tx.amount > 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                        </div>
                        <div className="min-w-0">
                          <div className="font-extrabold text-xs text-slate-900 truncate">{tx.title}</div>
                          <div className="text-[11px] text-slate-500 truncate">{tx.description}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {tx.createdAt} • {tx.method || 'Ví VIETSHOP Pay'} {tx.orderCode && `• Đơn #${tx.orderCode}`}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className={`font-black text-xs sm:text-sm ${
                          tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'
                        }`}>
                          {tx.amount > 0 ? `+${formatVND(tx.amount)}` : `-${formatVND(Math.abs(tx.amount))}`}
                        </div>
                        <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-bold">
                          Thành công
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer info note */}
        <div className="pt-3 mt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Được bảo chứng 100% bởi Ngân hàng Nhà nước & Napas</span>
          </div>
          <span className="text-slate-400">Hotline ví 24/7: 1900 1234</span>
        </div>

      </div>
    </div>
  );
};
