'use strict';

module.exports = {
    async up(queryInterface) {
        // ========== 1. Seed Sections ==========
        const sections = [
            // Course 1: React JS Từ Zero Đến Hero
            { id: 1, courseId: 1, title: 'Giới thiệu React & Cài đặt môi trường', order: 1, createdAt: new Date(), updatedAt: new Date() },
            { id: 2, courseId: 1, title: 'React Components & JSX', order: 2, createdAt: new Date(), updatedAt: new Date() },
            { id: 3, courseId: 1, title: 'Hooks cơ bản: useState & useEffect', order: 3, createdAt: new Date(), updatedAt: new Date() },

            // Course 2: Node.js & Express - Backend Mastery
            { id: 4, courseId: 2, title: 'Tổng quan Node.js & Express', order: 1, createdAt: new Date(), updatedAt: new Date() },
            { id: 5, courseId: 2, title: 'Xây dựng REST API & Routing', order: 2, createdAt: new Date(), updatedAt: new Date() },

            // Course 3: HTML & CSS Cho Người Mới Bắt Đầu
            { id: 6, courseId: 3, title: 'Cơ bản về HTML5', order: 1, createdAt: new Date(), updatedAt: new Date() },
            { id: 7, courseId: 3, title: 'CSS3 & Responsive Design', order: 2, createdAt: new Date(), updatedAt: new Date() },

            // Course 4: Next.js 14 - Fullstack Framework
            { id: 8, courseId: 4, title: 'Làm quen với App Router', order: 1, createdAt: new Date(), updatedAt: new Date() },
            { id: 9, courseId: 4, title: 'Server Components & Server Actions', order: 2, createdAt: new Date(), updatedAt: new Date() },

            // Course 5: TypeScript Từ Cơ Bản Đến Nâng Cao
            { id: 10, courseId: 5, title: 'TypeScript Basics & Types', order: 1, createdAt: new Date(), updatedAt: new Date() },

            // Course 6: React Native - Lập Trình Mobile Cross-Platform
            { id: 11, courseId: 6, title: 'Giới thiệu React Native', order: 1, createdAt: new Date(), updatedAt: new Date() },

            // Course 7: Flutter & Dart - Mobile App Development
            { id: 12, courseId: 7, title: 'Dart Programming Language', order: 1, createdAt: new Date(), updatedAt: new Date() },

            // Course 8: Python Cho Data Science
            { id: 13, courseId: 8, title: 'Cú pháp Python & Cấu trúc dữ liệu', order: 1, createdAt: new Date(), updatedAt: new Date() },

            // Course 9: Machine Learning A-Z
            { id: 14, courseId: 9, title: 'Regression & Classification', order: 1, createdAt: new Date(), updatedAt: new Date() },

            // Course 10: Figma UI/UX Design Masterclass
            { id: 15, courseId: 10, title: 'Figma Basics & Vector Tools', order: 1, createdAt: new Date(), updatedAt: new Date() },

            // Course 11: Adobe Photoshop - Thiết Kế Đồ Họa
            { id: 16, courseId: 11, title: 'Làm quen với Adobe Photoshop', order: 1, createdAt: new Date(), updatedAt: new Date() },

            // Course 12: Khởi Nghiệp Từ Con Số 0
            { id: 17, courseId: 12, title: 'Tư duy khởi nghiệp tinh gọn', order: 1, createdAt: new Date(), updatedAt: new Date() },

            // Course 13: Digital Marketing Toàn Diện
            { id: 18, courseId: 13, title: 'Tổng quan về Digital Marketing', order: 1, createdAt: new Date(), updatedAt: new Date() },

            // Course 14: Docker & Kubernetes Thực Chiến
            { id: 19, courseId: 14, title: 'Docker Container cơ bản', order: 1, createdAt: new Date(), updatedAt: new Date() },

            // Course 15: Git & GitHub - Quản Lý Source Code
            { id: 20, courseId: 15, title: 'Git Basic Commands', order: 1, createdAt: new Date(), updatedAt: new Date() },

            // Course 16: SQL & MySQL - Cơ Sở Dữ Liệu
            { id: 21, courseId: 16, title: 'Truy vấn dữ liệu cơ bản', order: 1, createdAt: new Date(), updatedAt: new Date() },

            // Course 17: Kỹ Năng Giao Tiếp Hiệu Quả
            { id: 22, courseId: 17, title: 'Lắng nghe chủ động', order: 1, createdAt: new Date(), updatedAt: new Date() },

            // Course 18: Tiếng Anh Cho Dân IT
            { id: 23, courseId: 18, title: 'Từ vựng kỹ thuật cơ bản', order: 1, createdAt: new Date(), updatedAt: new Date() },

            // Course 19: Vue.js 3 - Frontend Framework Hiện Đại
            { id: 24, courseId: 19, title: 'Composition API cơ bản', order: 1, createdAt: new Date(), updatedAt: new Date() },

            // Course 20: Java Spring Boot - Enterprise Backend
            { id: 25, courseId: 20, title: 'Spring Boot Overview & DI/IoC', order: 1, createdAt: new Date(), updatedAt: new Date() }
        ];
        await queryInterface.bulkInsert('Sections', sections);

        // ========== 2. Seed Lessons ==========
        const lessons = [
            // Section 1: Giới thiệu React & Cài đặt môi trường (courseId: 1)
            { id: 1, sectionId: 1, title: 'Chào mừng đến với khóa học React JS', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/react_intro.mp4', duration: '05:20', order: 1, isFreePreview: true, createdAt: new Date(), updatedAt: new Date() },
            { id: 2, sectionId: 1, title: 'Cài đặt Node.js & VS Code', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/setup.mp4', duration: '10:15', order: 2, isFreePreview: true, createdAt: new Date(), updatedAt: new Date() },
            { id: 3, sectionId: 1, title: 'Khởi tạo ứng dụng React đầu tiên', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/first_app.mp4', duration: '12:45', order: 3, isFreePreview: false, createdAt: new Date(), updatedAt: new Date() },

            // Section 2: React Components & JSX (courseId: 1)
            { id: 4, sectionId: 2, title: 'Hiểu về Components & Props', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/components.mp4', duration: '15:30', order: 1, isFreePreview: false, createdAt: new Date(), updatedAt: new Date() },
            { id: 5, sectionId: 2, title: 'Cú pháp JSX và những lưu ý', type: 'text', content: '<h3>JSX là gì?</h3><p>JSX là viết tắt của JavaScript XML. Nó cho phép viết HTML trực tiếp trong code JavaScript một cách trực quan.</p>', videoUrl: null, duration: '08:00', order: 2, isFreePreview: false, createdAt: new Date(), updatedAt: new Date() },

            // Section 3: Hooks cơ bản: useState & useEffect (courseId: 1)
            { id: 6, sectionId: 3, title: 'State trong React với useState', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/usestate.mp4', duration: '18:20', order: 1, isFreePreview: false, createdAt: new Date(), updatedAt: new Date() },
            { id: 7, sectionId: 3, title: 'Xử lý Side Effects với useEffect', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/useeffect.mp4', duration: '22:40', order: 2, isFreePreview: false, createdAt: new Date(), updatedAt: new Date() },

            // Section 4: Tổng quan Node.js & Express (courseId: 2)
            { id: 8, sectionId: 4, title: 'Node.js hoạt động như thế nào?', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/node_how.mp4', duration: '08:15', order: 1, isFreePreview: true, createdAt: new Date(), updatedAt: new Date() },
            { id: 9, sectionId: 4, title: 'Tạo HTTP Server cơ bản với Node.js', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/http_server.mp4', duration: '14:10', order: 2, isFreePreview: false, createdAt: new Date(), updatedAt: new Date() },

            // Section 5: Xây dựng REST API & Routing (courseId: 2)
            { id: 10, sectionId: 5, title: 'Express routing và middleware', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/express_routes.mp4', duration: '20:30', order: 1, isFreePreview: false, createdAt: new Date(), updatedAt: new Date() },

            // Section 6: Cơ bản về HTML5 (courseId: 3)
            { id: 11, sectionId: 6, title: 'Các thẻ HTML5 thông dụng', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/html_tags.mp4', duration: '10:00', order: 1, isFreePreview: true, createdAt: new Date(), updatedAt: new Date() },
            { id: 12, sectionId: 6, title: 'Cấu trúc trang web semantic', type: 'text', content: '<h3>Semantic HTML</h3><p>Sử dụng các thẻ semantic như &lt;header&gt;, &lt;footer&gt;, &lt;article&gt; giúp trang web tối ưu SEO tốt hơn.</p>', videoUrl: null, duration: '05:00', order: 2, isFreePreview: false, createdAt: new Date(), updatedAt: new Date() },

            // Section 7: CSS3 & Responsive Design (courseId: 3)
            { id: 13, sectionId: 7, title: 'CSS Flexbox toàn tập', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/flexbox.mp4', duration: '15:20', order: 1, isFreePreview: false, createdAt: new Date(), updatedAt: new Date() },
            { id: 14, sectionId: 7, title: 'Media Queries cho Responsive Design', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/responsive.mp4', duration: '12:45', order: 2, isFreePreview: false, createdAt: new Date(), updatedAt: new Date() },

            // Section 8: Làm quen với App Router (courseId: 4)
            { id: 15, sectionId: 8, title: 'Next.js App Router Structure', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/app_router.mp4', duration: '11:15', order: 1, isFreePreview: true, createdAt: new Date(), updatedAt: new Date() },

            // Section 9: Server Components & Server Actions (courseId: 4)
            { id: 16, sectionId: 9, title: 'Server Components vs Client Components', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/rsc.mp4', duration: '18:50', order: 1, isFreePreview: false, createdAt: new Date(), updatedAt: new Date() },

            // Section 10: TypeScript Basics & Types (courseId: 5)
            { id: 17, sectionId: 10, title: 'Basic Types & Interfaces', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/ts_types.mp4', duration: '14:30', order: 1, isFreePreview: true, createdAt: new Date(), updatedAt: new Date() },

            // Section 11: Giới thiệu React Native (courseId: 6)
            { id: 18, sectionId: 11, title: 'React Native Architecture', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/rn_arch.mp4', duration: '12:20', order: 1, isFreePreview: true, createdAt: new Date(), updatedAt: new Date() },
            { id: 19, sectionId: 11, title: 'Xây dựng layout với Flexbox', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/rn_flex.mp4', duration: '15:10', order: 2, isFreePreview: false, createdAt: new Date(), updatedAt: new Date() },

            // Section 12: Dart Programming Language (courseId: 7)
            { id: 20, sectionId: 12, title: 'Dart Variables & Functions', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/dart_basics.mp4', duration: '13:40', order: 1, isFreePreview: true, createdAt: new Date(), updatedAt: new Date() },

            // Section 13: Cú pháp Python & Cấu trúc dữ liệu (courseId: 8)
            { id: 21, sectionId: 13, title: 'Python List, Tuple, Dictionary', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/python_ds.mp4', duration: '16:00', order: 1, isFreePreview: true, createdAt: new Date(), updatedAt: new Date() },
            { id: 22, sectionId: 13, title: 'Làm việc với NumPy array', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/numpy.mp4', duration: '14:50', order: 2, isFreePreview: false, createdAt: new Date(), updatedAt: new Date() },

            // Section 14: Regression & Classification (courseId: 9)
            { id: 23, sectionId: 14, title: 'Linear Regression Theory', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/linear_regression.mp4', duration: '20:10', order: 1, isFreePreview: true, createdAt: new Date(), updatedAt: new Date() },

            // Section 15: Figma Basics & Vector Tools (courseId: 10)
            { id: 24, sectionId: 15, title: 'Figma Frame, Group, Component', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/figma_basics.mp4', duration: '15:00', order: 1, isFreePreview: true, createdAt: new Date(), updatedAt: new Date() },

            // Section 16: Làm quen với Adobe Photoshop (courseId: 11)
            { id: 25, sectionId: 16, title: 'Layer & Mask trong Photoshop', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/photoshop_layers.mp4', duration: '14:20', order: 1, isFreePreview: true, createdAt: new Date(), updatedAt: new Date() },

            // Section 17: Tư duy khởi nghiệp tinh gọn (courseId: 12)
            { id: 26, sectionId: 17, title: 'Mô hình kinh doanh Canvas', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/canvas.mp4', duration: '12:00', order: 1, isFreePreview: true, createdAt: new Date(), updatedAt: new Date() },

            // Section 18: Tổng quan về Digital Marketing (courseId: 13)
            { id: 27, sectionId: 18, title: 'Kênh tiếp thị và phễu chuyển đổi', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/marketing_funnel.mp4', duration: '18:10', order: 1, isFreePreview: true, createdAt: new Date(), updatedAt: new Date() },

            // Section 19: Docker Container cơ bản (courseId: 14)
            { id: 28, sectionId: 19, title: 'Docker Image vs Container', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/docker_basics.mp4', duration: '15:45', order: 1, isFreePreview: true, createdAt: new Date(), updatedAt: new Date() },

            // Section 20: Git Basic Commands (courseId: 15)
            { id: 29, sectionId: 20, title: 'Git init, add, commit, push', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/git_basics.mp4', duration: '10:30', order: 1, isFreePreview: true, createdAt: new Date(), updatedAt: new Date() },
            { id: 30, sectionId: 20, title: 'Quản lý xung đột (Merge Conflict)', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/git_conflict.mp4', duration: '12:15', order: 2, isFreePreview: false, createdAt: new Date(), updatedAt: new Date() },

            // Section 21: Truy vấn dữ liệu cơ bản (courseId: 16)
            { id: 31, sectionId: 21, title: 'Mệnh đề SELECT, WHERE, ORDER BY', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/sql_select.mp4', duration: '14:00', order: 1, isFreePreview: true, createdAt: new Date(), updatedAt: new Date() },

            // Section 22: Lắng nghe chủ động (courseId: 17)
            { id: 32, sectionId: 22, title: 'Tầm quan trọng của giao tiếp phi ngôn từ', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/communication_body.mp4', duration: '10:00', order: 1, isFreePreview: true, createdAt: new Date(), updatedAt: new Date() },

            // Section 23: Từ vựng kỹ thuật cơ bản (courseId: 18)
            { id: 33, sectionId: 23, title: 'Tiếng Anh trong phát triển phần mềm', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/english_software.mp4', duration: '15:00', order: 1, isFreePreview: true, createdAt: new Date(), updatedAt: new Date() },

            // Section 24: Composition API cơ bản (courseId: 19)
            { id: 34, sectionId: 24, title: 'Reactive state: ref vs reactive', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/vue_reactive.mp4', duration: '14:20', order: 1, isFreePreview: true, createdAt: new Date(), updatedAt: new Date() },

            // Section 25: Spring Boot Overview & DI/IoC (courseId: 20)
            { id: 35, sectionId: 25, title: 'Dependency Injection & IoC Container', type: 'video', content: null, videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1633356122/spring_di.mp4', duration: '17:30', order: 1, isFreePreview: true, createdAt: new Date(), updatedAt: new Date() }
        ];
        await queryInterface.bulkInsert('Lessons', lessons);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('Lessons', null, {});
        await queryInterface.bulkDelete('Sections', null, {});
    },
};
