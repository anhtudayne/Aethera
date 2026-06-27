import React, { useState, useEffect } from 'react';
import { Tag, Percent, Calendar, Hash, PlusCircle, Save, RefreshCw, X } from 'lucide-react';

/**
 * VoucherFormModal – Dùng cho cả tạo mới lẫn chỉnh sửa voucher.
 *
 * Props:
 *  - isOpen      : boolean          – hiển thị modal (dùng ở mode CREATE)
 *  - mode        : 'create'|'edit'  – chế độ hoạt động
 *  - initialData : object | null    – voucher hiện tại (chỉ dùng ở mode EDIT)
 *  - onClose     : () => void
 *  - onSubmit    : (formData, id?) => Promise<void>
 *                    create → onSubmit(formData)
 *                    edit   → onSubmit(formData, initialData.id)
 */
const VoucherFormModal = ({ isOpen, mode = 'create', initialData = null, onClose, onSubmit }) => {
  // Modal hiển thị khi isOpen=true (create) hoặc khi có initialData (edit)
  const visible = mode === 'create' ? isOpen : Boolean(initialData);

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('');
  const [maxDiscountValue, setMaxDiscountValue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [maxUsage, setMaxUsage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = mode === 'edit';

  // Đồng bộ form theo chế độ
  useEffect(() => {
    if (!visible) return;

    if (isEdit && initialData) {
      // Pre-fill từ dữ liệu hiện có
      setCode(initialData.code ?? '');
      setDiscountType(initialData.discountType ?? 'PERCENTAGE');
      setDiscountValue(String(Number(initialData.discountValue || initialData.discountPercent || 0)));
      setMaxDiscountValue(initialData.maxDiscountValue != null ? String(Number(initialData.maxDiscountValue)) : '');
      setStartDate(toDateInputValue(initialData.startDate));
      setExpiryDate(toDateInputValue(initialData.expiryDate));
      setMaxUsage(initialData.maxUsage != null ? String(initialData.maxUsage) : '');
    } else {
      // Reset sạch cho form tạo mới
      setCode('');
      setDiscountType('PERCENTAGE');
      setDiscountValue('');
      setMaxDiscountValue('');
      setStartDate('');
      setExpiryDate('');
      setMaxUsage('');
    }
  }, [visible, initialData, isEdit]);

  // Đóng modal khi nhấn Escape
  useEffect(() => {
    if (!visible) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [visible, onClose]);

  if (!visible) return null;

  // ── Style tokens theo mode ──────────────────────────────────────────────
  const theme = isEdit
    ? {
        icon: 'bg-amber-50 text-amber-600',
        ring: 'focus:border-amber-500 focus:ring-amber-500/20',
        submit: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25',
        submitIcon: <Save size={16} />,
        submitLabel: 'Lưu thay đổi',
        submittingLabel: 'Đang lưu...',
        title: 'Chỉnh sửa Voucher',
        subtitle: (
          <span>
            Mã:{' '}
            <span className="font-mono font-semibold text-gray-600">{initialData?.code}</span>
          </span>
        ),
      }
    : {
        icon: 'bg-indigo-50 text-indigo-600',
        ring: 'focus:border-indigo-500 focus:ring-indigo-500/20',
        submit: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20',
        submitIcon: <PlusCircle size={16} />,
        submitLabel: 'Tạo mã',
        submittingLabel: 'Đang tạo...',
        title: 'Tạo Voucher Mới',
        subtitle: 'Điền đầy đủ thông tin để tạo mã giảm giá.',
      };

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code || !discountValue || !expiryDate) return;

    setIsSubmitting(true);
    try {
      const formData = {
        code,
        discountType,
        discountValue: Number(discountValue),
        maxDiscountValue: discountType === 'PERCENTAGE' && maxDiscountValue ? Number(maxDiscountValue) : undefined,
        startDate: startDate || undefined,
        expiryDate,
        maxUsage: maxUsage || undefined,
      };
      await onSubmit(formData, isEdit ? initialData.id : undefined);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/60">
          <div className="flex items-center gap-2.5">
            <span className={`p-2 rounded-lg ${theme.icon}`}>
              <Tag size={20} />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{theme.title}</h2>
              <p className="text-xs text-gray-400">{theme.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Voucher Code */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
              Voucher Code {!isEdit && <span className="text-red-500">*</span>}
            </label>
            {isEdit ? (
              // Edit mode: hiển thị readonly
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                <Tag size={16} className="text-gray-400 shrink-0" />
                <span className="font-mono font-bold text-gray-800">{initialData?.code}</span>
                <span className="ml-auto text-xs text-gray-400 italic">Không thể đổi</span>
              </div>
            ) : (
              // Create mode: input bình thường
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="VD: SUMMER2026"
                  required
                  autoFocus
                  className={`w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg
                              focus:outline-none focus:ring-2 ${theme.ring}
                              font-mono text-gray-900 uppercase placeholder:normal-case transition-all`}
                />
              </div>
            )}
          </div>

          {/* Discount Percentage / Fixed */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                Loại giảm giá <span className="text-red-500">*</span>
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg
                            focus:outline-none focus:ring-2 ${theme.ring}
                            text-gray-900 transition-all text-sm`}
              >
                <option value="PERCENTAGE">Phần trăm (%)</option>
                <option value="FIXED">Số tiền cố định (đ)</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                Mức giảm <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max={discountType === 'PERCENTAGE' ? 100 : undefined}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder={discountType === 'PERCENTAGE' ? "1 – 100" : "Nhập số tiền..."}
                  required
                  autoFocus={isEdit}
                  className={`w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg
                              focus:outline-none focus:ring-2 ${theme.ring}
                              font-mono text-gray-900 transition-all`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none font-bold text-sm">
                  {discountType === 'PERCENTAGE' ? '%' : 'đ'}
                </span>
              </div>
            </div>
          </div>

          {/* Max Discount Value (Only for PERCENTAGE) */}
          {discountType === 'PERCENTAGE' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                Mức giảm tối đa
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={maxDiscountValue}
                  onChange={(e) => setMaxDiscountValue(e.target.value)}
                  placeholder="Bỏ trống = không giới hạn"
                  className={`w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg
                              focus:outline-none focus:ring-2 ${theme.ring}
                              font-mono text-gray-900 transition-all`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none font-bold text-sm">
                  đ
                </span>
              </div>
            </div>
          )}

          {/* Start Date + Expiry Date – 2 cột */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                Ngày bắt đầu
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`w-full pl-9 pr-2 py-2.5 bg-gray-50 border border-gray-200 rounded-lg
                              focus:outline-none focus:ring-2 ${theme.ring}
                              text-gray-900 transition-all text-sm`}
                />
              </div>
              {!isEdit && <p className="text-xs text-gray-400">Bỏ trống = ngay lập tức.</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                Ngày hết hạn <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                  className={`w-full pl-9 pr-2 py-2.5 bg-gray-50 border border-gray-200 rounded-lg
                              focus:outline-none focus:ring-2 ${theme.ring}
                              text-gray-900 transition-all text-sm`}
                />
              </div>
            </div>
          </div>

          {/* Ghi chú gia hạn – chỉ hiện khi sửa voucher EXPIRED */}
          {isEdit && initialData?.status === 'EXPIRED' && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5">
              💡 Đặt ngày hết hạn trong tương lai để voucher tự động chuyển lại về{' '}
              <strong>ACTIVE</strong>.
            </p>
          )}

          {/* Usage Limit */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
              Giới hạn lượt dùng
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              <input
                type="number"
                min="1"
                value={maxUsage}
                onChange={(e) => setMaxUsage(e.target.value)}
                placeholder="Bỏ trống = không giới hạn (∞)"
                className={`w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg
                            focus:outline-none focus:ring-2 ${theme.ring}
                            font-mono text-gray-900 transition-all`}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100
                         hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !code || !discountValue || !expiryDate}
              className={`flex-1 py-2.5 rounded-lg font-medium text-white shadow-sm transition-colors
                          disabled:opacity-60 flex items-center justify-center gap-2 ${theme.submit}`}
            >
              {isSubmitting ? (
                <><RefreshCw className="animate-spin" size={16} /> {theme.submittingLabel}</>
              ) : (
                <>{theme.submitIcon} {theme.submitLabel}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Chuyển ISO string → "YYYY-MM-DD" cho input[type=date] */
function toDateInputValue(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return isNaN(d) ? '' : d.toISOString().split('T')[0];
}

export default VoucherFormModal;
