import db from '../models';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { retrieveRelevantContext } from '../services/ragService.js';

const generateContentWithRetry = async (model, params, maxRetries = 3) => {
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            return await model.generateContent(params);
        } catch (error) {
            attempt++;
            if (attempt >= maxRetries || (error.status !== 503 && (!error.message || !error.message.includes('503')))) {
                throw error;
            }
            console.log(`[Gemini] Overloaded with 503, retrying attempt ${attempt} after 2 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
};

export const handleLessonChat = async (req, res, next) => {
    try {
        const { lessonId, message, history } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Authentication information not found.' });
        }

        if (!lessonId || !message) {
            return res.status(400).json({ message: 'Missing lessonId or message' });
        }

        const lesson = await db.Lesson.findByPk(lessonId);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        // BƯỚC 1: Lấy thông tin User
        const user = await db.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Student account not found' });
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
                message: `You have run out of questions, please wait ${minutesToWait > 0 ? minutesToWait : 60} minutes to recharge energy ⚡`
            });
        }

        // Kiểm tra xem đã có transcript chưa
        if (!lesson.transcript || lesson.transcript.length === 0) {
            return res.status(400).json({
                message: 'Sorry, this lesson does not have a transcript yet, so the assistant cannot answer based on the video content.'
            });
        }

        const geminiApiKey = process.env.GEMINI_API_KEY;
        if (!geminiApiKey) {
            console.error('Missing GEMINI_API_KEY in .env');
            return res.status(500).json({ message: 'GEMINI_API_KEY is not configured' });
        }

        // BƯỚC 1: Lấy mảng chunks (có thể là chuỗi JSON nếu DB trả về text)
        const chunks = typeof lesson.transcript === 'string' ? JSON.parse(lesson.transcript) : lesson.transcript;

        // Lấy thông tin Tên bài học và Khóa học để làm Prompt
        let lessonTitle = lesson.title || "Current lesson";
        let courseName = "Current course";
        try {
            const section = await db.Section.findByPk(lesson.sectionId);
            if (section) {
                const course = await db.Course.findByPk(section.courseId);
                if (course) courseName = course.title;
            }
        } catch (e) { }

        const genAI = new GoogleGenerativeAI(geminiApiKey);

        // Sử dụng model gemini-3.1-flash-lite-preview (chuyên xử lý tải nặng)
        const chatModel = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

        // KIỂM TRA TRẠNG THÁI QUIZ
        const lastAssistantMessage = history && history.length > 0 ? history.slice().reverse().find(m => m.role === 'model') : null;
        const isPendingQuiz = lastAssistantMessage && lastAssistantMessage.parts[0].text.includes("Teacher Bee AI is waiting for your answers to grade them");

        const msgLower = message.toLowerCase();
        const isCancelingQuiz = msgLower.includes("cancel quiz");
        const isAnsweringQuiz = isPendingQuiz && (/^[0-9]+[-.\s]*[a-dA-D]/i.test(message.trim()) || msgLower.includes("1-") || msgLower.includes("1."));

        if (isPendingQuiz) {
            if (isCancelingQuiz) {
                return res.status(200).json({
                    reply: "🐝 Teacher Bee AI has canceled the Quiz! What else would you like to learn about in this lesson?",
                    sources: [],
                    remainingCredits: user.aiCredits
                });
            }
            if (!isAnsweringQuiz) {
                return res.status(200).json({
                    reply: "🐝 You have an unfinished Quiz! Please complete it before we move on to another topic. (If you want to skip it, type 'Cancel quiz')\n\nTeacher Bee AI is waiting for your answers to grade them ✨",
                    sources: [],
                    remainingCredits: user.aiCredits
                });
            }
        }

        // KIỂM TRA LUỒNG XỬ LÝ
        const isSummary = message.includes("Summarize content");
        const isQuiz = message.includes("Create quizzes");
        const isExplain = message.includes("Explain the important concepts");
        const isFullContextRequired = isSummary || isQuiz || isAnsweringQuiz || isExplain;

        let systemInstruction = "";
        let promptMessage = "";
        let sources = [];
        let chatContents = [];

        if (isFullContextRequired) {
            // LUỒNG 1: Gửi toàn bộ Transcript (không dùng RAG)
            let fullTranscriptText = chunks.map(c => `[${c.start_time} - ${c.end_time}]: ${c.text}`).join('\n');

            // Cắt bớt nếu transcript quá dài (> 8000 ký tự) để tránh Google ném lỗi 503 do Payload lớn
            // if (fullTranscriptText.length > 8000) {
            //     fullTranscriptText = fullTranscriptText.substring(0, 8000) + "\n... (Nội dung sau đã được rút gọn do quá dài)";
            // }

            if (isQuiz) {
                systemInstruction = `You are Teacher Bee AI 🐝 - a dedicated AI Tutor. Your task is to create a short multiple-choice quiz of 5 questions based on the lecture content.
You MUST format each question as a bold text and each option as a Markdown bullet point so they appear on separate lines. Example format:
**Question 1:** [Question text]
- A. [Option A]
- B. [Option B]
- C. [Option C]
- D. [Option D]

ABSOLUTELY DO NOT PROVIDE THE ANSWERS IN THIS RESPONSE. ONLY PROVIDE THE QUESTIONS.
After listing the 5 questions, you must end with the following text:
"Hello 😊 Teacher Bee AI here 🐝 The quiz is waiting for you. Please answer in this format:
1-B, 2-…, 3-…, 4-…, 5-…
Teacher Bee AI is waiting for your answers to grade them ✨"`;
            } else if (isAnsweringQuiz) {
                systemInstruction = `You are Teacher Bee AI 🐝 - a dedicated AI Tutor. The student is submitting answers to the quiz you just provided.
Your task is to GRADE their answers based on the lecture context below.
For each question, explicitly state if they are Correct or Incorrect, and briefly explain WHY using the knowledge from the video.
Always maintain an encouraging, positive, and friendly tone.`;
            } else {
                systemInstruction = `You are Teacher Bee AI 🐝 - a dedicated AI Tutor. Please answer the student's request in a detailed, accurate, and clearly structured manner. Present it in clean Markdown, use bullet points, and bold important keywords.`;
            }

            promptMessage = `Student's request: "${message}"\n\nLecture information:\nCourse name: ${courseName}\nLesson name: ${lessonTitle}\n\nLecture content (Transcript):\n"""\n${fullTranscriptText}\n"""`;

        } else {
            // LUỒNG 2: Sử dụng RAG Vector Search cho các câu hỏi cụ thể
            let queryVector = [];
            try {
                const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
                const embeddingResult = await embeddingModel.embedContent(message);
                queryVector = embeddingResult.embedding.values;
            } catch (err) {
                console.error("Error creating embedding for question:", err.message);
            }

            const { contextText: retrievedContext, sources: retrievedSources } = retrieveRelevantContext(queryVector, chunks, { threshold: 0.7, maxWindows: 4 });
            let contextText = retrievedContext;
            sources = retrievedSources;

            // Sử dụng System Prompt phương pháp Feynman
            systemInstruction =
                `You are Teacher Bee AI 🐝 - a dedicated AI Tutor. The student has a question or needs an explanation for a concept in the lecture.\n\n` +
                `Core rules:\n` +
                `- Use the Feynman technique: Explain simply as if talking to a beginner.\n` +
                `- IF the student asks for quiz answers WITHOUT DOING IT THEMSELVES, ABSOLUTELY DO NOT GIVE THE ANSWERS. Politely refuse with exactly this sentence: "Teacher Bee AI understands you want to see the answers right away 😊 but for effective learning, you need to try it first to remember it longer 🐝👉 Since this is the Practice part, Teacher Bee AI cannot give the answers when you haven't tried. You just need to answer following this quick format: 1-B, 2-…, 3-…, 4-…, 5-…"\n` +
                `- Always relate your answer to the lecture context provided below.\n` +
                `- If possible, provide a relatable real-life example (analogy) to illustrate.\n` +
                `- If the student's question is out of scope or unrelated to the lesson, politely refuse to answer and redirect them back to the lesson.`;

            promptMessage =
                `Student's question: "${message}"\n\n` +
                `Based on the extracted context from the lecture below, please answer the student:\n\n` +
                `Lecture document (Context):\n"""\n${contextText}\n"""\n\n` +
                `Note: Refer to yourself as "Teacher Bee AI" and address the student as "you" in a friendly manner. Ensure the answer helps them apply the knowledge in practice.`;
        }

        // Nạp lịch sử chat (nếu có)
        let chatContentsArr = [];
        if (history && Array.isArray(history)) {
            // Đảm bảo không có 2 role 'user' nằm cạnh nhau (Gemini cấm điều này)
            history.forEach((msg) => {
                if (chatContentsArr.length > 0 && chatContentsArr[chatContentsArr.length - 1].role === msg.role) {
                    chatContentsArr[chatContentsArr.length - 1].parts[0].text += "\n" + msg.parts[0].text;
                } else {
                    chatContentsArr.push(msg);
                }
            });
        }

        if (chatContentsArr.length > 0 && chatContentsArr[chatContentsArr.length - 1].role === "user") {
            chatContentsArr[chatContentsArr.length - 1].parts[0].text += "\n\n" + promptMessage;
        } else {
            chatContentsArr.push({ role: "user", parts: [{ text: promptMessage }] });
        }

        // Hợp nhất chatContents hiện tại (từ Tóm tắt/Quiz) vào mảng cuối cùng
        const finalChatContents = [...chatContentsArr];
        if (chatContents.length > 0) {
            finalChatContents.unshift(...chatContents); // Đưa system context của transcript lên đầu
        }

        // Hàm generateContentWithRetry đã được chuyển ra ngoài function để DRY

        const responseResult = await generateContentWithRetry(chatModel, {
            contents: finalChatContents,
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

        // Bắt lỗi 503 Service Unavailable từ Google Gemini API
        if (error.status === 503 || (error.message && error.message.includes('503'))) {
            return res.status(503).json({
                message: 'Teacher Bee AI is currently overloaded due to too many students learning at the same time 🐝💦 Please press Resend in a few seconds!'
            });
        }

        return res.status(500).json({ message: 'Error calling AI. Please try again later.' });
    }
};

export const handleGetChatCredits = async (req, res) => {
    try {
        const userId = req.user?.id;
        const user = await db.User.findByPk(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        if (!user.lastCreditReset || new Date(user.lastCreditReset) < oneHourAgo) {
            user.aiCredits = 25;
            user.lastCreditReset = new Date();
            await user.save();
        }

        return res.status(200).json({ credits: user.aiCredits });
    } catch (error) {
        console.error("Error getting chat credits:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
