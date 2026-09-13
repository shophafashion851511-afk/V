import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // ==========================================
  // IN-MEMORY DATABASE FOR VIETSHOP PLATFORM
  // ==========================================
  const db = {
    users: [
      { id: 'usr-admin', name: 'Ban Quản Trị VIETSHOP', role: 'admin', email: 'admin@vietshop.vn', phone: '0901234567' },
      { id: 'usr-seller-1', name: 'VIETSHOP Official Store', role: 'seller', email: 'shop@vietshop.vn', phone: '0987654321', shopId: 'shop-vietshop-official' },
      { id: 'usr-customer-1', name: 'Nguyễn Văn Hùng', role: 'customer', email: 'hung.nguyen@gmail.com', phone: '0912345678' }
    ],
    sellerApplications: [
      {
        id: 'app-001',
        userId: 'usr-customer-1',
        applicantName: 'Nguyễn Văn Hùng',
        phone: '0912345678',
        email: 'hung.nguyen@gmail.com',
        shopName: 'Hùng Sport - Thời Trang Thể Thao',
        taxOrIdNumber: '031489201948',
        bankName: 'Vietcombank',
        bankAccountNumber: '9988112233',
        bankAccountHolder: 'NGUYEN VAN HUNG',
        warehouseAddress: 'Số 18 Ngõ 45 Trần Thái Tông, Cầu Giấy, Hà Nội',
        businessCategory: 'Thời Trang Nam',
        status: 'pending',
        submittedAt: '2026-09-02 10:30'
      },
      {
        id: 'app-002',
        userId: 'usr-customer-2',
        applicantName: 'Trần Thị Mai',
        phone: '0933445566',
        email: 'mai.tran@gmail.com',
        shopName: 'Mai Beauty & Cosmetics Korea',
        taxOrIdNumber: '079201994821',
        bankName: 'Techcombank',
        bankAccountNumber: '19034567890123',
        bankAccountHolder: 'TRAN THI MAI',
        warehouseAddress: '25 Lê Văn Sỹ, Phường 13, Quận 3, TP. Hồ Chí Minh',
        businessCategory: 'Sắc Đẹp & Mỹ Phẩm',
        status: 'approved',
        submittedAt: '2026-08-28 14:00',
        reviewedAt: '2026-08-29 09:15'
      }
    ],
    stores: [
      {
        id: 'shop-vietshop-official',
        ownerId: 'usr-seller-1',
        name: 'VIETSHOP Official Store',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=1200&auto=format&fit=crop&q=80',
        description: 'Gian hàng trực tuyến chính hãng được bảo trợ bởi sàn thương mại điện tử VIETSHOP.',
        warehouseAddress: 'Kho Tổng VIETSHOP, KCN Tân Bình, TP. Hồ Chí Minh',
        status: 'active',
        walletBalance: 24500000,
        taxNumber: '0315998822',
        bankName: 'VietinBank',
        bankAccountNumber: '101889977665',
        bankAccountHolder: 'CONG TY CP VIETSHOP',
        supportedCarriers: ['SPX Express', 'Giao Hàng Nhanh (GHN)', 'Viettel Post', 'J&T Express', 'Hỏa Tốc 2H'],
        rating: 4.9,
        createdAt: '2026-01-01'
      },
      {
        id: 'shop-mai-beauty',
        ownerId: 'usr-customer-2',
        name: 'Mai Beauty & Cosmetics Korea',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&auto=format&fit=crop&q=80',
        description: 'Chuyên mỹ phẩm xách tay Hàn Quốc & Nhật Bản chính hãng có bill.',
        warehouseAddress: '25 Lê Văn Sỹ, P.13, Q.3, TP. HCM',
        status: 'active',
        walletBalance: 8350000,
        taxNumber: '079201994821',
        bankName: 'Techcombank',
        bankAccountNumber: '19034567890123',
        bankAccountHolder: 'TRAN THI MAI',
        supportedCarriers: ['SPX Express', 'Giao Hàng Nhanh (GHN)', 'Viettel Post'],
        rating: 5.0,
        createdAt: '2026-08-29'
      }
    ],
    walletTransactions: [
      {
        id: 'tx-001',
        shopId: 'shop-vietshop-official',
        type: 'order_revenue',
        amount: 218000,
        description: 'Doanh thu hoàn tất từ đơn hàng #SP98234710',
        createdAt: '2026-08-31 16:45',
        status: 'completed'
      },
      {
        id: 'tx-002',
        shopId: 'shop-vietshop-official',
        type: 'order_revenue',
        amount: 1590000,
        description: 'Doanh thu hoàn tất từ đơn hàng #SP66391002',
        createdAt: '2026-09-01 11:20',
        status: 'completed'
      },
      {
        id: 'tx-003',
        shopId: 'shop-vietshop-official',
        type: 'withdrawal',
        amount: -5000000,
        description: 'Rút tiền về VietinBank STK 101889977665',
        createdAt: '2026-09-02 08:30',
        status: 'completed',
        bankInfo: {
          bankName: 'VietinBank',
          accountNumber: '101889977665',
          accountHolder: 'CONG TY CP VIETSHOP'
        }
      }
    ],
    withdrawals: [
      {
        id: 'wd-001',
        shopId: 'shop-vietshop-official',
        shopName: 'VIETSHOP Official Store',
        amount: 5000000,
        bankName: 'VietinBank',
        accountNumber: '101889977665',
        accountHolder: 'CONG TY CP VIETSHOP',
        status: 'approved',
        requestedAt: '2026-09-02 08:30',
        processedAt: '2026-09-02 09:15',
        note: 'Đã giải ngân qua hệ thống Napas 24/7'
      },
      {
        id: 'wd-002',
        shopId: 'shop-mai-beauty',
        shopName: 'Mai Beauty & Cosmetics Korea',
        amount: 2500000,
        bankName: 'Techcombank',
        accountNumber: '19034567890123',
        accountHolder: 'TRAN THI MAI',
        status: 'pending',
        requestedAt: '2026-09-03 14:10',
        note: 'Yêu cầu rút tiền doanh thu tuần'
      }
    ],
    serverOrders: [
      {
        id: 'ord-sample-01',
        orderCode: 'SP98234710',
        createdAt: '2026-08-31 14:20',
        total: 218000,
        status: 'shipping',
        customerInfo: { name: 'Nguyễn Văn Hùng', phone: '0912345678', address: '18 Ngõ 45 Trần Thái Tông', city: 'Hà Nội' }
      },
      {
        id: 'ord-sample-02',
        orderCode: 'SP77321944',
        createdAt: '2026-09-01 09:15',
        total: 389000,
        status: 'pending',
        customerInfo: { name: 'Lê Thu Hà', phone: '0988776655', address: 'Landmark 81', city: 'TP. Hồ Chí Minh' }
      }
    ]
  };

  // RBAC Helper Middleware
  const requireRole = (allowedRoles: string[]) => {
    return (req: any, res: any, next: any) => {
      const userRole = (req.headers['x-user-role'] as string) || req.body?.role || 'seller';
      if (!allowedRoles.includes(userRole) && userRole !== 'admin') {
        res.status(403).json({
          error: `Truy cập bị từ chối. Yêu cầu quyền: [${allowedRoles.join(', ')}]. Vai trò hiện tại của bạn: [${userRole}].`
        });
        return;
      }
      next();
    };
  };

  // -------------------------------------------------------------
  // 1. AUTHENTICATION & ROLE-BASED ACCESS CONTROL (RBAC) APIs
  // -------------------------------------------------------------
  app.post("/api/auth/login", (req, res) => {
    const { role = 'seller', password } = req.body;
    // Password check for admin/seller
    if (password && password !== '851011' && password !== 'admin') {
      res.status(401).json({ error: "Mật khẩu xác thực không đúng!" });
      return;
    }
    const user = db.users.find(u => u.role === role) || {
      id: 'usr-' + role,
      name: role === 'admin' ? 'Ban Quản Trị VIETSHOP' : (role === 'seller' ? 'Chủ Gian Hàng VIETSHOP' : 'Khách Mua Hàng'),
      role: role,
      email: `${role}@vietshop.vn`,
      phone: '0900000000',
      shopId: role === 'seller' ? 'shop-vietshop-official' : undefined
    };
    res.json({ success: true, user, role: user.role, token: 'token-' + role + '-' + Date.now() });
  });

  app.get("/api/auth/me", (req, res) => {
    const role = (req.headers['x-user-role'] as string) || 'seller';
    const user = db.users.find(u => u.role === role) || {
      id: 'usr-' + role,
      name: role === 'admin' ? 'Ban Quản Trị VIETSHOP' : 'Chủ Gian Hàng',
      role: role
    };
    res.json({ user, role: user.role });
  });

  // Seller Registration (Quy trình người mua đăng ký lên người bán)
  app.post("/api/seller/apply", (req, res) => {
    const { 
      applicantName, phone, email, shopName, taxOrIdNumber, 
      bankName, bankAccountNumber, bankAccountHolder, 
      warehouseAddress, businessCategory 
    } = req.body;

    if (!shopName || !taxOrIdNumber || !bankAccountNumber || !bankAccountHolder) {
      res.status(400).json({ error: "Vui lòng điền đầy đủ Tên gian hàng, Mã số thuế/CCCD, Tài khoản ngân hàng và Chủ tài khoản!" });
      return;
    }

    const newApplication = {
      id: 'app-' + Date.now().toString(36),
      userId: req.body.userId || 'usr-customer-' + Date.now().toString(36),
      applicantName: applicantName || 'Người Bán Mới',
      phone: phone || '0900000000',
      email: email || 'seller@vietshop.vn',
      shopName,
      taxOrIdNumber,
      bankName: bankName || 'Vietcombank',
      bankAccountNumber,
      bankAccountHolder: bankAccountHolder.toUpperCase(),
      warehouseAddress: warehouseAddress || 'Hà Nội / TP. Hồ Chí Minh',
      businessCategory: businessCategory || 'Thời Trang & Tiêu Dùng',
      status: 'pending',
      submittedAt: new Date().toLocaleString('vi-VN')
    };

    db.sellerApplications.unshift(newApplication as any);
    res.json({
      success: true,
      message: "Hồ sơ đăng ký người bán đã được gửi thành công và đang chờ Ban Quản Trị VIETSHOP phê duyệt!",
      application: newApplication
    });
  });

  app.get("/api/seller/application-status", (req, res) => {
    const phone = req.query.phone as string;
    const shopName = req.query.shopName as string;
    const appItem = db.sellerApplications.find(a => 
      (phone && a.phone === phone) || (shopName && a.shopName.toLowerCase() === shopName.toLowerCase())
    );
    res.json({ application: appItem || null });
  });

  // -------------------------------------------------------------
  // 2. SELLER PRODUCT APIs (GET, POST, PUT, DELETE)
  // -------------------------------------------------------------
  app.get("/api/seller/products", requireRole(['seller', 'vendor', 'admin']), (req, res) => {
    // In-memory or pass-through
    res.json({ success: true, count: 20 });
  });

  app.post("/api/seller/products", requireRole(['seller', 'vendor', 'admin']), (req, res) => {
    const productData = req.body;
    if (!productData.name || !productData.price) {
      res.status(400).json({ error: "Tên và giá sản phẩm là bắt buộc!" });
      return;
    }
    const newProduct = {
      ...productData,
      id: productData.id || 'sp-' + Date.now().toString(36),
      soldCount: 0,
      soldCountDisplay: '0',
      rating: 5.0,
      createdAt: new Date().toISOString()
    };
    res.status(201).json({ success: true, message: "Thêm sản phẩm thành công vào gian hàng!", product: newProduct });
  });

  app.put("/api/seller/products/:id", requireRole(['seller', 'vendor', 'admin']), (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    res.json({
      success: true,
      message: `Cập nhật sản phẩm #${id} thành công!`,
      product: { ...updatedData, id, updatedAt: new Date().toISOString() }
    });
  });

  app.delete("/api/seller/products/:id", requireRole(['seller', 'vendor', 'admin']), (req, res) => {
    const { id } = req.params;
    res.json({ success: true, message: `Đã xóa sản phẩm #${id} khỏi gian hàng.` });
  });

  // -------------------------------------------------------------
  // 3. SELLER ORDER APIs (GET, PATCH status)
  // -------------------------------------------------------------
  app.get("/api/seller/orders", requireRole(['seller', 'vendor', 'admin']), (req, res) => {
    const status = req.query.status as string;
    let orders = db.serverOrders;
    if (status && status !== 'all') {
      orders = orders.filter(o => o.status === status);
    }
    res.json({ success: true, orders });
  });

  app.patch("/api/seller/orders/:id/status", requireRole(['seller', 'vendor', 'admin']), (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipping', 'delivered', 'cancelled', 'refund_pending', 'refunded'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: `Trạng thái không hợp lệ. Cho phép: ${validStatuses.join(', ')}` });
      return;
    }
    const ord = db.serverOrders.find(o => o.id === id || o.orderCode === id);
    if (ord) {
      ord.status = status;
    }
    res.json({ success: true, message: `Đơn hàng #${id} đã được cập nhật sang trạng thái: ${status}`, status });
  });

  // -------------------------------------------------------------
  // 4. SELLER FINANCE & WALLET APIs (GET wallet, POST withdraw)
  // -------------------------------------------------------------
  app.get("/api/seller/wallet", requireRole(['seller', 'vendor', 'admin']), (req, res) => {
    const shop = db.stores[0];
    res.json({
      success: true,
      balance: shop.walletBalance,
      availableBalance: shop.walletBalance,
      pendingBalance: 1250000,
      bankInfo: {
        bankName: shop.bankName,
        accountNumber: shop.bankAccountNumber,
        accountHolder: shop.bankAccountHolder
      },
      transactions: db.walletTransactions,
      recentWithdrawals: db.withdrawals
    });
  });

  app.post("/api/seller/withdraw", requireRole(['seller', 'vendor', 'admin']), (req, res) => {
    const { amount, bankName, accountNumber, accountHolder } = req.body;
    const numAmount = Number(amount);
    const shop = db.stores[0];

    if (!numAmount || numAmount < 50000) {
      res.status(400).json({ error: "Số tiền rút tối thiểu là 50.000₫" });
      return;
    }
    if (numAmount > shop.walletBalance) {
      res.status(400).json({ error: `Số dư ví không đủ! Số dư hiện tại là: ${shop.walletBalance.toLocaleString('vi-VN')}₫` });
      return;
    }

    const newWithdrawal = {
      id: 'wd-' + Date.now().toString(36),
      shopId: shop.id,
      shopName: shop.name,
      amount: numAmount,
      bankName: bankName || shop.bankName,
      accountNumber: accountNumber || shop.bankAccountNumber,
      accountHolder: (accountHolder || shop.bankAccountHolder).toUpperCase(),
      status: 'pending',
      requestedAt: new Date().toLocaleString('vi-VN'),
      note: 'Yêu cầu rút tiền đang chờ Quản Trị VIETSHOP duyệt giải ngân'
    };

    // Deduct balance
    shop.walletBalance -= numAmount;
    db.withdrawals.unshift(newWithdrawal as any);
    db.walletTransactions.unshift({
      id: 'tx-' + Date.now().toString(36),
      shopId: shop.id,
      type: 'withdrawal',
      amount: -numAmount,
      description: `Yêu cầu rút tiền về ${newWithdrawal.bankName} STK ${newWithdrawal.accountNumber}`,
      createdAt: new Date().toLocaleString('vi-VN'),
      status: 'pending',
      bankInfo: {
        bankName: newWithdrawal.bankName,
        accountNumber: newWithdrawal.accountNumber,
        accountHolder: newWithdrawal.accountHolder
      }
    });

    res.json({
      success: true,
      message: `Đã gửi yêu cầu rút ${numAmount.toLocaleString('vi-VN')}₫ thành công. Ban Quản Trị VIETSHOP sẽ duyệt trong vòng 2-24h!`,
      withdrawal: newWithdrawal,
      newBalance: shop.walletBalance
    });
  });

  // -------------------------------------------------------------
  // 5. BAN QUẢN TRỊ VIETSHOP (ADMIN SUPERVISION & PLATFORM GOVERNANCE)
  // -------------------------------------------------------------
  app.get("/api/admin/applications", requireRole(['admin']), (req, res) => {
    res.json({ success: true, applications: db.sellerApplications });
  });

  app.post("/api/admin/applications/:id/review", requireRole(['admin']), (req, res) => {
    const { id } = req.params;
    const { action, reason } = req.body; // action: 'approve' | 'reject'
    const appItem = db.sellerApplications.find(a => a.id === id);
    if (!appItem) {
      res.status(404).json({ error: "Không tìm thấy hồ sơ đăng ký!" });
      return;
    }

    if (action === 'approve') {
      appItem.status = 'approved';
      appItem.reviewedAt = new Date().toLocaleString('vi-VN');

      // Create new store
      const newStore = {
        id: 'shop-' + Date.now().toString(36),
        ownerId: appItem.userId,
        name: appItem.shopName,
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=1200&auto=format&fit=crop&q=80',
        description: `Gian hàng ${appItem.shopName} - Đã được Ban Quản Trị VIETSHOP phê duyệt chính thức.`,
        warehouseAddress: appItem.warehouseAddress,
        status: 'active',
        walletBalance: 0,
        taxNumber: appItem.taxOrIdNumber,
        bankName: appItem.bankName,
        bankAccountNumber: appItem.bankAccountNumber,
        bankAccountHolder: appItem.bankAccountHolder,
        supportedCarriers: ['SPX Express', 'Giao Hàng Nhanh (GHN)', 'Viettel Post'],
        rating: 5.0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      db.stores.push(newStore as any);

      // Update user role to seller
      const user = db.users.find(u => u.id === appItem.userId);
      if (user) {
        user.role = 'seller';
        user.shopId = newStore.id;
      }

      res.json({
        success: true,
        message: `Đã phê duyệt thành công hồ sơ của gian hàng [${appItem.shopName}]! Quyền Người Bán đã được kích hoạt.`,
        application: appItem,
        store: newStore
      });
    } else {
      (appItem as any).status = 'rejected';
      (appItem as any).rejectionReason = reason || 'Hồ sơ chưa đạt tiêu chuẩn quy định của sàn VIETSHOP';
      (appItem as any).reviewedAt = new Date().toLocaleString('vi-VN');
      res.json({
        success: true,
        message: `Đã từ chối hồ sơ đăng ký của [${appItem.shopName}].`,
        application: appItem
      });
    }
  });

  app.get("/api/admin/withdrawals", requireRole(['admin']), (req, res) => {
    res.json({ success: true, withdrawals: db.withdrawals });
  });

  app.post("/api/admin/withdrawals/:id/review", requireRole(['admin']), (req, res) => {
    const { id } = req.params;
    const { action, note } = req.body; // 'approve' | 'reject'
    const wd = db.withdrawals.find(w => w.id === id);
    if (!wd) {
      res.status(404).json({ error: "Không tìm thấy yêu cầu rút tiền!" });
      return;
    }

    if (action === 'approve') {
      wd.status = 'approved';
      wd.processedAt = new Date().toLocaleString('vi-VN');
      wd.note = note || 'Ban Quản Trị VIETSHOP đã duyệt chi tiền qua Napas 24/7.';
      res.json({ success: true, message: `Đã duyệt giải ngân ${wd.amount.toLocaleString('vi-VN')}₫ cho gian hàng [${wd.shopName}]!`, withdrawal: wd });
    } else {
      wd.status = 'rejected';
      wd.processedAt = new Date().toLocaleString('vi-VN');
      wd.note = note || 'Từ chối giải ngân do sai lệch thông tin ngân hàng.';
      // Refund back to store wallet
      const shop = db.stores.find(s => s.id === wd.shopId);
      if (shop) {
        shop.walletBalance += wd.amount;
      }
      res.json({ success: true, message: `Đã từ chối lệnh rút tiền và hoàn tiền về ví của shop.`, withdrawal: wd });
    }
  });

  app.get("/api/admin/stores", requireRole(['admin']), (req, res) => {
    res.json({ success: true, stores: db.stores });
  });

  app.patch("/api/admin/stores/:id/status", requireRole(['admin']), (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'active' | 'suspended'
    const store = db.stores.find(s => s.id === id);
    if (!store) {
      res.status(404).json({ error: "Không tìm thấy gian hàng!" });
      return;
    }
    store.status = status;
    res.json({ success: true, message: `Đã đổi trạng thái gian hàng [${store.name}] thành: ${status}`, store });
  });

  app.get("/api/admin/overview", requireRole(['admin']), (req, res) => {
    res.json({
      success: true,
      stats: {
        totalStores: db.stores.length,
        activeStores: db.stores.filter(s => s.status === 'active').length,
        pendingApplications: db.sellerApplications.filter(a => a.status === 'pending').length,
        pendingWithdrawals: db.withdrawals.filter(w => w.status === 'pending').length,
        totalPlatformVolume: '148.500.000₫',
        commissionRevenue: '7.425.000₫',
        disputeRate: '0.04%'
      }
    });
  });

  // -------------------------------------------------------------
  // 6. THIRD-PARTY AUXILIARY SERVICES: UPLOAD FILE & REAL-TIME
  // -------------------------------------------------------------
  app.post("/api/upload", (req, res) => {
    try {
      const { filename = 'image.jpg', dataUrl, fileType = 'image/jpeg' } = req.body;
      if (!dataUrl) {
        res.status(400).json({ error: "Thiếu dữ liệu tệp (dataUrl)!" });
        return;
      }
      // Return processed storage CDN URL / persistent data
      res.json({
        success: true,
        url: dataUrl,
        filename,
        fileType,
        size: Math.round(dataUrl.length * 0.75),
        uploadedAt: new Date().toISOString()
      });
    } catch (err: any) {
      res.status(500).json({ error: "Lỗi tải ảnh: " + (err.message || 'Unknown') });
    }
  });

  app.post("/api/realtime/trigger-order", (req, res) => {
    const simulatedCode = 'SP' + Math.floor(10000000 + Math.random() * 90000000);
    res.json({
      success: true,
      event: 'new_order',
      orderCode: simulatedCode,
      message: `Đơn hàng mới #${simulatedCode} vừa được khách đặt mua!`,
      timestamp: new Date().toISOString()
    });
  });

  // 1. AI Customer Chat API
  app.post("/api/ai/customer-chat", async (req, res) => {
    try {
      const { message, products = [], vouchers = [], shopSettings = {} } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: "Thiếu nội dung tin nhắn" });
        return;
      }

      const client = getGeminiClient();

      if (client) {
        // Compact product context for Gemini
        const productContext = products.slice(0, 30).map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          originalPrice: p.originalPrice,
          category: p.categoryName || p.category,
          rating: p.rating,
          sold: p.soldCountDisplay || p.soldCount,
          isMall: p.isMall,
          isFlashSale: p.isFlashSale,
          tags: p.tags
        }));

        const voucherContext = vouchers.map((v: any) => ({
          code: v.code,
          title: v.title,
          desc: v.description,
          minOrder: v.minOrder
        }));

        const systemInstruction = `Bạn là Trợ Lý AI Bán Hàng & Tư Vấn Mua Sắm trực tuyến thông minh của sàn thương mại điện tử VIETSHOP - Siêu Thị Trực Tuyến.
Nhiệm vụ của bạn:
1. Trả lời người mua hàng một cách lịch sự, nhiệt tình, chuyên nghiệp và thân thiện bằng tiếng Việt.
2. Dựa vào danh sách sản phẩm và voucher hiện có của cửa hàng để tư vấn chính xác.
3. Khi bạn muốn đề xuất hoặc giới thiệu sản phẩm cụ thể cho khách, bạn BẮT BUỘC chèn cú pháp [PRODUCT:mã_id] (Ví dụ: [PRODUCT:sp-01]) vào trong câu trả lời để hệ thống tự động hiển thị thẻ sản phẩm tương tác cho khách hàng bấm xem chi tiết hoặc thêm vào giỏ hàng.
4. Khi nhắc đến mã giảm giá, bạn chèn cú pháp [VOUCHER:mã_code] (Ví dụ: [VOUCHER:FREESHIP30K]).
5. Cung cấp thông tin chính sách của VIETSHOP: Bảo hành 100% chính hãng, đổi trả 15 ngày miễn phí, Freeship Xtra 0Đ toàn quốc, thanh toán COD / VIETSHOP Pay / VietQR.
6. Giữ câu trả lời súc tích, định dạng rõ ràng (sử dụng gạch đầu dòng nếu cần).`;

        const prompt = `Danh sách sản phẩm trong kho: ${JSON.stringify(productContext)}
Mã giảm giá đang có: ${JSON.stringify(voucherContext)}
Thông tin shop: Tên ${shopSettings.shopName || 'VIETSHOP'}, Đổi trả 15 ngày, Freeship 0Đ.

Câu hỏi của khách hàng: "${message}"

Hãy trả lời khách hàng thật chu đáo và chèn [PRODUCT:id] cho các sản phẩm phù hợp.`;

        const response = await client.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            systemInstruction
          }
        });

        const replyText = response.text || "Cảm ơn bạn đã liên hệ VIETSHOP! Mình có thể hỗ trợ gì thêm cho bạn không ạ?";
        
        // Extract product IDs referenced
        const matchedProductIds = Array.from(replyText.matchAll(/\[PRODUCT:([a-zA-Z0-9_-]+)\]/g)).map(m => m[1]);
        const recommendedProducts = products.filter((p: any) => matchedProductIds.includes(p.id));

        res.json({
          reply: replyText,
          recommendedProducts,
          isAiGenerated: true
        });
        return;
      }

      // Fallback rule-based smart engine if no Gemini API Key is present
      const lower = message.toLowerCase();
      let matched = products.filter((p: any) => {
        const nameMatch = p.name?.toLowerCase().includes(lower);
        const catMatch = p.categoryName?.toLowerCase().includes(lower) || p.category?.toLowerCase().includes(lower);
        const tagMatch = p.tags?.some((t: string) => lower.includes(t.toLowerCase()));
        return nameMatch || catMatch || tagMatch;
      });

      if (matched.length === 0) {
        // Keyword heuristic
        if (lower.includes('áo') || lower.includes('quần') || lower.includes('thời trang')) {
          matched = products.filter((p: any) => p.category?.includes('fashion') || p.categoryName?.includes('Thời Trang'));
        } else if (lower.includes('tai nghe') || lower.includes('điện thoại') || lower.includes('công nghệ') || lower.includes('loa')) {
          matched = products.filter((p: any) => p.category?.includes('tech') || p.categoryName?.includes('Điện Tử'));
        } else if (lower.includes('mỹ phẩm') || lower.includes('son') || lower.includes('kem') || lower.includes('đẹp')) {
          matched = products.filter((p: any) => p.category?.includes('beauty') || p.categoryName?.includes('Sắc Đẹp'));
        } else if (lower.includes('sale') || lower.includes('giảm giá') || lower.includes('rẻ') || lower.includes('hot')) {
          matched = products.filter((p: any) => p.isFlashSale || p.discountPercent >= 30).slice(0, 4);
        }
      }

      const topRecs = matched.slice(0, 4);
      let replyText = "";

      if (lower.includes('freeship') || lower.includes('ship') || lower.includes('vận chuyển')) {
        replyText = `Chào bạn! VIETSHOP hiện đang có chính sách **Miễn phí vận chuyển toàn quốc 0Đ** [VOUCHER:FREESHIP30K] cho mọi đơn hàng. Thời gian giao hàng hỏa tốc chỉ từ 1-2h nội thành và 1-3 ngày toàn quốc.`;
      } else if (lower.includes('đổi trả') || lower.includes('bảo hành') || lower.includes('hoàn tiền')) {
        replyText = `VIETSHOP cam kết **100% hàng chính hãng**, hỗ trợ **Đổi trả & Hoàn tiền miễn phí trong 15 ngày** nếu sản phẩm lỗi hoặc không vừa ý! Shipper sẽ đến tận nhà lấy hàng trả mà bạn không tốn bất kỳ phí nào.`;
      } else if (lower.includes('voucher') || lower.includes('mã giảm') || lower.includes('khuyến mãi')) {
        replyText = `VIETSHOP đang có rất nhiều mã giảm giá hấp dẫn:\n• [VOUCHER:FREESHIP30K] Giảm 30K phí vận chuyển\n• [VOUCHER:SHOPEE50K] Giảm 50K cho đơn từ 299K\n• [VOUCHER:SALE15PCT] Giảm 15% cho khách hàng mới\nBạn có thể lưu mã và áp dụng ngay ở bước thanh toán nhé!`;
      } else if (topRecs.length > 0) {
        replyText = `Dạ chào bạn! VIETSHOP xin gửi bạn một số sản phẩm nổi bật phù hợp với nhu cầu tìm kiếm của bạn:\n${topRecs.map((p: any) => `• [PRODUCT:${p.id}] ${p.name} - Giá ưu đãi: ${p.price.toLocaleString('vi-VN')}₫`).join('\n')}\n\nBạn có thể bấm vào thẻ sản phẩm bên dưới để xem chi tiết hoặc thêm vào giỏ hàng ngay nhé!`;
      } else {
        replyText = `Dạ chào bạn! Em là Trợ Lý AI của VIETSHOP. Bạn đang quan tâm đến sản phẩm thời trang, đồ điện tử công nghệ, mỹ phẩm hay muốn nhận mã giảm giá/freeship hôm nay ạ? Hãy nhắn từ khóa để em hỗ trợ tìm kiếm nhanh nhất nhé!`;
      }

      res.json({
        reply: replyText,
        recommendedProducts: topRecs,
        isAiGenerated: false
      });
    } catch (err: any) {
      console.error("AI Customer Chat Error:", err);
      res.status(500).json({ error: "Lỗi xử lý AI: " + (err.message || "Unknown") });
    }
  });

  // 2. AI Seller Auto Product Generator
  app.post("/api/ai/seller-generate-product", async (req, res) => {
    try {
      const { prompt, categoryId = "fashion_men", categories = [] } = req.body;
      if (!prompt) {
        res.status(400).json({ error: "Thiếu mô tả yêu cầu sản phẩm" });
        return;
      }

      const client = getGeminiClient();

      if (client) {
        const aiPrompt = `Tạo một sản phẩm thương mại điện tử hoàn chỉnh trên VIETSHOP (Siêu Thị Trực Tuyến Chính Hãng) dựa trên yêu cầu của người bán:
Yêu cầu: "${prompt}"
Mã danh mục gợi ý: "${categoryId}"
Danh mục hiện có: ${categories.map((c: any) => `${c.id}: ${c.name}`).join(', ')}

Hãy trả về định dạng JSON thuần túy khớp với schema sau. Giá bán (price, originalPrice) bằng số nguyên VND hợp lý. Có discountPercent từ 10-50%. Có ít nhất 2 nhóm phân loại (ví dụ: Màu sắc, Size hoặc Dung lượng). Có mô tả chi tiết hấp dẫn có gạch đầu dòng chuẩn SEO Shopee/VIETSHOP.`;

        const response = await client.models.generateContent({
          model: "gemini-3.7-flash",
          contents: aiPrompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Tên sản phẩm chuẩn SEO thương mại điện tử" },
                price: { type: Type.NUMBER, description: "Giá khuyến mãi (VND)" },
                originalPrice: { type: Type.NUMBER, description: "Giá gốc niêm yết (VND)" },
                discountPercent: { type: Type.NUMBER, description: "% giảm giá" },
                category: { type: Type.STRING, description: "Mã category id" },
                categoryName: { type: Type.STRING, description: "Tên danh mục" },
                stock: { type: Type.NUMBER, description: "Số lượng tồn kho" },
                description: { type: Type.STRING, description: "Mô tả chi tiết sản phẩm, ưu điểm, thông số kỹ thuật" },
                specifications: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      key: { type: Type.STRING },
                      value: { type: Type.STRING }
                    },
                    required: ["key", "value"]
                  }
                },
                variations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: "Tên nhóm phân loại (Màu sắc, Kích cỡ...)" },
                      options: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING },
                            label: { type: Type.STRING }
                          },
                          required: ["id", "label"]
                        }
                      }
                    },
                    required: ["name", "options"]
                  }
                },
                tags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["name", "price", "originalPrice", "discountPercent", "category", "categoryName", "stock", "description", "variations", "tags"]
            }
          }
        });

        const parsed = JSON.parse(response.text || "{}");
        
        // Convert specs array to record if needed
        const specsObj: Record<string, string> = {};
        if (Array.isArray(parsed.specifications)) {
          parsed.specifications.forEach((s: any) => {
            if (s.key && s.value) specsObj[s.key] = s.value;
          });
        } else {
          specsObj['Xuất xứ'] = 'Việt Nam';
          specsObj['Bảo hành'] = '12 tháng chính hãng';
        }

        // Default image selection based on category/prompt
        let defaultImg = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
        const pLower = (prompt + " " + parsed.name).toLowerCase();
        if (pLower.includes('áo') || pLower.includes('quần') || pLower.includes('thời trang') || pLower.includes('polo')) {
          defaultImg = 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80';
        } else if (pLower.includes('giày') || pLower.includes('sneaker')) {
          defaultImg = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80';
        } else if (pLower.includes('tai nghe') || pLower.includes('loa') || pLower.includes('bluetooth')) {
          defaultImg = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80';
        } else if (pLower.includes('đồng hồ') || pLower.includes('watch')) {
          defaultImg = 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80';
        } else if (pLower.includes('mỹ phẩm') || pLower.includes('son') || pLower.includes('serum') || pLower.includes('kem')) {
          defaultImg = 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80';
        } else if (pLower.includes('nồi') || pLower.includes('bình') || pLower.includes('gia dụng')) {
          defaultImg = 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80';
        }

        const newGeneratedProduct = {
          id: 'sp-' + Date.now().toString(36),
          name: parsed.name,
          price: Number(parsed.price) || 199000,
          originalPrice: Number(parsed.originalPrice) || 299000,
          discountPercent: Number(parsed.discountPercent) || 30,
          image: defaultImg,
          gallery: [defaultImg],
          category: parsed.category || categoryId,
          categoryName: parsed.categoryName || 'Sản Phẩm Mới',
          rating: 5.0,
          reviewCount: 0,
          soldCount: 0,
          soldCountDisplay: '0',
          stock: Number(parsed.stock) || 100,
          location: 'Hà Nội & TP. HCM',
          isMall: true,
          isFavorite: true,
          isFreeshipXtra: true,
          isFlashSale: false,
          description: parsed.description || 'Sản phẩm chính hãng chất lượng cao tại VIETSHOP.',
          specifications: specsObj,
          variations: parsed.variations || [
            {
              name: 'Phân loại',
              options: [
                { id: 'opt-1', label: 'Tiêu Chuẩn' },
                { id: 'opt-2', label: 'Cao Cấp' }
              ]
            }
          ],
          reviews: [],
          shopInfo: {
            id: 'shop-vietshop-official',
            name: 'VIETSHOP Official Store',
            avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
            isOfficial: true,
            rating: 5.0,
            responseRate: '100%',
            responseSpeed: 'trong vài phút',
            joinDate: 'Hôm nay',
            productsCount: 1,
            followersCount: '1.2k'
          },
          tags: parsed.tags || ['VIETSHOP', 'Chính Hãng', 'Freeship'],
          isActive: true,
          updatedAt: new Date().toISOString().split('T')[0]
        };

        res.json({ product: newGeneratedProduct, success: true });
        return;
      }

      // Smart fallback heuristic product generator
      const cleanPrompt = prompt.trim();
      const randomPrice = 150000 + Math.floor(Math.random() * 300000);
      const originalPrice = Math.round((randomPrice * 1.4) / 1000) * 1000;
      const discountPercent = Math.round(((originalPrice - randomPrice) / originalPrice) * 100);

      const fallbackProduct = {
        id: 'sp-' + Date.now().toString(36),
        name: `[CHÍNH HÃNG] ${cleanPrompt} - Bản Cao Cấp Mới 2026`,
        price: randomPrice,
        originalPrice: originalPrice,
        discountPercent: discountPercent,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
        gallery: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'],
        category: categoryId,
        categoryName: 'Sản Phẩm Tạo Bằng AI',
        rating: 5.0,
        reviewCount: 0,
        soldCount: 0,
        soldCountDisplay: '0',
        stock: 150,
        location: 'Hà Nội',
        isMall: true,
        isFavorite: true,
        isFreeshipXtra: true,
        isFlashSale: false,
        description: `🌟 ĐẶC ĐIỂM NỔI BẬT CỦA SẢN PHẨM:
- ${cleanPrompt} được thiết kế tinh tế, chất lượng vượt trội đạt tiêu chuẩn xuất khẩu.
- Gia công tỉ mỉ, độ bền cao, an toàn tuyệt đối cho người sử dụng.
- Bảo hành 12 tháng chính hãng 1 đổi 1 tận nơi.
- Hỗ trợ đổi trả miễn phí trong 15 ngày trên toàn quốc qua VIETSHOP Mall.`,
        specifications: {
          'Xuất xứ': 'Việt Nam',
          'Chất liệu / Tiêu chuẩn': 'Cao cấp chuẩn Mall',
          'Bảo hành': '12 tháng chính hãng',
          'Tình trạng': 'Mới 100% nguyên seal'
        },
        variations: [
          {
            name: 'Màu Sắc',
            options: [
              { id: 'v-black', label: 'Đen Sang Trọng' },
              { id: 'v-white', label: 'Trắng Tinh Tế' },
              { id: 'v-blue', label: 'Xanh Navy' }
            ]
          },
          {
            name: 'Kích cỡ / Bản',
            options: [
              { id: 'sz-std', label: 'Bản Tiêu Chuẩn' },
              { id: 'sz-pro', label: 'Bản Nâng Cấp Pro' }
            ]
          }
        ],
        reviews: [],
        shopInfo: {
          id: 'shop-vietshop-official',
          name: 'VIETSHOP Official Store',
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
          isOfficial: true,
          rating: 5.0,
          responseRate: '100%',
          responseSpeed: 'trong vài phút',
          joinDate: 'Hôm nay',
          productsCount: 1,
          followersCount: '1.2k'
        },
        tags: ['VIETSHOP', 'Mall', 'Chính Hãng', 'Hot Trend', 'Freeship'],
        isActive: true,
        updatedAt: new Date().toISOString().split('T')[0]
      };

      res.json({ product: fallbackProduct, success: true });
    } catch (err: any) {
      console.error("AI Seller Generate Error:", err);
      res.status(500).json({ error: "Lỗi tạo sản phẩm: " + (err.message || "Unknown") });
    }
  });

  // 3. AI Seller Optimize Product
  app.post("/api/ai/seller-optimize-product", async (req, res) => {
    try {
      const { product } = req.body;
      if (!product) {
        res.status(400).json({ error: "Thiếu thông tin sản phẩm" });
        return;
      }

      const client = getGeminiClient();

      if (client) {
        const prompt = `Bạn là chuyên gia tối ưu hóa bán hàng (SEO E-commerce Copywriter) hàng đầu.
Hãy viết lại và nâng cấp tiêu đề, mô tả hấp dẫn chuẩn SEO, thông số kỹ thuật và bộ tag cho sản phẩm này:
Tên hiện tại: "${product.name}"
Mô tả hiện tại: "${product.description}"
Ngành hàng: "${product.categoryName}"

Hãy trả về JSON:
{
  "name": "Tiêu đề mới chuẩn SEO kích thích mua sắm",
  "description": "Mô tả mới chi tiết có gạch đầu dòng, cam kết bảo hành, tính năng nổi bật",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`;

        const response = await client.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                tags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["name", "description", "tags"]
            }
          }
        });

        const parsed = JSON.parse(response.text || "{}");
        const updated = {
          ...product,
          name: parsed.name || product.name,
          description: parsed.description || product.description,
          tags: parsed.tags || product.tags,
          updatedAt: new Date().toISOString().split('T')[0]
        };

        res.json({ product: updated, success: true });
        return;
      }

      // Fallback optimizer
      const optimized = {
        ...product,
        name: `[CHÍNH HÃNG] ${product.name.replace(/\[.*?\]/g, '').trim()} - Đảm Bảo Chất Lượng (Bảo Hành 12 Tháng)`,
        description: `🔥 SẢN PHẨM CHÍNH HÃNG CAO CẤP TẠI VIETSHOP 🔥\n\n${product.description}\n\n✅ QUYỀN LỢI ĐẶC QUYỀN KHI MUA TẠI VIETSHOP:\n- Miễn phí vận chuyển toàn quốc 0Đ (Freeship Xtra).\n- Bảo hành chính hãng 12-24 tháng 1 đổi 1 tận nhà.\n- Cam kết hoàn tiền nếu phát hiện hàng giả, hàng kém chất lượng.\n- Đổi trả miễn phí trong 15 ngày nếu không vừa ý.`,
        tags: Array.from(new Set([...(product.tags || []), 'VIETSHOP', 'Chính Hãng', 'Freeship Xtra', 'Bảo Hành 12T', 'Hot Deal'])),
        updatedAt: new Date().toISOString().split('T')[0]
      };

      res.json({ product: optimized, success: true });
    } catch (err: any) {
      console.error("AI Optimize Error:", err);
      res.status(500).json({ error: "Lỗi tối ưu sản phẩm: " + (err.message || "Unknown") });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
