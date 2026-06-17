import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import { handleGetMyCertificates, handleVerifyCertificate } from '../controllers/certificateController';

const router = express.Router();

router.get('/', verifyToken, handleGetMyCertificates);
router.get('/verify/:code', handleVerifyCertificate); // Public

export default router;
