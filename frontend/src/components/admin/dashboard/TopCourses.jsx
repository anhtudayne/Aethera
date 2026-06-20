import React from 'react';
import { Image } from 'lucide-react';

const TopCourses = ({ courses = [] }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Top Selling Courses</h3>
                <button className="text-indigo-600 font-medium hover:underline text-sm">View All</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Course Name</th>
                            <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Students</th>
                            <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Price</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                        {courses.map((course, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors group relative">
                                <td className="py-4 px-6 relative">
                                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center">
                                            {course.thumbnail ? (
                                                <img src={course.thumbnail} alt={course.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Image size={16} className="text-gray-400" />
                                            )}
                                        </div>
                                        <span className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1">{course.name}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-emerald-600 font-medium">{course.totalStudents}</td>
                                <td className="py-4 px-6 text-gray-500">${course.price}</td>
                            </tr>
                        ))}
                        {courses.length === 0 && (
                            <tr>
                                <td colSpan="3" className="py-8 px-6 text-center text-gray-500">No courses found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopCourses;
