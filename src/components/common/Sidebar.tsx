import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
} from 'lucide-react';

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
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
    gradient: 'from-blue-400 to-cyan-400',
    subItems: [
      { label: 'Overview', path: '/dashboard' },
      { label: 'Analytics', path: '/dashboard/analytics' },
    ],
  },
  {
    id: 'users',
    label: 'User Management',
    icon: Users,
    path: '/users',
    gradient: 'from-purple-400 to-pink-400',
    subItems: [
      { label: 'All Users', path: '/users' },
      { label: 'Roles', path: '/users/roles' },
      { label: 'Permissions', path: '/users/permissions' },
    ],
  },
  {
    id: 'zones',
    label: 'Zones & SDT',
    icon: MapPin,
    path: '/zones',
    gradient: 'from-emerald-400 to-green-400',
    subItems: [
      { label: 'Zone List', path: '/zones' },
      { label: 'SDT Terminals', path: '/zones/sdt' },
    ],
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: DollarSign,
    path: '/billing',
    gradient: 'from-yellow-400 to-orange-400',
  },
  {
    id: 'network',
    label: 'Network',
    icon: Network,
    path: '/network',
    gradient: 'from-indigo-400 to-purple-400',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    path: '/reports',
    gradient: 'from-teal-400 to-blue-400',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings',
    gradient: 'from-gray-400 to-slate-400',
    subItems: [
      { label: 'Organization Settings', path: '/settings/organization' },
      { label: 'General Settings', path: '/settings' },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (itemId: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isSubItemActive = (item: MenuItem) => {
    return item.subItems?.some(subItem => isActive(subItem.path)) || false;
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 backdrop-blur-xl bg-white/10 border-r border-white/20 shadow-2xl overflow-y-auto z-40">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isItemActive = isActive(item.path) || isSubItemActive(item);
            const isExpanded = expandedMenus[item.id];
            const Icon = item.icon;

            return (
              <div key={item.id}>
                {/* Main Menu Item */}
                <div
                  className={`group relative overflow-hidden rounded-2xl mt-5 transition-all duration-300 ${
                    isItemActive
                      ? 'bg-white/20 shadow-xl transform scale-[1.02]'
                      : 'hover:bg-white/10 hover:transform hover:scale-[1.01]'
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
                      <Link
                        to={item.path}
                        className="flex items-center justify-between w-full p-4 text-left"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                              isItemActive
                                ? `bg-gradient-to-br ${item.gradient} text-white`
                                : 'bg-white/10 text-white/80 group-hover:bg-white/20'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <span
                            className={`font-semibold transition-colors ${
                              isItemActive ? 'text-white' : 'text-white/80 group-hover:text-white'
                            }`}
                          >
                            {item.label}
                          </span>
                        </div>
                        {item.subItems && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleMenu(item.id);
                            }}
                            className="p-1 text-white/60 hover:text-white transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </Link>

                    ) : (
                      <button
                        onClick={() => item.subItems && toggleMenu(item.id)}
                        className="flex items-center justify-between w-full p-4 text-left"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                              isItemActive
                                ? `bg-gradient-to-br ${item.gradient} text-white`
                                : 'bg-white/10 text-white/80 group-hover:bg-white/20'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <span
                            className={`font-semibold transition-colors ${
                              isItemActive ? 'text-white' : 'text-white/80 group-hover:text-white'
                            }`}
                          >
                            {item.label}
                          </span>
                        </div>
                        {item.subItems && (
                          <div className="p-1 text-white/60 hover:text-white transition-colors">
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
                        className={`block px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
                          isActive(subItem.path)
                            ? 'bg-white/20 text-white font-medium shadow-lg'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
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

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20 backdrop-blur-sm">
        <div className="text-center text-white/50 text-xs">
          <p>KTL ISP Billing Management System</p>
          <p>v1.0.0</p>
        </div>
      </div>
    </aside>
  );
};
