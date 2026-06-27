# Landing Page — Cà Gai Leo Xạ Đen Nguyên Chất SADU

Landing Page bán hàng chuyển đổi cao, xây bằng **HTML5 + CSS3 + JavaScript ES6 thuần**
(không framework — theo Technical Specification). Tuân thủ PRD, UI Spec, Design System,
Component Spec, Motion Spec, Technical Spec V1.0.

> **Trạng thái:** Sprint 4 hoàn tất (Offer, Guarantee, FAQ, Smart Order Form, Footer, Floating CTA, Exit Popup, Back-to-top).
> Sprint 1–3 đã được giữ nguyên theo handover; Sprint 4 đã QA desktop/mobile và logic giá.

---

## 1. Cấu trúc dự án

```
/
├── index.html              # Trang chính (semantic, đủ 19 section theo thứ tự)
├── css/
│   ├── reset.css           # Reset + reduced-motion
│   ├── variables.css       # DESIGN TOKENS (màu, type, spacing, radius, shadow, breakpoint)
│   ├── layout.css          # Container, grid, section rhythm, typography utilities
│   ├── components.css      # Button, badge, card, icon, media-placeholder
│   ├── animation.css       # Scroll reveal, hero sequence (opacity/transform)
│   └── style.css           # Style theo từng section
├── js/
│   ├── config.js           # ⭐ SINGLE SOURCE OF TRUTH (giá, hotline, URL, pixel)
│   ├── utils.js            # format tiền VN, validate SĐT, throttle, tracking
│   ├── animation.js        # IntersectionObserver reveal + header scroll state
│   ├── form.js             # Smart Order Form + price/shipping/validation logic
│   ├── gallery.js          # Gallery + lightbox (stub → Sprint 3)
│   └── app.js              # Entry point, khởi tạo module
├── images/                 # (TODO) ảnh thật SADU — WebP
├── icons/                  # (TODO) bộ icon SVG bổ sung nếu cần
├── videos/                 # (TODO) video self-hosted
├── fonts/                  # (tùy chọn) self-host font nếu không dùng Google Fonts
└── README.md
```

---

## 2. Cách cấu hình

Mở **`js/config.js`** — mọi giá trị dễ thay đổi nằm ở đây, **không sửa rải rác**:

| Nhóm | Khóa | Ghi chú |
|------|------|---------|
| Giá | `UNIT_PRICE`, `DEAL_MIN_QTY`, `DEAL_UNIT_PRICE` | Logic giá đã chốt (xem §4) |
| Ship | `FREE_SHIP_THRESHOLD`, `SHIPPING_FEE` | 250.000 → free; dưới → 30.000 |
| Số lượng | `QTY_MIN`, `QTY_MAX`, `QTY_DEFAULT` | Mặc định 4 (đẩy combo có freeship) |
| Liên hệ | `HOTLINE`, `COMPANY_*`, `WEBSITE`, `FANPAGE`, `EMAIL` | **TODO-CONFIG** |
| Tích hợp | `GAS_WEBAPP_URL`, `FB_PIXEL_ID`, `TIKTOK_PIXEL_ID`, `GA4_ID`, `GTM_ID` | **TODO-INTEGRATION** |

Hotline tự đổ vào DOM qua thuộc tính `data-bind="hotline"` / `data-bind="hotline-href"`.

---

## 3. Cách thay nội dung & ảnh

- **Copy (câu chữ):** sửa trực tiếp trong `index.html`. Các đoạn còn thiếu được đánh dấu
  `TODO-COPY` (sẽ bổ sung theo nội dung chính thức, không tự sáng tác).
- **Ảnh / video:** hiện dùng khối `.media-placeholder` (có nhãn "TODO" góc phải).
  Thay bằng `<picture>` WebP + fallback, kèm `width`/`height` để tránh CLS:
  ```html
  <picture>
    <source srcset="images/hero.webp" type="image/webp">
    <img src="images/hero.jpg" width="800" height="1000" alt="Cà Gai Leo Xạ Đen SADU" loading="lazy">
  </picture>
  ```
  Hero **không** lazy-load (Tech Spec §22). Ảnh ngoài Hero dùng `loading="lazy"`.

---

## 4. Logic giá (đã chốt — Quyết định #6)

