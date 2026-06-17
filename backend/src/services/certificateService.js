import db from '../models/index';

// 1. Get my certificates (with user & course info)
export const getMyCertificates = async (userId) => {
    try {
        const certificates = await db.Certificate.findAll({
            where: { userId },
            include: [{
                model: db.Course,
                as: 'course',
                attributes: ['id', 'name', 'slug', 'thumbnail', 'instructor', 'level'],
            }, {
                model: db.User,
                as: 'user',
                attributes: ['id', 'firstName', 'lastName', 'email'],
            }],
            order: [['issuedAt', 'DESC']],
        });
        return certificates;
    } catch (error) {
        console.error('Lỗi lấy chứng chỉ cá nhân:', error);
        throw error;
    }
};

// 2. Verify certificate by code (Public API)
export const verifyCertificate = async (certificateCode) => {
    try {
        const cert = await db.Certificate.findOne({
            where: { certificateCode },
            include: [
                {
                    model: db.Course,
                    as: 'course',
                    attributes: ['id', 'name', 'slug', 'thumbnail', 'instructor', 'level', 'duration'],
                },
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
        });

        if (!cert) {
            return { valid: false, message: 'Chứng chỉ không tồn tại hoặc không hợp lệ.' };
        }

        return {
            valid: true,
            certificate: {
                code: cert.certificateCode,
                issuedAt: cert.issuedAt,
                studentName: `${cert.user.firstName} ${cert.user.lastName}`,
                courseName: cert.course.name,
                instructor: cert.course.instructor,
                courseLevel: cert.course.level,
            },
        };
    } catch (error) {
        console.error('Lỗi kiểm tra chứng chỉ:', error);
        throw error;
    }
};
