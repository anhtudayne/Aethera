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
    refreshCart: () => dispatch(fetchCartCount()),
    loadCart: () => dispatch(fetchCartItems()),
    addToCart: (courseId) => dispatch(addCourseToCart(courseId)),
    removeItem: (itemId) => dispatch(removeCartItem(itemId)),
    clearCart: () => dispatch(clearCart()),
  };
};

export default useCart;
