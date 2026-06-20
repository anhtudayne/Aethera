import React, { useRef } from 'react';
import { ImageIcon, UploadCloud, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const CampaignAssetsSection = ({ bannerUrl, isUploading, onUpload, onDelete }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File vượt quá giới hạn 5MB');
      return;
    }
    onUpload(file).finally(() => {
      if (fileInputRef.current) fileInputRef.current.value = '';
    });
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // prevent clicking the upload wrapper
    if (window.confirm('Bạn có chắc chắn muốn gỡ banner này không?')) {
      onDelete();
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <header className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <ImageIcon className="text-emerald-600" size={20} />
          Campaign Assets
        </h3>
        <p className="text-sm text-gray-500 mt-1">Tải lên banner và ảnh hero cho chiến dịch.</p>
      </header>

      <div
        className="border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-colors
                   duration-300 rounded-xl bg-gray-50 p-10 flex flex-col items-center
                   justify-center text-center cursor-pointer group relative"
        onClick={() => fileInputRef.current?.click()}
      >
        {isUploading ? (
          <div className="flex flex-col items-center">
            <RefreshCw className="animate-spin text-indigo-500 mb-4" size={32} />
            <p className="font-medium text-gray-900">Đang tải lên Cloudinary...</p>
          </div>
        ) : bannerUrl ? (
          <div className="w-full relative rounded-lg overflow-hidden group-hover:opacity-90 transition-opacity max-h-60">
            <img src={bannerUrl} alt="Campaign Banner" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-4">
              <span className="text-white font-medium flex items-center gap-2 bg-indigo-600/80 px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors">
                <UploadCloud size={20} /> Thay thế
              </span>
              <button 
                onClick={handleDeleteClick}
                className="text-white font-medium flex items-center gap-2 bg-red-600/80 px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 size={20} /> Xóa Banner
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="h-16 w-16 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-indigo-200 group-hover:shadow-md transition-all duration-300 text-indigo-500">
              <UploadCloud size={32} />
            </div>
            <h4 className="text-base font-semibold text-gray-900 mb-2">Kéo & Thả file vào đây</h4>
            <p className="text-sm text-gray-500 max-w-sm mb-6">
              Định dạng hỗ trợ: PNG, JPG, WebP. Tối đa 5MB. Khuyến nghị 1920×1080px.
            </p>
            <button className="px-6 py-2.5 rounded-lg font-medium bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              Chọn file
            </button>
          </>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
        />
      </div>
    </section>
  );
};

export default CampaignAssetsSection;
