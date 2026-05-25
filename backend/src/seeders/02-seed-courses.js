'use strict';
module.exports = {
    async up(queryInterface) {
        const courses = [
            { name: 'React.js & Next.js từ Zero đến Hero', slug: 'reactjs-nextjs-zero-to-hero', description: 'Khóa học toàn diện về React.js và Next.js, từ cơ bản đến nâng cao. Học cách xây dựng ứng dụng web hiện đại với Server-Side Rendering.', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80', price: 1499000, salePrice: 799000, instructor: 'Nguyễn Văn An', duration: '42 giờ', level: 'intermediate', totalLessons: 180, totalStudents: 12500, rating: 4.8, isFeatured: true, isBestSeller: true, isNewArrival: false, categoryId: 1 },
            { name: 'Node.js Backend Master Class', slug: 'nodejs-backend-master-class', description: 'Xây dựng REST API chuyên nghiệp với Node.js, Express, MongoDB và MySQL. Bao gồm Authentication, Authorization, Testing.', thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&q=80', price: 1299000, salePrice: 649000, instructor: 'Trần Minh Đức', duration: '38 giờ', level: 'intermediate', totalLessons: 150, totalStudents: 8900, rating: 4.7, isFeatured: true, isBestSeller: false, isNewArrival: false, categoryId: 1 },
            { name: 'HTML, CSS & JavaScript cho người mới', slug: 'html-css-javascript-co-ban', description: 'Bước đầu tiên để trở thành lập trình viên web. Học HTML5, CSS3, JavaScript ES6+ từ cơ bản nhất.', thumbnail: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=600&q=80', price: 599000, salePrice: null, instructor: 'Lê Thị Hương', duration: '24 giờ', level: 'beginner', totalLessons: 100, totalStudents: 25000, rating: 4.9, isFeatured: false, isBestSeller: true, isNewArrival: false, categoryId: 1 },
            { name: 'TypeScript & NestJS API Development', slug: 'typescript-nestjs-api', description: 'Xây dựng API enterprise-grade với TypeScript và NestJS framework. Microservices, GraphQL, WebSocket.', thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&q=80', price: 1799000, salePrice: 999000, instructor: 'Phạm Quốc Bảo', duration: '48 giờ', level: 'advanced', totalLessons: 200, totalStudents: 4200, rating: 4.6, isFeatured: true, isBestSeller: false, isNewArrival: true, categoryId: 1 },
            { name: 'Flutter & Dart Complete Guide', slug: 'flutter-dart-complete-guide', description: 'Phát triển ứng dụng iOS & Android với Flutter. UI đẹp, state management, Firebase integration.', thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80', price: 1399000, salePrice: 699000, instructor: 'Hoàng Đình Nam', duration: '36 giờ', level: 'intermediate', totalLessons: 160, totalStudents: 7800, rating: 4.7, isFeatured: true, isBestSeller: true, isNewArrival: false, categoryId: 2 },
            { name: 'React Native Mobile Development', slug: 'react-native-mobile', description: 'Xây dựng ứng dụng mobile cross-platform với React Native. Navigation, Redux, API Integration.', thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&q=80', price: 1199000, salePrice: null, instructor: 'Nguyễn Thành Long', duration: '30 giờ', level: 'intermediate', totalLessons: 120, totalStudents: 5600, rating: 4.5, isFeatured: false, isBestSeller: false, isNewArrival: true, categoryId: 2 },
            { name: 'Kotlin Android từ A-Z', slug: 'kotlin-android-a-z', description: 'Lập trình Android native với Kotlin. Jetpack Compose, Room Database, Retrofit.', thumbnail: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=600&q=80', price: 999000, salePrice: 499000, instructor: 'Vũ Anh Tuấn', duration: '28 giờ', level: 'beginner', totalLessons: 110, totalStudents: 6200, rating: 4.6, isFeatured: false, isBestSeller: true, isNewArrival: false, categoryId: 2 },
            { name: 'Python cho Data Science & AI', slug: 'python-data-science-ai', description: 'Học Python, NumPy, Pandas, Matplotlib, Scikit-learn. Phân tích dữ liệu và xây dựng model Machine Learning.', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80', price: 1599000, salePrice: 899000, instructor: 'Đỗ Thanh Hải', duration: '45 giờ', level: 'intermediate', totalLessons: 190, totalStudents: 15000, rating: 4.8, isFeatured: true, isBestSeller: true, isNewArrival: false, categoryId: 3 },
            { name: 'Deep Learning với TensorFlow', slug: 'deep-learning-tensorflow', description: 'Mạng neural network, CNN, RNN, NLP với TensorFlow và Keras. Thực hành project thực tế.', thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80', price: 1999000, salePrice: null, instructor: 'Lê Minh Trí', duration: '50 giờ', level: 'advanced', totalLessons: 210, totalStudents: 3800, rating: 4.7, isFeatured: true, isBestSeller: false, isNewArrival: true, categoryId: 3 },
            { name: 'SQL & Database Design', slug: 'sql-database-design', description: 'Thiết kế cơ sở dữ liệu chuẩn, viết truy vấn SQL tối ưu. MySQL, PostgreSQL, MongoDB.', thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&q=80', price: 799000, salePrice: 399000, instructor: 'Trần Văn Hùng', duration: '20 giờ', level: 'beginner', totalLessons: 80, totalStudents: 9500, rating: 4.5, isFeatured: false, isBestSeller: true, isNewArrival: false, categoryId: 3 },
            { name: 'UI/UX Design với Figma', slug: 'uiux-design-figma', description: 'Thiết kế giao diện người dùng chuyên nghiệp với Figma. Design System, Prototyping, User Research.', thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80', price: 1099000, salePrice: 549000, instructor: 'Ngô Thị Mai', duration: '25 giờ', level: 'beginner', totalLessons: 90, totalStudents: 11000, rating: 4.8, isFeatured: true, isBestSeller: true, isNewArrival: false, categoryId: 4 },
            { name: 'Adobe Photoshop & Illustrator', slug: 'photoshop-illustrator', description: 'Thành thạo Photoshop và Illustrator. Chỉnh sửa ảnh, thiết kế logo, banner chuyên nghiệp.', thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80', price: 899000, salePrice: null, instructor: 'Phạm Nhật Linh', duration: '22 giờ', level: 'beginner', totalLessons: 85, totalStudents: 7200, rating: 4.4, isFeatured: false, isBestSeller: false, isNewArrival: true, categoryId: 4 },
            { name: 'Motion Design & After Effects', slug: 'motion-design-after-effects', description: 'Tạo animation và motion graphics chuyên nghiệp với After Effects. Explainer videos, UI animation.', thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80', price: 1299000, salePrice: 799000, instructor: 'Hoàng Văn Đạt', duration: '32 giờ', level: 'intermediate', totalLessons: 130, totalStudents: 4500, rating: 4.6, isFeatured: false, isBestSeller: false, isNewArrival: false, categoryId: 4 },
            { name: 'Digital Marketing toàn diện', slug: 'digital-marketing-toan-dien', description: 'SEO, Google Ads, Facebook Ads, Email Marketing, Content Marketing. Chiến lược marketing online A-Z.', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', price: 1199000, salePrice: 599000, instructor: 'Trương Thị Lan', duration: '28 giờ', level: 'beginner', totalLessons: 105, totalStudents: 13500, rating: 4.7, isFeatured: true, isBestSeller: true, isNewArrival: false, categoryId: 5 },
            { name: 'Khởi nghiệp & Business Model', slug: 'khoi-nghiep-business-model', description: 'Xây dựng ý tưởng khởi nghiệp, Business Model Canvas, Lean Startup, Pitch Deck chuyên nghiệp.', thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80', price: 999000, salePrice: null, instructor: 'Đinh Quang Minh', duration: '18 giờ', level: 'beginner', totalLessons: 60, totalStudents: 6800, rating: 4.5, isFeatured: false, isBestSeller: false, isNewArrival: true, categoryId: 5 },
            { name: 'Vue.js 3 & Nuxt.js Framework', slug: 'vuejs-3-nuxtjs', description: 'Master Vue.js 3 với Composition API, Pinia, Vue Router. Xây dựng ứng dụng SSR với Nuxt.js.', thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80', price: 1299000, salePrice: 749000, instructor: 'Lý Hoàng Phúc', duration: '35 giờ', level: 'intermediate', totalLessons: 140, totalStudents: 5100, rating: 4.6, isFeatured: false, isBestSeller: false, isNewArrival: true, categoryId: 1 },
            { name: 'Docker & Kubernetes DevOps', slug: 'docker-kubernetes-devops', description: 'Container hóa ứng dụng với Docker, orchestration với Kubernetes, CI/CD pipeline, AWS deployment.', thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&q=80', price: 1699000, salePrice: 999000, instructor: 'Nguyễn Hoàng Anh', duration: '40 giờ', level: 'advanced', totalLessons: 170, totalStudents: 3200, rating: 4.8, isFeatured: true, isBestSeller: false, isNewArrival: true, categoryId: 1 },
            { name: 'Excel & Power BI cho Business', slug: 'excel-power-bi-business', description: 'Phân tích dữ liệu kinh doanh với Excel nâng cao và Power BI. Dashboard, báo cáo tự động.', thumbnail: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=600&q=80', price: 699000, salePrice: 349000, instructor: 'Võ Thị Hạnh', duration: '16 giờ', level: 'beginner', totalLessons: 65, totalStudents: 18000, rating: 4.9, isFeatured: false, isBestSeller: true, isNewArrival: false, categoryId: 5 },
        ];
        await queryInterface.bulkInsert('Courses', courses.map(c => ({ ...c, createdAt: new Date(), updatedAt: new Date() })));

        // Fetch the inserted courses to get their dynamic IDs
        const slugs = courses.map(c => `'${c.slug}'`).join(', ');
        const [insertedCourses] = await queryInterface.sequelize.query(
            `SELECT id, slug FROM Courses WHERE slug IN (${slugs});`
        );

        // Map slugs to generated IDs
        const slugToId = {};
        insertedCourses.forEach(c => {
            slugToId[c.slug] = c.id;
        });

        const images = [];
        courses.forEach((course, idx) => {
            const courseId = slugToId[course.slug];
            if (courseId) {
                images.push({ imageUrl: course.thumbnail, isPrimary: true, sortOrder: 0, courseId, createdAt: new Date(), updatedAt: new Date() });
                images.push({ imageUrl: `https://picsum.photos/seed/course${idx + 1}a/600/400`, isPrimary: false, sortOrder: 1, courseId, createdAt: new Date(), updatedAt: new Date() });
                images.push({ imageUrl: `https://picsum.photos/seed/course${idx + 1}b/600/400`, isPrimary: false, sortOrder: 2, courseId, createdAt: new Date(), updatedAt: new Date() });
            }
        });
        await queryInterface.bulkInsert('CourseImages', images);
    },
    async down(queryInterface) {
        const { Op } = require('sequelize');
        const slugs = [
            'reactjs-nextjs-zero-to-hero', 'nodejs-backend-master-class', 'html-css-javascript-co-ban',
            'typescript-nestjs-api', 'flutter-dart-complete-guide', 'react-native-mobile',
            'kotlin-android-a-z', 'python-data-science-ai', 'deep-learning-tensorflow',
            'sql-database-design', 'uiux-design-figma', 'photoshop-illustrator',
            'motion-design-after-effects', 'digital-marketing-toan-dien', 'khoi-nghiep-business-model',
            'vuejs-3-nuxtjs', 'docker-kubernetes-devops', 'excel-power-bi-business'
        ];
        
        const [insertedCourses] = await queryInterface.sequelize.query(
            `SELECT id FROM Courses WHERE slug IN (${slugs.map(s => `'${s}'`).join(', ')});`
        );
        const courseIds = insertedCourses.map(c => c.id);

        if (courseIds.length > 0) {
            await queryInterface.bulkDelete('CourseImages', { courseId: { [Op.in]: courseIds } }, {});
            await queryInterface.bulkDelete('Courses', { id: { [Op.in]: courseIds } }, {});
        }
    },
};
