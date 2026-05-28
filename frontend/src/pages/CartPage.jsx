import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCart, removeCartItem, clearCart } from '../store/slices/cartSlice';
import * as orderService from '../services/orderService';
import { getRewardSummary } from '../services/rewardService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PaymentModal from '../components/common/PaymentModal';

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state) => state.cart);

  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [qrData, setQrData] = useState(null);

  // Loyalty points
  const [rewardData, setRewardData] = useState(null);
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);
  const POINT_TO_VND = 1000;

  useEffect(() => {
    dispatch(fetchCart());
    // Lấy thông tin điểm tích lũy
    getRewardSummary().then(res => {
      setRewardData(res.data);
    }).catch(() => {});
  }, [dispatch]);

  const handleRemove = (cartId) => {
    dispatch(removeCartItem(cartId)).then(() => dispatch(fetchCart()));
  };

  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = async () => {
    try {
      setIsCheckoutLoading(true);
      const pointsForCheckout = usePoints ? pointsToUse : 0;
      const res = await orderService.createOrderFromCart(pointsForCheckout);

      // Backend trả về chuẩn: { success: true, data: {...}, message: "..." }
      const payload = res;

      if (payload.success || payload.statusCode === 201 || payload.statusCode === 200 || payload.status === 201 || payload.status === 200) {
        // payload.data chứa { orderCode, totalAmount, qrUrl }
        setQrData(payload.data || payload);
        dispatch(fetchCart());
      } else {
        alert(payload.message || 'Lỗi khi tạo đơn hàng');
      }
    } catch (error) {
      console.error('Lỗi thanh toán:', error);
      alert('Đã xảy ra lỗi khi kết nối với máy chủ.');
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  // Tính tổng tiền
  const totalAmount = items.reduce((sum, item) => {
    const course = item.course;
    const price = course?.salePrice && course.salePrice < course.price ? course.salePrice : course?.price || 0;
    return sum + Number(price);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            🛒 Giỏ hàng
            {items.length > 0 && <span className="text-lg text-gray-400 font-normal ml-2">({items.length} khóa học)</span>}
          </h1>
          {items.length > 0 && (
            <button onClick={handleClearCart} className="text-sm text-red-400 hover:text-red-600 transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">delete</span> Xóa tất cả
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && items.length === 0 && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && items.length === 0 && !qrData && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary text-5xl">shopping_cart</span>
            </div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-400 mb-6">Hãy thêm các khóa học yêu thích vào giỏ hàng nhé!</p>
            <Link
              to="/courses"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
              Khám phá khóa học
            </Link>
          </div>
        )}

        {/* Cart content */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Course list */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const course = item.course;
                if (!course) return null;
                const hasDiscount = course.salePrice && Number(course.salePrice) < Number(course.price);
                const unitPrice = hasDiscount ? course.salePrice : course.price;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 flex gap-4 transition-all hover:shadow-md group"
                  >
                    {/* Thumbnail */}
                    <Link to={`/course/${course.slug}`} className="flex-shrink-0">
                      <img
                        src={course.thumbnail || 'https://via.placeholder.com/160x100?text=Course'}
                        alt={course.name}
                        className="w-36 h-24 sm:w-44 sm:h-28 object-cover rounded-xl bg-gray-100"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <Link to={`/course/${course.slug}`} className="text-sm sm:text-base font-semibold text-gray-800 hover:text-primary transition-colors line-clamp-2">
                          {course.name}
                        </Link>
                        <p className="text-xs text-gray-400 mt-1">Giảng viên: {course.instructor}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                          {course.category && (
                            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">{course.category.name}</span>
                          )}
                          <span className="flex items-center gap-0.5">
                            <span className="material-symbols-outlined fill-icon text-yellow-400 text-sm">star</span>
                            {course.rating}
                          </span>
                          <span>{course.level}</span>
                        </div>
                      </div>

                      {/* Price + Remove */}
                      <div className="flex items-center justify-between mt-3 gap-2">
                        <div>
                          <span className="text-lg font-bold text-primary">{formatPrice(unitPrice)}</span>
                          {hasDiscount && <span className="text-xs text-gray-400 line-through ml-2">{formatPrice(course.price)}</span>}
                        </div>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa khỏi giỏ"
                        >
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Tóm tắt đơn hàng</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>{items.length} khóa học</span>
                    <span className="font-medium">{formatPrice(totalAmount)}</span>
                  </div>

                  {/* Loyalty Points Section */}
                  {rewardData && rewardData.totalPoints > 0 && (
                    <div className="border border-indigo-100 bg-indigo-50/50 rounded-xl p-3 space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={usePoints}
                          onChange={(e) => {
                            setUsePoints(e.target.checked);
                            if (e.target.checked) {
                              // Mặc định dùng hết điểm hoặc tối đa bằng tổng tiền
                              const maxPointsCanUse = Math.min(
                                rewardData.totalPoints,
                                Math.floor(totalAmount / POINT_TO_VND)
                              );
                              setPointsToUse(maxPointsCanUse);
                            } else {
                              setPointsToUse(0);
                            }
                          }}
                          className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Dùng điểm tích lũy</span>
                      </label>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Hiện có: <strong className="text-indigo-600">{rewardData.totalPoints} điểm</strong></span>
                        <span>= {formatPrice(rewardData.totalPoints * POINT_TO_VND)}</span>
                      </div>
                      {usePoints && (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            max={Math.min(rewardData.totalPoints, Math.floor(totalAmount / POINT_TO_VND))}
                            value={pointsToUse}
                            onChange={(e) => {
                              const val = Math.max(0, Math.min(
                                parseInt(e.target.value) || 0,
                                rewardData.totalPoints,
                                Math.floor(totalAmount / POINT_TO_VND)
                              ));
                              setPointsToUse(val);
                            }}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          <span className="text-xs text-gray-500">điểm = -{formatPrice(pointsToUse * POINT_TO_VND)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <hr className="border-gray-100" />

                  {usePoints && pointsToUse > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm từ điểm</span>
                      <span className="font-medium">-{formatPrice(pointsToUse * POINT_TO_VND)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-900 text-base">
                    <span className="font-bold">Tổng cộng</span>
                    <span className="font-bold text-primary text-xl">
                      {formatPrice(Math.max(0, totalAmount - (usePoints ? pointsToUse * POINT_TO_VND : 0)))}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckoutLoading}
                  className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-base hover:shadow-lg hover:shadow-primary/30 transition-all flex justify-center items-center gap-2 disabled:opacity-70"
                >
                  {isCheckoutLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
                      Thanh toán mã QR
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-400 text-center mt-2">Hỗ trợ đối soát tự động 24/7</p>

                <Link to="/courses" className="flex items-center justify-center gap-1.5 mt-4 text-sm text-gray-500 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-sm">arrow_back</span> Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal QR Code Thanh Toán */}
      <PaymentModal qrData={qrData} onClose={() => setQrData(null)} />

      <Footer />
    </div>
  );
}

