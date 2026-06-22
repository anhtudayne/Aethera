import React, { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { adminApi } from '../../../api/adminApi';
import { toast } from 'sonner';
import { User, Calendar, ReceiptText, Info, Inbox, ZoomIn, Send, Image as ImageIcon } from 'lucide-react';

const TicketDetail = ({ ticket, onTicketUpdated }) => {
  const [internalNotes, setInternalNotes] = useState(ticket?.internalNotes || '');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!ticket) {
    return (
      <div className="w-2/3 flex flex-col h-full bg-white border-l border-gray-200 items-center justify-center text-gray-500 font-sans">
        <Inbox className="w-16 h-16 mb-4 text-gray-300" />
        <p>Chọn một yêu cầu để xem chi tiết</p>
      </div>
    );
  }

  const handleUpdateNote = async () => {
    try {
      setIsUpdating(true);
      await adminApi.updateTicketNote(ticket.id, internalNotes);
      toast.success('Đã cập nhật ghi chú nội bộ');
      onTicketUpdated();
    } catch (error) {
      toast.error('Lỗi khi cập nhật ghi chú');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      setIsUpdating(true);
      await adminApi.updateTicketStatus(ticket.id, status);
      toast.success(`Đã cập nhật trạng thái thành ${status}`);
      onTicketUpdated();
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    } finally {
      setIsUpdating(false);
    }
  };

  const attachments = ticket.attachments ? JSON.parse(ticket.attachments) : [];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
      case 'IN_PROGRESS':
        return <span className="px-2 py-1 rounded bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">Đang chờ xử lý</span>;
      case 'RESOLVED':
        return <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">Đã xử lý</span>;
      case 'DISMISSED':
        return <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200">Đã từ chối</span>;
      default:
        return <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200">{status}</span>;
    }
  };

  return (
    <div className="w-2/3 flex flex-col h-full relative bg-white border-l border-gray-200 font-sans">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8 pb-32">
        {/* Detail Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <div className="flex gap-2">
              {ticket.ticketType === 'REFUND' ? (
                <span className="px-2 py-1 rounded bg-red-50 text-red-600 text-xs uppercase border border-red-100 font-bold">
                  Hoàn tiền
                </span>
              ) : (
                <span className="px-2 py-1 rounded bg-indigo-50 text-indigo-600 text-xs uppercase border border-indigo-100 font-bold">
                  Báo cáo
                </span>
              )}
              {getStatusBadge(ticket.status)}
            </div>
            {ticket.ticketType === 'REFUND' && ticket.requestedAmount && (
              <p className="text-2xl text-red-600 font-bold whitespace-nowrap">
                {Number(ticket.requestedAmount).toLocaleString('vi-VN')} đ
              </p>
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-4">
            {ticket.title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-gray-500 text-sm">
            <span className="flex items-center gap-1.5">
              <User size={16} />
              {ticket.user?.firstName} {ticket.user?.lastName} (ID: {ticket.user?.id})
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block"></span>
            <span className="flex items-center gap-1.5">
              <Calendar size={16} />
              {format(new Date(ticket.createdAt), "dd MMM yyyy - HH:mm", { locale: vi })}
            </span>
            {ticket.targetId && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block"></span>
                <span className="flex items-center gap-1.5 font-mono">
                  <ReceiptText size={16} /> Ref: {ticket.targetId}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Complaint Body */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8 shadow-sm">
          <h3 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">
            Nội dung chi tiết
          </h3>
          <div className="text-base text-gray-800 whitespace-pre-line leading-relaxed">
            {ticket.message}
          </div>
        </div>

        {/* Evidence Gallery */}
        {attachments.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">
              Minh chứng đính kèm
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {attachments.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-video bg-gray-100 flex items-center justify-center"
                >
                  <img
                    alt={`Evidence ${idx + 1}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                    src={imgUrl}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden absolute inset-0 flex-col items-center justify-center text-gray-400 z-0">
                    <ImageIcon size={24} className="mb-2" />
                    <span className="text-xs">Image error</span>
                  </div>
                  <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10">
                    <ZoomIn className="text-white w-8 h-8" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Internal Notes */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">
            Ghi chú nội bộ
          </h3>
          <div className="relative">
            <textarea
              className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all min-h-[120px]"
              placeholder="Thêm ghi chú nội bộ cho admin khác..."
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
            ></textarea>
            <button
              onClick={handleUpdateNote}
              disabled={isUpdating}
              className="absolute bottom-3 right-3 p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Action Bar */}
      {ticket.status !== 'RESOLVED' && ticket.status !== 'DISMISSED' && (
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-md border-t border-gray-200 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-10">
          <div className="text-gray-600 text-sm flex items-center gap-2">
            <Info size={18} className="text-indigo-600" />
            <span className="font-medium">Vui lòng kiểm tra kỹ trước khi quyết định</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => handleUpdateStatus('DISMISSED')}
              disabled={isUpdating}
              className="px-6 py-2.5 rounded-xl bg-white border border-red-500 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors shadow-sm disabled:opacity-50"
            >
              Từ chối yêu cầu
            </button>
            <button
              onClick={() => handleUpdateStatus('RESOLVED')}
              disabled={isUpdating}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg disabled:opacity-50"
            >
              {ticket.ticketType === 'REFUND' ? 'Chấp nhận hoàn tiền' : 'Đánh dấu đã xử lý'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetail;
