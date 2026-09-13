import React, { useState } from 'react';
import { 
  Sparkles, Tag, Percent, Gift, Plus, 
  Trash2, Check, Clock, AlertCircle, ShoppingBag, 
  TrendingUp, Calendar, Zap 
} from 'lucide-react';
import { MarketingCampaign, Product } from '../types';
import { formatVND } from '../utils/formatters';
import { playSuccessChime } from '../utils/audio';

interface SellerMarketingViewProps {
  campaigns: MarketingCampaign[];
  products: Product[];
  onAddCampaign: (campaign: MarketingCampaign) => void;
  onToggleCampaign: (campaignId: string) => void;
  onDeleteCampaign: (campaignId: string) => void;
}

export const SellerMarketingView: React.FC<SellerMarketingViewProps> = ({
  campaigns,
  products,
  onAddCampaign,
  onToggleCampaign,
  onDeleteCampaign
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [campaignType, setCampaignType] = useState<'combo' | 'shock_deal' | 'flash_sale'>('combo');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minQuantity, setMinQuantity] = useState<number>(2);
  const [validUntil, setValidUntil] = useState('2026-09-30');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCamp: MarketingCampaign = {
      id: 'mkt-' + Date.now().toString(36),
      name,
      type: campaignType,
      description,
      discountValue,
      minQuantity: campaignType === 'combo' ? minQuantity : undefined,
      validUntil,
      isActive: true
    };

    onAddCampaign(newCamp);
    playSuccessChime();
    setShowCreateModal(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-pink-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kênh Marketing & Tăng Trưởng Doanh Số</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Combo Khuyến Mãi & Deal Sốc Mua Kèm
          </h2>
          <p className="text-xs text-rose-200/80 max-w-xl">
            Kích thích người mua đặt nhiều sản phẩm cùng lúc, tăng giá trị đơn hàng trung bình (AOV) và tỷ lệ chuyển đổi.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#ee4d2d] to-pink-600 hover:from-[#d73211] hover:to-pink-700 text-white font-bold text-xs shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Chương Trình Mới</span>
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map(camp => (
          <div 
            key={camp.id}
            className={`p-5 rounded-3xl border transition-all ${
              camp.isActive 
                ? 'bg-white border-rose-200 shadow-sm' 
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  camp.type === 'combo' ? 'bg-pink-100 text-pink-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {camp.type === 'combo' ? <Tag className="w-5 h-5" /> : <Gift className="w-5 h-5" />}
                </div>
                <div>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    camp.type === 'combo' ? 'bg-pink-100 text-pink-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {camp.type === 'combo' ? 'Combo Tiết Kiệm' : 'Deal Sốc Mua Kèm'}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-0.5">{camp.name}</h3>
                </div>
              </div>

              {/* Active Switch */}
              <button
                onClick={() => onToggleCampaign(camp.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                  camp.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {camp.isActive ? 'Đang chạy' : 'Đã tạm dừng'}
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              {camp.description}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                <Clock className="w-3.5 h-3.5" />
                <span>Hết hạn: {camp.validUntil}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-black text-rose-600 text-sm">
                  Giảm {camp.discountValue}%
                </span>
                <button
                  onClick={() => onDeleteCampaign(camp.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
                  title="Xóa chương trình"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create Campaign */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-500" />
              <span>Thiết Lập Chương Trình Khuyến Mãi Mới</span>
            </h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Loại Chương Trình</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCampaignType('combo')}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      campaignType === 'combo'
                        ? 'border-pink-500 bg-pink-50/70 font-bold text-pink-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="font-bold">🏷️ Combo Mua Nhiều</div>
                    <div className="text-[10px] text-slate-500">Mua từ 2 món giảm thêm %</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCampaignType('shock_deal')}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      campaignType === 'shock_deal'
                        ? 'border-amber-500 bg-amber-50/70 font-bold text-amber-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="font-bold">🎁 Deal Sốc Mua Kèm</div>
                    <div className="text-[10px] text-slate-500">Mua kèm quà tặng/deal 0đ</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tên Chương Trình *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Mua 2 giảm 10% - Mua 3 giảm 15%"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-rose-500 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mô Tả Áp Dụng</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Áp dụng cho tất cả sản phẩm thời trang và phụ kiện trong shop"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-rose-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mức Giảm (%)</label>
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-rose-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Thời Hạn Áp Dụng</label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-rose-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#ee4d2d] hover:bg-[#d73211] text-white font-bold shadow-md shadow-orange-500/30 cursor-pointer"
                >
                  Kích Hoạt Chương Trình
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
