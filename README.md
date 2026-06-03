# E-Learning Platform (Bài Tập 02, 04, 05, 06, 07 & 08)

### 👥 Nhóm 08:
| MSSV | Họ và Tên | Nhiệm vụ BT02 | Nhiệm vụ BT03 | Nhiệm vụ BT04 | Nhiệm vụ BT05 | Nhiệm vụ BT06 | Nhiệm vụ BT07 | Nhiệm vụ BT08 |
|------|-----------|---------------|---------------|---------------|---------------|---------------|---------------|---------------|
| 23110285 | NGUYỄN THUẬN PHÚ | Chỉnh sửa Profile | UI Chỉnh sửa Profile | Tìm kiếm & Lọc dữ liệu | Carousel phân trang ngang + hiển thị 10 SP có viewCount cao nhất | | Mã giảm giá (Coupon), Thanh toán bằng Điểm tích lũy & Luồng tự động duyệt đơn 0đ | Quản lý Khóa học & Nội dung (API + UI) |
| 23110296 | VŨ ANH QUỐC | Đăng nhập, Quên mật khẩu | UI Quên mật khẩu | Trang chi tiết khóa học | Danh mục sản phẩm | Lịch sử mua hàng | Yêu thích, SP tương tự | |
| 23110359 | VÕ VĂN TÚ | Đăng ký | UI Đăng ký, Đăng nhập | Trang chủ bán khóa học | Khóa học theo danh mục + Infinite Scroll | Giỏ hàng (API + UI) | Đánh giá & Loyalty Points (API + UI) + Tự động Đăng xuất & Đồng bộ Profile | Thông báo Real-time (WebSocket + Email) (API + UI) |

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

### Chức năng Đánh giá & Loyalty Points (BT07)
- **Đánh giá & Bình luận khóa học**: Người dùng đánh giá (số sao + nội dung bình luận) cho các khóa học đã mua thành công. Giới hạn đánh giá duy nhất 1 lần/khóa học, không cho phép sửa đổi hay đính kèm hình ảnh để giữ tính khách quan. Tự động tính toán điểm rating trung bình của khóa học *(Võ Văn Tú)*
- **Tích lũy & Sử dụng điểm (Loyalty Points)**: Nhận 10 điểm tích lũy sau mỗi lần đánh giá thành công (1 điểm = 1.000 VNĐ). Người dùng có thể xem số dư điểm và lịch sử biến động điểm trong trang "Thưởng". Hỗ trợ áp dụng điểm tích lũy để giảm giá trực tiếp trong trang giỏ hàng khi thanh toán *(Võ Văn Tú)*
- **Mã giảm giá (Coupon)**: Hỗ trợ tạo và áp dụng mã giảm giá (giảm theo % hoặc số tiền cố định, giới hạn lượt dùng và ngày hết hạn). Người dùng có thể nhập mã giảm giá tại trang giỏ hàng để trừ tiền trực tiếp vào hóa đơn. *(Nguyễn Thuận Phú)*
- **Thanh toán tự động đơn 0 VNĐ**: Khi tổng thanh toán (sau khi áp dụng mã giảm giá và điểm tích lũy) giảm xuống còn 0 VNĐ, hệ thống tự động hoàn tất đơn hàng mà không cần chuyển hướng sang cổng thanh toán. Khóa học lập tức được thêm vào tài khoản. *(Nguyễn Thuận Phú)*

### Chức năng Thông báo Real-time & Email (BT08)
- **Thông báo Real-time (WebSocket/Socket.IO)**: Tự động gửi thông báo trực tiếp mà không cần reload trang cho các hoạt động chính của hệ thống bao gồm: Tạo đơn hàng mới, thanh toán thành công và đánh giá khóa học. *(Võ Văn Tú)*
- **Gửi Email tự động**: Gửi email hóa đơn chi tiết cho người dùng bằng Nodemailer khi nhận phản hồi thanh toán thành công từ SePay Webhook. *(Võ Văn Tú)*
- **Chuông thông báo (Notification Bell)**: Tích hợp biểu tượng chuông hiển thị badge đếm thông báo chưa đọc, dropdown xem nhanh và popup Toast góc màn hình nhận tin tức thời. *(Võ Văn Tú)*
- **Trang quản lý thông báo (/user/notifications)**: Trang lưu trữ lịch sử thông báo đầy đủ hỗ trợ phân trang, lọc trạng thái (Tất cả/Chưa đọc) và đánh dấu đã đọc. *(Võ Văn Tú)*

### Quản lý Nội dung Khóa học & Trải nghiệm Học tập (BT08)
- **Quản lý Chương & Bài học**: Xây dựng giao diện trực quan cho phép Giảng viên/Admin dễ dàng tạo mới, sắp xếp và xóa các Chương học (Modules) cũng như các Bài học (Lessons) bên trong. *(Nguyễn Thuận Phú)*
- **Tích hợp tải lên Video (Cloudinary)**: Cho phép tải trực tiếp video bài giảng lên hệ thống lưu trữ Cloudinary với thanh tiến trình. *(Nguyễn Thuận Phú)*
- **Giao diện Phòng học (Learning Space)**: Xây dựng màn hình xem video bài giảng tự động luân chuyển giữa nội dung Video/Văn bản tùy thuộc vào loại bài học. *(Nguyễn Thuận Phú)*


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

### BT07: Đánh giá & Loyalty Points APIs (Võ Văn Tú)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `POST` | `/api/reviews` | Gửi đánh giá cho khóa học đã mua | JWT |
| `GET` | `/api/reviews/course/:courseId` | Danh sách đánh giá của khóa học (phân trang) | Public |
| `GET` | `/api/reviews/my-reviews` | Lấy danh sách đánh giá của chính mình | JWT |
| `GET` | `/api/reviews/can-review/:courseId` | Kiểm tra quyền đánh giá khóa học | JWT |
| `GET` | `/api/rewards/loyalty-points` | Lấy lịch sử biến động điểm tích lũy | JWT |
| `GET` | `/api/rewards/summary` | Lấy tóm tắt điểm và số lượng đánh giá | JWT |


