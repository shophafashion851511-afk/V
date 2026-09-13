import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, X, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import { storage } from '../utils/storage';

interface AdminLoginModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  onSuccess,
  onClose
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const targetPassword = storage.getAdminPassword();
    if (!password.trim()) {
      setErrorMsg('Vui lòng nhập mật khẩu quản trị!');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (password === targetPassword) {
        onSuccess();
      } else {
        setErrorMsg('Mật khẩu quản trị không chính xác! Quyền truy cập bị từ chối.');
      }
    }, 300);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200"
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
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-[#ee4d2d] text-white flex items-center justify-center shadow-xl shadow-purple-500/25">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Ban Quản Trị VIETSHOP
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed px-4">
            Khu vực quản trị cấp cao dành riêng cho Quản Trị Viên hệ thống. Mật khẩu được mã hóa và cất giữ an toàn.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2 animate-in shake">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Secret Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-600" />
                <span>Mật Khẩu Quản Trị Hệ Thống:</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-slate-500 hover:text-purple-600 flex items-center gap-1 font-medium cursor-pointer"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Ẩn ký tự</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Hiện ký tự</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="Nhập mật khẩu quản trị kín..."
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-purple-600 tracking-wider transition-colors"
                autoFocus
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-purple-700 via-indigo-600 to-[#ee4d2d] hover:opacity-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>MỞ KHOÁ VÀO QUẢN TRỊ</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            🔒 Bảo mật cấp cao: Không ai được biết mật khẩu ngoài Quản trị viên.
          </p>
        </div>
      </div>
    </div>
  );
};
