import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import {
    handleCreateNote,
    handleGetNotesForLesson,
    handleGetNotesByCourse,
    handleUpdateNote,
    handleDeleteNote,
} from '../controllers/noteController';

const router = express.Router();

router.post('/', verifyToken, handleCreateNote);
router.get('/lesson/:lessonId', verifyToken, handleGetNotesForLesson);
router.get('/course/:courseId', verifyToken, handleGetNotesByCourse);
router.put('/:id', verifyToken, handleUpdateNote);
router.delete('/:id', verifyToken, handleDeleteNote);

export default router;
