import { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import TicketList from '../../components/admin/tickets/TicketList';
import TicketDetail from '../../components/admin/tickets/TicketDetail';
import { toast } from 'sonner';
import { formatDistanceToNow, format } from 'date-fns';

import { User, Calendar, ReceiptText, Inbox, CheckCircle2, CreditCard, Wallet, MessageSquare } from 'lucide-react';

const TicketManagementPage = () => {
  const [viewMode, setViewMode] = useState('tickets'); // 'tickets' or 'refunds'
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Tickets States
  const [tickets, setTickets] = useState([]);
  const [ticketFilter, setTicketFilter] = useState('ALL');
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  // Refunds States
  const [refunds, setRefunds] = useState([]);
  const [refundFilter, setRefundFilter] = useState('ALL'); // 'ALL', 'PROCESSING', 'COMPLETED'
  const [selectedRefundId, setSelectedRefundId] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [submittingRefund, setSubmittingRefund] = useState(false);

  const fetchRequests = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        setLoading(true);
        if (viewMode === 'tickets') {
          const params = {};
          if (ticketFilter !== 'ALL') {
            params.type = ticketFilter;
          }
          const res = await adminApi.getTickets(params);
          if (!active) return;
          const ticketList = res.data || [];
          setTickets(ticketList);
          
          if (ticketList.length > 0) {
            setSelectedTicketId((prevId) => {
              if (!prevId || !ticketList.find((t) => t.id === prevId)) {
                return ticketList[0].id;
              }
              return prevId;
            });
          } else {
            setSelectedTicketId(null);
          }
        } else {
          const params = {};
          if (refundFilter !== 'ALL') {
            params.status = refundFilter;
          }
          const res = await adminApi.getRefundRequests(params);
          if (!active) return;
          const refundList = res.data || [];
          setRefunds(refundList);
          
          if (refundList.length > 0) {
            setSelectedRefundId((prevId) => {
              if (!prevId || !refundList.find((r) => r.id === prevId)) {
                const pendingItem = refundList.find(r => r.status === 'PROCESSING');
                return pendingItem ? pendingItem.id : refundList[0].id;
              }
              return prevId;
            });
          } else {
            setSelectedRefundId(null);
          }
        }
      } catch (error) {
        console.error('Error loading admin support data:', error);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();
    return () => {
      active = false;
    };
  }, [viewMode, ticketFilter, refundFilter, refreshTrigger]);

  // Load refund adminNote on selection change
  useEffect(() => {
    if (viewMode === 'refunds' && selectedRefundId) {
      const currentRefund = refunds.find(r => r.id === selectedRefundId);
      setAdminNote(currentRefund?.adminNote || '');
    }
  }, [selectedRefundId, refunds, viewMode]);

  const handleCompleteRefund = async () => {
    if (!selectedRefundId) return;
    try {
      setSubmittingRefund(true);
      await adminApi.completeRefundTransfer(selectedRefundId, adminNote);
      toast.success('Successfully marked refund transfer as completed.');
      fetchRequests();
    } catch (err) {
      console.error('Failed to complete refund transfer:', err);
      toast.error(err.response?.data?.message || 'Failed to complete refund.');
    } finally {
      setSubmittingRefund(false);
    }
  };

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);
  const selectedRefund = refunds.find((r) => r.id === selectedRefundId);

  const formatPrice = (price) => {
    return Number(price).toLocaleString('vi-VN') + '₫';
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-slate-50 font-sans">
      {/* Page Header */}
      <div className="px-6 py-4 border-b border-gray-200 shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Support & Refunds</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage user support tickets and refund requests.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
          <button
            onClick={() => {
              setViewMode('tickets');
              setLoading(true);
            }}
            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
              viewMode === 'tickets'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Support Tickets
          </button>
          <button
            onClick={() => {
              setViewMode('refunds');
              setLoading(true);
            }}
            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
              viewMode === 'refunds'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Refund Requests
          </button>
        </div>
      </div>

      {/* Split Pane Layout */}
      <div className="flex flex-1 overflow-hidden">
        {loading && (viewMode === 'tickets' ? tickets.length === 0 : refunds.length === 0) ? (
          <div className="w-full h-full flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : viewMode === 'tickets' ? (
          <>
            <TicketList
              tickets={tickets}
              activeFilter={ticketFilter}
              onFilterChange={setTicketFilter}
              selectedTicketId={selectedTicketId}
              onSelectTicket={setSelectedTicketId}
            />
            <TicketDetail
              key={selectedTicketId || 'none'}
              ticket={selectedTicket}
              onTicketUpdated={fetchRequests}
            />
          </>
        ) : (
          <>
            {/* Refunds List Left Pane */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col h-full bg-white">
              {/* Refund Filter */}
              <div className="p-4 border-b border-gray-200 flex gap-2 shrink-0 overflow-x-auto no-scrollbar">
                {['ALL', 'PROCESSING', 'COMPLETED'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setRefundFilter(filter)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm transition-colors border ${
                      refundFilter === filter
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {filter === 'ALL' ? 'All' : filter === 'PROCESSING' ? 'Processing' : 'Completed'}
                  </button>
                ))}
              </div>

              {/* Refunds Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                {refunds.length === 0 ? (
                  <div className="text-center text-gray-500 mt-10 text-sm">No refund requests found.</div>
                ) : (
                  refunds.map(req => {
                    const isActive = selectedRefundId === req.id;
                    const dateRelative = formatDistanceToNow(new Date(req.createdAt), { addSuffix: true });
                    return (
                      <div
                        key={req.id}
                        onClick={() => setSelectedRefundId(req.id)}
                        className={`p-4 rounded-xl cursor-pointer transition-all ${
                          isActive
                            ? 'bg-white border-l-4 border-l-indigo-600 shadow-[0_4px_20px_rgba(79,70,229,0.08)]'
                            : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-sm font-bold text-gray-900 leading-tight">
                            {req.user?.firstName} {req.user?.lastName}
                          </h3>
                          <span className="text-[10px] text-gray-500 shrink-0">
                            {dateRelative}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {req.status === 'PROCESSING' ? (
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] uppercase border border-amber-200 font-bold tracking-wide">
                              Processing
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] uppercase border border-emerald-200 font-bold tracking-wide">
                              Completed
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase border font-bold tracking-wide ${
                            req.method === 'credit' 
                              ? 'bg-purple-50 text-purple-600 border-purple-100'
                              : req.method === 'momo'
                              ? 'bg-pink-50 text-pink-600 border-pink-100'
                              : 'bg-blue-50 text-blue-600 border-blue-100'
                          }`}>
                            {req.method === 'credit' ? 'Credit' : req.method === 'momo' ? 'MoMo' : 'Bank'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 font-semibold line-clamp-1 mb-1">
                          {req.course?.name}
                        </p>
                        <p className="text-xs font-bold text-indigo-600">
                          {formatPrice(req.refundAmount)}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Refunds Detail Right Pane */}
            <div className="w-2/3 flex flex-col h-full bg-white border-l border-gray-200 font-sans">
              {!selectedRefund ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                  <Inbox className="w-16 h-16 mb-4 text-gray-300" />
                  <p>Select a refund request to view details</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-8 pb-32">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <span className="text-xs text-gray-500 font-semibold">REFUND REQUEST #{selectedRefund.id}</span>
                      <h2 className="text-xl font-bold text-gray-900 mt-1">{selectedRefund.course?.name}</h2>
                    </div>
                    <div>
                      {selectedRefund.status === 'PROCESSING' ? (
                        <span className="px-3 py-1 rounded bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">Processing</span>
                      ) : (
                        <span className="px-3 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">Completed</span>
                      )}
                    </div>
                  </div>

                  {/* Student Box */}
                  <div className="bg-slate-50 rounded-xl p-5 border border-gray-100 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                        <User size={20} />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-bold uppercase">Student</div>
                        <div className="text-sm font-bold text-gray-900">
                          {selectedRefund.user?.firstName} {selectedRefund.user?.lastName}
                        </div>
                        <div className="text-xs text-gray-500">{selectedRefund.user?.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-bold uppercase">Requested Date</div>
                        <div className="text-sm font-bold text-gray-900">
                          {format(new Date(selectedRefund.createdAt), 'dd/MM/yyyy HH:mm')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {selectedRefund.completedAt && `Completed: ${format(new Date(selectedRefund.completedAt), 'dd/MM/yyyy HH:mm')}`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial Details */}
                  <div className="bg-slate-50 rounded-xl p-5 border border-gray-100 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 font-bold uppercase mb-1">Refund Amount</div>
                      <div className="text-lg font-extrabold text-indigo-600">{formatPrice(selectedRefund.refundAmount)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-bold uppercase mb-1">Refund Method</div>
                      <div className="flex items-center gap-1.5 mt-0.5 text-sm font-bold text-gray-900">
                        {selectedRefund.method === 'credit' ? (
                          <Wallet size={16} className="text-purple-600" />
                        ) : (
                          <CreditCard size={16} className="text-pink-600" />
                        )}
                        <span>
                          {selectedRefund.method === 'credit' 
                            ? 'Credit Balance' 
                            : selectedRefund.method === 'momo' 
                            ? 'MoMo Wallet' 
                            : 'Bank Transfer'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-bold uppercase mb-1">Access Status</div>
                      <div className="text-sm font-bold text-red-600 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 size={16} /> Revoked Access
                      </div>
                    </div>
                  </div>

                  {/* Reason Box */}
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2">
                      <MessageSquare size={16} className="text-gray-400" /> Reason for Refund:
                    </h3>
                    <div className="bg-slate-50 rounded-xl p-4 border border-gray-200 text-sm text-gray-700 italic min-h-[60px]">
                      {selectedRefund.reason || 'No reason provided.'}
                    </div>
                  </div>

                  {/* Admin Note Input */}
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">Admin Processing Note:</h3>
                    <textarea
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Add transfer transaction ID, reference notes, or notes for the user..."
                      disabled={selectedRefund.status === 'COMPLETED' || submittingRefund}
                      className="w-full h-24 border border-gray-300 rounded-lg p-3 text-sm focus:border-indigo-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  {/* Action Bar */}
                  {selectedRefund.status === 'PROCESSING' && (
                    <div className="border-t border-gray-100 pt-6 flex justify-end">
                      <button
                        onClick={handleCompleteRefund}
                        disabled={submittingRefund}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold px-6 py-2.5 rounded-lg text-sm shadow transition-colors flex items-center gap-2"
                      >
                        {submittingRefund ? 'Completing...' : 'Mark as Refund Transferred'}
                      </button>
                    </div>
                  )}

                  {selectedRefund.status === 'COMPLETED' && selectedRefund.adminNote && (
                    <div className="border-t border-gray-100 pt-6">
                      <span className="text-xs font-bold text-gray-500 uppercase">Transfer Reference / Note:</span>
                      <p className="text-sm text-gray-700 mt-1 font-semibold">{selectedRefund.adminNote}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TicketManagementPage;
