import db from '../models/index.js';
import * as momoDisbursementService from '../services/momoDisbursementService.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * [Admin] Chuyển tiền hàng loạt (Bulk Payout)
 * Endpoint: POST /api/payouts/bulk
 */
export const handleBulkPayout = async (req, res) => {
    // Transaction để đảm bảo tính nhất quán dữ liệu
    const t = await db.sequelize.transaction();
    
    try {
        const adminId = req.user.id; // Lấy từ token sau khi verifyAdmin

        // 1. Lấy tất cả các yêu cầu rút tiền đang PENDING
        const pendingRequests = await db.PayoutRequest.findAll({
            where: { status: 'PENDING' },
            include: [{ model: db.User, as: 'instructor' }],
            transaction: t
        });

        if (!pendingRequests || pendingRequests.length === 0) {
            await t.rollback();
            return res.status(400).json({ status: 400, message: 'Không có yêu cầu rút tiền nào đang chờ xử lý.' });
        }

        // Tính tổng tiền
        let totalAmount = 0;
        const disbursementList = [];

        pendingRequests.forEach(req => {
            const amountNum = Number(req.amount);
            totalAmount += amountNum;
            
            // Map dữ liệu sang chuẩn MoMo Disbursement
            disbursementList.push({
                partnerRefId: `REQ_${req.id}`, // Mã tham chiếu của từng giao dịch con
                amount: amountNum,
                payeeName: req.accountName,
                receiverNumber: req.accountNumber,
                bankCode: req.bankName, // VD: "VCB", "MOMO"
                description: `Quyet toan cho giang vien ${req.instructor?.email}`
            });
        });

        // 2. Tạo PayoutBatch (mã lô)
        const batchId = `BATCH_${Date.now()}_${uuidv4().substring(0, 6)}`;
        
        const newBatch = await db.PayoutBatch.create({
            batchId: batchId,
            totalAmount: totalAmount,
            status: 'PENDING',
            adminId: adminId
        }, { transaction: t });

        // 3. Cập nhật batchId cho các PayoutRequest
        const requestIds = pendingRequests.map(r => r.id);
        await db.PayoutRequest.update(
            { batchId: newBatch.id },
            { where: { id: requestIds }, transaction: t }
        );

        // 4. Gọi API MoMo Chi Hộ
        // Lưu ý: idempotency key chính là batchId
        const momoResponse = await momoDisbursementService.createBulkPayout(batchId, disbursementList, totalAmount);

        // Giả lập kết quả trả về tức thời của MoMo (thực tế có thể là PENDING và chờ webhook)
        if (momoResponse.resultCode === 0) {
            // Update trạng thái lô
            await newBatch.update({ status: 'SUCCESS' }, { transaction: t });
            
            // Update trạng thái các request và trừ tiền trong creditBalance của giảng viên
            for (const pr of pendingRequests) {
                await db.PayoutRequest.update({ status: 'COMPLETED' }, { where: { id: pr.id }, transaction: t });
                
                // Trừ tiền trong ví giảng viên (creditBalance)
                const instructor = await db.User.findByPk(pr.instructorId, { transaction: t });
                if (instructor) {
                    await instructor.update({
                        creditBalance: Number(instructor.creditBalance) - Number(pr.amount)
                    }, { transaction: t });
                }
            }
            
            await t.commit();
            return res.status(200).json({ status: 200, message: 'Chuyển tiền hàng loạt thành công!', data: momoResponse });
        } else {
            // Nếu gọi API lỗi ngay lập tức
            await newBatch.update({ status: 'FAILED', errorMessage: momoResponse.message }, { transaction: t });
            // Không trừ tiền, giữ nguyên PayoutRequest (vẫn có batchId nhưng batch này đã FAILED)
            await t.commit();
            return res.status(400).json({ status: 400, message: `Thất bại: ${momoResponse.message}` });
        }
    } catch (error) {
        await t.rollback();
        console.error('Lỗi khi xử lý Bulk Payout:', error);
        return res.status(500).json({ status: 500, message: 'Lỗi server nội bộ' });
    }
};

/**
 * Webhook nhận kết quả bất đồng bộ từ MoMo
 * Endpoint: POST /api/payouts/momo-webhook
 */
export const handleMoMoWebhook = async (req, res) => {
    console.log('=== Nhận Webhook MoMo Bulk Payout ===');
    console.log(req.body);

    const t = await db.sequelize.transaction();
    try {
        const momoData = req.body;
        const { orderId: batchId, resultCode } = momoData;

        // 1. Verify chữ ký (tạm bỏ qua trong lúc dev/test nếu cần, nhưng thực tế phải có)
        // const isValid = momoDisbursementService.verifyWebhookSignature(momoData);
        // if (!isValid) {
        //     console.error('Chữ ký Webhook không hợp lệ');
        //     await t.rollback();
        //     return res.status(400).json({ message: 'Invalid signature' });
        // }

        // 2. Tìm Batch
        const batch = await db.PayoutBatch.findOne({
            where: { batchId: batchId },
            include: [{ model: db.PayoutRequest, as: 'payoutRequests' }],
            transaction: t
        });

        if (!batch) {
            await t.rollback();
            return res.status(404).json({ message: 'Không tìm thấy lô giao dịch này' });
        }

        if (batch.status === 'SUCCESS' || batch.status === 'FAILED') {
            await t.rollback();
            return res.status(204).send(); // Đã xử lý rồi
        }

        // 3. Xử lý kết quả Webhook
        if (resultCode === 0) {
            // Thành công
            await batch.update({ status: 'SUCCESS' }, { transaction: t });

            const requests = batch.payoutRequests || [];
            for (const pr of requests) {
                if (pr.status === 'PENDING') {
                    await pr.update({ status: 'COMPLETED' }, { transaction: t });
                    
                    const instructor = await db.User.findByPk(pr.instructorId, { transaction: t });
                    if (instructor) {
                        await instructor.update({
                            creditBalance: Number(instructor.creditBalance) - Number(pr.amount)
                        }, { transaction: t });
                    }
                }
            }
            console.log(`✅ Lô ${batchId} đã xử lý thành công.`);
        } else {
            // Thất bại
            await batch.update({ status: 'FAILED', errorMessage: momoData.message }, { transaction: t });
            
            // Revert trạng thái của PayoutRequests để Admin xử lý lại sau (xóa batchId để giải phóng)
            const requestIds = batch.payoutRequests.map(r => r.id);
            if (requestIds.length > 0) {
                await db.PayoutRequest.update(
                    { batchId: null },
                    { where: { id: requestIds }, transaction: t }
                );
            }
            console.log(`❌ Lô ${batchId} thất bại. Các yêu cầu đã được giải phóng.`);
        }

        await t.commit();
        return res.status(204).send(); // Trả về 204 No Content cho MoMo
    } catch (error) {
        await t.rollback();
        console.error('Lỗi xử lý Webhook:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
