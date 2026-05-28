import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFavoritesService, toggleFavoriteService } from '../../services/favoriteService';

export const fetchFavorites = createAsyncThunk('favorite/fetchFavorites', async (_, { rejectWithValue }) => {
  try { return (await getFavoritesService()).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi tải danh sách yêu thích' }); }
});

export const toggleFavorite = createAsyncThunk('favorite/toggleFavorite', async (courseId, { rejectWithValue }) => {
  try { return (await toggleFavoriteService(courseId)).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi chỉnh sửa danh sách yêu thích' }); }
});

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState: {
    items: [],
    favoriteIds: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchFavorites.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.favoriteIds = (action.payload.data || []).map(course => course.id);
      })
      .addCase(fetchFavorites.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
      // Toggle
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const courseId = action.meta.arg;
        const isFavorite = action.payload.isFavorite;

        if (isFavorite) {
          if (!state.favoriteIds.includes(courseId)) {
            state.favoriteIds.push(courseId);
          }
        } else {
          state.favoriteIds = state.favoriteIds.filter(id => id !== courseId);
          state.items = state.items.filter(item => item.id !== courseId);
        }
      });
  },
});

export default favoriteSlice.reducer;
