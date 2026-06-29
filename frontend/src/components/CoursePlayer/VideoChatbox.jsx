import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Battery, History, Menu, Sparkles, X, Info, MessageCircle, Lightbulb, Zap, MessageSquare, Plus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './VideoChatbox.css';
import { useChatLogic } from '../../hooks/useChatLogic';
import HistoryPanel from './HistoryPanel';
import PolicyPanel from './PolicyPanel';

const SUGGESTIONS = [
  { label: "📝 Lesson Summary", prompt: "Summarize content of the video lesson just watched." },
  { label: "💡 Explain Concepts", prompt: "Explain the important concepts in the lecture." },
  { label: "❓ Create Review Quiz", prompt: "Create quizzes (short)." }
];

const VideoChatbox = ({ lessonId }) => {
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
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Render directly since the Chatbox is now integrated into a sidebar tab

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
              title="New conversation"
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
          <div className={`credits-badge ${credits <= 5 ? 'low' : ''}`} title="Remaining questions">
            {credits} <Battery size={14} />
          </div>
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
            <p className="policy-desc">I will accompany you throughout your learning process. I can help you with:</p>
            
            <div className="features-list">
              <div className="feature-item">
                <Lightbulb className="feature-icon" size={16} color="#FBBF24" />
                <span>Summarizing lesson content, visual explanations.</span>
              </div>
              <div className="feature-item">
                <Zap className="feature-icon" size={16} color="#34D399" />
                <span>Guiding you through exercises, suggesting answers and exercises to improve your weak points.</span>
              </div>
              <div className="feature-item">
                <MessageCircle className="feature-icon" size={16} color="#60A5FA" />
                <span>1-1 Q&A (Limit 25 questions/hour).</span>
              </div>
            </div>

            <p className="welcome-hint">Please select a command below or enter your question!</p>
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
              ℹ️ Introduction & Features
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
            placeholder="Enter a question about the lesson..." 
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
