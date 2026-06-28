import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, CheckCircle, XCircle, AlertTriangle, ShieldAlert, History, Eye } from 'lucide-react';
import { formatPrice } from '../../../utils/helpers';
import CourseStatusBadge from './CourseStatusBadge';

const CourseTableRow = ({ course, onApprove, onRequestReason, onViewHistory, onPreview }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPriceDisplay = () => {
    if (!course.price || course.price == 0) return 'Miễn phí';
    return formatPrice(course.salePrice || course.price);
  };

  const ActionItem = ({ icon: Icon, label, onClick, colorClass, hoverClass }) => (
    <button
      onClick={() => {
        setIsDropdownOpen(false);
        onClick();
      }}
      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${colorClass} ${hoverClass}`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <tr className="group hover:bg-gray-50 transition-colors">
      <td className="py-4 px-6 relative before:absolute before:inset-y-0 before:left-0 before:w-[2px] before:bg-transparent group-hover:before:bg-indigo-500">
        <div className="flex items-center gap-4">
          <img 
            className="w-10 h-10 rounded-md object-cover border border-gray-200 shrink-0"
            alt={course.name}
            src={course.thumbnail || 'https://via.placeholder.com/150'} 
          />
          <div>
            <span className="font-medium text-gray-900 block line-clamp-2">{course.name}</span>
            <span className="text-xs text-gray-500 mt-0.5 block">ID: CRS-{course.id}</span>
          </div>
        </div>
      </td>
      <td className="py-4 px-6 text-gray-500">{course.instructor || 'Unknown'}</td>
      <td className="py-4 px-6">
        <span className="inline-flex items-center px-2 py-1 rounded border border-gray-200 bg-gray-50 text-xs text-gray-600">
          {course.category?.name || 'Uncategorized'}
        </span>
      </td>
      <td className="py-4 px-6 text-right font-mono text-sm text-gray-900">
        {getPriceDisplay()}
      </td>
      <td className="py-4 px-6">
        <CourseStatusBadge status={course.status} />
      </td>
      <td className="py-4 px-6 text-right sticky right-0 bg-white/90 backdrop-blur-md border-l border-gray-200 group-hover:bg-gray-50/90 transition-colors z-10">
        <div className="relative inline-block text-left" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
          >
            <MoreVertical size={20} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-full top-0 mr-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-50 overflow-hidden">
              <div className="py-1">
                <ActionItem 
                  icon={Eye} 
                  label="Preview Course" 
                  colorClass="text-indigo-600" 
                  hoverClass="hover:bg-indigo-50"
                  onClick={onPreview} 
                />
                
                <div className="h-px bg-gray-200 my-1"></div>

                {/* Approve is available unless already published */}
                {course.status !== 'published' && (
                  <ActionItem 
                    icon={CheckCircle} 
                    label="Approve" 
                    colorClass="text-green-700" 
                    hoverClass="hover:bg-green-50"
                    onClick={() => onApprove(course.id)} 
                  />
                )}
                
                {/* Reject is available unless already rejected */}
                {course.status !== 'rejected' && (
                  <ActionItem 
                    icon={XCircle} 
                    label="Reject" 
                    colorClass="text-red-600" 
                    hoverClass="hover:bg-red-50"
                    onClick={() => onRequestReason(course.id, course.name, 'rejected')} 
                  />
                )}

                {/* Suspend is available unless already suspended */}
                {course.status !== 'suspended' && (
                  <ActionItem 
                    icon={ShieldAlert} 
                    label="Suspend" 
                    colorClass="text-orange-600" 
                    hoverClass="hover:bg-orange-50"
                    onClick={() => onRequestReason(course.id, course.name, 'suspended')} 
                  />
                )}

                <div className="h-px bg-gray-200 my-1"></div>

                <ActionItem 
                  icon={History} 
                  label="Audit Log" 
                  colorClass="text-gray-700" 
                  hoverClass="hover:bg-gray-100"
                  onClick={() => onViewHistory(course.id, course.name)} 
                />
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default CourseTableRow;
