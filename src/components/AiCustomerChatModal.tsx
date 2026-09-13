import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, X, Sparkles, ShoppingBag, ArrowRight, 
  RotateCcw, ShieldCheck, Truck, CheckCircle2, Ticket, 
  ExternalLink, Plus, MessageSquare, Flame, Trash2,
  Zap, Compass, Tag, HelpCircle, Check
} from 'lucide-react';
import { Product, Voucher, ShopSettings } from '../types';
import { formatVND } from '../utils/formatters';

interface AiChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  recommendedProductIds?: string[];
  recommendedVoucherCodes?: string[];
  isStreaming?: boolean;
}

interface AiCustomerChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  vouchers: Voucher[];
  shopSettings: ShopSettings;
  onOpenProduct: (productId: string) => void;
  onAddToCart: (product: Product, variations: Record<string, string>, quantity: number) => void;
  onToggleSaveVoucher: (voucherId: string) => void;
}

const QUICK_CATEGORIES = [
  { label: '🔥 Bán chạy nhất', prompt: 'Gợi ý cho tôi các sản phẩm bán chạy nhất hôm nay' },
  { label: '🚚 Mã Freeship 0Đ', prompt: 'Lấy mã freeship miễn phí vận chuyển 0đ' },
  { label: '🎁 Voucher 50K - 100K', prompt: 'Có những mã giảm giá voucher nào đang áp dụng?' },
  { label: '👕 Thời trang nam nữ', prompt: 'Tìm áo quần và phụ kiện thời trang đẹp' },
  { label: '🎧 Đồ công nghệ hot', prompt: 'Gợi ý tai nghe bluetooth và thiết bị điện tử' },
  { label: '💰 Hàng rẻ dưới 200k', prompt: 'Tìm sản phẩm giá rẻ dưới 200k' },
  { label: '🔄 Chính sách đổi trả', prompt: 'Chính sách bảo hành và đổi trả 15 ngày thế nào?' }
];

