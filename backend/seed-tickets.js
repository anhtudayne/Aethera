import db from './src/models/index.js';

const run = async () => {
  try {
    const adminUser = await db.User.findOne({ where: { roleId: 'admin' } });
    const studentUser = await db.User.findOne({ where: { roleId: 'student' } });

    await db.SupportTicket.bulkCreate([
      {
        userId: studentUser ? studentUser.id : 1,
        ticketType: 'REFUND',
        status: 'OPEN',
        priority: 'HIGH',
        title: 'Yêu cầu hoàn tiền khóa học ReactJS',
        message: 'Khóa học không phù hợp với trình độ của tôi, tôi xin hoàn tiền.',
        requestedAmount: 500000,
        targetId: 1234,
        attachments: JSON.stringify(['https://via.placeholder.com/400x300.png?text=Evidence+1', 'https://via.placeholder.com/400x300.png?text=Evidence+2']),
      },
      {
        userId: studentUser ? studentUser.id : 1,
        ticketType: 'REPORT',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        title: 'Giảng viên trả lời quá chậm',
        message: 'Tôi đã hỏi trong Q&A nhưng giảng viên không trả lời trong vòng 3 ngày.',
        targetId: 101,
        attachments: JSON.stringify(['https://via.placeholder.com/400x300.png?text=Screenshot+1']),
      },
      {
        userId: studentUser ? studentUser.id : 1,
        ticketType: 'REFUND',
        status: 'RESOLVED',
        priority: 'LOW',
        title: 'Mua nhầm khóa học',
        message: 'Tôi mua nhầm khóa cơ bản, xin hoàn tiền để mua khóa nâng cao.',
        requestedAmount: 250000,
        targetId: 5566,
        internalNotes: 'Đã hoàn tiền qua VNPAY ngày 22/06',
      }
    ]);
    console.log("Seeded SupportTickets successfully.");
  } catch (err) {
    console.error("Seed failed", err);
  }
  process.exit(0);
};

run();
