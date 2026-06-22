import React, { useState, useEffect } from 'react';
import TicketList from '../../components/admin/tickets/TicketList';
import TicketDetail from '../../components/admin/tickets/TicketDetail';
import { adminApi } from '../../api/adminApi';

const TicketManagementPage = () => {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== 'ALL') {
        params.type = filter;
      }
      const res = await adminApi.getTickets(params);
      setTickets(res.data || []);
      
      // Select the first ticket if nothing is selected or if selected ticket is no longer in the list
      if (res.data && res.data.length > 0) {
        if (!selectedTicketId || !res.data.find((t) => t.id === selectedTicketId)) {
          setSelectedTicketId(res.data[0].id);
        }
      } else {
        setSelectedTicketId(null);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);

  const unresolvedCount = tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-slate-50 font-sans">
      {/* Page Header */}
      <div className="px-6 py-6 border-b border-gray-200 shrink-0 flex justify-between items-center bg-white">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Support & Refunds</h2>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý yêu cầu hỗ trợ và hoàn tiền của người dùng
          </p>
        </div>
        <div className="flex gap-2">
          <div className="bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-xs font-semibold text-gray-700 uppercase">{unresolvedCount} Chưa xử lý</span>
          </div>
        </div>
      </div>

      {/* Split Pane Layout */}
      <div className="flex flex-1 overflow-hidden">
        {loading && tickets.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <>
            <TicketList
              tickets={tickets}
              activeFilter={filter}
              onFilterChange={setFilter}
              selectedTicketId={selectedTicketId}
              onSelectTicket={setSelectedTicketId}
            />
            <TicketDetail
              ticket={selectedTicket}
              onTicketUpdated={fetchTickets}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TicketManagementPage;
