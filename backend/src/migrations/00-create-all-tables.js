'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // ========== 1. Users ==========
        await queryInterface.createTable('Users', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            email: { type: Sequelize.STRING, allowNull: false, unique: true },
            password: { type: Sequelize.STRING, allowNull: true },
            firstName: { type: Sequelize.STRING, allowNull: false },
            lastName: { type: Sequelize.STRING, allowNull: false },
            phoneNumber: { type: Sequelize.STRING(10), allowNull: true },
            address: { type: Sequelize.STRING, allowNull: true },
            gender: { type: Sequelize.BOOLEAN, defaultValue: true },
            image: { type: Sequelize.STRING, allowNull: true },
            roleId: { type: Sequelize.STRING, defaultValue: 'user' },
            isActive: { type: Sequelize.BOOLEAN, defaultValue: false },
            otp: { type: Sequelize.STRING, allowNull: true },
            otpExpires: { type: Sequelize.DATE, allowNull: true },
            googleId: { type: Sequelize.STRING, allowNull: true, unique: true },
            provider: { type: Sequelize.ENUM('local', 'google'), defaultValue: 'local' },
            createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
        });

        // ========== 2. Categories ==========
        await queryInterface.createTable('Categories', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            name: { type: Sequelize.STRING, allowNull: false },
            slug: { type: Sequelize.STRING, allowNull: false, unique: true },
            description: { type: Sequelize.STRING, allowNull: true },
            image: { type: Sequelize.STRING, allowNull: true },
            createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
        });

        // ========== 3. Courses ==========
        await queryInterface.createTable('Courses', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            name: { type: Sequelize.STRING, allowNull: false },
            slug: { type: Sequelize.STRING, allowNull: false, unique: true },
            description: { type: Sequelize.TEXT, allowNull: true },
            shortDescription: { type: Sequelize.STRING, allowNull: true },
            thumbnail: { type: Sequelize.STRING, allowNull: true },
            price: { type: Sequelize.DECIMAL(12, 0), allowNull: false },
            salePrice: { type: Sequelize.DECIMAL(12, 0), allowNull: true },
            instructor: { type: Sequelize.STRING, allowNull: false },
            duration: { type: Sequelize.STRING, allowNull: true },
            level: { type: Sequelize.ENUM('beginner', 'intermediate', 'advanced'), defaultValue: 'beginner' },
            language: { type: Sequelize.STRING, defaultValue: 'Tiếng Việt' },
            totalLessons: { type: Sequelize.INTEGER, defaultValue: 0 },
            totalStudents: { type: Sequelize.INTEGER, defaultValue: 0 },
            rating: { type: Sequelize.DECIMAL(2, 1), defaultValue: 0 },
            ratingCount: { type: Sequelize.INTEGER, defaultValue: 0 },
            isFeatured: { type: Sequelize.BOOLEAN, defaultValue: false },
            isNewArrival: { type: Sequelize.BOOLEAN, defaultValue: false },
            isBestSeller: { type: Sequelize.BOOLEAN, defaultValue: false },
            status: { type: Sequelize.ENUM('draft', 'published'), defaultValue: 'draft' },
            categoryId: {
                type: Sequelize.INTEGER, allowNull: true,
                references: { model: 'Categories', key: 'id' },
                onUpdate: 'CASCADE', onDelete: 'SET NULL',
            },
            viewCount: { type: Sequelize.INTEGER, defaultValue: 0 },
            requirements: { type: Sequelize.TEXT, allowNull: true },
            whatYouWillLearn: { type: Sequelize.TEXT, allowNull: true },
            targetAudience: { type: Sequelize.TEXT, allowNull: true },
            createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
        });
        await queryInterface.addIndex('Courses', ['categoryId']);
        await queryInterface.addIndex('Courses', ['status']);

        // ========== 4. CourseImages ==========
        await queryInterface.createTable('CourseImages', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            courseId: {
                type: Sequelize.INTEGER, allowNull: false,
                references: { model: 'Courses', key: 'id' },
                onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },
            imageUrl: { type: Sequelize.STRING, allowNull: false },
            isPrimary: { type: Sequelize.BOOLEAN, defaultValue: false },
            sortOrder: { type: Sequelize.INTEGER, defaultValue: 0 },
            createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
        });

        // ========== 5. Sections ==========
        await queryInterface.createTable('Sections', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            courseId: {
                type: Sequelize.INTEGER, allowNull: false,
                references: { model: 'Courses', key: 'id' },
                onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },
            title: { type: Sequelize.STRING, allowNull: false },
            order: { type: Sequelize.INTEGER, defaultValue: 0 },
            createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
        });

        // ========== 6. Lessons ==========
        await queryInterface.createTable('Lessons', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            sectionId: {
                type: Sequelize.INTEGER, allowNull: false,
                references: { model: 'Sections', key: 'id' },
                onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },
            title: { type: Sequelize.STRING, allowNull: false },
            type: { type: Sequelize.ENUM('video', 'text'), defaultValue: 'video' },
            content: { type: Sequelize.TEXT, allowNull: true },
            videoUrl: { type: Sequelize.STRING, allowNull: true },
            duration: { type: Sequelize.STRING, allowNull: true },
            order: { type: Sequelize.INTEGER, defaultValue: 0 },
            isFreePreview: { type: Sequelize.BOOLEAN, defaultValue: false },
            createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
        });

        // ========== 7. Carts ==========
        await queryInterface.createTable('Carts', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            userId: {
                type: Sequelize.INTEGER, allowNull: false,
                references: { model: 'Users', key: 'id' },
                onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },
            courseId: {
                type: Sequelize.INTEGER, allowNull: false,
                references: { model: 'Courses', key: 'id' },
                onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },
            createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
        });
        await queryInterface.addIndex('Carts', ['userId', 'courseId'], { unique: true, name: 'carts_user_course_unique' });

        // ========== 8. Orders ==========
        await queryInterface.createTable('Orders', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            code: { type: Sequelize.STRING, allowNull: false, unique: true },
            userId: {
                type: Sequelize.INTEGER, allowNull: false,
                references: { model: 'Users', key: 'id' },
                onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },
            totalAmount: { type: Sequelize.DECIMAL(12, 0), allowNull: false },
            status: { type: Sequelize.ENUM('pending', 'paid', 'cancelled'), defaultValue: 'pending' },
            paymentMethod: { type: Sequelize.STRING, allowNull: true },
            createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
        });

        // ========== 9. OrderItems ==========
        await queryInterface.createTable('OrderItems', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            orderId: {
                type: Sequelize.INTEGER, allowNull: false,
                references: { model: 'Orders', key: 'id' },
                onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },
            courseId: {
                type: Sequelize.INTEGER, allowNull: false,
                references: { model: 'Courses', key: 'id' },
                onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },
            price: { type: Sequelize.DECIMAL(12, 0), allowNull: false },
            createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
        });

        // ========== 10. UserCourses (Enrollment) ==========
        await queryInterface.createTable('UserCourses', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            userId: {
                type: Sequelize.INTEGER, allowNull: false,
                references: { model: 'Users', key: 'id' },
                onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },
            courseId: {
                type: Sequelize.INTEGER, allowNull: false,
                references: { model: 'Courses', key: 'id' },
                onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },
            status: { type: Sequelize.ENUM('active', 'suspended', 'completed'), defaultValue: 'active' },
            progressPercent: { type: Sequelize.INTEGER, defaultValue: 0 },
            enrolledAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            completedAt: { type: Sequelize.DATE, allowNull: true },
            lastAccessedAt: { type: Sequelize.DATE, allowNull: true },
            createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
        });
        await queryInterface.addIndex('UserCourses', ['userId', 'courseId'], { unique: true, name: 'usercourses_user_course_unique' });

        // ========== 11. LessonProgresses ==========
        await queryInterface.createTable('LessonProgresses', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            userId: {
                type: Sequelize.INTEGER, allowNull: false,
                references: { model: 'Users', key: 'id' },
                onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },
            lessonId: {
                type: Sequelize.INTEGER, allowNull: false,
                references: { model: 'Lessons', key: 'id' },
                onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },
            courseId: {
                type: Sequelize.INTEGER, allowNull: false,
                references: { model: 'Courses', key: 'id' },
                onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },
            isCompleted: { type: Sequelize.BOOLEAN, defaultValue: false },
            completedAt: { type: Sequelize.DATE, allowNull: true },
            lastWatchedPosition: { type: Sequelize.INTEGER, defaultValue: 0 },
            createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
        });
        await queryInterface.addIndex('LessonProgresses', ['userId', 'lessonId'], { unique: true, name: 'lessonprogresses_user_lesson_unique' });
        await queryInterface.addIndex('LessonProgresses', ['userId', 'courseId'], { name: 'lessonprogresses_user_course_idx' });

        // ========== 12. Certificates ==========
        await queryInterface.createTable('Certificates', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            userId: {
                type: Sequelize.INTEGER, allowNull: false,
                references: { model: 'Users', key: 'id' },
                onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },
            courseId: {
                type: Sequelize.INTEGER, allowNull: false,
                references: { model: 'Courses', key: 'id' },
                onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },
            certificateCode: { type: Sequelize.STRING, allowNull: false, unique: true },
            issuedAt: { type: Sequelize.DATE, allowNull: false },
            createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
        });
        await queryInterface.addIndex('Certificates', ['userId', 'courseId'], { unique: true, name: 'certificates_user_course_unique' });

        // ========== 13. Reviews ==========
        await queryInterface.createTable('Reviews', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            userId: {
                type: Sequelize.INTEGER, allowNull: false,
                references: { model: 'Users', key: 'id' },
                onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },
            courseId: {
                type: Sequelize.INTEGER, allowNull: false,
                references: { model: 'Courses', key: 'id' },
                onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },
            rating: { type: Sequelize.INTEGER, allowNull: false },
            comment: { type: Sequelize.TEXT, allowNull: true },
            createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
        });
        await queryInterface.addIndex('Reviews', ['userId', 'courseId'], { unique: true, name: 'reviews_user_course_unique' });

        // ========== 14. FavoriteCourses ==========
        await queryInterface.createTable('FavoriteCourses', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            userId: {
                type: Sequelize.INTEGER, allowNull: false,
                references: { model: 'Users', key: 'id' },
                onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },
            courseId: {
                type: Sequelize.INTEGER, allowNull: false,
                references: { model: 'Courses', key: 'id' },
                onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },
            createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
        });
        await queryInterface.addIndex('FavoriteCourses', ['userId', 'courseId'], { unique: true, name: 'favoritecourses_user_course_unique' });

        // ========== 15. Notifications ==========
        await queryInterface.createTable('Notifications', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            userId: {
                type: Sequelize.INTEGER, allowNull: false,
                references: { model: 'Users', key: 'id' },
                onUpdate: 'CASCADE', onDelete: 'CASCADE',
            },
            type: {
                type: Sequelize.ENUM('order_created', 'order_paid', 'new_review', 'course_completed', 'certificate_issued'),
                allowNull: false,
            },
            title: { type: Sequelize.STRING, allowNull: false },
            message: { type: Sequelize.TEXT, allowNull: false },
            data: { type: Sequelize.JSON, allowNull: true },
            isRead: { type: Sequelize.BOOLEAN, defaultValue: false },
            createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
        });
        await queryInterface.addIndex('Notifications', ['userId', 'isRead'], { name: 'notifications_user_read_idx' });
    },

    async down(queryInterface) {
        // Drop in reverse order (dependencies last)
        const tables = [
            'Notifications', 'FavoriteCourses', 'Reviews', 'Certificates',
            'LessonProgresses', 'UserCourses', 'OrderItems', 'Orders',
            'Carts', 'Lessons', 'Sections', 'CourseImages', 'Courses',
            'Categories', 'Users',
        ];
        for (const table of tables) {
            await queryInterface.dropTable(table, { cascade: true });
        }
    },
};
