import 'dotenv/config';
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import connectDB from './config/configdb';
import { initSocket } from './socketManager';
import errorHandler from './middlewares/errorHandler';

// Routes
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import courseRoutes from './routes/courseRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import learningRoutes from './routes/learningRoutes';
import certificateRoutes from './routes/certificateRoutes';
import noteRoutes from './routes/noteRoutes';
import reviewRoutes from './routes/reviewRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import notificationRoutes from './routes/notificationRoutes';
import sectionRoutes from './routes/sectionRoutes';
import lessonRoutes from './routes/lessonRoutes';
import uploadRoutes from './routes/uploadRoutes';
import adminRoutes from './routes/adminRoutes';
import statsRoutes from './routes/statsRoutes';
import webhookRoutes from './routes/webhookRoutes';
import paymentRoutes from './routes/paymentRoutes';
import ticketRoutes from './routes/ticketRoutes';
import qaRoutes from './routes/qaRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Default route
app.get('/', (req, res) => res.json({
    status: 200,
    message: 'E-Learning Platform API',
}));

// ===== PUBLIC & AUTH ROUTES =====
app.use('/api/auth', authRoutes);

// ===== USER ROUTES =====
app.use('/api/user', userRoutes);
app.use('/api/user', dashboardRoutes);

// ===== COURSE BROWSING =====
app.use('/api', courseRoutes);         // /api/courses, /api/categories
app.use('/api', qaRoutes);             // /api/courses/:courseId/questions

// ===== CART & ORDERS =====
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

// ===== LEARNING EXPERIENCE =====
app.use('/api/learning', learningRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/notes', noteRoutes);

// ===== SOCIAL =====
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/tickets', ticketRoutes);

// ===== CONTENT MANAGEMENT (Teacher/Admin) =====
app.use('/api/sections', sectionRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stats', statsRoutes);

// ===== WEBHOOKS =====
app.use('/api/webhook', webhookRoutes);

// Error handler
app.use(errorHandler);

// Database
connectDB();
const db = require('./models/index');
db.sequelize.authenticate().then(() => console.log('DB connected')).catch(console.error);

// Server
const port = process.env.PORT || 8089;
const server = http.createServer(app);
initSocket(server);
server.listen(port, () => console.log(`Server: http://localhost:${port}`));
