'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
    async up(queryInterface) {
        const salt = bcrypt.genSaltSync(10);
        const adminHash = bcrypt.hashSync('Admin@123', salt);
        const teacherHash = bcrypt.hashSync('Teacher@123', salt);
        const studentHash = bcrypt.hashSync('Student@123', salt);

        // ========== 1. Users ==========
        const users = [
            {
                id: 1,
                email: 'admin@elearning.com',
                password: adminHash,
                firstName: 'Quản trị viên',
                lastName: 'Hệ thống',
                phoneNumber: '0912345678',
                address: 'Hà Nội',
                gender: true,
                image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
                roleId: 'admin',
                isActive: true,
                provider: 'local',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 2,
                email: 'teacher@elearning.com',
                password: teacherHash,
                firstName: 'Giảng viên',
                lastName: 'Ưu tú',
                phoneNumber: '0987654321',
                address: 'TP. Hồ Chí Minh',
                gender: false,
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
                roleId: 'instructor',
                isActive: true,
                provider: 'local',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 3,
                email: 'student@elearning.com',
                password: studentHash,
                firstName: 'Học viên',
                lastName: 'Chăm chỉ',
                phoneNumber: '0901234567',
                address: 'Đà Nẵng',
                gender: true,
                image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150',
                roleId: 'user',
                isActive: true,
                provider: 'local',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        try {
            await queryInterface.bulkInsert('Users', users);
        } catch (error) {
            console.log('⚠️ Dữ liệu Users đã tồn tại, tự động bỏ qua.');
        }

        // ========== 2. UserCourses (Enrollments) ==========
        const userCourses = [
            // Student (id: 3) enrolled in React JS (id: 1) - Completed
            {
                id: 1,
                userId: 3,
                courseId: 1,
                status: 'completed',
                progressPercent: 100,
                enrolledAt: new Date('2025-06-01'),
                completedAt: new Date('2025-06-20'),
                lastAccessedAt: new Date('2025-06-20'),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            // Student (id: 3) enrolled in Node.js (id: 2) - Active
            {
                id: 2,
                userId: 3,
                courseId: 2,
                status: 'active',
                progressPercent: 33, // 1/3 lessons completed
                enrolledAt: new Date('2025-06-10'),
                completedAt: null,
                lastAccessedAt: new Date('2025-06-12'),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            // Student (id: 3) enrolled in HTML & CSS (id: 3) - Completed
            {
                id: 3,
                userId: 3,
                courseId: 3,
                status: 'completed',
                progressPercent: 100,
                enrolledAt: new Date('2025-05-15'),
                completedAt: new Date('2025-05-25'),
                lastAccessedAt: new Date('2025-05-25'),
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        try {
            await queryInterface.bulkInsert('UserCourses', userCourses);
        } catch (error) {
            console.log('⚠️ Dữ liệu UserCourses đã tồn tại, tự động bỏ qua.');
        }

        // ========== 3. LessonProgresses ==========
        const progresses = [
            // Course 1 (React JS) - all 7 lessons completed
            { userId: 3, lessonId: 1, courseId: 1, isCompleted: true, completedAt: new Date('2025-06-02'), lastWatchedPosition: 320, createdAt: new Date(), updatedAt: new Date() },
            { userId: 3, lessonId: 2, courseId: 1, isCompleted: true, completedAt: new Date('2025-06-03'), lastWatchedPosition: 615, createdAt: new Date(), updatedAt: new Date() },
            { userId: 3, lessonId: 3, courseId: 1, isCompleted: true, completedAt: new Date('2025-06-05'), lastWatchedPosition: 765, createdAt: new Date(), updatedAt: new Date() },
            { userId: 3, lessonId: 4, courseId: 1, isCompleted: true, completedAt: new Date('2025-06-10'), lastWatchedPosition: 930, createdAt: new Date(), updatedAt: new Date() },
            { userId: 3, lessonId: 5, courseId: 1, isCompleted: true, completedAt: new Date('2025-06-12'), lastWatchedPosition: 480, createdAt: new Date(), updatedAt: new Date() },
            { userId: 3, lessonId: 6, courseId: 1, isCompleted: true, completedAt: new Date('2025-06-15'), lastWatchedPosition: 1100, createdAt: new Date(), updatedAt: new Date() },
            { userId: 3, lessonId: 7, courseId: 1, isCompleted: true, completedAt: new Date('2025-06-20'), lastWatchedPosition: 1360, createdAt: new Date(), updatedAt: new Date() },

            // Course 2 (Node.js) - 1/3 lessons completed (lessons 8, 9, 10 are inside sections 4 & 5)
            { userId: 3, lessonId: 8, courseId: 2, isCompleted: true, completedAt: new Date('2025-06-11'), lastWatchedPosition: 495, createdAt: new Date(), updatedAt: new Date() },
            { userId: 3, lessonId: 9, courseId: 2, isCompleted: false, completedAt: null, lastWatchedPosition: 200, createdAt: new Date(), updatedAt: new Date() },
            { userId: 3, lessonId: 10, courseId: 2, isCompleted: false, completedAt: null, lastWatchedPosition: 0, createdAt: new Date(), updatedAt: new Date() },

            // Course 3 (HTML & CSS) - all 4 lessons completed (lessons 11, 12, 13, 14)
            { userId: 3, lessonId: 11, courseId: 3, isCompleted: true, completedAt: new Date('2025-05-16'), lastWatchedPosition: 600, createdAt: new Date(), updatedAt: new Date() },
            { userId: 3, lessonId: 12, courseId: 3, isCompleted: true, completedAt: new Date('2025-05-18'), lastWatchedPosition: 300, createdAt: new Date(), updatedAt: new Date() },
            { userId: 3, lessonId: 13, courseId: 3, isCompleted: true, completedAt: new Date('2025-05-22'), lastWatchedPosition: 920, createdAt: new Date(), updatedAt: new Date() },
            { userId: 3, lessonId: 14, courseId: 3, isCompleted: true, completedAt: new Date('2025-05-25'), lastWatchedPosition: 765, createdAt: new Date(), updatedAt: new Date() }
        ];
        try {
            await queryInterface.bulkInsert('LessonProgresses', progresses);
        } catch (error) {
            console.log('⚠️ Dữ liệu LessonProgresses đã tồn tại, tự động bỏ qua.');
        }

        // ========== 4. Certificates ==========
        const certificates = [
            {
                userId: 3,
                courseId: 1,
                certificateCode: 'CERT-2025-000001',
                issuedAt: new Date('2025-06-20'),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: 3,
                courseId: 3,
                certificateCode: 'CERT-2025-000002',
                issuedAt: new Date('2025-05-25'),
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        try {
            await queryInterface.bulkInsert('Certificates', certificates);
        } catch (error) {
            console.log('⚠️ Dữ liệu Certificates đã tồn tại, tự động bỏ qua.');
        }

        // ========== 5. Reviews ==========
        const reviews = [
            {
                userId: 3,
                courseId: 1,
                rating: 5,
                comment: 'Khóa học tuyệt vời! Nội dung rất chi tiết và dễ học.',
                createdAt: new Date('2025-06-21'),
                updatedAt: new Date('2025-06-21')
            },
            {
                userId: 3,
                courseId: 3,
                rating: 4,
                comment: 'Bài tập thực hành rất hay, giảng viên nhiệt tình hỗ trợ.',
                createdAt: new Date('2025-05-26'),
                updatedAt: new Date('2025-05-26')
            }
        ];
        try {
            await queryInterface.bulkInsert('Reviews', reviews);
        } catch (error) {
            console.log('⚠️ Dữ liệu Reviews đã tồn tại, tự động bỏ qua.');
        }

        // ========== 6. FavoriteCourses ==========
        const favorites = [
            { userId: 3, courseId: 2, createdAt: new Date(), updatedAt: new Date() },
            { userId: 3, courseId: 4, createdAt: new Date(), updatedAt: new Date() }
        ];
        try {
            await queryInterface.bulkInsert('FavoriteCourses', favorites);
        } catch (error) {
            console.log('⚠️ Dữ liệu FavoriteCourses đã tồn tại, tự động bỏ qua.');
        }

        // ========== 7. Notifications ==========
        const notifications = [
            {
                userId: 3,
                type: 'course_completed',
                title: 'Hoàn thành khóa học React JS',
                message: 'Chúc mừng bạn đã hoàn thành khóa học "React JS Từ Zero Đến Hero"!',
                isRead: false,
                createdAt: new Date('2025-06-20'),
                updatedAt: new Date('2025-06-20')
            },
            {
                userId: 3,
                type: 'certificate_issued',
                title: 'Chứng chỉ mới đã sẵn sàng',
                message: 'Chứng chỉ hoàn thành khóa học React JS đã được cấp cho bạn.',
                isRead: true,
                createdAt: new Date('2025-06-20'),
                updatedAt: new Date('2025-06-20')
            }
        ];
        try {
            await queryInterface.bulkInsert('Notifications', notifications);
        } catch (error) {
            console.log('⚠️ Dữ liệu Notifications đã tồn tại, tự động bỏ qua.');
        }
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('Notifications', null, {});
        await queryInterface.bulkDelete('FavoriteCourses', null, {});
        await queryInterface.bulkDelete('Reviews', null, {});
        await queryInterface.bulkDelete('Certificates', null, {});
        await queryInterface.bulkDelete('LessonProgresses', null, {});
        await queryInterface.bulkDelete('UserCourses', null, {});
        await queryInterface.bulkDelete('Users', null, {});
    },
};
