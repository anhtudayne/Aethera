import React, { useState } from 'react';
import { ChevronLeft, Ghost, Trash2, AlertTriangle } from 'lucide-react';

// Hàm phụ để format timestamp -> hh:mm
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

// Hàm phụ để gom nhóm các session theo ngày
const groupSessionsByDate = (sessions) => {
  const groups = {
    'Hôm nay': [],
    'Hôm qua': [],
    'Cũ hơn': []
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  sessions.forEach(session => {
    const sessionDate = new Date(session.timestamp);
    sessionDate.setHours(0, 0, 0, 0);

    if (sessionDate.getTime() === today.getTime()) {
      groups['Hôm nay'].push(session);
    } else if (sessionDate.getTime() === yesterday.getTime()) {
      groups['Hôm qua'].push(session);
    } else {
      groups['Cũ hơn'].push(session);
    }
  });

  return groups;
};

const HistoryPanel = ({ show, onClose, sessions, onClearAll, onLoadSession, onDeleteSession }) => {
  const groupedSessions = groupSessionsByDate(sessions);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [deletingSessionId, setDeletingSessionId] = useState(null);

  const handleClose = () => {
    setShowConfirmClear(false);
    setDeletingSessionId(null);
    onClose();
  };

  const handleClearConfirm = () => {
    onClearAll();
    setShowConfirmClear(false);
  };

  return (
    <div className={`history-slideover ${show ? 'open' : ''}`}>
      <div className="history-header">
        <button className="back-btn" onClick={handleClose}>
          <ChevronLeft size={20} />
        </button>
        <h4>Lịch sử trò chuyện</h4>
        {sessions.length > 0 && !showConfirmClear && (
          <button className="clear-all-btn" onClick={() => setShowConfirmClear(true)}>
            <Trash2 size={14} style={{ marginRight: '4px' }} /> Xóa tất cả
          </button>
        )}
      </div>
      
      <div className="history-body">
        {showConfirmClear && (
          <div className="confirm-clear-banner">
            <div className="confirm-clear-icon">
              <AlertTriangle size={24} color="#EF4444" />
            </div>
            <div className="confirm-clear-content">
              <p>Bạn có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện? Hành động này không thể hoàn tác.</p>
              <div className="confirm-clear-actions">
                <button className="confirm-btn cancel" onClick={() => setShowConfirmClear(false)}>Hủy</button>
                <button className="confirm-btn delete" onClick={handleClearConfirm}>Xóa vĩnh viễn</button>
              </div>
            </div>
          </div>
        )}

        {sessions.length === 0 ? (
          <div className="history-empty">
            <Ghost size={48} strokeWidth={1.5} />
            <p>Bạn chưa có cuộc trò chuyện nào.<br/>Hãy bắt đầu đặt câu hỏi để AI hỗ trợ bạn nhé!</p>
          </div>
        ) : (
          Object.keys(groupedSessions).map(group => (
            groupedSessions[group].length > 0 && (
              <div key={group} className="history-group">
                <div className="history-group-title">{group}</div>
                {groupedSessions[group].map(session => (
                  <div key={session.id} className={`history-card ${deletingSessionId === session.id ? 'confirming' : ''}`} onClick={() => { if(deletingSessionId !== session.id) onLoadSession(session); }}>
                    {deletingSessionId === session.id ? (
                      <div className="history-card-confirm">
                        <span style={{ color: '#EF4444', fontSize: '0.85rem', fontWeight: '500' }}>Xóa đoạn chat này?</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="confirm-btn cancel" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={(e) => { e.stopPropagation(); setDeletingSessionId(null); }}>Hủy</button>
                          <button className="confirm-btn delete" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={(e) => { e.stopPropagation(); onDeleteSession(e, session.id); setDeletingSessionId(null); }}>Xóa</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="history-card-header">
                          <span className="history-card-title">{session.title}</span>
                          <button className="history-card-delete" onClick={(e) => { e.stopPropagation(); setDeletingSessionId(session.id); }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="history-card-snippet">
                          {session.messages && session.messages.length > 1 && (
                            <span>AI: {session.messages[session.messages.length - 1].text.replace(/[#*`]/g, '').substring(0, 50)}...</span>
                          )}
                        </div>
                        <div className="history-card-time">
                          {formatTime(session.timestamp)}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
