import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Send, Minimize2, MessageSquare, Search, Sparkles } from 'lucide-react';
import axiosClient from '../../../api/axiosClient';
import './AIAgentWidget.css';

const AIAgentWidget = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomepage = location.pathname === '/';

  const [isOpen, setIsOpen] = useState(isHomepage);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'agent',
      text: 'Xin chào! Tôi là Trợ lý học tập Aethera AI. Tôi có thể giúp gì cho bạn hôm nay?',
      type: 'chat',
      searchKeyword: null,
      time: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto control open/close state on navigation path change
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(location.pathname === '/');
    }, 50);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setLoading(true);

    // Append user message
    const userMsgId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        text: userText,
        time: new Date()
      }
    ]);

    try {
      const res = await axiosClient.post('/agent/chat', { message: userText });
      const reply = res?.data || {};

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'agent',
          text: reply.message || 'Xin lỗi, tôi không thể xử lý câu hỏi này lúc này.',
          type: reply.type || 'chat',
          searchKeyword: reply.searchKeyword || null,
          time: new Date()
        }
      ]);

      // Automatically redirect to courses page with search query
      if (reply.type === 'search' && reply.searchKeyword) {
        setTimeout(() => {
          navigate(`/courses?search=${encodeURIComponent(reply.searchKeyword)}`);
        }, 1500);
      }
    } catch (err) {
      console.error('AI Agent chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'agent',
          text: 'Xin lỗi, hệ thống đang bận phản hồi. Bạn vui lòng thử lại sau nhé!',
          type: 'chat',
          searchKeyword: null,
          time: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };



  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessage(false);
    }
  };

  return (
    <div className="ai-agent-widget-root">
      {isOpen ? (
        <div className="ai-agent-chatbox">
          {/* Chatbox Header */}
          <div className="chatbox-header">
            <div className="header-mascot-container">
              <img src="/mascot.png" alt="Mascot" className="header-mascot" />
            </div>
            
            <div className="header-title-container">
              <div className="header-badge-row">
                <span className="agent-badge">AI Assistant</span>
                <Sparkles size={12} className="sparkle-icon" />
              </div>
              <h4 className="header-title-text">Aethera Bot</h4>
            </div>

            <button onClick={toggleWidget} className="header-minimize-btn" title="Thu nhỏ">
              <Minimize2 size={16} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="chatbox-body">
            <div className="messages-scroller">
              {messages.map((msg) => (
                <div key={msg.id} className={`message-bubble-wrapper ${msg.sender === 'user' ? 'user-wrapper' : 'agent-wrapper'}`}>
                  {msg.sender === 'agent' && (
                    <div className="agent-avatar-mini">
                      <img src="/mascot.png" alt="Bot Avatar" />
                    </div>
                  )}
                  <div className="message-content-container">
                    <div className={`message-bubble ${msg.sender === 'user' ? 'user-bubble' : 'agent-bubble'}`}>
                      <p className="message-text">{msg.text}</p>
                    </div>

                    {/* Search Redirecting Banner */}
                    {msg.sender === 'agent' && msg.type === 'search' && msg.searchKeyword && (
                      <div className="search-confirmation-card">
                        <div className="search-card-header">
                          <Search size={14} className="search-card-icon" />
                          <span>Chuyển hướng tự động</span>
                        </div>
                        <div className="search-card-status" style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>
                          Đang tải kết quả tìm kiếm cho: <strong>"{msg.searchKeyword}"</strong>...
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {loading && (
                <div className="message-bubble-wrapper agent-wrapper">
                  <div className="agent-avatar-mini">
                    <img src="/mascot.png" alt="Bot Avatar" />
                  </div>
                  <div className="message-bubble agent-bubble loading-bubble">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="chatbox-footer">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi tôi về khóa học (ví dụ: Flutter)..."
              className="chatbox-input"
              disabled={loading}
            />
            <button type="submit" className="chatbox-send-btn" disabled={!input.trim() || loading}>
              <Send size={16} />
            </button>
          </form>
        </div>
      ) : (
        <button onClick={toggleWidget} className={`ai-agent-trigger-btn ${hasNewMessage ? 'new-notification' : ''}`}>
          <div className="trigger-icon-wrapper">
            <MessageSquare size={24} />
            <div className="trigger-pulse"></div>
          </div>
          <div className="trigger-mascot-badge">
            <img src="/mascot.png" alt="Owl" />
          </div>
        </button>
      )}
    </div>
  );
};

export default AIAgentWidget;
