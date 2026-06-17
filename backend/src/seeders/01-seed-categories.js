'use strict';

module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert('Categories', [
            { id: 1, name: 'Web Development', slug: 'web-development', description: 'Lập trình web frontend & backend', image: 'https://img.icons8.com/color/480/web.png' },
            { id: 2, name: 'Mobile Development', slug: 'mobile-development', description: 'Phát triển ứng dụng di động iOS & Android', image: 'https://img.icons8.com/color/480/smartphone-tablet.png' },
            { id: 3, name: 'Data Science', slug: 'data-science', description: 'Khoa học dữ liệu, Machine Learning, AI', image: 'https://img.icons8.com/color/480/combo-chart.png' },
            { id: 4, name: 'Design', slug: 'design', description: 'Thiết kế UI/UX, đồ họa', image: 'https://img.icons8.com/color/480/design.png' },
            { id: 5, name: 'Business', slug: 'business', description: 'Kinh doanh, khởi nghiệp, quản lý', image: 'https://img.icons8.com/color/480/business.png' },
            { id: 6, name: 'Marketing', slug: 'marketing', description: 'Digital Marketing, SEO, quảng cáo', image: 'https://img.icons8.com/color/480/marketing.png' },
            { id: 7, name: 'IT & Software', slug: 'it-software', description: 'DevOps, Cloud, Database, Testing', image: 'https://img.icons8.com/color/480/it.png' },
            { id: 8, name: 'Personal Development', slug: 'personal-development', description: 'Phát triển bản thân, kỹ năng mềm', image: 'https://img.icons8.com/color/480/personal-growth.png' },
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('Categories', null, {});
    },
};
