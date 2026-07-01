# Aethera - E-Learning Platform

Aethera là một nền tảng học trực tuyến (E-Learning) hiện đại, hỗ trợ nhiều tính năng tiên tiến bao gồm học tập qua video, tương tác thời gian thực, tích hợp AI (Google Generative AI) và đa ngôn ngữ.

Dự án được chia thành hai phần chính:
- **Frontend:** Xây dựng giao diện người dùng với React, Vite, và Tailwind CSS.
- **Backend:** Cung cấp RESTful API với Node.js, Express, và cơ sở dữ liệu MySQL sử dụng Sequelize ORM.

## 🚀 Các tính năng chính (Dự kiến dựa trên công nghệ tích hợp)
- **Xác thực & Bảo mật:** Đăng nhập, đăng ký, OTP qua Email (Nodemailer), mã hóa mật khẩu (Bcrypt), và JSON Web Tokens (JWT). Tích hợp Google OAuth.
- **Hỗ trợ đa ngôn ngữ:** Dịch thuật động với Google Translate API (en/vi).
- **Trí tuệ nhân tạo (AI):** Tích hợp Google Generative AI để hỗ trợ học tập hoặc tạo nội dung.
- **Thời gian thực (Real-time):** Tích hợp Socket.io cho các tính năng thời gian thực như trò chuyện hoặc thông báo.
- **Lưu trữ đám mây:** Tích hợp Cloudinary để lưu trữ ảnh/video và upload với Multer.
- **Quản lý trạng thái phức tạp:** Sử dụng Redux Toolkit trên Frontend.
- **Giao diện hiện đại, mượt mà:** Xây dựng với Tailwind CSS và Framer Motion cho các hiệu ứng chuyển động.

## 🛠 Tech Stack

### Frontend
- **Framework:** React 19, Vite
- **Styling:** Tailwind CSS, Framer Motion
- **State Management:** Redux Toolkit, React-Redux
- **Routing:** React Router DOM
- **Khác:** Axios, Socket.io-client, Recharts (biểu đồ), Lucide React (icon), React Player.

### Backend
- **Môi trường:** Node.js, Express.js
- **Cơ sở dữ liệu:** MySQL, Sequelize ORM (có hỗ trợ cấu hình Prisma)
- **Bảo mật:** JWT, Bcryptjs, Express Rate Limit, Express Validator
- **Dịch vụ bên thứ ba:** Cloudinary, Nodemailer, Google Auth Library, Google Generative AI.

## 📋 Yêu cầu hệ thống (Prerequisites)
- [Node.js](https://nodejs.org/) (phiên bản 18+ khuyến nghị)
- [MySQL](https://www.mysql.com/) Server đang chạy.

## ⚙️ Cài đặt & Chạy dự án

### 1. Clone hoặc tải mã nguồn
Mở terminal và di chuyển vào thư mục dự án:
```bash
cd Aethera
```

### 2. Cài đặt Backend
```bash
cd backend
npm install
```
**Cấu hình môi trường Backend:**
- Copy file `.env.example` thành `.env` (hoặc tạo file `.env` mới trong thư mục `backend`).
- Cập nhật các thông tin kết nối Database, Email, JWT, và các API keys khác:
```env
PORT=8089
NODE_ENV=development

# Email config (Nodemailer - Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# JWT Secret
JWT_SECRET=your_jwt_secret_key
OTP_EXPIRE_MINUTES=5

# MySQL Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=aethera_db
DB_PORT=3306
```

**Khởi tạo Database & Chạy Server:**
```bash
# Chạy migrations / seed (nếu có)
npm run seed

# Khởi động server (Development mode)
npm run dev
```
Backend sẽ chạy tại `http://localhost:8089` (hoặc port bạn đã cấu hình).

### 3. Cài đặt Frontend
Mở một terminal mới:
```bash
cd Aethera/frontend
npm install
```
**Cấu hình môi trường Frontend:**
- Tạo file `.env` nếu cần thiết (tùy thuộc vào thiết lập các biến môi trường Vite, thường bắt đầu bằng `VITE_`).

**Chạy Frontend Server:**
```bash
npm run dev
```
Giao diện sẽ chạy tại `http://localhost:5173` (hoặc địa chỉ Vite cung cấp).

## 📁 Cấu trúc thư mục

```
Aethera/
├── backend/               # Mã nguồn API Server (Node.js/Express)
│   ├── src/               # Code chính của backend
│   ├── api-test/          # Các file test API
│   ├── public/            # Static assets
│   ├── package.json       # Dependencies backend
│   └── .env               # Biến môi trường backend
│
├── frontend/              # Mã nguồn Giao diện (React/Vite)
│   ├── src/               # Components, pages, redux slices, etc.
│   ├── public/            # Static assets frontend
│   ├── index.html         # Entry HTML
│   ├── package.json       # Dependencies frontend
│   └── tailwind.config.js # Cấu hình TailwindCSS
│


└── bao-cao/               # Tài liệu báo cáo dự án
```

## 🖼️ Danh sách các tính năng và Giao diện (UI)

Dưới đây là tổng hợp các tính năng chính của hệ thống:

### 1. Đăng nhập / Đăng ký & Xác thực OTP

- Hỗ trợ đăng nhập truyền thống và Google OAuth.
- Xác thực email qua mã OTP.

<img width="1566" height="838" alt="image" src="https://github.com/user-attachments/assets/25039071-0069-464d-a4a2-d9b2930a5dff" />

### 2. Trang chủ & Khám phá khóa học

- Hiển thị danh sách khóa học nổi bật, phân loại theo danh mục.
  
<img width="1288" height="961" alt="image" src="https://github.com/user-attachments/assets/1034ccb8-b864-4993-b753-2efeb431b7dd" />
  
<img width="1304" height="954" alt="image" src="https://github.com/user-attachments/assets/23afb8cd-5b55-4e0a-a952-0bff46a537ec" />

<img width="1282" height="898" alt="image" src="https://github.com/user-attachments/assets/b8c8536b-84fd-4e7d-bb1f-e207f447b25c" />

<img width="1210" height="921" alt="image" src="https://github.com/user-attachments/assets/cadbb682-9b96-460c-a6f9-623d4c911493" />


### 3. Chi tiết khóa học & Trình phát Video

- Xem thông tin khóa học, lộ trình học và danh sách bài giảng.
- Học tập qua video tương tác.

<img width="1854" height="976" alt="image" src="https://github.com/user-attachments/assets/ce5218fd-1e5e-4a13-935e-db6ebc8d91f6" />

### 4. Trợ lý học tập AI (Generative AI)

- Trợ lý ảo hỗ trợ giải đáp thắc mắc bài học dựa trên Google Generative AI.

<img width="856" height="928" alt="image" src="https://github.com/user-attachments/assets/1bec476c-36db-4036-9b1c-06a387314e81" />


### 5. Tương tác & Thông báo

- Nhận thông báo mới

<img width="1317" height="634" alt="image" src="https://github.com/user-attachments/assets/7ac4ebf8-9bc2-44ab-bbea-6db564fb3aef" />

<img width="1424" height="788" alt="image" src="https://github.com/user-attachments/assets/2c14477b-e23f-415d-b58b-8ef787d9af77" />

