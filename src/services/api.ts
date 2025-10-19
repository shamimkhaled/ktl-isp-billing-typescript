import axios from "axios";
import type { AxiosInstance, AxiosError } from "axios";
import type { ApiError } from "../types/api.types";

// Use proxy in development, direct URL in production
const API_BASE_URL = import.meta.env.DEV
  ? "/api/v1" // Use Vite proxy
  : import.meta.env.VITE_API_BASE_URL || 
    "https://ktl-isp-billing-app-qza33.ondigitalocean.app/api/v1";

// Log the API base URL for debugging
console.log('🔗 API Base URL configured as:', API_BASE_URL);
console.log('🔧 Development mode:', import.meta.env.DEV);

class ApiService {
  private api: AxiosInstance;
  private onTokenRefresh?: (tokens: any) => void;
  private onLogout?: () => void;

  constructor() {
    console.log('🔧 API Service initialized with baseURL:', API_BASE_URL);
    
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000, // 30 second timeout for all requests
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // Configure for development vs production
      withCredentials: false, // Don't send cookies
      // Optimize axios configuration
      maxContentLength: 10 * 1024 * 1024, // 10MB max content length
      maxBodyLength: 10 * 1024 * 1024, // 10MB max body length
    });

    this.setupInterceptors();
  }

  // Set callback for token refresh
  setTokenRefreshCallback(callback: (tokens: any) => void) {
    this.onTokenRefresh = callback;
  }

  // Set callback for logout
  setLogoutCallback(callback: () => void) {
    this.onLogout = callback;
  }

  private getCsrfToken(): string | null {
    // Try to get CSRF token from cookie
    const cookieName = "csrftoken";
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${cookieName}=`))
      ?.split("=")[1];

    if (cookieValue) {
      return cookieValue;
    }

    // Try to get CSRF token from meta tag
    const metaTag = document.querySelector(
      'meta[name="csrf-token"]'
    ) as HTMLMetaElement;
    if (metaTag && metaTag.content) {
      return metaTag.content;
    }

    return null;
  }

  private setupInterceptors() {
    // Request interceptor to add auth token, CSRF token, and optimize requests
    this.api.interceptors.request.use(
      (config) => {
        console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
        
        const token = localStorage.getItem("authToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Skip CSRF token for development to avoid CORS issues
        // CSRF tokens will be handled by the backend directly
        if (!import.meta.env.DEV) {
          const unsafeMethods = ["post", "put", "patch", "delete"];
          if (
            config.method &&
            unsafeMethods.includes(config.method.toLowerCase())
          ) {
            const csrfToken = this.getCsrfToken();
            if (csrfToken) {
              config.headers["X-CSRFToken"] = csrfToken;
            }
          }
        }

        // Optimize timeout for different request types
        if (config.url?.includes("/auth/")) {
          config.timeout = 10000; // 10 seconds for auth requests (API takes ~4s + buffer)
        } else if (config.method?.toLowerCase() === "get") {
          config.timeout = 15000; // 15 seconds for GET requests
        } else {
          config.timeout = 20000; // 20 seconds for POST/PUT/DELETE
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling, retry logic, and token refresh
    this.api.interceptors.response.use(
      (response) => {
        console.log('📥 API Response:', response.status, response.config?.url);
        return response;
      },
      async (error: AxiosError) => {
        console.error('❌ API Error:', {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          url: error.config?.url,
          data: error.response?.data
        });
        const originalRequest = error.config as any;

        // Initialize retry count
        if (!originalRequest._retryCount) {
          originalRequest._retryCount = 0;
        }

        // Retry logic for network errors and 5xx server errors (up to 2 retries)
        // Allow retries for auth requests if they fail due to network issues
        if (
          originalRequest._retryCount < 2 &&
          (!error.response ||
            (error.response.status >= 500 && error.response.status < 600) ||
            error.code === 'ECONNABORTED' || // Timeout
            error.code === 'NETWORK_ERROR' || // Network error
            !error.response.status)
        ) {
          originalRequest._retryCount += 1;

          // Special handling for auth timeout retries
          if (originalRequest.url?.includes("/auth/") && error.code === 'ECONNABORTED') {
            console.warn(`🔄 Auth request timed out, retrying (${originalRequest._retryCount}/2)...`);
            // Longer delay for auth retries due to slow backend
            const delay = originalRequest._retryCount === 1 ? 1000 : 2000;
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
            // Standard delay for other retries
            const delay = Math.pow(2, originalRequest._retryCount - 1) * 500;
            await new Promise((resolve) => setTimeout(resolve, delay));
          }

          return this.api(originalRequest);
        }

        // Token refresh logic for 401 errors
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest._isRefreshRequest
        ) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
              throw new Error("No refresh token available");
            }

            // Use a separate axios instance to avoid interceptors
            const refreshResponse = await axios.post(
              `${API_BASE_URL}/auth/refresh/`,
              {
                refresh_token: refreshToken,
              },
              {
                timeout: 10000, // 10 second timeout for refresh
                baseURL: import.meta.env.DEV
                  ? window.location.origin
                  : undefined, // Use proxy in dev
              }
            );

            const { tokens, expires_at } = refreshResponse.data;

            localStorage.setItem("authToken", tokens.access);
            localStorage.setItem("refreshToken", tokens.refresh);

            // Call refresh callback to update Redux state
            if (this.onTokenRefresh) {
              this.onTokenRefresh({ tokens, expires_at });
            }

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${tokens.access}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            // Refresh failed, call logout callback
            if (this.onLogout) {
              this.onLogout();
            } else {
              // Fallback: clear storage and redirect
              localStorage.removeItem("authToken");
              localStorage.removeItem("refreshToken");
              window.location.href = "/login";
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    console.error('🔥 Handling API Error:', error);
    
    // Handle network errors specifically
    if (error.code === 'ERR_NETWORK') {
      return {
        message: 'Network connection failed. Please check your internet connection.',
        status: 0,
        details: { code: error.code, network: true },
      };
    }
    
    // Handle CORS errors
    if (error.message.includes('CORS')) {
      return {
        message: 'Cross-origin request blocked. Please contact support.',
        status: 0,
        details: { cors: true },
      };
    }
    
    const message =
      (error.response?.data as any)?.message ||
      (error.response?.data as any)?.detail ||
      error.message ||
      "An unexpected error occurred";

    return {
      message,
      status: error.response?.status,
      details: error.response?.data as any,
    };
  }

  // Generic HTTP methods
  public async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.api.get(url, { params });
    return response.data;
  }

  public async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.post(url, data);
    return response.data;
  }

  public async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.put(url, data);
    return response.data;
  }

  public async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.patch(url, data);
    return response.data;
  }

  public async delete<T>(url: string): Promise<T> {
    const response = await this.api.delete(url);
    return response.data;
  }
}

export const apiService = new ApiService();
