import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'sp-01',
    name: 'Áo Thun Nam Nữ Form Rộng Unisex Cotton 100% Thoáng Mát Basic Tee',
    price: 129000,
    originalPrice: 220000,
    discountPercent: 41,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&auto=format&fit=crop&q=80'
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    category: 'fashion_men',
    categoryName: 'Thời Trang Nam',
    rating: 4.9,
    reviewCount: 3420,
    soldCount: 12500,
    soldCountDisplay: '12.5k',
    stock: 245,
    location: 'Hà Nội',
    isMall: true,
    isFavorite: true,
    isFreeshipXtra: true,
    isFlashSale: true,
    flashSaleStockTotal: 100,
    flashSaleSold: 78,
    description: `Áo thun phong cách Unisex form rộng hiện đại, phù hợp cho cả nam và nữ.
- Chất liệu: 100% Cotton tự nhiên 2 chiều dày dặn, định lượng 250gsm không xù lông.
- Co giãn tốt, thấm hút mồ hôi vượt trội, thoáng mát suốt ngày dài.
- Form dáng Oversize chuẩn phong cách Streetwear Hàn Quốc.
- Đường may tỉ mỉ, bo cổ dày dặn không bai nhão sau nhiều lần giặt.`,
    specifications: {
      'Xuất xứ': 'Việt Nam',
      'Chất liệu': '100% Cotton 2 chiều',
      'Mẫu mã': 'Form rộng Unisex',
      'Bảo hành': 'Đổi trả miễn phí 15 ngày'
    },
    variations: [
      {
        name: 'Màu sắc',
        options: [
          { id: 'v-black', label: 'Đen Trơn' },
          { id: 'v-white', label: 'Trắng Sữa' },
          { id: 'v-grey', label: 'Xám Khói' },
          { id: 'v-green', label: 'Xanh Rêu' }
        ]
      },
      {
        name: 'Kích cỡ',
        options: [
          { id: 'sz-m', label: 'Size M (45-60kg)' },
          { id: 'sz-l', label: 'Size L (60-75kg)' },
          { id: 'sz-xl', label: 'Size XL (75-90kg)' }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        userName: 'nguyenthingoc_99',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        date: '2026-08-28',
        comment: 'Áo vải dày dặn lắm nha mọi người, form mặc lên siêu ưng luôn, đóng gói cẩn thận có tem mác xịn xò. Giao hàng 1 ngày là tới!',
        variation: 'Đen Trơn, Size L',
        likes: 34
      },
      {
        id: 'rev-2',
        userName: 'tran_minh_khoa',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        date: '2026-08-25',
        comment: 'Chất vải mát, không bị mỏng như mấy shop khác. Giá 129k mà được áo xịn như này quá rẻ, đã mua 3 cái.',
        variation: 'Trắng Sữa, Size XL',
        likes: 18
      }
    ],
    shopInfo: {
      id: 'shop-official-01',
      name: 'TEELAB Official Store',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
      isOfficial: true,
      rating: 4.9,
      responseRate: '99%',
      responseSpeed: 'trong vài phút',
      joinDate: '4 năm trước',
      productsCount: 142,
      followersCount: '480.5k'
    },
    tags: ['Áo thun', 'Oversize', 'Unisex', 'Cotton', 'Freeship'],
    isActive: true,
    updatedAt: '2026-08-30'
  },
  {
    id: 'sp-02',
    name: 'Tai Nghe Bluetooth Không Dây True Wireless Chống Ồn Chủ Động ANC Âm Bass Cực Căng',
    price: 389000,
    originalPrice: 750000,
    discountPercent: 48,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80'
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    category: 'electronics',
    categoryName: 'Thiết Bị Điện Tử',
    rating: 4.8,
    reviewCount: 2150,
    soldCount: 8900,
    soldCountDisplay: '8.9k',
    stock: 120,
    location: 'TP. Hồ Chí Minh',
    isMall: true,
    isFavorite: false,
    isFreeshipXtra: true,
    isFlashSale: true,
    flashSaleStockTotal: 80,
    flashSaleSold: 65,
    description: `Tai nghe bluetooth không dây thế hệ mới 2026 với công nghệ chống ồn ANC và màng loa Composite 13mm.
- Bluetooth 5.3 kết nối siêu nhanh, độ trễ cực thấp chỉ 45ms chơi game không delay.
- Thời lượng pin khủng: 6-8 tiếng nghe liên tục, dock sạc cung cấp thêm 28 tiếng.
- Cảm ứng đa điểm thông minh: Chạm dừng/phát, tăng giảm âm lượng, chuyển bài.
- Chống nước chuẩn IPX5 thoải mái tập gym, chạy bộ đi mưa nhẹ.`,
    specifications: {
      'Thương hiệu': 'BaseSound',
      'Chuẩn Bluetooth': '5.3 Edr',
      'Dung lượng Pin': '400mAh (Dock) / 40mAh (Tai)',
      'Bảo hành': '12 tháng 1 đổi 1'
    },
    variations: [
      {
        name: 'Màu Sắc',
        options: [
          { id: 'col-black', label: 'Đen Huyền Bí' },
          { id: 'col-white', label: 'Trắng Tinh Khôi' },
          { id: 'col-pink', label: 'Hồng Pastel' }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-3',
        userName: 'hoang_duc_anh',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        date: '2026-08-20',
        comment: 'Chất âm rất tốt trong tầm giá, bass dày và đập ấm. Đeo vừa tai không bị cấn hay đau!',
        likes: 12
      }
    ],
    shopInfo: {
      id: 'shop-tech-01',
      name: 'BaseSound Tech Mall',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      isOfficial: true,
      rating: 4.8,
      responseRate: '98%',
      responseSpeed: 'trong vài phút',
      joinDate: '3 năm trước',
      productsCount: 88,
      followersCount: '210k'
    },
    tags: ['Tai nghe', 'Bluetooth', 'ANC', 'True Wireless'],
    isActive: true,
    updatedAt: '2026-08-31'
  },
  {
    id: 'sp-03',
    name: 'Son Kem Lì Mịn Môi Lâu Trôi Lên Màu Chuẩn Siêu Xinh 6 Tone Hot Trend',
    price: 99000,
    originalPrice: 180000,
    discountPercent: 45,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'beauty',
    categoryName: 'Sắc Đẹp & Mỹ Phẩm',
    rating: 4.9,
    reviewCount: 4510,
    soldCount: 23100,
    soldCountDisplay: '23.1k',
    stock: 350,
    location: 'TP. Hồ Chí Minh',
    isMall: true,
    isFavorite: true,
    isFreeshipXtra: true,
    isFlashSale: true,
    flashSaleStockTotal: 150,
    flashSaleSold: 132,
    description: `Dòng son kem lì Velvet Mịn Môi với kết cấu xốp mịn như nhung, không gây khô môi hay lộ vân môi.
- Chứa tinh dầu Jojoba và Vitamin E cấp ẩm giúp môi luôn mềm mại.
- Độ bám màu bền bỉ từ 6-8 tiếng, ăn uống nhẹ không trôi.
- Thiết kế thân son nhám mờ sang trọng, đầu cọ vát chéo dễ dàng viền môi.`,
    variations: [
      {
        name: 'Tone Màu',
        options: [
          { id: 'c-01', label: '#01 Đỏ Đất Trendy' },
          { id: 'c-02', label: '#02 Cam Cháy Cá Tính' },
          { id: 'c-03', label: '#03 Hồng Khô Dịu Dàng' },
          { id: 'c-04', label: '#04 Đỏ Rượu Quyến Rũ' }
        ]
      }
    ],
    shopInfo: {
      id: 'shop-beauty-01',
      name: 'GlowBeauty Cosmetics',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      isOfficial: true,
      rating: 4.9,
      responseRate: '100%',
      responseSpeed: 'trong vài phút',
      joinDate: '5 năm trước',
      productsCount: 310,
      followersCount: '620k'
    },
    tags: ['Son kem', 'Son lì', 'Mỹ phẩm', 'Lâu trôi'],
    isActive: true,
    updatedAt: '2026-08-29'
  },
  {
    id: 'sp-04',
    name: 'Giày Sneaker Nam Nữ Thể Thao Đế Cao Su Non Êm Chân Phong Cách Hàn Quốc',
    price: 249000,
    originalPrice: 450000,
    discountPercent: 44,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'shoes',
    categoryName: 'Giày Dép',
    rating: 4.8,
    reviewCount: 1980,
    soldCount: 7600,
    soldCountDisplay: '7.6k',
    stock: 180,
    location: 'Hà Nội',
    isMall: false,
    isFavorite: true,
    isFreeshipXtra: true,
    isFlashSale: false,
    description: `Mẫu giày sneaker hot hit trẻ trung, phối đồ cực kỳ tôn dáng và phong cách.
- Đế cao su non nguyên khối đúc mềm êm ái, tăng chiều cao 4cm tự nhiên.
- Thân giày da PU cao cấp kết hợp lưới dệt thoáng khí, không bí bách.
- Phù hợp đi học, đi chơi, tập thể dục thể thao, phối đồ streetwear.`,
    variations: [
      {
        name: 'Màu Sắc',
        options: [
          { id: 'sh-red', label: 'Trắng Phối Đỏ' },
          { id: 'sh-black', label: 'Trắng Phối Đen' },
          { id: 'sh-grey', label: 'Xám Xi Măng' }
        ]
      },
      {
        name: 'Size Giày',
        options: [
          { id: 'sz-38', label: 'Size 38' },
          { id: 'sz-39', label: 'Size 39' },
          { id: 'sz-40', label: 'Size 40' },
          { id: 'sz-41', label: 'Size 41' },
          { id: 'sz-42', label: 'Size 42' },
          { id: 'sz-43', label: 'Size 43' }
        ]
      }
    ],
    shopInfo: {
      id: 'shop-shoes-01',
      name: 'K-Sneaker House',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      isOfficial: false,
      rating: 4.8,
      responseRate: '96%',
      responseSpeed: 'trong 15 phút',
      joinDate: '2 năm trước',
      productsCount: 75,
      followersCount: '95k'
    },
    tags: ['Sneaker', 'Giày thể thao', 'Giày nam nữ', 'Đế êm'],
    isActive: true,
    updatedAt: '2026-08-28'
  },
  {
    id: 'sp-05',
    name: 'Nồi Chiên Không Dầu Điện Tử 6.5L Kính Trong Suốt Công Nghệ Rapid Air Giảm 85% Dầu Mỡ',
    price: 890000,
    originalPrice: 1650000,
    discountPercent: 46,
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'home_living',
    categoryName: 'Nhà Cửa & Đời Sống',
    rating: 4.9,
    reviewCount: 920,
    soldCount: 3200,
    soldCountDisplay: '3.2k',
    stock: 65,
    location: 'Đà Nẵng',
    isMall: true,
    isFavorite: true,
    isFreeshipXtra: true,
    isFlashSale: true,
    flashSaleStockTotal: 40,
    flashSaleSold: 31,
    description: `Nồi chiên không dầu dung tích lớn 6.5L nướng nguyên con gà 2.5kg dễ dàng.
- Thiết kế mặt kính chịu nhiệt trong suốt kèm đèn LED nhìn rõ thực phẩm chín bên trong.
- Bảng điều khiển cảm ứng thông minh với 8 chế độ nấu cài sẵn.
- Lòng nồi phủ chống dính Ceramic cao cấp dễ dàng vệ sinh sau khi nấu.`,
    variations: [
      {
        name: 'Phiên Bản',
        options: [
          { id: 'v-65l-black', label: 'Bản 6.5L Đen Cảm Ứng' },
          { id: 'v-65l-white', label: 'Bản 6.5L Trắng Ngọc' }
        ]
      }
    ],
    shopInfo: {
      id: 'shop-home-01',
      name: 'Sunhouse Mall Official',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
      isOfficial: true,
      rating: 4.9,
      responseRate: '99%',
      responseSpeed: 'trong vài phút',
      joinDate: '6 năm trước',
      productsCount: 520,
      followersCount: '890k'
    },
    tags: ['Nồi chiên không dầu', 'Gia dụng', 'Nhà bếp', 'Sunhouse'],
    isActive: true,
    updatedAt: '2026-08-31'
  },
  {
    id: 'sp-06',
    name: 'Ốp Lưng iPhone Magsafe Trong Suốt Chống Ố Vàng Viền Kim Loại Bảo Vệ Camera Toàn Diện',
    price: 49000,
    originalPrice: 120000,
    discountPercent: 59,
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'tech_phones',
    categoryName: 'Điện Thoại & Phụ Kiện',
    rating: 4.9,
    reviewCount: 8400,
    soldCount: 45000,
    soldCountDisplay: '45.0k',
    stock: 890,
    location: 'Hà Nội',
    isMall: false,
    isFavorite: true,
    isFreeshipXtra: true,
    isFlashSale: true,
    flashSaleStockTotal: 200,
    flashSaleSold: 189,
    description: `Ốp lưng Magsafe cao cấp cho các dòng iPhone 11 đến 16 Pro Max.
- Vòng nam châm lực hút N52 chuẩn zin, sạc không dây cực kỳ chắc chắn.
- Chất liệu Bayer TPU cao cấp của Đức chống ố vàng đến 6 tháng.
- Gờ bảo vệ cụm camera nhô cao 0.8mm chống trầy xước va đập.`,
    variations: [
      {
        name: 'Dòng Máy',
        options: [
          { id: 'ip-13promax', label: 'iPhone 13 Pro Max' },
          { id: 'ip-14promax', label: 'iPhone 14 Pro Max' },
          { id: 'ip-15promax', label: 'iPhone 15 Pro Max' },
          { id: 'ip-16promax', label: 'iPhone 16 Pro Max' }
        ]
      }
    ],
    shopInfo: {
      id: 'shop-case-01',
      name: 'CaseKing Phụ Kiện Apple',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      isOfficial: false,
      rating: 4.9,
      responseRate: '98%',
      responseSpeed: 'trong vài phút',
      joinDate: '3 năm trước',
      productsCount: 190,
      followersCount: '310k'
    },
    tags: ['Ốp lưng', 'iPhone', 'Magsafe', 'Phụ kiện điện thoại'],
    isActive: true,
    updatedAt: '2026-08-30'
  },
  {
    id: 'sp-07',
    name: 'Bình Giữ Nhiệt Inox 316 Cao Cấp 1000ml Giữ Nhiệt Nóng Lạnh 24H Kèm Ống Hút Tiện Lợi',
    price: 159000,
    originalPrice: 280000,
    discountPercent: 43,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'home_living',
    categoryName: 'Nhà Cửa & Đời Sống',
    rating: 4.8,
    reviewCount: 1420,
    soldCount: 6300,
    soldCountDisplay: '6.3k',
    stock: 140,
    location: 'TP. Hồ Chí Minh',
    isMall: true,
    isFavorite: false,
    isFreeshipXtra: true,
    isFlashSale: false,
    description: `Bình giữ nhiệt chuẩn inox y tế 316 an toàn tuyệt đối cho sức khỏe.
- Giữ nóng từ 12-18 tiếng, giữ đá lạnh lên tới 24 tiếng không đọng nước ra ngoài.
- Nắp bật mở 1 chạm, có khóa an toàn chống tràn nước khi mang đi xe.
- Dung tích lớn 1 lít đáp ứng đủ nhu cầu nước cho cả ngày làm việc, học tập.`,
    variations: [
      {
        name: 'Màu Sắc',
        options: [
          { id: 'b-black', label: 'Đen Nhám' },
          { id: 'b-cream', label: 'Trắng Sữa' },
          { id: 'b-blue', label: 'Xanh Navy' }
        ]
      }
    ],
    shopInfo: {
      id: 'shop-home-01',
      name: 'Sunhouse Mall Official',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
      isOfficial: true,
      rating: 4.9,
      responseRate: '99%',
      responseSpeed: 'trong vài phút',
      joinDate: '6 năm trước',
      productsCount: 520,
      followersCount: '890k'
    },
    tags: ['Bình giữ nhiệt', 'Inox 316', 'Gia dụng', '1000ml'],
    isActive: true,
    updatedAt: '2026-08-27'
  },
  {
    id: 'sp-08',
    name: 'Balo Đi Học Laptop 15.6 Inch Chống Thấm Nước Thời Trang Nam Nữ Đa Năng',
    price: 189000,
    originalPrice: 320000,
    discountPercent: 40,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'fashion_men',
    categoryName: 'Thời Trang Nam',
    rating: 4.8,
    reviewCount: 1650,
    soldCount: 5400,
    soldCountDisplay: '5.4k',
    stock: 95,
    location: 'Hà Nội',
    isMall: false,
    isFavorite: true,
    isFreeshipXtra: true,
    isFlashSale: false,
    description: `Balo thời trang cao cấp với ngăn chống sốc chuyên dụng đựng vừa laptop 15.6 inch.
- Chất liệu vải Oxford 900D phủ tráng PU chống thấm nước vượt trội khi gặp mưa.
- Đệm lưng và quai đeo tổ ong thoáng khí êm vai không bị mỏi.
- Nhiều ngăn chia tiện lợi đựng sách vở, bình nước, ipad, sạc dự phòng.`,
    variations: [
      {
        name: 'Màu Sắc',
        options: [
          { id: 'balo-black', label: 'Đen Basic' },
          { id: 'balo-grey', label: 'Xám Ghi' },
          { id: 'balo-blue', label: 'Xanh Đậm' }
        ]
      }
    ],
    shopInfo: {
      id: 'shop-bag-01',
      name: 'BagZone Official',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      isOfficial: true,
      rating: 4.8,
      responseRate: '97%',
      responseSpeed: 'trong 10 phút',
      joinDate: '4 năm trước',
      productsCount: 110,
      followersCount: '150k'
    },
    tags: ['Balo', 'Balo laptop', 'Thời trang', 'Đi học'],
    isActive: true,
    updatedAt: '2026-08-26'
  }
];
