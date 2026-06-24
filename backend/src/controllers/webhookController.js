import axios from 'axios';
import db from '../models';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const handleAssemblyAIWebhook = async (req, res, next) => {
    try {
        const payload = req.body;
        
        // AssemblyAI sends: { transcript_id: '...', status: 'completed'|'error', ... }
        const transcriptJobId = payload.transcript_id;
        const status = payload.status;

        if (!transcriptJobId) {
            return res.status(400).json({ message: 'Missing transcript_id' });
        }

        // Tìm bài học đang có transcriptJobId này
        const lesson = await db.Lesson.findOne({ where: { transcriptJobId } });
        if (!lesson) {
            console.log(`Webhook received for unknown transcriptJobId: ${transcriptJobId}`);
            return res.status(200).send('OK'); // Return 200 so AssemblyAI stops retrying
        }

        if (status === 'error') {
            await lesson.update({ transcriptStatus: 'failed' });
            console.error(`AssemblyAI failed for lesson ${lesson.id}`);
            return res.status(200).send('OK');
        }

        if (status === 'completed') {
            // Lấy dữ liệu chi tiết JSON từ AssemblyAI
            const assemblyAiKey = process.env.ASSEMBLYAI_API_KEY;
            const transcriptRes = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptJobId}`, {
                headers: { authorization: assemblyAiKey }
            });

            const data = transcriptRes.data;

            // Xử lý gom nhóm words thành các đoạn 10-30s
            const transcripts = formatTranscript(data.words);

            // TẠO EMBEDDING CHO MỖI CHUNK (RAG PREPARATION)
            const geminiApiKey = process.env.GEMINI_API_KEY;
            if (geminiApiKey) {
                try {
                    const genAI = new GoogleGenerativeAI(geminiApiKey);
                    const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
                    
                    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

                    for (let chunk of transcripts) {
                        try {
                            const result = await embeddingModel.embedContent(chunk.text);
                            chunk.embedding = result.embedding.values;
                            // Ngủ 1 giây giữa các request để tránh rate limit của Gemini Free Tier (100req/min)
                            await delay(1000); 
                        } catch (err) {
                            console.error("Lỗi tạo embedding cho chunk:", err.message);
                            chunk.embedding = null;
                            // Nếu lỡ bị limit (429), nghỉ 10 giây rồi chạy tiếp
                            if (err.message.includes('429')) {
                                await delay(10000);
                            }
                        }
                    }
                } catch (e) {
                    console.error("Lỗi khởi tạo AI embedding:", e);
                }
            }

            await lesson.update({
                transcript: transcripts,
                transcriptStatus: 'ready'
            });

            console.log(`Transcript successfully saved for lesson ${lesson.id}`);
        }

        return res.status(200).send('OK');
    } catch (error) {
        console.error('Webhook processing error:', error);
        return res.status(500).send('Internal Server Error');
    }
};

/**
 * Format danh sách từ (words) thành từng đoạn nhỏ dựa trên thời gian
 */
function formatTranscript(words) {
    if (!words || !words.length) return [];

    const transcripts = [];
    let currentChunk = {
        start_time: msToTime(words[0].start),
        end_time: '',
        text: ''
    };
    let currentText = [];
    let chunkStartMs = words[0].start;

    // Giới hạn 20 giây một đoạn (tùy chỉnh)
    const CHUNK_DURATION_MS = 20000; 

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        currentText.push(word.text);

        const isLastWord = i === words.length - 1;
        const durationSoFar = word.end - chunkStartMs;

        // Cắt chunk nếu câu dài hơn 20s hoặc là từ cuối cùng
        // Chấm phẩy hoặc dấu chấm kết thúc câu cũng là chỗ cắt lý tưởng (tùy chọn)
        const isSentenceEnd = word.text.match(/[.!?]$/);

        if (isLastWord || (durationSoFar >= CHUNK_DURATION_MS && isSentenceEnd) || durationSoFar > CHUNK_DURATION_MS + 10000) {
            currentChunk.text = currentText.join(' ');
            currentChunk.end_time = msToTime(word.end);
            transcripts.push(currentChunk);

            if (!isLastWord) {
                currentText = [];
                chunkStartMs = words[i + 1].start;
                currentChunk = {
                    start_time: msToTime(chunkStartMs),
                    end_time: '',
                    text: ''
                };
            }
        }
    }

    return transcripts;
}

function msToTime(duration) {
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}
