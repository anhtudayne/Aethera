import { createContext, useState, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import useAuth from '../hooks/useAuth';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const { isAuthenticated } = useAuth();

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      Promise.resolve().then(() => setCartCount(0));
      return;
    }
    try {
      const response = await axiosClient.get('/cart/count');
      const count = typeof response === 'number' ? response : (response?.count ?? response?.data?.count ?? 0);
      setCartCount(count);
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
    }
  }, [isAuthenticated]);

  // Load cart count when authentication status changes
  useEffect(() => {
    const timer = setTimeout(() => {
      refreshCart();
    }, 0);
    return () => clearTimeout(timer);
  }, [isAuthenticated, refreshCart]);

  const value = {
    cartCount,
    setCartCount,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
