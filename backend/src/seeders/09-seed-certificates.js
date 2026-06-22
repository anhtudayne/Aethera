'use strict';

module.exports = {
    async up(queryInterface) {
        const certificates = [
            {
                userId: 1, // Quản trị viên
                courseId: 2, // Node.js
                certificateCode: 'CERT-2026-ADMIN1',
                issuedAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: 2, // Giảng viên
                courseId: 1, // React JS
                certificateCode: 'CERT-2026-TEACHER1',
                issuedAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        try {
            await queryInterface.bulkInsert('Certificates', certificates);
        } catch (error) {
            console.log('Seed certificates warning:', error.message);
        }
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('Certificates', {
            certificateCode: ['CERT-2026-ADMIN1', 'CERT-2026-TEACHER1']
        }, {});
    },
};
