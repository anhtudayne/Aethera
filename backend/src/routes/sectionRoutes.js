import express from 'express';
import { handleCreateSection, handleGetSections } from '../controllers/sectionController.js';

const router = express.Router();

router.post('/', handleCreateSection);
router.get('/', handleGetSections);

export default router;
