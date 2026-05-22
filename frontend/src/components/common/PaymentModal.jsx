import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as orderService from '../../services/orderService';

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

export default function PaymentModal({ qrData, onClose }) {
  const navigate = useNavigate();
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  // Polling check trạng thái đơn hàng khi đang hiển thị QR
  useEffect(() => {
    let intervalId;

    if (qrData && qrData.orderCode && !isPaymentSuccess) {
      intervalId = setInterval(async () => {
        try {
          const res = await orderService.checkOrderStatus(qrData.orderCode);
          const payload = res;

          if ((payload.success || payload.statusCode === 200 || payload.status === 200) && payload.data?.isPaid) {
            clearInterval(intervalId);
            setIsPaymentSuccess(true);
          }
        } catch (error) {
          // Bỏ qua lỗi kết nối trong lúc polling để tránh spam
        }
      }, 3000); // Check mỗi 3 giây
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [qrData, isPaymentSuccess]);

  if (!qrData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transition-all duration-500 ease-in-out transform">
        <div className={`p-4 flex justify-between items-center text-white ${isPaymentSuccess ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-primary to-secondary'}`}>
          <h3 className="font-bold text-lg flex items-center gap-2">
            {isPaymentSuccess ? (
              <span className="material-symbols-outlined">verified</span>
            ) : (
              <span className="material-symbols-outlined">qr_code_2</span>
            )}
            {isPaymentSuccess ? 'Giao dịch thành công' : 'Thanh toán khóa học'}
          </h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {isPaymentSuccess ? (
          <div className="p-8 flex flex-col items-center justify-center animate-fade-in">
            <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-green-100">
              <span className="material-symbols-outlined text-[64px]">check_circle</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h2>
            <p className="text-gray-500 text-center mb-8 text-sm">
              Cảm ơn bạn. Các khóa học đã được cấp quyền truy cập và lưu vào tài khoản. Hãy bắt đầu hành trình học tập ngay bây giờ!
            </p>
            <button
              onClick={() => {
                onClose();
                navigate('/courses');
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all flex justify-center items-center gap-2"
            >
              Vào Học Ngay
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        ) : (
          <div className="p-6 flex flex-col items-center animate-fade-in">
            <p className="text-center text-gray-600 mb-4">
              Vui lòng mở ứng dụng ngân hàng và quét mã QR bên dưới để thanh toán.
            </p>

            <div className="p-2 border border-gray-100 rounded-xl shadow-inner bg-gray-50 mb-6 relative">
              <img
                src={qrData.qrUrl}
                alt="Mã QR Thanh toán"
                className="w-64 h-64 object-contain rounded-lg mix-blend-multiply"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-50 animate-pulse pointer-events-none rounded-lg" />
            </div>

            <div className="w-full bg-blue-50 text-blue-800 rounded-xl p-4 text-sm border border-blue-100">
              <div className="flex justify-between mb-2">
                <span className="text-blue-600/80">Số tiền:</span>
                <span className="font-bold text-base">{formatPrice(qrData.totalAmount)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-blue-600/80">Mã đơn hàng:</span>
                <span className="font-bold font-mono tracking-wider">{qrData.orderCode}</span>
              </div>
              <hr className="border-blue-200 my-2" />
              <p className="text-xs text-center mt-2">
                <span className="material-symbols-outlined text-[14px] align-middle mr-1">sync</span>
                Hệ thống đang tự động lắng nghe giao dịch...
              </p>
            </div>

            <button
              onClick={() => {
                alert('Hệ thống vẫn đang kiểm tra giao dịch ở nền. Khóa học sẽ được cấp ngay khi SePay xác nhận.');
                onClose();
                navigate('/courses');
              }}
              className="mt-6 text-gray-500 text-sm font-medium hover:text-primary transition-colors"
            >
              Tôi sẽ kiểm tra lại sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
