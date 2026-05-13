import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeaturedService, getNewArrivalsService, getBestSellersService, getCategoriesService } from '../../services/courseService';

export const fetchFeatured = createAsyncThunk('course/fetchFeatured', async (_, { rejectWithValue }) => {
  try { return (await getFeaturedService()).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi tải khóa học nổi bật' }); }
});

export const fetchNewArrivals = createAsyncThunk('course/fetchNewArrivals', async (_, { rejectWithValue }) => {
  try { return (await getNewArrivalsService()).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi tải khóa học mới' }); }
});

export const fetchBestSellers = createAsyncThunk('course/fetchBestSellers', async (_, { rejectWithValue }) => {
  try { return (await getBestSellersService()).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi tải khóa học bán chạy' }); }
});

export const fetchCategories = createAsyncThunk('course/fetchCategories', async (_, { rejectWithValue }) => {
  try { return (await getCategoriesService()).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi tải danh mục' }); }
});

const courseSlice = createSlice({
  name: 'course',
  initialState: {
    featuredCourses: [],
    newArrivals: [],
    bestSellers: [],
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeatured.pending, (state) => { state.loading = true; })
      .addCase(fetchFeatured.fulfilled, (state, action) => { state.loading = false; state.featuredCourses = action.payload.data; })
      .addCase(fetchFeatured.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => { state.newArrivals = action.payload.data; })
      .addCase(fetchBestSellers.fulfilled, (state, action) => { state.bestSellers = action.payload.data; })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload.data; });
  },
});

export const { clearError } = courseSlice.actions;
export default courseSlice.reducer;
