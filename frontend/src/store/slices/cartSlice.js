import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartApi } from '../../api/cartApi';

// Async Thunks
export const fetchCartCount = createAsyncThunk(
  'cart/fetchCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApi.getCount();
      const count = typeof response === 'number' 
        ? response 
        : (response?.count ?? response?.data?.count ?? 0);
      return count;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCartItems = createAsyncThunk(
  'cart/fetchItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApi.getCart();
      const cartItems = response?.data || response || [];
      return Array.isArray(cartItems) ? cartItems : [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addCourseToCart = createAsyncThunk(
  'cart/addCourse',
  async (courseId, { dispatch, rejectWithValue }) => {
    try {
      const response = await cartApi.addToCart(courseId);
      dispatch(fetchCartItems());
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async (itemId, { dispatch, rejectWithValue }) => {
    try {
      await cartApi.removeItem(itemId);
      dispatch(fetchCartItems());
      return itemId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartApi.clearCart();
      return [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  items: [],
  cartCount: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: (state) => {
      state.items = [];
      state.cartCount = 0;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart Count
      .addCase(fetchCartCount.fulfilled, (state, action) => {
        state.cartCount = action.payload;
      })
      
      // Fetch Cart Items
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.cartCount = action.payload.length;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      
      // Clear Cart
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.cartCount = 0;
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
