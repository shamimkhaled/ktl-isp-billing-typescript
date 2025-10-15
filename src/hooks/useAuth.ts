// src/hooks/useAuth.ts
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { loginAsync, clearError, logout as logoutAction, updateTokens } from '../store/authSlice';
import { authService } from '../services/auth.service';
import { clearAuthStorage } from '../utils/auth.utils';
import type { LoginCredentials } from '../types/auth.types';
import type { UserUpdate } from '../types/user.types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const result = await dispatch(loginAsync(credentials)).unwrap();
        navigate('/dashboard', { replace: true });
        return { success: true, data: result };
      } catch (error: any) {
        return { success: false, error: error as string };
      }
    },
    [dispatch, navigate]
  );

  const logout = useCallback(
    async (logoutAllDevices = false) => {
      console.log('🔥 LOGOUT FUNCTION CALLED - useAuth.ts');
      
      try {
        // 1. Clear localStorage FIRST using utility function
        clearAuthStorage();

        // 2. Dispatch logout action to clear Redux state
        dispatch(logoutAction());
        console.log('✅ Redux logout action dispatched');

        // 3. Optional API logout call (in background)
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          authService.logout(refreshToken, logoutAllDevices).catch((err) => {
            console.error('Logout API error:', err);
          });
        }

        // 4. Navigate to login page
        navigate('/login', { replace: true });
        console.log('✅ Navigation to /login initiated');
        
        return { success: true };
      } catch (error: any) {
        console.error('❌ Logout error in useAuth:', error);
        
        // Fallback: force clear everything
        localStorage.clear();
        dispatch(logoutAction());
        navigate('/login', { replace: true });
        
        return { success: false, error: error as string };
      }
    },
    [dispatch, navigate]
  );

  const updateProfile = useCallback(
    async (profileData: Partial<UserUpdate>) => {
      try {
        const updatedUser = await authService.updateProfile(profileData);

        dispatch({
          type: 'auth/login/fulfilled',
          payload: {
            user: updatedUser,
            tokens: {
              access: localStorage.getItem('authToken') || '',
              refresh: localStorage.getItem('refreshToken') || '',
              token_type: 'Bearer',
            },
            remember_me: localStorage.getItem('rememberMe') === 'true',
            expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          },
        });

        return { success: true, data: updatedUser };
      } catch (error: any) {
        return { success: false, error: error.message || 'Failed to update profile' };
      }
    },
    [dispatch]
  );

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    updateProfile,
    clearError: clearAuthError,
    updateTokens: (tokens: { access: string; refresh: string }) => dispatch(updateTokens(tokens)),
  };
};

