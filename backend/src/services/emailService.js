import nodemailer from 'nodemailer';

const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

// Send OTP email to user
export const sendOTPEmail = async (toEmail, otpCode, firstName) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"E-Learning Platform" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: '🔐 Mã OTP kích hoạt tài khoản E-Learning',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">🎓 E-Learning Platform</h1>
                    </div>
                    <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #333;">Xin chào ${firstName}!</h2>
                        <p style="color: #555; font-size: 16px;">
                            Cảm ơn bạn đã đăng ký tài khoản tại E-Learning Platform. 
                            Vui lòng sử dụng mã OTP bên dưới để kích hoạt tài khoản của bạn:
                        </p>
                        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #667eea;">
                                ${otpCode}
                            </span>
                        </div>
                        <p style="color: #999; font-size: 14px;">
                            ⏰ Mã OTP có hiệu lực trong <strong>${process.env.OTP_EXPIRE_MINUTES || 5} phút</strong>.
                        </p>
                        <p style="color: #999; font-size: 14px;">
                            ⚠️ Nếu bạn không yêu cầu đăng ký tài khoản, vui lòng bỏ qua email này.
                        </p>
                        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
                        <p style="color: #bbb; font-size: 12px; text-align: center;">
                            © 2024 E-Learning Platform. All rights reserved.
                        </p>
                    </div>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email OTP đã gửi thành công:', info.messageId);
        return info;
    } catch (error) {
        console.error('Lỗi gửi email OTP:', error);
        throw new Error('Không thể gửi email OTP. Vui lòng thử lại sau.');
    }
};

// Send email notification when order is paid successfully
export const sendOrderPaidEmail = async (toEmail, firstName, orderCode, totalAmount, courseNames = []) => {
    try {
        const transporter = createTransporter();

        const courseList = courseNames.length > 0
            ? courseNames.map(name => `<li style="padding: 6px 0; color: #555;">${name}</li>`).join('')
            : '<li style="padding: 6px 0; color: #999;">Không có thông tin khóa học</li>';

        const formattedAmount = Number(totalAmount).toLocaleString('vi-VN');

        const mailOptions = {
            from: `"E-Learning Platform" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: `✅ Thanh toán thành công đơn hàng ${orderCode} — E-Learning`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">🎓 E-Learning Platform</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Xác nhận thanh toán thành công</p>
                    </div>
                    <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #333;">Xin chào ${firstName}!</h2>
                        <p style="color: #555; font-size: 16px;">
                            Đơn hàng <strong style="color: #11998e;">${orderCode}</strong> của bạn đã được thanh toán thành công! 🎉
                        </p>
                        
                        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #11998e; margin: 20px 0;">
                            <p style="margin: 0 0 8px; font-weight: bold; color: #333;">📦 Thông tin đơn hàng:</p>
                            <table style="width: 100%; font-size: 14px;">
                                <tr>
                                    <td style="padding: 4px 0; color: #666;">Mã đơn hàng:</td>
                                    <td style="padding: 4px 0; color: #333; font-weight: bold; text-align: right;">${orderCode}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 4px 0; color: #666;">Tổng thanh toán:</td>
                                    <td style="padding: 4px 0; color: #11998e; font-weight: bold; text-align: right;">${formattedAmount}đ</td>
                                </tr>
                            </table>
                        </div>

                        <p style="color: #555; font-size: 14px; font-weight: bold;">📚 Các khóa học đã mua:</p>
                        <ul style="list-style: none; padding: 0; margin: 0 0 20px;">
                            ${courseList}
                        </ul>

                        <p style="color: #555; font-size: 14px;">
                            Bạn có thể truy cập các khóa học ngay bây giờ trên hệ thống E-Learning.
                        </p>

                        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
                        <p style="color: #bbb; font-size: 12px; text-align: center;">
                            © 2024 E-Learning Platform. All rights reserved.
                        </p>
                    </div>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email thanh toán thành công đã gửi:', info.messageId);
        return info;
    } catch (error) {
        console.error('Lỗi gửi email thanh toán:', error);
        // Don't throw — email failure should not break payment flow
    }
};

