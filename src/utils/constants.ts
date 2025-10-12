export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'KTL ISP Management System',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  debug: import.meta.env.VITE_DEBUG === 'true',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

export const USER_TYPES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login/',
    LOGOUT: '/auth/logout/',
    REFRESH: '/auth/refresh/',
    PROFILE: '/auth/profile/',
  },
  USERS: {
    LIST: '/users/',
    CREATE: '/users/',
    DETAIL: (id: string) => `/users/${id}/`,
    UPDATE: (id: string) => `/users/${id}/`,
    DELETE: (id: string) => `/users/${id}/`,
  },
  DASHBOARD: {
    METRICS: '/dashboard/metrics/',
    STATS: '/dashboard/stats/',
  },
} as const;

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  REMEMBER_ME: 'rememberMe',
  USER_PREFERENCES: 'userPreferences',
} as const;

export const QUERY_KEYS = {
  AUTH: ['auth'],
  USERS: ['users'],
  DASHBOARD: ['dashboard'],
  USER_DETAIL: (id: string) => ['users', id],
} as const;
