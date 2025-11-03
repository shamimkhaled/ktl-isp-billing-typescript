import React, { useState } from "react";
import { useAppSelector } from "../../store";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Settings,
  MapPin,
  DollarSign,
  BarChart3,
  Network,
  ChevronDown,
  ChevronRight,
  X,
  Ticket,
  MessageSquare,
  Briefcase,
  Building2,
} from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  gradient: string;
  subItems?: Array<{
    label: string;
    path: string;
  }>;
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    gradient: "from-blue-400 to-cyan-400",
    subItems: [
      { label: "Overview", path: "/dashboard" },
      { label: "Analytics", path: "/dashboard/analytics" },
    ],
  },
  {
    id: "users",
    label: "User Management",
    icon: Users,
    path: "/users",
    gradient: "from-purple-400 to-pink-400",
    subItems: [
      { label: "Users", path: "/users" },
      { label: "Roles", path: "/users/roles" },
      { label: "Permissions", path: "/users/permissions" },
    ],
  },
  {
    id: "zones",
    label: "Zones/SDT",
    icon: MapPin,
    path: "/zones",
    gradient: "from-emerald-400 to-green-400",
    subItems: [
      { label: "Create Zone", path: "/zones/create" },
      { label: "Zone List", path: "/zones" },
      { label: "Create SDT", path: "/zones/create-sdt" },
      { label: "List SDT", path: "/zones/sdt-list" },
      { label: "Customer Payments", path: "/zones/customer-payments" },
      { label: "Payments", path: "/zones/payments" },
      { label: "Zone Cust Summ", path: "/zones/zone-customer-summary" },
      { label: "SDT Coll Summ", path: "/zones/sdt-collection-summary" },
      { label: "Cust Trends", path: "/zones/customer-trends" },
      { label: "SDT Rates", path: "/zones/sdt-rates" },
    ],
  },
  {
    id: "home-soho",
    label: "HOME/SOHO",
    icon: Users,
    path: "/home-soho/customers",
    gradient: "from-orange-400 to-amber-400",
    subItems: [
      { label: "Add Customer", path: "/home-soho/add-customer" },
      {
        label: "Add Customer (Less Info)",
        path: "/home-soho/add-customer-less",
      },
      { label: "List Customers", path: "/home-soho/customers" },
      { label: "Customer Payments", path: "/home-soho/customer-payments" },
      { label: "Packages", path: "/home-soho/packages" },
      { label: "POP", path: "/home-soho/pop" },
      { label: "Box", path: "/home-soho/box" },
      { label: "Search Customer", path: "/home-soho/search" },
      { label: "Session Log", path: "/home-soho/session-log" },
      { label: "Billing Cycle", path: "/home-soho/billing-cycle" },
      { label: "Due Report", path: "/home-soho/due-report" },
      { label: "Import Customer", path: "/home-soho/import" },
      { label: "New Customer List", path: "/home-soho/new-customers" },
      { label: "UnAuthorized Customers", path: "/home-soho/unauthorized" },
      { label: "Active Customer Count", path: "/home-soho/active-count" },
      { label: "Inactive Customer Count", path: "/home-soho/inactive-count" },
      { label: "New Customer Count", path: "/home-soho/new-count" },
    ],
  },
  {
    id: "corporate",
    label: "CORPORATE",
    icon: Building2,
    path: "/corporate/customers",
    gradient: "from-rose-400 to-red-400",
    subItems: [
      { label: "Add Customer", path: "/corporate/add-customer" },
      { label: "List Customer", path: "/corporate/customers" },
      { label: "Packages", path: "/corporate/packages" },
      { label: "All Invoice", path: "/corporate/invoices" },
    ],
  },
  {
    id: "tickets",
    label: "TICKETS",
    icon: Ticket,
    path: "/tickets",
    gradient: "from-indigo-400 to-blue-400",
    subItems: [
      { label: "List All Tickets", path: "/tickets" },
      { label: "List My Ticket", path: "/tickets/my" },
      { label: "Create Ticket", path: "/tickets/create" },
      { label: "Ticket Summary Graph", path: "/tickets/summary" },
      { label: "Ticket Topics", path: "/tickets/topics" },
      { label: "Sales Query", path: "/tickets/sales-query" },
    ],
  },
  {
    id: "sms",
    label: "SMS",
    icon: MessageSquare,
    path: "/sms/send",
    gradient: "from-green-400 to-emerald-400",
    subItems: [
      { label: "SMS Report", path: "/sms/report" },
      { label: "SMS Sync Report", path: "/sms/sync-report" },
      { label: "SMS Settings", path: "/sms/settings" },
      { label: "Message Templates", path: "/sms/templates" },
      { label: "Send SMS", path: "/sms/send" },
      { label: "Summary Report", path: "/sms/summary" },
      { label: "Download Sync App", path: "/sms/download-sync-app" },
      { label: "SMS Provider Settings", path: "/sms/provider-settings" },
    ],
  },
  {
    id: "vendor",
    label: "VENDOR",
    icon: Briefcase,
    path: "/vendor/tickets/my",
    gradient: "from-purple-400 to-indigo-400",
    subItems: [
      { label: "My Payment History", path: "/vendor/payments-history" },
      { label: "Create Ticket", path: "/vendor/tickets/create" },
      { label: "List My Ticket", path: "/vendor/tickets/my" },
      { label: "My Invoices", path: "/vendor/invoices" },
    ],
  },
  {
    id: "ftth",
    label: "FTTH",
    icon: Network,
    path: "/ftth/list-sw-olt",
    gradient: "from-teal-400 to-cyan-400",
    subItems: [
      { label: "Network Diagram", path: "/ftth/network-diagram" },
      { label: "List SW/OLT", path: "/ftth/list-sw-olt" },
      { label: "Switch Tree", path: "/ftth/switch-tree" },
      { label: "Color Rules", path: "/ftth/color-rules" },
      { label: "OTL Ports", path: "/ftth/otl-ports" },
      { label: "OTL Traps", path: "/ftth/otl-traps" },
    ],
  },
  {
    id: "billing",
    label: "Billing",
    icon: DollarSign,
    path: "/billing",
    gradient: "from-yellow-400 to-orange-400",
  },
  {
    id: "network",
    label: "Network",
    icon: Network,
    path: "/network",
    gradient: "from-indigo-400 to-purple-400",
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
    path: "/reports",
    gradient: "from-teal-400 to-blue-400",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    gradient: "from-gray-400 to-slate-400",
    subItems: [
      { label: "Organization Settings", path: "/settings/organization" },
      { label: "Router Settings", path: "/settings/router" },
      { label: "General Settings", path: "/settings" },
    ],
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {}
  );
  const themeMode = useAppSelector((state) => state.theme.mode);

  const toggleMenu = (itemId: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    if (path === "/dashboard" && location.pathname === "/") return true;

    // Special case for zones
    if (path === "/zones" && location.pathname.startsWith("/zones/")) {
      // Return true only if it's exactly /zones, not for subpaths
      return location.pathname === "/zones";
    }

    return location.pathname === path;
  };

  const isSubItemActive = (item: MenuItem) => {
    return (
      item.subItems?.some((subItem) => location.pathname === subItem.path) ||
      false
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={
          `fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 lg:w-72 backdrop-blur-xl shadow-2xl z-40 transition-transform duration-300 ease-in-out flex flex-col ` +
          (themeMode === "dark"
            ? "bg-white/10 border-r border-white/20 text-white"
            : "bg-white border-r border-gray-200 text-gray-900") +
          (isOpen ? " translate-x-0" : " -translate-x-full lg:translate-x-0")
        }
      >
        {/* Mobile Close Button */}
        <div
          className={`lg:hidden p-4 flex-shrink-0 ${
            themeMode === "dark"
              ? "border-b border-white/20"
              : "border-b border-gray-200"
          }`}
        >
          <button
            onClick={onClose}
            className="p-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
          >
            <X
              className={`w-5 h-5 ${
                themeMode === "dark" ? "text-white" : "text-gray-900"
              }`}
            />
          </button>
        </div>

        {/* Scrollable Navigation Content */}
        <div className="flex-1 overflow-y-auto my-4">
          <div className="p-4">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const isExpanded = expandedMenus[item.id];
                const isItemActive =
                  isActive(item.path) || isSubItemActive(item) || (isExpanded && item.subItems);
                const Icon = item.icon;

                return (
                  <div key={item.id}>
                    {/* Main Menu Item */}
                    <div
                      className={`group relative overflow-hidden rounded-2xl mt-5 transition-all duration-300 ${
                        isItemActive
                          ? "bg-white/20 shadow-xl transform scale-[1.02]"
                          : "hover:bg-white/10 hover:transform hover:scale-[1.01]"
                      }`}
                    >
                      {/* Background gradient for active item */}
                      {isItemActive && (
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-20 rounded-2xl`}
                        />
                      )}

                      <div className="relative">
                        {item.path ? (
                          <div
                            onClick={() => item.subItems && toggleMenu(item.id)}
                          >
                            <Link
                              to={item.path}
                              className="flex items-center justify-between w-full p-3 sm:p-4 text-left"
                            >
                              <div className="flex items-center space-x-3 sm:space-x-4">
                                <div
                                  className={
                                    `w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ` +
                                    (isItemActive
                                      ? `bg-gradient-to-br ${item.gradient} text-white`
                                      : themeMode === "dark"
                                      ? "bg-white/10 text-white/80 group-hover:bg-white/20"
                                      : "bg-gray-100 text-gray-800 group-hover:bg-gray-200")
                                  }
                                >
                                  <Icon
                                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                      themeMode === "dark"
                                        ? ""
                                        : "text-gray-800"
                                    }`}
                                  />
                                </div>
                                <span
                                  className={
                                    `font-semibold transition-colors text-sm sm:text-base ` +
                                    (isItemActive
                                      ? "text-black"
                                      : themeMode === "dark"
                                      ? "text-white/80 group-hover:text-white"
                                      : "text-gray-900 group-hover:text-gray-800")
                                  }
                                >
                                  {item.label}
                                </span>
                              </div>
                              {item.subItems && (
                                <div
                                  className={`p-1 transition-colors ${
                                    themeMode === "dark"
                                      ? "text-white/60 hover:text-white"
                                      : "text-gray-500 hover:text-gray-800"
                                  }`}
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </div>
                              )}
                            </Link>
                          </div>
                        ) : (
                          <button
                            onClick={() => item.subItems && toggleMenu(item.id)}
                            className="flex items-center justify-between w-full p-3 sm:p-4 text-left"
                          >
                            <div className="flex items-center space-x-3 sm:space-x-4">
                              <div
                                className={
                                  `w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ` +
                                  (isItemActive
                                    ? `bg-gradient-to-br ${item.gradient} text-white`
                                    : themeMode === "dark"
                                    ? "bg-white/10 text-white/80 group-hover:bg-white/20"
                                    : "bg-gray-100 text-gray-800 group-hover:bg-gray-200")
                                }
                              >
                                <Icon
                                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                    themeMode === "dark"
                                      ? ""
                                      : "text-gray-800"
                                  }`}
                                />
                              </div>
                              <span
                                className={
                                  `font-semibold transition-colors text-sm sm:text-base ` +
                                  (isItemActive
                                    ? "text-black"
                                    : themeMode === "dark"
                                    ? "text-white/80 group-hover:text-white"
                                    : "text-gray-900 group-hover:text-gray-800")
                                }
                              >
                                {item.label}
                              </span>
                            </div>
                            {item.subItems && (
                              <div
                                className={`p-1 transition-colors ${
                                  themeMode === "dark"
                                    ? "text-white/60 hover:text-white"
                                    : "text-gray-500 hover:text-gray-800"
                                }`}
                              >
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </div>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Sub Menu Items */}
                    {item.subItems && isExpanded && (
                      <div className="ml-6 mt-2 space-y-1 overflow-hidden">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={
                              `block px-4 py-2 rounded-xl text-sm transition-all duration-200 ` +
                              (isActive(subItem.path)
                                ? themeMode === "dark"
                                  ? "bg-white/20 text-black font-medium shadow-lg"
                                  : "bg-gray-200 text-gray-900 font-medium shadow-lg"
                                : themeMode === "dark"
                                ? "text-white/70 hover:text-white hover:bg-white/10"
                                : "text-gray-700 hover:text-gray-900 hover:bg-gray-100")
                            }
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Fixed Footer */}
        <div
          className={`flex-shrink-0 p-4 backdrop-blur-sm ${
            themeMode === "dark"
              ? "border-t border-white/20"
              : "border-t border-gray-200"
          }`}
        >
          <div
            className={`text-center text-xs ${
              themeMode === "dark" ? "text-white/50" : "text-gray-500"
            }`}
          >
            <p>KTL ISP Billing Management System</p>
            <p>v1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
};
