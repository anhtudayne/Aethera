import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Battery, History, Menu, Sparkles, X, Info, MessageCircle, Lightbulb, Zap, MessageSquare, Plus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './VideoChatbox.css';
import { useChatLogic } from '../../hooks/useChatLogic';
import HistoryPanel from './HistoryPanel';
import PolicyPanel from './PolicyPanel';

const SUGGESTIONS = [
  { label: "📝 Lesson summary", prompt: "Summary of video lesson content just watched." },
  { label: "💡 Explain the concept", prompt: "Explain important concepts in the lecture." },
  { label: "❓ Create a review Quiz", prompt: "Create short tests (quiz)." }
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
      <button className="chatbox-toggle-btn" onClick={() => handleToggle(true)} title="Reopen Teacher Bee AI">
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
              title="New chat"
            >
              <Plus size={16} />
            </button>
          )}
          <button 
            className="action-btn" 
            onClick={() => setShowHistory(true)}
            title="Chat history"
          >
            <History size={16} />
          </button>
          <div className={`credits-badge ${credits <= 5 ? 'low' : ''}`} title="Number of remaining questions">
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
            <h3 className="policy-title">Hello, I'm Teacher Bee AI!</h3>
            <p className="policy-desc">I will accompany you throughout the learning process. I can help you:</p>
            
            <div className="features-list">
              <div className="feature-item">
                <Lightbulb className="feature-icon" size={16} color="#FBBF24" />
                <span>Summary of lesson content, visual explanation.</span>
              </div>
              <div className="feature-item">
                <Zap className="feature-icon" size={16} color="#34D399" />
                <span>Instructions for doing the test, suggested answers and types of exercises to properly improve the weak points in your test.</span>
              </div>
              <div className="feature-item">
                <MessageCircle className="feature-icon" size={16} color="#60A5FA" />
                <span>Q&A 1-1 (Limited 25 times/hour).</span>
              </div>
            </div>

            <p className="welcome-hint">Choose a command below or enter your question!</p>
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
              <Loader2 className="spinner" size={16} /> Teacher Bee AI is thinking...
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
            title="Quick command menu"
          >
            <Menu size={18} strokeWidth={2.5} />
          </button>

          <input 
            type="text" 
            placeholder="Enter questions about the lesson..." 
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
