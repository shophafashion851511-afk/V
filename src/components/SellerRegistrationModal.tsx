import React, { useState } from 'react';
import { 
  X, Store, CreditCard, Building2, MapPin, 
  FileText, Upload, CheckCircle2, AlertCircle, ArrowRight, 
  Sparkles, ShieldCheck, Image, Smartphone, Mail, User
} from 'lucide-react';
import { SellerRegistrationApplication, CustomerUser } from '../types';

interface SellerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitApplication: (app: SellerRegistrationApplication) => void;
  onSwitchToAdminReview?: () => void;
  currentCustomer?: CustomerUser | null;
}

const POPULAR_BANKS = [
  'Vietcombank (Ngân hàng Ngoại Thương)',
  'VietinBank (Ngân hàng Công Thương)',
  'Techcombank (Ngân hàng Kỹ Thương)',
  'MB Bank (Ngân hàng Quân Đội)',
  'BIDV (Ngân hàng Đầu tư & Phát triển)',
  'VPBank (Ngân hàng Việt Nam Thịnh Vượng)',
  'ACB (Ngân hàng Á Châu)',
  'TPBank (Ngân hàng Tiên Phong)',
  'Sacombank (Ngân hàng Sài Gòn Thương Tín)',
  'HDBank (Ngân hàng Phát triển TP.HCM)'
];

const CATEGORIES = [
  'Thời Trang Nam & Nữ',
  'Điện Thoại & Phụ Kiện Công Nghệ',
  'Mỹ Phẩm & Chăm Sóc Sắc Đẹp',
  'Thiết Bị Điện Gia Dụng',
  'Nhà Cửa & Đời Sống',
  'Bách Hóa Online & Thực Phẩm',
  'Thể Thao & Du Lịch',
  'Mẹ & Bé'
];

