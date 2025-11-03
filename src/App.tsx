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
  import("./pages/UserManagement/RoleManagement").then((m) => ({
    default: m.RoleManagement,
  }))
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
const RouterSettings = lazy(() =>
  import("./pages/Settings/RouterSettings").then((m) => ({
    default: m.RouterSettings,
  }))
);
const MainProfile = lazy(() =>
  import("./pages/UserManagement/MainProfile").then((m) => ({ default: m.MainProfile }))
);

// Zones & SDT Components (lazy-loaded individually)
const ZoneList = lazy(() => import("./pages/ZonesSDT/ZoneList"));
const ZoneForm = lazy(() => import("./pages/ZonesSDT/ZoneForm"));
const CreateSDT = lazy(() => import("./pages/ZonesSDT/CreateSDT"));
const SDTList = lazy(() => import("./pages/ZonesSDT/SDTList"));
const CustomerPayments = lazy(
  () => import("./pages/ZonesSDT/CustomerPayments")
);

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

// Corporate Components
const AddCustomer = lazy(() =>
  import("./pages/Corporate/AddCustomer").then((m) => ({
    default: m.AddCustomer,
  }))
);
const CustomerList = lazy(() =>
  import("./pages/Corporate/CustomerList").then((m) => ({
    default: m.CustomerList,
  }))
);
const Packages = lazy(() =>
  import("./pages/Corporate/Packages").then((m) => ({ default: m.Packages }))
);
const Invoices = lazy(() =>
  import("./pages/Corporate/Invoices").then((m) => ({ default: m.Invoices }))
);
// Tickets Components
const AllTickets = lazy(() =>
  import("./pages/Tickets/AllTickets").then((m) => ({ default: m.AllTickets }))
);
const MyTickets = lazy(() =>
  import("./pages/Tickets/MyTickets").then((m) => ({ default: m.MyTickets }))
);
const CreateTicket = lazy(() =>
  import("./pages/Tickets/CreateTicket").then((m) => ({
    default: m.CreateTicket,
  }))
);
const TicketSummary = lazy(() =>
  import("./pages/Tickets/TicketSummary").then((m) => ({
    default: m.TicketSummary,
  }))
);
const TicketTopics = lazy(() =>
  import("./pages/Tickets/TicketTopics").then((m) => ({
    default: m.TicketTopics,
  }))
);
const SalesQuery = lazy(() =>
  import("./pages/Tickets/SalesQuery").then((m) => ({ default: m.SalesQuery }))
);

// SMS Components
const SMSReport = lazy(() =>
  import("./pages/SMS/SMSReport").then((m) => ({ default: m.SMSReport }))
);
const SMSSyncReport = lazy(() =>
  import("./pages/SMS/SMSSyncReport").then((m) => ({
    default: m.SMSSyncReport,
  }))
);
const SMSSettings = lazy(() =>
  import("./pages/SMS/SMSSettings").then((m) => ({ default: m.SMSSettings }))
);
const MessageTemplates = lazy(() =>
  import("./pages/SMS/MessageTemplates").then((m) => ({
    default: m.MessageTemplates,
  }))
);
const SendSMS = lazy(() =>
  import("./pages/SMS/SendSMS").then((m) => ({ default: m.SendSMS }))
);
const SummaryReport = lazy(() =>
  import("./pages/SMS/SummaryReport").then((m) => ({
    default: m.SummaryReport,
  }))
);
const DownloadSyncApp = lazy(() =>
  import("./pages/SMS/DownloadSyncApp").then((m) => ({
    default: m.DownloadSyncApp,
  }))
);
const SMSProviderSettings = lazy(() =>
  import("./pages/SMS/SMSProviderSettings").then((m) => ({
    default: m.SMSProviderSettings,
  }))
);

// Vendor Components
const MyPaymentHistory = lazy(() =>
  import("./pages/Vendor/MyPaymentHistory").then((m) => ({
    default: m.MyPaymentHistory,
  }))
);
const VendorCreateTicket = lazy(() =>
  import("./pages/Vendor/VendorCreateTicket").then((m) => ({
    default: m.VendorCreateTicket,
  }))
);

