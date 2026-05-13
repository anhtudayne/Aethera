'use strict';
module.exports = {
    async up(queryInterface) {
        const now = new Date();
        await queryInterface.bulkInsert('Categories', [
            { id: 1, name: 'Web Development', slug: 'web-development', description: 'Lập trình web front-end & back-end', image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=200&q=80', createdAt: now, updatedAt: now },
            { id: 2, name: 'Mobile Development', slug: 'mobile-development', description: 'Phát triển ứng dụng di động', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200&q=80', createdAt: now, updatedAt: now },
            { id: 3, name: 'Data Science', slug: 'data-science', description: 'Khoa học dữ liệu & Machine Learning', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&q=80', createdAt: now, updatedAt: now },
            { id: 4, name: 'Design', slug: 'design', description: 'Thiết kế UI/UX & đồ họa', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&q=80', createdAt: now, updatedAt: now },
            { id: 5, name: 'Business', slug: 'business', description: 'Kinh doanh & Marketing', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&q=80', createdAt: now, updatedAt: now },
        ]);
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete('Categories', null, {});
    },
};
