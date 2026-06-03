import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { getDashboardStatsService } from '../../services/statsService';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';
import { 
    DollarSign, ShoppingCart, Users, CreditCard, Calendar, TrendingUp, TrendingDown,
    Package, ArrowUpRight, Search, Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30days'); // 7days, 30days, all

    useEffect(() => {
        fetchStats();
    }, [dateRange]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            let startDate = null;
            let endDate = new Date().toISOString();
            
            if (dateRange === '7days') {
                const start = new Date();
                start.setDate(start.getDate() - 7);
                startDate = start.toISOString();
            } else if (dateRange === '30days') {
                const start = new Date();
                start.setDate(start.getDate() - 30);
                startDate = start.toISOString();
            }

            const response = await getDashboardStatsService(startDate, endDate);
            if (response.data.status === 200) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateStr) => {
        return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(dateStr));
    };

    // Custom Tooltip for Recharts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100">
                    <p className="text-sm font-semibold text-slate-500 mb-1">{formatDate(label)}</p>
                    <p className="text-lg font-bold text-blue-600">
                        {formatCurrency(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading || !stats) {
        return (
            <AdminLayout title="Bảng điều khiển">
                <div className="flex h-64 items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Bảng điều khiển">
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Tổng quan thống kê</h2>
                        <p className="text-slate-500 text-sm mt-1">Theo dõi doanh thu và hoạt động của nền tảng</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white border border-slate-200 rounded-lg p-1 shadow-sm flex items-center">
                            <button 
                                onClick={() => setDateRange('7days')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${dateRange === '7days' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                7 Ngày
                            </button>
                            <button 
                                onClick={() => setDateRange('30days')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${dateRange === '30days' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                30 Ngày
                            </button>
                            <button 
                                onClick={() => setDateRange('all')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${dateRange === 'all' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                Tất cả
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
                            <DollarSign size={80} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-slate-500 font-medium">Tổng doanh thu thực</h3>
                                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <DollarSign className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-slate-800">{formatCurrency(stats.totalRevenue)}</div>
                            <div className="flex items-center mt-2 text-sm">
                                <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                                <span className="text-emerald-500 font-medium">+12.5%</span>
                                <span className="text-slate-400 ml-2">so với kỳ trước</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
                            <ShoppingCart size={80} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-slate-500 font-medium">Tổng số đơn hàng</h3>
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <ShoppingCart className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-slate-800">{stats.totalOrders}</div>
                            <div className="flex items-center mt-2 text-sm">
                                <span className="text-slate-400">Các đơn hàng được tạo</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
                            <Users size={80} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-slate-500 font-medium">Khách hàng mới</h3>
                                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                                    <Users className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-slate-800">{stats.totalCustomers}</div>
                            <div className="flex items-center mt-2 text-sm">
                                <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
                                <span className="text-purple-500 font-medium">+5.2%</span>
                                <span className="text-slate-400 ml-2">so với kỳ trước</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
                            <CreditCard size={80} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-slate-500 font-medium">Dòng tiền chờ xử lý</h3>
                                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-slate-800">{formatCurrency(stats.revenueByStatus.pending || 0)}</div>
                            <div className="flex items-center mt-2 text-sm">
                                <span className="text-slate-400">Từ các đơn hàng đang giao dịch</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Chart */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Biểu đồ doanh thu</h3>
                                <p className="text-sm text-slate-500">Doanh thu theo thời gian (chỉ tính đơn đã thu tiền)</p>
                            </div>
                        </div>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.revenueChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis 
                                        dataKey="date" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        tickFormatter={(value) => {
                                            const d = new Date(value);
                                            return `${d.getDate()}/${d.getMonth()+1}`;
                                        }}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        tickFormatter={(value) => {
                                            if (value === 0) return '0';
                                            return `${(value / 1000000).toFixed(0)}M`;
                                        }}
                                        dx={-10}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        stroke="#3b82f6" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorRevenue)" 
                                        activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Top 10 Khóa học</h3>
                                <p className="text-sm text-slate-500">Sản phẩm bán chạy nhất</p>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4">
                            {stats.topCourses.length === 0 ? (
                                <div className="text-center py-10 text-slate-500">Chưa có dữ liệu</div>
                            ) : (
                                stats.topCourses.map((item, index) => (
                                    <div key={item.courseId} className="flex items-center p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100 group">
                                        <div className="w-8 flex-shrink-0 text-center font-bold text-slate-400 group-hover:text-blue-500">
                                            #{index + 1}
                                        </div>
                                        <img 
                                            src={item.course.thumbnail} 
                                            alt={item.course.name} 
                                            className="w-12 h-12 rounded-lg object-cover ml-2 mr-4 border border-slate-200"
                                            onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Course' }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold text-slate-800 truncate" title={item.course.name}>
                                                {item.course.name}
                                            </h4>
                                            <p className="text-xs text-slate-500 mt-0.5">{item.salesCount} lượt mua</p>
                                        </div>
                                        <div className="text-right ml-4">
                                            <p className="text-sm font-bold text-emerald-600">
                                                {formatCurrency(item.totalCourseRevenue)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Đơn hàng gần đây</h3>
                            <p className="text-sm text-slate-500">Danh sách các giao dịch mới nhất</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                            Xem tất cả <ArrowUpRight className="w-4 h-4 ml-1" />
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold bg-slate-50/50">
                                    <th className="py-4 px-4 rounded-tl-lg">Mã đơn</th>
                                    <th className="py-4 px-4">Khách hàng</th>
                                    <th className="py-4 px-4">Ngày mua</th>
                                    <th className="py-4 px-4 text-right">Tổng tiền</th>
                                    <th className="py-4 px-4 text-center rounded-tr-lg">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {stats.recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-slate-500">Chưa có đơn hàng nào</td>
                                    </tr>
                                ) : (
                                    stats.recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="py-3 px-4 text-sm font-medium text-slate-900">
                                                #{order.id}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center">
                                                    <img 
                                                        src={order.user?.image || `https://ui-avatars.com/api/?name=${order.user?.firstName}+${order.user?.lastName}&background=f1f5f9&color=64748b`}
                                                        alt="avatar" 
                                                        className="w-8 h-8 rounded-full border border-slate-200 mr-3"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-800">
                                                            {order.user?.firstName} {order.user?.lastName}
                                                        </p>
                                                        <p className="text-xs text-slate-500">{order.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-slate-600">
                                                {formatDate(order.createdAt)}
                                            </td>
                                            <td className="py-3 px-4 text-sm font-bold text-slate-800 text-right">
                                                {formatCurrency(order.totalAmount)}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                                                    ${order.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                                      order.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                                                      'bg-slate-100 text-slate-700 border-slate-200'}`}
                                                >
                                                    {order.status === 'paid' ? 'Đã thu tiền' : 
                                                     order.status === 'pending' ? 'Chờ xử lý' : 
                                                     'Đã hủy'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
};

export default AdminDashboardPage;
