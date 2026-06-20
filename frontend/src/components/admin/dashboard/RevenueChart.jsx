import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MoreVertical, Activity } from 'lucide-react';

const RevenueChart = ({ data }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Monthly Revenue</h3>
                <button className="text-gray-400 hover:text-gray-900 transition-colors">
                    <MoreVertical size={20} />
                </button>
            </div>
            <div className="w-full h-72">
                {(!data || data.length === 0) ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <Activity size={48} className="opacity-20 mb-4" />
                        <p className="text-sm">Chưa có dữ liệu giao dịch trong khoảng thời gian này</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                            <XAxis dataKey="name" stroke="#9ca3af" tick={{fill: '#6b7280', fontSize: 11}} axisLine={false} tickLine={false} />
                            <YAxis stroke="#9ca3af" tick={{fill: '#6b7280', fontSize: 11}} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                            <Tooltip contentStyle={{backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827'}} />
                            <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default RevenueChart;
