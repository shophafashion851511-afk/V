import React, { useState } from 'react';
import { Order, OrderStatus, CustomerUser, CartItem } from '../types';
import { formatVND, getStatusBadgeInfo } from '../utils/formatters';
import { formatWeight, formatDimensions } from '../utils/shipping';
import { 
  X, Package, Truck, Clock, CheckCircle2, AlertCircle, 
  MapPin, Phone, CreditCard, RotateCcw, Search, ChevronRight, 
  User, ExternalLink, ShieldCheck, ShoppingBag, ArrowRight,
  Mail, Smartphone, MessageSquare
} from 'lucide-react';

interface CustomerOrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  currentCustomer: CustomerUser | null;
  initialSelectedOrderId?: string | null;
  onOpenLoginModal?: () => void;
  onReorder?: (items: CartItem[]) => void;
  onCancelOrder?: (orderId: string) => void;
  onOpenCustomerSupport?: () => void;
}

export const CustomerOrderTrackingModal: React.FC<CustomerOrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
  currentCustomer,
  initialSelectedOrderId,
  onOpenLoginModal,
  onReorder,
  onCancelOrder,
  onOpenCustomerSupport
}) => {
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(initialSelectedOrderId || null);
  const [cancelModalOrderId, setCancelModalOrderId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter orders related to customer or show all if search is applied
  const customerOrders = orders.filter(order => {
    // If search is typed, search across all orders by code or phone
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        order.orderCode.toLowerCase().includes(q) ||
        order.customerInfo.phone.includes(q) ||
        order.customerInfo.name.toLowerCase().includes(q) ||
        order.items.some(i => i.product.name.toLowerCase().includes(q))
      );
    }

    // Match by logged in user if available
    if (currentCustomer) {
      if (currentCustomer.email && order.customerInfo.phone === currentCustomer.phone) return true;
      if (order.userEmail && currentCustomer.email && order.userEmail === currentCustomer.email) return true;
      if (order.userPhone && currentCustomer.phone && order.userPhone === currentCustomer.phone) return true;
      if (order.userId && order.userId === currentCustomer.id) return true;
    }

    return true; // Show stored orders so user always sees their orders in preview
  });

  const filteredOrders = customerOrders.filter(o => {
    if (selectedStatusTab === 'all') return true;
    if (selectedStatusTab === 'pending') return o.status === 'pending';
    if (selectedStatusTab === 'processing') return o.status === 'processing';
    if (selectedStatusTab === 'shipping') return o.status === 'shipping';
    if (selectedStatusTab === 'delivered') return o.status === 'delivered';
    if (selectedStatusTab === 'cancelled') return o.status === 'cancelled' || o.status === 'refunded';
    return true;
  });

  const activeOrder = selectedOrderId 
    ? orders.find(o => o.id === selectedOrderId || o.orderCode === selectedOrderId) || filteredOrders[0]
    : filteredOrders[0] || orders[0];

  const getTimelineSteps = (order: Order) => {
    const isPending = order.status === 'pending';
    const isProcessing = order.status === 'processing';
    const isShipping = order.status === 'shipping';
    const isDelivered = order.status === 'delivered';
    const isCancelled = order.status === 'cancelled' || order.status === 'refunded';

    const carrierName = order.carrierName || 'SPX Express (Shopee/VietShop)';
    const trackingNo = order.trackingNumber || `SPX${order.orderCode.replace(/[^0-9]/g, '').slice(-8)}VN`;

    return [
      {
        title: 'Đơn Hàng Đã Đặt Thành Công',
        desc: `Đơn hàng #${order.orderCode} đã được ghi nhận trên hệ thống VIETSHOP`,
        time: order.createdAt,
        completed: true,
        current: isPending
      },
      {
        title: 'Người Bán Xác Nhận & Đóng Gói',
        desc: isPending 
          ? 'Cửa hàng đang chuẩn bị sản phẩm, kiểm tra chất lượng và niêm phong kiện hàng'
          : 'Đã hoàn tất đóng gói, dán tem vận đơn và bàn giao cho bưu tá',
        time: isPending ? 'Đang chuẩn bị...' : order.createdAt,
        completed: !isPending && !isCancelled,
        current: isProcessing
      },
      {
        title: `Đã Bàn Giao Cho Đơn Vị Vận Chuyển (${carrierName})`,
        desc: isShipping || isDelivered
          ? `Kiện hàng đang trung chuyển qua Trung tâm khai thác. Mã vận đơn: ${trackingNo}`
          : 'Chờ đối tác vận chuyển đến kho lấy hàng',
        time: (isShipping || isDelivered) ? 'Đang trên lộ trình' : 'Dự kiến hôm nay',
        completed: isShipping || isDelivered,
        current: isShipping
      },
      {
        title: 'Đang Giao Hàng Đến Bạn',
        desc: isShipping
          ? 'Bưu tá đang trên đường phát hàng đến địa chỉ nhận. Vui lòng giữ máy liên lạc.'
          : isDelivered 
          ? 'Bưu tá đã liên hệ và phát hàng thành công.'
          : 'Dự kiến giao hàng trong 1-2 ngày tới.',
        time: isDelivered ? 'Đã nhận' : 'Dự kiến trong ngày',
        completed: isDelivered,
        current: isShipping
      },
      {
        title: 'Giao Hàng Thành Công & Hoàn Tất',
        desc: isDelivered 
          ? 'Khách hàng đã nhận hàng và thanh toán. Bảo đảm đổi trả trong 15 ngày.'
          : 'Hoàn tất đơn hàng và tích lũy điểm thưởng',
        time: isDelivered ? 'Hoàn tất' : 'Chưa giao',
        completed: isDelivered,
        current: isDelivered
      }
    ];
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-5xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 relative my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ee4d2d] to-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Đơn Mua & Tiến Trình Giao Hàng
                </h2>
                <span className="text-[10px] bg-orange-100 text-[#ee4d2d] font-bold px-2 py-0.5 rounded-full">
                  {customerOrders.length} Đơn mua
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Theo dõi trạng thái vận chuyển theo thời gian thực và quản lý đơn mua
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer Account Info Banner */}
        <div className="mt-3 p-3 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50/50 rounded-2xl border border-orange-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs shrink-0">
          {currentCustomer ? (
            <div className="flex items-center gap-2.5">
              <img 
                src={currentCustomer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'} 
                alt={currentCustomer.name} 
                className="w-8 h-8 rounded-full border border-orange-300 object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{currentCustomer.name}</span>
                  <span className="px-1.5 py-0.2 bg-white text-[#ee4d2d] border border-orange-200 rounded text-[10px] font-extrabold uppercase">
                    {currentCustomer.provider === 'google' ? 'Google (Gmail)' : currentCustomer.provider === 'phone' ? 'Số ĐT' : 'Facebook'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {currentCustomer.email || currentCustomer.phone} • Đã đồng bộ tiến trình đơn hàng
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-700">
              <AlertCircle className="w-4 h-4 text-[#ee4d2d] shrink-0" />
              <span>
                Bạn đang xem đơn hàng với tư cách khách. <strong>Đăng nhập</strong> bằng Gmail, SĐT hoặc Facebook để lưu trữ và quản lý lâu dài.
              </span>
            </div>
          )}

          {!currentCustomer && onOpenLoginModal && (
            <button
              onClick={() => {
                onClose();
                onOpenLoginModal();
              }}
              className="px-3.5 py-1.5 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer text-xs"
            >
              <User className="w-3.5 h-3.5" />
              <span>Đăng Nhập Ngay</span>
            </button>
          )}
        </div>

        {/* Search Bar & Status Tabs */}
        <div className="mt-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 shrink-0">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs font-semibold custom-scrollbar">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'pending', label: 'Chờ xác nhận' },
              { id: 'processing', label: 'Đang chuẩn bị' },
              { id: 'shipping', label: 'Đang giao' },
              { id: 'delivered', label: 'Đã giao' },
              { id: 'cancelled', label: 'Đã hủy' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatusTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
                  selectedStatusTab === tab.id
                    ? 'bg-[#ee4d2d] text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[220px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm mã đơn, SĐT nhận hàng..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#ee4d2d]"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Main Content Area: Left Order List, Right Order Details */}
        <div className="mt-4 flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left: Orders List (5 cols) */}
          <div className="lg:col-span-5 overflow-y-auto space-y-2.5 pr-1 max-h-[58vh] custom-scrollbar">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                <Package className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700">Chưa tìm thấy đơn hàng nào</p>
                <p className="text-[11px] text-slate-400">Hãy đặt mua sản phẩm để theo dõi lộ trình vận chuyển tại đây</p>
              </div>
            ) : (
              filteredOrders.map(order => {
                const badge = getStatusBadgeInfo(order.status);
                const isSelected = (activeOrder && activeOrder.id === order.id);
                const firstItem = order.items[0];

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'border-[#ee4d2d] bg-orange-50/40 shadow-sm ring-1 ring-[#ee4d2d]/30'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-900">#{order.orderCode}</span>
                        <span className="text-[10px] text-slate-400">{order.createdAt}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                    </div>

                    {/* Product preview */}
                    {firstItem && (
                      <div className="flex items-center gap-2.5 text-xs">
                        <img 
                          src={firstItem.product.image} 
                          alt={firstItem.product.name} 
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-800 truncate text-[11px]">
                            {firstItem.product.name}
                          </h4>
                          <p className="text-[10px] text-slate-500">
                            {order.items.length > 1 
                              ? `và ${order.items.length - 1} sản phẩm khác` 
                              : `Số lượng: x${firstItem.quantity}`}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-[#ee4d2d]">
                              {formatVND(order.total)}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              • {order.paymentMethod === 'cod' ? 'COD' : order.paymentMethod.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 shrink-0 transition ${isSelected ? 'text-[#ee4d2d] translate-x-1' : 'text-slate-300'}`} />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Right: Detailed Progress & Specifications of Selected Order (7 cols) */}
          <div className="lg:col-span-7 overflow-y-auto space-y-4 pl-1 max-h-[58vh] custom-scrollbar bg-slate-50/60 p-4 rounded-3xl border border-slate-200">
            {activeOrder ? (
              <>
                {/* Order Summary & Tracking code banner */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Mã đơn hàng:</span>
                        <strong className="text-sm text-slate-900 font-mono">#{activeOrder.orderCode}</strong>
                      </div>
                      <p className="text-[11px] text-slate-400">Thời gian đặt hàng: {activeOrder.createdAt}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-500 block">Tổng thanh toán</span>
                      <span className="text-base font-black text-[#ee4d2d]">{formatVND(activeOrder.total)}</span>
                    </div>
                  </div>

                  {/* Shipping Carrier Info Card */}
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50/60 border border-blue-200/80 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-blue-900">
                        <Truck className="w-4 h-4 text-blue-600" />
                        <span>Đơn Vị Vận Chuyển: {activeOrder.carrierName || 'SPX Express (Shopee/VietShop)'}</span>
                      </div>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-black px-2 py-0.5 rounded-md">
                        {activeOrder.shippingMethod === 'instant' ? 'HỎA TỐC 2H' : 'TIÊU CHUẨN'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 pt-1">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Mã Vận Đơn:</span>
                        <strong className="font-mono text-slate-800">
                          {activeOrder.trackingNumber || `SPX${activeOrder.orderCode.replace(/[^0-9]/g, '').slice(-8)}VN`}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Trọng Lượng Kiện:</span>
                        <span className="font-semibold text-slate-800">
                          {formatWeight(activeOrder.totalWeight || 350)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Kích Thước Gói:</span>
                        <span className="font-semibold text-slate-800">
                          {formatDimensions(activeOrder.dimensions)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracking Stepper / Timeline (Tiến trình vận đơn) */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                  <h3 className="font-black text-xs text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#ee4d2d]" />
                    <span>Lộ Trình & Tiến Trình Đơn Hàng</span>
                  </h3>

                  <div className="relative pl-6 space-y-4 pt-1">
                    {/* Vertical line connecting steps */}
                    <div className="absolute left-2.5 top-2 bottom-3 w-0.5 bg-slate-200" />

                    {getTimelineSteps(activeOrder).map((step, idx) => (
                      <div key={idx} className="relative flex items-start gap-3 text-xs">
                        {/* Dot */}
                        <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                          step.completed
                            ? 'bg-emerald-500 border-emerald-200 text-white ring-2 ring-emerald-100'
                            : step.current
                            ? 'bg-[#ee4d2d] border-orange-200 text-white animate-pulse'
                            : 'bg-white border-slate-300 text-slate-400'
                        }`}>
                          {step.completed ? '✓' : idx + 1}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`font-bold ${step.completed ? 'text-slate-900' : 'text-slate-600'}`}>
                              {step.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">{step.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recipient Information & Address */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs space-y-2 shadow-xs">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5 pb-1 border-b border-slate-100">
                    <MapPin className="w-3.5 h-3.5 text-[#ee4d2d]" />
                    <span>Địa Chỉ & Thông Tin Nhận Hàng</span>
                  </h4>
                  <div className="space-y-1 text-slate-600 text-[11px]">
                    <p><strong className="text-slate-800">{activeOrder.customerInfo.name}</strong> • {activeOrder.customerInfo.phone}</p>
                    <p className="text-slate-700">{activeOrder.customerInfo.address}, {activeOrder.customerInfo.city}</p>
                    {activeOrder.customerInfo.note && (
                      <p className="text-slate-400 italic">Ghi chú: "{activeOrder.customerInfo.note}"</p>
                    )}
                  </div>
                </div>

                {/* Items in this order */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2.5 shadow-xs text-xs">
                  <h4 className="font-bold text-slate-900 flex items-center justify-between pb-1 border-b border-slate-100">
                    <span>Sản phẩm trong đơn ({activeOrder.items.length})</span>
                    <span className="text-[11px] text-slate-400">Phí ship: {formatVND(activeOrder.shippingFee)}</span>
                  </h4>

                  <div className="space-y-2">
                    {activeOrder.items.map((item, iIdx) => (
                      <div key={iIdx} className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 text-xs truncate">{item.product.name}</p>
                          <div className="text-[10px] text-slate-500 flex flex-wrap gap-2 mt-0.5">
                            {Object.entries(item.selectedVariations || {}).map(([k, v]) => (
                              <span key={k} className="bg-white px-1.5 py-0.2 rounded border border-slate-200">
                                {k}: {v}
                              </span>
                            ))}
                            <span>SL: x{item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-bold text-slate-900 shrink-0">
                          {formatVND(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Financial calculation breakdown */}
                  <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
                    <div className="flex justify-between">
                      <span>Tổng tiền hàng:</span>
                      <span>{formatVND(activeOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phí vận chuyển (Do bên vận chuyển quy định):</span>
                      <span>+{formatVND(activeOrder.shippingFee)}</span>
                    </div>
                    {activeOrder.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>Giảm giá voucher:</span>
                        <span>-{formatVND(activeOrder.discountAmount)}</span>
                      </div>
                    )}
                    {activeOrder.coinsUsed > 0 && (
                      <div className="flex justify-between text-amber-600 font-medium">
                        <span>VIETSHOP Xu đã dùng:</span>
                        <span>-{formatVND(activeOrder.coinsUsed)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-black text-sm text-[#ee4d2d] pt-1 border-t border-slate-200">
                      <span>Thực thanh toán:</span>
                      <span>{formatVND(activeOrder.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <div className="flex items-center gap-2">
                    {onReorder && (
                      <button
                        onClick={() => {
                          onReorder(activeOrder.items);
                          onClose();
                        }}
                        className="px-3.5 py-2 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Mua Lại Đơn Này</span>
                      </button>
                    )}

                    {onOpenCustomerSupport && (
                      <button
                        onClick={onOpenCustomerSupport}
                        className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                        <span>Liên Hệ Hỗ Trợ</span>
                      </button>
                    )}
                  </div>

                  {activeOrder.status === 'pending' && onCancelOrder && (
                    <button
                      onClick={() => {
                        if (confirm(`Bạn có chắc muốn hủy đơn hàng #${activeOrder.orderCode}?`)) {
                          onCancelOrder(activeOrder.id);
                        }
                      }}
                      className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl border border-red-200 transition cursor-pointer"
                    >
                      Hủy Đơn Hàng
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-slate-400">
                Chọn một đơn hàng bên trái để xem chi tiết tiến trình
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
