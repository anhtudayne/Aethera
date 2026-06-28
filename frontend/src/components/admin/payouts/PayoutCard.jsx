import React from 'react';
import { User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const PayoutCard = ({ payout, onAction, isProcessing, activeTab }) => {
  const { amount, bankName, accountNumber, instructor, adminNote } = payout;

  // Mask account number: show last 4 digits
  const maskedAccount = accountNumber ? `•••• ${accountNumber.slice(-4)}` : '••••';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all group gap-4">
      <div className="flex items-center gap-4 min-w-0">
        {instructor?.image ? (
          <img 
            className="w-12 h-12 rounded-full border border-gray-200 object-cover shrink-0"
            src={instructor.image} 
            alt={`${instructor.firstName} ${instructor.lastName}`}
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 shrink-0">
            <User size={24} />
          </div>
        )}
        
        <div className="min-w-0">
          <p className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
            {instructor?.firstName} {instructor?.lastName}
          </p>
          <p className="text-sm font-mono text-gray-500 mt-0.5 uppercase truncate">
            {bankName} {maskedAccount}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 justify-between sm:justify-end border-t border-gray-100 sm:border-0 pt-4 sm:pt-0 mt-2 sm:mt-0 shrink-0">
        <div className="text-left sm:text-right shrink-0">
          <p className="font-mono text-lg text-emerald-600 font-bold">
            {Number(amount).toLocaleString('en-VN')} d
          </p>
          <p className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
            Net Payout
          </p>
        </div>
        
        {activeTab === 'PENDING' && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onAction(payout, 'reject')}
              disabled={isProcessing}
              className="flex items-center justify-center p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 shrink-0"
              title="Reject Payout"
            >
              <XCircle size={20} />
            </button>
            <button
              onClick={() => onAction(payout, 'complete')}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 font-medium text-sm hover:bg-indigo-100 transition-colors disabled:opacity-50 shrink-0 whitespace-nowrap"
            >
              {isProcessing ? (
                 <span className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></span>
              ) : (
                <CheckCircle size={16} />
              )}
              Mark as Paid
            </button>
          </div>
        )}

        {activeTab === 'REJECTED' && adminNote && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg text-sm max-w-xs shrink-0">
            <AlertCircle size={16} className="shrink-0" />
            <p className="truncate" title={adminNote}>{adminNote}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayoutCard;