### BT08
- **: Notification APIs (Võ Văn Tú)**

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `GET` | `/api/notifications` | Lấy danh sách thông báo của user (phân trang) | JWT |
| `GET` | `/api/notifications/unread-count` | Lấy số lượng thông báo chưa đọc | JWT |
| `PUT` | `/api/notifications/:id/read` | Đánh dấu một thông báo đã đọc | JWT |
| `PUT` | `/api/notifications/read-all` | Đánh dấu tất cả thông báo đã đọc | JWT |

---
- **BT08: Quản lý Khóa học & Nội dung (Nguyễn Thuận Phú)**

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `POST` | `/api/courses` | Khởi tạo khóa học mới (bản nháp) | JWT (Admin/Giảng viên) |
| `PUT` | `/api/courses/:id/publish` | Xuất bản khóa học | JWT (Admin/Giảng viên) |
| `GET` | `/api/courses/:slug/check-enrollment` | Kiểm tra quyền truy cập khóa học (Bảo vệ nội dung) | JWT |
| `POST` | `/api/sections` | Tạo chương học mới | JWT (Admin/Giảng viên) |
| `GET` | `/api/sections` | Lấy danh sách chương học | Public |
| `POST` | `/api/lessons` | Tạo bài học mới (Video/Text) | JWT (Admin/Giảng viên) |
| `GET` | `/api/lessons` | Lấy danh sách bài học | Public |
| `DELETE` | `/api/lessons/:id` | Xóa bài học | JWT (Admin/Giảng viên) |

## 🛠 Công nghệ sử dụng

### Backend
- **Runtime**: Node.js, Express.js (v4.x)
- **Database**: MySQL, Sequelize ORM
- **Real-time**: Socket.IO (v4.x)
- **Security**: JWT, bcryptjs, express-validator, express-rate-limit
- **Email**: Nodemailer (SMTP Gmail)
- **Tooling**: Babel (ES6+), Nodemon

### Frontend
- **UI**: React.js (Vite), TailwindCSS v4
- **State**: Redux Toolkit, React Redux
- **Real-time**: Socket.IO Client (v4.x)
- **HTTP**: Axios (interceptors JWT)
- **Routing**: React Router v7

---

## 📂 Cấu trúc thư mục

```text
BaiTap02_Nhom08/
├── backend/                     # Backend Source (Express + MySQL)
│   ├── src/
│   │   ├── config/              # Cấu hình DB
│   │   ├── controllers/         # Xử lý Request/Response (reviewController, notificationController, ...)
│   │   ├── middlewares/         # JWT Auth, Role Auth, Validators
│   │   ├── migrations/          # Migration tạo bảng (add loyaltyPoints to Users, reviews, notifications)
│   │   ├── models/              # User, Category, Course, Review, LoyaltyPoint, Notification
│   │   ├── routes/              # API endpoints (reviewRoutes, notificationRoutes, ...)
│   │   ├── seeders/             # Dữ liệu mẫu (5 danh mục, 48 khóa học)
│   │   ├── services/            # Business Logic (reviewService, notificationService, orderService, ...)
│   │   ├── utils/               # OTP, JWT helpers
│   │   ├── socketManager.js     # Khởi tạo & quản lý kết nối Socket.IO
│   │   └── server.js            # Entry point (HTTP + Socket.IO server)
│   ├── .env                     # Biến môi trường
│   └── package.json
│
├── frontend/                    # Frontend Source (React + Vite)
│   └── src/
│       ├── api/                 # Axios config + socketClient.js (Socket.IO client)
│       ├── components/          # Reusable UI components
│       │   ├── AuthLayout.jsx   # Layout đăng nhập/đăng ký
│       │   ├── Navbar.jsx       # Navigation bar + search
│       │   ├── NotificationBell.jsx # [BT08] Biểu tượng chuông thông báo, dropdown + toast
│       │   ├── ReviewSection.jsx # [BT07] Phần bình luận, đánh giá
│       │   ├── common/
│       │   │   └── ReviewModal.jsx # [BT07] Modal điền đánh giá
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
│       │   ├── MyRewardsPage.jsx # [BT07] Trang xem điểm thưởng & đánh giá
│       │   ├── NotificationsPage.jsx # [BT08] Trang quản lý thông báo của user
│       │   ├── ForgotPasswordPage.jsx
│       │   ├── HomePage.jsx     # Trang chủ E-Learning
│       │   ├── CoursesPage.jsx  # Trang danh sách khóa học + Lọc (BT04)
│       │   └── CategoryPage.jsx # Khóa học theo danh mục + Infinite Scroll (BT05)
│       ├── store/               # Redux Toolkit
│       │   └── slices/          # authSlice, courseSlice, cartSlice, notificationSlice
│       └── services/            # API service layer (reviewService, notificationService, ...)
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
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

(Tùy chọn) Tạo file `.env` tại thư mục `frontend/` (nếu chạy Backend khác cổng mặc định):
```env
VITE_API_URL=http://localhost:8089/api
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
 
*Dự án được thực hiện bởi Nhóm 08 — Bài Tập 02, 04, 05, 06, 07 & 08*
-

## 🧪 Testing

- File **`postman_collection.json`** — Import vào Postman để test Auth APIs
- Seed data tạo sẵn **5 danh mục** và **48 khóa học** để demo giao diện
---
 
*Dự án được thực hiện bởi Nhóm 08 — Bài Tập 02, 04, 05, 06, 07 & 08*
