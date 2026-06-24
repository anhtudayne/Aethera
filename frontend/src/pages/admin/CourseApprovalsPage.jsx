import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, RefreshCw, AlertCircle, FolderOpen, X, Loader2 } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import CourseTableRow from '../../components/admin/courses/CourseTableRow';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';

const CourseApprovalsPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [modalState, setModalState] = useState({ isOpen: false, courseId: null, courseName: '', action: null });
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [historyModal, setHistoryModal] = useState({ isOpen: false, courseId: null, courseName: '', data: [], loading: false });

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;
  const status = searchParams.get('status') || 'all';
  const search = searchParams.get('search') || '';

  const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0, limit: 10 });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCourses({ page, status, search, limit: 10 });
      setCourses(res.data || []);
      if (res.pagination) setPagination(res.pagination);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch admin courses:', err);
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page, status, search]);

  const handleSearch = (e) => {
    const val = e.target.value;
    if (e.key === 'Enter') {
      const newParams = new URLSearchParams(searchParams);
      if (val) newParams.set('search', val);
      else newParams.delete('search');
      newParams.set('page', '1');
      setSearchParams(newParams);
    }
  };

  const handleStatusChange = (newStatus) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('status', newStatus);
    newParams.set('page', '1');
    setSearchParams(newParams);
    setIsFilterOpen(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  const handleCourseStatusUpdate = (courseId, newStatus) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, status: newStatus } : c));
  };

  const handleApproveCourse = async (courseId) => {
    try {
      await adminApi.updateCourseStatus(courseId, 'published', null);
      toast.success('Course approved successfully!');
      handleCourseStatusUpdate(courseId, 'published');
    } catch (err) {
      toast.error('Failed to approve course');
    }
  };

  const handleOpenReasonModal = (courseId, courseName, action) => {
    setModalState({ isOpen: true, courseId, courseName, action });
    setReason('');
  };

  const closeReasonModal = () => {
    if (isSubmitting) return;
    setModalState({ isOpen: false, courseId: null, courseName: '', action: null });
    setReason('');
  };

  const handleViewHistory = async (courseId, courseName) => {
    setHistoryModal({ isOpen: true, courseId, courseName, data: [], loading: true });
    try {
      const res = await adminApi.getCourseHistory(courseId);
      setHistoryModal(prev => ({ ...prev, data: res.data || [], loading: false }));
    } catch (err) {
      toast.error('Failed to load audit log');
      setHistoryModal(prev => ({ ...prev, loading: false }));
    }
  };

  const closeHistoryModal = () => {
    setHistoryModal({ isOpen: false, courseId: null, courseName: '', data: [], loading: false });
  };

  const handleReasonSubmit = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason');
      return;
    }
    setIsSubmitting(true);
    try {
      await adminApi.updateCourseStatus(modalState.courseId, modalState.action, reason.trim());
      toast.success(`Course ${modalState.action} successfully!`);
      handleCourseStatusUpdate(modalState.courseId, modalState.action);
      closeReasonModal();
    } catch (err) {
      toast.error(`Failed to ${modalState.action} course`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusDisplay = () => {
    if (status === 'all') return 'All';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="w-full min-h-full text-gray-900 sm:p-2">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">Course Management</h2>
          <p className="text-lg text-gray-500">Review and moderate submitted courses</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 flex items-center h-10 rounded-lg bg-white border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <Search className="absolute left-3 text-gray-700" size={18} />
            <input
              type="text"
              placeholder="Search..."
              defaultValue={search}
              onKeyDown={handleSearch}
              className="h-full w-full pl-10 pr-3 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 focus:ring-0"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 h-10 px-4 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
            >
              <Filter size={16} className="text-gray-700" />
              <span>Status: {getStatusDisplay()}</span>
              <ChevronDown size={16} className="text-gray-700" />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20 border border-gray-200">
                {['all', 'pending', 'published', 'rejected', 'suspended', 'draft'].map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 capitalize"
                  >
                    {s === 'published' ? 'Approved' : s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-3">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white rounded-xl w-full overflow-x-auto shadow-sm border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-[#F3F4F6]">
              <th className="py-4 px-6 text-sm font-semibold text-[#4B5563] uppercase tracking-wider font-sans min-w-[300px] w-1/3">Course</th>
              <th className="py-4 px-6 text-sm font-semibold text-[#4B5563] uppercase tracking-wider font-sans min-w-[150px]">Instructor</th>
              <th className="py-4 px-6 text-sm font-semibold text-[#4B5563] uppercase tracking-wider font-sans min-w-[120px]">Category</th>
              <th className="py-4 px-6 text-sm font-semibold text-[#4B5563] uppercase tracking-wider text-right font-sans min-w-[100px]">Price</th>
              <th className="py-4 px-6 text-sm font-semibold text-[#4B5563] uppercase tracking-wider font-sans min-w-[120px]">Status</th>
              <th className="py-4 px-6 text-sm font-semibold text-[#4B5563] uppercase tracking-wider text-right sticky right-0 bg-[#F3F4F6] border-l border-gray-200 z-10 font-sans min-w-[80px]">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-gray-500">
                  <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                  Loading courses...
                </td>
              </tr>
            ) : courses.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6">
                  <div className="w-full min-h-[250px] flex flex-col items-center justify-center bg-[#F9FAFB] border border-gray-200 rounded-lg text-[#6B7280]">
                    <FolderOpen size={48} className="text-gray-300 mb-4" strokeWidth={1.5} />
                    <p>No courses found matching your criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              courses.map(course => (
                <CourseTableRow
                  key={course.id}
                  course={course}
                  onApprove={handleApproveCourse}
                  onRequestReason={handleOpenReasonModal}
                  onViewHistory={handleViewHistory}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                {modalState.action === 'suspended' ? 'Suspend' : 'Reject'} Course
              </h3>
              <button onClick={closeReasonModal} disabled={isSubmitting} className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50">
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                You are about to <strong className="text-gray-900">{modalState.action}</strong> the course: <br />
                <span className="font-medium text-gray-800">"{modalState.courseName}"</span>
              </p>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isSubmitting}
                placeholder={`Please provide a detailed reason. This will be emailed to the instructor.`}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none h-28 disabled:bg-gray-50"
              />
            </div>
            <div className="px-4 py-3 bg-gray-50 flex justify-end gap-3 border-t border-gray-200">
              <button
                onClick={closeReasonModal}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReasonSubmit}
                disabled={isSubmitting}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 ${modalState.action === 'suspended' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {isSubmitting ? (
                  <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                ) : (
                  <>{modalState.action === 'suspended' ? 'Suspend' : 'Reject'} Course</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {historyModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">
                Audit Log: <span className="font-normal text-gray-600">"{historyModal.courseName}"</span>
              </h3>
              <button onClick={closeHistoryModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 bg-gray-50/50">
              {historyModal.loading ? (
                <div className="py-12 text-center text-gray-500 flex flex-col items-center">
                  <Loader2 className="animate-spin mb-2 text-indigo-500" size={24} />
                  <span>Loading audit log...</span>
                </div>
              ) : historyModal.data.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  <FolderOpen className="mx-auto mb-2 text-gray-300" size={32} />
                  <span>No status history found.</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {historyModal.data.map((log, index) => (
                    <div key={log.id || index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm relative">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {log.admin?.username || log.admin?.email || 'System'}
                          </span>
                          <span className="text-sm text-gray-500">changed status</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs capitalize">{log.oldStatus}</span>
                        <span className="text-gray-400">→</span>
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-medium capitalize">{log.newStatus}</span>
                      </div>
                      {log.reason && (
                        <div className="mt-3 p-3 bg-red-50/50 border border-red-100 rounded-md text-sm text-gray-700">
                          <strong className="text-gray-900 block mb-1 text-xs">Reason:</strong>
                          {log.reason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-4 py-3 bg-gray-50 flex justify-end gap-3 border-t border-gray-200 shrink-0">
              <button
                onClick={closeHistoryModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CourseApprovalsPage;
