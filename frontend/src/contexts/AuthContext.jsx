import { createContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { disconnectSocket, connectSocket } from '../socket';
import { learningApi } from '../api/learningApi';

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
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);

  // Fetch enrolled courses if logged in
  const fetchEnrolledCourses = async () => {
    if (!token) return;
    try {
      const res = await learningApi.getMyCourses();
      const courseList = res.data?.data || (Array.isArray(res.data) ? res.data : []);
      const ids = courseList.map(c => c.courseId || c.id || c.course?.id);
      setEnrolledCourseIds(ids.filter(Boolean));
    } catch (e) {
      console.error('Error fetching enrolled courses in AuthContext:', e);
    }
  };

  useEffect(() => {
    let active = true;
    if (token) {
      const load = async () => {
        try {
          const res = await learningApi.getMyCourses();
          if (active) {
            const courseList = res.data?.data || (Array.isArray(res.data) ? res.data : []);
            const ids = courseList.map(c => c.courseId || c.id || c.course?.id);
            setEnrolledCourseIds(ids.filter(Boolean));
          }
        } catch (e) {
          console.error('Error in AuthContext useEffect:', e);
        }
      };
      load();
    }
    return () => {
      active = false;
    };
  }, [token]);

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
    setEnrolledCourseIds([]);
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
    enrolledCourseIds,
    refreshEnrolledCourses: fetchEnrolledCourses,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
