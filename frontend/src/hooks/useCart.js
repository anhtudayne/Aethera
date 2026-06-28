import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchCartCount, 
  fetchCartItems, 
  addCourseToCart, 
  removeCartItem, 
  clearCart 
} from '../store/slices/cartSlice';

const useCart = () => {
  const dispatch = useDispatch();
  const cartCount = useSelector((state) => state.cart.cartCount);
  const items = useSelector((state) => state.cart.items);
  const loading = useSelector((state) => state.cart.loading);
  const error = useSelector((state) => state.cart.error);

  return {
    cartCount,
    items,
    loading,
    error,
    refreshCart: useCallback(() => dispatch(fetchCartCount()), [dispatch]),
    loadCart: useCallback(() => dispatch(fetchCartItems()), [dispatch]),
    addToCart: useCallback((courseId) => dispatch(addCourseToCart(courseId)), [dispatch]),
    removeItem: useCallback((itemId) => dispatch(removeCartItem(itemId)), [dispatch]),
    clearCart: useCallback(() => dispatch(clearCart()), [dispatch]),
  };
};

export default useCart;
