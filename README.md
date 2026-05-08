# E-Learning API Platform (Bài Tập 02)

### 👥 Nhóm thực hiện:
| MSSV | Họ và Tên |
|------|-----------|
| 23110285 | NGUYỄN THUẬN PHÚ |
| 23110296 | VŨ ANH QUỐC |
| 23110359 | VÕ VĂN TÚ |

Dự án API backend cho hệ thống E-Learning, tập trung vào bảo mật API và kiến trúc mã nguồn chuẩn.

## 🚀 Tính năng nổi bật (Chức năng 1 & 2)

- **Đăng ký tài khoản**: Hỗ trợ đăng ký người dùng mới.
- **Xác thực OTP qua Email**: Tự động gửi mã OTP 6 số để kích hoạt tài khoản.
- **Bảo mật đa lớp**:
  - **Lớp 1 (Input Validation)**: Kiểm tra dữ liệu đầu vào bằng `express-validator`.
  - **Lớp 2 (Rate Limiting)**: Giới hạn số lần đăng ký/gửi lại OTP để chống Brute-force & DDoS.
  - **Chỉnh sửa hồ sơ cá nhân**: Cập nhật thông tin với Whitelist để bảo vệ dữ liệu nhạy cảm.
  - **Lớp 1 (Rate Limiting)**: Chống Spam & Brute-force bằng `express-rate-limit`.
  - **Lớp 2 (Input Validation)**: Làm sạch và kiểm tra tính hợp lệ của dữ liệu (chuẩn Regex) bằng `express-validator`.
- **Kiến trúc 3 tầng (3-Layer Architecture)**: Presentation (Controller) -> Business Logic (Service) -> Data Access (Model).

## 📡 API Endpoints

| Method | Endpoint | Description | Auth/Security |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Đăng ký người dùng | Rate Limit + Validation |
| `POST` | `/api/auth/verify-otp` | Xác nhận mã OTP | - |
| `POST` | `/api/auth/resend-otp` | Gửi lại mã OTP | Rate Limit |
| `PUT`  | `/api/user/profile`  | Cập nhật hồ sơ cá nhân | 4 Lớp Bảo Mật |

## 🛠 Công nghệ sử dụng

- **Backend**: Node.js, Express.js (v4.x)
- **Database**: MySQL, Sequelize ORM
- **Security**: bcryptjs (hashing), express-validator, express-rate-limit
- **Email**: Nodemailer (SMTP Gmail)
- **Tooling**: Babel (ES6+ support), Nodemon

## 📂 Cấu trúc thư mục

```text
BAITAP_02/
├── src/
│   ├── config/          # Cấu hình database
│   ├── controllers/     # Tầng Presentation (Xử lý request/response)
│   ├── middlewares/     # Lớp bảo mật & Xử lý lỗi
│   ├── migrations/      # File migration tạo bảng MySQL
│   ├── models/          # Tầng Data Access (Sequelize models)
│   ├── routes/          # Định nghĩa các API endpoints
│   ├── services/        # Tầng Business Logic (Xử lý nghiệp vụ chính)
│   ├── utils/           # Tiện ích bổ trợ (OTP helper)
│   └── server.js        # File khởi tạo ứng dụng
├── .babelrc             # Cấu hình ES6
├── .env                 # Biến môi trường
├── api-test.rest        # File test API (REST Client)
└── package.json         # Danh sách thư viện & scripts
```

## ⚙️ Cài đặt & Chạy ứng dụng

### 1. Chuẩn bị Database
Tạo database MySQL tên `elearning_baitap02` hoặc chạy lệnh:
```sql
CREATE DATABASE elearning_baitap02;
```

### 2. Cấu hình Biến môi trường
Tạo file `.env` và điền thông tin:
```env
PORT=8089
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### 3. Cài đặt thư viện
```bash
npm install
```

### 4. Chạy Migration (Tạo bảng)
```bash
npx sequelize-cli db:migrate
```

### 5. Chạy ứng dụng
```bash
npm start
```

## 🧪 Testing

- Bạn có thể dùng **Postman** hoặc **REST Client (VS Code)**.

---
