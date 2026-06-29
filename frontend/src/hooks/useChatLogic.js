import { useState, useEffect } from 'react';
import { getSavedSessions, saveSessions, clearSessions, generateId } from '../utils/chatStorage';

export const useChatLogic = (lessonId) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [credits, setCredits] = useState(() => {
    const saved = localStorage.getItem('aethera_ai_credits');
    return saved !== null ? parseInt(saved, 10) : 25;
  });

  // Mảng sessions bây giờ chứa các object: { id, timestamp, title, messages: [] }
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  // Load sessions từ localStorage khi vào bài
  useEffect(() => {
    if (lessonId) {
      const saved = getSavedSessions(lessonId);
      setSessions(saved);
      
      const fetchCredits = async () => {
        try {
          const token = localStorage.getItem('aethera_token');
          if (!token) return;
          const res = await fetch('/api/learning/chat/credits', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok && data.credits !== undefined) {
            setCredits(data.credits);
            localStorage.setItem('aethera_ai_credits', data.credits);
          }
        } catch (error) {
          console.error("Failed to fetch credits", error);
        }
      };
      fetchCredits();
    }
  }, [lessonId]);

  const loadSession = (session) => {
    setMessages(session.messages || []);
    setCurrentSessionId(session.id);
  };

  const clearAllHistory = () => {
    setSessions([]);
    setMessages([]);
    setCurrentSessionId(null);
    clearSessions(lessonId);
  };

  const deleteSession = (e, id) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    saveSessions(lessonId, updated);
    if (currentSessionId === id) {
      setMessages([]);
      setCurrentSessionId(null);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
  };

  const sendMessage = async (text) => {
    const userMessage = text.trim();
    if (!userMessage || isLoading) return;

    // Let backend handle 0 credits instead of blocking on frontend
    // to prevent outdated local states from blocking requests.

    // Append tin nhắn user
    const newMessages = [...messages, { role: 'user', text: userMessage }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const formattedHistory = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const token = localStorage.getItem('aethera_token');
      const res = await fetch('/api/learning/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          lessonId,
          message: userMessage,
          history: formattedHistory
        })
      });

      const data = await res.json();

      if (res.status === 429) {
        // Hết lượt hỏi do server từ chối
        setMessages([...newMessages, { role: 'assistant', text: data.message }]);
        setCredits(0);
        localStorage.setItem('aethera_ai_credits', 0);
        return;
      }

      let assistantReply = data.reply;
      if (!res.ok) {
        assistantReply = data.message || 'Sorry, I cannot answer right now.';
      }

      const updatedMessages = [...newMessages, { role: 'assistant', text: assistantReply }];
      setMessages(updatedMessages);

      if (data.remainingCredits !== undefined) {
        setCredits(data.remainingCredits);
        localStorage.setItem('aethera_ai_credits', data.remainingCredits);
      }

      // Xử lý cập nhật/tạo mới session
      let targetSessionId = currentSessionId;
      let updatedSessions = [...sessions];

      if (!targetSessionId) {
        // Bắt đầu một session mới
        targetSessionId = generateId();
        setCurrentSessionId(targetSessionId);

        const newSession = {
          id: targetSessionId,
          timestamp: new Date().getTime(),
          title: userMessage, // Dùng câu hỏi đầu làm tiêu đề
          messages: updatedMessages
        };
        updatedSessions = [newSession, ...sessions];
      } else {
        // Update session hiện tại
        const sessionIndex = updatedSessions.findIndex(s => s.id === targetSessionId);
        if (sessionIndex !== -1) {
          updatedSessions[sessionIndex].messages = updatedMessages;
        }
      }

      setSessions(updatedSessions);
      saveSessions(lessonId, updatedSessions);

    } catch (error) {
      console.error('Chat error:', error);
      setMessages([...newMessages, { role: 'assistant', text: 'Connection error occurred. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
};
