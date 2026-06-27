/* =============================================================================
 * config.js — SINGLE SOURCE OF TRUTH
 * Tech Spec §26: tập trung mọi giá trị dễ thay đổi tại một nơi.
 * Sửa giá / hotline / URL / pixel ở ĐÂY, không hard-code rải rác.
 * =========================================================================== */

window.SADU_CONFIG = {

  /* --- PRICING ---------------------------------------------------------------
   * Giá lẻ: 1 gói = 109.000đ
   * Từ 2 gói trở lên: 99.000đ/gói
   * Khuyến mại = (qty * UNIT_PRICE) - total
   * -------------------------------------------------------------------------*/
  UNIT_PRICE: 109000,        // đơn giá 1 gói 250g
  DEAL_MIN_QTY: 2,           // từ 2 gói áp dụng giá ưu đãi
  DEAL_UNIT_PRICE: 99000,    // giá ưu đãi mỗi gói khi mua từ 2 gói

  /* --- SHIPPING (chốt theo Quyết định #7) ----------------------------------- */
  FREE_SHIP_THRESHOLD: 250000, // tổng tiền >= 250.000 => freeship
  SHIPPING_FEE: 30000,         // ngược lại => 30.000

  /* --- QUANTITY SELECTOR ----------------------------------------------------- */
  QTY_MIN: 1,
  QTY_MAX: 99,               // TODO-CONFIG: xác nhận trần số lượng nếu cần
  QTY_DEFAULT: 4,            // mặc định đẩy về combo 4 gói có freeship

  /* --- CONTACT --------------------------------------------------------------- */
  HOTLINE: '1900 8952',                 // TODO-CONFIG: số hotline thật
  HOTLINE_HREF: 'tel:19008952',         // TODO-CONFIG
  COMPANY_NAME: 'SADU',                 // TODO-CONFIG: tên công ty đầy đủ
  COMPANY_ADDRESS: 'Thong tin dia chi showroom dang duoc cap nhat',
  WEBSITE: 'https://www.sadu.com.vn',
  FANPAGE: 'https://facebook.com/sadu.vn',
  EMAIL: 'nongnghiepcncthanglong@gmail.com',

  /* --- INTEGRATIONS (để trống, không hard-code khóa bí mật) ----------------- */
  GAS_WEBAPP_URL: 'https://script.google.com/macros/s/AKfycbxZJxc-SN6irXS9unXWCd2azV_a4HedOCoB3HDtBXn3d8pPIAGmzYNyneKfWj0H6LGc/exec',        // TODO-INTEGRATION: URL Google Apps Script Web App
  // Telegram: token KHÔNG đặt phía client (Tech Spec §25). Gửi qua GAS server-side.
  TELEGRAM_ENABLED: false,   // TODO-INTEGRATION: bật khi GAS đã cấu hình Telegram

  FB_PIXEL_ID: '',           // TODO-INTEGRATION
  TIKTOK_PIXEL_ID: '',       // TODO-INTEGRATION
  GA4_ID: '',                // TODO-INTEGRATION
  GTM_ID: '',                // TODO-INTEGRATION

  /* --- LOCALE ---------------------------------------------------------------- */
  LOCALE: 'vi-VN',
  CURRENCY_SUFFIX: 'đ',
};