export const SellerRegistrationModal: React.FC<SellerRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSubmitApplication,
  onSwitchToAdminReview,
  currentCustomer
}) => {
  const [applicantName, setApplicantName] = useState(currentCustomer?.name || 'Nguyễn Văn Hùng');
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState(currentCustomer?.phone || '0912345678');
  const [email, setEmail] = useState(currentCustomer?.email || 'seller@vietshop.vn');
  const [taxOrIdNumber, setTaxOrIdNumber] = useState('');
  const [bankName, setBankName] = useState(POPULAR_BANKS[0]);
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankAccountHolder, setBankAccountHolder] = useState(currentCustomer?.name ? currentCustomer.name.toUpperCase() : '');
  const [warehouseAddress, setWarehouseAddress] = useState('');
  const [businessCategory, setBusinessCategory] = useState(CATEGORIES[0]);
  const [idCardImage, setIdCardImage] = useState<string>('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<SellerRegistrationApplication | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (currentCustomer) {
      if (currentCustomer.name) {
        setApplicantName(currentCustomer.name);
        setBankAccountHolder(currentCustomer.name.toUpperCase());
      }
      if (currentCustomer.phone) setPhone(currentCustomer.phone);
      if (currentCustomer.email) setEmail(currentCustomer.email);
    }
  }, [currentCustomer]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setIdCardImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!shopName.trim()) {
      setErrorMsg('Vui lòng nhập Tên gian hàng muốn mở!');
      return;
    }
    if (!taxOrIdNumber.trim()) {
      setErrorMsg('Vui lòng nhập Mã số thuế hoặc CCCD (12 chữ số)!');
      return;
    }
    if (!bankAccountNumber.trim() || !bankAccountHolder.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ Số tài khoản và Tên chủ tài khoản ngân hàng để nhận tiền!');
      return;
    }

    setIsSubmitting(true);

    const newApp: SellerRegistrationApplication = {
      id: 'app-' + Date.now().toString(36),
      userId: currentCustomer?.id || ('usr-customer-' + Date.now().toString(36)),
      applicantName,
      phone,
      email,
      shopName,
      taxOrIdNumber,
      bankName,
      bankAccountNumber,
      bankAccountHolder: bankAccountHolder.toUpperCase(),
      warehouseAddress: warehouseAddress || 'Hà Nội & TP. Hồ Chí Minh',
      businessCategory,
      status: 'pending',
      submittedAt: new Date().toLocaleString('vi-VN')
    };

    try {
      // Call backend API
      await fetch('/api/seller/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApp)
      }).catch(() => {});

      onSubmitApplication(newApp);
      setSubmitSuccess(newApp);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi gửi hồ sơ, vui lòng thử lại');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative my-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitSuccess ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ee4d2d] to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 shrink-0">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-black tracking-wider uppercase text-[#ee4d2d]">
                  Quy trình Đăng Ký Người Bán
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                  Đăng Ký Mở Gian Hàng Bán Hàng 0Đ
                </h2>
                <p className="text-xs text-slate-500">
                  Hoàn thiện thông tin gian hàng & thuế/ngân hàng để Ban Quản Trị VIETSHOP phê duyệt kích hoạt quyền Seller.
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-semibold">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Section 1: Thông tin gian hàng */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                  <Store className="w-4 h-4 text-[#ee4d2d]" />
                  <span>1. Thông Tin Gian Hàng & Liên Hệ</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Tên Gian Hàng / Thương Hiệu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Hùng Sport Official Store"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#ee4d2d] bg-white text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Ngành Hàng Kinh Doanh Chính <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={businessCategory}
                      onChange={(e) => setBusinessCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#ee4d2d] bg-white text-slate-800"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Họ Và Tên Chủ Gian Hàng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#ee4d2d] bg-white text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Số Điện Thoại Nhận Đơn & OTP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#ee4d2d] bg-white text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Địa Chỉ Kho Lấy Hàng (Shipper đến nhận hàng) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Số nhà, đường phố, phường/xã, quận/huyện, tỉnh/thành phố"
                    value={warehouseAddress}
                    onChange={(e) => setWarehouseAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#ee4d2d] bg-white text-slate-800"
                  />
                </div>
              </div>

              {/* Section 2: Định danh & Thuế & Ngân hàng rút tiền */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>2. Định Danh & Tài Khoản Ngân Hàng Rút Tiền Doanh Thu</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Mã Số Thuế / Số CCCD (12 chữ số) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="031489201948"
                      value={taxOrIdNumber}
                      onChange={(e) => setTaxOrIdNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#ee4d2d] bg-white text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Ngân Hàng Nhận Tiền Rút <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#ee4d2d] bg-white text-slate-800"
                    >
                      {POPULAR_BANKS.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Số Tài Khoản Ngân Hàng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="9988112233..."
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#ee4d2d] bg-white text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Tên Chủ Tài Khoản (In hoa không dấu) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="NGUYEN VAN HUNG"
                      value={bankAccountHolder}
                      onChange={(e) => setBankAccountHolder(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#ee4d2d] bg-white text-slate-800"
                    />
                  </div>
                </div>

                {/* Optional ID Upload */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Ảnh Mặt Trước CCCD / Giấy Phép Kinh Doanh (Tùy chọn)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-dashed border-slate-300 hover:border-[#ee4d2d] text-slate-600 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 text-[#ee4d2d]" />
                      <span>Chọn ảnh từ máy tính</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileUpload} 
                      />
                    </label>
                    {idCardImage && (
                      <div className="flex items-center gap-2 text-emerald-600 font-medium">
                        <img src={idCardImage} alt="ID Preview" className="w-8 h-8 rounded-lg object-cover border border-emerald-300" />
                        <span>Đã tải ảnh lên thành công</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Policy note */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-800">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Chính sách kiểm duyệt của Ban Quản Trị VIETSHOP:</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Hồ sơ đăng ký sau khi gửi sẽ được Ban Quản Trị VIETSHOP thẩm định tính hợp lệ của thông tin CCCD/Mã số thuế và tài khoản ngân hàng trong vòng 2-24h. Bạn có thể theo dõi và duyệt ngay tại mục Quản Trị VIETSHOP.
                </p>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-slate-700 cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ee4d2d] to-orange-500 hover:from-[#d73211] hover:to-orange-600 text-white font-bold shadow-md shadow-orange-500/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Đang gửi hồ sơ...</span>
                  ) : (
                    <>
                      <span>Gửi Đăng Ký Mở Gian Hàng</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Submission Success View */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-black text-slate-900">
                Gửi Hồ Sơ Đăng Ký Thành Công!
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Gian hàng <span className="font-bold text-[#ee4d2d]">{submitSuccess.shopName}</span> đã được ghi nhận vào hệ thống và đang chờ Ban Quản Trị VIETSHOP phê duyệt.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between pb-1 border-b border-slate-200">
                <span className="text-slate-500">Mã hồ sơ:</span>
                <span className="font-bold text-slate-800">{submitSuccess.id}</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-200">
                <span className="text-slate-500">Tên gian hàng:</span>
                <span className="font-bold text-slate-800">{submitSuccess.shopName}</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-200">
                <span className="text-slate-500">Tài khoản ngân hàng:</span>
                <span className="font-bold text-slate-800">{submitSuccess.bankName} - {submitSuccess.bankAccountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Trạng thái:</span>
                <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md">
                  Chờ Ban Quản Trị Duyệt
                </span>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Đóng
              </button>
              {onSwitchToAdminReview && (
                <button
                  onClick={() => {
                    onClose();
                    onSwitchToAdminReview();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Vào Quản Trị VIETSHOP Để Phê Duyệt Ngay</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
