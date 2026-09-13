import React, { useState } from 'react';
import { 
  Lock, ShieldAlert, ArrowRight, X, Sparkles, Eye, EyeOff, 
  ShieldCheck, Smartphone, Store, UserPlus, LogIn, CheckCircle2,
  AlertCircle, RefreshCw, KeyRound, Building2, CreditCard
} from 'lucide-react';
import { storage, RegisteredSeller } from '../utils/storage';

interface SellerLoginModalProps {
  correctPassword?: string;
  onSuccessLogin?: (selectedRole?: 'seller' | 'admin') => void;
  onSuccess?: () => void;
  onClose: () => void;
  onResetPasswordToDefault?: () => void;
  onUpdateShopSettings?: (settings: any) => void;
  onOpenFullRegistration?: () => void;
}

type SellerAuthMode = 'register_shop' | 'login_shop' | 'admin_password';

const POPULAR_BANKS_LIST = [
  'VietinBank (Ngân hàng Công Thương)',
  'Vietcombank (Ngân hàng Ngoại Thương)',
  'BIDV (Ngân hàng Đầu tư & Phát triển)',
  'Techcombank (Ngân hàng Kỹ Thương)',
  'MB Bank (Ngân hàng Quân Đội)',
  'ACB (Ngân hàng Á Châu)',
  'VPBank (Ngân hàng Việt Nam Thịnh Vượng)',
  'TPBank (Ngân hàng Tiên Phong)',
  'Sacombank (Ngân hàng Sài Gòn Thương Tín)',
  'HDBank (Ngân hàng Phát triển TP.HCM)',
  'Agribank (Ngân hàng Nông Nghiệp)',
  'Ví MoMo',
  'Ví ZaloPay'
];

const POPULAR_CATEGORIES = [
  'Thiết Bị Điện Gia Dụng',
  'Thời Trang Nam & Nữ',
  'Điện Thoại & Phụ Kiện Công Nghệ',
  'Mỹ Phẩm & Chăm Sóc Sắc Đẹp',
  'Nhà Cửa & Đời Sống',
  'Bách Hóa Online & Thực Phẩm',
  'Thú Cưng & Chăm Sóc Vật Nuôi',
  'Mẹ & Bé'
];

