import React, { useState, useEffect } from 'react';
import { CustomerUser } from '../types';
import { 
  X, Mail, Phone, Lock, CheckCircle2, ArrowRight, ShieldCheck, 
  Sparkles, Smartphone, AlertCircle, RefreshCw, Eye, EyeOff,
  UserCheck, UserPlus, LogIn, MapPin
} from 'lucide-react';
import { storage, RegisteredBuyer } from '../utils/storage';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (user: CustomerUser) => void;
  initialMode?: 'register' | 'login';
}

type AuthMode = 'register_phone' | 'login_phone' | 'google' | 'facebook';

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
  initialMode = 'register'
}) => {
  const [activeMode, setActiveMode] = useState<AuthMode>(
    initialMode === 'login' ? 'login_phone' : 'register_phone'
  );

  // Sync initialMode when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveMode(initialMode === 'login' ? 'login_phone' : 'register_phone');
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [isOpen, initialMode]);

  // Registration by Phone State
  const [regPhone, setRegPhone] = useState('');
  const [regName, setRegName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regOtp, setRegOtp] = useState('');
  const [isRegOtpSent, setIsRegOtpSent] = useState(false);
  const [generatedRegOtp, setGeneratedRegOtp] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Login by Phone State
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoginWithOtp, setIsLoginWithOtp] = useState(false);
  const [loginOtp, setLoginOtp] = useState('');
  const [isLoginOtpSent, setIsLoginOtpSent] = useState(false);
  const [generatedLoginOtp, setGeneratedLoginOtp] = useState('');

  // Google / Email State
  const [googleEmail, setGoogleEmail] = useState('hahoangthu139@gmail.com');
  const [googleName, setGoogleName] = useState('Hà Hoàng Thu');

  // Facebook State
  const [fbName, setFbName] = useState('Hoàng Thu Hà (Facebook)');
  const [fbEmail, setFbEmail] = useState('thuha.facebook@gmail.com');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Send OTP for Registration
  const handleSendRegOtp = () => {
    if (!regPhone.trim() || regPhone.length < 9) {
      setErrorMsg('Vui lòng nhập đúng số điện thoại (10 chữ số)');
      return;
    }
    setErrorMsg(null);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedRegOtp(code);
    setRegOtp(code);
    setIsRegOtpSent(true);
  };

  // Submit Phone Registration
  const handleRegisterPhone = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanPhone = regPhone.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      setErrorMsg('Vui lòng nhập số điện thoại hợp lệ (10 chữ số)');
      return;
    }
    if (!regName.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên người nhận hàng');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setErrorMsg('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp! Vui lòng nhập lại.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Save buyer in storage
      const newBuyer: RegisteredBuyer = {
        id: 'buyer-' + Date.now().toString(36),
        phone: cleanPhone,
        name: regName.trim(),
        password: regPassword,
        address: regAddress.trim(),
        createdAt: new Date().toISOString()
      };
      storage.saveRegisteredBuyer(newBuyer);

      // Pre-fill login
      setLoginPhone(cleanPhone);
      setLoginPassword(regPassword);
      setSuccessMsg(`Đăng ký số điện thoại ${cleanPhone} thành công! Vui lòng kiểm tra thông tin và đăng nhập.`);
      
      // Switch to Login tab smoothly
      setActiveMode('login_phone');
    }, 600);
  };

  // Send OTP for Login
  const handleSendLoginOtp = () => {
    if (!loginPhone.trim() || loginPhone.length < 9) {
      setErrorMsg('Vui lòng nhập đúng số điện thoại');
      return;
    }
    setErrorMsg(null);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedLoginOtp(code);
    setLoginOtp(code);
    setIsLoginOtpSent(true);
  };

  // Submit Phone Login
  const handleLoginPhone = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanPhone = loginPhone.trim().replace(/\s+/g, '');
    if (!cleanPhone) {
      setErrorMsg('Vui lòng nhập số điện thoại');
      return;
    }

    // Verify against registered buyers
    const registeredBuyers = storage.getRegisteredBuyers();
    const foundBuyer = registeredBuyers.find(b => b.phone === cleanPhone);

    if (isLoginWithOtp) {
      if (!loginOtp.trim()) {
        setErrorMsg('Vui lòng nhập mã OTP gửi về số điện thoại');
        return;
      }
    } else {
      if (!loginPassword.trim()) {
        setErrorMsg('Vui lòng nhập mật khẩu tài khoản');
        return;
      }
      if (foundBuyer && foundBuyer.password && foundBuyer.password !== loginPassword) {
        setErrorMsg('Mật khẩu không chính xác! Vui lòng kiểm tra lại hoặc chọn đăng nhập qua OTP.');
        return;
      }
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const user: CustomerUser = {
        id: foundBuyer?.id || ('usr-p-' + Date.now().toString(36)),
        name: foundBuyer?.name || `Khách hàng ${cleanPhone.slice(-4)}`,
        phone: cleanPhone,
        address: foundBuyer?.address || '',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        provider: 'phone',
        createdAt: new Date().toLocaleDateString('vi-VN')
      };
      // NOTE: Removed playSuccessChime() per user instruction (bỏ âm thanh đăng nhập)
      onSuccessLogin(user);
    }, 600);
  };

  // Handle Google Login
  const handleLoginGoogle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail.trim()) {
      setErrorMsg('Vui lòng nhập địa chỉ Gmail!');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const user: CustomerUser = {
        id: 'usr-g-' + Date.now().toString(36),
        name: googleName.trim() || googleEmail.split('@')[0],
        email: googleEmail.trim(),
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        provider: 'google',
        createdAt: new Date().toLocaleDateString('vi-VN')
      };
      // NOTE: Removed playSuccessChime()
      onSuccessLogin(user);
    }, 600);
  };

  // Handle Facebook Login
  const handleLoginFacebook = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const user: CustomerUser = {
        id: 'usr-fb-' + Date.now().toString(36),
        name: fbName.trim() || 'Người dùng Facebook',
        email: fbEmail.trim(),
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        provider: 'facebook',
        createdAt: new Date().toLocaleDateString('vi-VN')
      };
      // NOTE: Removed playSuccessChime()
      onSuccessLogin(user);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center pb-3 border-b border-slate-100">
          <div className="w-12 h-12 bg-gradient-to-tr from-[#ee4d2d] to-orange-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg shadow-orange-500/25">
            <Smartphone className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Xác Thực Khách Hàng VIETSHOP
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Đăng ký bằng số điện thoại trước để kích hoạt tài khoản và mua sắm
          </p>
        </div>

        {/* 2 Primary Modes: ĐĂNG KÝ TRƯỚC -> ĐĂNG NHẬP SAU */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl my-3 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setActiveMode('register_phone'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`py-2.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === 'register_phone'
                ? 'bg-[#ee4d2d] text-white shadow-md shadow-orange-500/25'
                : 'text-slate-600 hover:text-slate-900 bg-transparent'
            }`}
          >
            <UserPlus className="w-4 h-4 shrink-0" />
            <span>1. Đăng Ký Bằng SĐT</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveMode('login_phone'); setErrorMsg(null); }}
            className={`py-2.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === 'login_phone'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 bg-transparent'
            }`}
          >
            <LogIn className="w-4 h-4 shrink-0" />
            <span>2. Đăng Nhập Bằng SĐT</span>
          </button>
        </div>

        {/* Alternative providers pills */}
        <div className="flex items-center justify-center gap-2 mb-3 text-[11px] text-slate-500">
          <span>Hoặc tiếp tục với:</span>
          <button
            type="button"
            onClick={() => { setActiveMode('google'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`px-2.5 py-1 rounded-lg border font-bold transition flex items-center gap-1 cursor-pointer ${
              activeMode === 'google' 
                ? 'border-red-400 bg-red-50 text-red-600' 
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
            }`}
          >
            <Mail className="w-3 h-3 text-red-500" />
            <span>Gmail</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveMode('facebook'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`px-2.5 py-1 rounded-lg border font-bold transition flex items-center gap-1 cursor-pointer ${
              activeMode === 'facebook' 
                ? 'border-blue-400 bg-blue-50 text-blue-600' 
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
            }`}
          >
            <span className="text-blue-600 font-bold">f</span>
            <span>Facebook</span>
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
        {/* MODE 1: ĐĂNG KÝ BẰNG SỐ ĐIỆN THOẠI TRƯỚC */}
        {/* ========================================================================= */}
        {activeMode === 'register_phone' && (
          <form onSubmit={handleRegisterPhone} className="space-y-3 text-xs">
            <div className="p-3 bg-orange-50/70 border border-orange-200 rounded-2xl flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#ee4d2d] shrink-0 mt-0.5" />
              <div className="text-[11px] leading-tight text-slate-600">
                <span className="font-bold text-slate-900 block mb-0.5">
                  Đăng ký tài khoản người mua bằng Số điện thoại
                </span>
                Quý khách vui lòng đăng ký số điện thoại trước để kích hoạt voucher 100K và bảo vệ quyền lợi nhận hàng.
              </div>
            </div>

            {/* Số điện thoại */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center justify-between">
                <span>Số điện thoại đăng ký *</span>
                <span className="text-[10px] text-slate-400 font-normal">Dùng làm tên đăng nhập</span>
              </label>
              <div className="flex gap-2">
                <div className="px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl font-bold text-slate-700 text-xs shrink-0 flex items-center">
                  🇻🇳 +84
                </div>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="0988 776 655"
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#ee4d2d] font-bold text-slate-900 text-sm tracking-wide"
                  required
                />
              </div>
            </div>

            {/* Họ và tên */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Họ và tên người nhận hàng *</label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="VD: Nguyễn Văn Khang"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#ee4d2d] font-semibold text-slate-800"
                required
              />
            </div>

            {/* Mật khẩu & Xác nhận */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">Mật khẩu *</label>
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

            {/* Địa chỉ nhận hàng */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center justify-between">
                <span>Địa chỉ giao hàng mặc định</span>
                <span className="text-[10px] text-slate-400 font-normal">Tùy chọn</span>
              </label>
              <input
                type="text"
                value={regAddress}
                onChange={(e) => setRegAddress(e.target.value)}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#ee4d2d] text-slate-700"
              />
            </div>

            {/* OTP verification */}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 text-[11px]">Xác minh số điện thoại:</span>
                <button
                  type="button"
                  onClick={handleSendRegOtp}
                  className="text-[11px] font-bold text-[#ee4d2d] hover:underline cursor-pointer"
                >
                  {isRegOtpSent ? 'Gửi lại mã OTP SMS' : 'Lấy mã OTP SMS nhanh'}
                </button>
              </div>

              {isRegOtpSent ? (
                <div className="space-y-1 animate-in fade-in">
                  <div className="flex items-center justify-between text-[11px] text-emerald-700 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200">
                    <span>Mã OTP gửi tới {regPhone}:</span>
                    <span className="font-mono font-black text-sm">{generatedRegOtp}</span>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={regOtp}
                    onChange={(e) => setRegOtp(e.target.value)}
                    placeholder="Nhập 6 số OTP"
                    className="w-full text-center px-3 py-1.5 bg-white border border-emerald-400 rounded-xl font-black text-base tracking-widest text-emerald-800"
                  />
                </div>
              ) : (
                <p className="text-[10px] text-slate-400">
                  Nhấn "Lấy mã OTP SMS nhanh" để hệ thống tạo mã xác thực tự động.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-[#ee4d2d] to-orange-500 hover:from-[#d73211] hover:to-orange-600 text-white font-black text-xs rounded-xl shadow-md shadow-orange-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>HOÀN TẤT ĐĂNG KÝ BẰNG SỐ ĐIỆN THOẠI</span>
                </>
              )}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => { setActiveMode('login_phone'); setErrorMsg(null); }}
                className="text-[11px] text-slate-500 hover:text-[#ee4d2d] font-semibold cursor-pointer"
              >
                Đã đăng ký tài khoản trước đó? 👉 <span className="text-[#ee4d2d] font-bold underline">Chuyển sang Đăng Nhập</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* MODE 2: ĐĂNG NHẬP BẰNG SỐ ĐIỆN THOẠI ĐÃ ĐĂNG KÝ */}
        {/* ========================================================================= */}
        {activeMode === 'login_phone' && (
          <form onSubmit={handleLoginPhone} className="space-y-3.5 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-2.5">
              <LogIn className="w-5 h-5 text-slate-800 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-tight text-slate-600">
                <span className="font-bold text-slate-900 block mb-0.5">
                  Đăng nhập bằng Số điện thoại đã đăng ký
                </span>
                Nhập số điện thoại và mật khẩu (hoặc mã OTP gửi về điện thoại) để vào tài khoản.
              </div>
            </div>

            {/* Số điện thoại */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Số điện thoại đã đăng ký *</label>
              <div className="flex gap-2">
                <div className="px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl font-bold text-slate-700 text-xs shrink-0 flex items-center">
                  🇻🇳 +84
                </div>
                <input
                  type="tel"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  placeholder="0988 776 655"
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-slate-800 font-bold text-slate-900 text-sm tracking-wide"
                  required
                />
              </div>
            </div>

            {/* Password or OTP toggle */}
            {!isLoginWithOtp ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">Mật khẩu đăng nhập *</label>
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
                <div className="flex justify-between items-center pt-1">
                  <button
                    type="button"
                    onClick={() => setIsLoginWithOtp(true)}
                    className="text-[11px] text-[#ee4d2d] font-bold hover:underline cursor-pointer"
                  >
                    Quên mật khẩu? Đăng nhập bằng OTP SMS
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Mã xác thực OTP SMS:</span>
                  <button
                    type="button"
                    onClick={handleSendLoginOtp}
                    className="text-emerald-600 hover:underline text-[11px]"
                  >
                    {isLoginOtpSent ? 'Gửi lại mã OTP' : 'Gửi mã OTP ngay'}
                  </button>
                </div>
                {isLoginOtpSent && (
                  <div className="flex items-center justify-between text-[11px] text-emerald-700 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200">
                    <span>Mã OTP test:</span>
                    <span className="font-mono font-black text-sm">{generatedLoginOtp}</span>
                  </div>
                )}
                <input
                  type="text"
                  maxLength={6}
                  value={loginOtp}
                  onChange={(e) => setLoginOtp(e.target.value)}
                  placeholder="Nhập mã OTP 6 số"
                  className="w-full text-center px-3 py-2 bg-white border border-emerald-400 rounded-xl font-black text-base tracking-widest text-emerald-800"
                />
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setIsLoginWithOtp(false)}
                    className="text-[10px] text-slate-500 hover:underline"
                  >
                    Quay lại đăng nhập bằng Mật khẩu
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>ĐĂNG NHẬP VÀO VIETSHOP</span>
                </>
              )}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => { setActiveMode('register_phone'); setErrorMsg(null); }}
                className="text-[11px] text-slate-600 hover:text-[#ee4d2d] font-semibold cursor-pointer"
              >
                Chưa có tài khoản? 👉 <span className="text-[#ee4d2d] font-bold underline">Đăng ký bằng số điện thoại trước</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* MODE 3: GOOGLE (GMAIL) */}
        {/* ========================================================================= */}
        {activeMode === 'google' && (
          <form onSubmit={handleLoginGoogle} className="space-y-3.5 text-xs">
            <div className="p-3 bg-red-50/70 border border-red-100 rounded-2xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-xs border border-red-200 shrink-0">
                <Mail className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-[11px] leading-tight text-slate-600">
                <span className="font-bold text-slate-800 block">Đăng nhập bằng tài khoản Gmail</span>
                Tiến trình đơn hàng sẽ được gửi thông báo tới Gmail của bạn.
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Họ và tên hiển thị</label>
              <input
                type="text"
                value={googleName}
                onChange={(e) => setGoogleName(e.target.value)}
                placeholder="VD: Hà Hoàng Thu"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#ee4d2d] font-semibold text-slate-800"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Địa chỉ Gmail *</label>
              <input
                type="email"
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                placeholder="VD: hahoangthu139@gmail.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#ee4d2d] font-semibold text-slate-800"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-black text-xs rounded-xl shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  <span>TIẾP TỤC VỚI GMAIL</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ========================================================================= */}
        {/* MODE 4: FACEBOOK */}
        {/* ========================================================================= */}
        {activeMode === 'facebook' && (
          <form onSubmit={handleLoginFacebook} className="space-y-3.5 text-xs">
            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-xs border border-blue-200 shrink-0">
                <span className="font-black text-blue-600 text-lg">f</span>
              </div>
              <div className="text-[11px] leading-tight text-slate-600">
                <span className="font-bold text-slate-800 block">Đăng nhập với Facebook</span>
                Đồng bộ nhanh thông tin tài khoản Facebook.
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Tên Facebook của bạn</label>
              <input
                type="text"
                value={fbName}
                onChange={(e) => setFbName(e.target.value)}
                placeholder="VD: Hoàng Thu Hà"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600 font-semibold text-slate-800"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Email liên kết Facebook</label>
              <input
                type="email"
                value={fbEmail}
                onChange={(e) => setFbEmail(e.target.value)}
                placeholder="thuha.fb@gmail.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600 font-semibold text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#1877F2] hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" />
                  <span>ĐĂNG NHẬP VỚI FACEBOOK</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Benefits Note */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Bằng việc đăng nhập, bạn đồng ý với Điều khoản dịch vụ & Chính sách bảo mật của VIETSHOP.
          </p>
        </div>

      </div>
    </div>
  );
};
