import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, ShieldAlert, CheckCircle, Mail, Clock } from 'lucide-react';

const UserTableRow = ({ user, onToggleStatus }) => {
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

  const getRoleBadge = () => {
    if (user.roleId === 'instructor') {
      return <span className="inline-flex items-center px-2 py-1 rounded border border-blue-200 bg-blue-50 text-xs font-medium text-blue-700">Instructor</span>;
    }
    return <span className="inline-flex items-center px-2 py-1 rounded border border-gray-200 bg-gray-50 text-xs font-medium text-gray-600">Student</span>;
  };

  const getStatusBadge = () => {
    if (user.isActive) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-xs font-medium text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-red-200 bg-red-50 text-xs font-medium text-red-700">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
        Banned
      </span>
    );
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
          {user.image ? (
             <img 
               className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
               alt={`${user.firstName} ${user.lastName}`}
               src={user.image} 
             />
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium shrink-0 border border-indigo-200">
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </div>
          )}
         
          <div>
            <span className="font-medium text-gray-900 block truncate max-w-[200px]">{user.firstName} {user.lastName}</span>
            <span className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                <Mail size={12} />
                {user.email}
            </span>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        {getRoleBadge()}
      </td>
      <td className="py-4 px-6 text-gray-500 text-sm">
        <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-gray-400" />
            {new Date(user.createdAt).toLocaleDateString()}
        </div>
      </td>
      <td className="py-4 px-6">
        {getStatusBadge()}
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
            <div className="absolute right-full top-0 mr-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 overflow-hidden">
              <div className="py-1">
                {user.isActive ? (
                  <ActionItem 
                    icon={ShieldAlert} 
                    label="Ban User" 
                    colorClass="text-red-600" 
                    hoverClass="hover:bg-red-50"
                    onClick={() => onToggleStatus(user.id, false)} 
                  />
                ) : (
                  <ActionItem 
                    icon={CheckCircle} 
                    label="Unban User" 
                    colorClass="text-green-700" 
                    hoverClass="hover:bg-green-50"
                    onClick={() => onToggleStatus(user.id, true)} 
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default UserTableRow;
