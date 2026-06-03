import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Plus, X, Edit2, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminCoursesPage = () => {
    const navigate = useNavigate();
    const [isCreating, setIsCreating] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newCourse, setNewCourse] = useState({ name: '', description: '', price: '' });
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8089/api/courses?status=all&limit=50');
            if (response.data && response.data.data) {
                setCourses(response.data.data);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách khóa học:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        if (!newCourse.name.trim()) return;

        try {
            setIsCreating(true);
            const response = await axios.post('http://localhost:8089/api/courses', {
                name: newCourse.name,
                description: newCourse.description,
                price: Number(newCourse.price) || 0,
                categoryId: 1, // Mặc định
                instructor: 'Trần Duy'
            });

            if (response.data && response.data.data) {
                const newSlug = response.data.data.slug;
                setShowModal(false);
                navigate(`/admin/courses/${newSlug}/edit`);
            }
        } catch (error) {
            console.error("Lỗi tạo khóa học", error);
            alert("Có lỗi xảy ra khi tạo khóa học!");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <AdminLayout title="Quản lý Khóa học">
            <div className="p-6 lg:p-10 max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Danh sách Khóa học của bạn</h2>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-600/20"
                    >
                        <Plus className="w-4 h-4" />
                        Tạo khóa học mới
                    </button>
                </div>
                
                {loading ? (
                    <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
                        <p className="text-slate-500">Đang tải danh sách khóa học...</p>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
                        <p className="text-slate-500 mb-4">Bạn chưa có khóa học nào.</p>
                        <button 
                            onClick={() => setShowModal(true)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Tạo khóa học đầu tiên
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map(course => (
                            <div key={course.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative">
                                <div className="aspect-video bg-slate-100 relative overflow-hidden">
                                    {course.images && course.images.length > 0 ? (
                                        <img src={course.images.find(i => i.isPrimary)?.imageUrl || course.images[0].imageUrl} alt={course.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">Không có ảnh</div>
                                    )}
                                    <div className="absolute top-3 left-3">
                                        {course.status === 'published' ? (
                                            <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500 text-white rounded-md shadow-sm flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5"/>Đã xuất bản</span>
                                        ) : (
                                            <span className="px-2.5 py-1 text-xs font-semibold bg-amber-500 text-white rounded-md shadow-sm flex items-center gap-1"><Clock className="w-3.5 h-3.5"/>Bản nháp</span>
                                        )}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-slate-800 text-lg line-clamp-1 mb-1" title={course.name}>{course.name}</h3>
                                    <p className="text-sm text-slate-500 mb-4">{course.category?.name || 'Chưa phân loại'}</p>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="font-semibold text-blue-600">{course.price ? `${course.price.toLocaleString('vi-VN')} đ` : 'Miễn phí'}</span>
                                        <button 
                                            onClick={() => navigate(`/admin/courses/${course.slug}/edit`)}
                                            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Chỉnh sửa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Course Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                            <h3 className="text-lg font-bold text-slate-800">Khởi tạo Khóa học</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateCourse} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tên khóa học <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    required
                                    value={newCourse.name}
                                    onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                                    placeholder="VD: ReactJS Thực chiến..."
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả ngắn</label>
                                <textarea 
                                    value={newCourse.description}
                                    onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                                    placeholder="Nhập mô tả khóa học..."
                                    rows="3"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Giá bán (VNĐ)</label>
                                <input 
                                    type="number" 
                                    value={newCourse.price}
                                    onChange={(e) => setNewCourse({...newCourse, price: e.target.value})}
                                    placeholder="VD: 500000"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                    Hủy
                                </button>
                                <button type="submit" disabled={isCreating} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:bg-blue-400">
                                    {isCreating ? 'Đang tạo...' : 'Tạo mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminCoursesPage;
