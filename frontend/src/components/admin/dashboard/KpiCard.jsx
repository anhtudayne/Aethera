import React from 'react';
import { TrendingUp, ArrowRight } from 'lucide-react';

const KpiCard = ({ title, value, icon: Icon, colorClass, bgClass, trendText, isPositive }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col relative overflow-hidden group">
            {/* Watermark Icon - very low opacity */}
            <div className="absolute top-1/2 -translate-y-1/2 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                {Icon && <Icon size={120} className={colorClass} />}
            </div>
            
            <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</span>
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${bgClass}`}>
                    {Icon && <Icon size={20} className={colorClass} />}
                </div>
            </div>
            
            <div className="mt-auto relative z-10 flex flex-col items-center justify-center gap-1 w-full pt-4 pb-2 text-center">
                <div className="text-3xl font-bold text-gray-900">{value}</div>
                {(value === '$0' || value === '0' || value === '0 pt') ? (
                    <div className="text-sm font-medium text-gray-400">--</div>
                ) : trendText && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {isPositive ? <TrendingUp size={16} /> : <ArrowRight size={16} />}
                        {trendText}
                    </div>
                )}
            </div>
        </div>
    );
};

export default KpiCard;
