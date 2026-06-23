import express from 'express';
import { handleAssemblyAIWebhook } from '../controllers/webhookController.js';

const router = express.Router();

router.post('/assemblyai', handleAssemblyAIWebhook);

export default router;