export const SellerLoginModal: React.FC<SellerLoginModalProps> = ({
  correctPassword = '54321',
  onSuccessLogin,
  onSuccess,
  onClose,
  onResetPasswordToDefault,
  onUpdateShopSettings,
  onOpenFullRegistration
}) => {
  const [activeMode, setActiveMode] = useState<SellerAuthMode>('login_shop');

  // Shop Registration Form State
  const [regPhone, setRegPhone] = useState('0912345678');
  const [regShopName, setRegShopName] = useState('VIETSHOP Official Store');
  const [regOwnerName, setRegOwnerName] = useState('Hà Hoàng Thu');
  const [regPassword, setRegPassword] = useState('123456');
  const [regConfirmPassword, setRegConfirmPassword] = useState('123456');
  const [regCategory, setRegCategory] = useState(POPULAR_CATEGORIES[0]);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regOtp, setRegOtp] = useState('');
  const [isRegOtpSent, setIsRegOtpSent] = useState(false);
  const [generatedRegOtp, setGeneratedRegOtp] = useState('');

  // Bank Info for Shop Registration
  const [regBankName, setRegBankName] = useState('VietinBank');
  const [regBankAccountNumber, setRegBankAccountNumber] = useState('101889977665');
  const [regBankAccountHolder, setRegBankAccountHolder] = useState('HA HOANG THU');

  // Shop Login Form State
  const [loginPhone, setLoginPhone] = useState('0912345678');
  const [loginPassword, setLoginPassword] = useState('123456');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Admin Master Password State
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSuccess = (roleToUse: 'seller' | 'admin' = 'seller') => {
    // NOTE: Removed all login chime sound per user instruction (bỏ âm thanh đăng nhập)
    if (onSuccessLogin) onSuccessLogin(roleToUse);
    if (onSuccess) onSuccess();
  };

  // Send OTP for Shop Registration
  const handleSendRegOtp = () => {
    if (!regPhone.trim() || regPhone.length < 9) {
      setErrorMsg('Vui lòng nhập đúng số điện thoại chủ shop (10 chữ số)');
      return;
    }
    setErrorMsg(null);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedRegOtp(code);
    setRegOtp(code);
    setIsRegOtpSent(true);
  };

  // Submit Shop Registration
  const handleRegisterShop = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanPhone = regPhone.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      setErrorMsg('Vui lòng nhập số điện thoại chủ shop hợp lệ (10 chữ số)');
      return;
    }
    if (!regShopName.trim()) {
      setErrorMsg('Vui lòng nhập Tên Gian Hàng / Shop');
      return;
    }
    if (!regOwnerName.trim()) {
      setErrorMsg('Vui lòng nhập Họ và Tên chủ shop');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setErrorMsg('Mật khẩu quản trị Shop phải có ít nhất 6 ký tự');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp! Vui lòng kiểm tra lại.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newSeller: RegisteredSeller = {
        id: 'seller-' + Date.now().toString(36),
        phone: cleanPhone,
        shopName: regShopName.trim(),
        ownerName: regOwnerName.trim(),
        password: regPassword,
        category: regCategory,
        createdAt: new Date().toISOString()
      };
      storage.saveRegisteredSeller(newSeller);

      if (onUpdateShopSettings) {
        onUpdateShopSettings({
          shopName: regShopName.trim(),
          bankName: regBankName,
          bankAccountNumber: regBankAccountNumber.trim(),
          bankAccountHolder: (regBankAccountHolder.trim() || regOwnerName.trim()).toUpperCase()
        });
      }

      setLoginPhone(cleanPhone);
      setLoginPassword(regPassword);
      setSuccessMsg(`🎉 Đăng ký Gian hàng "${regShopName}" với Quản Trị Viên thành công! Đang kích hoạt Kênh Người Bán...`);
      
      setTimeout(() => {
        handleSuccess('seller');
      }, 500);
    }, 600);
  };

  // Submit Shop Login
  const handleLoginShop = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanPhone = loginPhone.trim().replace(/\s+/g, '');
    if (!cleanPhone) {
      setErrorMsg('Vui lòng nhập số điện thoại gian hàng');
      return;
    }
    if (!loginPassword.trim()) {
      setErrorMsg('Vui lòng nhập mật khẩu quản lý shop');
      return;
    }

    const registeredSellers = storage.getRegisteredSellers();
    const found = registeredSellers.find(s => s.phone === cleanPhone);

    if (found && found.password && found.password !== loginPassword) {
      setErrorMsg('Mật khẩu quản lý Shop không chính xác!');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Login successful without sound
      handleSuccess('seller');
    }, 500);
  };

  // Submit Admin Master Password
  const handleAdminPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const effectiveTarget = correctPassword || '851011';
    if (adminPassword === effectiveTarget) {
      handleSuccess('admin');
    } else {
      setErrorMsg('Mật khẩu quản trị hệ thống không chính xác!');
    }
  };

  // Quick Preset Test for Shop
  const handleQuickShopPreset = (phone: string, password = '123456') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      handleSuccess('seller');
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="text-center space-y-1 mb-4">
          <div className="w-13 h-13 mx-auto rounded-2xl bg-gradient-to-tr from-[#ee4d2d] to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/25">
            <Store className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Kênh Quản Trị Người Bán (Shop)
          </h2>
          <p className="text-xs text-slate-500">
            Đăng ký gian hàng bằng Số điện thoại trước rồi mới đăng nhập
          </p>
        </div>

        {/* 2 Primary Modes: ĐĂNG KÝ SHOP BẰNG SĐT TRƯỚC -> ĐĂNG NHẬP SHOP */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-3 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setActiveMode('register_shop'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`py-2.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === 'register_shop'
                ? 'bg-[#ee4d2d] text-white shadow-md shadow-orange-500/25'
                : 'text-slate-600 hover:text-slate-900 bg-transparent'
            }`}
          >
            <UserPlus className="w-4 h-4 shrink-0" />
            <span>1. Đăng Ký Shop Bằng SĐT</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveMode('login_shop'); setErrorMsg(null); }}
            className={`py-2.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === 'login_shop'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 bg-transparent'
            }`}
          >
            <LogIn className="w-4 h-4 shrink-0" />
            <span>2. Đăng Nhập Shop Bằng SĐT</span>
          </button>
        </div>

        {/* Admin master pass sub-link */}
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={() => { setActiveMode('admin_password'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`text-[11px] font-bold flex items-center gap-1 cursor-pointer transition ${
              activeMode === 'admin_password' ? 'text-purple-700 underline' : 'text-slate-500 hover:text-purple-600'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-purple-600" />
            <span>Đăng nhập Quản Trị Sàn (Admin)</span>
          </button>
        </div>

        {/* Success Banner */}
        {successMsg && (
          <div className="mb-3 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="mb-3 p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 1: SHOP ĐĂNG KÝ BẰNG SỐ ĐIỆN THOẠI TRƯỚC */}
        {/* ========================================================================= */}
        {activeMode === 'register_shop' && (
          <form onSubmit={handleRegisterShop} className="space-y-3 text-xs">
            <div className="p-3 bg-orange-50/80 border border-orange-200 rounded-2xl flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#ee4d2d] shrink-0 mt-0.5" />
              <div className="text-[11px] leading-tight text-slate-600">
                <span className="font-bold text-slate-900 block mb-0.5">
                  Đăng ký mở gian hàng Shop bằng Số điện thoại
                </span>
                Nhập số điện thoại chủ shop để kích hoạt Kênh Người Bán, đăng bán sản phẩm và rút doanh thu 0% phí sàn.
              </div>
            </div>

            {/* SĐT chủ shop */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center justify-between">
                <span>Số điện thoại chủ Shop *</span>
                <span className="text-[10px] text-slate-400 font-normal">Dùng làm tài khoản đăng nhập shop</span>
              </label>
              <div className="flex gap-2">
                <div className="px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl font-bold text-slate-700 text-xs shrink-0 flex items-center">
                  🇻🇳 +84
                </div>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="0912 345 678"
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#ee4d2d] font-bold text-slate-900 text-sm tracking-wide"
                  required
                />
              </div>
            </div>

            {/* Tên Shop & Chủ Shop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tên Gian Hàng / Shop *</label>
                <input
                  type="text"
                  value={regShopName}
                  onChange={(e) => setRegShopName(e.target.value)}
                  placeholder="VD: VIETSHOP Mart"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#ee4d2d] font-semibold text-slate-800"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Họ và Tên chủ shop *</label>
                <input
                  type="text"
                  value={regOwnerName}
                  onChange={(e) => setRegOwnerName(e.target.value)}
                  placeholder="VD: Hà Hoàng Thu"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#ee4d2d] font-semibold text-slate-800"
                  required
                />
              </div>
            </div>

            {/* Ngành hàng */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Ngành hàng kinh doanh chính *</label>
              <select
                value={regCategory}
                onChange={(e) => setRegCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#ee4d2d] font-semibold text-slate-800"
              >
                {POPULAR_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Mật khẩu shop & xác nhận */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">Mật khẩu Shop *</label>
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="text-[10px] text-slate-400 hover:text-slate-600"
                  >
                    {showRegPassword ? 'Ẩn' : 'Hiện'}
                  </button>
                </div>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#ee4d2d] font-bold text-slate-800"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nhập lại mật khẩu *</label>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Xác nhận mật khẩu"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#ee4d2d] font-bold text-slate-800"
                  required
                />
              </div>
            </div>

            {/* OTP verification for Shop */}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 text-[11px]">Xác minh SĐT chủ Shop:</span>
                <button
                  type="button"
                  onClick={handleSendRegOtp}
                  className="text-[11px] font-bold text-[#ee4d2d] hover:underline cursor-pointer"
                >
                  {isRegOtpSent ? 'Gửi lại OTP SMS' : 'Lấy mã OTP SMS nhanh'}
                </button>
              </div>

              {isRegOtpSent ? (
                <div className="space-y-1 animate-in fade-in">
                  <div className="flex items-center justify-between text-[11px] text-emerald-700 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200">
                    <span>Mã xác thực gửi tới {regPhone}:</span>
                    <span className="font-mono font-black text-sm">{generatedRegOtp}</span>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={regOtp}
                    onChange={(e) => setRegOtp(e.target.value)}
                    placeholder="Nhập mã OTP 6 số"
                    className="w-full text-center px-3 py-1.5 bg-white border border-emerald-400 rounded-xl font-black text-base tracking-widest text-emerald-800"
                  />
                </div>
              ) : (
                <p className="text-[10px] text-slate-400">
                  Nhấn "Lấy mã OTP SMS nhanh" để hệ thống tạo mã xác thực tự động cho số điện thoại.
                </p>
              )}
            </div>

            {/* Thông tin thẻ & Tài khoản ngân hàng nhận tiền bán hàng */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Tài Khoản / Thẻ Ngân Hàng Nhận Tiền Bán Hàng</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Tiền sau khi bán hàng thành công sẽ chuyển vào Ví VIETSHOP và người bán có thể rút về tài khoản/thẻ này bất kỳ lúc nào.
              </p>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 text-[11px]">Ngân hàng thụ hưởng *</label>
                <select
                  value={regBankName}
                  onChange={(e) => setRegBankName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#ee4d2d]"
                >
                  {POPULAR_BANKS_LIST.map(bank => (
                    <option key={bank} value={bank.split(' (')[0]}>{bank}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-[11px]">Số tài khoản / Số thẻ ngân hàng *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 101889977665"
                    value={regBankAccountNumber}
                    onChange={(e) => setRegBankAccountNumber(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#ee4d2d]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-[11px]">Họ tên chủ tài khoản/thẻ *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: HA HOANG THU"
                    value={regBankAccountHolder}
                    onChange={(e) => setRegBankAccountHolder(e.target.value.toUpperCase())}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold uppercase text-slate-900 focus:outline-none focus:border-[#ee4d2d]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-[#ee4d2d] to-orange-500 hover:from-[#d73211] hover:to-orange-600 text-white font-black text-xs rounded-xl shadow-md shadow-orange-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Store className="w-4 h-4" />
                  <span>ĐĂNG KÝ BÁN HÀNG & KÍCH HOẠT GIAN HÀNG NGAY</span>
                </>
              )}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => { setActiveMode('login_shop'); setErrorMsg(null); }}
                className="text-[11px] text-slate-500 hover:text-[#ee4d2d] font-semibold cursor-pointer"
              >
                Đã có tài khoản Shop? 👉 <span className="text-[#ee4d2d] font-bold underline">Chuyển sang Đăng Nhập Shop</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* MODE 2: SHOP ĐĂNG NHẬP BẰNG SỐ ĐIỆN THOẠI */}
        {/* ========================================================================= */}
        {activeMode === 'login_shop' && (
          <form onSubmit={handleLoginShop} className="space-y-3.5 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-2.5">
              <LogIn className="w-5 h-5 text-slate-800 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-tight text-slate-600">
                <span className="font-bold text-slate-900 block mb-0.5">
                  Đăng nhập Kênh Người Bán bằng SĐT đã đăng ký
                </span>
                Quản lý kho hàng, đơn đặt hàng, in phiếu gửi và đối soát doanh thu.
              </div>
            </div>

            {/* SĐT */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Số điện thoại Shop đã đăng ký *</label>
              <div className="flex gap-2">
                <div className="px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl font-bold text-slate-700 text-xs shrink-0 flex items-center">
                  🇻🇳 +84
                </div>
                <input
                  type="tel"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  placeholder="0912 345 678"
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-slate-800 font-bold text-slate-900 text-sm tracking-wide"
                  required
                />
              </div>
            </div>

            {/* Mật khẩu Shop */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700">Mật khẩu quản lý Shop *</label>
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="text-[10px] text-slate-400 hover:text-slate-600"
                >
                  {showLoginPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                </button>
              </div>
              <input
                type={showLoginPassword ? 'text' : 'password'}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-slate-800 font-bold text-slate-800"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-black text-xs rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Store className="w-4 h-4" />
                  <span>ĐĂNG NHẬP VÀO KÊNH NGƯỜI BÁN</span>
                </>
              )}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => { setActiveMode('register_shop'); setErrorMsg(null); }}
                className="text-[11px] text-slate-600 hover:text-[#ee4d2d] font-semibold cursor-pointer"
              >
                Chưa đăng ký gian hàng? 👉 <span className="text-[#ee4d2d] font-bold underline">Đăng ký Shop bằng số điện thoại trước</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* MODE 3: QUẢN TRỊ VIÊN SÀN (ADMIN PASSWORD) */}
        {/* ========================================================================= */}
        {activeMode === 'admin_password' && (
          <form onSubmit={handleAdminPasswordSubmit} className="space-y-3.5 text-xs">
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-tight text-slate-600">
                <span className="font-bold text-slate-900 block mb-0.5">
                  Khu vực Quản Trị Hệ Thống (Platform Admin)
                </span>
                Dành cho Admin phê duyệt hồ sơ gian hàng, giám sát giao dịch và cấu hình sàn.
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700">Mật khẩu Quản Trị Toàn Sàn</label>
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="text-[10px] text-slate-400 hover:text-purple-600"
                >
                  {showAdminPassword ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
              <input
                type={showAdminPassword ? 'text' : 'password'}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Nhập mật khẩu quản trị..."
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-purple-600 font-bold text-slate-800"
                required
                autoFocus
              />
              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                <span>🔒 Mật khẩu được bảo mật kín, chỉ người có thẩm quyền mới được cấp.</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs rounded-xl shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <KeyRound className="w-4 h-4" />
              <span>XÁC NHẬN MẬT KHẨU BẢO VỆ</span>
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setActiveMode('login_shop')}
                className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
              >
                ← Quay lại Đăng Nhập Shop Bằng Số Điện Thoại
              </button>
            </div>
          </form>
        )}

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400">
            Hệ thống Kênh Người Bán VIETSHOP • Được bảo vệ bằng mật khẩu bảo mật.
          </p>
        </div>

      </div>
    </div>
  );
};
