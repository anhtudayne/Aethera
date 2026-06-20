import React from 'react';

const STATUS_CONFIG = {
  pending: {
    bg: 'bg-[#fbbf24]/10',
    text: 'text-[#fbbf24]',
    border: 'border-[#fbbf24]/20',
    dot: 'bg-[#fbbf24]',
    label: 'Pending'
  },
  published: {
    bg: 'bg-[#4ade80]/10',
    text: 'text-[#4ade80]',
    border: 'border-[#4ade80]/20',
    dot: 'bg-[#4ade80]',
    label: 'Approved'
  },
  rejected: {
    bg: 'bg-red-500/10',
    text: 'text-red-500',
    border: 'border-red-500/20',
    dot: 'bg-red-500',
    label: 'Rejected'
  },
  draft: {
    bg: 'bg-gray-500/10',
    text: 'text-gray-400',
    border: 'border-gray-500/20',
    dot: 'bg-gray-400',
    label: 'Draft'
  },
  suspended: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-500',
    border: 'border-orange-500/20',
    dot: 'bg-orange-500',
    label: 'Suspended'
  }
};

const CourseStatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.dot}`}></span>
      {config.label}
    </span>
  );
};

export default CourseStatusBadge;
