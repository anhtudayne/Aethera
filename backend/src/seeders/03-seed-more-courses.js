'use strict';
// BT05 — Võ Văn Tú: Seed thêm khóa học để test Infinite Scroll
module.exports = {
    async up(queryInterface) {
        const now = new Date();
        const courses = [
            // === Web Development (categoryId: 1) — thêm 6 KH ===
            { name: 'Angular 17 Complete Course', slug: 'angular-17-complete', description: 'Học Angular 17 từ cơ bản đến nâng cao. Signals, Standalone Components, SSR với Angular Universal.', thumbnail: 'https://images.unsplash.com/photo-1619410283995-43d9134e7656?w=600&q=80', price: 1399000, salePrice: 749000, instructor: 'Nguyễn Hoàng Long', duration: '38 giờ', level: 'intermediate', totalLessons: 155, totalStudents: 4800, rating: 4.6, isFeatured: false, isBestSeller: false, isNewArrival: true, categoryId: 1, createdAt: now, updatedAt: now },
            { name: 'PHP Laravel Framework', slug: 'php-laravel-framework', description: 'Xây dựng web application với PHP Laravel. Eloquent ORM, Blade Template, API Resources, Queue.', thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80', price: 1099000, salePrice: null, instructor: 'Trần Quốc Đạt', duration: '32 giờ', level: 'intermediate', totalLessons: 130, totalStudents: 6500, rating: 4.5, isFeatured: false, isBestSeller: true, isNewArrival: false, categoryId: 1, createdAt: now, updatedAt: now },
            { name: 'Svelte & SvelteKit Crash Course', slug: 'svelte-sveltekit-crash', description: 'Framework mới nổi Svelte — không virtual DOM, compile-time. Xây dựng app nhanh với SvelteKit.', thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80', price: 899000, salePrice: 499000, instructor: 'Lê Văn Phúc', duration: '20 giờ', level: 'beginner', totalLessons: 80, totalStudents: 2100, rating: 4.4, isFeatured: false, isBestSeller: false, isNewArrival: true, categoryId: 1, createdAt: now, updatedAt: now },
            { name: 'GraphQL & Apollo Server', slug: 'graphql-apollo-server', description: 'Thay thế REST API bằng GraphQL. Schema design, Resolvers, Apollo Client, Subscriptions real-time.', thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&q=80', price: 1299000, salePrice: null, instructor: 'Phạm Anh Tuấn', duration: '28 giờ', level: 'advanced', totalLessons: 110, totalStudents: 3400, rating: 4.7, isFeatured: true, isBestSeller: false, isNewArrival: false, categoryId: 1, createdAt: now, updatedAt: now },
            { name: 'WordPress Developer Mastery', slug: 'wordpress-developer-mastery', description: 'Phát triển theme và plugin WordPress chuyên nghiệp. WooCommerce, REST API, Custom Post Types.', thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&q=80', price: 799000, salePrice: 449000, instructor: 'Hoàng Minh Thắng', duration: '22 giờ', level: 'beginner', totalLessons: 90, totalStudents: 8200, rating: 4.3, isFeatured: false, isBestSeller: true, isNewArrival: false, categoryId: 1, createdAt: now, updatedAt: now },
            { name: 'Tailwind CSS & UI Design System', slug: 'tailwindcss-design-system', description: 'Master Tailwind CSS v4, xây dựng Design System, Component Library. Responsive, Dark Mode, Animation.', thumbnail: 'https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=600&q=80', price: 699000, salePrice: null, instructor: 'Đinh Thị Ngọc', duration: '18 giờ', level: 'beginner', totalLessons: 70, totalStudents: 5600, rating: 4.8, isFeatured: false, isBestSeller: false, isNewArrival: true, categoryId: 1, createdAt: now, updatedAt: now },

            // === Mobile Development (categoryId: 2) — thêm 6 KH ===
            { name: 'SwiftUI iOS Development', slug: 'swiftui-ios-development', description: 'Lập trình iOS native với SwiftUI. Declarative UI, Combine, Core Data, CloudKit integration.', thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80', price: 1599000, salePrice: 899000, instructor: 'Nguyễn Đức Thịnh', duration: '40 giờ', level: 'intermediate', totalLessons: 170, totalStudents: 3200, rating: 4.7, isFeatured: true, isBestSeller: false, isNewArrival: true, categoryId: 2, createdAt: now, updatedAt: now },
            { name: 'Ionic & Capacitor Hybrid Apps', slug: 'ionic-capacitor-hybrid', description: 'Phát triển app hybrid với Ionic Framework và Capacitor. Một codebase cho iOS, Android, Web.', thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&q=80', price: 999000, salePrice: null, instructor: 'Vũ Quang Huy', duration: '25 giờ', level: 'intermediate', totalLessons: 100, totalStudents: 2800, rating: 4.4, isFeatured: false, isBestSeller: false, isNewArrival: false, categoryId: 2, createdAt: now, updatedAt: now },
            { name: 'Jetpack Compose Modern Android', slug: 'jetpack-compose-android', description: 'UI toolkit hiện đại cho Android. Material 3, Navigation, ViewModel, Room với Jetpack Compose.', thumbnail: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=600&q=80', price: 1199000, salePrice: 699000, instructor: 'Trần Minh Khôi', duration: '30 giờ', level: 'intermediate', totalLessons: 125, totalStudents: 4100, rating: 4.6, isFeatured: false, isBestSeller: true, isNewArrival: true, categoryId: 2, createdAt: now, updatedAt: now },
            { name: 'Xamarin Cross-Platform', slug: 'xamarin-cross-platform', description: 'Phát triển ứng dụng đa nền tảng với C# và Xamarin. MVVM pattern, Xamarin.Forms, Azure backend.', thumbnail: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=600&q=80', price: 1099000, salePrice: null, instructor: 'Lê Hoàng Phong', duration: '28 giờ', level: 'intermediate', totalLessons: 115, totalStudents: 1900, rating: 4.3, isFeatured: false, isBestSeller: false, isNewArrival: false, categoryId: 2, createdAt: now, updatedAt: now },
            { name: 'App Testing & CI/CD Mobile', slug: 'app-testing-cicd-mobile', description: 'Testing ứng dụng mobile: Unit Test, Widget Test, Integration Test. CI/CD với Fastlane, GitHub Actions.', thumbnail: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?w=600&q=80', price: 899000, salePrice: 549000, instructor: 'Ngô Văn Sơn', duration: '20 giờ', level: 'advanced', totalLessons: 85, totalStudents: 1500, rating: 4.5, isFeatured: false, isBestSeller: false, isNewArrival: true, categoryId: 2, createdAt: now, updatedAt: now },
            { name: 'PWA — Progressive Web Apps', slug: 'pwa-progressive-web-apps', description: 'Biến web thành app. Service Workers, Web Push, Offline-first, Installable PWA. Lighthouse 100 điểm.', thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80', price: 799000, salePrice: null, instructor: 'Đặng Thanh Tùng', duration: '16 giờ', level: 'beginner', totalLessons: 65, totalStudents: 3600, rating: 4.4, isFeatured: false, isBestSeller: false, isNewArrival: false, categoryId: 2, createdAt: now, updatedAt: now },

            // === Data Science (categoryId: 3) — thêm 6 KH ===
            { name: 'R Programming cho Thống Kê', slug: 'r-programming-thong-ke', description: 'Phân tích thống kê với R. ggplot2, dplyr, tidyr, Shiny Dashboard. Ứng dụng trong nghiên cứu.', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80', price: 999000, salePrice: 599000, instructor: 'TS. Nguyễn Văn Thành', duration: '26 giờ', level: 'beginner', totalLessons: 105, totalStudents: 4200, rating: 4.5, isFeatured: false, isBestSeller: false, isNewArrival: true, categoryId: 3, createdAt: now, updatedAt: now },
            { name: 'NLP — Xử lý ngôn ngữ tự nhiên', slug: 'nlp-xu-ly-ngon-ngu', description: 'Text Processing, Tokenization, Word Embeddings, Transformers, BERT. Xây dựng chatbot AI.', thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80', price: 1799000, salePrice: null, instructor: 'TS. Lê Quang Minh', duration: '42 giờ', level: 'advanced', totalLessons: 175, totalStudents: 2800, rating: 4.8, isFeatured: true, isBestSeller: false, isNewArrival: true, categoryId: 3, createdAt: now, updatedAt: now },
            { name: 'Apache Spark & Big Data', slug: 'apache-spark-big-data', description: 'Xử lý dữ liệu lớn với Apache Spark, PySpark. ETL pipeline, Spark SQL, MLlib cho ML trên Big Data.', thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&q=80', price: 1499000, salePrice: 849000, instructor: 'Phạm Đức Anh', duration: '35 giờ', level: 'advanced', totalLessons: 140, totalStudents: 1800, rating: 4.6, isFeatured: false, isBestSeller: false, isNewArrival: false, categoryId: 3, createdAt: now, updatedAt: now },
            { name: 'Data Visualization với D3.js', slug: 'data-visualization-d3js', description: 'Trực quan hóa dữ liệu tương tác với D3.js. SVG, Canvas, Dashboard, Geographic Maps.', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', price: 1099000, salePrice: null, instructor: 'Trương Hoài Nam', duration: '24 giờ', level: 'intermediate', totalLessons: 95, totalStudents: 3100, rating: 4.4, isFeatured: false, isBestSeller: false, isNewArrival: false, categoryId: 3, createdAt: now, updatedAt: now },
            { name: 'MLOps & Model Deployment', slug: 'mlops-model-deployment', description: 'Deploy model ML lên production. Docker, MLflow, FastAPI serving, monitoring, A/B testing.', thumbnail: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&q=80', price: 1399000, salePrice: 799000, instructor: 'Nguyễn Thế Vinh', duration: '30 giờ', level: 'advanced', totalLessons: 120, totalStudents: 2200, rating: 4.7, isFeatured: false, isBestSeller: false, isNewArrival: true, categoryId: 3, createdAt: now, updatedAt: now },
            { name: 'Computer Vision với OpenCV', slug: 'computer-vision-opencv', description: 'Xử lý ảnh và video với OpenCV, YOLO, MediaPipe. Face detection, Object tracking, OCR.', thumbnail: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600&q=80', price: 1299000, salePrice: null, instructor: 'Võ Minh Tuấn', duration: '28 giờ', level: 'intermediate', totalLessons: 110, totalStudents: 3500, rating: 4.6, isFeatured: false, isBestSeller: true, isNewArrival: false, categoryId: 3, createdAt: now, updatedAt: now },

            // === Design (categoryId: 4) — thêm 6 KH ===
            { name: 'Blender 3D cho Beginner', slug: 'blender-3d-beginner', description: 'Thiết kế 3D miễn phí với Blender. Modeling, Texturing, Lighting, Animation cơ bản.', thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80', price: 999000, salePrice: 549000, instructor: 'Trần Đức Huy', duration: '30 giờ', level: 'beginner', totalLessons: 120, totalStudents: 5400, rating: 4.7, isFeatured: false, isBestSeller: true, isNewArrival: true, categoryId: 4, createdAt: now, updatedAt: now },
            { name: 'Web Design Psychology', slug: 'web-design-psychology', description: 'Tâm lý người dùng trong thiết kế web. Color theory, Typography, Layout principles, CTA optimization.', thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80', price: 799000, salePrice: null, instructor: 'Nguyễn Thu Trang', duration: '18 giờ', level: 'beginner', totalLessons: 70, totalStudents: 3800, rating: 4.5, isFeatured: false, isBestSeller: false, isNewArrival: false, categoryId: 4, createdAt: now, updatedAt: now },
            { name: 'Canva Design Professional', slug: 'canva-design-professional', description: 'Thiết kế chuyên nghiệp với Canva. Social media, Presentation, Video, Brand Kit, Print design.', thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80', price: 499000, salePrice: 299000, instructor: 'Lê Thị Thanh', duration: '12 giờ', level: 'beginner', totalLessons: 50, totalStudents: 12000, rating: 4.8, isFeatured: true, isBestSeller: true, isNewArrival: false, categoryId: 4, createdAt: now, updatedAt: now },
            { name: 'Sketch to Code — Design Handoff', slug: 'sketch-to-code-handoff', description: 'Quy trình chuyển design sang code. Figma Dev Mode, Zeplin, Storybook, CSS từ design token.', thumbnail: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=600&q=80', price: 899000, salePrice: null, instructor: 'Phan Quốc Việt', duration: '20 giờ', level: 'intermediate', totalLessons: 80, totalStudents: 2600, rating: 4.4, isFeatured: false, isBestSeller: false, isNewArrival: true, categoryId: 4, createdAt: now, updatedAt: now },
            { name: 'Brand Identity Design', slug: 'brand-identity-design', description: 'Xây dựng bộ nhận diện thương hiệu. Logo, Color Palette, Typography, Brand Guidelines.', thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&q=80', price: 1199000, salePrice: 699000, instructor: 'Hoàng Anh Khoa', duration: '24 giờ', level: 'intermediate', totalLessons: 95, totalStudents: 4100, rating: 4.6, isFeatured: false, isBestSeller: false, isNewArrival: false, categoryId: 4, createdAt: now, updatedAt: now },
            { name: 'Video Editing với DaVinci Resolve', slug: 'video-editing-davinci', description: 'Chỉnh sửa video chuyên nghiệp miễn phí với DaVinci Resolve. Color grading, VFX, Audio mixing.', thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80', price: 1099000, salePrice: null, instructor: 'Đỗ Minh Quân', duration: '28 giờ', level: 'beginner', totalLessons: 115, totalStudents: 3200, rating: 4.5, isFeatured: false, isBestSeller: false, isNewArrival: true, categoryId: 4, createdAt: now, updatedAt: now },

            // === Business (categoryId: 5) — thêm 6 KH ===
            { name: 'Google Ads & SEM Masterclass', slug: 'google-ads-sem-masterclass', description: 'Chạy quảng cáo Google Ads hiệu quả. Search, Display, YouTube Ads, Shopping, Performance Max.', thumbnail: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&q=80', price: 1299000, salePrice: 749000, instructor: 'Lý Thanh Sơn', duration: '26 giờ', level: 'intermediate', totalLessons: 105, totalStudents: 7200, rating: 4.7, isFeatured: true, isBestSeller: true, isNewArrival: false, categoryId: 5, createdAt: now, updatedAt: now },
            { name: 'Quản lý dự án với Scrum & Agile', slug: 'quan-ly-du-an-scrum-agile', description: 'Agile methodology, Scrum framework, Sprint planning, Retrospective. Jira, Trello thực hành.', thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80', price: 899000, salePrice: null, instructor: 'Nguyễn Quang Hải', duration: '18 giờ', level: 'beginner', totalLessons: 75, totalStudents: 5400, rating: 4.5, isFeatured: false, isBestSeller: false, isNewArrival: true, categoryId: 5, createdAt: now, updatedAt: now },
            { name: 'Facebook & TikTok Ads', slug: 'facebook-tiktok-ads', description: 'Chiến lược quảng cáo trên Facebook và TikTok. Pixel tracking, Lookalike audience, Creative testing.', thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80', price: 1099000, salePrice: 649000, instructor: 'Trương Thu Hà', duration: '22 giờ', level: 'beginner', totalLessons: 90, totalStudents: 9800, rating: 4.6, isFeatured: false, isBestSeller: true, isNewArrival: false, categoryId: 5, createdAt: now, updatedAt: now },
            { name: 'Content Marketing Strategy', slug: 'content-marketing-strategy', description: 'Xây dựng chiến lược content. SEO writing, Social media content, Email newsletter, Content calendar.', thumbnail: 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=600&q=80', price: 799000, salePrice: null, instructor: 'Phạm Thị Lan Anh', duration: '16 giờ', level: 'beginner', totalLessons: 65, totalStudents: 6100, rating: 4.4, isFeatured: false, isBestSeller: false, isNewArrival: true, categoryId: 5, createdAt: now, updatedAt: now },
            { name: 'Ecommerce Business A-Z', slug: 'ecommerce-business-a-z', description: 'Xây dựng kinh doanh thương mại điện tử. Shopify, Shopee, Lazada, Fulfillment, Customer Retention.', thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80', price: 1199000, salePrice: 699000, instructor: 'Võ Hữu Đức', duration: '24 giờ', level: 'intermediate', totalLessons: 100, totalStudents: 4700, rating: 4.5, isFeatured: false, isBestSeller: false, isNewArrival: false, categoryId: 5, createdAt: now, updatedAt: now },
            { name: 'Financial Literacy & Investment', slug: 'financial-literacy-investment', description: 'Kiến thức tài chính cá nhân, đầu tư chứng khoán, crypto, quỹ ETF. Quản lý dòng tiền thông minh.', thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80', price: 999000, salePrice: null, instructor: 'Đinh Hoàng Long', duration: '20 giờ', level: 'beginner', totalLessons: 80, totalStudents: 8500, rating: 4.8, isFeatured: true, isBestSeller: false, isNewArrival: true, categoryId: 5, createdAt: now, updatedAt: now },
        ];
        await queryInterface.bulkInsert('Courses', courses);

        // Fetch the inserted courses to get dynamic IDs
        const slugs = courses.map(c => `'${c.slug}'`).join(', ');
        const [insertedCourses] = await queryInterface.sequelize.query(
            `SELECT id, slug FROM Courses WHERE slug IN (${slugs});`
        );

        const slugToId = {};
        insertedCourses.forEach(c => {
            slugToId[c.slug] = c.id;
        });

        // Thêm 3 ảnh cho mỗi khóa học mới
        const images = [];
        courses.forEach((course, idx) => {
            const courseId = slugToId[course.slug];
            if (courseId) {
                images.push(
                    { imageUrl: course.thumbnail, isPrimary: true, sortOrder: 0, courseId, createdAt: now, updatedAt: now },
                    { imageUrl: `https://picsum.photos/seed/extra${idx}a/600/400`, isPrimary: false, sortOrder: 1, courseId, createdAt: now, updatedAt: now },
                    { imageUrl: `https://picsum.photos/seed/extra${idx}b/600/400`, isPrimary: false, sortOrder: 2, courseId, createdAt: now, updatedAt: now },
                );
            }
        });
        await queryInterface.bulkInsert('CourseImages', images);
    },
    async down(queryInterface) {
        const { Op } = require('sequelize');
        const slugs = [
            'angular-17-complete', 'php-laravel-framework', 'svelte-sveltekit-crash',
            'graphql-apollo-server', 'wordpress-developer-mastery', 'tailwindcss-design-system',
            'swiftui-ios-development', 'ionic-capacitor-hybrid', 'jetpack-compose-android',
            'xamarin-cross-platform', 'app-testing-cicd-mobile', 'pwa-progressive-web-apps',
            'r-programming-thong-ke', 'nlp-xu-ly-ngon-ngu', 'apache-spark-big-data',
            'data-visualization-d3js', 'mlops-model-deployment', 'computer-vision-opencv',
            'blender-3d-beginner', 'web-design-psychology', 'canva-design-professional',
            'sketch-to-code-handoff', 'brand-identity-design', 'video-editing-davinci',
            'google-ads-sem-masterclass', 'quan-ly-du-an-scrum-agile', 'facebook-tiktok-ads',
            'content-marketing-strategy', 'ecommerce-business-a-z', 'financial-literacy-investment'
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
