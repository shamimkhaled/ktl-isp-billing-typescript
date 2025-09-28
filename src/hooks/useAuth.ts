import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { loginAsync, clearError } from '../store/authSlice';
import { authService } from '../services/auth.service';
import type { LoginCredentials } from '../types/auth.types';
import type { UserUpdate } from '../types/user.types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { 
    user, 
    isAuthenticated, 
    loading, 
    error 
  } = useAppSelector((state) => state.auth);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const result = await dispatch(loginAsync(credentials)).unwrap();
      navigate('/dashboard');
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error as string };
    }
  }, [dispatch, navigate]);

  const logout = useCallback(async (logoutAllDevices = false) => {
    try {
      // Get refresh token before clearing storage
      const refreshToken = localStorage.getItem('refreshToken');

      // Clear local storage immediately
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('rememberMe');

      // Dispatch logout to clear Redux state
      dispatch({ type: 'auth/logout' });

      // Call API logout in background (don't wait for it)
      if (refreshToken) {
        authService.logout(refreshToken, logoutAllDevices).catch((error: any) => {
          console.error('Logout API error:', error);
        });
      }

      // Navigate immediately
      navigate('/login');
      return { success: true };
    } catch (error: any) {
      // Even if something fails, redirect to login
      navigate('/login');
      return { success: false, error: error as string };
    }
  }, [dispatch, navigate]);

  const updateProfile = useCallback(async (profileData: Partial<UserUpdate>) => {
    try {
      const updatedUser = await authService.updateProfile(profileData);

      // Update the user in Redux state
      dispatch({
        type: 'auth/login/fulfilled',
        payload: {
          user: updatedUser,
          tokens: {
            access: localStorage.getItem('authToken') || '',
            refresh: localStorage.getItem('refreshToken') || '',
            token_type: 'Bearer'
          },
          remember_me: localStorage.getItem('rememberMe') === 'true',
          expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes from now
        }
      });

      return { success: true, data: updatedUser };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to update profile' };
    }
  }, [dispatch]);

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
  };
};