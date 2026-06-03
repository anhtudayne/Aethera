import React, { useState, useRef } from 'react';
import { CloudUpload, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

const LessonUploadForm = ({ lesson, sectionId, onCancel, onSuccess }) => {
  const [title, setTitle] = useState(lesson?.title || '');
  const [description, setDescription] = useState(lesson?.description || '');
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
        alert("Vui lòng nhập tên bài học");
        return;
    }

    // Nếu tạo bài học mới mà chưa chọn video (chỉ bắt buộc video với video lesson, text thì chưa xử lý ở đây)
    if (!lesson?.id && !file) {
        alert("Vui lòng chọn video để tải lên");
        return;
    }

    try {
        setIsUploading(true);
        let videoUrl = lesson?.videoUrl;

        // Nếu có file mới thì upload file trước
        if (file) {
            const formData = new FormData();
            formData.append('video', file);
            
            const uploadRes = await axios.post('http://localhost:8089/api/upload/video', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });
            
            videoUrl = uploadRes.data.data.url;
        }

        // Sau khi có URL (hoặc giữ URL cũ nếu sửa), tạo/cập nhật bài học
        if (!lesson?.id) {
            // Tạo mới
            await axios.post('http://localhost:8089/api/lessons', {
                sectionId: sectionId,
                title: title,
                content: description,
                type: 'video',
                videoUrl: videoUrl
            });
        } else {
            // Cập nhật (Sẽ làm sau)
            console.log("Update lesson is not fully implemented yet");
        }

        if (onSuccess) onSuccess();
    } catch (error) {
        console.error("Lỗi lưu bài học:", error);
        alert("Có lỗi xảy ra khi lưu bài học");
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <div className="p-5 md:p-6 bg-white space-y-6 border-t border-slate-100">
      {/* Basic Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Tên bài học <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm disabled:bg-slate-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Mô tả ngắn</label>
            <textarea 
              rows="3"
              placeholder="Nhập mô tả cho bài học này..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isUploading}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm resize-none disabled:bg-slate-50"
            ></textarea>
          </div>
        </div>

        {/* Dropzone & Progress */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Nội dung Video <span className="text-red-500">*</span></label>
          
          {/* Dropzone */}
          <div 
            onClick={() => !isUploading && fileInputRef.current.click()}
            className={`border-2 border-dashed ${file ? 'border-blue-400 bg-blue-50/50' : 'border-slate-300 bg-slate-50/30'} rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer group`}
          >
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="video/mp4,video/webm"
                onChange={handleFileChange}
                disabled={isUploading}
            />
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
               <CloudUpload className="w-6 h-6 text-blue-500" />
            </div>
            {file ? (
                <p className="text-sm font-medium text-blue-700 mb-1 truncate w-full px-4">{file.name}</p>
            ) : (
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Kéo thả video vào đây hoặc <span className="text-blue-600">Click để tải lên</span>
                </p>
            )}
            <p className="text-xs text-slate-500">Hỗ trợ MP4, WebM (Khuyên dùng video &lt; 100MB)</p>
          </div>

          {/* Upload Status Card */}
          {isUploading && (
              <div className="p-3 border border-slate-200 rounded-lg bg-white flex items-center gap-4 shadow-sm">
                <div className="w-16 h-12 bg-slate-100 rounded border border-slate-200 flex items-center justify-center shrink-0">
                  <ImageIcon className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-semibold text-slate-700 truncate">{file?.name || 'Đang xử lý...'}</p>
                    <span className="text-xs font-bold text-blue-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 relative overflow-hidden" style={{ width: `${uploadProgress}%` }}>
                      <div className="absolute top-0 left-0 bottom-0 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">{uploadProgress === 100 ? 'Đang lưu vào Database...' : 'Đang tải lên Cloudinary...'}</p>
                </div>
              </div>
          )}

        </div>
      </div>
      
      {/* Action Buttons for Form */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
         <button onClick={onCancel} disabled={isUploading} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50">Hủy</button>
         <button onClick={handleSave} disabled={isUploading} className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-black rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50">
             {isUploading ? 'Đang xử lý...' : 'Lưu bài học'}
         </button>
      </div>
    </div>
  );
};

export default LessonUploadForm;
