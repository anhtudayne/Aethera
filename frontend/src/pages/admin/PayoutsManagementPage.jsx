import React, { useState, useEffect } from 'react';
import { Settings, RefreshCw, AlertCircle, Clock, CheckCircle, X, ChevronLeft, ChevronRight, Calendar, Download } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import PayoutCard from '../../components/admin/payouts/PayoutCard';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

const PAGE_SIZE = 8;

import PaginationBar from '../../components/common/PaginationBar';

const PayoutsManagementPage = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('PENDING');
  const [monthFilter, setMonthFilter] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  // Pagination state – lấy totalItems từ server thay vì .length
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  const [commissionRate, setCommissionRate] = useState('15.00');
  const [savingSettings, setSavingSettings] = useState(false);

  // Modal State
  const [activeModal, setActiveModal] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // ── Fix 1: getSetting chỉ chạy 1 lần khi mount ──────────────────────────
  useEffect(() => {
    adminApi
      .getSetting('default_commission_rate')
      .then((res) => { if (res.data) setCommissionRate(res.data); })
      .catch(() => setCommissionRate('15.00'));
  }, []);

  // ── Fix 2: Race condition – dùng cleanup flag "ignore" ───────────────────
  useEffect(() => {
    let ignore = false;

    const fetchPayouts = async () => {
      setLoading(true);
      try {
        const params = {
          status: activeTab,
          page: currentPage,
          limit: PAGE_SIZE,
        };
        
        if (monthFilter) {
          params.month = monthFilter;
        }

        const res = await adminApi.getPayouts(params);

        if (!ignore) {
          setPayouts(res.data || []);
          // Fix 3: lấy totalItems từ server, không dùng .length
          setTotalItems(res.pagination?.totalItems ?? (res.data?.length ?? 0));
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          console.error('Failed to load payouts:', err);
          setError('Failed to load financial data. Please try again later.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchPayouts();

    // Cleanup: bỏ qua kết quả nếu tab/page thay đổi trước khi API kịp trả về
    return () => { ignore = true; };
  }, [activeTab, currentPage, monthFilter]);

  // Khi chuyển tab, reset về trang 1 và clear filter nếu muốn (ở đây giữ lại filter cũng được, chỉ reset page)
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // ── Fix 4: ép kiểu Number trước khi gửi lên backend ────────────────────
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const rate = parseFloat(commissionRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      toast.error('Please enter a valid commission rate (0–100)');
      return;
    }

    setSavingSettings(true);
    try {
      await adminApi.updateSetting('default_commission_rate', rate); // gửi Number
      toast.success('Platform settings updated successfully');
    } catch {
      toast.error('Failed to update platform settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const openActionModal = (payout, type) => {
    setActiveModal({ type, payout });
    setRejectNote('');
  };

  const closeActionModal = () => {
    if (!isProcessing) {
      setActiveModal(null);
      setRejectNote('');
    }
  };

  const handleConfirmAction = async () => {
    if (!activeModal) return;
    const { type, payout } = activeModal;

    if (type === 'reject' && !rejectNote.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setIsProcessing(true);
    try {
      if (type === 'complete') {
        await adminApi.markPayoutAsPaid(payout.id);
        toast.success(
          `Successfully paid ${Number(payout.amount).toLocaleString('vi-VN')} to ${payout.instructor.firstName}`
        );
      } else {
        await adminApi.rejectPayout(payout.id, rejectNote);
        toast.success(`Payout request rejected for ${payout.instructor.firstName}`);
      }

      // Xoá khỏi danh sách hiện tại và giảm totalItems đi 1
      setPayouts((prev) => prev.filter((p) => p.id !== payout.id));
      setTotalItems((prev) => Math.max(0, prev - 1));
      
      // Fix: Lỗi kẹt trang (Empty Last Page Bug)
      if (payouts.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
      
      closeActionModal();
    } catch (err) {
      toast.error(`Failed to process payout: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      const toastId = toast.loading('Exporting to Excel...');
      const params = { status: activeTab, limit: 1000 };
      if (monthFilter) params.month = monthFilter;
      
      const res = await adminApi.getPayouts(params);
      const dataToExport = res.data || [];
      
      if (dataToExport.length === 0) {
        toast.error('No data to export', { id: toastId });
        return;
      }
      
      const exportData = dataToExport.map(p => ({
        'ID': p.id,
        'Instructor Name': `${p.instructor?.firstName || ''} ${p.instructor?.lastName || ''}`.trim(),
        'Email': p.instructor?.email,
        'Amount (VND)': Number(p.amount),
        'Bank Name': p.bankName,
        'Account Number': p.accountNumber,
        'Status': p.status,
        'Date': new Date(p.createdAt).toLocaleDateString('vi-VN'),
        'Admin Note': p.adminNote || ''
      }));
      
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Payouts');
      
      XLSX.writeFile(workbook, `Payouts_${activeTab}_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success('Exported successfully!', { id: toastId });
    } catch (err) {
      toast.error('Failed to export to Excel');
      console.error(err);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="w-full min-h-full text-gray-900 sm:p-2 relative">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">Financial Management</h2>
          <p className="text-lg text-gray-500">Manage platform rates and process pending instructor payouts.</p>
        </div>
        <div className="flex gap-3 items-center">
          <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg shadow-sm hover:bg-emerald-700 font-medium transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            Export Excel
          </button>
          <button
          onClick={async () => {
            if (window.confirm('Are you sure you want to process all PENDING payouts via MoMo Bulk Payout?')) {
              try {
                const toastId = toast.loading('Initiating MoMo Bulk Payout...');
                await adminApi.createBulkPayout();
                toast.success('Bulk payout initiated successfully!', { id: toastId });
                // Force a page reload or state update to refresh the table
                setTimeout(() => window.location.reload(), 1500);
              } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to initiate bulk payout');
              }
            }
          }}
          className="px-4 py-2 bg-[#a50064] text-white rounded-lg shadow-sm hover:bg-[#80004d] font-medium transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} className={isProcessing ? 'animate-spin' : ''} />
            Bulk Payout (MoMo)
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => handleTabChange('PENDING')}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
            activeTab === 'PENDING'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Pending
          {/* Hiển thị totalItems (số thực từ server), không phải .length */}
          {activeTab === 'PENDING' && (
            <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-xs">
              {totalItems}
            </span>
          )}
        </button>
        <button
          onClick={() => handleTabChange('COMPLETED')}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
            activeTab === 'COMPLETED'
              ? 'border-b-2 border-emerald-600 text-emerald-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Completed
          {activeTab === 'COMPLETED' && (
            <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full text-xs">
              {totalItems}
            </span>
          )}
        </button>
        <button
          onClick={() => handleTabChange('REJECTED')}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
            activeTab === 'REJECTED'
              ? 'border-b-2 border-red-600 text-red-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Rejected
          {activeTab === 'REJECTED' && (
            <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3 border border-red-100">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left: Platform Settings */}
        <div className="lg:col-span-4 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Settings size={20} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Platform Settings</h3>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-500 tracking-wider uppercase">
                Default Commission Rate
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-4 pr-10 font-mono text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">%</span>
              </div>
              <p className="text-sm text-gray-500">Applied globally to all new course sales.</p>
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-3 font-medium transition-colors disabled:opacity-70 shadow-sm shadow-indigo-600/20"
            >
              {savingSettings && <RefreshCw className="animate-spin mr-2" size={18} />}
              {savingSettings ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Right: Payouts List */}
        <div className="lg:col-span-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-gray-100 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                <Clock size={20} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {activeTab === 'PENDING'
                  ? 'Pending Payouts'
                  : activeTab === 'COMPLETED'
                  ? 'Completed Payouts'
                  : 'Rejected Payouts'}
              </h3>
              
              {/* Badges */}
              {activeTab === 'PENDING' && (
                <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-orange-50 text-orange-700 font-mono text-xs font-semibold border border-orange-100">
                  {totalItems} Awaiting Action
                </span>
              )}
              {activeTab === 'COMPLETED' && (
                <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-mono text-xs font-semibold border border-emerald-100">
                  Paid Successfully
                </span>
              )}
              {activeTab === 'REJECTED' && (
                <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-red-50 text-red-700 font-mono text-xs font-semibold border border-red-100">
                  Action Required
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Filter by month */}
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                <Calendar size={16} className="text-gray-500" />
                <input
                  type="month"
                  value={monthFilter}
                  onChange={(e) => {
                    setMonthFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-sm text-gray-700 outline-none w-full cursor-pointer"
                />
                {monthFilter && (
                  <button 
                    onClick={() => { setMonthFilter(''); setCurrentPage(1); }} 
                    className="text-gray-400 hover:text-gray-600 outline-none"
                    title="Clear filter"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="py-12 text-center text-gray-500 flex flex-col items-center">
                <RefreshCw className="animate-spin mb-3 text-indigo-500" size={28} />
                Loading payouts...
              </div>
            ) : payouts.length === 0 ? (
              <div className="py-16 flex flex-col items-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <CheckCircle size={48} className="text-emerald-500 mb-4 opacity-50" strokeWidth={1.5} />
                <p className="text-lg font-medium text-gray-900 mb-1">All Caught Up!</p>
                <p>There are no {activeTab.toLowerCase()} payouts at this time.</p>
              </div>
            ) : (
              payouts.map((payout) => (
                <PayoutCard
                  key={payout.id}
                  payout={payout}
                  activeTab={activeTab}
                  onAction={openActionModal}
                  isProcessing={activeModal?.payout.id === payout.id && isProcessing}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          <PaginationBar 
            totalPages={totalPages} 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage} 
            totalItems={totalItems} 
            loading={loading} 
            pageSize={PAGE_SIZE} 
          />
        </div>
      </div>

      {/* Action Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {activeModal.type === 'complete' ? 'Confirm Payout' : 'Reject Payout'}
              </h3>
              <button
                onClick={closeActionModal}
                disabled={isProcessing}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Instructor:</span>
                  <span className="font-semibold">
                    {activeModal.payout.instructor.firstName} {activeModal.payout.instructor.lastName}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-mono font-bold text-emerald-600">
                    {Number(activeModal.payout.amount).toLocaleString('en-US')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Bank:</span>
                  <span className="font-mono">
                    {activeModal.payout.bankName} •••• {activeModal.payout.accountNumber?.slice(-4)}
                  </span>
                </div>
              </div>

              {activeModal.type === 'complete' ? (
                <p className="text-gray-600 text-sm">
                  Are you sure you want to mark this payout as paid? This confirms that you have
                  successfully transferred the funds to the instructor's bank account.
                </p>
              ) : (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Reason for rejection <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectNote}
                    onChange={(e) => setRejectNote(e.target.value)}
                    disabled={isProcessing}
                    placeholder="e.g. Invalid bank account number..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none h-24"
                  />
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={closeActionModal}
                disabled={isProcessing}
                className="px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={isProcessing}
                className={`px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center min-w-[120px] transition-colors disabled:opacity-70 ${
                  activeModal.type === 'complete'
                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20'
                    : 'bg-red-600 hover:bg-red-700 shadow-sm shadow-red-600/20'
                }`}
              >
                {isProcessing ? (
                  <RefreshCw className="animate-spin" size={18} />
                ) : activeModal.type === 'complete' ? (
                  'Confirm Payment'
                ) : (
                  'Reject Request'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayoutsManagementPage;
