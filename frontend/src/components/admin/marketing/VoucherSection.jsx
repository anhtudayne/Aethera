import React, { useState } from 'react';
import { Tag, PlusCircle, RefreshCw, Pencil, Copy, Power, PowerOff } from 'lucide-react';
import { toast } from 'sonner';
import VoucherFormModal from './VoucherFormModal';
import PaginationBar from '../../common/PaginationBar';
import { formatPrice } from '../../../utils/helpers';

const formatDate = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '—';

const StatusBadge = ({ status }) => {
  const map = {
    ACTIVE: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    EXPIRED: 'bg-red-50 text-red-500 border-red-100',
    DISABLED: 'bg-gray-100 text-gray-500 border-gray-200',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${map[status] ?? map.DISABLED}`}
    >
      {status === 'ACTIVE' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
      {status}
    </span>
  );
};

const VoucherSection = ({ vouchers, isLoading, onAction, pagination }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Đã sao chép: ${code}`);
  };

  const handleEdit = (voucher) => {
    setEditingVoucher(voucher);
    setIsModalOpen(true);
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <VoucherFormModal
        isOpen={isModalOpen}
        mode={editingVoucher ? 'edit' : 'create'}
        initialData={editingVoucher}
        onClose={() => { setIsModalOpen(false); setEditingVoucher(null); }}
        onSubmit={async (formData, id) => {
          await onAction.submitVoucher(formData, id);
          setIsModalOpen(false);
          setEditingVoucher(null);
        }}
      />

      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-2">
          <Tag className="text-indigo-600" size={20} />
          <h3 className="text-xl font-semibold text-gray-900">Danh sách Voucher</h3>
          <span className="ml-2 text-sm text-gray-400 font-normal">{vouchers.length} mã</span>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                     bg-indigo-600 text-white text-sm font-semibold
                     hover:bg-indigo-700 active:scale-95
                     shadow-sm shadow-indigo-600/30 transition-all"
        >
          <PlusCircle size={17} />
          Tạo Voucher Mới
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider bg-gray-50">
              <th className="py-4 px-6 font-semibold">Code</th>
              <th className="py-4 px-6 font-semibold">Giảm</th>
              <th className="py-4 px-6 font-semibold whitespace-nowrap">Ngày BĐ</th>
              <th className="py-4 px-6 font-semibold whitespace-nowrap">Ngày HH</th>
              <th className="py-4 px-6 font-semibold min-w-[160px]">Lượt dùng</th>
              <th className="py-4 px-6 font-semibold">Trạng thái</th>
              <th className="py-4 px-6 font-semibold text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-sm font-medium divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td colSpan="7" className="py-16 text-center text-gray-400">
                  <RefreshCw className="animate-spin inline-block mr-2" size={20} />
                  Đang tải danh sách voucher...
                </td>
              </tr>
            ) : vouchers.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-16 text-center text-gray-400">
                  Chưa có voucher nào.{' '}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-indigo-600 hover:underline font-semibold"
                  >
                    Tạo ngay →
                  </button>
                </td>
              </tr>
            ) : (
              vouchers.map((voucher) => {
                const isExpired = voucher.status === 'EXPIRED';
                const isDisabled = voucher.status === 'DISABLED';
                const usageCount = voucher.usageCount ?? 0;
                const maxUsageVal = voucher.maxUsage;
                const percentage = maxUsageVal
                  ? Math.min(100, Math.round((usageCount / maxUsageVal) * 100))
                  : null;

                return (
                  <tr
                    key={voucher.id}
                    className={`transition-colors group
                      ${isExpired || isDisabled
                        ? 'bg-gray-50/60 opacity-60'
                        : 'hover:bg-indigo-50/30'
                      }`}
                  >
                    <td className="py-4 px-6">
                      <span className={`font-mono ${isExpired ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {voucher.code}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-indigo-600 whitespace-nowrap">
                      {voucher.discountType === 'FIXED' 
                        ? formatPrice(Number(voucher.discountValue))
                        : (
                          <div className="flex flex-col">
                            <span>{`${Number(voucher.discountValue || voucher.discountPercent)}%`}</span>
                            {voucher.maxDiscountValue && (
                              <span className="text-xs text-gray-500 font-normal">
                                Tối đa {formatPrice(Number(voucher.maxDiscountValue))}
                              </span>
                            )}
                          </div>
                        )
                      }
                    </td>
                    <td className="py-4 px-6 text-gray-500 whitespace-nowrap text-xs tabular-nums">
                      {formatDate(voucher.startDate)}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-xs tabular-nums">
                      <span className={isExpired ? 'text-red-500 font-semibold' : 'text-gray-500'}>
                        {formatDate(voucher.expiryDate)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1.5 min-w-[140px]">
                        <span className="text-xs text-gray-500 tabular-nums">
                          {usageCount.toLocaleString('vi-VN')}
                          {maxUsageVal
                            ? ` / ${maxUsageVal.toLocaleString('vi-VN')}`
                            : ' / ∞'}
                        </span>
                        {maxUsageVal && (
                          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                percentage > 80 ? 'bg-amber-500' : 'bg-indigo-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={voucher.status} />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(voucher)}
                          title="Chỉnh sửa voucher"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleCopyCode(voucher.code)}
                          title="Sao chép mã"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <Copy size={15} />
                        </button>
                        {!isExpired && (
                          <button
                            onClick={() => onAction.toggleStatus(voucher)}
                            title={voucher.status === 'ACTIVE' ? 'Tắt voucher' : 'Bật voucher'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              voucher.status === 'ACTIVE'
                                ? 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                          >
                            {voucher.status === 'ACTIVE' ? <PowerOff size={15} /> : <Power size={15} />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="p-4 bg-white border-t border-gray-100">
          <PaginationBar 
            totalPages={pagination.totalPages}
            currentPage={pagination.currentPage}
            setCurrentPage={onAction.pageChange}
            totalItems={pagination.totalItems}
            loading={isLoading}
            pageSize={pagination.limit}
          />
        </div>
      )}
    </section>
  );
};

export default VoucherSection;
