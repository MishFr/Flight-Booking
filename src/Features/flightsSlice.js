import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  flights: [],
  currentFlight: null,
  loading: false,
  error: null,
};

export const searchFlights = createAsyncThunk(
  'flights/searchFlights',
  async (searchParams, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/flights/search/?departure=${searchParams.from}&arrival=${searchParams.to}&date=${searchParams.departureDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch flights');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getFlightStatus = createAsyncThunk(
  'flights/getFlightStatus',
  async (flightNumber, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/flights/status/${flightNumber}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch flight status');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const flightsSlice = createSlice({
  name: 'flights',
  initialState,
  reducers: {
    setFlights: (state, action) => {
      state.flights = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchFlights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchFlights.fulfilled, (state, action) => {
        state.loading = false;
        state.flights = action.payload;
      })
      .addCase(searchFlights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getFlightStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFlightStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFlight = action.payload;
      })
      .addCase(getFlightStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFlights, setLoading, setError } = flightsSlice.actions;
export default flightsSlice.reducer;
