// src/store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../services/auth.service';
import type { LoginCredentials, AuthResponse } from '../types/auth.types';
import type { User } from '../types/user.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Restore from localStorage
const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('authToken');

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
};

/**
 * Async login
 */
export const loginAsync = createAsyncThunk<AuthResponse, LoginCredentials>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);

      // Save tokens and user in localStorage
      localStorage.setItem('authToken', response.tokens.access);
      localStorage.setItem('refreshToken', response.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('rememberMe', response.remember_me ? 'true' : 'false');

      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Logout reducer clears Redux and localStorage
     */
    logout: (state) => {
      console.log('🔄 authSlice logout reducer called');
      
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.expiresAt = null;
      state.rememberMe = false;

      // Clear ALL auth-related localStorage items
      const authKeys = [
        'authToken',
        'refreshToken',
        'user',
        'userId',
        'rememberMe',
        'userProfile',
        'tokenExpiry',
        'sessionData'
      ];
      
      authKeys.forEach(key => {
        localStorage.removeItem(key);
        console.log(`🧹 Removed localStorage key: ${key}`);
      });
      
      console.log('✅ authSlice logout completed');
    },

    /**
     * Update tokens (for token refresh)
     */
    updateTokens: (state, action: PayloadAction<{ access: string; refresh: string }>) => {
      localStorage.setItem('authToken', action.payload.access);
      localStorage.setItem('refreshToken', action.payload.refresh);
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, updateTokens, clearError } = authSlice.actions;
export default authSlice.reducer;
