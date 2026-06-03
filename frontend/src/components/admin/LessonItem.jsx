import React from 'react';
import { GripVertical, Video, FileText, Edit, Trash2, X } from 'lucide-react';
import LessonUploadForm from './LessonUploadForm';

const LessonItem = ({ lesson, isExpanded, onExpand, onCollapse, onDelete }) => {
  if (isExpanded) {
    return (
      <div className="border border-blue-200 rounded-lg bg-white shadow-sm ring-1 ring-blue-50 overflow-hidden">
        {/* Expanded Header */}
        <div className="flex items-center justify-between p-3.5 bg-blue-50/50 border-b border-blue-100">
           <div className="flex items-center gap-3">
            <GripVertical className="w-4 h-4 text-slate-300" />
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              {lesson.type === 'video' ? <Video className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </div>
            <p className="text-sm font-semibold text-blue-900">{lesson.title} (Đang chỉnh sửa)</p>
          </div>
          <button onClick={onCollapse} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form / Content */}
        <LessonUploadForm lesson={lesson} onCancel={onCollapse} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3.5 border border-slate-200 rounded-lg bg-white hover:border-blue-300 hover:shadow-sm transition-all group">
      <div className="flex items-center gap-3">
        <GripVertical className="w-4 h-4 text-slate-300 cursor-grab hover:text-slate-500" />
        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          {lesson.type === 'video' ? <Video className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{lesson.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              {lesson.type === 'video' ? 'Video' : 'Văn bản'} • {lesson.duration || '0:00'}
            </span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">Đã tải lên</span>
          </div>
        </div>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onExpand} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Edit className="w-4 h-4" /></button>
        <button onClick={() => onDelete(lesson.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
      </div>
    </div>
  );
};

export default LessonItem;
