import React from 'react';
import { BookOpen, UserPlus, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecentActivities = ({ activities = [] }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Recent Activities</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Activity Name</th>
                            <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">User / System</th>
                            <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Time</th>
                            <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                        {activities.map((activity, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors group relative">
                                <td className="py-4 px-6 relative">
                                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-500 group-hover:text-indigo-600 transition-colors">
                                            {activity.type === 'course' ? <BookOpen size={16} /> : activity.type === 'user' ? <UserPlus size={16} /> : <Bell size={16} />}
                                        </div>
                                        {activity.url ? (
                                            <Link to={activity.url} className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors cursor-pointer">{activity.title}</Link>
                                        ) : (
                                            <span className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors cursor-pointer">{activity.title}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-gray-500">{activity.user}</td>
                                <td className="py-4 px-6 text-gray-400 text-xs">{new Date(activity.time).toLocaleDateString()}</td>
                                <td className="py-4 px-6">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${activity.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${activity.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                        {activity.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {activities.length === 0 && (
                            <tr>
                                <td colSpan="4" className="py-8 px-6 text-center text-gray-500">No recent activities.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentActivities;
