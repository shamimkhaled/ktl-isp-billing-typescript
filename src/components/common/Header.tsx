import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  Bell,
  Search,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Menu
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { capitalizeFirst } from '../../utils/helpers';
import ktlLogo from '../../assets/logo/ktl-logo.png';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const mockNotifications = [
    { id: 1, title: 'New user registration', message: 'John Doe has registered', time: '5 min ago' },
    { id: 2, title: 'Payment received', message: 'Payment of ৳1,500 received', time: '10 min ago' },
    { id: 3, title: 'System alert', message: 'High CPU usage detected', time: '15 min ago' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-2xl">
      <div className="flex items-center justify-between px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4">
        {/* Left Section - Menu Button, Logo and Search */}
        <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6 flex-1 min-w-0">
          {/* Mobile Menu Button */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 sm:p-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-xl hover:bg-white/20 transition-all duration-300 flex-shrink-0"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>

          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <img
              src={ktlLogo}
              alt="KTL ISP Logo"
              className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-contain rounded-lg sm:rounded-xl shadow-lg"
            />
            <div className="hidden sm:block min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-white truncate">
                KTL ISP
              </h1>
              <p className="text-xs text-white/70 truncate">
                Billing Management System
              </p>
            </div>
          </div>

          {/* Search Bar - Hidden on very small screens, visible on larger screens */}
          <div className="hidden lg:block flex-1 max-w-xs xl:max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* Right Section - Notifications and User Menu */}
        <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 flex-shrink-0">
          {/* Search Button for Mobile */}
          <button className="lg:hidden p-2 sm:p-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-xl hover:bg-white/20 transition-all duration-300">
            <Search className="w-4 h-4 text-white" />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 sm:p-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-xl hover:bg-white/20 transition-all duration-300"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              {mockNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                  {mockNotifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown - Responsive positioning */}
            {showNotifications && createPortal(
              <div className="fixed inset-0 z-[9999] flex items-start justify-end pt-16 sm:pt-20 pr-2 sm:pr-4 lg:pr-6">
                <div className="w-full sm:w-80 max-w-sm backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 mx-2 sm:mx-0">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-white">Notifications</h3>
                    <span className="text-xs text-white/60 bg-blue-500/30 px-2 py-1 rounded-full">
                      {mockNotifications.length} new
                    </span>
                  </div>
                  <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
                    {mockNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-2 sm:p-3 bg-white/10 rounded-lg sm:rounded-xl cursor-pointer hover:bg-white/20 transition-colors"
                      >
                        <h4 className="text-sm font-medium text-white">{notification.title}</h4>
                        <p className="text-xs text-white/70 mt-1">{notification.message}</p>
                        <p className="text-xs text-white/50 mt-2">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 sm:mt-4 pt-3 border-t border-white/20">
                    <button className="w-full text-center text-sm text-blue-300 hover:text-blue-200 transition-colors">
                      View all notifications
                    </button>
                  </div>
                </div>
              </div>,
              document.body
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 sm:space-x-3 backdrop-blur-md bg-white/10 border border-white/20 px-2 sm:px-3 lg:px-4 py-2 sm:py-3 rounded-xl shadow-xl hover:bg-white/20 transition-all duration-300"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div className="text-left hidden md:block min-w-0">
                <span className="text-white font-semibold block text-xs sm:text-sm truncate max-w-20 lg:max-w-32">
                  {user?.name || user?.login_id || 'User'}
                </span>
                <p className="text-xs text-white/60 truncate max-w-20 lg:max-w-32">
                  {user?.user_type ? capitalizeFirst(user.user_type) : 'User'}
                  {user?.employee_id && ` • ${user.employee_id}`}
                </p>
              </div>
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />
            </button>

            {/* User Dropdown - Responsive positioning */}
            {showUserMenu && createPortal(
              <div className="fixed inset-0 z-[9999] flex items-start justify-end pt-16 sm:pt-20 pr-2 sm:pr-4 lg:pr-6">
                <div className="w-full sm:w-64 max-w-sm backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 mx-2 sm:mx-0">
                  <div className="space-y-2">
                    <div className="px-3 py-2 border-b border-white/20 mb-3">
                      <p className="text-white font-medium text-sm sm:text-base truncate">{user?.name || user?.login_id}</p>
                      <p className="text-xs text-white/60 truncate">{user?.email || 'No email'}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-white/10 rounded-xl transition-colors text-white"
                    >
                      <User className="w-4 h-4 text-white/70" />
                      <span className="text-sm">Profile</span>
                    </Link>

                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-white/10 rounded-xl transition-colors text-white">
                      <Settings className="w-4 h-4 text-white/70" />
                      <span className="text-sm">Settings</span>
                    </button>

                    <div className="border-t border-white/20 pt-2 mt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-red-500/20 rounded-xl transition-colors text-red-300"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>,
              document.body
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
