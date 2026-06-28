import React from 'react';
import { formatDistanceToNow } from 'date-fns';


const TicketList = ({ tickets, activeFilter, onFilterChange, selectedTicketId, onSelectTicket }) => {
  return (
    <div className="w-1/3 border-r border-gray-200 flex flex-col h-full bg-white font-sans">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200 flex gap-2 shrink-0 overflow-x-auto no-scrollbar">
        {['ALL', 'REFUND', 'REPORT'].map(filter => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium shadow-sm transition-colors ${
              activeFilter === filter
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {filter === 'ALL' ? 'All' : filter === 'REFUND' ? 'Refund' : 'Report'}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
        {tickets.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 text-sm">No tickets found</div>
        ) : (
          tickets.map(ticket => {
            const isActive = selectedTicketId === ticket.id;
            return (
              <div
                key={ticket.id}
                onClick={() => onSelectTicket(ticket.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  isActive
                    ? 'bg-white border-l-4 border-l-indigo-600 shadow-[0_4px_20px_rgba(79,70,229,0.08)]'
                    : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-semibold text-gray-900 leading-tight">
                    {ticket.user?.firstName} {ticket.user?.lastName}
                  </h3>
                  <span className="font-mono text-xs text-gray-500">
                    {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {ticket.ticketType === 'REFUND' ? (
                    <span className="px-2 py-0.5 rounded bg-red-50 text-red-600 text-[10px] uppercase border border-red-100 font-bold tracking-wide">
                      Refund
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 text-[10px] uppercase border border-indigo-100 font-bold tracking-wide">
                      Report
                    </span>
                  )}
                  {ticket.priority === 'HIGH' && (
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] uppercase border border-amber-200 font-bold tracking-wide">
                      High Priority
                    </span>
                  )}
                  {ticket.status === 'RESOLVED' && (
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] uppercase border border-emerald-200 font-bold tracking-wide">
                      Resolved
                    </span>
                  )}
                  {ticket.status === 'DISMISSED' && (
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] uppercase border border-gray-200 font-bold tracking-wide">
                      Dismissed
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {ticket.message}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TicketList;
