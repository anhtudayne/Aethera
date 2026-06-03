import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';
import ModuleSection from '../../components/admin/ModuleSection';

const CourseEditorPage = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isAddingSection, setIsAddingSection] = useState(false);

  const [showAddSectionForm, setShowAddSectionForm] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const fetchCourse = async () => {
    try {
      let courseSlug = slug;
      if (slug === 'demo-slug') {
          const resAll = await axios.get(`http://localhost:8089/api/courses?limit=1&status=all`);
          if (resAll.data.data && resAll.data.data.length > 0) {
              courseSlug = resAll.data.data[0].slug;
          }
      }
      
      const response = await axios.get(`http://localhost:8089/api/courses/${courseSlug}`);
      setCourse(response.data.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu khóa học:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [slug]);

  const handlePublish = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xuất bản khóa học này ra cộng đồng?")) return;
    try {
      setIsPublishing(true);
      await axios.put(`http://localhost:8089/api/courses/${course.id}/publish`);
      alert("Xuất bản thành công!");
      // reload
      fetchCourse();
    } catch (error) {
      console.error("Lỗi xuất bản:", error);
      alert("Xuất bản thất bại");
    } finally {
      setIsPublishing(false);
    }
  };

  const submitSection = async (e) => {
      e.preventDefault();
      if (!newSectionTitle.trim()) return;

      try {
          setIsAddingSection(true);
          await axios.post('http://localhost:8089/api/sections', {
              title: newSectionTitle,
              courseId: course.id,
              order: (course.sections?.length || 0) + 1
          });
          setNewSectionTitle('');
          setShowAddSectionForm(false);
          fetchCourse(); // Reload to show new section
      } catch (error) {
          console.error("Lỗi tạo chương:", error);
          alert("Lỗi tạo chương");
      } finally {
          setIsAddingSection(false);
      }
  };

  if (loading) return <AdminLayout title="Đang tải..."><div className="p-10 text-center">Đang tải dữ liệu...</div></AdminLayout>;
  if (!course) return <AdminLayout title="Lỗi"><div className="p-10 text-center">Không tìm thấy khóa học</div></AdminLayout>;

  return (
    <AdminLayout 
        title={`Chỉnh sửa khóa học: ${course.name}`}
        subtitle={`Khóa học / ${course.category?.name || 'Danh mục'}`}
        showHeaderActions={true}
        onPublish={handlePublish}
        isPublishing={isPublishing}
    >
        {/* CSS Animation cho thanh Progress (dành cho phần upload) */}
        <style dangerouslySetInnerHTML={{__html: `
            @keyframes shimmer {
            100% { transform: translateX(100%); }
            }
        `}} />

        <div className="p-6 lg:p-10">
            <div className="max-w-4xl mx-auto">
                
                {/* List of Modules */}
                {course.sections?.map(section => (
                    <ModuleSection key={section.id} section={section} onReload={fetchCourse} />
                ))}

                {/* Nút thêm Chương mẫu từ UI gốc */}
                {(!course.sections || course.sections.length === 0) && (
                     <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm mb-6">
                        <p className="text-slate-500 mb-4">Khóa học này chưa có chương nào.</p>
                     </div>
                )}

                {/* ADD NEW MODULE FORM */}
                {showAddSectionForm ? (
                    <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-sm mb-6">
                        <form onSubmit={submitSection}>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Tên chương mới</label>
                            <input 
                                type="text"
                                autoFocus
                                required
                                value={newSectionTitle}
                                onChange={e => setNewSectionTitle(e.target.value)}
                                placeholder="VD: Chương 1: Giới thiệu chung"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 text-sm"
                            />
                            <div className="flex justify-end gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setShowAddSectionForm(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isAddingSection}
                                    className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center"
                                >
                                    {isAddingSection ? 'Đang tạo...' : 'Lưu chương'}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <button 
                        onClick={() => setShowAddSectionForm(true)}
                        className="w-full py-5 border-2 border-slate-300 border-dashed rounded-xl flex items-center justify-center gap-2 text-slate-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/50 transition-all group shadow-sm bg-white"
                    >
                        <div className="w-8 h-8 bg-slate-100 group-hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors">
                            <Plus className="w-5 h-5 text-slate-500 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <span className="font-semibold text-[15px]">Thêm Chương mới (Add Section)</span>
                    </button>
                )}
            </div>
        </div>
    </AdminLayout>
  );
};

export default CourseEditorPage;
