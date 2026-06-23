import axios from 'axios';
import db from '../models';

/**
 * Trigger AssemblyAI Transcript Process
 * @param {Object} lesson - sequelize lesson instance
 */
export const triggerAssemblyAITranscript = async (lesson) => {
    try {
        if (lesson.type !== 'video' || !lesson.videoUrl) return;

        // AssemblyAI requires an audio/video URL
        // Cloudinary trick: change extension to .mp3 to extract audio
        let audioUrl = lesson.videoUrl;
        
        // Ex: https://res.cloudinary.com/demo/video/upload/v12345/lesson.mp4 -> .../lesson.mp3
        const urlParts = audioUrl.split('.');
        if (urlParts.length > 1) {
            const ext = urlParts[urlParts.length - 1].toLowerCase();
            if (['mp4', 'webm', 'mov', 'avi'].includes(ext)) {
                urlParts[urlParts.length - 1] = 'mp3';
                audioUrl = urlParts.join('.');
            }
        }

        const assemblyAiKey = process.env.ASSEMBLYAI_API_KEY;
        const webhookBaseUrl = process.env.WEBHOOK_BASE_URL;

        if (!assemblyAiKey || !webhookBaseUrl) {
            console.log('Skipping transcript: ASSEMBLYAI_API_KEY or WEBHOOK_BASE_URL is missing in .env');
            return;
        }

        const webhookUrl = `${webhookBaseUrl}/api/webhook/assemblyai`;

        // POST request to AssemblyAI
        const response = await axios.post(
            'https://api.assemblyai.com/v2/transcript',
            {
                audio_url: audioUrl,
                webhook_url: webhookUrl,
                language_detection: true, // or language_code: 'vi' if strictly vietnamese
            },
            {
                headers: {
                    authorization: assemblyAiKey,
                    'content-type': 'application/json',
                },
            }
        );

        const transcriptJobId = response.data.id;

        // Update lesson status
        await lesson.update({
            transcriptStatus: 'processing',
            transcriptJobId: transcriptJobId
        });

        console.log(`Transcript job ${transcriptJobId} queued for lesson ${lesson.id}`);

    } catch (error) {
        console.error('Error triggering AssemblyAI transcript:', error?.response?.data || error.message);
        await lesson.update({ transcriptStatus: 'failed' });
    }
};
