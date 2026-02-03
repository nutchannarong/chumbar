# Mug Craft - T10 Beer Tap Display

โปรเจค Vue.js สำหรับแสดงข้อมูล Beer Tap แบบ T10 (2 แถว, แถวละ 5 taps) - ออกแบบมาเป็น Fullscreen Kiosk Display

## 🚀 Features

- ✨ แสดงข้อมูล Beer Taps แบบ Real-time
- 🔄 Auto-refresh ทุก 5 นาที (สามารถปิด/เปิดได้)
- 📱 Responsive Design (Desktop, Tablet, Mobile)
- 🎨 Modern UI with animations and gradient effects
- 🌐 ดึงข้อมูลจาก Google Apps Script API
- 💰 รองรับ 2 โหมด: แสดงราคา และ ซ่อนราคา
- 🖼️ รองรับรูปภาพจาก Google Drive (หลาย URL format)
- ☁️ Deploy ได้บน Vercel

## � Display Modes

### โหมดปกติ (แสดงราคา)
- URL: `https://mug-craft.vercel.app/`
- แสดงข้อมูลเบียร์พร้อมราคา 2-3 ขนาด

### โหมด Show (ซ่อนราคา)
- URL: `https://mug-craft.vercel.app/show`
- แสดงข้อมูลเบียร์โดยไม่แสดงราคา
- เหมาะสำหรับหน้าจอโชว์ในงานอีเวนท์

## �🛠️ Tech Stack

- **Vue 3** - Composition API
- **Vite 5** - Build tool & Dev server
- **Axios** - HTTP client
- **CSS3** - Styling & Animations
- **Google Apps Script** - Backend API
- **Vercel** - Hosting & Deployment

## 📦 Installation

```bash
npm install
```

## 🏃 Development

```bash
npm run dev
```

เปิด browser ที่ `http://localhost:3000`

### ทดสอบโหมดต่างๆ ใน Local

- แสดงราคา: `http://localhost:3000`
- ซ่อนราคา: `http://localhost:3000/show`

## 🔨 Build

```bash
npm run build
```

ไฟล์ที่ build แล้วจะอยู่ในโฟลเดอร์ `dist/`

### Preview Production Build

```bash
npm run preview
```

## 📤 Deploy to Vercel

### วิธีที่ 1: Deploy ผ่าน Vercel CLI

```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

### วิธีที่ 2: Deploy ผ่าน GitHub (แนะนำ)

1. Push code ขึ้น GitHub repository
2. เข้า [Vercel Dashboard](https://vercel.com)
3. คลิก "Import Project"
4. เลือก repository
5. ตั้งค่าจะถูกอ่านจาก `vercel.json` อัตโนมัติ
6. คลิก "Deploy"

**Vercel จะใช้การตั้งค่าจาก `vercel.json`:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Rewrites: `/show` → `/index.html`

## 📁 Project Structure

```
mugcraft-vue/
├── .github/
│   └── copilot-instructions.md  # AI Coding Assistant instructions
├── src/
│   ├── components/
│   │   └── TapCard.vue          # Component แสดง tap card (รองรับ hidePrice prop)
│   ├── services/
│   │   └── tapService.js        # Service ดึงข้อมูลจาก API + filter logic
│   ├── App.vue                  # Main component + routing logic
│   ├── main.js                  # Entry point
│   └── style.css                # Global styles & background
├── public/                      # Static assets
├── index.html                   # HTML template
├── vite.config.js              # Vite config (port 3000, host: true)
├── package.json                # Dependencies
├── vercel.json                 # Vercel config (rewrites for /show)
└── README.md                   # Documentation
```

## 🔧 Configuration

### API Endpoint

แก้ไข URL ของ API ได้ที่ `src/services/tapService.js`:

```javascript
const API_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
```

### Auto-refresh Interval

แก้ไขเวลา auto-refresh ได้ที่ `src/App.vue` (ปัจจุบันถูก comment ไว้):

```javascript
// ปิดอยู่: uncomment เพื่อเปิดใช้งาน
const setupAutoRefresh = () => {
  setInterval(() => {
    loadTaps()
  }, 5 * 60 * 1000) // 5 minutes
}
```

### Display Mode Detection

ระบบตรวจสอบโหมดจาก URL path ใน `src/App.vue`:

```javascript
const hidePrice = computed(() => {
  return window.location.pathname === '/show'
})
```

## 🎨 UI Customization

สามารถปรับแต่ง CSS ได้ที่:
- `src/style.css` - Global styles, background, fonts
- `src/App.vue` - Grid layout, loading/error states
- `src/components/TapCard.vue` - Card design, animations, responsive styles

### การปรับแต่ง TapCard

- TAP Number ribbon: ปรับ gradient และ rotation
- Beer image: ปรับ aspect-ratio, object-fit
- Price grid: รองรับ 2-3 columns (ขึ้นอยู่กับ cost_big)
- Responsive breakpoints: มีหลาย breakpoint สำหรับ iPad และ Mobile

## 📱 Responsive Breakpoints

### Desktop
- **> 1920px**: Full HD - แสดงเต็มรูปแบบ
- **1600px - 1919px**: ปรับขนาดภาพและ font
- **1400px - 1599px**: ปรับขนาดให้เหมาะสม

### Tablet
- **1024px - 1200px**: iPad Pro Landscape - ขนาดใหญ่เหมาะกับ tablet
- **769px - 1023px**: iPad Landscape - ปรับ font และ spacing
- **481px - 768px**: iPad Portrait - แสดง 3 columns, ซ่อน row 2

### Mobile
- **≤ 480px**: Single column layout (1 tap per row)
- แสดงทั้ง 2 rows แบบ scroll ได้
- Card ยืดตามความสูงของรูป (aspect-ratio: 1)
- รูปภาพใช้ object-fit: contain

### Height-based (Landscape)
- **≤ 800px, ≤ 700px, ≤ 600px**: ปรับขนาดตาม viewport height

## 🔌 API Response Format

API ต้อง return ข้อมูลในรูปแบบ Array:

```json
[
  {
    "col": "1",
    "name": "Singha",
    "detail": "Lager",
    "nation": "th",
    "image": "1abc...xyz",
    "cost_small": "100",
    "cost": "150",
    "cost_big": "200",
    "value_small": "฿100",
    "value": "฿150",
    "value_big": "฿200",
    "volume_small": "330ml",
    "volume": "500ml",
    "volume_big": "750ml",
    "is_active": "1"
  }
]
```

### ค่า field ที่สำคัญ:
- `col`: "1"-"10" (ตำแหน่ง tap)
- `is_active`: "1" (active), "0" (inactive)
- `image`: Google Drive file ID หรือ URL เต็ม
- ราคาเป็น string เช่น "150" (ไม่ใช่ number)

### API Response Format ที่รองรับ

`tapService.js` รองรับหลาย response format:
```javascript
// Format 1: { data: [...] }
// Format 2: { taplist: [...] }
// Format 3: { result: [...] }
// Format 4: { taps: [...] }
// Format 5: [...] (Array โดยตรง)
```

## 🖼️ Image Handling

### Google Drive Image Formats

TapCard รองรับหลาย format:
- **File ID**: `1abc...xyz` → แปลงเป็น thumbnail URL
- **Drive URL**: `https://drive.google.com/file/d/ID/view`
- **Docs URL**: `https://docs.google.com/uc?id=ID`
- **Direct URL**: URL ใดๆ ที่ขึ้นต้นด้วย `http://` หรือ `https://`

