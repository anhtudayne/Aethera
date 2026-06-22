import { asyncHandler } from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import db from '../models/index.js';

/**
 * Lấy danh sách Support Tickets (Refund / Report)
 * GET /api/v1/admin/tickets
 */
export const getAllTickets = asyncHandler(async (req, res) => {
    const { type, status } = req.query;

    const whereClause = {};
    if (type) whereClause.ticketType = type;
    if (status) whereClause.status = status;

    const tickets = await db.SupportTicket.findAll({
        where: whereClause,
        include: [
            {
                model: db.User,
                as: 'user',
                attributes: ['id', 'firstName', 'lastName', 'email', 'image']
            }
        ],
        order: [['createdAt', 'DESC']]
    });

    return res.status(200).json(new ApiResponse(200, tickets));
});

/**
 * Cập nhật trạng thái ticket (Resolve / Dismiss)
 * PATCH /api/v1/admin/tickets/:id/status
 */
export const updateTicketStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const ticket = await db.SupportTicket.findByPk(id);
    if (!ticket) {
        return res.status(404).json({ status: 404, message: 'Không tìm thấy yêu cầu' });
    }

    // Nếu status là RESOLVED và là Refund, thực tế có thể gọi tới cổng thanh toán.
    // Tạm thời chỉ cập nhật trạng thái theo yêu cầu.
    ticket.status = status;
    await ticket.save();

    return res.status(200).json(new ApiResponse(200, ticket, 'Cập nhật trạng thái thành công'));
});

/**
 * Cập nhật ghi chú nội bộ (Internal Notes)
 * PATCH /api/v1/admin/tickets/:id/note
 */
export const updateInternalNote = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { internalNotes } = req.body;

    const ticket = await db.SupportTicket.findByPk(id);
    if (!ticket) {
        return res.status(404).json({ status: 404, message: 'Không tìm thấy yêu cầu' });
    }

    ticket.internalNotes = internalNotes;
    await ticket.save();

    return res.status(200).json(new ApiResponse(200, ticket, 'Cập nhật ghi chú thành công'));
});
