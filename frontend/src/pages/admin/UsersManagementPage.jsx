import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, RefreshCw, AlertCircle, FolderOpen, Loader2 } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import UserTableRow from '../../components/admin/users/UserTableRow';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';

const UsersManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;
  const role = searchParams.get('role') || 'all';
  const search = searchParams.get('search') || '';
  
  const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0, limit: 10 });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({ page, role, search, limit: 10 });
      setUsers(res.data || []);
      if (res.pagination) setPagination(res.pagination);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch admin users:', err);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, role, search]);

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

  const handleRoleChange = (newRole) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('role', newRole);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  const handleToggleStatus = async (userId, isActive) => {
    try {
      await adminApi.updateUserStatus(userId, isActive);
      toast.success(`User successfully ${isActive ? 'unbanned' : 'banned'}`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive } : u));
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  return (
    <div className="w-full min-h-full text-gray-900 sm:p-2">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">User Management</h2>
          <p className="text-lg text-gray-500">Review, manage, and verify user accounts across the platform.</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 flex items-center h-10 rounded-lg bg-white border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <Search className="absolute left-3 text-gray-700" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              defaultValue={search}
              onKeyDown={handleSearch}
              className="h-full w-full pl-10 pr-3 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 focus:ring-0"
            />
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
      <div className="bg-white rounded-xl w-full overflow-hidden shadow-sm border border-gray-200">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-4 pt-2 overflow-x-auto hide-scrollbar bg-gray-50/50">
          <button
            onClick={() => handleRoleChange('all')}
            className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${role === 'all' ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 hover:text-gray-700 border-transparent'}`}
          >
            All Users
          </button>
          <button
            onClick={() => handleRoleChange('student')}
            className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${role === 'student' ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 hover:text-gray-700 border-transparent'}`}
          >
            Students
          </button>
          <button
            onClick={() => handleRoleChange('instructor')}
            className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${role === 'instructor' ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 hover:text-gray-700 border-transparent'}`}
          >
            Instructors
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-[#F3F4F6]">
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider font-sans min-w-[250px]">User</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider font-sans min-w-[120px]">Role</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider font-sans min-w-[150px]">Joined</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider font-sans min-w-[120px]">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right sticky right-0 bg-[#F3F4F6] border-l border-gray-200 z-10 font-sans min-w-[80px]">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-500">
                    <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6">
                    <div className="w-full min-h-[250px] flex flex-col items-center justify-center bg-[#F9FAFB] border border-gray-200 rounded-lg text-[#6B7280]">
                      <FolderOpen size={48} className="text-gray-300 mb-4" strokeWidth={1.5} />
                      <p>No users found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <UserTableRow 
                    key={user.id} 
                    user={user} 
                    onToggleStatus={handleToggleStatus}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500 bg-gray-50/50">
            <div>
              Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)} of {pagination.totalItems} entries
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="w-8 h-8 rounded flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <ChevronDown size={16} className="rotate-90" />
              </button>
              
              <button className="w-8 h-8 rounded flex items-center justify-center bg-indigo-50 text-indigo-600 font-medium border border-indigo-100">
                {pagination.currentPage}
              </button>
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="w-8 h-8 rounded flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <ChevronDown size={16} className="-rotate-90" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersManagementPage;
