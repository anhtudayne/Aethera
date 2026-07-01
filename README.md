<div align="center">

# Aethera — Premium E-Learning Platform

### *Where Knowledge is Refined & Experience is Elevated*

![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![MoMo](https://img.shields.io/badge/MoMo_Pay-A50064?style=for-the-badge&logo=cashapp&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)
![Groq AI](https://img.shields.io/badge/Groq_AI-F55036?style=for-the-badge&logo=probot&logoColor=white)

---

**Đề tài**: Xây dựng website học tập trực tuyến Aethera (Aethera E-Learning Platform)

**Aethera** là nền tảng học trực tuyến cao cấp được xây dựng theo mô hình **Client-Server**,
tách biệt rõ ràng giữa Frontend (**React + Vite**) và Backend (**Node.js + Express**),
giao tiếp thông qua **RESTful APIs** và **Realtime WebSockets (Socket.io)**.
Hệ thống phục vụ đồng thời **3 nhóm đối tượng**: Học viên, Giảng viên và Quản trị viên —
tích hợp thanh toán **MoMo**, **AI Agent (Gemini AI & Groq AI)** hỗ trợ học tập và tìm kiếm khóa học,
thông báo **Realtime**, và cơ chế **Hoàn tiền thông minh (Smart Refund)**.
Trong quá trình học, học viên được hỗ trợ tối đa với trình phát video **tự động lưu tiến độ**,
hệ thống tích lũy chuỗi ngày học **(Streak)** tạo động lực, mục **Hỏi đáp (Q&A)** tương tác trực tiếp,
trợ lý **AI Agent** giải đáp thắc mắc tức thời, và tự động cấp **Chứng chỉ PDF** khi hoàn thành khóa học.

</div>

---

## 📖 Mục lục

- [👥 Thành viên nhóm phát triển](#-thành-viên-nhóm-phát-triển)
- [🛠 Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [📁 Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [🔐 Ma trận phân quyền người dùng](#-ma-trận-phân-quyền-người-dùng)
- [⭐ Tính năng nổi bật](#-tính-năng-nổi-bật)
- [⚙️ Cài đặt & Chạy dự án](#️-cài-đặt--chạy-dự-án)
- [🖼️ Giao diện demo](#️-giao-diện-demo)

---

## 👥 Thành viên nhóm phát triển

<div align="center">

| STT | Họ và tên | MSSV |
|:---:|:---|:---|
| 1 | Võ Văn Tú | 23110359 |
| 2 | Nguyễn Thuận Phú | 23110285 |
| 3 | Vũ Anh Quốc | 23110296 |

</div>

---

---

## 🛠 Công nghệ sử dụng

### Frontend

| Công nghệ | Mô tả |
|:---|:---|
| **React 19** + **Vite 6** | Thư viện xây dựng giao diện người dùng hiệu suất cao |
| **React Router DOM v7** | Quản lý định tuyến SPA (Single Page Application) |
| **Vanilla CSS** | Thiết kế giao diện theo trường phái Glassmorphism, Responsive |
| **Axios** | Thư viện HTTP client giao tiếp RESTful API |
| **Socket.io Client** | Kết nối WebSocket cho tính năng thông báo thời gian thực |
| **Recharts** | Thư viện trực quan hóa dữ liệu (biểu đồ Dashboard) |
| **Lucide React** | Bộ icon vector hiện đại |
| **React Player** | Trình phát video đa nguồn (YouTube, Cloudinary) |

### Backend

| Công nghệ | Mô tả |
|:---|:---|
| **Node.js** + **Express.js** | Nền tảng runtime và framework xây dựng REST API |
| **Sequelize ORM** | ORM quản lý cơ sở dữ liệu MySQL với Migration & Seeders |
| **MySQL** | Cơ sở dữ liệu quan hệ chính (32 models) |
| **Socket.io** | Xử lý thông báo realtime (đơn hàng, phê duyệt, khiếu nại) |
| **JWT** + **Bcryptjs** | Xác thực người dùng và mã hóa mật khẩu |
| **Nodemailer** | Gửi email xác thực OTP qua Gmail SMTP |
| **Multer** | Middleware xử lý upload file (ảnh, video) |

### Dịch vụ bên thứ ba

| Dịch vụ | Mô tả |
|:---|:---|
| **MoMo Payment Gateway** | Cổng thanh toán trực tuyến (QR Code, Deeplink) |
| **Cloudinary** | Lưu trữ đám mây cho ảnh, video bài giảng, hóa đơn |
| **Google OAuth 2.0** | Đăng nhập nhanh bằng tài khoản Google |
| **Google Gemini API** | AI Chatbot hỗ trợ học tập dựa trên video transcript |
| **Groq API (LLaMA 3)** | AI Agent trợ lý tìm kiếm khóa học tại Trang chủ |

---

## 📁 Cấu trúc thư mục

```
Aethera/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── migrations/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seeders/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── server.js
│   │   └── socketManager.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── course/
│   │   │   └── layouts/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── Home/
│   │   │   ├── Auth/
│   │   │   ├── Courses/
│   │   │   ├── CourseDetail/
│   │   │   ├── CoursePlayer/
│   │   │   ├── Cart/ & Checkout/
│   │   │   ├── Dashboard/
│   │   │   ├── Certificates/
│   │   │   ├── admin/
│   │   │   └── instructor/
│   │   ├── store/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
└── README.md
```

---

## 🔐 Ma trận phân quyền người dùng


| Tính năng | 🌐 Khách (Guest) | 🎓 Học viên (Student) | 👨‍🏫 Giảng viên (Instructor) | 🛡️ Admin |
|:---|:---:|:---:|:---:|:---:|
| Đăng ký, Đăng nhập, Google OAuth | ✅ | ✅ | ✅ | ✅ |
| Tìm kiếm, xem danh mục, xem chi tiết khóa học | ✅ | ✅ | ✅ | ✅ |
| Thêm giỏ hàng, áp dụng Voucher, Thanh toán MoMo | ❌ | ✅ | ❌ | ❌ |
| Xem bài học video, Streak, Q&A, Chat AI | ❌ | ✅ *(đã mua)* | ✅ *(chủ khóa học)* | ❌ |
| Yêu cầu hoàn tiền (Refund) trong 30 ngày | ❌ | ✅ | ❌ | ❌ |
| Tạo khóa học, soạn chương trình, upload video | ❌ | ❌ | ✅ | ❌ |
| Quản lý ví doanh thu, yêu cầu rút tiền (Payout) | ❌ | ❌ | ✅ | ❌ |
| Kiểm duyệt khóa học (Phê duyệt / Từ chối) | ❌ | ❌ | ❌ | ✅ |
| Khóa / Mở khóa tài khoản người dùng | ❌ | ❌ | ❌ | ✅ |
| Quản lý khiếu nại / Hỗ trợ (Support Tickets) | ❌ | *Gửi khiếu nại* | ❌ | *Phản hồi* |
| Phê duyệt Payout & Refund, cấu hình hệ thống | ❌ | ❌ | ❌ | ✅ |

---

## ⭐ Tính năng nổi bật

### 1. 🔐 Xác thực đa phương thức & Google OAuth
- Hỗ trợ đăng ký/đăng nhập truyền thống với xác thực OTP qua Email và tính năng quên mật khẩu an toàn.
- Tích hợp **Google OAuth 2.0** giúp người dùng đăng nhập chỉ với 1 click mà không cần nhớ mật khẩu.
- Phân quyền người dùng theo 3 vai trò (Student, Instructor, Admin) với middleware bảo mật JWT trên mọi API endpoint.

### 2. 🏠 Trang chủ hiện đại & AI Agent trợ lý
- Giao diện trang chủ được thiết kế theo phong cách Premium với hiệu ứng Glassmorphism, hiển thị khóa học nổi bật, mới nhất, bán chạy nhất.
- Tích hợp **AI Agent (Groq LLaMA 3)** với linh vật 3D tại góc phải, tự động mở khi vào trang chủ, hỗ trợ tìm kiếm khóa học bằng ngôn ngữ tự nhiên.
- Thanh điều hướng thông minh với danh mục động, thanh tìm kiếm toàn cục, giỏ hàng dropdown preview, và hệ thống thông báo realtime.

### 3. 🛒 Giỏ hàng & Thanh toán MoMo
- Quản lý giỏ hàng linh hoạt, hiển thị tổng tiền tự động cập nhật khi thêm/xóa khóa học, hỗ trợ áp dụng mã giảm giá (Voucher).
- Tích hợp cổng thanh toán **ví điện tử MoMo** qua mã QR Code bảo mật, xử lý callback webhook tự động.
- Cơ chế **Thanh toán hỗn hợp**: Cho phép sử dụng kết hợp ví Aethera Credit với MoMo khi số dư Credit không đủ.

### 4. 🎬 Trình phát video học tập & AI Chatbot
- Trình phát video chuyên nghiệp tự động lưu vị trí xem (watch position) để học viên tiếp tục từ nơi đã dừng.
- Tích hợp **AI Chatbot (Google Gemini)** ngay bên cạnh video, tự động phân tích transcript bài giảng để giải đáp thắc mắc tức thời.
- Hệ thống **Hỏi & Đáp (Q&A)** cho phép học viên đặt câu hỏi, upvote và thảo luận cùng giảng viên/bạn học ngay trong từng bài học.

### 5. 📜 Chứng chỉ hoàn thành khóa học (Certificate PDF)
- Tự động cấp chứng chỉ dạng PDF khi học viên hoàn thành 100% bài học của khóa học.
- Chứng chỉ bao gồm đầy đủ thông tin: tên học viên, tên khóa học, ngày hoàn thành, mã xác thực duy nhất và chữ ký đại diện.
- Hỗ trợ trang **xác thực chứng chỉ công khai** cho phép bất kỳ ai cũng có thể xác minh tính hợp lệ của chứng chỉ.

### 6. 💰 Hoàn tiền thông minh (Smart Refund)
- Cho phép hoàn tiền trong vòng **30 ngày** kể từ ngày mua (lần mua đầu tiên của mỗi khóa học).
- **2 phương thức hoàn tiền**: Hoàn ngay lập tức vào **ví Aethera Credit** (Instant Refund) hoặc hoàn về **tài khoản ngân hàng/MoMo** (xử lý trong 2-3 ngày làm việc).
- Hệ thống tự động vô hiệu hóa nút hoàn tiền nếu khóa học đã từng được refund trước đó, ngăn chặn lạm dụng.

### 7. 👨‍🏫 Hệ thống Giảng viên & Quản lý Doanh thu
- Người dùng đăng ký trở thành giảng viên, tạo khóa học mới, thiết kế giáo trình (Sections & Lessons) và tải video lên **Cloudinary**.
- **Ví giảng viên** với 2 loại số dư: *Pending Balance* (chờ đối soát 30 ngày) và *Available Balance* (khả dụng rút).
- Giảng viên tạo **Yêu cầu rút tiền (Payout)** về ngân hàng, Admin phê duyệt và tải lên biên lai chuyển khoản làm bằng chứng.

### 8. 🛡️ Bảng điều khiển Admin toàn diện
- Dashboard trực quan với biểu đồ doanh thu, thống kê người dùng, giảng viên, khóa học và ticket khiếu nại.
- **Kiểm duyệt khóa học**: Xem chi tiết nội dung → Phê duyệt (Published) hoặc Từ chối (kèm lý do) cho giảng viên chỉnh sửa.
- Quản lý toàn diện: Người dùng (Khóa/Mở khóa), Danh mục, Voucher, Banner, Payout, Refund, Cấu hình hệ thống (Platform Fee, thời gian Refund...).

### 9. 🔔 Thông báo Realtime & Hỗ trợ khách hàng
- Hệ thống thông báo thời gian thực qua **Socket.io**: Đẩy thông báo ngay lập tức khi có đơn hàng mới, phê duyệt khóa học, hoặc phản hồi khiếu nại.
- **Support Ticket System**: Học viên gửi khiếu nại kèm ảnh minh chứng (tối đa 2 ảnh), Admin tiếp nhận, phản hồi và quản lý trạng thái xử lý.
- Hệ thống **Ghi chú nội bộ (Internal Note)** giữa các Admin để phối hợp xử lý các khiếu nại phức tạp.

### 10. 🎯 Trải nghiệm người dùng cao cấp
- Hệ thống **Streak học tập**: Theo dõi số ngày học liên tục, khuyến khích tinh thần tự học mỗi ngày.
- **Danh sách yêu thích (Wishlist)**: Lưu trữ các khóa học quan tâm để mua sắm sau.
- **Hover Preview thông minh** (Udemy-style): Rê chuột vào khóa học để xem thông tin chi tiết mà không cần vào trang riêng, kèm nút thêm nhanh vào giỏ hàng.

---

## ⚙️ Cài đặt & Chạy dự án

### Yêu cầu hệ thống
- [Node.js](https://nodejs.org/) phiên bản **18+**
- [MySQL](https://www.mysql.com/) Server đang chạy

### 1. Clone mã nguồn
```bash
git clone https://github.com/anhtudayne/Aethera.git
cd Aethera
```

### 2. Cài đặt & Chạy Backend
```bash
cd backend
npm install
```

**Cấu hình môi trường:**
```bash
cp .env.example .env
```
Cập nhật các thông tin trong file `.env`:
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

# Groq API (AI Agent)
GROQ_API_KEY=gsk_your_groq_api_key_here
```

**Khởi tạo Database & Chạy Server:**
```bash
npm run seed       # Chạy migrations & seed dữ liệu mẫu
npm run dev        # Khởi động Development Server
```
> Backend sẽ chạy tại `http://localhost:8089`

### 3. Cài đặt & Chạy Frontend
```bash
cd frontend
npm install
npm run dev
```
> Giao diện sẽ chạy tại `http://localhost:3000`

### Tài khoản mẫu (Seeders)

| Vai trò | Email | Mật khẩu |
|:---|:---|:---|
| 🛡️ Admin | `admin@elearning.com` | `Admin@123` |
| 👨‍🏫 Instructor | `teacher@elearning.com` | `Teacher@123` |
| 🎓 Student | `student@elearning.com` | `Student@123` |

---

## 🖼️ Giao diện demo

### 1. Đăng nhập / Đăng ký & Xác thực OTP
<img width="1566" height="838" alt="Đăng nhập" src="https://github.com/user-attachments/assets/25039071-0069-464d-a4a2-d9b2930a5dff" />

### 2. Trang chủ & Khám phá khóa học
<img width="1288" height="961" alt="Trang chủ" src="https://github.com/user-attachments/assets/1034ccb8-b864-4993-b753-2efeb431b7dd" />

<img width="1304" height="954" alt="Khám phá" src="https://github.com/user-attachments/assets/23afb8cd-5b55-4e0a-a952-0bff46a537ec" />

<img width="1282" height="898" alt="Danh mục" src="https://github.com/user-attachments/assets/b8c8536b-84fd-4e7d-bb1f-e207f447b25c" />

<img width="1210" height="921" alt="Chi tiết" src="https://github.com/user-attachments/assets/cadbb682-9b96-460c-a6f9-623d4c911493" />

### 3. Chi tiết khóa học & Trình phát Video
<img width="1854" height="976" alt="Video Player" src="https://github.com/user-attachments/assets/ce5218fd-1e5e-4a13-935e-db6ebc8d91f6" />

### 4. Trợ lý học tập AI (Generative AI)
<img width="856" height="928" alt="AI Chatbot" src="https://github.com/user-attachments/assets/1bec476c-36db-4036-9b1c-06a387314e81" />

### 5. Tương tác & Thông báo Realtime
<img width="1317" height="634" alt="Thông báo" src="https://github.com/user-attachments/assets/7ac4ebf8-9bc2-44ab-bbea-6db564fb3aef" />

<img width="1424" height="788" alt="Q&A" src="https://github.com/user-attachments/assets/2c14477b-e23f-415d-b58b-8ef787d9af77" />

---

<div align="center">

### 🌟 Nếu bạn thấy dự án hữu ích, hãy tặng chúng tôi một ⭐ trên GitHub!

**© 2026 Aethera Team — Built with ❤️ by Nhóm 08**

</div>
