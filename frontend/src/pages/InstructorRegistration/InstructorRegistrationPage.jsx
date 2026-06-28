import React, { useState, useEffect, useRef } from 'react';
import { userApi } from '../../api/userApi';
import axiosClient from '../../api/axiosClient';

const InstructorRegistrationPage = () => {
  const [status, setStatus] = useState(null); // 'PENDING', 'APPROVED', 'REJECTED', or null
  const [reason, setReason] = useState('');
  const [expertise, setExpertise] = useState('');
  const [experience, setExperience] = useState('');
  const [certificateImage, setCertificateImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchApplicationStatus();
  }, []);

  const fetchApplicationStatus = async () => {
    try {
      setLoading(true);
      const res = await userApi.getInstructorApplicationStatus();
      if (res.data) {
        setStatus(res.data.status);
        setReason(res.data.reason || '');
      }
    } catch (err) {
      console.error('Failed to fetch status', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('thumbnail', file); // using existing thumbnail upload endpoint
    
    setUploading(true);
    setError('');
    
    try {
      const res = await axiosClient.post('/upload/thumbnail', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.imageUrl) {
        setCertificateImage(res.imageUrl);
      }
    } catch (err) {
      setError('Lỗi tải ảnh lên: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!expertise.trim() || !experience.trim()) {
      setError('Vui lòng điền đầy đủ thông tin chuyên môn và kinh nghiệm.');
      return;
    }
    
    setSubmitting(true);
    setError('');
    try {
      const payload = { expertise, experience };
      if (certificateImage) payload.certificateImage = certificateImage;
      
      const res = await userApi.applyInstructor(payload);
      setStatus('PENDING'); // Update local state immediately
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi nộp đơn.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  if (status === 'APPROVED') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          <i className="fi fi-rr-check-circle"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Đơn của bạn đã được duyệt!</h2>
        <p className="text-gray-600 mb-6">Chúc mừng bạn đã trở thành giảng viên trên nền tảng. Bây giờ bạn có thể bắt đầu tạo khóa học.</p>
      </div>
    );
  }

  if (status === 'PENDING') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          <i className="fi fi-rr-time-fast"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Đơn đăng ký đang chờ duyệt</h2>
        <p className="text-gray-600 mb-6">Quản trị viên đang xem xét đơn đăng ký của bạn. Vui lòng quay lại sau.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Trở thành Giảng viên</h2>
      <p className="text-gray-600 mb-8">Chia sẻ kiến thức của bạn với hàng ngàn học viên bằng cách đăng ký làm giảng viên.</p>

      {status === 'REJECTED' && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 flex items-start gap-3">
          <i className="fi fi-rr-exclamation text-lg mt-0.5"></i>
          <div>
            <h4 className="font-semibold mb-1">Đơn đăng ký trước đó bị từ chối</h4>
            <p className="text-sm">{reason}</p>
            <p className="text-sm mt-2 font-medium">Bạn có thể nộp lại đơn bên dưới.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Chuyên môn giảng dạy <span className="text-red-500">*</span></label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            placeholder="VD: Lập trình Web, Thiết kế UI/UX, Marketing..."
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kinh nghiệm của bạn <span className="text-red-500">*</span></label>
          <textarea
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors h-32 resize-none"
            placeholder="Hãy mô tả chi tiết về kinh nghiệm làm việc và giảng dạy của bạn..."
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh Bằng cấp / Chứng chỉ (Tùy chọn)</label>
          <div className="mt-1 flex items-center gap-4">
            {certificateImage && (
              <div className="relative w-32 h-24 rounded-lg overflow-hidden border border-gray-200 group">
                <img src={certificateImage} alt="Certificate" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setCertificateImage('')}
                  className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <i className="fi fi-rr-trash"></i>
                </button>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {uploading ? (
                <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <i className="fi fi-rr-upload"></i>
              )}
              {certificateImage ? 'Tải ảnh khác' : 'Tải lên hình ảnh'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Định dạng JPG, PNG. Bằng cấp liên quan giúp tăng khả năng duyệt đơn.</p>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={submitting || uploading}
            className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> Đang gửi...</>
            ) : (
              'Gửi Đăng Ký'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InstructorRegistrationPage;
