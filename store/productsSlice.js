import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { products as mock } from '../data/product';

export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  // тут можна підключити реальний бекенд. Поки — мок
  return mock;
});

const slice = createSlice({
  name: 'products',
  initialState: { list: [], status: 'idle' },
  reducers: {},
  extraReducers: b => {
    b.addCase(fetchProducts.pending, s => { s.status = 'loading'; })
     .addCase(fetchProducts.fulfilled, (s, { payload }) => { s.status = 'succeeded'; s.list = payload; })
     .addCase(fetchProducts.rejected, s => { s.status = 'failed'; });
  }
});

export const selectProducts = s => s.products.list;
export default slice.reducer;
