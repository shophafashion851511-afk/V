import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { 
  X, Send, MessageSquare, CheckCheck, Smile, Paperclip, 
  Store, ShieldCheck, Sparkles, Phone, Clock
} from 'lucide-react';
import { playSuccessChime } from '../utils/audio';

interface ShopChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'shop';
  text: string;
  time: string;
  isProductSnippet?: boolean;
}

const QUICK_QUESTIONS = [
  'Sản phẩm này còn hàng không shop?',
  'Tư vấn giúp mình kích cỡ / size chuẩn nhé',
  'Phí vận chuyển và thời gian giao hàng bao lâu?',
  'Sản phẩm có được đổi trả miễn phí không?',
  'Shop có mã giảm giá nào cho sản phẩm này không?'
];

export const ShopChatModal: React.FC<ShopChatModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat when modal opens
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      
      setMessages([
        {
          id: 'welcome-1',
          sender: 'shop',
          text: `Xin chào quý khách! Cảm ơn bạn đã ghé thăm ${product.shopInfo?.name || 'Gian hàng chính hãng'}. Đội ngũ tư vấn luôn sẵn sàng hỗ trợ bạn 24/7!`,
          time: timeStr
        },
        {
          id: 'welcome-2',
          sender: 'shop',
          text: `Bạn cần shop tư vấn thêm thông tin gì về sản phẩm "${product.name}" (giá ưu đãi ${product.price.toLocaleString('vi-VN')}₫) không ạ?`,
          time: timeStr
        }
      ]);
    }
  }, [isOpen, product]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const sendMessage = (text: string, isProductSnippet = false) => {
    if (!text.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: text.trim(),
      time: timeStr,
      isProductSnippet
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    playSuccessChime();

    // Shop auto reply simulation
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      let replyText = '';

      const lower = text.toLowerCase();
      if (lower.includes('còn hàng') || lower.includes('tồn kho')) {
        replyText = `Dạ sản phẩm "${product.name}" hiện đang có sẵn ${product.stock} chiếc trong kho bạn nhé. Shop đóng gói và bàn giao bưu tá trong vòng 2-4 giờ làm việc ạ!`;
      } else if (lower.includes('size') || lower.includes('kích cỡ') || lower.includes('kích thước')) {
        replyText = `Dạ shop có đầy đủ các size phù hợp! Bạn có thể nhắn cho shop chiều cao và cân nặng để tư vấn viên chọn size chuẩn form nhất cho bạn nha.`;
      } else if (lower.includes('phí ship') || lower.includes('vận chuyển') || lower.includes('giao hàng') || lower.includes('bao lâu')) {
        replyText = `Dạ đơn hàng áp dụng chính sách Freeship Xtra hỗ trợ giảm tới 70k phí vận chuyển! Giao nội thành từ 1-2 ngày, các tỉnh thành khác từ 2-3 ngày bạn nhé.`;
      } else if (lower.includes('đổi trả') || lower.includes('bảo hành')) {
        replyText = `Dạ shop hỗ trợ đổi trả miễn phí trong 15 ngày nếu có lỗi từ nhà sản xuất hoặc không vừa size, được kiểm tra hàng trước khi nhận ạ!`;
      } else if (lower.includes('mã giảm') || lower.includes('voucher') || lower.includes('giảm giá')) {
        replyText = `Dạ hiện shop đang có mã giảm 15.000₫ cho đơn từ 150k và mã 30.000₫ cho đơn từ 300k. Bạn có thể nhấn Lưu mã ngay trên trang sản phẩm để tự động giảm giá khi đặt hàng nhé!`;
      } else if (isProductSnippet) {
        replyText = `Dạ shop đã nhận thông tin sản phẩm "${product.name}". Bạn đang quan tâm đến màu sắc hay kích thước nào của sản phẩm này ạ?`;
      } else {
        replyText = `Dạ vâng, shop đã nhận câu hỏi của bạn. Đội ngũ nhân viên trực chat của shop sẽ tư vấn chi tiết cho bạn ngay bây giờ nhé ạ!`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: 'reply-' + Date.now(),
          sender: 'shop',
          text: replyText,
          time: replyTime
        }
      ]);
    }, 1000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 flex flex-col overflow-hidden max-h-[92vh] sm:h-[620px] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Shop Bar */}
        <div className="bg-gradient-to-r from-orange-600 via-[#ee4d2d] to-amber-600 p-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={product.shopInfo?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={product.shopInfo?.name}
                className="w-11 h-11 rounded-2xl object-cover border-2 border-white/60 shadow-sm"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm sm:text-base text-white truncate max-w-[200px]">
                  {product.shopInfo?.name || 'VIETSHOP Mall'}
                </h3>
                <span className="bg-white/20 text-white text-[10px] font-black px-1.5 py-0.2 rounded uppercase">
                  Chính Hãng
                </span>
              </div>
              <p className="text-[11px] text-orange-100 flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  <span>Đang hoạt động</span>
                </span>
                <span>•</span>
                <span>Phản hồi trong 2 phút</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
              title="Đóng chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pinned Product Context Banner */}
        <div className="bg-orange-50/90 border-b border-orange-200/70 p-2.5 sm:p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-12 h-12 rounded-xl object-cover border border-orange-200 shrink-0"
            />
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">
                {product.name}
              </h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-black text-[#ee4d2d]">
                  {product.price.toLocaleString('vi-VN')}₫
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-[10px] text-slate-400 line-through">
                    {product.originalPrice.toLocaleString('vi-VN')}₫
                  </span>
                )}
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                  Kho: {product.stock}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => sendMessage(`Shop ơi tư vấn giúp mình sản phẩm "${product.name}" này với ạ!`, true)}
            className="shrink-0 text-xs font-bold bg-[#ee4d2d] hover:bg-[#d73211] text-white px-3 py-1.5 rounded-xl shadow-xs transition cursor-pointer"
          >
            Gửi Link Cho Shop
          </button>
        </div>

        {/* Chat Message List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 custom-scrollbar">
          <div className="text-center">
            <span className="text-[10px] font-bold text-slate-400 bg-slate-200/60 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Hôm nay • Tư vấn trực tiếp
            </span>
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 shadow-xs text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#ee4d2d] text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
              >
                {msg.isProductSnippet && (
                  <div className="mb-2 p-2 bg-white/15 rounded-xl border border-white/20 text-xs font-semibold flex items-center gap-2">
                    <Store className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Sản phẩm: {product.name}</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <div
                  className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                    msg.sender === 'user' ? 'text-orange-100' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.time}</span>
                  {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-white" />}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-2.5 px-4 shadow-xs flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                <span>Shop đang gõ</span>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => sendMessage(q)}
              className="text-[11px] font-semibold text-slate-700 hover:text-[#ee4d2d] bg-slate-100 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 px-3 py-1.5 rounded-full shrink-0 transition cursor-pointer whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleFormSubmit}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Nhập tin nhắn để hỏi shop..."
            className="flex-1 px-4 py-2.5 bg-slate-100 focus:bg-white border border-slate-200 focus:border-[#ee4d2d] rounded-2xl text-xs sm:text-sm focus:outline-none transition"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="w-10 h-10 rounded-2xl bg-[#ee4d2d] hover:bg-[#d73211] text-white flex items-center justify-center transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
