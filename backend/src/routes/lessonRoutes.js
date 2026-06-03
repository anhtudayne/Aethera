import express from 'express';
import { handleCreateLesson, handleGetLessons, handleDeleteLesson } from '../controllers/lessonController.js';

const router = express.Router();

router.post('/', handleCreateLesson);
router.get('/', handleGetLessons);
router.delete('/:id', handleDeleteLesson);

export default router;