// HOME/SOHO Components
const HomeSohoAddCustomer = lazy(() =>
  import("./pages/HomeSoho/HomeSohoAddCustomer.tsx").then((m) => ({
    default: m.HomeSohoAddCustomer,
  }))
);
const HomeSohoAddCustomerLess = lazy(() =>
  import("./pages/HomeSoho/HomeSohoAddCustomerLess.tsx").then((m) => ({
    default: m.HomeSohoAddCustomerLess,
  }))
);
const HomeSohoCustomerList = lazy(() =>
  import("./pages/HomeSoho/HomeSohoCustomerList.tsx").then((m) => ({
    default: m.HomeSohoCustomerList,
  }))
);
const HomeSohoCustomerPayments = lazy(() =>
  import("./pages/HomeSoho/CustomerPayments").then((m) => ({
    default: m.CustomerPayments,
  }))
);
const HomeSohoPackages = lazy(() =>
  import("./pages/HomeSoho/Packages").then((m) => ({
    default: m.Packages,
  }))
);
const Pop = lazy(() =>
  import("./pages/HomeSoho/Pop").then((m) => ({
    default: m.Pop,
  }))
);
const Box = lazy(() =>
  import("./pages/HomeSoho/Box").then((m) => ({
    default: m.Box,
  }))
);
const SearchCustomer = lazy(() =>
  import("./pages/HomeSoho/SearchCustomer").then((m) => ({
    default: m.SearchCustomer,
  }))
);
const SessionLog = lazy(() =>
  import("./pages/HomeSoho/SessionLog").then((m) => ({
    default: m.SessionLog,
  }))
);
const BillingCycle = lazy(() =>
  import("./pages/HomeSoho/BillingCycle").then((m) => ({
    default: m.BillingCycle,
  }))
);
const DueReport = lazy(() =>
  import("./pages/HomeSoho/DueReport").then((m) => ({
    default: m.DueReport,
  }))
);
const ImportCustomer = lazy(() =>
  import("./pages/HomeSoho/ImportCustomer").then((m) => ({
    default: m.ImportCustomer,
  }))
);
const NewCustomerList = lazy(() =>
  import("./pages/HomeSoho/NewCustomerList").then((m) => ({
    default: m.NewCustomerList,
  }))
);
const UnauthorizedCustomers = lazy(() =>
  import("./pages/HomeSoho/UnauthorizedCustomers").then((m) => ({
    default: m.UnauthorizedCustomers,
  }))
);
const CustomerCounts = lazy(() =>
  import("./pages/HomeSoho/CustomerCounts").then((m) => ({
    default: m.CustomerCounts,
  }))
);
const VendorMyTickets = lazy(() =>
  import("./pages/Vendor/VendorMyTickets").then((m) => ({
    default: m.VendorMyTickets,
  }))
);
const MyInvoices = lazy(() =>
  import("./pages/Vendor/MyInvoices").then((m) => ({ default: m.MyInvoices }))
);

