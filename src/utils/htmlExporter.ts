import { Product, Category, Voucher, SiteConfig, ShopSettings } from '../types';
import { formatVND } from './formatters';

export function generateVietshopStandaloneHtml(
  products: Product[],
  categories: Category[],
  vouchers: Voucher[],
  siteConfig: Partial<SiteConfig> = {},
  shopSettings: Partial<ShopSettings> = {}
): string {
  const shopName = shopSettings.shopName || 'VIETSHOP';
  const announcement = siteConfig.topAnnouncement || 'VIETSHOP SIÊU THỊ TRỰC TUYẾN: Miễn phí vận chuyển 0Đ toàn quốc đơn từ 0Đ!';
  const hotline = siteConfig.footerHotline || '1900 6868';
  const email = siteConfig.footerEmail || 'support@vietshop.vn';

  // Format products JSON safely for embedded script
  const productsJson = JSON.stringify(
    products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      discountPercent: p.discountPercent,
      image: p.image,
      gallery: p.gallery || [p.image],
      videoUrl: p.videoUrl || '',
      category: p.category,
      categoryName: p.categoryName,
      rating: p.rating,
      soldCount: p.soldCount,
      stock: p.stock,
      description: p.description || '',
      isFlashSale: p.isFlashSale,
      isMall: p.isMall,
      variations: p.variations || []
    }))
  ).replace(/</g, '\\u003c');

  const categoriesJson = JSON.stringify(
    categories.map(c => ({
      id: c.id,
      name: c.name,
      image: c.image
    }))
  ).replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${shopName} - Siêu Thị Trực Tuyến Hàng Đầu</title>
  <meta name="description" content="Mua sắm trực tuyến hàng ngàn sản phẩm chính hãng, freeship toàn quốc, giảm giá cực sốc tại ${shopName}" />
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  </style>
</head>
<body class="bg-slate-100 text-slate-800 min-h-screen flex flex-col">

  <!-- Top Announcement Bar -->
  <div class="bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] text-white py-1.5 px-4 text-xs font-semibold">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-2 overflow-hidden whitespace-nowrap">
        <span>🔥</span>
        <span class="truncate">${announcement}</span>
      </div>
      <div class="hidden sm:flex items-center gap-4 text-[11px] shrink-0">
        <span>Hotline: <b>${hotline}</b></span>
        <span>|</span>
        <span>Cam kết 100% Chính Hãng</span>
      </div>
    </div>
  </div>

  <!-- Header -->
  <header class="bg-white shadow-xs sticky top-0 z-40 border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
      
      <!-- Brand Logo -->
      <a href="#" class="flex items-center gap-2 shrink-0">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ee4d2d] to-orange-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-orange-500/20">
          V
        </div>
        <div>
          <span class="font-black text-xl sm:text-2xl text-[#ee4d2d] tracking-tight block leading-none">
            ${shopName}
          </span>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Siêu Thị Trực Tuyến
          </span>
        </div>
      </a>

      <!-- Search Bar -->
      <div class="flex-1 max-w-2xl relative">
        <input 
          id="searchInput"
          type="text"
          placeholder="${siteConfig.searchPlaceholder || 'Tìm kiếm sản phẩm, thương hiệu, danh mục...'}"
          class="w-full pl-10 pr-24 py-2 sm:py-2.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-[#ee4d2d] transition"
        />
        <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <button 
          id="searchBtn"
          class="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#ee4d2d] hover:bg-[#d73211] text-white text-xs font-bold rounded-xl transition cursor-pointer"
        >
          Tìm
        </button>
      </div>

      <!-- Right Actions (Cart & Support) -->
      <div class="flex items-center gap-3 shrink-0">
        <button 
          onclick="alert('Giỏ hàng hiện có: ' + cartCount + ' sản phẩm.\\nTổng tiền ước tính: ' + totalCartValue.toLocaleString('vi-VN') + '₫');"
          class="relative p-2.5 bg-orange-50 hover:bg-orange-100 text-[#ee4d2d] rounded-2xl border border-orange-200 flex items-center gap-2 font-bold text-xs cursor-pointer transition"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <span class="hidden sm:inline">Giỏ Hàng</span>
          <span id="cartBadge" class="bg-[#ee4d2d] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center -ml-1">
            0
          </span>
        </button>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 py-5 flex-1 w-full space-y-6">

    <!-- Hero Banner Slider -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2 relative aspect-[21/9] sm:aspect-[2/1] rounded-2xl overflow-hidden shadow-md group bg-slate-900">
        <img 
          id="heroImage"
          src="${siteConfig.heroSlides[0]?.image || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80'}"
          alt="Banner"
          class="w-full h-full object-cover brightness-75 transition-all duration-500"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 sm:p-8 flex flex-col justify-end text-white">
          <span id="heroTag" class="px-2.5 py-1 bg-[#ee4d2d] font-black text-[10px] sm:text-xs rounded-lg uppercase tracking-wider self-start mb-2">
            ${siteConfig.heroSlides[0]?.tag || 'SIÊU KHUYẾN MÃI'}
          </span>
          <h2 id="heroTitle" class="text-xl sm:text-3xl font-black mb-1 drop-shadow-md">
            ${siteConfig.heroSlides[0]?.title || 'SIÊU ĐẠI HỘI SALE 9.9'}
          </h2>
          <p id="heroSubtitle" class="text-xs sm:text-sm text-slate-200">
            ${siteConfig.heroSlides[0]?.subtitle || 'Voucher 500K • Freeship Toàn Quốc'}
          </p>
        </div>
      </div>

      <!-- Mini Banners -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
        ${(siteConfig.miniBanners || []).slice(0, 2).map((mb, idx) => `
          <div class="relative aspect-[21/9] sm:aspect-auto lg:h-[calc(50%-8px)] rounded-2xl overflow-hidden shadow-md group">
            <img src="${mb.image}" alt="${mb.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500 brightness-90" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent p-3 flex flex-col justify-end text-white">
              <span class="text-[10px] font-extrabold uppercase text-amber-300">${mb.tag}</span>
              <h4 class="text-xs sm:text-sm font-bold line-clamp-1">${mb.title}</h4>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Categories Strip -->
    <div class="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-extrabold text-sm sm:text-base text-slate-800 uppercase tracking-wide flex items-center gap-2">
          <span>📦</span> Danh Mục Sản Phẩm
        </h3>
        <button onclick="filterCategory('all')" class="text-xs text-[#ee4d2d] font-bold hover:underline">
          Xem Tất Cả
        </button>
      </div>

      <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onclick="filterCategory('all')"
          class="cat-pill active flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 text-[#ee4d2d] border border-orange-200 text-xs font-bold whitespace-nowrap cursor-pointer hover:bg-orange-100 transition"
        >
          🌟 Tất Cả
        </button>
        ${categories.map(cat => `
          <button 
            onclick="filterCategory('${cat.id}')"
            class="cat-pill flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold whitespace-nowrap cursor-pointer hover:bg-slate-100 transition"
          >
            <img src="${cat.image}" class="w-4 h-4 rounded object-cover" />
            <span>${cat.name}</span>
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Flash Sale Header -->
    <div class="bg-gradient-to-r from-[#ee4d2d] to-amber-500 rounded-2xl p-4 text-white shadow-md flex items-center justify-between flex-wrap gap-3">
      <div class="flex items-center gap-3">
        <div class="bg-white text-[#ee4d2d] px-2.5 py-1 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1 shadow-xs">
          ⚡ FLASH SALE
        </div>
        <span class="text-xs font-bold text-orange-100 hidden sm:inline">KẾT THÚC TRONG:</span>
        <div class="flex items-center gap-1 font-mono font-black text-xs text-slate-900">
          <span class="bg-white px-2 py-0.5 rounded-md">02</span>:
          <span class="bg-white px-2 py-0.5 rounded-md">45</span>:
          <span id="secondsTimer" class="bg-white px-2 py-0.5 rounded-md">19</span>
        </div>
      </div>
      <span class="text-xs font-semibold text-orange-100">Giá Sốc Mỗi Ngày - Số Lượng Có Hạn</span>
    </div>

    <!-- Products Grid -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
          <span>🔥</span> GỢI Ý HÔM NAY (<span id="productCount">${products.length}</span> SẢN PHẨM)
        </h3>
      </div>

      <div id="productGrid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        <!-- Products rendered by script below -->
      </div>
    </div>

    <!-- Vouchers & Shop Commitments -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
      <div class="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-xs">
        <div class="w-10 h-10 rounded-xl bg-orange-100 text-[#ee4d2d] flex items-center justify-center font-bold text-lg">🛡️</div>
        <div>
          <h4 class="font-bold text-xs text-slate-900">100% Chính Hãng</h4>
          <p class="text-[11px] text-slate-500">Hoàn tiền 200% nếu giả</p>
        </div>
      </div>
      <div class="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-xs">
        <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">🚚</div>
        <div>
          <h4 class="font-bold text-xs text-slate-900">Freeship Toàn Quốc</h4>
          <p class="text-[11px] text-slate-500">Đơn hàng từ 0Đ</p>
        </div>
      </div>
      <div class="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-xs">
        <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">🔄</div>
        <div>
          <h4 class="font-bold text-xs text-slate-900">Đổi Trả 15 Ngày</h4>
          <p class="text-[11px] text-slate-500">Thủ tục nhanh 24/7</p>
        </div>
      </div>
      <div class="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-xs">
        <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg">📞</div>
        <div>
          <h4 class="font-bold text-xs text-slate-900">Hỗ Trợ 24/7</h4>
          <p class="text-[11px] text-slate-500">Hotline: ${hotline}</p>
        </div>
      </div>
    </div>

  </main>

  <!-- Product Detail Modal (Single Page Interactive) -->
  <div id="productModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 hidden">
    <div class="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in">
      <div class="p-4 border-b border-slate-100 flex items-center justify-between">
        <span id="modalCategory" class="text-xs font-bold text-[#ee4d2d] uppercase">Thời Trang</span>
        <button onclick="closeProductModal()" class="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg cursor-pointer">
          ✕
        </button>
      </div>

      <div class="p-5 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Media Gallery -->
        <div class="space-y-3">
          <div class="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <img id="modalMainImg" src="" class="w-full h-full object-cover" />
            <video id="modalMainVideo" controls class="w-full h-full object-contain bg-black hidden"></video>
          </div>
          <div id="modalThumbnails" class="flex gap-2 overflow-x-auto pb-1">
            <!-- Thumbs generated by JS -->
          </div>
        </div>

        <!-- Product Info & Variations -->
        <div class="space-y-4">
          <h3 id="modalName" class="font-bold text-base sm:text-lg text-slate-900 leading-snug"></h3>
          
          <div class="p-3 bg-orange-50 rounded-xl border border-orange-100 flex items-baseline gap-3">
            <span id="modalPrice" class="text-2xl font-black text-[#ee4d2d]"></span>
            <span id="modalOrigPrice" class="text-xs text-slate-400 line-through"></span>
            <span id="modalDiscount" class="bg-[#ee4d2d] text-white text-[10px] font-black px-1.5 py-0.5 rounded"></span>
          </div>

          <div id="modalVariations" class="space-y-3">
            <!-- Size & Color options generated by JS -->
          </div>

          <div>
            <span class="text-xs font-bold text-slate-600 uppercase block mb-1">Mô tả sản phẩm:</span>
            <p id="modalDesc" class="text-xs text-slate-600 leading-relaxed max-h-32 overflow-y-auto"></p>
          </div>

          <!-- Actions -->
          <div class="pt-2 flex gap-3">
            <button 
              id="modalAddCartBtn"
              class="flex-1 py-3 bg-orange-100 hover:bg-orange-200 text-[#ee4d2d] font-bold rounded-xl text-xs transition cursor-pointer"
            >
              Thêm Vào Giỏ
            </button>
            <button 
              id="modalBuyNowBtn"
              class="flex-1 py-3 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-extrabold rounded-xl text-xs shadow-md shadow-orange-500/20 transition cursor-pointer"
            >
              Mua Ngay
            </button>
          </div>

          <!-- Shop Box in Modal -->
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              <span class="text-lg">🏪</span>
              <div>
                <span class="font-bold text-slate-800">${shopName} Official</span>
                <span class="block text-[10px] text-slate-400">Đánh giá: 4.9 ⭐ • Phản hồi: 99%</span>
              </div>
            </div>
            <button onclick="alert('Chào mừng bạn đến với gian hàng chính hãng ${shopName}!');" class="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-100">
              Xem Shop
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer class="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
    <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      <div class="space-y-2">
        <h4 class="font-bold text-slate-900 text-sm">${shopName}</h4>
        <p class="leading-relaxed">
          ${siteConfig.footerAbout || 'VIETSHOP là nền tảng thương mại điện tử hàng đầu, mang đến hàng triệu sản phẩm chất lượng cao với giá tốt nhất.'}
        </p>
      </div>
      <div class="space-y-2">
        <h4 class="font-bold text-slate-900 text-sm">Chăm Sóc Khách Hàng</h4>
        <p>Hotline: <b class="text-slate-800">${hotline}</b> (8:00 - 21:00)</p>
        <p>Email: <b class="text-slate-800">${email}</b></p>
        <p>Hướng dẫn đặt hàng & thanh toán</p>
        <p>Chính sách vận chuyển & đổi trả</p>
      </div>
      <div class="space-y-2">
        <h4 class="font-bold text-slate-900 text-sm">Về Chúng Tôi</h4>
        <p>Giới thiệu về ${shopName} Việt Nam</p>
        <p>Tuyển dụng nhân sự</p>
        <p>Chính sách bảo mật thanh toán</p>
        <p>Điều khoản sử dụng dịch vụ</p>
      </div>
      <div class="space-y-2">
        <h4 class="font-bold text-slate-900 text-sm">Phương Thức Thanh Toán</h4>
        <div class="flex flex-wrap gap-2 text-slate-700 font-bold text-[11px]">
          <span class="p-1.5 bg-slate-100 rounded">COD</span>
          <span class="p-1.5 bg-slate-100 rounded">ShopeePay</span>
          <span class="p-1.5 bg-slate-100 rounded">Visa/Mastercard</span>
          <span class="p-1.5 bg-slate-100 rounded">Chuyển Khoản</span>
        </div>
      </div>
    </div>
    <div class="max-w-7xl mx-auto px-4 pt-6 mt-6 border-t border-slate-100 text-center text-slate-400 text-[11px]">
      © 2026 ${shopName}. Bản quyền thuộc về sàn thương mại điện tử ${shopName}.
    </div>
  </footer>

  <!-- Embedded Client Logic -->
  <script>
    const productsData = ${productsJson};
    let currentCategory = 'all';
    let searchQuery = '';
    let cartCount = 0;
    let totalCartValue = 0;

    function formatVND(n) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
    }

    function renderProducts() {
      const grid = document.getElementById('productGrid');
      if (!grid) return;

      const filtered = productsData.filter(p => {
        const matchCat = currentCategory === 'all' || p.category === currentCategory;
        const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
      });

      document.getElementById('productCount').textContent = filtered.length;

      if (filtered.length === 0) {
        grid.innerHTML = '<div class="col-span-full py-12 text-center text-slate-400 font-medium text-sm">Không tìm thấy sản phẩm nào phù hợp.</div>';
        return;
      }

      grid.innerHTML = filtered.map(p => {
        return \`
          <div 
            onclick="openProductModal('\${p.id}')"
            class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col group"
          >
            <div class="relative aspect-square bg-slate-100 overflow-hidden">
              <img src="\${p.image}" alt="\${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
              \${p.discountPercent > 0 ? \`<span class="absolute top-2 right-2 bg-[#ee4d2d] text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs">-\${p.discountPercent}%</span>\` : ''}
              \${p.isMall ? \`<span class="absolute top-2 left-2 bg-[#d0011b] text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">Mall</span>\` : ''}
              \${p.videoUrl ? \`<span class="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">▶ Video</span>\` : ''}
            </div>
            <div class="p-3 flex-1 flex flex-col justify-between space-y-2">
              <h4 class="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-[#ee4d2d] transition">
                \${p.name}
              </h4>
              <div class="space-y-1">
                <div class="flex items-baseline gap-1.5">
                  <span class="text-sm font-black text-[#ee4d2d]">\${formatVND(p.price)}</span>
                  \${p.originalPrice > p.price ? \`<span class="text-[10px] text-slate-400 line-through">\${formatVND(p.originalPrice)}</span>\` : ''}
                </div>
                <div class="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                  <span>⭐ \${p.rating || 5.0}</span>
                  <span>Đã bán \${p.soldCount || 0}</span>
                </div>
              </div>
            </div>
          </div>
        \`;
      }).join('');
    }

    function filterCategory(catId) {
      currentCategory = catId;
      document.querySelectorAll('.cat-pill').forEach(btn => {
        btn.classList.remove('bg-orange-50', 'text-[#ee4d2d]', 'border-orange-200', 'font-bold');
        btn.classList.add('bg-slate-50', 'text-slate-700', 'border-slate-200');
      });
      event?.currentTarget?.classList?.add('bg-orange-50', 'text-[#ee4d2d]', 'border-orange-200', 'font-bold');
      renderProducts();
    }

    function openProductModal(id) {
      const p = productsData.find(x => x.id === id);
      if (!p) return;

      document.getElementById('modalCategory').textContent = p.categoryName || 'Sản phẩm';
      document.getElementById('modalName').textContent = p.name;
      document.getElementById('modalPrice').textContent = formatVND(p.price);
      document.getElementById('modalOrigPrice').textContent = p.originalPrice > p.price ? formatVND(p.originalPrice) : '';
      document.getElementById('modalDiscount').textContent = p.discountPercent > 0 ? \`-\${p.discountPercent}%\` : '';
      document.getElementById('modalDesc').textContent = p.description || 'Sản phẩm chính hãng với chất lượng đảm bảo và bảo hành uy tín từ shop.';

      const mainImg = document.getElementById('modalMainImg');
      const mainVid = document.getElementById('modalMainVideo');
      mainImg.src = p.image;
      mainImg.classList.remove('hidden');
      mainVid.classList.add('hidden');
      mainVid.pause();

      // Thumbnails (Images & Video)
      const thumbs = document.getElementById('modalThumbnails');
      let thumbsHtml = '';
      if (p.gallery && p.gallery.length > 0) {
        p.gallery.forEach((img, idx) => {
          thumbsHtml += \`
            <img 
              src="\${img}" 
              onclick="showImg('\${img}')"
              class="w-12 h-12 rounded-lg object-cover border border-slate-300 hover:border-[#ee4d2d] cursor-pointer"
            />
          \`;
        });
      }
      if (p.videoUrl) {
        thumbsHtml += \`
          <button 
            onclick="showVideo('\${p.videoUrl}')"
            class="w-12 h-12 rounded-lg bg-purple-50 border border-purple-300 flex flex-col items-center justify-center text-purple-700 text-[10px] font-bold cursor-pointer"
          >
            ▶ Video
          </button>
        \`;
      }
      thumbs.innerHTML = thumbsHtml;

      // Variations (Size & Color)
      const varContainer = document.getElementById('modalVariations');
      if (p.variations && p.variations.length > 0) {
        varContainer.innerHTML = p.variations.map(v => \`
          <div>
            <span class="text-xs font-bold text-slate-700 block mb-1">\${v.name}:</span>
            <div class="flex flex-wrap gap-1.5">
              \${v.options.map((opt, i) => \`
                <button 
                  onclick="selectOption(this)"
                  class="px-2.5 py-1 text-xs border border-slate-200 rounded-lg hover:border-[#ee4d2d] hover:text-[#ee4d2d] \${i === 0 ? 'bg-orange-50 border-[#ee4d2d] text-[#ee4d2d] font-bold' : 'bg-white'}"
                >
                  \${opt.label}
                </button>
              \`).join('')}
            </div>
          </div>
        \`).join('');
      } else {
        varContainer.innerHTML = '';
      }

      document.getElementById('modalAddCartBtn').onclick = () => {
        cartCount++;
        totalCartValue += p.price;
        document.getElementById('cartBadge').textContent = cartCount;
        alert('Đã thêm "' + p.name + '" vào giỏ hàng!');
        closeProductModal();
      };

      document.getElementById('modalBuyNowBtn').onclick = () => {
        cartCount++;
        totalCartValue += p.price;
        document.getElementById('cartBadge').textContent = cartCount;
        alert('Mua ngay thành công đơn hàng "' + p.name + '" giá ' + formatVND(p.price) + '!\\nCảm ơn quý khách đã mua sắm tại ${shopName}.');
        closeProductModal();
      };

      document.getElementById('productModal').classList.remove('hidden');
    }

    function showImg(src) {
      const mainImg = document.getElementById('modalMainImg');
      const mainVid = document.getElementById('modalMainVideo');
      mainImg.src = src;
      mainImg.classList.remove('hidden');
      mainVid.classList.add('hidden');
      mainVid.pause();
    }

    function showVideo(src) {
      const mainImg = document.getElementById('modalMainImg');
      const mainVid = document.getElementById('modalMainVideo');
      mainVid.src = src;
      mainVid.classList.remove('hidden');
      mainImg.classList.add('hidden');
      mainVid.play();
    }

    function selectOption(btn) {
      const parent = btn.parentElement;
      parent.querySelectorAll('button').forEach(b => {
        b.classList.remove('bg-orange-50', 'border-[#ee4d2d]', 'text-[#ee4d2d]', 'font-bold');
        b.classList.add('bg-white');
      });
      btn.classList.add('bg-orange-50', 'border-[#ee4d2d]', 'text-[#ee4d2d]', 'font-bold');
    }

    function closeProductModal() {
      const modal = document.getElementById('productModal');
      modal.classList.add('hidden');
      const vid = document.getElementById('modalMainVideo');
      if (vid) vid.pause();
    }

    // Search input
    document.getElementById('searchInput').addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderProducts();
    });
    document.getElementById('searchBtn').addEventListener('click', () => {
      searchQuery = document.getElementById('searchInput').value.trim();
      renderProducts();
    });

    // Auto-countdown timer seconds
    setInterval(() => {
      const secEl = document.getElementById('secondsTimer');
      if (secEl) {
        let sec = parseInt(secEl.textContent, 10);
        sec = sec <= 0 ? 59 : sec - 1;
        secEl.textContent = sec.toString().padStart(2, '0');
      }
    }, 1000);

    // Initial render
    renderProducts();
  </script>
</body>
</html>`;
}
