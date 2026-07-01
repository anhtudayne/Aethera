import express from 'express';
import axios from 'axios';

const router = express.Router();

const SYSTEM_PROMPT = `Bạn là Trợ lý học tập Aethera AI (Aethera AI Assistant).
Nhiệm vụ của bạn là giúp người dùng tìm hiểu thông tin về Aethera (nền tảng học trực tuyến cao cấp về công nghệ, lập trình, khoa học dữ liệu, thiết kế) hoặc tìm kiếm các khóa học thích hợp.

Bạn PHẢI phản hồi theo đúng cấu trúc định dạng JSON sau:
{
  "type": "chat" | "search",
  "message": "Nội dung trả lời chi tiết bằng Tiếng Việt...",
  "searchKeyword": "Tên khóa học bằng tiếng Anh/Việt (ví dụ: 'Flutter', 'React', 'Python', 'NodeJS') nếu người dùng đang hỏi hoặc có ý định tìm khóa học đó, ngược lại là null"
}

Quy tắc ứng xử:
1. Khi người dùng chào hỏi hoặc hỏi thông tin về website Aethera:
   - Trả lời giới thiệu tổng quan về Aethera (nền tảng học lập trình & công nghệ chất lượng cao, cung cấp các chứng chỉ uy tín, hỗ trợ xuất PDF và xác thực công khai).
   - Đặt "type" là "chat" và "searchKeyword" là null.
   - Kết thúc câu trả lời bằng việc hỏi xem người dùng có cần trợ giúp gì thêm không.
   
2. Khi người dùng hỏi về bất kỳ khóa học cụ thể nào (Ví dụ: "Có khóa học Flutter không?", "Tôi muốn học React", "Tìm khóa học Python"):
   - Đặt "type" là "search".
   - Đặt "searchKeyword" là từ khóa tên khóa học đó (ví dụ: "Flutter", "React", "Python").
   - Đặt "message" là câu trả lời thông báo lịch sự rằng bạn đã tìm thấy các khóa học tương ứng và hệ thống đang tự động chuyển hướng họ đến trang danh sách khóa học để xem thông tin chi tiết.
`;

// Helper for local rule-based fallback with dynamic keyword extraction
function getLocalFallbackResponse(userMessage) {
  const normalized = userMessage.toLowerCase().trim();

  // 1. Check for greetings or questions about the website
  if (
    normalized.includes('xin chào') ||
    normalized.includes('hello') ||
    normalized.includes('hi') ||
    normalized.includes('giới thiệu') ||
    normalized.includes('website') ||
    normalized.includes('aethera') ||
    normalized.includes('thông tin')
  ) {
    return {
      type: 'chat',
      message: 'Xin chào! Tôi là Trợ lý học tập Aethera AI. Aethera là nền tảng học trực tuyến công nghệ cao cấp, chuyên cung cấp các khóa học chất lượng từ Lập trình Web (React, Node.js), Mobile App (Flutter, React Native) đến Khoa học dữ liệu, Thiết kế UI/UX. Bạn có muốn tôi trợ giúp tìm kiếm khóa học nào hôm nay không?',
      searchKeyword: null
    };
  }

  // 2. Dynamic keyword extraction by stripping common stop words
  const stopwords = [
    'tôi muốn tìm', 'tôi muốn học', 'tôi muốn', 'tìm khóa học', 'tìm khoá học',
    'khóa học', 'khoá học', 'có khóa', 'có khoá', 'không', 'nhỉ', 'giúp',
    'cho tôi', 'cho minh', 'cho mình', 'ở đâu', 'như thế nào', 'học về',
    'hướng dẫn', 'tự học', 'lớp học', 'dạy', 'học', 'tìm', 'kiếm', 'có', 'ko', 'k'
  ];

  let extracted = normalized;
  for (const sw of stopwords) {
    // Escape regex characters just in case
    const safeSw = sw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    extracted = extracted.replace(new RegExp(`\\b${safeSw}\\b`, 'g'), '');
    extracted = extracted.replace(new RegExp(safeSw, 'g'), '');
  }

  // Clean up special punctuation and spaces
  extracted = extracted.replace(/[?.!,;:]/g, '').replace(/\s+/g, ' ').trim();

  // If we have a reasonable keyword left (between 2 and 30 chars), treat it as a dynamic course search
  if (extracted.length >= 2 && extracted.length <= 30) {
    const formattedKw = extracted
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return {
      type: 'search',
      message: `Tôi đã tìm thấy các khóa học chất lượng cao liên quan đến "${formattedKw}". Hệ thống đang tự động chuyển hướng bạn đến trang danh sách khóa học để tham khảo nhé!`,
      searchKeyword: formattedKw
    };
  }

  // Generic fallback
  return {
    type: 'chat',
    message: 'Tôi là Trợ lý học tập Aethera AI. Bạn có thể chào tôi để hỏi về website, hoặc gõ tên khóa học (ví dụ: Flutter, React, Python) để tôi tìm kiếm giúp bạn nhé!',
    searchKeyword: null
  };
}

router.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ status: 400, message: 'Message is required' });
  }

  const apiKey = process.env.GROQ_API_KEY;

  // If no API Key configured, run local rules immediately
  if (!apiKey || apiKey.includes('your_groq_api_key_here') || apiKey === '') {
    console.log('GROQ_API_KEY not set. Using local rule-based fallback.');
    const fallback = getLocalFallbackResponse(message);
    return res.json({ status: 200, data: fallback });
  }

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        timeout: 8000
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;
    const parsedData = JSON.parse(content);

    return res.json({ status: 200, data: parsedData });
  } catch (error) {
    console.error('Groq API Error, using local fallback:', error.message);
    const fallback = getLocalFallbackResponse(message);
    return res.json({ status: 200, data: fallback });
  }
});

export default router;