```
unit       = 109.000
dealUnit   = quantity >= 2 ? 99.000 : 109.000
total      = quantity × dealUnit
discount   = quantity × 109.000 − total
ship       = total ≥ 250.000 ? 0 : 30.000
```

Đã kiểm chứng: 1→109k + ship · 2→198k + ship · 3→297k freeship · 4→396k freeship.

---

## 5. Tích hợp đặt hàng (Sprint 4–5)

- Form gửi tới **Google Apps Script** Web App → đặt URL vào `config.GAS_WEBAPP_URL`.
- **Telegram:** gọi từ phía GAS (server-side). KHÔNG để token trong JS trình duyệt (Tech Spec §25).
- **Pixel/GA4/GTM:** nạp qua GTM; event chuẩn hóa qua `SADU.utils.track()` → `dataLayer`.

---

## 6. Triển khai (Vercel / hosting tĩnh)

Đây là site tĩnh — deploy thẳng thư mục gốc:

- **Vercel:** `vercel` (hoặc kéo-thả thư mục trên dashboard). Không cần build step.
- **Hosting tĩnh / CDN:** upload toàn bộ thư mục, đảm bảo `index.html` ở gốc.
- Bật nén (gzip/brotli) và cache `css/`, `js/`, `images/`.

---

## 7. Development Notes (theo Tech Spec §31)

- Header: trong suốt trên Hero → trắng + shadow khi cuộn (Quyết định #1).
- Big Idea là section độc lập (Quyết định #2).
- Announcement/Header/Floating CTA/Popup/Back-to-top = UI component, **không** tính là section.
- Không dùng Breadcrumb UI/Schema (Quyết định #5).
- Breakpoint: 0–767 / 768–1023 / 1024–1439 / 1440–1919 / ≥1920 (Quyết định #9).
- Mọi asset hình/video/logo/review hiện là placeholder + TODO (Quyết định #8).

### TODO tổng hợp
`TODO-IMG` ảnh/video · `TODO-COPY` nội dung chưa có copy chính thức · `TODO-CONFIG` liên hệ ·
`TODO-INTEGRATION` GAS/Telegram/Pixel/GA4/GTM · `TODO-SCHEMA` JSON-LD · `TODO-LEGAL` chính sách/điều khoản.

### Visual Direction Specification V1.0 (đã áp dụng)
- Phong cách Organic Premium / Natural Luxury / Modern Minimal; nhiều white-space.
- Ảnh: ưu tiên ảnh thật, không AI giả, không watermark → hiện dùng placeholder `TODO-IMG`.
- Icon: line-style, nét đồng nhất, `currentColor`, không icon nhiều màu.
- CTA chính KHÔNG dùng màu đỏ (đang dùng Primary xanh `#2E7D32`); đỏ chỉ cho lỗi form.
- Card nổi trên nền, viền mảnh, shadow nhẹ (DS Medium); hover dùng shadow mạnh hơn theo DS §12.
- Gallery (§18) giữ ĐÚNG thứ tự kể chuyện: Vùng trồng → Chăm sóc → Thu hoạch → Sơ chế → Đóng gói → Thành phẩm → Khách hàng sử dụng.
- Video (§19) documentary, self-hosted, không autoplay tiếng, có thumbnail + nút Play lớn.
- Review (§17): ảnh thật / video review hiển thị trước; tránh avatar hoạt hình → placeholder.
- Lưu ý token: Visual §13 gợi ý nền "xanh lá rất nhạt" nhưng Design System chỉ định nghĩa alt-bg `#F8F8F6`; theo DS §28 (không tạo style mới) nên giữ trắng / `#F8F8F6`. Cần xác nhận nếu muốn thêm token nền xanh nhạt.

### Tiến độ
- Sprint 1 ✅ Foundation + Chrome + Hero + Trust Bar
- Sprint 2 ✅ Pain Point (5) · Big Idea · Farm Story · USP (7, 4+3) · Production Process (7 bước)
- Sprint 3 ✅ Gallery + Lightbox · Video · Certification · Comparison (bảng/card) · Benefits · Usage (4 bước) · Reviews + Number Counter
- Sprint 4 ✅ Offer · Guarantee · FAQ · Smart Order Form · Footer · Floating CTA · Exit Popup · Back-to-top
- Sprint 5 ⏳ Integrations · SEO/Schema · production content/assets · legal/config finalize
