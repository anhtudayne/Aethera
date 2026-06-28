import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import KpiCard from '../../components/admin/dashboard/KpiCard';
import RevenueChart from '../../components/admin/dashboard/RevenueChart';
import RecentActivities from '../../components/admin/dashboard/RecentActivities';
import TopCourses from '../../components/admin/dashboard/TopCourses';
import '../../components/admin/admin.css';
import axiosClient from '../../api/axiosClient';
import { CalendarDays, DollarSign, Users, BookOpen, CreditCard, RefreshCw, AlertCircle } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30');

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const response = await axiosClient.get(`/admin/dashboard?range=${timeRange}`);
                if (response.success) {
                    setStats(response.data);
                } else {
                    setStats(null);
                }
            } catch (error) {
                console.error('Failed to fetch admin stats:', error);
                setStats(null);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [timeRange]);

    if (loading) {
        return (
            <div className="w-full min-h-[600px] text-gray-900 rounded-xl flex items-center justify-center -m-2 sm:-m-4">
                <div className="flex justify-center items-center h-64 text-gray-500">
                    <RefreshCw className="animate-spin mr-2" size={24} /> Loading dashboard...
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="w-full min-h-[600px] text-gray-900 rounded-xl flex items-center justify-center p-8 -m-2 sm:-m-4">
                <div className="text-red-500 text-center p-8 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle size={48} className="mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Failed to load data</h3>
                    <p className="text-gray-600">Please check your connection and ensure you have admin privileges.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard-container w-full min-h-full text-gray-900 sm:p-2">
            {/* Page Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
                    <p className="text-gray-500 mt-1">System performance and pending actions.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <select 
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="appearance-none pl-10 pr-8 py-2 bg-white rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium text-sm"
                        >
                            <option value="7">Last 7 Days</option>
                            <option value="30">Last 30 Days</option>
                            <option value="90">Last 90 Days</option>
                            <option value="all">All Time</option>
                        </select>
                        <CalendarDays size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KpiCard 
                    title="Total Revenue" 
                    value={`${Number(stats.totalRevenue || 0).toLocaleString()} d`}
                    icon={DollarSign} 
                    colorClass="text-indigo-600" 
                    bgClass="bg-indigo-50 border-indigo-100" 
                    trendText="+12.5% vs last month" // This could be calculated in backend in future
                    isPositive={true}
                />
                <KpiCard 
                    title="New Users" 
                    value={(stats.newUsers || 0).toLocaleString()}
                    icon={Users} 
                    colorClass="text-emerald-600" 
                    bgClass="bg-emerald-50 border-emerald-100" 
                    trendText="+5.2% vs last month"
                    isPositive={true}
                />
                <KpiCard 
                    title="Pending Courses" 
                    value={stats.pendingCourses || 0}
                    icon={BookOpen} 
                    colorClass="text-amber-500" 
                    bgClass="bg-amber-50 border-amber-100" 
                    trendText="Needs Review"
                    isPositive={false}
                />
                <KpiCard 
                    title="Pending Payouts" 
                    value={stats.pendingPayouts || 0}
                    icon={CreditCard} 
                    colorClass="text-rose-500" 
                    bgClass="bg-rose-50 border-rose-100" 
                    trendText="Action Req"
                    isPositive={false}
                />
            </div>

            {/* Revenue Chart */}
            <RevenueChart data={stats.chartData || []} />

            {/* Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-grid-gutter">
                <TopCourses courses={stats.topCourses || []} />
                <RecentActivities activities={stats.recentActivities || []} />
            </div>
        </div>
    );
};

export default Dashboard;