export const AiCustomerChatModal: React.FC<AiCustomerChatModalProps> = ({
  isOpen,
  onClose,
  products,
  vouchers,
  shopSettings,
  onOpenProduct,
  onAddToCart,
  onToggleSaveVoucher
}) => {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Dạ chào bạn! Em là **Trợ Lý AI Siêu Tốc của VIETSHOP** ⚡🤖.\n\nEm đã được nâng cấp thuật toán thông minh để **tìm kiếm sản phẩm & trả lời câu hỏi tức thì trong 0.1s**. Bạn muốn tìm kiếm món đồ nào, nhận mã Freeship 0Đ hay cần tư vấn gì cứ nhắn em nhé!`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiMode, setAiMode] = useState<'instant' | 'deep'>('instant');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  // Ultra-fast Local Intelligence Engine (Phản hồi tức thì < 0.1s)
  const processInstantLocalAI = (query: string): { replyText: string; recProductIds: string[]; recVoucherCodes: string[] } => {
    const lower = query.toLowerCase().trim();
    let recProductIds: string[] = [];
    let recVoucherCodes: string[] = [];
    let replyText = "";

    // 1. Check for Freeship
    if (lower.includes('freeship') || lower.includes('ship') || lower.includes('vận chuyển') || lower.includes('giao hàng')) {
      recVoucherCodes = ['FREESHIP30K', 'FREESHIP0D'];
      replyText = `🚚 **Chính Sách Vận Chuyển VIETSHOP:**\n- Hỗ trợ **Miễn Phí Vận Chuyển Toàn Quốc 0Đ** [VOUCHER:FREESHIP30K] cho mọi đơn hàng.\n- Giao nhanh hỏa tốc **1-2 giờ** trong nội thành và **1-3 ngày** toàn quốc qua đơn vị vận chuyển VIETSHOP Xpress, GHTK, GHN.\n- Bạn có thể bấm nút **"Lưu Mã"** bên dưới để được áp dụng giảm ngay phí vận chuyển lúc thanh toán nhé!`;
      return { replyText, recProductIds, recVoucherCodes };
    }

    // 2. Check for Vouchers / Discounts
    if (lower.includes('voucher') || lower.includes('mã giảm') || lower.includes('khuyến mãi') || lower.includes('mã') || lower.includes('giảm giá')) {
      recVoucherCodes = vouchers.slice(0, 3).map(v => v.code);
      replyText = `🎁 **Kho Voucher Khuyến Mãi Đang Hoạt Động:**\n` + 
        vouchers.map(v => `• **${v.code}**: ${v.title} (${v.description})`).join('\n') + 
        `\n\n👉 Em đã ghim các mã giảm giá ngay bên dưới, bạn hãy bấm **"Lưu Mã"** để hệ thống tự động trừ tiền lúc thanh toán nhé!`;
      return { replyText, recProductIds, recVoucherCodes };
    }

    // 3. Check for Warranty & Return Policy
    if (lower.includes('đổi trả') || lower.includes('bảo hành') || lower.includes('hoàn tiền') || lower.includes('uy tín') || lower.includes('chính hãng')) {
      replyText = `🛡️ **Cam Kết & Chính Sách Đổi Trả VIETSHOP:**\n- **100% Sản phẩm chuẩn chất lượng**, được kiểm duyệt nghiêm ngặt trước khi gửi.\n- **Đổi trả miễn phí trong 15 ngày** tận nhà nếu sản phẩm bị lỗi do nhà sản xuất hoặc bạn không ưng ý.\n- **Bảo hành 12 - 24 tháng** chính hãng 1 đổi 1 tận nơi.\n- Shipper sẽ đến tận địa chỉ của bạn để nhận lại hàng hoàn mà không phát sinh bất kỳ chi phí nào!`;
      return { replyText, recProductIds, recVoucherCodes };
    }

    // 4. Check for Price range (< 200k, > 500k...)
    if (lower.includes('dưới 200') || lower.includes('dưới 200k') || lower.includes('rẻ') || lower.includes('giá rẻ') || lower.includes('học sinh') || lower.includes('sinh viên')) {
      const cheapProds = products.filter(p => p.price <= 250000).sort((a, b) => a.price - b.price).slice(0, 4);
      if (cheapProds.length > 0) {
        recProductIds = cheapProds.map(p => p.id);
        replyText = `💰 **Gợi Ý Sản Phẩm Giá Tốt Nhất (Dưới 250.000₫):**\n` +
          cheapProds.map(p => `• [PRODUCT:${p.id}] **${p.name}** - Giá chỉ: **${p.price.toLocaleString('vi-VN')}₫** (-${p.discountPercent}%)`).join('\n') +
          `\n\nĐây là những sản phẩm có mức giá cực hời, chất lượng tốt và được rất nhiều khách hàng lựa chọn tại VIETSHOP.`;
        return { replyText, recProductIds, recVoucherCodes };
      }
    }

    // 5. Check for Best Sellers / Flash Sale
    if (lower.includes('bán chạy') || lower.includes('hot') || lower.includes('top') || lower.includes('flash sale') || lower.includes('săn sale')) {
      const topProds = products.filter(p => p.isFlashSale || p.soldCount > 100).slice(0, 4);
      recProductIds = (topProds.length > 0 ? topProds : products.slice(0, 4)).map(p => p.id);
      replyText = `🔥 **Top Sản Phẩm Bán Chạy & Được Yêu Thích Nhất Hôm Nay:**\n` +
        products.filter(p => recProductIds.includes(p.id)).map(p => `• [PRODUCT:${p.id}] **${p.name}** - Đã bán: ${p.soldCountDisplay} | Giá: **${p.price.toLocaleString('vi-VN')}₫**`).join('\n') +
        `\n\nBạn có thể nhấn vào từng sản phẩm bên dưới để xem đánh giá chi tiết hoặc bấm "Mua" để thêm vào giỏ hàng ngay ạ!`;
      return { replyText, recProductIds, recVoucherCodes };
    }

    // 6. Direct Keyword Search (Fashion, Tech, Beauty, Home, Shoes, etc.)
    const searchWords = lower.replace(/[?,.!]/g, '').split(' ').filter(w => w.length >= 2);
    let matchedProducts = products.filter(p => {
      const pName = p.name.toLowerCase();
      const pCat = (p.categoryName || p.category || '').toLowerCase();
      const pDesc = (p.description || '').toLowerCase();
      const pTags = (p.tags || []).join(' ').toLowerCase();

      // Check direct inclusion
      if (pName.includes(lower) || pCat.includes(lower) || pTags.includes(lower)) return true;

      // Check specific domain words
      if ((lower.includes('áo') || lower.includes('quần') || lower.includes('thời trang') || lower.includes('váy')) && (pCat.includes('thời trang') || pCat.includes('fashion') || pName.includes('áo') || pName.includes('quần'))) return true;
      if ((lower.includes('tai nghe') || lower.includes('loa') || lower.includes('điện thoại') || lower.includes('công nghệ') || lower.includes('laptop')) && (pCat.includes('điện tử') || pCat.includes('tech') || pName.includes('tai nghe') || pName.includes('loa'))) return true;
      if ((lower.includes('giày') || lower.includes('dép') || lower.includes('sneaker')) && (pName.includes('giày') || pCat.includes('giày') || pCat.includes('thể thao'))) return true;
      if ((lower.includes('bình') || lower.includes('nồi') || lower.includes('gia dụng') || lower.includes('bếp')) && (pCat.includes('gia dụng') || pCat.includes('home') || pName.includes('bình') || pName.includes('nồi'))) return true;
      if ((lower.includes('mỹ phẩm') || lower.includes('son') || lower.includes('serum') || lower.includes('kem') || lower.includes('skincare')) && (pCat.includes('sắc đẹp') || pCat.includes('beauty') || pName.includes('son') || pName.includes('serum'))) return true;

      // Match multi-word overlap
      const matchScore = searchWords.filter(w => pName.includes(w) || pDesc.includes(w) || pCat.includes(w)).length;
      return matchScore >= 1;
    });

    if (matchedProducts.length > 0) {
      const topMatches = matchedProducts.slice(0, 4);
      recProductIds = topMatches.map(p => p.id);
      replyText = `Dạ chào bạn! VIETSHOP đã tìm thấy **${topMatches.length} sản phẩm chính hãng** rất phù hợp với nhu cầu "${query}" của bạn:\n` +
        topMatches.map(p => `• [PRODUCT:${p.id}] **${p.name}** - Giá: **${p.price.toLocaleString('vi-VN')}₫** (-${p.discountPercent}%)`).join('\n') +
        `\n\n👉 Bạn hãy bấm vào thẻ sản phẩm bên dưới để xem hình ảnh và thông số kỹ thuật chi tiết nhé!`;
      return { replyText, recProductIds, recVoucherCodes };
    }

    // 7. Fallback General Friendly Guidance
    const suggestedProds = products.slice(0, 3);
    recProductIds = suggestedProds.map(p => p.id);
    recVoucherCodes = ['FREESHIP30K'];
    replyText = `Dạ chào bạn! Em đã ghi nhận yêu cầu: "${query}".\n\nHiện tại siêu thị trực tuyến **VIETSHOP** đang có rất nhiều mặt hàng Thời Trang, Đồ Công Nghệ, Thiết Bị Gia Dụng và Mỹ Phẩm với ưu đãi **Giảm đến 50% & Freeship 0Đ**.\n\nDưới đây là các sản phẩm nổi bật đang được quan tâm nhiều nhất hôm nay, bạn xem thử nhé:`;
    return { replyText, recProductIds, recVoucherCodes };
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText.trim();
    if (!textToSend || isLoading) return;

    const userMessage: AiChatMessage = {
      id: 'msg-user-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!customPrompt) setInputText('');

    // If Instant Mode (Default): Respond in ~0.05s - 0.1s without cloud network latency
    if (aiMode === 'instant') {
      setIsLoading(true);
      
      setTimeout(() => {
        const { replyText, recProductIds, recVoucherCodes } = processInstantLocalAI(textToSend);
        
        const aiMessage: AiChatMessage = {
          id: 'msg-ai-' + Date.now(),
          sender: 'ai',
          text: replyText,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          recommendedProductIds: recProductIds,
          recommendedVoucherCodes: recVoucherCodes
        };

        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      }, 80); // Ultra-fast 80ms delay for natural snappy feel
      return;
    }

    // Deep Mode: Call Server Gemini API with fast fallback
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout max

      const response = await fetch('/api/ai/customer-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: textToSend,
          products,
          vouchers,
          shopSettings
        })
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Lỗi phản hồi');
      }

      const data = await response.json();
      const replyText = data.reply || 'Cảm ơn bạn! VIETSHOP luôn sẵn sàng hỗ trợ bạn bất cứ lúc nào.';
      
      const productMatches = Array.from(replyText.matchAll(/\[PRODUCT:([a-zA-Z0-9_-]+)\]/g)).map((m: any) => m[1]);
      const voucherMatches = Array.from(replyText.matchAll(/\[VOUCHER:([a-zA-Z0-9_-]+)\]/g)).map((m: any) => m[1]);

      const aiMessage: AiChatMessage = {
        id: 'msg-ai-' + Date.now(),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        recommendedProductIds: productMatches.length > 0 ? productMatches : data.recommendedProducts?.map((p: any) => p.id),
        recommendedVoucherCodes: voucherMatches
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch {
      // Fallback seamlessly to instant local AI if server times out or is slow
      const { replyText, recProductIds, recVoucherCodes } = processInstantLocalAI(textToSend);
      
      const aiMessage: AiChatMessage = {
        id: 'msg-ai-' + Date.now(),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        recommendedProductIds: recProductIds,
        recommendedVoucherCodes: recVoucherCodes
      };

      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'msg-welcome-new',
        sender: 'ai',
        text: `Chào bạn! Cuộc trò chuyện đã được làm mới. Hãy nhập từ khóa hoặc bấm các danh mục gợi ý bên dưới để em tư vấn siêu tốc trong 0.1s nhé! 🛍️⚡`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Helper to format text with Markdown bold and clean markers
  const renderMessageContent = (text: string) => {
    const cleanedText = text
      .replace(/\[PRODUCT:[a-zA-Z0-9_-]+\]/g, '')
      .replace(/\[VOUCHER:[a-zA-Z0-9_-]+\]/g, '')
      .trim();

    const paragraphs = cleanedText.split('\n');
    return paragraphs.map((para, idx) => {
      if (!para.trim()) return <div key={idx} className="h-1" />;
      
      const parts = para.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={idx} className="leading-relaxed">
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="font-extrabold text-slate-900">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full h-[88vh] max-h-[720px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#ee4d2d] via-orange-500 to-[#ff5722] text-white px-4 sm:px-5 py-3.5 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-white text-[#ee4d2d] flex items-center justify-center font-black shadow-md">
                <Bot className="w-6 h-6" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight">Trợ Lý AI VIETSHOP</h3>
                <span className="bg-yellow-300 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs">
                  <Zap className="w-3 h-3 fill-slate-900" />
                  <span>SIÊU TỐC 0.1S</span>
                </span>
              </div>
              <p className="text-[11px] text-white/90">Tìm kiếm sản phẩm • Mã giảm giá • Chính sách giao hàng</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* AI Speed Mode Toggle */}
            <button
              onClick={() => setAiMode(prev => prev === 'instant' ? 'deep' : 'instant')}
              title={aiMode === 'instant' ? 'Đang ở chế độ Siêu Tốc (0.1s). Bấm để chuyển AI Gemini' : 'Đang ở chế độ AI Gemini. Bấm để chuyển Siêu Tốc'}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                aiMode === 'instant'
                  ? 'bg-white text-[#ee4d2d] border-white shadow-xs'
                  : 'bg-white/20 text-white border-white/30'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>{aiMode === 'instant' ? 'Siêu Tốc' : 'Gemini AI'}</span>
            </button>

            <button
              onClick={handleClearHistory}
              title="Làm mới cuộc trò chuyện"
              className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer text-xs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Đóng chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Container */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-slate-50/50">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            const recProducts = msg.recommendedProductIds 
              ? products.filter(p => msg.recommendedProductIds?.includes(p.id))
              : [];
            
            const recVouchers = msg.recommendedVoucherCodes
              ? vouchers.filter(v => msg.recommendedVoucherCodes?.includes(v.code))
              : [];

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isAi ? 'justify-start' : 'justify-end'} animate-in fade-in duration-150`}
              >
                {isAi && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-[#ee4d2d] text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[88%] sm:max-w-[80%] space-y-2.5`}>
                  {/* Bubble */}
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      isAi
                        ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                        : 'bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] text-white font-medium rounded-tr-sm'
                    }`}
                  >
                    {renderMessageContent(msg.text)}
                    <span className={`block text-[9px] mt-1.5 ${isAi ? 'text-slate-400' : 'text-white/70'}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Interactive Vouchers Badges */}
                  {recVouchers.length > 0 && (
                    <div className="space-y-1.5">
                      {recVouchers.map(vc => (
                        <div 
                          key={vc.id}
                          className="bg-amber-50 border border-amber-300 rounded-2xl p-2.5 flex items-center justify-between text-xs shadow-xs"
                        >
                          <div className="flex items-center gap-2">
                            <Ticket className="w-4 h-4 text-[#ee4d2d]" />
                            <div>
                              <span className="font-bold text-slate-900">{vc.code} - {vc.title}</span>
                              <p className="text-[10px] text-slate-500">{vc.description}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => onToggleSaveVoucher(vc.id)}
                            className={`px-3 py-1 rounded-xl font-bold text-[11px] cursor-pointer transition-colors shrink-0 ${
                              vc.isSaved
                                ? 'bg-emerald-600 text-white'
                                : 'bg-[#ee4d2d] text-white hover:bg-[#d73211]'
                            }`}
                          >
                            {vc.isSaved ? 'Đã Lưu ✓' : 'Lưu Mã'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Interactive Recommended Product Mini-Cards */}
                  {recProducts.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <p className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#ee4d2d]" />
                        Sản phẩm phù hợp gợi ý riêng cho bạn:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {recProducts.map((prod) => (
                          <div
                            key={prod.id}
                            className="bg-white rounded-2xl border border-slate-200 p-2.5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-2"
                          >
                            <div className="flex gap-2.5">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-14 h-14 rounded-xl object-cover border border-slate-100 shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-slate-900 text-xs line-clamp-2 leading-tight">
                                  {prod.name}
                                </h4>
                                <div className="flex items-baseline gap-1.5 mt-1">
                                  <span className="font-black text-xs text-[#ee4d2d]">
                                    {formatVND(prod.price)}
                                  </span>
                                  {prod.discountPercent > 0 && (
                                    <span className="text-[9px] bg-red-100 text-red-700 px-1 rounded font-bold">
                                      -{prod.discountPercent}%
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-1.5 pt-1 border-t border-slate-100 text-xs">
                              <button
                                onClick={() => {
                                  onOpenProduct(prod.id);
                                  onClose();
                                }}
                                className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer text-[11px]"
                              >
                                <span>Xem Chi Tiết</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => {
                                  const defaultVars: Record<string, string> = {};
                                  if (prod.variations) {
                                    prod.variations.forEach(v => {
                                      if (v.options.length > 0) defaultVars[v.name] = v.options[0].label;
                                    });
                                  }
                                  onAddToCart(prod, defaultVars, 1);
                                }}
                                className="px-3 py-1.5 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer text-[11px]"
                                title="Thêm vào giỏ hàng"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Mua</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-slate-500 text-xs animate-in fade-in">
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 animate-bounce" />
              </div>
              <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl rounded-tl-sm shadow-xs flex items-center gap-2">
                <span className="w-2 h-2 bg-[#ee4d2d] rounded-full animate-ping"></span>
                <span className="text-[11px] text-slate-700 font-bold">AI VIETSHOP đang xử lý tức thì...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-slate-100/90 border-t border-slate-200 overflow-x-auto flex gap-1.5 shrink-0 custom-scrollbar">
          {QUICK_CATEGORIES.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.prompt)}
              className="px-3 py-1 bg-white hover:bg-orange-50 text-slate-700 hover:text-[#ee4d2d] border border-slate-200 hover:border-orange-300 rounded-full text-[11px] font-semibold whitespace-nowrap shadow-xs cursor-pointer transition-all shrink-0 flex items-center gap-1"
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập câu hỏi (VD: áo thun, tai nghe, voucher, freeship, giá dưới 200k)..."
              className="flex-1 px-4 py-2.5 bg-slate-100 focus:bg-white border border-slate-200 focus:border-[#ee4d2d] rounded-2xl text-xs text-slate-800 focus:outline-none transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-4 sm:px-5 py-2.5 bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] hover:from-[#d73211] hover:to-[#e64a19] disabled:opacity-50 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer transition-all shrink-0"
            >
              <span>Gửi</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
