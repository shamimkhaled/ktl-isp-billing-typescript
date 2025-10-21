// src/store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../services/auth.service';
import type { LoginCredentials, LoginResponse } from '../types/auth.types';
import type { User } from '../types/user.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Centralized localStorage management
const authStorageKeys = {
  TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  REMEMBER_ME: 'rememberMe'
} as const;

const authStorage = {
  save: (tokens: { access: string; refresh: string }, user: User, rememberMe: boolean) => {
    localStorage.setItem(authStorageKeys.TOKEN, tokens.access);
    localStorage.setItem(authStorageKeys.REFRESH_TOKEN, tokens.refresh);
    localStorage.setItem(authStorageKeys.USER, JSON.stringify(user));
    localStorage.setItem(authStorageKeys.REMEMBER_ME, rememberMe ? 'true' : 'false');
  },
  
  updateTokens: (tokens: { access: string; refresh: string }) => {
    localStorage.setItem(authStorageKeys.TOKEN, tokens.access);
    localStorage.setItem(authStorageKeys.REFRESH_TOKEN, tokens.refresh);
  },
  
  clear: () => {
    Object.values(authStorageKeys).forEach(key => {
      localStorage.removeItem(key);
      console.log(`🧹 Removed localStorage key: ${key}`);
    });
  },
  
  getUser: (): User | null => {
    const storedUser = localStorage.getItem(authStorageKeys.USER);
    return storedUser ? JSON.parse(storedUser) : null;
  },
  
  getToken: (): string | null => {
    return localStorage.getItem(authStorageKeys.TOKEN);
  }
};

// Restore from localStorage (optimize for faster initialization)
const getInitialAuthState = (): AuthState => {
  try {
    const token = authStorage.getToken();
    const user = authStorage.getUser();
    
    return {
      user,
      isAuthenticated: !!token && !!user, // Both token and user must exist
      loading: false,
      error: null,
    };
  } catch (error) {
    console.warn('Failed to restore auth state from localStorage:', error);
    return {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    };
  }
};

const initialState: AuthState = getInitialAuthState();

/**
 * Async login
 */
export const loginAsync = createAsyncThunk<LoginResponse, LoginCredentials>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    console.time('⚡ loginAsync total');
    console.time('🌐 authService.login');

    try {
      const response = await authService.login(credentials);

      console.timeEnd('🌐 authService.login');

      // Save to localStorage using centralized function
      console.time('💾 save to localStorage');
      authStorage.save(response.tokens, response.user, response.remember_me);
      console.timeEnd('💾 save to localStorage');

      console.timeEnd('⚡ loginAsync total');
      return response;

    } catch (error: any) {
      console.timeEnd('🌐 authService.login');
      console.timeEnd('⚡ loginAsync total');

      console.error('❌ Login error:', error);
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
      
      // Reset state to initial values
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      // Clear localStorage using centralized function
      authStorage.clear();
      
      console.log('✅ authSlice logout completed');
    },

    /**
     * Update tokens (for token refresh)
     */
    updateTokens: (_state, action: PayloadAction<{ access: string; refresh: string }>) => {
      authStorage.updateTokens(action.payload);
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
      .addCase(loginAsync.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
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
