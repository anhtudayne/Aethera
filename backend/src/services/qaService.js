import db from '../models';
import { Op } from 'sequelize';

const createQuestion = async (courseId, lessonId, userId, title, content) => {
    try {
        const question = await db.QAQuestion.create({
            courseId,
            lessonId,
            userId,
            title,
            content,
            upvotesCount: 0
        });
        
        return {
            status: 201,
            data: question,
            message: "Câu hỏi đã được tạo thành công"
        };
    } catch (error) {
        console.error("Error creating QA question:", error);
        return {
            status: 500,
            message: "Lỗi server khi tạo câu hỏi"
        };
    }
};

const getQuestions = async (courseId, filters = {}) => {
    try {
        const { lessonId, keyword, sortBy = 'recent', page = 1, limit = 10 } = filters;
        
        let whereClause = { courseId };
        
        if (lessonId && lessonId !== 'all') {
            whereClause.lessonId = lessonId;
        }
        
        if (keyword) {
            whereClause[Op.or] = [
                { title: { [Op.like]: `%${keyword}%` } },
                { content: { [Op.like]: `%${keyword}%` } }
            ];
        }

        let order = [['createdAt', 'DESC']];
        if (sortBy === 'recommended' || sortBy === 'upvoted') {
            order = [['upvotesCount', 'DESC'], ['createdAt', 'DESC']];
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await db.QAQuestion.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['id', 'image', 'firstName', 'lastName']
                },
                {
                    model: db.QAAnswer,
                    as: 'answers',
                    attributes: ['id']
                },
                {
                    model: db.Lesson,
                    as: 'lesson',
                    attributes: ['id', 'title']
                }
            ],
            order,
            limit: parseInt(limit),
            offset: parseInt(offset),
            distinct: true
        });

        // Map data to include answers count
        const mappedRows = rows.map(row => {
            const rowJson = row.toJSON();
            rowJson.answersCount = rowJson.answers ? rowJson.answers.length : 0;
            delete rowJson.answers;
            return rowJson;
        });

        return {
            status: 200,
            data: {
                questions: mappedRows,
                total: count,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page)
            }
        };
    } catch (error) {
        console.error("Error getting QA questions:", error);
        return {
            status: 500,
            message: "Lỗi server khi lấy danh sách câu hỏi: " + error.message,
            stack: error.stack
        };
    }
};

const getQuestionById = async (questionId) => {
    try {
        const question = await db.QAQuestion.findOne({
            where: { id: questionId },
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['id', 'image', 'firstName', 'lastName']
                },
                {
                    model: db.Lesson,
                    as: 'lesson',
                    attributes: ['id', 'title']
                },
                {
                    model: db.QAAnswer,
                    as: 'answers',
                    include: [
                        {
                            model: db.User,
                            as: 'user',
                            attributes: ['id', 'image', 'firstName', 'lastName']
                        }
                    ]
                }
            ],
            order: [
                [{ model: db.QAAnswer, as: 'answers' }, 'createdAt', 'ASC']
            ]
        });

        if (!question) {
            return {
                status: 404,
                message: "Không tìm thấy câu hỏi"
            };
        }

        return {
            status: 200,
            data: question
        };
    } catch (error) {
        console.error("Error getting QA question by id:", error);
        return {
            status: 500,
            message: "Lỗi server khi lấy chi tiết câu hỏi"
        };
    }
};

const createAnswer = async (questionId, userId, content, isInstructor = false) => {
    try {
        const answer = await db.QAAnswer.create({
            questionId,
            userId,
            content,
            isInstructor
        });

        // Fetch user data to return back
        const answerWithUser = await db.QAAnswer.findOne({
            where: { id: answer.id },
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['id', 'image', 'firstName', 'lastName']
                }
            ]
        });

        return {
            status: 201,
            data: answerWithUser,
            message: "Trả lời thành công"
        };
    } catch (error) {
        console.error("Error creating QA answer:", error);
        return {
            status: 500,
            message: "Lỗi server khi trả lời câu hỏi"
        };
    }
};

const toggleUpvote = async (questionId, userId) => {
    const t = await db.sequelize.transaction();
    try {
        const question = await db.QAQuestion.findByPk(questionId, { transaction: t });
        
        if (!question) {
            await t.rollback();
            return {
                status: 404,
                message: "Không tìm thấy câu hỏi"
            };
        }

        const existingUpvote = await db.QAUpvote.findOne({
            where: { questionId, userId },
            transaction: t
        });

        let isUpvoted = false;

        if (existingUpvote) {
            // Remove upvote
            await existingUpvote.destroy({ transaction: t });
            await question.decrement('upvotesCount', { transaction: t });
            isUpvoted = false;
        } else {
            // Add upvote
            await db.QAUpvote.create({ questionId, userId }, { transaction: t });
            await question.increment('upvotesCount', { transaction: t });
            isUpvoted = true;
        }

        await t.commit();
        
        // Return updated count
        const updatedQuestion = await db.QAQuestion.findByPk(questionId);

        return {
            status: 200,
            data: {
                isUpvoted,
                upvotesCount: updatedQuestion.upvotesCount
            },
            message: isUpvoted ? "Đã upvote" : "Đã bỏ upvote"
        };
    } catch (error) {
        await t.rollback();
        console.error("Error toggling upvote:", error);
        return {
            status: 500,
            message: "Lỗi server khi xử lý upvote"
        };
    }
};

const getUserUpvotes = async (courseId, userId) => {
    try {
        // Find all upvotes by user for questions in this course
        const upvotes = await db.QAUpvote.findAll({
            where: { userId },
            include: [
                {
                    model: db.QAQuestion,
                    as: 'question',
                    where: { courseId },
                    attributes: ['id']
                }
            ]
        });
        
        const upvotedQuestionIds = upvotes.map(u => u.questionId);
        return {
            status: 200,
            data: upvotedQuestionIds
        };
    } catch (error) {
        console.error("Error getting user upvotes:", error);
        return {
            status: 500,
            message: "Lỗi server"
        };
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
