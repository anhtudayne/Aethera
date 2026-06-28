import express from 'express';
import { handleAssemblyAIWebhook } from '../controllers/webhookController.js';
import { handleMoMoWebhook } from '../controllers/bulkPayoutController.js';

const router = express.Router();

router.post('/assemblyai', handleAssemblyAIWebhook);
router.post('/payouts/momo-webhook', handleMoMoWebhook);

export default router;