### Image Retry Logic

ถ้ารูปโหลดไม่ได้ ระบบจะลอง URL format อื่นๆ อัตโนมัติ:
1. `thumbnail?id=...&sz=w1000`
2. `uc?export=view&id=...`
3. `uc?export=download&id=...`
4. `uc?id=...`
5. Placeholder SVG (หากทุก format ล้มเหลว)

## 🌍 Environment Variables (Optional)

สามารถใช้ environment variables ได้โดยสร้างไฟล์ `.env`:

```env
VITE_API_URL=https://script.google.com/macros/s/.../exec
```

แล้วเรียกใช้ใน code:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'fallback_url'
```

## 📝 Important Notes

### Layout Logic
- **Row 1**: cols 1-5 (filter ใน `tapService.filterTapsForRow`)
- **Row 2**: cols 6-10
- Mobile (≤480px): แสดงทั้ง 2 rows แบบ single column
- Tablet (481-768px): แสดงแค่ row 1 เป็น 3 columns

### Data Assumptions
- ทุก field เป็น **string** (ไม่ใช่ number)
- `is_active === '1'` เท่านั้นที่จะแสดง
- ราคา "0" จะไม่แสดงในการ์ด

### Performance
- Auto-refresh ถูกปิดไว้ (comment) เพื่อลด API calls
- Vite dev server: host: true, port: 3000
- Production build: minify: esbuild (ไม่ใช้ terser)

## 🐛 Troubleshooting

### ปัญหา: CORS Error
- ตรวจสอบว่า Google Apps Script เปิด CORS
- Apps Script ต้อง return:
  ```javascript
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
  ```

### ปัญหา: ข้อมูลไม่แสดง
- เช็ค Console (`F12`) ดู error
- ตรวจสอบ API response format
- ตรวจสอบว่า `is_active === '1'`

### ปัญหา: /show ไม่ทำงานบน Vercel
- ตรวจสอบ `vercel.json` มี rewrites สำหรับ `/show`
- Redeploy project ใหม่หลังแก้ไข `vercel.json`

### ปัญหา: Build Error (terser not found)
- ปรับ `vite.config.js`:
  ```javascript
  build: {
    minify: 'esbuild' // แทน 'terser'
  }
  ```

### ปัญหา: รูปภาพไม่แสดง
- ตรวจสอบว่ารูปใน Google Drive เปิด public sharing
- ตรวจสอบ Console ดู retry attempts
- ลอง copy file ID แล้วเปิดใน browser: `https://drive.google.com/thumbnail?id=ID&sz=w1000`

## 🔍 Key Files to Understand

- **`src/services/tapService.js`**: API integration + response normalization
- **`src/App.vue`**: Main layout + hidePrice logic
- **`src/components/TapCard.vue`**: Card component + image retry + responsive styles
- **`vercel.json`**: Deployment config + /show rewrite
- **`.github/copilot-instructions.md`**: Guide for AI coding assistants

## 📄 License

MIT License

## 👨‍💻 Author

Mug Craft Team

---

🍺 **Live Demo**: [https://mug-craft.vercel.app](https://mug-craft.vercel.app)

สำหรับข้อมูลเพิ่มเติม กรุณาติดต่อ: [info@mugcraft.com](mailto:info@mugcraft.com)
