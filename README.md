# E-Learning Platform (Bài Tập 02, 04, 05 & 06)

### 👥 Nhóm 08:
| MSSV | Họ và Tên | Nhiệm vụ BT02 | Nhiệm vụ BT03 | Nhiệm vụ BT04 | Nhiệm vụ BT05 | Nhiệm vụ BT06 |
|------|-----------|---------------|---------------|---------------|---------------|---------------|
| 23110285 | NGUYỄN THUẬN PHÚ | Chỉnh sửa Profile | UI Chỉnh sửa Profile | Tìm kiếm & Lọc dữ liệu | Carousel phân trang ngang + hiển thị 10 SP có viewCount cao nhất | |
| 23110296 | VŨ ANH QUỐC | Đăng nhập, Quên mật khẩu | UI Quên mật khẩu | Trang chi tiết khóa học | | |
| 23110359 | VÕ VĂN TÚ | Đăng ký | UI Đăng ký, Đăng nhập | Trang chủ bán khóa học | Khóa học theo danh mục + Infinite Scroll | Giỏ hàng (API + UI) |

Dự án xây dựng nền tảng E-Learning bán khóa học trực tuyến kiểu Udemy, bao gồm Backend API bảo mật và Frontend giao diện hiện đại.

---

## 🚀 Tính năng nổi bật

### Chức năng xác thực (BT02)
- **Đăng ký tài khoản**: Validation + Rate Limiting + OTP kích hoạt qua Email
- **Đăng nhập (Login)**: JWT Token + Phân quyền User/Admin
- **Quên mật khẩu & Đặt lại mật khẩu**: OTP qua Nodemailer
- **Chỉnh sửa hồ sơ cá nhân**: Whitelist field bảo vệ dữ liệu

### Chức năng E-Learning (BT04)
- **Trang chủ bán khóa học**: Hero Banner, danh mục, khuyến mãi, khóa học mới, bán chạy nhất *(Võ Văn Tú)*
- **Trang chi tiết khóa học**: Swiper hình ảnh, thông tin giảng viên, rating, số học viên, khóa học liên quan *(Vũ Anh Quốc)*
- **Tìm kiếm & Lọc**: Lọc theo danh mục, level, khoảng giá + Sắp xếp + Phân trang *(Nguyễn Thuận Phú)*

### Chức năng nâng cao (BT05)
- **Trang khóa học theo danh mục**: Hiển thị tất cả khóa học thuộc 1 danh mục, sử dụng **Infinite Scroll (Lazy Loading)** với IntersectionObserver tự load thêm khi cuộn xuống cuối trang *(Võ Văn Tú)*

### Chức năng Giỏ hàng, Thanh toán (BT06)
- **Giỏ hàng (Cart)**: Thêm/xóa khóa học vào giỏ hàng. Lưu trữ trên Database (MySQL). Mỗi khóa học chỉ thêm 1 lần (unique constraint). Icon giỏ hàng trên Navbar có badge số lượng *(Võ Văn Tú)*
- **Trang giỏ hàng**: Hiển thị danh sách khóa học đã thêm, tóm tắt đơn hàng, nút xóa từng khóa hoặc xóa tất cả
- **Trang chi tiết khóa học**: Nút "Thêm vào giỏ hàng" hoạt động — phản hồi thành công/trùng lặp
- **Thanh toán**: Tích hợp đặt hàng và tạo **Mã VietQR động**: Tự động liên kết STK, Tên ngân hàng, Số tiền của giỏ hàng và Mã đơn hàng độc nhất (`DH...`) để tạo mã QR thanh toán tức thời.
---

## 📡 API Endpoints

### Auth APIs
| Method | Endpoint | Mô tả | Security |
|--------|----------|-------|----------|
| `POST` | `/api/auth/register` | Đăng ký người dùng | Rate Limit + Validation |
| `POST` | `/api/auth/verify-otp` | Xác nhận mã OTP | - |
| `POST` | `/api/auth/resend-otp` | Gửi lại mã OTP | Rate Limit |
| `POST` | `/api/auth/login` | Đăng nhập tài khoản | Rate Limit + Validation |
| `POST` | `/api/auth/forgot-password` | Quên mật khẩu | Rate Limit + Validation |
| `POST` | `/api/auth/reset-password` | Đặt lại mật khẩu | Validation |
| `GET`  | `/api/user/profile`  | Xem hồ sơ người dùng | JWT + Role: User |
| `PUT`  | `/api/user/profile`  | Cập nhật hồ sơ | JWT + Role: User |

### Course & Category APIs (BT04)
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `GET` | `/api/courses` | Danh sách khóa học (filter, search, pagination) | Public |
| `GET` | `/api/courses/featured` | Khóa học nổi bật | Public |
| `GET` | `/api/courses/new-arrivals` | Khóa học mới nhất | Public |
| `GET` | `/api/courses/best-sellers` | Khóa học bán chạy nhất | Public |
| `GET` | `/api/courses/:slug` | Chi tiết khóa học | Public |
| `GET` | `/api/courses/:id/related` | Khóa học tương tự | Public |
| `GET` | `/api/categories` | Danh sách danh mục | Public |

