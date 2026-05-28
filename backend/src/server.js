import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './config/configdb';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import uploadRoutes from './routes/uploadRoutes';
import courseRoutes from './routes/courseRoutes';
import orderRoutes from './routes/orderRoutes';
import sepayRoutes from './routes/sepayRoutes';
import cartRoutes from './routes/cartRoutes';
import reviewRoutes from './routes/reviewRoutes';
import rewardRoutes from './routes/rewardRoutes';
import errorHandler from './middlewares/errorHandler';
import path from 'path';

let app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Default route
app.get('/', (req, res) => {
    return res.status(200).json({
        status: 200,
        message: 'E-Learning API Server đang hoạt động!',
        endpoints: {
            register: 'POST /api/auth/register',
            verifyOtp: 'POST /api/auth/verify-otp',
            resendOtp: 'POST /api/auth/resend-otp',
        },
    });
});

app.use('/api/auth', authRoutes);


// Placeholder for other functions
// app.use('/api/auth', loginRoutes);
// app.use('/api/auth', passwordRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api', courseRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/sepay', sepayRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/rewards', rewardRoutes);

// Phục vụ các file tĩnh (ảnh avatar) từ thư mục public/uploads
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use(errorHandler);

connectDB();

// Sync database
const db = require('./models/index');
db.sequelize.sync()
    .then(() => {
        console.log('Đồng bộ database thành công.');
    })
    .catch((err) => {
        console.error('Lỗi đồng bộ database:', err);
    });

let port = process.env.PORT || 8089;
app.listen(port, () => {
    console.log(`Server đang chạy tại: http://localhost:${port}`);
});
