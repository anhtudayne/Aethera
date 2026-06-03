import React, { useState } from 'react';
import { GripVertical, Edit, Trash2, Plus } from 'lucide-react';
import LessonItem from './LessonItem';
import LessonUploadForm from './LessonUploadForm';
import axios from 'axios';

const ModuleSection = ({ section, onReload }) => {
  const [expandedLessonId, setExpandedLessonId] = useState(null);
  const [isAddingLesson, setIsAddingLesson] = useState(false);

  const toggleExpandLesson = (lessonId) => {
    setExpandedLessonId(prev => prev === lessonId ? null : lessonId);
  };

  const handleLessonSuccess = () => {
    setIsAddingLesson(false);
    if (onReload) onReload();
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài học này?")) return;
    try {
      await axios.delete(`http://localhost:8089/api/lessons/${lessonId}`);
      if (onReload) onReload();
    } catch (error) {
      console.error("Lỗi khi xóa bài học:", error);
      alert("Không thể xóa bài học");
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-6 overflow-hidden">
      {/* Module Header */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between group cursor-pointer">
        <div className="flex items-center">
          <GripVertical className="w-5 h-5 text-slate-400 mr-2 opacity-50 group-hover:opacity-100 transition-opacity" />
          <div>
            <h2 className="font-semibold text-slate-800 text-lg">{section.title}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{section.lessons?.length || 0} bài học • Cập nhật gần đây</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Edit className="w-4 h-4" /></button>
          <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Lesson List */}
      <div className="p-6 space-y-3">
        {section.lessons?.map((lesson) => (
          <LessonItem 
            key={lesson.id} 
            lesson={lesson} 
            isExpanded={expandedLessonId === lesson.id}
            onExpand={() => toggleExpandLesson(lesson.id)}
            onCollapse={() => setExpandedLessonId(null)}
            onDelete={handleDeleteLesson}
          />
        ))}

        {/* Add Lesson Form */}
        {isAddingLesson ? (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                    <p className="font-medium text-slate-700 text-sm">Thêm bài học mới</p>
                </div>
                <LessonUploadForm 
                    sectionId={section.id} 
                    onCancel={() => setIsAddingLesson(false)} 
                    onSuccess={handleLessonSuccess} 
                />
            </div>
        ) : (
            <button 
                onClick={() => setIsAddingLesson(true)}
                className="w-full py-3 mt-2 border border-transparent hover:border-slate-300 border-dashed rounded-lg flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-all"
            >
                <Plus className="w-4 h-4" />
                Thêm Bài học mới
            </button>
        )}
      </div>
    </div>
  );
};

export default ModuleSection;
