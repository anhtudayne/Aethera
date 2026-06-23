'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const studentUser = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE roleId = 'student' LIMIT 1;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const userId = studentUser.length > 0 ? studentUser[0].id : 1;

    try {
      await queryInterface.bulkInsert('SupportTickets', [
        {
          userId: userId,
          ticketType: 'REFUND',
          status: 'OPEN',
          priority: 'HIGH',
          title: 'Yêu cầu hoàn tiền khóa học ReactJS',
          message: 'Khóa học không phù hợp với trình độ của tôi, tôi xin hoàn tiền.',
          requestedAmount: 500000,
          targetId: 1234,
          attachments: JSON.stringify(['https://via.placeholder.com/400x300.png?text=Evidence+1', 'https://via.placeholder.com/400x300.png?text=Evidence+2']),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          userId: userId,
          ticketType: 'REPORT',
          status: 'IN_PROGRESS',
          priority: 'MEDIUM',
          title: 'Giảng viên trả lời quá chậm',
          message: 'Tôi đã hỏi trong Q&A nhưng giảng viên không trả lời trong vòng 3 ngày.',
          targetId: 101,
          attachments: JSON.stringify(['https://via.placeholder.com/400x300.png?text=Screenshot+1']),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          userId: userId,
          ticketType: 'REFUND',
          status: 'RESOLVED',
          priority: 'LOW',
          title: 'Mua nhầm khóa học',
          message: 'Tôi mua nhầm khóa cơ bản, xin hoàn tiền để mua khóa nâng cao.',
          requestedAmount: 250000,
          targetId: 5566,
          internalNotes: 'Đã hoàn tiền qua VNPAY ngày 22/06',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], {});
    } catch (error) {
      console.log('⚠️ Dữ liệu SupportTickets đã tồn tại, tự động bỏ qua.');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SupportTickets', null, {});
  }
};
