import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getCartService, getCartCountService, addToCartService,
  removeCartItemService, clearCartService,
} from '../../services/cartService';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try { return (await getCartService()).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi tải giỏ hàng' }); }
});

export const fetchCartCount = createAsyncThunk('cart/fetchCartCount', async (_, { rejectWithValue }) => {
  try { return (await getCartCountService()).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi đếm giỏ hàng' }); }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (courseId, { rejectWithValue }) => {
  try { return (await addToCartService(courseId)).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi thêm vào giỏ hàng' }); }
});

export const removeCartItem = createAsyncThunk('cart/removeCartItem', async (id, { rejectWithValue }) => {
  try { return (await removeCartItemService(id)).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi xóa khóa học' }); }
});

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
  try { return (await clearCartService()).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi xóa giỏ hàng' }); }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    count: 0,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearCartMessage(state) { state.message = null; },
    clearCartError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCart.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.count = state.items.length;
      })
      .addCase(fetchCart.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
      // Count
      .addCase(fetchCartCount.fulfilled, (state, action) => { state.count = action.payload.data?.count || 0; })
      // Add
      .addCase(addToCart.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.count += 1;
      })
      .addCase(addToCart.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
      // Remove
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.count = Math.max(0, state.count - 1);
      })
      .addCase(removeCartItem.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
      // Clear
      .addCase(clearCart.fulfilled, (state) => { state.items = []; state.count = 0; state.loading = false; })
      .addCase(clearCart.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; });
  },
});

export const { clearCartMessage, clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
