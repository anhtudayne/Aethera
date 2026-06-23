'use strict';

module.exports = {
    async up(queryInterface) {
        try {
            await queryInterface.bulkInsert('Categories', [
                { id: 1, name: 'Web Development', slug: 'web-development', description: 'Lập trình web frontend & backend', image: 'https://img.icons8.com/color/480/web.png', createdAt: new Date(), updatedAt: new Date() },
                { id: 2, name: 'Mobile Development', slug: 'mobile-development', description: 'Phát triển ứng dụng di động iOS & Android', image: 'https://img.icons8.com/color/480/smartphone-tablet.png', createdAt: new Date(), updatedAt: new Date() },
                { id: 3, name: 'Data Science', slug: 'data-science', description: 'Khoa học dữ liệu, Machine Learning, AI', image: 'https://img.icons8.com/color/480/combo-chart.png', createdAt: new Date(), updatedAt: new Date() },
                { id: 4, name: 'Design', slug: 'design', description: 'Thiết kế UI/UX, đồ họa', image: 'https://img.icons8.com/color/480/design.png', createdAt: new Date(), updatedAt: new Date() },
                { id: 5, name: 'Business', slug: 'business', description: 'Kinh doanh, khởi nghiệp, quản lý', image: 'https://img.icons8.com/color/480/business.png', createdAt: new Date(), updatedAt: new Date() },
                { id: 6, name: 'Marketing', slug: 'marketing', description: 'Digital Marketing, SEO, quảng cáo', image: 'https://img.icons8.com/color/480/marketing.png', createdAt: new Date(), updatedAt: new Date() },
                { id: 7, name: 'IT & Software', slug: 'it-software', description: 'DevOps, Cloud, Database, Testing', image: 'https://img.icons8.com/color/480/it.png', createdAt: new Date(), updatedAt: new Date() },
                { id: 8, name: 'Personal Development', slug: 'personal-development', description: 'Phát triển bản thân, kỹ năng mềm', image: 'https://img.icons8.com/color/480/personal-growth.png', createdAt: new Date(), updatedAt: new Date() },
            ]);
        } catch (error) {
            console.log('⚠️ Dữ liệu Categories đã tồn tại, tự động bỏ qua.');
        }
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('Categories', null, {});
    },
};
