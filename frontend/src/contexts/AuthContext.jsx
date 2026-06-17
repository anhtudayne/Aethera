import { createContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { disconnectSocket, connectSocket } from '../socket';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.TOKEN));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        return null;
      }
    }
    return null;
  });
  const [loading] = useState(false);

  // Connect socket when user is logged in
  useEffect(() => {
    if (user) {
      connectSocket(user.id);
    }
  }, [user]);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    // Connect socket on login
    connectSocket(userData.id);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    // Disconnect socket on logout
    disconnectSocket();
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const newProfile = { ...prev, ...updatedData };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newProfile));
      return newProfile;
    });
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
