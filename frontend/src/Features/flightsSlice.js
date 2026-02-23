import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  flights: [],
  airports: [],
  currentFlight: null,
  loading: false,
  error: null,
};

export const searchFlights = createAsyncThunk(
  'flights/searchFlights',
  async (searchParams, { rejectWithValue }) => {
    console.log('searchFlights thunk called with params:', searchParams);
    try {
      const token = localStorage.getItem('access_token');
      // Verify token existence, format, and expiration
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }
      if (typeof token !== 'string' || token.trim() === '') {
        throw new Error('Invalid token format.');
      }
      // Decode JWT to check expiration (assuming JWT format)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < currentTime) {
          throw new Error('Token has expired. Please log in again.');
        }
      } catch (e) {
        throw new Error('Invalid token.');
      }
      console.log('Token before fetch:', token); // Log token for debugging
      const queryParams = new URLSearchParams({
        departure: searchParams.from,
        arrival: searchParams.to,
        date: searchParams.departureDate,
        fromCountry: searchParams.fromCountry || '',
        toCountry: searchParams.toCountry || '',
        returnDate: searchParams.returnDate || '',
        class: searchParams.class || 'economy',
        passengers: searchParams.passengers || 1,
        nonStop: searchParams.nonStop ? 'true' : 'false',
        tripType: searchParams.tripType || 'roundtrip'
      });
      console.log('API URL:', `http://localhost:8000/api/flights/search/?${queryParams}`);
      const response = await fetch(`http://localhost:8000/api/flights/search/?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Fetch response status:', response.status);
      if (!response.ok) {
        console.error('Fetch failed with status:', response.status, response.statusText);
        let errorMessage = 'Failed to fetch flights';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // ignore
        }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      console.log('API response data:', data);
      return data;
    } catch (error) {
      console.error('Error in searchFlights thunk:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const getFlightStatus = createAsyncThunk(
  'flights/getFlightStatus',
  async (flightNumber, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      // Verify token existence, format, and expiration
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }
      if (typeof token !== 'string' || token.trim() === '') {
        throw new Error('Invalid token format.');
      }
      // Decode JWT to check expiration (assuming JWT format)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < currentTime) {
          throw new Error('Token has expired. Please log in again.');
        }
      } catch (e) {
        throw new Error('Invalid token.');
      }
      console.log('Token before fetch:', token); // Log token for debugging
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

export const searchAirports = createAsyncThunk(
  'flights/searchAirports',
  async (keyword, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      // Verify token existence, format, and expiration
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }
      if (typeof token !== 'string' || token.trim() === '') {
        throw new Error('Invalid token format.');
      }
      // Decode JWT to check expiration (assuming JWT format)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < currentTime) {
          throw new Error('Token has expired. Please log in again.');
        }
      } catch (e) {
        throw new Error('Invalid token.');
      }
      console.log('Token before airport search fetch:', token); // Log token for debugging
      const response = await fetch(`http://localhost:8000/api/airports/search/?keyword=${keyword}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Airport search response status:', response.status);
      if (!response.ok) {
        console.error('Airport search failed with status:', response.status, response.statusText);
        let errorMessage = 'Failed to fetch airport suggestions';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // ignore
        }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in searchAirports thunk:', error);
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
    setAirports: (state, action) => {
      state.airports = action.payload;
    },
    clearAirports: (state) => {
      state.airports = [];
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
        console.log('searchFlights.pending: Setting loading to true');
        state.loading = true;
        state.error = null;
      })
      .addCase(searchFlights.fulfilled, (state, action) => {
        console.log('searchFlights.fulfilled: Updating flights state with:', action.payload);
        state.loading = false;
        state.flights = action.payload;
        console.log('Updated state.flights:', state.flights);
      })
      .addCase(searchFlights.rejected, (state, action) => {
        console.log('searchFlights.rejected: Setting error:', action.payload);
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
      })
      .addCase(searchAirports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchAirports.fulfilled, (state, action) => {
        state.loading = false;
        state.airports = action.payload;
      })
      .addCase(searchAirports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFlights, setAirports, clearAirports, setLoading, setError } = flightsSlice.actions;
export default flightsSlice.reducer;
