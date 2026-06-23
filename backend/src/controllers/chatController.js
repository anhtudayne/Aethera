import db from '../models';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { cosineSimilarity } from '../utils/vectorMath.js';

export const handleLessonChat = async (req, res, next) => {
    try {
        const { lessonId, message, history } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Không tìm thấy thông tin xác thực.' });
        }

        if (!lessonId || !message) {
            return res.status(400).json({ message: 'Thiếu lessonId hoặc message' });
        }

        const lesson = await db.Lesson.findByPk(lessonId);
        if (!lesson) {
            return res.status(404).json({ message: 'Không tìm thấy bài học' });
        }

        // BƯỚC 1: Lấy thông tin User
        const user = await db.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản học viên' });
        }

        // BƯỚC 2: Kiểm tra và Nạp lại năng lượng (Lazy Reset)
        const now = new Date();
        const lastReset = user.lastCreditReset ? new Date(user.lastCreditReset) : new Date();
        const diffMs = now - lastReset;
        const diffMinutes = Math.floor(diffMs / 60000);

        if (diffMinutes >= 60) {
            user.aiCredits = 25;
            user.lastCreditReset = now;
            await user.save();
        }

        // BƯỚC 3: Kiểm tra điều kiện (Validation)
        if (user.aiCredits <= 0) {
            const minutesToWait = 60 - diffMinutes;
            return res.status(429).json({
                message: `Bạn đã hết lượt hỏi, vui lòng chờ ${minutesToWait > 0 ? minutesToWait : 60} phút để nạp lại năng lượng ⚡`
            });
        }

        // Kiểm tra xem đã có transcript chưa
        if (!lesson.transcript || lesson.transcript.length === 0) {
            return res.status(400).json({
                message: 'Xin lỗi, bài học này chưa được bóc băng (transcript) nên trợ lý không thể trả lời dựa trên nội dung video được.'
            });
        }

        const geminiApiKey = process.env.GEMINI_API_KEY;
        if (!geminiApiKey) {
            console.error('Missing GEMINI_API_KEY in .env');
            return res.status(500).json({ message: 'Chưa cấu hình GEMINI_API_KEY' });
        }

        // BƯỚC 1: Lấy mảng chunks (có thể là chuỗi JSON nếu DB trả về text)
        const chunks = typeof lesson.transcript === 'string' ? JSON.parse(lesson.transcript) : lesson.transcript;

        // Lấy thông tin Tên bài học và Khóa học để làm Prompt
        let lessonTitle = lesson.title || "Bài học hiện tại";
        let courseName = "Khóa học hiện tại";
        try {
            const section = await db.Section.findByPk(lesson.sectionId);
            if (section) {
                const course = await db.Course.findByPk(section.courseId);
                if (course) courseName = course.title;
            }
        } catch (e) { }

        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const chatModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // KIỂM TRA LUỒNG XỬ LÝ
        const isSummary = message.includes("Tóm tắt nội dung");
        const isQuiz = message.includes("Tạo các bài kiểm tra");
        const isFullContextRequired = isSummary || isQuiz;

        let systemInstruction = "";
        let promptMessage = "";
        let sources = [];

        if (isFullContextRequired) {
            // LUỒNG 1: Gửi toàn bộ Transcript (không dùng RAG)
            const fullTranscriptText = chunks.map(c => `[${c.start_time} - ${c.end_time}]: ${c.text}`).join('\n');

            if (isQuiz) {
                systemInstruction = `Bạn là Teacher Bee AI 🐝 - một Gia sư AI tận tâm. Nhiệm vụ của bạn là tạo một bài kiểm tra ngắn (quiz) trắc nghiệm 5 câu dựa trên nội dung bài giảng.
Mỗi câu hỏi phải có 4 đáp án A, B, C, D và MỖI ĐÁP ÁN PHẢI ĐƯỢC XUỐNG DÒNG RIÊNG BIỆT.
TUYỆT ĐỐI KHÔNG ĐƯỢC CUNG CẤP ĐÁP ÁN TRONG LẦN TRẢ LỜI NÀY. CHỈ ĐƯA RA CÂU HỎI.
Sau khi liệt kê xong 5 câu hỏi, bắt buộc phải kết thúc bằng đoạn văn bản sau:
"Chào bạn 😊 Teacher Bee AI đây 🐝 Bài quiz vẫn đang chờ bạn làm đó nha. Bạn trả lời theo mẫu như thế này nhé:
1-B, 2-…, 3-…, 4-…, 5-…
Teacher Bee AI đợi câu trả lời của bạn để chữa bài cho bạn nè ✨"`;
            } else {
                systemInstruction = `Bạn là Teacher Bee AI 🐝 - một Gia sư AI tận tâm. Hãy trả lời yêu cầu của học viên một cách chi tiết, chính xác và có cấu trúc rõ ràng. Trình bày bằng Markdown sạch sẽ, sử dụng danh sách (bullet points) và in đậm các từ khóa quan trọng.`;
            }

            promptMessage = `Yêu cầu của học viên: "${message}"\n\nThông tin bài giảng:\nTên khóa học: ${courseName}\nTên bài học: ${lessonTitle}\n\nNội dung bài giảng (Transcript):\n"""\n${fullTranscriptText}\n"""`;

        } else {
            // LUỒNG 2: Sử dụng RAG Vector Search cho các câu hỏi cụ thể
            let queryVector = [];
            try {
                const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
                const embeddingResult = await embeddingModel.embedContent(message);
                queryVector = embeddingResult.embedding.values;
            } catch (err) {
                console.error("Lỗi tạo embedding cho câu hỏi:", err.message);
            }

            let contextText = "";

            if (queryVector && queryVector.length > 0) {
                const scoredChunks = chunks.map(chunk => {
                    const score = chunk.embedding ? cosineSimilarity(queryVector, chunk.embedding) : 0;
                    return { ...chunk, score };
                });

                const topChunks = scoredChunks.sort((a, b) => b.score - a.score).slice(0, 4);
                contextText = topChunks.map(c => `[${c.start_time} - ${c.end_time}]: ${c.text}`).join('\n');
                sources = topChunks.map(c => ({ start: c.start_time, end: c.end_time }));
            } else {
                contextText = chunks.slice(0, 10).map(c => `[${c.start_time} - ${c.end_time}]: ${c.text}`).join('\n'); // Fallback tạm 10 đoạn đầu
            }

            // Sử dụng System Prompt phương pháp Feynman
            systemInstruction =
                `Bạn là Teacher Bee AI 🐝 - một Gia sư AI tận tâm. Học viên đang có câu hỏi hoặc cần giải thích một khái niệm thuộc bài giảng.\n\n` +
                `Quy tắc cốt lõi:\n` +
                `- Sử dụng phương pháp Feynman: Giải thích đơn giản như thể đang nói chuyện với một người mới bắt đầu.\n` +
                `- NẾU học viên yêu cầu cung cấp đáp án bài kiểm tra (quiz) MÀ CHƯA TỰ LÀM, TUYỆT ĐỐI KHÔNG ĐƯỢC CHO ĐÁP ÁN. Hãy từ chối bằng đúng câu sau: "Teacher Bee AI hiểu bạn muốn xem đáp án luôn 😊 nhưng theo cách học hiệu quả, bạn cần tự làm trước để nhớ bài lâu hơn 🐝👉 Vì đây là phần Practice (Thực hành), Teacher Bee AI không thể cho đáp án khi bạn chưa làm. Bạn chỉ cần trả lời theo mẫu rất nhanh thôi: 1-B, 2-…, 3-…, 4-…, 5-…"\n` +
                `- Luôn liên hệ câu trả lời với bối cảnh của bài giảng được cung cấp dưới đây.\n` +
                `- Nếu có thể, hãy đưa ra một ví dụ thực tế (analogy) gần gũi để minh họa.\n` +
                `- Nếu câu hỏi của học viên nằm ngoài phạm vi tài liệu hoặc không liên quan đến bài học, hãy lịch sự từ chối trả lời và hướng họ quay lại bài học.`;

            promptMessage =
                `Câu hỏi của học viên: "${message}"\n\n` +
                `Dựa vào ngữ cảnh (Context) được trích xuất từ bài giảng dưới đây, hãy trả lời học viên:\n\n` +
                `Tài liệu bài giảng (Context):\n"""\n${contextText}\n"""\n\n` +
                `Lưu ý: Hãy xưng "Teacher Bee AI" và gọi học viên là "bạn" một cách thân thiện. Đảm bảo câu trả lời giúp họ áp dụng được kiến thức vào thực hành.`;
        }

        // Nạp lịch sử chat (nếu có) vào mảng contents để AI nhớ ngữ cảnh
        let chatContents = [];
        if (history && Array.isArray(history)) {
            chatContents = [...history];
        }
        chatContents.push({ role: "user", parts: [{ text: promptMessage }] });

        const responseResult = await chatModel.generateContent({
            contents: chatContents,
            systemInstruction: { parts: [{ text: systemInstruction }] }
        });

        const reply = responseResult.response.text();

        // BƯỚC 4: Trừ hao lượt hỏi
        user.aiCredits -= 1;
        await user.save();

        // BƯỚC 5: Trả kết quả về Frontend
        return res.status(200).json({
            reply,
            sources,
            remainingCredits: user.aiCredits
        });
    } catch (error) {
        console.error('Chat error:', error);
        return res.status(500).json({ message: 'Lỗi khi gọi AI' });
    }
};
