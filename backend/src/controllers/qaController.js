import qaService from '../services/qaService';

const createQuestion = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { lessonId, title, content } = req.body;
        const userId = req.user.id; // From verifyToken middleware

        if (!title || !content || !lessonId) {
            return res.status(400).json({ status: 400, message: "Thiếu thông tin bắt buộc" });
        }

        const response = await qaService.createQuestion(courseId, lessonId, userId, title, content);
        return res.status(response.status).json(response);
    } catch (error) {
        console.error("Controller Error - createQuestion:", error);
        return res.status(500).json({ status: 500, message: "Lỗi server" });
    }
};

const getQuestions = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const filters = {
            lessonId: req.query.lessonId,
            keyword: req.query.keyword,
            sortBy: req.query.sortBy,
            page: req.query.page || 1,
            limit: req.query.limit || 10
        };

        const response = await qaService.getQuestions(courseId, filters);
        return res.status(response.status).json(response);
    } catch (error) {
        console.error("Controller Error - getQuestions:", error);
        return res.status(500).json({ status: 500, message: "Lỗi server" });
    }
};

const getQuestionById = async (req, res) => {
    try {
        const questionId = req.params.questionId;
        const response = await qaService.getQuestionById(questionId);
        return res.status(response.status).json(response);
    } catch (error) {
        console.error("Controller Error - getQuestionById:", error);
        return res.status(500).json({ status: 500, message: "Lỗi server" });
    }
};

const createAnswer = async (req, res) => {
    try {
        const questionId = req.params.questionId;
        const { content } = req.body;
        const userId = req.user.id;
        const isInstructor = req.user.role === 'instructor' || req.user.role === 'admin';

        if (!content) {
            return res.status(400).json({ status: 400, message: "Nội dung không được để trống" });
        }

        const response = await qaService.createAnswer(questionId, userId, content, isInstructor);
        return res.status(response.status).json(response);
    } catch (error) {
        console.error("Controller Error - createAnswer:", error);
        return res.status(500).json({ status: 500, message: "Lỗi server" });
    }
};

const toggleUpvote = async (req, res) => {
    try {
        const questionId = req.params.questionId;
        const userId = req.user.id;

        const response = await qaService.toggleUpvote(questionId, userId);
        return res.status(response.status).json(response);
    } catch (error) {
        console.error("Controller Error - toggleUpvote:", error);
        return res.status(500).json({ status: 500, message: "Lỗi server" });
    }
};

const getUserUpvotes = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const userId = req.user.id;

        const response = await qaService.getUserUpvotes(courseId, userId);
        return res.status(response.status).json(response);
    } catch (error) {
        console.error("Controller Error - getUserUpvotes:", error);
        return res.status(500).json({ status: 500, message: "Lỗi server" });
    }
};

export default {
    createQuestion,
    getQuestions,
    getQuestionById,
    createAnswer,
    toggleUpvote,
    getUserUpvotes
};
