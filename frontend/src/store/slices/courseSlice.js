import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeaturedService, getNewArrivalsService, getBestSellersService, getCategoriesService, getCoursesByCategoryService, getTopViewedCoursesService } from '../../services/courseService';

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

export const fetchTopViewed = createAsyncThunk('course/fetchTopViewed', async (_, { rejectWithValue }) => {
  try { return (await getTopViewedCoursesService()).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi tải khóa học xem nhiều' }); }
});

// BT05: Khóa học theo danh mục (Infinite Scroll)
export const fetchCategoryCourses = createAsyncThunk('course/fetchCategoryCourses', async ({ slug, page = 1, limit = 6 }, { rejectWithValue }) => {
  try {
    const res = await getCoursesByCategoryService(slug, page, limit);
    return { ...res.data, requestedPage: page };
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Lỗi tải khóa học theo danh mục' });
  }
});

const courseSlice = createSlice({
  name: 'course',
  initialState: {
    featuredCourses: [],
    newArrivals: [],
    bestSellers: [],
    topViewed: [],
    categories: [],
    // BT05: Category page state
    categoryCourses: [],
    categoryInfo: null,
    categoryPagination: { page: 0, totalPages: 0, total: 0 },
    categoryLoading: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearError(state) { state.error = null; },
    clearCategoryCourses(state) {
      state.categoryCourses = [];
      state.categoryInfo = null;
      state.categoryPagination = { page: 0, totalPages: 0, total: 0 };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeatured.pending, (state) => { state.loading = true; })
      .addCase(fetchFeatured.fulfilled, (state, action) => { state.loading = false; state.featuredCourses = action.payload.data; })
      .addCase(fetchFeatured.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => { state.newArrivals = action.payload.data; })
      .addCase(fetchBestSellers.fulfilled, (state, action) => { state.bestSellers = action.payload.data; })
      .addCase(fetchTopViewed.fulfilled, (state, action) => { state.topViewed = action.payload.data; })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload.data; })
      // BT05: Category courses (append mode for infinite scroll)
      .addCase(fetchCategoryCourses.pending, (state) => { state.categoryLoading = true; })
      .addCase(fetchCategoryCourses.fulfilled, (state, action) => {
        state.categoryLoading = false;
        const { data, category, pagination, requestedPage } = action.payload;
        state.categoryInfo = category;
        state.categoryPagination = pagination;
        // Page 1 = replace, page > 1 = append
        state.categoryCourses = requestedPage === 1 ? data : [...state.categoryCourses, ...data];
      })
      .addCase(fetchCategoryCourses.rejected, (state, action) => {
        state.categoryLoading = false;
        state.error = action.payload?.message;
      });
  },
});

export const { clearError, clearCategoryCourses } = courseSlice.actions;
export default courseSlice.reducer;
