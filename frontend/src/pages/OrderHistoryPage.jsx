import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders, cancelOrder } from '../services/orderService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Alert from '../components/Alert';

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertConfig, setAlertConfig] = useState({ type: '', message: '' });

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await getMyOrders();
            setOrders(response.data);
        } catch (error) {
            setAlertConfig({ type: 'error', message: error.response?.data?.message || 'Lỗi khi tải lịch sử đơn hàng' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;
        
        try {
            await cancelOrder(orderId);
            setAlertConfig({ type: 'success', message: 'Hủy đơn hàng thành công' });
            // Cập nhật lại trạng thái đơn hàng trong danh sách
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === orderId ? { ...order, status: 'cancelled' } : order
                )
            );
        } catch (error) {
            setAlertConfig({ type: 'error', message: error.response?.data?.message || 'Lỗi khi hủy đơn hàng' });
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Chờ thanh toán</span>;
            case 'paid':
                return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Đã kích hoạt</span>;
            case 'cancelled':
                return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Đã hủy</span>;
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">{status}</span>;
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            
            <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Lịch sử mua hàng</h1>
                
                <Alert 
                    type={alertConfig.type} 
                    message={alertConfig.message} 
                    onClose={() => setAlertConfig({ type: '', message: '' })} 
                />

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                        <p className="text-gray-500 mb-4">Bạn chưa có đơn hàng nào.</p>
                        <a href="/courses" className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                            Khám phá khóa học
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Mã đơn hàng: <span className="font-semibold text-gray-900">{order.code}</span></p>
                                        <p className="text-sm text-gray-500">Ngày đặt: {formatDate(order.createdAt)}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {getStatusBadge(order.status)}
                                        {order.status === 'pending' && (
                                            <button 
                                                onClick={() => handleCancelOrder(order.id)}
                                                className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline"
                                            >
                                                Hủy đơn hàng
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {order.orderItems && order.orderItems.map((item) => (
                                            <div key={item.id} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0 last:pb-0">
                                                <img 
                                                    src={item.course.thumbnail?.startsWith('http') ? item.course.thumbnail : `http://localhost:8089${item.course.thumbnail}`} 
                                                    alt={item.course.name} 
                                                    className="w-20 h-14 object-cover rounded-md"
                                                />
                                                <div className="flex-grow">
                                                    <h3 className="font-medium text-gray-900">{item.course.name}</h3>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right font-medium text-primary">
                                                        {formatCurrency(item.price)}
                                                    </div>
                                                    {item.course.slug && (
                                                        <Link 
                                                            to={`/course/${item.course.slug}`}
                                                            className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100 rounded-md font-medium transition-colors whitespace-nowrap"
                                                        >
                                                            Xem khóa học
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Tổng thanh toán</p>
                                            <p className="text-xl font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            
            <Footer />
        </div>
    );
}
