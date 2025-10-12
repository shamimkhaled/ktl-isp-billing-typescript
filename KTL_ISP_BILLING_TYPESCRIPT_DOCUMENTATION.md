# KTL ISP Billing Frontend (TypeScript) - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [TypeScript Configuration](#typescript-configuration)
5. [Type Definitions](#type-definitions)
6. [Features Overview](#features-overview)
7. [Architecture & Workflow](#architecture--workflow)
8. [Authentication System](#authentication-system)
9. [State Management](#state-management)
10. [API Integration](#api-integration)
11. [Component Patterns](#component-patterns)
12. [Pages & Routes](#pages--routes)
13. [Setup & Installation](#setup--installation)
14. [Development Guidelines](#development-guidelines)

---

## Project Overview

**KTL ISP Billing Frontend (TypeScript Edition)** is a modern, type-safe web application built with React, TypeScript, and Vite for managing Internet Service Provider (ISP) operations.

### Why TypeScript?

- **Type Safety**: Catch errors at compile time, not runtime
- **Better IDE Support**: Enhanced autocomplete and IntelliSense
- **Self-Documenting**: Types serve as inline documentation
- **Refactoring Confidence**: Safely refactor with type checking
- **Team Collaboration**: Clearer contracts between components

### Key Capabilities:

- 🔐 Type-safe authentication with JWT tokens
- 📊 Real-time dashboard with strongly-typed data
- 👥 Customer and user management with type checking
- 💰 Billing and payment processing with type safety
- 🗺️ Zone and SDT terminal management
- 📡 Network monitoring with typed interfaces
- 📈 Comprehensive reporting system
- 🎨 Modern UI with Tailwind CSS and type-safe component props

---

## Technology Stack

### Core Technologies

```typescript
{
  "frontend": "React 18+ with TypeScript 5+",
  "buildTool": "Vite 5+",
  "language": "TypeScript",
  "stateManagement": "Redux Toolkit with TypeScript",
  "dataFetching": "React Query with TypeScript",
  "routing": "React Router v6 with type-safe routes",
  "styling": "Tailwind CSS",
  "forms": "React Hook Form with TypeScript",
  "validation": "Zod / Yup (schema validation)",
  "http": "Axios with TypeScript interceptors"
}
```

### TypeScript-Specific Features

- **Strict Mode**: Enabled for maximum type safety
- **Path Aliases**: Import organization with `@/` prefix
- **Generic Types**: Reusable type-safe components
- **Type Guards**: Runtime type checking
- **Utility Types**: Built-in TypeScript utilities
- **Discriminated Unions**: Type-safe state machines

### Dependencies (Typical)

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@reduxjs/toolkit": "^2.0.0",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.6.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "date-fns": "^3.0.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.300.0",
    "react-hot-toast": "^2.4.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

---

## Project Structure

```
ktl-isp-billing-typescript/
├── public/                          # Static assets
│   ├── favicon.ico
│   └── assets/
│
├── src/
│   ├── @types/                      # Global type definitions
│   │   ├── api.types.ts            # API response types
│   │   ├── auth.types.ts           # Authentication types
│   │   ├── user.types.ts           # User-related types
│   │   ├── customer.types.ts       # Customer types
│   │   ├── billing.types.ts        # Billing types
│   │   └── index.ts                # Export all types
│   │
│   ├── components/                  # React components
│   │   ├── common/                 # Shared components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── dashboard/              # Dashboard components
│   │   │   ├── MetricsCard.tsx
│   │   │   ├── ChartWidget.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── forms/                  # Form components
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── layout/                 # Layout components
│   │       ├── MainLayout.tsx
│   │       ├── AuthLayout.tsx
│   │       └── index.ts
│   │
│   ├── pages/                       # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Users/
│   │   │   ├── UserList.tsx
│   │   │   ├── UserCreate.tsx
│   │   │   ├── UserEdit.tsx
│   │   │   └── index.ts
│   │   ├── Customers/
│   │   ├── Billing/
│   │   ├── Network/
│   │   ├── Reports/
│   │   ├── Settings/
│   │   └── index.ts
│   │
│   ├── store/                       # Redux store
│   │   ├── index.ts                # Store configuration
│   │   ├── hooks.ts                # Typed hooks (useAppDispatch, useAppSelector)
│   │   │
│   │   ├── slices/                 # Redux slices
│   │   │   ├── authSlice.ts
│   │   │   ├── themeSlice.ts
│   │   │   ├── usersSlice.ts
│   │   │   ├── rolesSlice.ts
│   │   │   └── index.ts
│   │   │
│   │   └── types.ts                # Redux state types
│   │
│   ├── services/                    # API services
│   │   ├── api.ts                  # Axios instance
│   │   ├── auth.service.ts         # Auth API calls
│   │   ├── users.service.ts        # Users API
│   │   ├── customers.service.ts    # Customers API
│   │   ├── billing.service.ts      # Billing API
│   │   └── index.ts
│   │
│   ├── hooks/                       # Custom hooks
│   │   ├── useAuth.ts              # Authentication hook
│   │   ├── useDebounce.ts          # Debounce hook
│   │   ├── useLocalStorage.ts      # Local storage hook
│   │   ├── usePermissions.ts       # Permissions hook
│   │   └── index.ts
│   │
│   ├── routes/                      # Route configuration
│   │   ├── index.tsx               # Route definitions
│   │   ├── ProtectedRoute.tsx      # Route guard
│   │   └── routes.types.ts         # Route types
│   │
│   ├── utils/                       # Utility functions
│   │   ├── formatters.ts           # Format helpers
│   │   ├── validators.ts           # Validation functions
│   │   ├── constants.ts            # App constants
│   │   ├── storage.ts              # Storage utilities
│   │   └── index.ts
│   │
│   ├── lib/                         # External lib configurations
│   │   ├── queryClient.ts          # React Query setup
│   │   └── axios.ts                # Axios configuration
│   │
│   ├── schemas/                     # Validation schemas (Zod/Yup)
│   │   ├── auth.schema.ts
│   │   ├── user.schema.ts
│   │   ├── customer.schema.ts
│   │   └── index.ts
│   │
│   ├── App.tsx                      # Main app component
│   ├── main.tsx                     # Entry point
│   ├── vite-env.d.ts               # Vite types
│   └── index.css                    # Global styles
│
├── .env                             # Environment variables
├── .env.example                     # Example env file
├── .eslintrc.cjs                    # ESLint config
├── .prettierrc                      # Prettier config
├── tsconfig.json                    # TypeScript config
├── tsconfig.node.json               # Node TypeScript config
├── vite.config.ts                   # Vite configuration
├── tailwind.config.ts               # Tailwind config
├── postcss.config.js                # PostCSS config
├── package.json                     # Dependencies
└── README.md                        # Project README
```

---

## TypeScript Configuration

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path Aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/store/*": ["./src/store/*"],
      "@/services/*": ["./src/services/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/types/*": ["./src/@types/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/@types'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

---

## Type Definitions

### Core Types Structure

#### `src/@types/api.types.ts`

```typescript
// Generic API Response
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

// Paginated Response
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// API Error
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  details?: Record<string, string[]>;
}

// Generic API Request Config
export interface ApiRequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  timeout?: number;
}
```

#### `src/@types/auth.types.ts`

```typescript
export interface User {
  id: string;
  login_id: string;
  email: string;
  name: string;
  user_type: UserType;
  employee_id?: string;
  designation?: string;
  phone?: string;
  avatar?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type UserType = 'admin' | 'manager' | 'staff' | 'user';

export interface LoginCredentials {
  login_id: string;
  password: string;
  remember_me?: boolean;
}

export interface LoginResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
  expires_at: string;
  remember_me: boolean;
}

export interface TokenPayload {
  user_id: string;
  user_type: UserType;
  exp: number;
  iat: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  expiresAt: string | null;
  rememberMe: boolean;
}
```

#### `src/@types/user.types.ts`

```typescript
export interface UserFormData {
  login_id: string;
  email: string;
  name: string;
  password?: string;
  user_type: UserType;
  employee_id?: string;
  designation?: string;
  phone?: string;
  is_active?: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  name: string;
  codename: string;
  content_type: string;
  description?: string;
}

export interface UserRole {
  id: string;
  user: User;
  role: Role;
  assigned_at: string;
  assigned_by: User;
}
```

#### `src/@types/customer.types.ts`

```typescript
export interface Customer {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  zone: Zone;
  sdt_terminal?: SDTTerminal;
  connection_type: ConnectionType;
  package: Package;
  status: CustomerStatus;
  balance: number;
  created_at: string;
  updated_at: string;
}

export type ConnectionType = 'pppoe' | 'static_ip' | 'dhcp';
export type CustomerStatus = 'active' | 'suspended' | 'disconnected';

export interface Zone {
  id: string;
  name: string;
  code: string;
  description?: string;
  location: string;
  total_customers: number;
  active_connections: number;
}

export interface SDTTerminal {
  id: string;
  terminal_id: string;
  name: string;
  zone: Zone;
  ip_address: string;
  status: 'online' | 'offline' | 'maintenance';
  total_ports: number;
  used_ports: number;
  health: number;
}

export interface Package {
  id: string;
  name: string;
  bandwidth_upload: number;
  bandwidth_download: number;
  price: number;
  billing_cycle: 'monthly' | 'quarterly' | 'yearly';
  description?: string;
}
```

#### `src/@types/billing.types.ts`

```typescript
export interface Invoice {
  id: string;
  invoice_number: string;
  customer: Customer;
  issue_date: string;
  due_date: string;
  amount: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  items: InvoiceItem[];
  payments: Payment[];
  created_at: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Payment {
  id: string;
  payment_number: string;
  invoice: Invoice;
  customer: Customer;
  amount: number;
  payment_method: PaymentMethod;
  payment_date: string;
  transaction_id?: string;
  status: PaymentStatus;
  notes?: string;
  created_at: string;
}

export type PaymentMethod = 'cash' | 'bank_transfer' | 'online' | 'mobile_banking';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
```

---

## Features Overview

### 1. **Type-Safe Dashboard**

```typescript
interface DashboardMetrics {
  activeConnections: number;
  onlineUsers: number;
  monthlyRevenue: number;
  alerts: number;
  growth: {
    connections: number;
    users: number;
    revenue: number;
  };
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}
```

**Features:**
- Real-time metrics with type checking
- Type-safe chart data
- Strongly-typed dashboard state
- Generic chart components

### 2. **Type-Safe Authentication**

```typescript
// Type-safe login hook
function useAuth() {
  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Implementation
  };
  
  const logout = async (logoutAllDevices?: boolean): Promise<void> => {
    // Implementation
  };
  
  return { login, logout, user, isAuthenticated };
}
```

**Features:**
- Strongly-typed JWT tokens
- Type-safe login/logout
- Protected routes with type guards
- Token refresh with type safety

### 3. **Type-Safe User Management**

```typescript
// Type-safe user operations
interface UserService {
  getUsers(params?: UserQueryParams): Promise<PaginatedResponse<User>>;
  getUserById(id: string): Promise<User>;
  createUser(data: UserFormData): Promise<User>;
  updateUser(id: string, data: Partial<UserFormData>): Promise<User>;
  deleteUser(id: string): Promise<void>;
}
```

**Features:**
- CRUD operations with type safety
- Role-based access control (typed)
- Type-safe form validation
- Strongly-typed permissions

---

## Architecture & Workflow

### Application Architecture

```
┌─────────────────────────────────────────────────────┐
│                React + TypeScript                    │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │         App.tsx (Type-safe Router)             │ │
│  │         - Type-safe route definitions          │ │
│  │         - Protected routes with guards          │ │
│  └────────────┬───────────────────────────────────┘ │
│               │                                      │
│  ┌────────────▼───────────────────────────────────┐ │
│  │        Pages (Strongly Typed)                  │ │
│  │        - Dashboard.tsx                         │ │
│  │        - Users/*.tsx                           │ │
│  │        - Billing/*.tsx                         │ │
│  └────────────┬───────────────────────────────────┘ │
└───────────────┼──────────────────────────────────────┘
                │
      ┌─────────┴─────────┐
      │                   │
┌─────▼──────┐    ┌───────▼────────┐
│  Redux     │    │  React Query   │
│  Toolkit   │    │  (Typed)       │
│  (Typed)   │    │                │
└─────┬──────┘    └───────┬────────┘
      │                   │
      └─────────┬─────────┘
                │
      ┌─────────▼─────────┐
      │  Axios (Typed)    │
      │  - Type-safe      │
      │    interceptors   │
      │  - Generic types  │
      └─────────┬─────────┘
                │
      ┌─────────▼─────────┐
      │  Backend API      │
      │  (Django REST)    │
      └───────────────────┘
```

### Type Flow

```typescript
// 1. Define types
interface LoginCredentials { ... }
interface LoginResponse { ... }

// 2. Create typed service
const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> => {
    return api.post<ApiResponse<LoginResponse>>('/auth/login/', credentials);
  }
};

// 3. Use in typed Redux thunk
export const loginAsync = createAsyncThunk<
  LoginResponse,  // Return type
  LoginCredentials,  // Argument type
  { rejectValue: ApiError }  // Error type
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.login(credentials);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error as ApiError);
  }
});

// 4. Use in component with typed hooks
const Component: React.FC = () => {
  const dispatch = useAppDispatch();  // Typed dispatch
  const { user, loading } = useAppSelector(state => state.auth);  // Typed selector
  
  const handleLogin = async (data: LoginCredentials) => {
    await dispatch(loginAsync(data));
  };
};
```

---

## Authentication System

### Type-Safe Auth Hook

```typescript
// src/hooks/useAuth.ts
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginAsync, logoutAsync, refreshTokenAsync } from '@/store/slices/authSlice';
import type { LoginCredentials, User } from '@/types/auth.types';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: (logoutAllDevices?: boolean) => Promise<void>;
  refreshToken: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error } = useAppSelector(state => state.auth);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    await dispatch(loginAsync(credentials)).unwrap();
  };

  const logout = async (logoutAllDevices = false): Promise<void> => {
    await dispatch(logoutAsync(logoutAllDevices)).unwrap();
  };

  const refreshToken = async (): Promise<void> => {
    await dispatch(refreshTokenAsync()).unwrap();
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    refreshToken,
  };
};
```

### Type-Safe Auth Service

```typescript
// src/services/auth.service.ts
import api from './api';
import type { 
  LoginCredentials, 
  LoginResponse, 
  ApiResponse 
} from '@/types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post<ApiResponse<LoginResponse>>(
      '/auth/login/',
      credentials
    );
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<{ access: string }>> => {
    const response = await api.post<ApiResponse<{ access: string }>>(
      '/auth/refresh/',
      { refresh_token: refreshToken }
    );
    return response.data;
  },

  logout: async (
    refreshToken: string,
    logoutAllDevices: boolean
  ): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>('/auth/logout/', {
      refresh_token: refreshToken,
      logout_all_devices: logoutAllDevices,
    });
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>('/auth/profile/');
    return response.data;
  },
};
```

### Type-Safe Auth Slice

```typescript
// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '@/services';
import type { AuthState, LoginCredentials, LoginResponse, User } from '@/types';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('authToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('authToken'),
  loading: false,
  error: null,
  expiresAt: null,
  rememberMe: localStorage.getItem('rememberMe') === 'true',
};

// Typed async thunks
export const loginAsync = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.login(credentials);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Login failed');
  }
});

export const logoutAsync = createAsyncThunk<
  void,
  boolean,
  { rejectValue: string }
>('auth/logout', async (logoutAllDevices, { getState, rejectWithValue }) => {
  try {
    const state = getState() as { auth: AuthState };
    const refreshToken = state.auth.refreshToken;
    if (refreshToken) {
      await authService.logout(refreshToken, logoutAllDevices);
    }
  } catch (error: any) {
    return rejectWithValue(error.message || 'Logout failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
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
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.tokens.access;
        state.refreshToken = action.payload.tokens.refresh;
        state.expiresAt = action.payload.expires_at;
        state.rememberMe = action.payload.remember_me;
        
        // Store in localStorage
        localStorage.setItem('authToken', action.payload.tokens.access);
        localStorage.setItem('refreshToken', action.payload.tokens.refresh);
        if (action.payload.remember_me) {
          localStorage.setItem('rememberMe', 'true');
        }
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
        state.isAuthenticated = false;
      })
      
      // Logout
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.expiresAt = null;
        state.rememberMe = false;
        
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('rememberMe');
      });
  },
});

export const { clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
```

### Type-Safe Protected Route

```typescript
// src/routes/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredPermission?: string;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  redirectTo = '/login',
}) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check permission if required
  if (requiredPermission && user) {
    const hasPermission = checkUserPermission(user, requiredPermission);
    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

// Type guard for permission checking
function checkUserPermission(user: User, permission: string): boolean {
  // Implementation depends on your permission structure
  return true;
}
```

---

## State Management

### Typed Redux Store

```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import usersReducer from './slices/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Infer types from store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Typed Redux Hooks

```typescript
// src/store/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### Example: Typed Users Slice

```typescript
// src/store/slices/usersSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { usersService } from '@/services';
import type { User, PaginatedResponse, UserFormData } from '@/types';

interface UsersState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
  };
}

const initialState: UsersState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  pagination: {
    count: 0,
    next: null,
    previous: null,
  },
};

// Typed async thunks
export const fetchUsersAsync = createAsyncThunk<
  PaginatedResponse<User>,
  { page?: number; search?: string } | undefined,
  { rejectValue: string }
>('users/fetchUsers', async (params, { rejectWithValue }) => {
  try {
    const response = await usersService.getUsers(params);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const createUserAsync = createAsyncThunk<
  User,
  UserFormData,
  { rejectValue: string }
>('users/createUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await usersService.createUser(userData);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.results;
        state.pagination = {
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        };
      })
      .addCase(fetchUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch users';
      })
      
      // Create user
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.users.unshift(action.payload);
        state.pagination.count += 1;
      });
  },
});

export const { clearError, setCurrentUser } = usersSlice.actions;
export default usersSlice.reducer;
```

---

## API Integration

### Type-Safe Axios Instance

```typescript
// src/services/api.ts
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import type { ApiError, ApiResponse } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Create typed axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor with types
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor with types
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post<ApiResponse<{ access: string }>>(
            `${API_BASE_URL}/auth/refresh/`,
            { refresh: refreshToken }
          );

          const { access } = response.data.data;
          localStorage.setItem('authToken', access);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    if (error.response?.status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
```

### Type-Safe API Endpoints

```typescript
// src/services/endpoints.ts
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login/',
    REGISTER: '/auth/register/',
    REFRESH: '/auth/refresh/',
    LOGOUT: '/auth/logout/',
    PROFILE: '/auth/profile/',
  },
  
  DASHBOARD: {
    METRICS: '/dashboard/metrics/',
    STATS: '/dashboard/stats/',
    OVERVIEW: '/dashboard/overview/',
  },
  
  USERS: {
    LIST: '/users/',
    CREATE: '/users/',
    DETAIL: (id: string) => `/users/${id}/`,
    UPDATE: (id: string) => `/users/${id}/`,
    DELETE: (id: string) => `/users/${id}/`,
    PERMISSIONS: '/users/permissions/',
  },
  
  CUSTOMERS: {
    LIST: '/customers/',
    CREATE: '/customers/',
    DETAIL: (id: string) => `/customers/${id}/`,
    UPDATE: (id: string) => `/customers/${id}/`,
    DELETE: (id: string) => `/customers/${id}/`,
  },
  
  BILLING: {
    INVOICES: '/billing/invoices/',
    PAYMENTS: '/billing/payments/',
    GENERATE_INVOICE: '/billing/generate-invoice/',
  },
} as const;
```

### Type-Safe Service Layer

```typescript
// src/services/users.service.ts
import api from './api';
import { ENDPOINTS } from './endpoints';
import type { 
  User, 
  UserFormData, 
  PaginatedResponse, 
  ApiResponse 
} from '@/types';

interface UserQueryParams {
  page?: number;
  search?: string;
  user_type?: string;
  is_active?: boolean;
}

export const usersService = {
  getUsers: async (
    params?: UserQueryParams
  ): Promise<ApiResponse<PaginatedResponse<User>>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<User>>>(
      ENDPOINTS.USERS.LIST,
      { params }
    );
    return response.data;
  },

  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>(
      ENDPOINTS.USERS.DETAIL(id)
    );
    return response.data;
  },

  createUser: async (userData: UserFormData): Promise<ApiResponse<User>> => {
    const response = await api.post<ApiResponse<User>>(
      ENDPOINTS.USERS.CREATE,
      userData
    );
    return response.data;
  },

  updateUser: async (
    id: string,
    userData: Partial<UserFormData>
  ): Promise<ApiResponse<User>> => {
    const response = await api.put<ApiResponse<User>>(
      ENDPOINTS.USERS.UPDATE(id),
      userData
    );
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(ENDPOINTS.USERS.DELETE(id));
  },
};
```

---

## Component Patterns

### Generic Type-Safe Components

#### Type-Safe Button Component

```typescript
// src/components/common/Button.tsx
import React, { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { LoadingSpinner } from './LoadingSpinner';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200';
  
  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg',
    secondary: 'bg-white/10 text-white hover:bg-white/20 border border-white/20',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-lg',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg',
  };
  
  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <LoadingSpinner size="sm" />
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};
```

#### Type-Safe Table Component

```typescript
// src/components/common/Table.tsx
import React from 'react';
import { clsx } from 'clsx';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function Table<T extends { id: string | number }>({
  data,
  columns,
  onRowClick,
  loading,
  emptyMessage = 'No data available',
  className,
}: TableProps<T>) {
  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (data.length === 0) {
    return <div className="text-center py-8 text-gray-500">{emptyMessage}</div>;
  }

  return (
    <div className={clsx('overflow-x-auto', className)}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={String(column.key) + index}
                className={clsx(
                  'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className={clsx(
                onRowClick && 'cursor-pointer hover:bg-gray-50 transition-colors'
              )}
            >
              {columns.map((column, index) => (
                <td
                  key={String(column.key) + index}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {column.render
                    ? column.render(item)
                    : String(item[column.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Usage Example:
/*
const columns: Column<User>[] = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { 
    key: 'user_type', 
    header: 'Type',
    render: (user) => <Badge>{user.user_type}</Badge>
  },
];

<Table 
  data={users} 
  columns={columns} 
  onRowClick={(user) => navigate(`/users/${user.id}`)}
/>
*/
```

#### Type-Safe Form Components with React Hook Form

```typescript
// src/components/forms/Input.tsx
import React, { InputHTMLAttributes } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  registration?: UseFormRegisterReturn;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  registration,
  helperText,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={clsx(
          'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all',
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300',
          props.disabled && 'bg-gray-100 cursor-not-allowed',
          className
        )}
        {...registration}
        {...props}
      />
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
```

### Type-Safe Form with Validation

```typescript
// src/pages/Users/UserCreate.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { createUserAsync } from '@/store/slices/usersSlice';
import { Input, Button } from '@/components/common';
import { toast } from 'react-hot-toast';
import type { UserFormData } from '@/types';

// Validation schema with Zod
const userSchema = z.object({
  login_id: z.string().min(3, 'Login ID must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  user_type: z.enum(['admin', 'manager', 'staff', 'user']),
  employee_id: z.string().optional(),
  phone: z.string().optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

export const UserCreate: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      await dispatch(createUserAsync(data as UserFormData)).unwrap();
      toast.success('User created successfully!');
      navigate('/users');
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New User</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Login ID"
          registration={register('login_id')}
          error={errors.login_id?.message}
          required
        />
        
        <Input
          label="Email"
          type="email"
          registration={register('email')}
          error={errors.email?.message}
          required
        />
        
        <Input
          label="Name"
          registration={register('name')}
          error={errors.name?.message}
          required
        />
        
        <Input
          label="Password"
          type="password"
          registration={register('password')}
          error={errors.password?.message}
          required
        />
        
        <Input
          label="Employee ID"
          registration={register('employee_id')}
          error={errors.employee_id?.message}
        />
        
        <div className="flex gap-4 mt-6">
          <Button type="submit" loading={isSubmitting} fullWidth>
            Create User
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/users')}
            fullWidth
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
```

---

## Pages & Routes

### Type-Safe Route Configuration

```typescript
// src/routes/index.tsx
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout, AuthLayout } from '@/components/layout';

// Lazy load pages
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Login = React.lazy(() => import('@/pages/Login'));
const UserList = React.lazy(() => import('@/pages/Users/UserList'));
const UserCreate = React.lazy(() => import('@/pages/Users/UserCreate'));
const UserEdit = React.lazy(() => import('@/pages/Users/UserEdit'));
const Customers = React.lazy(() => import('@/pages/Customers'));
const Billing = React.lazy(() => import('@/pages/Billing'));
const Network = React.lazy(() => import('@/pages/Network'));
const Reports = React.lazy(() => import('@/pages/Reports'));
const Settings = React.lazy(() => import('@/pages/Settings'));

const router = createBrowserRouter([
  // Public routes
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <Login />
          </React.Suspense>
        ),
      },
    ],
  },
  
  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/',
            element: (
              <React.Suspense fallback={<div>Loading...</div>}>
                <Dashboard />
              </React.Suspense>
            ),
          },
          {
            path: '/dashboard',
            element: (
              <React.Suspense fallback={<div>Loading...</div>}>
                <Dashboard />
              </React.Suspense>
            ),
          },
          {
            path: '/users',
            children: [
              {
                index: true,
                element: (
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <UserList />
                  </React.Suspense>
                ),
              },
              {
                path: 'create',
                element: (
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <UserCreate />
                  </React.Suspense>
                ),
              },
              {
                path: ':id/edit',
                element: (
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <UserEdit />
                  </React.Suspense>
                ),
              },
            ],
          },
          {
            path: '/customers',
            element: (
              <React.Suspense fallback={<div>Loading...</div>}>
                <Customers />
              </React.Suspense>
            ),
          },
          {
            path: '/billing',
            element: (
              <React.Suspense fallback={<div>Loading...</div>}>
                <Billing />
              </React.Suspense>
            ),
          },
          {
            path: '/network',
            element: (
              <React.Suspense fallback={<div>Loading...</div>}>
                <Network />
              </React.Suspense>
            ),
          },
          {
            path: '/reports',
            element: (
              <React.Suspense fallback={<div>Loading...</div>}>
                <Reports />
              </React.Suspense>
            ),
          },
          {
            path: '/settings',
            element: (
              <React.Suspense fallback={<div>Loading...</div>}>
                <Settings />
              </React.Suspense>
            ),
          },
        ],
      },
    ],
  },
]);

export const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};
```

---

## Setup & Installation

### Prerequisites

```bash
Node.js: >= 18.x
npm: >= 9.x (or yarn, pnpm)
TypeScript: 5.x (included in devDependencies)
```

### Installation Steps

1. **Clone Repository**
```bash
git clone https://github.com/shamimkhaled/ktl-isp-billing-typescript.git
cd ktl-isp-billing-typescript
```

2. **Install Dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Environment Configuration**

Create `.env` file:
```env
VITE_API_BASE_URL=https://your-api-url.com/api/v1
VITE_APP_ENV=development
VITE_APP_NAME=KTL ISP Billing
```

4. **Start Development Server**
```bash
npm run dev
# Application runs at http://localhost:3000
```

5. **Build for Production**
```bash
npm run build
# Output in dist/ directory
```

6. **Preview Production Build**
```bash
npm run preview
```

### Available Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\"",
    "type-check": "tsc --noEmit"
  }
}
```

---

## Development Guidelines

### TypeScript Best Practices

#### 1. **Always Define Types**

```typescript
// ❌ Bad
const fetchData = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// ✅ Good
const fetchData = async (id: string): Promise<ApiResponse<User>> => {
  const response = await api.get<ApiResponse<User>>(`/users/${id}`);
  return response.data;
};
```

#### 2. **Use Type Inference When Obvious**

```typescript
// ❌ Bad (unnecessary annotation)
const count: number = 5;
const name: string = 'John';

// ✅ Good (let TypeScript infer)
const count = 5;
const name = 'John';

// ✅ Good (annotation when not obvious)
const count: number = someFunction();
```

#### 3. **Use Discriminated Unions for State**

```typescript
// ✅ Good
type LoadingState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User[] }
  | { status: 'error'; error: string };

function handleState(state: LoadingState) {
  switch (state.status) {
    case 'idle':
      return null;
    case 'loading':
      return <LoadingSpinner />;
    case 'success':
      return <UserList users={state.data} />;
    case 'error':
      return <ErrorMessage error={state.error} />;
  }
}
```

#### 4. **Use Generics for Reusable Components**

```typescript
interface ApiListResponse<T> {
  count: number;
  results: T[];
}

async function fetchList<T>(endpoint: string): Promise<ApiListResponse<T>> {
  const response = await api.get<ApiListResponse<T>>(endpoint);
  return response.data;
}

// Usage
const users = await fetchList<User>('/users/');
const customers = await fetchList<Customer>('/customers/');
```

#### 5. **Use Utility Types**

```typescript
// Partial - make all properties optional
type PartialUser = Partial<User>;

// Pick - select specific properties
type UserPreview = Pick<User, 'id' | 'name' | 'email'>;

// Omit - exclude specific properties
type UserWithoutPassword = Omit<User, 'password'>;

// Record - create object type
type UserMap = Record<string, User>;

// Required - make all properties required
type RequiredUser = Required<Partial<User>>;
```

### Code Organization

#### File Naming Conventions

```
- Components: PascalCase (UserList.tsx, Button.tsx)
- Utilities: camelCase (formatDate.ts, validators.ts)
- Types: PascalCase (user.types.ts, api.types.ts)
- Hooks: camelCase starting with 'use' (useAuth.ts, useDebounce.ts)
- Services: camelCase (auth.service.ts, users.service.ts)
```

#### Import Order

```typescript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Internal absolute imports (using @/ alias)
import { Button, Input } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types';

// 3. Relative imports
import { UserCard } from './UserCard';
import './styles.css';
```

### Testing Guidelines

#### Component Testing

```typescript
// UserList.test.tsx
import { render, screen } from '@testing-library/react';
import { UserList } from './UserList';
import type { User } from '@/types';

const mockUsers: User[] = [
  {
    id: '1',
    login_id: 'admin001',
    email: 'admin@example.com',
    name: 'Admin User',
    user_type: 'admin',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
];

describe('UserList', () => {
  it('renders users correctly', () => {
    render(<UserList users={mockUsers} />);
    expect(screen.getByText('Admin User')).toBeInTheDocument();
  });
  
  it('shows empty state when no users', () => {
    render(<UserList users={[]} />);
    expect(screen.getByText(/no users found/i)).toBeInTheDocument();
  });
});
```

---

## Performance Optimization

### Code Splitting

```typescript
// Lazy load routes
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));

// Use with Suspense
<React.Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</React.Suspense>
```

### Memoization

```typescript
import React, { memo, useMemo, useCallback } from 'react';

// Memoize component
const UserCard = memo<{ user: User }>(({ user }) => {
  return <div>{user.name}</div>;
});

// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### React Query Optimization

```typescript
// Configure stale time and cache time
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});
```

---

## Build & Deployment

### Production Build

```bash
# Type check
npm run type-check

# Build
npm run build

# Preview build
npm run preview
```

### Environment Variables

```env
# .env.production
VITE_API_BASE_URL=https://api.production.com/api/v1
VITE_APP_ENV=production
```

### Docker Support

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Summary

This TypeScript version provides:

✅ **Full Type Safety** - Catch errors at compile time  
✅ **Better DX** - Enhanced IDE support and autocomplete  
✅ **Self-Documenting** - Types serve as inline documentation  
✅ **Refactoring Confidence** - Safe refactoring with type checking  
✅ **Modern Build Tool** - Vite for fast development and builds  
✅ **Scalable Architecture** - Well-organized codebase structure  
✅ **Production Ready** - Optimized for performance  

---

**Documentation Version:** 1.0.0  
**Last Updated:** October 2025  
**Maintained by:** KTL Development Team
