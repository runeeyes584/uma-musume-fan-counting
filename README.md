# Uma Musume Fan Counting

Ứng dụng Electron để theo dõi và quản lý số lượng fan trong game Uma Musume Pretty Derby.

## 📋 Mô tả

Uma Musume Fan Counting là một ứng dụng desktop được xây dựng để giúp người chơi theo dõi tiến trình tích lũy fan trong game Uma Musume Pretty Derby. Ứng dụng cho phép ghi lại lịch sử các lần chạy đua, quản lý mục tiêu tuần, và theo dõi các thống kê cá nhân.

## ✨ Tính năng

- 📊 Theo dõi tổng số fan, số trận đấu, và số trận thắng
- 🎯 Đặt và theo dõi mục tiêu fan cho mỗi tuần
- 📝 Ghi lại lịch sử các lần chạy với tên Uma Musume và số fan kiếm được
- 📈 Hiển thị tiến độ đạt mục tiêu tuần qua thanh progress bar
- 🗑️ Quản lý lịch sử (xóa các mục không cần thiết)
- ⚙️ Trang cấu hình để quản lý thông tin cá nhân và câu lạc bộ
- 💾 Lưu trữ dữ liệu local với SQLite
- 🔄 Tính năng "New Week" để reset lịch sử và bắt đầu tuần mới

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Desktop Framework**: Electron 39
- **Database**: better-sqlite3
- **UI Icons**: Lucide React
- **Styling**: CSS Variables với dark theme

## 📦 Yêu cầu hệ thống

- Node.js (phiên bản 18 trở lên khuyến nghị)
- npm hoặc yarn
- Hệ điều hành: Windows, macOS, hoặc Linux

## 🚀 Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/runeeyes584/uma-musume-fan-counting.git
cd uma-musume-fan-counting
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Rebuild native modules (cho SQLite)

```bash
npm run rebuild
```

Hoặc nếu gặp lỗi:

```bash
npx electron-rebuild
```

## 🎮 Chạy ứng dụng

### Chế độ Development

Để chạy ứng dụng trong chế độ phát triển:

```bash
npm run dev
```

Lệnh này sẽ:
- Khởi động Vite dev server trên cổng 5173
- Compile TypeScript cho Electron
- Mở ứng dụng Electron với hot reload
- Tự động mở DevTools

### Chế độ Production (Build)

Để build ứng dụng thành file thực thi:

```bash
npm run build
```

Lệnh này sẽ:
- Compile TypeScript frontend và backend
- Build assets với Vite
- Đóng gói ứng dụng Electron
- Tạo file installer trong thư mục `dist` (tùy theo hệ điều hành)

## 📂 Cấu trúc dự án

```
uma-musume-fan-counting/
├── electron/              # Mã nguồn Electron (main process)
│   ├── main.ts           # Entry point của Electron
│   ├── preload.ts        # Preload script để expose API
│   ├── db.ts             # Quản lý database SQLite
│   └── tsconfig.json     # TypeScript config cho Electron
├── src/                  # Mã nguồn React (renderer process)
│   ├── components/       # React components
│   │   ├── Sidebar.tsx   # Thanh sidebar với thống kê
│   │   ├── InfoForm.tsx  # Form nhập thông tin chạy đua
│   │   ├── HistoryTable.tsx  # Bảng lịch sử
│   │   ├── ConfigPage.tsx    # Trang cấu hình
│   │   └── Layout.tsx    # Layout chính
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Root component
│   └── main.tsx          # Entry point của React
├── public/               # Static assets
├── package.json          # Dependencies và scripts
├── vite.config.ts        # Vite configuration
└── README.md             # File này
```

## 💡 Cách sử dụng

### 1. Trang chủ (Home)

- **Nhập thông tin chạy đua**: Điền tên Uma Musume, số fan kiếm được, số trận đấu, và ngày chạy
- **Lưu dữ liệu**: Nhấn nút "Lưu lại" để thêm vào lịch sử
- **Xem lịch sử**: Bảng lịch sử hiển thị tất cả các lần chạy đã ghi lại
- **Theo dõi tiến độ**: Thanh progress bar ở sidebar hiển thị tiến độ đạt mục tiêu tuần

### 2. Trang cấu hình (Config)

- **Thông tin cá nhân**: Cập nhật tên, UID, email, câu lạc bộ
- **Mục tiêu tuần**: Đặt mục tiêu số fan cần đạt trong tuần
- **Quản lý dữ liệu**: 
  - Xóa từng mục trong lịch sử
  - Nhấn "New Week" để bắt đầu tuần mới (reset lịch sử, cập nhật số fan khởi đầu)

### 3. Dữ liệu

- Tất cả dữ liệu được lưu tự động vào database SQLite local
- File database: `database.sqlite` (trong thư mục userData của Electron)
- Dữ liệu bao gồm:
  - Thống kê người dùng (total fan, races, wins, careers, good endings)
  - Lịch sử các lần chạy
  - Cấu hình cá nhân

## 🔧 Scripts có sẵn

```bash
npm run dev          # Chạy development mode
npm run build        # Build ứng dụng production
npm run lint         # Chạy ESLint
npm run preview      # Preview build (chỉ web, không có Electron)
npm run dev:server   # Chỉ chạy Vite dev server
npm run dev:electron # Chỉ chạy Electron (cần dev server chạy trước)
```

## 🐛 Debug và Troubleshooting

### Lỗi SQLite không hoạt động

```bash
npm run rebuild
# hoặc
npx electron-rebuild
```

### Lỗi TypeScript

Đảm bảo tất cả TypeScript config files đúng và chạy:

```bash
npx tsc --noEmit
```

### Ứng dụng không mở

Kiểm tra console log và đảm bảo:
- Vite dev server đang chạy trên port 5173
- Không có process nào khác đang dùng port đó

## 📝 Lưu ý

- Ứng dụng sử dụng dark theme mặc định
- Dữ liệu được lưu trữ local, không đồng bộ cloud
- Backup file `database.sqlite` định kỳ để tránh mất dữ liệu

## 📄 License

Private project - All rights reserved

## 👤 Tác giả

runeeyes584
