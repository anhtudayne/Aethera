import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Edit2, Trash2 } from 'lucide-react';

const THEME_COLORS = {
  indigo: 'bg-indigo-100 text-indigo-600',
  pink: 'bg-pink-100 text-pink-600',
  amber: 'bg-amber-100 text-amber-600',
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  gray: 'bg-gray-100 text-gray-600',
  purple: 'bg-purple-100 text-purple-600',
  rose: 'bg-rose-100 text-rose-600',
};

const CategoryTable = ({ categories, loading, onEdit, onDelete }) => {

    const getIconComponent = (iconName) => {
        const Icon = LucideIcons[iconName];
        return Icon || LucideIcons.LayoutGrid;
    };

    const getThemeColors = (themeName) => {
        return THEME_COLORS[themeName] || THEME_COLORS.gray;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-12 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!categories || categories.length === 0) {
        return (
            <div className="text-center p-12 bg-white rounded-xl border border-gray-200 shadow-sm">
                <p className="text-gray-500 text-sm">No categories found.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category Name</th>
                            <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                            <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Total Courses</th>
                            <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                            <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50 shadow-[-8px_0_15px_-3px_rgba(0,0,0,0.05)] w-24 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.map((category) => {
                            const IconComponent = getIconComponent(category.icon);
                            const themeColors = getThemeColors(category.themeColor);

                            return (
                                <tr key={category.id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${themeColors}`}>
                                                <IconComponent className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                                {category.description && (
                                                    <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">{category.description}</div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 font-mono text-xs text-gray-500">{category.slug}</td>
                                    <td className="py-4 px-6 text-sm text-gray-900 text-right">{category.totalCourses || 0}</td>
                                    <td className="py-4 px-6 text-center">
                                        {category.isActive ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Hidden</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 sticky right-0 bg-white group-hover:bg-gray-50/80 shadow-[-8px_0_15px_-3px_rgba(0,0,0,0.02)] border-l border-transparent transition-colors">
                                        <div className="flex justify-center gap-2 transition-opacity">
                                            <button 
                                                onClick={() => onEdit(category)}
                                                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" 
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default CategoryTable;
