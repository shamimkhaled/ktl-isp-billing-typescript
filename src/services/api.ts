import axios from "axios";
import type { AxiosInstance, AxiosError } from "axios";
import type { ApiError } from "../types/api.types";

// Use proxy URL in development, full URL in production
const API_BASE_URL = import.meta.env.DEV
  ? "/api/v1" // Use proxy in development
  : import.meta.env.VITE_API_BASE_URL ||
    "https://ktl-isp-billing-app-qza33.ondigitalocean.app/api/v1";

class ApiService {
  private api: AxiosInstance;
  private onTokenRefresh?: (tokens: any) => void;
  private onLogout?: () => void;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000, // 30 second timeout for all requests
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
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
        const token = localStorage.getItem("authToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add CSRF token for unsafe methods
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

        // Optimize timeout for different request types
        if (config.url?.includes("/auth/")) {
          config.timeout = 15000; // 15 seconds for auth requests
        } else if (config.method?.toLowerCase() === "get") {
          config.timeout = 20000; // 20 seconds for GET requests
        } else {
          config.timeout = 30000; // 30 seconds for POST/PUT/DELETE
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling, retry logic, and token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Initialize retry count
        if (!originalRequest._retryCount) {
          originalRequest._retryCount = 0;
        }

        // Retry logic for network errors and 5xx server errors (up to 2 retries)
        if (
          originalRequest._retryCount < 2 &&
          (!error.response ||
            (error.response.status >= 500 && error.response.status < 600) ||
            !error.response.status)
        ) {
          originalRequest._retryCount += 1;

          // Exponential backoff: wait 1s, then 2s
          const delay = Math.pow(2, originalRequest._retryCount - 1) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));

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
