import React, { useState } from 'react';
import { 
  X, HelpCircle, ShoppingBag, CreditCard, RotateCcw, 
  ShieldCheck, Briefcase, FileText, Lock, Smartphone, 
  Truck, PhoneCall, Mail, CheckCircle2, ChevronRight, Award, 
  MapPin, Clock, Sparkles, AlertCircle
} from 'lucide-react';

export type FooterTabType = 
  | 'help_center' 
  | 'shopping_guide' 
  | 'payment_shipping' 
  | 'return_refund' 
  | 'about_us' 
  | 'careers' 
  | 'terms' 
  | 'privacy' 
  | 'app_download'
  | 'contact';

interface FooterInfoModalProps {
  initialTab?: FooterTabType;
  shopName?: string;
  onClose: () => void;
  onOpenSeller?: () => void;
  onOpenInstallModal?: () => void;
}

export const FooterInfoModal: React.FC<FooterInfoModalProps> = ({
  initialTab = 'help_center',
  shopName = 'VIETSHOP',
  onClose,
  onOpenSeller,
  onOpenInstallModal
}) => {
  const [activeTab, setActiveTab] = useState<FooterTabType>(initialTab);

  const tabs: { id: FooterTabType; label: string; icon: React.ElementType }[] = [
    { id: 'help_center', label: 'Trung Tâm Trợ Giúp', icon: HelpCircle },
    { id: 'shopping_guide', label: 'Hướng Dẫn Mua Hàng', icon: ShoppingBag },
    { id: 'payment_shipping', label: 'Thanh Toán & Vận Chuyển', icon: CreditCard },
    { id: 'return_refund', label: 'Trả Hàng & Hoàn Tiền 15 Ngày', icon: RotateCcw },
    { id: 'about_us', label: `Giới Thiệu Về ${shopName}`, icon: Award },
    { id: 'careers', label: 'Tuyển Dụng', icon: Briefcase },
    { id: 'terms', label: 'Điều Khoản Dịch Vụ', icon: FileText },
    { id: 'privacy', label: 'Chính Sách Bảo Mật', icon: Lock },
    { id: 'app_download', label: 'Tải Ứng Dụng Di Động', icon: Smartphone },
    { id: 'contact', label: 'Liên Hệ & Hotline', icon: PhoneCall },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-white">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">{shopName} - Thông Tin & Hỗ Trợ</h2>
              <p className="text-xs text-white/80">Trung tâm thông tin khách hàng, chính sách & dịch vụ sàn TMĐT</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body Container with Sidebar Tabs + Content Panel */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-3 overflow-y-auto shrink-0 flex md:flex-col gap-1 custom-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold text-xs text-left transition-all cursor-pointer whitespace-nowrap md:whitespace-normal shrink-0 ${
                    isActive
                      ? 'bg-[#ee4d2d] text-white shadow-md shadow-orange-500/20'
                      : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="flex-1">{tab.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 hidden md:inline shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar text-slate-700 text-sm space-y-6">
            
            {/* 1. TRUNG TÂM TRỢ GIÚP */}
            {activeTab === 'help_center' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <HelpCircle className="w-6 h-6 text-[#ee4d2d]" />
                    <span>Trung Tâm Trợ Giúp {shopName}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Giải đáp các câu hỏi thường gặp và hướng dẫn nhanh cho người mua</p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-100 space-y-1.5">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                      <Sparkles className="w-4 h-4 text-[#ee4d2d]" />
                      Làm thế nào để áp dụng mã giảm giá và Freeship 0Đ?
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Khi xem giỏ hàng hoặc ở bước thanh toán, bạn bấm vào mục <strong>"Chọn Mã Giảm Giá"</strong>. Hệ thống sẽ tự động chọn mã giảm giá tốt nhất (bao gồm Voucher giảm tiền mặt + Voucher miễn phí vận chuyển 0Đ).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Tôi có thể kiểm tra hàng trước khi thanh toán không?
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {shopName} hỗ trợ đồng kiểm khi nhận hàng đối với tất cả các đơn vận chuyển tiêu chuẩn và hỏa tốc. Bạn hoàn toàn có thể mở bọc kiểm tra số lượng và ngoại quan sản phẩm trước khi thanh toán cho shipper.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-blue-600" />
                      Thời gian giao hàng mất bao lâu?
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      - Giao hỏa tốc: <strong>1 - 2 giờ</strong> trong nội thành Hà Nội & TP. Hồ Chí Minh.<br/>
                      - Giao nhanh toàn quốc: <strong>1 - 3 ngày</strong> làm việc đối với các tỉnh thành khác.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                      <RotateCcw className="w-4 h-4 text-purple-600" />
                      Chính sách bảo hành và đổi trả thế nào?
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Tất cả sản phẩm tại {shopName} đều được bảo hành chính hãng từ 6 - 24 tháng và hỗ trợ đổi trả miễn phí tận nhà trong vòng 15 ngày nếu có lỗi kỹ thuật.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. HƯỚNG DẪN MUA HÀNG */}
            {activeTab === 'shopping_guide' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6 text-[#ee4d2d]" />
                    <span>Hướng Dẫn 4 Bước Mua Hàng Tại {shopName}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Trải nghiệm mua sắm nhanh chóng, tiện lợi chỉ với vài cú chạm</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-[#ee4d2d] text-white flex items-center justify-center font-black text-sm">
                      1
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Tìm Kiếm & Chọn Sản Phẩm</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Sử dụng thanh tìm kiếm hoặc duyệt theo danh mục ngành hàng, bộ lọc Flash Sale, Mall hoặc Freeship Xtra.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-[#ee4d2d] text-white flex items-center justify-center font-black text-sm">
                      2
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Chọn Phân Loại & Thêm Vào Giỏ</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Chọn đúng màu sắc, kích cỡ, dung lượng cần mua rồi bấm <strong>"Thêm Vào Giỏ Hàng"</strong> hoặc <strong>"Mua Ngay"</strong>.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-[#ee4d2d] text-white flex items-center justify-center font-black text-sm">
                      3
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Áp Dụng Voucher & Xu Thưởng</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Áp mã giảm giá, voucher freeship và tích chọn <strong>"Dùng VIETSHOP Xu"</strong> để được khấu trừ tối đa giá trị đơn hàng.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-[#ee4d2d] text-white flex items-center justify-center font-black text-sm">
                      4
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Chọn Phương Thức & Đặt Hàng</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Điền địa chỉ nhận hàng, chọn phương thức thanh toán (COD, VIETSHOP Pay, VietQR, Thẻ) rồi bấm <strong>"Đặt Hàng"</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. THANH TOÁN & VẬN CHUYỂN */}
            {activeTab === 'payment_shipping' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-[#ee4d2d]" />
                    <span>Phương Thức Thanh Toán & Đối Tác Vận Chuyển</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Đa dạng, linh hoạt và bảo mật tuyệt đối 100%</p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-black text-slate-900 text-sm">1. Các Hình Thức Thanh Toán Hỗ Trợ:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <div className="font-black text-orange-600 text-sm">VIETSHOP Pay</div>
                      <p className="text-[10px] text-slate-500">Giảm thêm đến 30k</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <div className="font-black text-blue-600 text-sm">VietQR / MB / VCB</div>
                      <p className="text-[10px] text-slate-500">Quét mã chuyển khoản 24/7</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <div className="font-black text-emerald-600 text-sm">COD Tiền Mặt</div>
                      <p className="text-[10px] text-slate-500">Nhận hàng trả tiền</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <div className="font-black text-purple-600 text-sm">Visa / Mastercard</div>
                      <p className="text-[10px] text-slate-500">Bảo mật chuẩn PCI DSS</p>
                    </div>
                  </div>

                  <h4 className="font-black text-slate-900 text-sm pt-2">2. Đơn Vị Vận Chuyển Uy Tín:</h4>
                  <div className="space-y-2.5">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-orange-600" />
                        <div>
                          <h5 className="font-bold text-slate-900 text-xs">VIETSHOP Xpress (VN Express)</h5>
                          <p className="text-[11px] text-slate-500">Giao hàng tiêu chuẩn 1 - 2 ngày, mạng lưới rộng khắp 63 tỉnh thành.</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">Freeship 0Đ</span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-red-600" />
                        <div>
                          <h5 className="font-bold text-slate-900 text-xs">Giao Hỏa Tốc 2 Giờ (Instant Delivery)</h5>
                          <p className="text-[11px] text-slate-500">Nhận hàng siêu tốc trong 120 phút qua GrabExpress / Ahamove.</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">Siêu Tốc</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. TRẢ HÀNG & HOÀN TIỀN */}
            {activeTab === 'return_refund' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <RotateCcw className="w-6 h-6 text-[#ee4d2d]" />
                    <span>Chính Sách Đổi Trả & Hoàn Tiền 15 Ngày</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Miễn phí 100% chi phí gửi trả hàng - An tâm mua sắm</p>
                </div>

                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 space-y-1">
                    <h4 className="font-black flex items-center gap-2 text-sm text-emerald-800">
                      <ShieldCheck className="w-4 h-4" /> Cam Kết VIETSHOP Đổi Trả Miễn Phí 15 Ngày
                    </h4>
                    <p>Khách hàng được quyền yêu cầu trả hàng và hoàn tiền trong vòng 15 ngày kể từ ngày nhận hàng thành công nếu sản phẩm có lỗi, không đúng mô tả hoặc không vừa size.</p>
                  </div>

                  <h4 className="font-black text-slate-900 text-sm pt-2">Quy Trình Hoàn Tiền 3 Bước:</h4>
                  <ol className="list-decimal pl-5 space-y-2 text-slate-600">
                    <li><strong>Gửi yêu cầu:</strong> Vào mục Đơn Hàng $\rightarrow$ Chọn <em>"Yêu cầu Trả hàng / Hoàn tiền"</em> $\rightarrow$ Chọn lý do và đính kèm hình ảnh/video.</li>
                    <li><strong>Shipper lấy hàng tận nhà:</strong> Shipper của sàn sẽ tới tận địa chỉ của bạn để lấy gói hàng trả lại mà bạn không phải trả bất kỳ cước phí nào.</li>
                    <li><strong>Nhận lại tiền:</strong> Tiền sẽ được hoàn về Ví VIETSHOP Pay hoặc tài khoản ngân hàng của bạn trong vòng 24 giờ sau khi kho nhận lại kiện hàng.</li>
                  </ol>
                </div>
              </div>
            )}

            {/* 5. GIỚI THIỆU SHOP */}
            {activeTab === 'about_us' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Award className="w-6 h-6 text-[#ee4d2d]" />
                    <span>Giới Thiệu Về Thương Hiệu {shopName}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Hệ thống thương mại điện tử trực tuyến uy tín hàng đầu Việt Nam</p>
                </div>

                <div className="space-y-4 text-xs leading-relaxed">
                  <p>
                    <strong>{shopName}</strong> là nền tảng mua sắm trực tuyến toàn diện, cung cấp hàng triệu sản phẩm chính hãng từ thời trang, công nghệ, điện máy đến bách hóa gia dụng. Chúng tôi luôn lấy khách hàng làm trọng tâm, mang đến trải nghiệm mua sắm mượt mà, giá cả cạnh tranh và dịch vụ giao vận hỏa tốc.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center pt-2">
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                      <div className="text-2xl font-black text-[#ee4d2d]">100%</div>
                      <div className="text-xs font-bold text-slate-800 mt-1">Hàng Chính Hãng</div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Cam kết đền gấp đôi nếu phát hiện hàng giả</p>
                    </div>

                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                      <div className="text-2xl font-black text-emerald-600">0Đ</div>
                      <div className="text-xs font-bold text-slate-800 mt-1">Miễn Phí Vận Chuyển</div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Hàng ngàn mã freeship áp dụng mỗi ngày</p>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                      <div className="text-2xl font-black text-blue-600">24/7</div>
                      <div className="text-xs font-bold text-slate-800 mt-1">Hỗ Trợ Khách Hàng</div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Tổng đài & Live Chat giải đáp tức thì</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. TUYỂN DỤNG */}
            {activeTab === 'careers' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-[#ee4d2d]" />
                    <span>Cơ Hội Nghề Nghiệp Tại {shopName}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Gia nhập đội ngũ năng động, môi trường làm việc chuẩn quốc tế</p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Chuyên Viên Phát Triển Phần Mềm (React / Fullstack)</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Địa điểm: Hà Nội & TP. HCM • Mức lương: 25 - 45 triệu VND</p>
                    </div>
                    <button 
                      onClick={() => alert('Cảm ơn bạn đã quan tâm! Vui lòng gửi CV về email: recruitment@vietshop.vn')}
                      className="px-4 py-2 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer shrink-0"
                    >
                      Ứng Tuyển Ngay
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Chuyên Viên Vận Hành & Chăm Sóc Khách Hàng (CSKH)</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Địa điểm: Toàn quốc (Hybrid / Online) • Mức lương: 12 - 18 triệu VND</p>
                    </div>
                    <button 
                      onClick={() => alert('Cảm ơn bạn đã quan tâm! Vui lòng gửi CV về email: recruitment@vietshop.vn')}
                      className="px-4 py-2 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer shrink-0"
                    >
                      Ứng Tuyển Ngay
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Trưởng Nhóm Quản Lý Kho & Chuỗi Cung Ứng (Logistics)</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Địa điểm: Kho Tổng Hà Nội & Bình Dương • Mức lương: 20 - 30 triệu VND</p>
                    </div>
                    <button 
                      onClick={() => alert('Cảm ơn bạn đã quan tâm! Vui lòng gửi CV về email: recruitment@vietshop.vn')}
                      className="px-4 py-2 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer shrink-0"
                    >
                      Ứng Tuyển Ngay
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 7. ĐIỀU KHOẢN DỊCH VỤ */}
            {activeTab === 'terms' && (
              <div className="space-y-4 animate-in fade-in duration-150 text-xs leading-relaxed">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-[#ee4d2d]" />
                    <span>Điều Khoản & Điều Kiện Sử Dụng</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Cập nhật mới nhất năm 2026</p>
                </div>

                <p>1. <strong>Tài khoản người dùng:</strong> Khi đăng ký tài khoản tại {shopName}, bạn cam kết cung cấp thông tin chính xác và chịu trách nhiệm bảo mật mật khẩu của mình.</p>
                <p>2. <strong>Quy định về giá và đơn hàng:</strong> Giá niêm yết trên website đã bao gồm thuế GTGT. {shopName} có quyền từ chối hoặc hủy đơn trong trường hợp có lỗi kỹ thuật hoặc sự cố bất khả kháng về giá bán.</p>
                <p>3. <strong>Bảo vệ quyền lợi người mua:</strong> Sàn giữ tiền tạm giữ cho đến khi người mua nhận hàng và xác nhận hài lòng hoặc hết thời hạn khiếu nại (15 ngày).</p>
              </div>
            )}

            {/* 8. CHÍNH SÁCH BẢO MẬT */}
            {activeTab === 'privacy' && (
              <div className="space-y-4 animate-in fade-in duration-150 text-xs leading-relaxed">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Lock className="w-6 h-6 text-[#ee4d2d]" />
                    <span>Chính Sách Bảo Mật Thông Tin</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Cam kết bảo mật dữ liệu tuyệt đối theo tiêu chuẩn quốc tế</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Mã Hóa Dữ Liệu SSL 256-Bit
                  </h4>
                  <p className="text-slate-600">
                    Toàn bộ thông tin cá nhân, địa chỉ giao hàng và thông tin thanh toán của bạn đều được mã hóa bằng giao thức SSL chuẩn bảo mật ngân hàng. {shopName} cam kết không bao giờ bán hoặc chia sẻ thông tin người dùng cho bên thứ ba vì mục đích quảng cáo trái phép.
                  </p>
                </div>
              </div>
            )}

            {/* 9. TẢI APP */}
            {activeTab === 'app_download' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Smartphone className="w-6 h-6 text-[#ee4d2d]" />
                    <span>Tải Ứng Dụng {shopName} Cho Điện Thoại</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Nhận ngay voucher 100K cho đơn hàng đầu tiên trên ứng dụng</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-200">
                  <div className="w-36 h-36 bg-white p-3 rounded-2xl border border-slate-300 shadow-md flex flex-col items-center justify-center shrink-0">
                    <img
                      src="/pwa-192x192.png"
                      alt="VIETSHOP Icon"
                      className="w-20 h-20 rounded-2xl shadow-sm object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/icon.svg';
                      }}
                    />
                    <span className="text-[10px] font-black text-[#ee4d2d] mt-2">VIETSHOP APP</span>
                  </div>

                  <div className="space-y-3 text-xs flex-1">
                    <h4 className="font-black text-slate-900 text-sm">Cài đặt trực tiếp ứng dụng VIETSHOP vào điện thoại:</h4>
                    <p className="text-slate-600 leading-relaxed">
                      Công nghệ Progressive Web App (PWA) thế hệ mới: Cài đặt chỉ trong 2 giây, không tốn dung lượng bộ nhớ (~2MB), mở ứng dụng 1 chạm ngay từ màn hình chính điện thoại iOS & Android.
                    </p>
                    <div className="flex flex-wrap gap-2.5 pt-1">
                      <button 
                        onClick={() => {
                          if (onOpenInstallModal) {
                            onOpenInstallModal();
                          }
                        }}
                        className="px-4 py-2.5 bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] hover:from-orange-600 hover:to-orange-700 text-white font-black rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 transition transform active:scale-95"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>📲 Cài Đặt Vào Điện Thoại Ngay</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 10. LIÊN HỆ */}
            {activeTab === 'contact' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <PhoneCall className="w-6 h-6 text-[#ee4d2d]" />
                    <span>Thông Tin Liên Hệ & Tổng Đài {shopName}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Đội ngũ CSKH luôn sẵn sàng hỗ trợ bạn 24/7</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl space-y-1.5">
                    <div className="font-black text-[#ee4d2d] flex items-center gap-2 text-sm">
                      <PhoneCall className="w-4 h-4" /> Tổng Đài Chăm Sóc Khách Hàng
                    </div>
                    <p className="text-lg font-black text-slate-900">1900 1221</p>
                    <p className="text-slate-500 text-[11px]">(8h00 - 21h00 hàng ngày, kể cả Thứ 7 & CN)</p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-1.5">
                    <div className="font-black text-blue-600 flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4" /> Hộp Thư Điện Tử (Email)
                    </div>
                    <p className="text-sm font-black text-slate-900">support@vietshop.vn</p>
                    <p className="text-slate-500 text-[11px]">Phản hồi yêu cầu trong vòng 2 - 4 giờ làm việc</p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 sm:col-span-2">
                    <div className="font-black text-slate-900 flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-red-500" /> Trụ Sở & Hệ Thống Kho Hàng Tổng
                    </div>
                    <p className="text-slate-600">
                      - Trụ sở chính: Tầng 18, Tòa nhà Landmark 81, TP. Hồ Chí Minh.<br/>
                      - Chi nhánh Hà Nội: Tầng 12, Tòa Keangnam Hanoi Landmark Tower, Cầu Giấy, Hà Nội.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Modal Footer actions */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-end text-xs shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer"
          >
            Đóng Cửa Sổ
          </button>
        </div>
      </div>
    </div>
  );
};
