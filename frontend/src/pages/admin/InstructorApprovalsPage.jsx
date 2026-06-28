import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { toast } from 'sonner';

const InstructorApprovalsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING'); // PENDING, APPROVED, REJECTED, ALL
  const [selectedApp, setSelectedApp] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getInstructorApplications({ status: filter });
      setApplications(res.data || []);
    } catch (err) {
      toast.error('Lỗi khi tải danh sách đơn đăng ký');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn duyệt người này thành Giảng viên?')) return;
    
    try {
      await adminApi.updateInstructorApplication(id, 'APPROVED');
      toast.success('Đã duyệt thành công!');
      fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }

    try {
      await adminApi.updateInstructorApplication(selectedApp.id, 'REJECTED', rejectReason);
      toast.success('Đã từ chối đơn đăng ký!');
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedApp(null);
      fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Duyệt Đăng Ký Giảng Viên</h1>
          <p className="text-gray-500 text-sm">Quản lý và xét duyệt các đơn đăng ký trở thành giảng viên</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              filter === status 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {status === 'PENDING' ? 'Chờ duyệt' : 
             status === 'APPROVED' ? 'Đã duyệt' : 
             status === 'REJECTED' ? 'Đã từ chối' : 'Tất cả'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <i className="fi fi-rr-document text-4xl mb-3 text-gray-300"></i>
            <p>Không có đơn đăng ký nào.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <tr>
                  <th className="py-4 px-6 font-medium">Người dùng</th>
                  <th className="py-4 px-6 font-medium">Chuyên môn</th>
                  <th className="py-4 px-6 font-medium">Kinh nghiệm</th>
                  <th className="py-4 px-6 font-medium text-center">Bằng cấp</th>
                  <th className="py-4 px-6 font-medium">Ngày nộp</th>
                  <th className="py-4 px-6 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={app.user?.image || 'https://ui-avatars.com/api/?name=' + app.user?.firstName} 
                          alt="avatar" 
                          className="w-10 h-10 rounded-full object-cover bg-gray-100" 
                        />
                        <div>
                          <p className="font-medium text-gray-900">{app.user?.firstName} {app.user?.lastName}</p>
                          <p className="text-sm text-gray-500">{app.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {app.expertise}
                    </td>
                    <td className="py-4 px-6 text-gray-500 text-sm max-w-md whitespace-pre-wrap">
                      {app.experience}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {app.certificateImage ? (
                        <div 
                          onClick={() => setPreviewImage(app.certificateImage)}
                          className="inline-block cursor-pointer"
                        >
                          <img src={app.certificateImage} alt="Certificate" className="w-16 h-12 object-cover rounded shadow-sm border border-gray-200 hover:opacity-80 transition-opacity" />
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm italic">Không có</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-500 text-sm">
                      {new Date(app.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {app.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(app.id)}
                            className="px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors"
                          >
                            Duyệt
                          </button>
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setShowRejectModal(true);
                            }}
                            className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                          >
                            Từ chối
                          </button>
                        </div>
                      ) : (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          app.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {app.status === 'APPROVED' ? 'Đã duyệt' : 'Đã từ chối'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal từ chối */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Từ chối đơn đăng ký</h3>
              <p className="text-sm text-gray-500 mt-1">
                Bạn đang từ chối đơn của <span className="font-medium text-gray-700">{selectedApp?.user?.email}</span>
              </p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Lý do từ chối (Bắt buộc)</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors h-32 resize-none"
                placeholder="Ví dụ: Kinh nghiệm chưa đủ, thông tin chưa rõ ràng..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              ></textarea>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                  setSelectedApp(null);
                }}
                className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                className="px-5 py-2.5 bg-red-600 text-white font-medium hover:bg-red-700 rounded-xl transition-colors"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Preview Ảnh */}
      {previewImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-5xl w-full max-h-screen p-4 flex justify-center items-center">
            <button 
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <i className="fi fi-rr-cross"></i>
            </button>
            <img 
              src={previewImage} 
              alt="Preview" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorApprovalsPage;
