// src/App.tsx
import React, { useEffect, Suspense, lazy, useMemo, memo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { store } from "./store";
import { useAppDispatch } from "./store";
import { useAuth } from "./hooks/useAuth";
import { useTokenExpiration } from "./hooks/useTokenExpiration"; // Temporarily disabled
import { updateTokens, logout } from "./store/authSlice";
import { apiService } from "./services/api";
import { LoadingSpinner } from "./components/common/LoadingSpinner";
import { Header } from "./components/common/Header";
import { Sidebar } from "./components/common/Sidebar";

// Lazy load pages for better performance with preload hints
const Login = lazy(() =>
  import("./pages/Login").then((module) => ({ default: module.Login }))
);
const Dashboard = lazy(() =>
  import("./pages/Dashboard").then((module) => ({ default: module.Dashboard }))
);
const UserManagement = lazy(() =>
  import("./pages/UserManagement").then((module) => ({
    default: module.UserManagement,
  }))
);
const UserProfile = lazy(() =>
  import("./pages/UserProfile").then((module) => ({
    default: module.UserProfile,
  }))
);
const RoleManagement = lazy(() =>
  import("./pages/RoleManagement").then((module) => ({
    default: module.RoleManagement,
  }))
);
const PermissionManagement = lazy(() =>
  import("./pages/PermissionManagement").then((module) => ({
    default: module.PermissionManagement,
  }))
);
const OrganizationSettings = lazy(() =>
  import("./pages/OrganizationSettings").then((module) => ({
    default: module.OrganizationSettings,
  }))
);
const Report = lazy(() =>
  import("./pages/Report").then((module) => ({ default: module.Report }))
);

// Preload critical routes
if (typeof document !== "undefined") {
  // Preload dashboard for authenticated users
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = "/dashboard";
  document.head.appendChild(link);
}

// Create a query client with optimized caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 401/403 errors
        if (error?.status === 401 || error?.status === 403) return false;
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      networkMode: "offlineFirst", // Use cache when offline
    },
    mutations: {
      retry: 1,
      networkMode: "offlineFirst",
    },
  },
});

// Protected Route Component - Memoized for performance
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = memo<ProtectedRouteProps>(({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Memoize the authentication check to prevent unnecessary re-renders
  const authCheck = useMemo(() => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
          <LoadingSpinner size="xl" message="Verifying authentication..." />
        </div>
      );
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
  }, [isAuthenticated, loading, children]);

  return <>{authCheck}</>;
});

// Layout Component for authenticated pages - Memoized for performance
const Layout = memo<React.PropsWithChildren>(({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      <Header onToggleSidebar={toggleSidebar} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        <main className="flex-1 transition-all duration-300 mt-16 lg:ml-72">
          <div className="p-4 sm:p-6 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
});

// Fallback Component
const FallbackRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

// Main App Component
const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();

  // Check token expiration and logout if expired
  useTokenExpiration(); // Temporarily disabled for debugging

  // Set up API service callbacks
  useEffect(() => {
    apiService.setTokenRefreshCallback((data) => {
      dispatch(updateTokens(data));
    });

    apiService.setLogoutCallback(() => {
      dispatch(logout());
    });
  }, [dispatch]);

  return (
    <Router>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
            <LoadingSpinner size="xl" message="Loading page..." />
          </div>
        }
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Navigate to="/dashboard" replace />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Layout>
                  <UserManagement />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <UserProfile />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/users/roles"
            element={
              <ProtectedRoute>
                <Layout>
                  <RoleManagement />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/users/permissions"
            element={
              <ProtectedRoute>
                <Layout>
                  <PermissionManagement />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings/organization"
            element={
              <ProtectedRoute>
                <Layout>
                  <OrganizationSettings />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Layout>
                  <Report />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<FallbackRoute />} />
        </Routes>
      </Suspense>

      {/* Global Toast Notifications */}
      <Toaster position="top-right" richColors expand={false} duration={4000} />
    </Router>
  );
};

// App wrapper with providers
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