### Course API mới (BT05)
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `GET` | `/api/courses/category/:slug` | Khóa học theo danh mục (phân trang) | Public |
### BT06
- **Cart APIs (Võ Văn Tú)**:
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `GET` | `/api/cart` | Lấy giỏ hàng (include Course info) | JWT |
| `GET` | `/api/cart/count` | Đếm số khóa học trong giỏ | JWT |
| `POST` | `/api/cart` | Thêm khóa học `{ courseId }` | JWT |
| `DELETE` | `/api/cart/:id` | Xóa 1 khóa học khỏi giỏ | JWT |
| `DELETE` | `/api/cart` | Xóa toàn bộ giỏ hàng | JWT |
- **Checkout APIs (Nguyễn Thuận Phú)**:
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `POST` | `/api/orders/create-from-cart` | Đặt hàng từ giỏ hàng & Lấy mã VietQR động | JWT |
| `GET` | `/api/orders/check-status/:orderCode` | Polling kiểm tra trạng thái thanh toán | JWT |
| `POST` | `/api/sepay/webhook` | Webhook đối soát tự động từ ngân hàng | API Key (SePay) |

---

## 🛠 Công nghệ sử dụng

### Backend
- **Runtime**: Node.js, Express.js (v4.x)
- **Database**: MySQL, Sequelize ORM
- **Security**: JWT, bcryptjs, express-validator, express-rate-limit
- **Email**: Nodemailer (SMTP Gmail)
- **Tooling**: Babel (ES6+), Nodemon

### Frontend
- **UI**: React.js (Vite), TailwindCSS v4
- **State**: Redux Toolkit, React Redux
- **HTTP**: Axios (interceptors JWT)
- **Routing**: React Router v7

---

## 📂 Cấu trúc thư mục

```text
BaiTap02_Nhom08/
├── backend/                     # Backend Source (Express + MySQL)
│   ├── src/
│   │   ├── config/              # Cấu hình DB
│   │   ├── controllers/         # Xử lý Request/Response
│   │   ├── middlewares/         # JWT Auth, Role Auth, Validators
│   │   ├── migrations/          # Migration tạo bảng
│   │   ├── models/              # User, Category, Course, CourseImage
│   │   ├── routes/              # API endpoints
│   │   ├── seeders/             # Dữ liệu mẫu (5 danh mục, 48 khóa học)
│   │   ├── services/            # Business Logic
│   │   ├── utils/               # OTP, JWT helpers
│   │   └── server.js            # Entry point
│   ├── .env                     # Biến môi trường
│   └── package.json
│
├── frontend/                    # Frontend Source (React + Vite)
│   └── src/
│       ├── api/                 # Axios config + interceptors
│       ├── components/          # Reusable UI components
│       │   ├── AuthLayout.jsx   # Layout đăng nhập/đăng ký
│       │   ├── Navbar.jsx       # Navigation bar + search
│       │   ├── HeroBanner.jsx   # Banner trang chủ
│       │   ├── CourseCard.jsx   # Card khóa học
│       │   ├── CategoryCard.jsx # Card danh mục
│       │   ├── CourseSection.jsx# Section hiển thị khóa học
│       │   ├── Footer.jsx       # Footer
│       │   ├── FilterSidebar.jsx # Bộ lọc khóa học (BT04)
│       │   ├── Pagination.jsx   # Phân trang kết quả (BT04)
│       │   ├── EmptyState.jsx   # Giao diện trống khi không có kết quả (BT04)
│       │   └── SkeletonCourseCard.jsx # Loading skeleton (BT04)
│       ├── pages/               # Các trang
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── EditProfilePage.jsx
│       │   ├── ForgotPasswordPage.jsx
│       │   ├── HomePage.jsx     # Trang chủ E-Learning
│       │   ├── CoursesPage.jsx  # Trang danh sách khóa học + Lọc (BT04)
│       │   └── CategoryPage.jsx # Khóa học theo danh mục + Infinite Scroll (BT05)
│       ├── store/               # Redux Toolkit
│       │   └── slices/          # authSlice, courseSlice, cartSlice
│       └── services/            # API service layer
│           └── cartService.js       # [BT06] API giỏ hàng
│
├── .gitignore
└── README.md
```

---

## ⚙️ Cài đặt & Chạy ứng dụng

### 1. Chuẩn bị Database
```sql
CREATE DATABASE elearning_baitap02;
```

### 2. Cấu hình biến môi trường
Tạo file `.env` tại thư mục `backend/`:
```env
PORT=8089
NODE_ENV=development
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
JWT_SECRET=your_secret_key_here
OTP_EXPIRE_MINUTES=5
SEPAY_WEBHOOK_TOKEN=your_sepay_webhook_token_here
BANK_ACCOUNT=your_bank_account
BANK_NAME=your_bank_name
ACCOUNT_NAME=YOUR_FULL_NAME
```

### 3. Cài đặt & Chạy Backend
```bash
cd backend
npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm start
```
*Backend chạy tại `http://localhost:8089`*

### 4. Cài đặt & Chạy Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend chạy tại `http://localhost:5173`*

---

## 🔒 Bảo mật (Security)

- **Lớp 1 (Rate Limiting)**: Giới hạn request chống Brute-force & DDoS
- **Lớp 2 (Authentication)**: JWT Token xác thực phiên làm việc
- **Lớp 3 (Validation)**: Kiểm tra dữ liệu đầu vào bằng express-validator
- **Lớp 4 (Authorization)**: Phân quyền User/Admin truy cập tài nguyên

---

## 🧪 Testing

- File **`postman_collection.json`** — Import vào Postman để test Auth APIs
- Seed data tạo sẵn **5 danh mục** và **48 khóa học** để demo giao diện
---
 
*Dự án được thực hiện bởi Nhóm 08 — Bài Tập 02, 04, 05 & 06*
