import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Battery, History, Menu, Sparkles, X, Info, MessageCircle, Lightbulb, Zap, MessageSquare, Plus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './VideoChatbox.css';
import { useChatLogic } from '../../hooks/useChatLogic';
import HistoryPanel from './HistoryPanel';
import PolicyPanel from './PolicyPanel';

const SUGGESTIONS = [
  { label: "📝 Tóm tắt bài học", prompt: "Tóm tắt nội dung video bài học vừa xem." },
  { label: "💡 Giải thích khái niệm", prompt: "Giải thích các khái niệm quan trọng trong bài giảng." },
  { label: "❓ Tạo Quiz ôn tập", prompt: "Tạo các bài kiểm tra ngắn (quiz)." }
];

const VideoChatbox = ({ lessonId, onToggle }) => {
  const {
    messages,
    input,
    setInput,
    isLoading,
    credits,
    sessions,
    currentSessionId,
    sendMessage,
    loadSession,
    clearAllHistory,
    deleteSession,
    startNewChat
  } = useChatLogic(lessonId);

  const [showMenu, setShowMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (val) => {
    setIsOpen(val);
    if (onToggle) onToggle(val);
  };
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Nếu đã đóng Chatbox -> Hiện bong bóng nhỏ nổi ở góc màn hình
  if (!isOpen) {
    return (
      <button className="chatbox-toggle-btn" onClick={() => handleToggle(true)} title="Mở lại Teacher Bee AI">
        <Bot size={28} />
      </button>
    );
  }

  return (
    <div className="video-chatbox">
      {/* HEADER */}
      <div className="chatbox-header">
        <div className="header-title">
          <Bot size={18} />
          <h4>Teacher Bee AI</h4>
        </div>
        <div className="header-actions">
          {messages.length > 0 && (
            <button 
              className="action-btn" 
              onClick={startNewChat}
              title="Cuộc trò chuyện mới"
            >
              <Plus size={16} />
            </button>
          )}
          <button 
            className="action-btn" 
            onClick={() => setShowHistory(true)}
            title="Lịch sử trò chuyện"
          >
            <History size={16} />
          </button>
          <div className={`credits-badge ${credits <= 5 ? 'low' : ''}`} title="Số lượt hỏi còn lại">
            {credits} <Battery size={14} />
          </div>
          <button 
            className="action-btn" 
            onClick={() => handleToggle(false)}
            title="Thu gọn"
            style={{ marginLeft: '4px' }}
          >
            <X size={18} />
          </button>
        </div>
      </div>
      
      {/* SLIDEOVERS */}
      <HistoryPanel 
        show={showHistory} 
        onClose={() => setShowHistory(false)} 
        sessions={sessions} 
        onLoadSession={(session) => {
          loadSession(session);
          setShowHistory(false);
        }}
        onClearAll={clearAllHistory}
        onDeleteSession={deleteSession}
      />

      <PolicyPanel 
        show={showPolicy} 
        onClose={() => setShowPolicy(false)} 
      />

      {/* BODY */}
      <div className="chatbox-messages">
        {messages.length === 0 ? (
          <div className="welcome-card">
            <div className="welcome-icon">
              <Sparkles size={28} />
            </div>
            <h3 className="policy-title">Xin chào, mình là Teacher Bee AI!</h3>
            <p className="policy-desc">Mình sẽ đồng hành cùng bạn trong suốt quá trình học tập. Mình có thể giúp bạn:</p>
            
            <div className="features-list">
              <div className="feature-item">
                <Lightbulb className="feature-icon" size={16} color="#FBBF24" />
                <span>Tóm lược nội dung bài học, giải thích trực quan.</span>
              </div>
              <div className="feature-item">
                <Zap className="feature-icon" size={16} color="#34D399" />
                <span>Hướng dẫn làm bài, gợi ý đáp án và các dạng bài tập để cải thiện đúng các điểm yếu trong bài của bạn.</span>
              </div>
              <div className="feature-item">
                <MessageCircle className="feature-icon" size={16} color="#60A5FA" />
                <span>Hỏi đáp 1-1 (Giới hạn 25 lượt/giờ).</span>
              </div>
            </div>

            <p className="welcome-hint">Hãy chọn một lệnh bên dưới hoặc nhập câu hỏi của bạn!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message-flat ${msg.role}`}>
              <div className="message-icon">
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className="message-content">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="message-flat assistant">
            <div className="message-icon">
              <Bot size={14} />
            </div>
            <div className="message-content typing-indicator">
              <Loader2 className="spinner" size={16} /> Teacher Bee AI đang suy nghĩ...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* FOOTER */}
      <div className="chatbox-footer">
        {showMenu && (
          <div className="action-menu-scrollable">
            <button className="suggestion-pill" onClick={() => { setShowPolicy(true); setShowMenu(false); }}>
              ℹ️ Giới thiệu & Tính năng
            </button>
            {SUGGESTIONS.map((sug, i) => (
              <button key={i} className="suggestion-pill" onClick={() => { sendMessage(sug.prompt); setShowMenu(false); }}>
                {sug.label}
              </button>
            ))}
          </div>
        )}

        <div className="chatbox-input">
          <button 
            className={`tool-btn ${showMenu ? 'active' : ''}`} 
            onClick={() => setShowMenu(!showMenu)}
            title="Menu lệnh nhanh"
          >
            <Menu size={18} strokeWidth={2.5} />
          </button>

          <input 
            type="text" 
            placeholder="Nhập câu hỏi về bài học..." 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            disabled={isLoading}
          />
          <button className="send-btn" onClick={() => sendMessage(input)} disabled={!input.trim() || isLoading}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoChatbox;
