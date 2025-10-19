import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  Bell,
  Search,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Menu,
  Sun,
  Moon
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/authSlice';
import { toggleTheme } from '../../store/themeSlice';
import { capitalizeFirst } from '../../utils/helpers';
import ktlLogo from '../../assets/logo/ktl-logo.png';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const themeMode = useAppSelector((state) => state.theme.mode);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // ✅ Safe outside-click handler that supports portals
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Notifications dropdown close
      if (notificationRef.current && !notificationRef.current.contains(target)) {
        setShowNotifications(false);
      }

      // User menu dropdown close (check both ref + portal)
      const userMenuPortal = document.querySelector('#user-menu-portal');
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(target) &&
        userMenuPortal &&
        !userMenuPortal.contains(target)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    try {
      setShowUserMenu(false);
      navigate('/login', { replace: true });

      setTimeout(() => {
        dispatch(logout());
      }, 50);
    } catch (error) {
      window.location.href = '/login';
    }
  };

  const mockNotifications = [
    { id: 1, title: 'New user registration', message: 'John Doe has registered', time: '5 min ago' },
    { id: 2, title: 'Payment received', message: 'Payment of ৳1,500 received', time: '10 min ago' },
    { id: 3, title: 'System alert', message: 'High CPU usage detected', time: '15 min ago' },
  ];

  return (
    <header
      className={
        `fixed top-0 left-0 right-0 z-50 backdrop-blur-xl shadow-2xl ` +
        (themeMode === 'dark'
          ? 'bg-white/10 border-b border-white/20 text-white'
          : 'bg-white border-b border-gray-200 text-gray-900')
      }
    >
      <div className="flex items-center justify-between px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6 flex-1 min-w-0">
          {/* Sidebar Toggle */}
          <button
            onClick={onToggleSidebar}
            className={
              `lg:hidden p-2 sm:p-3 backdrop-blur-md rounded-xl shadow-xl transition-all duration-300 flex-shrink-0 ` +
              (themeMode === 'dark'
                ? 'bg-white/10 border border-white/20 hover:bg-white/20'
                : 'bg-gray-100 border border-gray-200 hover:bg-gray-200')
            }
          >
            <Menu className={`w-4 h-4 sm:w-5 sm:h-5 ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`} />
          </button>

          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <img
              src={ktlLogo}
              alt="KTL ISP Logo"
              className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-contain rounded-lg sm:rounded-xl shadow-lg"
              loading="eager"
              decoding="async"
              width="64"
              height="64"
            />
            <div className="hidden sm:block min-w-0">
              <h1 className={`text-lg sm:text-xl font-bold truncate ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                KTL ISP
              </h1>
              <p className={`text-xs truncate ${themeMode === 'dark' ? 'text-white/70' : 'text-gray-500'}` }>
                Billing Management System
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:block flex-1 max-w-xs xl:max-w-sm">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${themeMode === 'dark' ? 'text-white/50' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={
                  `w-full pl-10 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all text-sm ` +
                  (themeMode === 'dark'
                    ? 'bg-white/10 border border-white/20 text-white placeholder-white/50'
                    : 'bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-400')
                }
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 flex-shrink-0">
          {/* Theme Toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle theme"
            title={themeMode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className={
              `p-2 sm:p-3 backdrop-blur-md rounded-xl shadow-xl transition-all duration-300 ` +
              (themeMode === 'dark'
                ? 'bg-white/10 border border-white/20 hover:bg-white/20'
                : 'bg-gray-100 border border-gray-200 hover:bg-gray-200')
            }
          >
            {themeMode === 'dark' ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
            )}
          </button>
          {/* Mobile Search */}
          <button
            className={
              `lg:hidden p-2 sm:p-3 backdrop-blur-md rounded-xl shadow-xl transition-all duration-300 ` +
              (themeMode === 'dark'
                ? 'bg-white/10 border border-white/20 hover:bg-white/20'
                : 'bg-gray-100 border border-gray-200 hover:bg-gray-200')
            }
          >
            <Search className={`w-4 h-4 ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`} />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={
                `relative p-2 sm:p-3 backdrop-blur-md rounded-xl shadow-xl transition-all duration-300 ` +
                (themeMode === 'dark'
                  ? 'bg-white/10 border border-white/20 hover:bg-white/20'
                  : 'bg-gray-100 border border-gray-200 hover:bg-gray-200')
              }
            >
              <Bell className={`w-4 h-4 sm:w-5 sm:h-5 ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`} />
              {mockNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                  {mockNotifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications &&
              createPortal(
                <div
                  className="fixed inset-0 z-[9999] flex items-start justify-end pt-16 sm:pt-20 pr-2 sm:pr-4 lg:pr-6"
                  onClick={() => setShowNotifications(false)}
                >
                  <div
                    className={
                      `w-full sm:w-80 max-w-sm backdrop-blur-xl shadow-2xl p-3 sm:p-4 mx-2 sm:mx-0 ` +
                      (themeMode === 'dark'
                        ? 'bg-white/10 border border-white/20'
                        : 'bg-white border border-gray-200')
                    }
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h3 className={`text-base sm:text-lg font-semibold ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                      <span className={`text-xs bg-blue-500/30 px-2 py-1 rounded-full ${themeMode === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>
                        {mockNotifications.length} new
                      </span>
                    </div>
                    <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
                      {mockNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={
                            `p-2 sm:p-3 rounded-lg sm:rounded-xl cursor-pointer transition-colors ` +
                            (themeMode === 'dark'
                              ? 'bg-white/10 hover:bg-white/20'
                              : 'bg-gray-100 hover:bg-gray-200')
                          }
                        >
                          <h4 className={`text-sm font-medium ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{notification.title}</h4>
                          <p className={`text-xs mt-1 ${themeMode === 'dark' ? 'text-white/70' : 'text-gray-700'}`}>{notification.message}</p>
                          <p className={`text-xs mt-2 ${themeMode === 'dark' ? 'text-white/50' : 'text-gray-400'}`}>{notification.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className={`mt-3 sm:mt-4 pt-3 ${themeMode === 'dark' ? 'border-t border-white/20' : 'border-t border-gray-200'}`}>
                      <button className={`w-full text-center text-sm transition-colors ${themeMode === 'dark' ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-500'}`}>
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
              className={
                `flex items-center space-x-2 sm:space-x-3 backdrop-blur-md px-2 sm:px-3 lg:px-4 py-2 sm:py-3 rounded-xl shadow-xl transition-all duration-300 ` +
                (themeMode === 'dark'
                  ? 'bg-white/10 border border-white/20 hover:bg-white/20'
                  : 'bg-gray-100 border border-gray-200 hover:bg-gray-200')
              }
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <User className={`w-3 h-3 sm:w-4 h-4 ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`} />
              </div>
              <div className="text-left hidden md:block min-w-0">
                <span className={`font-semibold block text-xs sm:text-sm truncate max-w-20 lg:max-w-32 ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {user?.name || user?.login_id || 'User'}
                </span>
                <p className={`text-xs truncate max-w-20 lg:max-w-32 ${themeMode === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>
                  {user?.user_type ? capitalizeFirst(user.user_type) : 'User'}
                  {user?.employee_id && ` • ${user.employee_id}`}
                </p>
              </div>
              <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 ${themeMode === 'dark' ? 'text-white/60' : 'text-gray-500'}`} />
            </button>

            {/* ✅ User Dropdown with portal ID */}
            {showUserMenu &&
              createPortal(
                <div
                  id="user-menu-portal"
                  className="fixed inset-0 z-[9999] flex items-start justify-end pt-16 sm:pt-20 pr-2 sm:pr-4 lg:pr-6"
                  onClick={() => setShowUserMenu(false)}
                >
                  <div
                    className={
                      `w-full sm:w-64 max-w-sm backdrop-blur-xl shadow-2xl p-3 sm:p-4 mx-2 sm:mx-0 ` +
                      (themeMode === 'dark'
                        ? 'bg-white/10 border border-white/20'
                        : 'bg-white border border-gray-200')
                    }
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-2">
                      <div className={`px-3 py-2 mb-3 ${themeMode === 'dark' ? 'border-b border-white/20' : 'border-b border-gray-200'}`}>
                        <p className={`font-medium text-sm sm:text-base truncate ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user?.name || user?.login_id}</p>
                        <p className={`text-xs truncate ${themeMode === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>{user?.email || 'No email'}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-xl transition-colors ` +
                          (themeMode === 'dark'
                            ? 'hover:bg-white/10 text-white'
                            : 'hover:bg-gray-100 text-gray-900')
                        }
                      >
                        <User className="w-4 h-4 text-white/70" />
                        <span className="text-sm">Profile</span>
                      </Link>

                      <button className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-xl transition-colors ` +
                        (themeMode === 'dark'
                          ? 'hover:bg-white/10 text-white'
                          : 'hover:bg-gray-100 text-gray-900')
                      }>
                        <Settings className={`w-4 h-4 ${themeMode === 'dark' ? 'text-white/70' : 'text-gray-500'}`} />
                        <span className="text-sm">Settings</span>
                      </button>

                      <div className="border-t border-white/20 pt-2 mt-2">
                        <button
                          onClick={handleLogout}
                          className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-xl transition-colors ` +
                            (themeMode === 'dark'
                              ? 'hover:bg-red-500/20 text-red-300'
                              : 'hover:bg-red-100 text-red-600')
                          }
                        >
                          <LogOut className={`w-4 h-4 ${themeMode === 'dark' ? '' : 'text-red-600'}`} />
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
