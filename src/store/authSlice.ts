import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/auth.service';
import type { AuthState, LoginCredentials } from '../types/auth.types';

const getInitialAuthState = (): AuthState => {
  const token = localStorage.getItem('authToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const rememberMe = localStorage.getItem('rememberMe') === 'true';

  return {
    user: null,
    token,
    refreshToken,
    isAuthenticated: !!token,
    loading: false,
    error: null,
    expiresAt: null,
    rememberMe,
  };
};

const initialState: AuthState = getInitialAuthState();

// Async thunks
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);

      // Validate response structure
      if (!response.tokens?.access || !response.tokens?.refresh) {
        console.error('Invalid login response structure:', response);
        return rejectWithValue('Invalid login response: missing tokens');
      }

      // Store tokens
      localStorage.setItem('authToken', response.tokens.access);
      localStorage.setItem('refreshToken', response.tokens.refresh);

      if (credentials.remember_me) {
        localStorage.setItem('rememberMe', 'true');
      }

      return response;
    } catch (error: any) {
      console.error('Login failed:', error);
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const refreshTokenAsync = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      const refreshToken = auth.refreshToken || localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authService.refreshToken(refreshToken);

      // Update tokens
      localStorage.setItem('authToken', response.tokens.access);
      localStorage.setItem('refreshToken', response.tokens.refresh);

      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Token refresh failed');
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (logoutAllDevices: boolean = false, { getState }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      const refreshToken = auth.refreshToken || localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        await authService.logout(refreshToken, logoutAllDevices);
      }
    } catch (error: any) {
      // Even if logout fails, we still want to clear local storage
      console.error('Logout error:', error);
    } finally {
      // Always clean up local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('rememberMe');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateTokens: (state, action) => {
      state.token = action.payload.tokens.access;
      state.refreshToken = action.payload.tokens.refresh;
      state.expiresAt = action.payload.expires_at;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.expiresAt = null;
      state.rememberMe = false;
      state.error = null;
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('rememberMe');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.tokens.access;
        state.refreshToken = action.payload.tokens.refresh;
        state.isAuthenticated = true;
        state.expiresAt = action.payload.expires_at;
        state.rememberMe = action.payload.remember_me;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      
      // Refresh token
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        state.token = action.payload.tokens.access;
        state.refreshToken = action.payload.tokens.refresh;
        state.expiresAt = action.payload.expires_at;
      })
      .addCase(refreshTokenAsync.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.expiresAt = null;
        state.rememberMe = false;
      })
      
      // Logout
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.expiresAt = null;
        state.rememberMe = false;
        state.error = null;
      });
  },
});

export const { clearError, logout, updateTokens } = authSlice.actions;
export default authSlice.reducer;
