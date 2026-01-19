import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  offers: [],
  loading: false,
  error: null,
};

export const fetchSpecialOffers = createAsyncThunk(
  'specialOffers/fetchSpecialOffers',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/special-offers/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch special offers');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const specialOffersSlice = createSlice({
  name: 'specialOffers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecialOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpecialOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = action.payload;
      })
      .addCase(fetchSpecialOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default specialOffersSlice.reducer;
