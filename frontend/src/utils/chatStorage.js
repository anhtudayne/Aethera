export const getSessionsKey = (lessonId) => `aethera_chat_sessions_${lessonId}`;

export const getSavedSessions = (lessonId) => {
  try {
    const data = localStorage.getItem(getSessionsKey(lessonId));
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error reading chat sessions from localStorage", err);
    return [];
  }
};

export const saveSessions = (lessonId, sessions) => {
  try {
    localStorage.setItem(getSessionsKey(lessonId), JSON.stringify(sessions));
  } catch (err) {
    console.error("Error saving chat sessions to localStorage", err);
  }
};

export const clearSessions = (lessonId) => {
  try {
    localStorage.removeItem(getSessionsKey(lessonId));
  } catch (err) {
    console.error("Error clearing chat sessions", err);
  }
};

export const generateId = () => Math.random().toString(36).substring(2, 9);
