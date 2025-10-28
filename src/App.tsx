// src/App.tsx
import React, { useEffect, Suspense, lazy, memo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { store, useAppDispatch } from "./store";
import { useAuth } from "./hooks/useAuth";
import { updateTokens, logout } from "./store/authSlice";
import { apiService } from "./services/api";
import { LoadingSpinner } from "./components/common/LoadingSpinner";
import { Header } from "./components/common/Header";
import { useAppSelector } from "./store";
import { Sidebar } from "./components/common/Sidebar";

const Login = lazy(() =>
  import("./pages/Login").then((m) => ({ default: m.Login }))
);
const Dashboard = lazy(() =>
  import("./pages/Dashboard").then((m) => ({ default: m.Dashboard }))
);
const Users = lazy(() =>
  import("./pages/UserManagement/Users").then((m) => ({ default: m.Users }))
);
const RoleManagement = lazy(() =>
  import("./pages/UserManagement/RoleManagement").then((m) => ({ default: m.RoleManagement }))
);
const PermissionManagement = lazy(() =>
  import("./pages/UserManagement/PermissionManagement").then((m) => ({
    default: m.PermissionManagement,
  }))
);
const Report = lazy(() =>
  import("./pages/Report").then((m) => ({ default: m.Report }))
);
const OrganizationSettings = lazy(() =>
  import("./pages/Settings/OrganizationSettings").then((m) => ({
    default: m.OrganizationSettings,
  }))
);

// Zones & SDT Components (lazy-loaded individually)
const ZoneList = lazy(() => import("./pages/ZonesSDT/ZoneList"));
const ZoneForm = lazy(() => import("./pages/ZonesSDT/ZoneForm"));
const CreateSDT = lazy(() => import("./pages/ZonesSDT/CreateSDT"));
const SDTList = lazy(() => import("./pages/ZonesSDT/SDTList"));
const CustomerPayments = lazy(() => import("./pages/ZonesSDT/CustomerPayments"));

// Named ZonePayments to avoid colliding with the existing `Payment` page import above
const ZonePayments = lazy(() => import("./pages/ZonesSDT/Payments"));
const ZoneCustomerSummary = lazy(
  () => import("./pages/ZonesSDT/ZoneCustomerSummary")
);
const SDTCollectionSummary = lazy(
  () => import("./pages/ZonesSDT/SDTCollectionSummary")
);
const CustomerTrends = lazy(() => import("./pages/ZonesSDT/CustomerTrends"));
const SDTRates = lazy(() => import("./pages/ZonesSDT/SDTRates"));

//app
// Create QueryClient
const queryClient = new QueryClient();

// Protected Route - Move this OUTSIDE and BEFORE AppContent
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = memo(
  ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading)
      return <LoadingSpinner size="xl" message="Checking authentication..." />;
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
  }
);

// Layout - Move this OUTSIDE and BEFORE AppContent
const Layout: React.FC<{ children: React.ReactNode }> = memo(({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const themeMode = useAppSelector((s) => s.theme.mode);

  const containerClass =
    themeMode === "dark"
      ? "min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900"
      : "min-h-screen bg-white";

  return (
    <div className={containerClass}>
      <Header onToggleSidebar={toggleSidebar} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 mt-16 lg:ml-72 p-4 sm:p-6 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
});

// AppContent - Now ProtectedRoute and Layout are defined above
const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();

  // Setup API callbacks
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
        fallback={<LoadingSpinner size="xl" message="Loading page..." />}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
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
                  <Users />
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
            path="/reports"
            element={
              <ProtectedRoute>
                <Layout>
                  <Report />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/zones"
            element={
              <ProtectedRoute>
                <Layout>
                  <ZoneList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/zones/create"
            element={
              <ProtectedRoute>
                <Layout>
                  <ZoneForm />
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
          {/* Zones & SDT Routes */}
          <Route
            path="/zones/create-sdt"
            element={
              <ProtectedRoute>
                <Layout>
                  <CreateSDT />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/zones/sdt-list"
            element={
              <ProtectedRoute>
                <Layout>
                  <SDTList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/zones/customer-payments"
            element={
              <ProtectedRoute>
                <Layout>
                  <CustomerPayments />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/zones/payments"
            element={
              <ProtectedRoute>
                <Layout>
                  <ZonePayments />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/zones/zone-customer-summary"
            element={
              <ProtectedRoute>
                <Layout>
                  <ZoneCustomerSummary />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/zones/sdt-collection-summary"
            element={
              <ProtectedRoute>
                <Layout>
                  <SDTCollectionSummary />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/zones/customer-trends"
            element={
              <ProtectedRoute>
                <Layout>
                  <CustomerTrends />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/zones/sdt-rates"
            element={
              <ProtectedRoute>
                <Layout>
                  <SDTRates />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
      <Toaster position="top-right" richColors expand={false} duration={4000} />
    </Router>
  );
};

// App wrapper
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
