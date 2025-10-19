import { apiService } from './api';
import type { LoginCredentials, LoginResponse, RefreshTokenResponse, VerifyTokenResponse, LogoutResponse } from '../types/auth.types';
import type { UserUpdate, User } from '../types/user.types';
import type { ApiResponse } from '../types/api.types';
import { authPerf } from '../utils/performance';


export class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return authPerf.measureLogin(async () => {
      try {
        console.log('🔑 Starting login request...');
        const startTime = performance.now();
        
        const apiResponse = await apiService.post<ApiResponse<LoginResponse>>('/auth/login/', credentials);
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        if (duration > 3000) {
          console.warn(`🐌 Slow login API detected: ${duration.toFixed(0)}ms. Consider backend optimization.`);
        }
        
        console.log('Raw login API response:', apiResponse); // Debug logging

        // Check if the API response indicates failure
        if (!apiResponse.success) {
          throw new Error(apiResponse.message || 'Login failed');
        }

        const response = apiResponse.data;

        // Validate that we have the required tokens
        if (!response.tokens || !response.tokens.access || !response.tokens.refresh) {
          console.error('Invalid login response - missing tokens:', response);
          throw new Error('Login response missing required tokens');
        }

        return response;
      } catch (error: any) {
        console.error('Login error:', error);
        throw error;
      }
    });
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    return authPerf.measureTokenRefresh(async () => {
      const apiResponse = await apiService.post<ApiResponse<RefreshTokenResponse>>('/auth/refresh/', {
        refresh_token: refreshToken,
      });
      return apiResponse.data;
    });
  }
  


  async logout(refreshToken?: string, logoutAllDevices = false): Promise<LogoutResponse> {
    return authPerf.measureLogout(async () => {
      const apiResponse = await apiService.post<ApiResponse<LogoutResponse>>('/auth/logout/', {
        refresh_token: refreshToken,
        logout_all_devices: logoutAllDevices,
      });
      return apiResponse.data;
    });
  }

  async verifyToken(): Promise<VerifyTokenResponse> {
    const apiResponse = await apiService.post<ApiResponse<VerifyTokenResponse>>('/auth/verify/');
    return apiResponse.data;
  }

  async getProfile(): Promise<User> {
    const response = await apiService.get<{ user: User }>('/users/profile/');
    return response.user;
  }

  async updateProfile(profileData: Partial<UserUpdate>): Promise<User> {
    const response = await apiService.put<{ user: User }>('/users/profile/', profileData);
    return response.user;
  }
}

export const authService = new AuthService();
