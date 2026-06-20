import express from 'express';
import { handleCreateSection, handleGetSections, handleUpdateSection, handleDeleteSection } from '../controllers/sectionController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, handleCreateSection);
router.get('/', handleGetSections);
router.put('/:id', verifyToken, handleUpdateSection);
router.delete('/:id', verifyToken, handleDeleteSection);

export default router;
