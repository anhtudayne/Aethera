import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import { handleToggleFavorite, handleGetFavorites, handleCheckIsFavorite } from '../controllers/favoriteController';

let router = express.Router();

router.post('/toggle', verifyToken, handleToggleFavorite);
router.get('/', verifyToken, handleGetFavorites);
router.get('/check/:courseId', verifyToken, handleCheckIsFavorite);

export default router;
