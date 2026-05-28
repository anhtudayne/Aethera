import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import { handleToggleFavorite, handleGetFavorites } from '../controllers/favoriteController';

let router = express.Router();

router.post('/toggle', verifyToken, handleToggleFavorite);
router.get('/', verifyToken, handleGetFavorites);

export default router;
