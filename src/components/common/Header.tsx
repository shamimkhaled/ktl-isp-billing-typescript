import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Bell, 
  Search, 
  Settings, 
  LogOut, 
  User,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { capitalizeFirst } from '../../utils/helpers';

export const Header: React.FC = () => {
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
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Logo and Search */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white">KTL ISP</h1>
              <p className="text-xs text-white/70">Billing Management System</p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right Section - Notifications and User Menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl hover:bg-white/20 transition-all duration-300"
            >
              <Bell className="w-5 h-5 text-white" />
              {mockNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                  {mockNotifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && createPortal(
              <div className="fixed inset-0 z-[9999] flex items-start justify-end pt-20 pr-6">
                <div className="w-80 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Notifications</h3>
                    <span className="text-xs text-white/60 bg-blue-500/30 px-2 py-1 rounded-full">
                      {mockNotifications.length} new
                    </span>
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {mockNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-3 bg-white/10 rounded-xl cursor-pointer hover:bg-white/20 transition-colors"
                      >
                        <h4 className="text-sm font-medium text-white">{notification.title}</h4>
                        <p className="text-xs text-white/70 mt-1">{notification.message}</p>
                        <p className="text-xs text-white/50 mt-2">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/20">
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
              className="flex items-center space-x-3 backdrop-blur-md bg-white/10 border border-white/20 px-4 py-3 rounded-2xl shadow-xl hover:bg-white/20 transition-all duration-300"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-white font-semibold block text-sm">
                  {user?.name || user?.login_id || 'User'}
                </span>
                <p className="text-xs text-white/60">
                  {user?.user_type ? capitalizeFirst(user.user_type) : 'User'}
                  {user?.employee_id && ` • ${user.employee_id}`}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-white/60" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && createPortal(
              <div className="fixed inset-0 z-[9999] flex items-start justify-end pt-20 pr-6">
                <div className="w-64 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-4">
                  <div className="space-y-2">
                    <div className="px-3 py-2 border-b border-white/20 mb-3">
                      <p className="text-white font-medium">{user?.name || user?.login_id}</p>
                      <p className="text-xs text-white/60">{user?.email || 'No email'}</p>
                    </div>
                    
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-white/10 rounded-xl transition-colors text-white">
                      <User className="w-4 h-4 text-white/70" />
                      <span className="text-sm">Profile</span>
                    </button>
                    
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
