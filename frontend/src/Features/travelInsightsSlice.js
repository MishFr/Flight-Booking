import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  recommendations: [],
  travelHistory: [],
  exclusiveDeals: [],
  loading: false,
  error: null,
};

export const fetchRecommendations = createAsyncThunk(
  'travelInsights/fetchRecommendations',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/recommendations/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTravelHistory = createAsyncThunk(
  'travelInsights/fetchTravelHistory',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/travel-history/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch travel history');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchExclusiveDeals = createAsyncThunk(
  'travelInsights/fetchExclusiveDeals',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/exclusive-deals/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch exclusive deals');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const travelInsightsSlice = createSlice({
  name: 'travelInsights',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTravelHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTravelHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.travelHistory = action.payload;
      })
      .addCase(fetchTravelHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchExclusiveDeals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExclusiveDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.exclusiveDeals = action.payload;
      })
      .addCase(fetchExclusiveDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default travelInsightsSlice.reducer;
