import express from 'express';
import { handleCreateLesson, handleGetLessons, handleUpdateLesson, handleDeleteLesson } from '../controllers/lessonController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, handleCreateLesson);
router.get('/', handleGetLessons);
router.put('/:id', verifyToken, handleUpdateLesson);
router.delete('/:id', verifyToken, handleDeleteLesson);

export default router;
