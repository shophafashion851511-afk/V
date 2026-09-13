import React, { useState, useMemo } from 'react';
import { Product, Category, Voucher, SiteConfig, ShopSettings } from '../types';
import { generateVietshopStandaloneHtml } from '../utils/htmlExporter';
import { 
  Download, Copy, Check, ExternalLink, Code2, FileCode, 
  Layers, Monitor, Sparkles, CheckCircle2, ShieldCheck, Eye
} from 'lucide-react';

interface HtmlExportViewProps {
  products: Product[];
  categories: Category[];
  vouchers: Voucher[];
  siteConfig?: SiteConfig;
  shopSettings: ShopSettings;
}

export const HtmlExportView: React.FC<HtmlExportViewProps> = ({
  products,
  categories,
  vouchers,
  siteConfig,
  shopSettings
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'code' | 'preview'>('code');

  // Generate full HTML content
  const htmlContent = useMemo(() => {
    return generateVietshopStandaloneHtml(
      products,
      categories,
      vouchers,
      siteConfig,
      shopSettings
    );
  }, [products, categories, vouchers, siteConfig, shopSettings]);

  const htmlBlobUrl = useMemo(() => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    return URL.createObjectURL(blob);
  }, [htmlContent]);

  // Handle file download to computer
  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const fileName = `${(shopSettings.shopName || 'vietshop').toLowerCase().replace(/\s+/g, '_')}_store.html`;
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  // Handle copy HTML code
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = htmlContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Handle open in new tab
  const handleOpenNewTab = () => {
    window.open(htmlBlobUrl, '_blank');
  };

  const lineCount = useMemo(() => htmlContent.split('\n').length, [htmlContent]);
  const fileSizeKb = useMemo(() => (new Blob([htmlContent]).size / 1024).toFixed(1), [htmlContent]);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/80 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <FileCode className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <span>Xuất Mã HTML & Tải File Trang Web Về Máy</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Độc Lập 100%
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Tải file HTML hoàn chỉnh chứa đầy đủ sản phẩm, video, ảnh, banner và chức năng mua hàng để lưu trên máy tính hoặc tải lên hosting.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 sm:flex-initial px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Tải File HTML Về Máy</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Đã Sao Chép Mã!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Sao Chép Mã HTML</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleOpenNewTab}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
            title="Mở file HTML trong tab mới của trình duyệt"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Mở Tab Mới</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {downloadSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs sm:text-sm text-emerald-900 font-bold animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              Đã tải thành công tệp HTML về thư mục Tải về (Downloads) trên máy tính của bạn!
            </span>
          </div>
          <button onClick={() => setDownloadSuccess(false)} className="text-emerald-700 hover:text-emerald-900 text-xs">
            ✕ Đóng
          </button>
        </div>
      )}

      {/* Specs / Meta Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
          <span className="text-slate-400 block text-[11px]">Tên tệp tải về:</span>
          <span className="font-mono font-bold text-slate-800 text-xs truncate block">
            {(shopSettings.shopName || 'vietshop').toLowerCase().replace(/\s+/g, '_')}_store.html
          </span>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
          <span className="text-slate-400 block text-[11px]">Dung lượng tệp:</span>
          <span className="font-bold text-indigo-600 text-xs">~{fileSizeKb} KB</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
          <span className="text-slate-400 block text-[11px]">Số dòng code:</span>
          <span className="font-bold text-slate-800 text-xs">{lineCount} dòng</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
          <span className="text-slate-400 block text-[11px]">Sản phẩm nhúng:</span>
          <span className="font-bold text-emerald-600 text-xs">{products.length} sản phẩm đầy đủ</span>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('code')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'code'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Xem Mã Code HTML</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'preview'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem Thử Giao Diện File HTML</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>{copied ? 'Đã chép!' : 'Chép nhanh'}</span>
        </button>
      </div>

      {/* Main Display: Code or Live Preview */}
      {viewMode === 'code' ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950 text-slate-200">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              <span className="ml-2 font-bold text-slate-300">vietshop_store.html</span>
            </span>
            <span>UTF-8 • HTML5 • Tailwind CDN</span>
          </div>

          <pre className="p-4 text-xs font-mono max-h-[500px] overflow-auto leading-relaxed text-emerald-300/90 selection:bg-indigo-500 selection:text-white">
            <code>{htmlContent}</code>
          </pre>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md">
          <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 text-xs font-semibold text-slate-600 flex items-center justify-between">
            <span>Khung xem thử tệp HTML độc lập:</span>
            <button
              onClick={handleOpenNewTab}
              className="text-[#ee4d2d] font-bold hover:underline flex items-center gap-1"
            >
              <span>Phóng to toàn màn hình</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          <iframe
            src={htmlBlobUrl}
            title="Xem thử tệp HTML VIETSHOP"
            className="w-full h-[520px] bg-white border-0"
          />
        </div>
      )}

      {/* Guide Cards */}
      <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-2">
        <h4 className="font-extrabold text-xs sm:text-sm text-indigo-950 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Hướng Dẫn Sử Dụng Tệp HTML Sau Khi Tải Về:</span>
        </h4>
        <ul className="text-xs text-indigo-900/90 space-y-1.5 pl-4 list-disc">
          <li>
            <b>Mở xem trực tiếp trên máy:</b> Nhấp đúp chuột vào tệp <code className="bg-white px-1.5 py-0.5 rounded font-mono text-indigo-800 font-bold">.html</code> vừa tải về, trang web sẽ mở ngay trong Chrome, Cốc Cốc, Edge hoặc Safari mà không cần kết nối mạng server.
          </li>
          <li>
            <b>Tải lên hosting:</b> Bạn có thể đổi tên tệp thành <code className="bg-white px-1.5 py-0.5 rounded font-mono text-indigo-800 font-bold">index.html</code> và tải lên cPanel, Netlify, Vercel, GitHub Pages để chạy thành website thật hoàn toàn miễn phí.
          </li>
          <li>
            <b>Chỉnh sửa code:</b> Mở tệp bằng Notepad, VS Code hoặc Sublime Text để sửa chữ, đổi giá, thêm ảnh sản phẩm theo ý muốn.
          </li>
        </ul>
      </div>

    </div>
  );
};