// FTTH Components
const NetworkDiagram = lazy(() =>
  import("./pages/FTTH/NetworkDiagram").then((m) => ({
    default: m.NetworkDiagram,
  }))
);
const ListSWOLT = lazy(() =>
  import("./pages/FTTH/ListSWOLT").then((m) => ({ default: m.ListSWOLT }))
);
const SwitchTree = lazy(() =>
  import("./pages/FTTH/SwitchTree").then((m) => ({ default: m.SwitchTree }))
);
const ColorRules = lazy(() =>
  import("./pages/FTTH/ColorRules").then((m) => ({ default: m.ColorRules }))
);
const OltPorts = lazy(() =>
  import("./pages/FTTH/OltPorts").then((m) => ({ default: m.OltPorts }))
);
const OltTraps = lazy(() =>
  import("./pages/FTTH/OltTraps").then((m) => ({ default: m.OltTraps }))
);

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
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <MainProfile />
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
          <Route
            path="/settings/router"
            element={
              <ProtectedRoute>
                <Layout>
                  <RouterSettings />
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

          {/* Corporate Routes */}
          <Route
            path="/corporate/add-customer"
            element={
              <ProtectedRoute>
                <Layout>
                  <AddCustomer />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/corporate/customers"
            element={
              <ProtectedRoute>
                <Layout>
                  <CustomerList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/corporate/packages"
            element={
              <ProtectedRoute>
                <Layout>
                  <Packages />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/corporate/invoices"
            element={
              <ProtectedRoute>
                <Layout>
                  <Invoices />
                </Layout>
              </ProtectedRoute>
            }
          />
          {/* Tickets Routes */}
          <Route
            path="/tickets"
            element={
              <ProtectedRoute>
                <Layout>
                  <AllTickets />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets/my"
            element={
              <ProtectedRoute>
                <Layout>
                  <MyTickets />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets/create"
            element={
              <ProtectedRoute>
                <Layout>
                  <CreateTicket />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets/summary"
            element={
              <ProtectedRoute>
                <Layout>
                  <TicketSummary />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets/topics"
            element={
              <ProtectedRoute>
                <Layout>
                  <TicketTopics />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets/sales-query"
            element={
              <ProtectedRoute>
                <Layout>
                  <SalesQuery />
                </Layout>
              </ProtectedRoute>
            }
          />
          {/* SMS Routes */}
          <Route
            path="/sms/report"
            element={
              <ProtectedRoute>
                <Layout>
                  <SMSReport />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sms/sync-report"
            element={
              <ProtectedRoute>
                <Layout>
                  <SMSSyncReport />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sms/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <SMSSettings />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sms/templates"
            element={
              <ProtectedRoute>
                <Layout>
                  <MessageTemplates />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sms/send"
            element={
              <ProtectedRoute>
                <Layout>
                  <SendSMS />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sms/summary"
            element={
              <ProtectedRoute>
                <Layout>
                  <SummaryReport />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sms/download-sync-app"
            element={
              <ProtectedRoute>
                <Layout>
                  <DownloadSyncApp />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sms/provider-settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <SMSProviderSettings />
                </Layout>
              </ProtectedRoute>
            }
          />
          {/* Vendor Routes */}
          <Route
            path="/vendor/payments-history"
            element={
              <ProtectedRoute>
                <Layout>
                  <MyPaymentHistory />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/tickets/create"
            element={
              <ProtectedRoute>
                <Layout>
                  <VendorCreateTicket />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/tickets/my"
            element={
              <ProtectedRoute>
                <Layout>
                  <VendorMyTickets />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/invoices"
            element={
              <ProtectedRoute>
                <Layout>
                  <MyInvoices />
                </Layout>
              </ProtectedRoute>
            }
          />
          {/* HOME/SOHO Routes */}
          <Route
            path="/home-soho/add-customer"
            element={
              <ProtectedRoute>
                <Layout>
                  <HomeSohoAddCustomer />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/home-soho/add-customer-less"
            element={
              <ProtectedRoute>
                <Layout>
                  <HomeSohoAddCustomerLess />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/home-soho/customers"
            element={
              <ProtectedRoute>
                <Layout>
                  <HomeSohoCustomerList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/home-soho/customer-payments"
            element={
              <ProtectedRoute>
                <Layout>
                  <HomeSohoCustomerPayments />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/home-soho/packages"
            element={
              <ProtectedRoute>
                <Layout>
                  <HomeSohoPackages />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/home-soho/pop"
            element={
              <ProtectedRoute>
                <Layout>
                  <Pop />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/home-soho/box"
            element={
              <ProtectedRoute>
                <Layout>
                  <Box />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/home-soho/search"
            element={
              <ProtectedRoute>
                <Layout>
                  <SearchCustomer />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/home-soho/session-log"
            element={
              <ProtectedRoute>
                <Layout>
                  <SessionLog />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/home-soho/billing-cycle"
            element={
              <ProtectedRoute>
                <Layout>
                  <BillingCycle />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/home-soho/due-report"
            element={
              <ProtectedRoute>
                <Layout>
                  <DueReport />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/home-soho/import"
            element={
              <ProtectedRoute>
                <Layout>
                  <ImportCustomer />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/home-soho/new-customers"
            element={
              <ProtectedRoute>
                <Layout>
                  <NewCustomerList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/home-soho/unauthorized"
            element={
              <ProtectedRoute>
                <Layout>
                  <UnauthorizedCustomers />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/home-soho/active-count"
            element={
              <ProtectedRoute>
                <Layout>
                  <CustomerCounts />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/home-soho/inactive-count"
            element={
              <ProtectedRoute>
                <Layout>
                  <CustomerCounts />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/home-soho/new-count"
            element={
              <ProtectedRoute>
                <Layout>
                  <CustomerCounts />
                </Layout>
              </ProtectedRoute>
            }
          />
          {/* FTTH Routes */}
          <Route
            path="/ftth/network-diagram"
            element={
              <ProtectedRoute>
                <Layout>
                  <NetworkDiagram />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ftth/list-sw-olt"
            element={
              <ProtectedRoute>
                <Layout>
                  <ListSWOLT />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ftth/switch-tree"
            element={
              <ProtectedRoute>
                <Layout>
                  <SwitchTree />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ftth/color-rules"
            element={
              <ProtectedRoute>
                <Layout>
                  <ColorRules />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ftth/otl-ports"
            element={
              <ProtectedRoute>
                <Layout>
                  <OltPorts />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ftth/otl-traps"
            element={
              <ProtectedRoute>
                <Layout>
                  <OltTraps />
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
