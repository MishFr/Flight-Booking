import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  successMessage: null,
  refreshToken: null,
};

// Load user from localStorage on app start
const loadUserFromStorage = () => {
  const token = localStorage.getItem('access_token');
  const user = localStorage.getItem('user');
  if (token && user) {
    try {
      return {
        user: JSON.parse(user),
        isAuthenticated: true,
      };
    } catch (e) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }
  return { user: null, isAuthenticated: false };
};

// Initialize state from localStorage
const savedAuth = loadUserFromStorage();
initialState.user = savedAuth.user;
initialState.isAuthenticated = savedAuth.isAuthenticated;
initialState.refreshToken = localStorage.getItem('refresh_token');

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register/', userData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
        error.response?.data?.username?.join(' ') || 
        error.response?.data?.email?.join(' ') || 
        error.response?.data?.password?.join(' ') ||
        'Registration failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login/', userData);
      const { access, refresh, user } = response.data;
      
      // Store tokens in localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { access, refresh, user };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Login failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      // Optionally, you can call a logout endpoint to invalidate the token
      if (refreshToken) {
        try {
          await api.post('/auth/logout/', { refresh: refreshToken });
        } catch (e) {
          // Ignore logout endpoint errors
        }
      }
      
      // Clear localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      return true;
    } catch (error) {
      // Still clear localStorage even if API call fails
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      return rejectWithValue('Logout failed');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }
      
      const response = await api.post('/auth/token/refresh/', {
        refresh: refreshToken,
      });
      
      const { access } = response.data;
      localStorage.setItem('access_token', access);
      
      return { access };
    } catch (error) {
      // If refresh fails, logout user
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      return rejectWithValue('Token refresh failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.refreshToken = null;
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'Registration successful! Please wait for admin approval.';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.refreshToken = action.payload.refresh;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.refreshToken = null;
      })
      .addCase(refreshToken.fulfilled, (state) => {
        // Token refreshed successfully, user remains authenticated
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.refreshToken = null;
      });
  },
});

export const { login, logout, updateProfile, clearError, clearSuccessMessage } = authSlice.actions;
export default authSlice.reducer;
