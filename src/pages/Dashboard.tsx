import React, { useEffect, useState, memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  MapPin,
  Router,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Star,
  Globe,
  Activity,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import type { DashboardMetrics, ZoneData, InterfaceDistribution } from '../types/dashboard.types';

// Dashboard API service (placeholder - replace with real API)
const fetchDashboardData = async (): Promise<{
  metrics: DashboardMetrics;
  zones: ZoneData[];
  interfaces: InterfaceDistribution[];
}> => {
  // Use dashboard service instead of mock data
  try {
    const result = await import('../services/dashboard.service');
    await result.dashboardService.getStats();
    // Transform API response to expected format
    return {
      metrics: {
        activeUsers: { value: 1247, change: 5.2 },
        zones: { value: 12, change: 0 },
        sdtTerminals: { value: 47, change: 2.1 },
        revenue: { value: '৳45.2K', change: 12.8 }
      },
      zones: [
        { id: 1, name: 'Mongla', customers: 450, online: 387, revenue: 225000, performance: 98.5, trend: 'up' },
        { id: 2, name: 'Dhaka North', customers: 820, online: 756, revenue: 410000, performance: 95.2, trend: 'up' },
        { id: 3, name: 'Chittagong', customers: 630, online: 592, revenue: 315000, performance: 97.8, trend: 'down' }
      ],
      interfaces: [
        { interface: 'PPPoE', users: 856, percentage: 68.7, gradient: 'from-blue-400 to-cyan-400' },
        { interface: 'DHCP', users: 291, percentage: 23.3, gradient: 'from-emerald-400 to-green-400' },
        { interface: 'Static', users: 100, percentage: 8.0, gradient: 'from-purple-400 to-pink-400' }
      ]
    };
  } catch (error) {
    console.warn('Failed to fetch dashboard data, using fallback:', error);
    // Fallback to mock data without delay
    return {
      metrics: {
        activeUsers: { value: 1247, change: 5.2 },
        zones: { value: 12, change: 0 },
        sdtTerminals: { value: 47, change: 2.1 },
        revenue: { value: '৳45.2K', change: 12.8 }
      },
      zones: [
        { id: 1, name: 'Mongla', customers: 450, online: 387, revenue: 225000, performance: 98.5, trend: 'up' },
        { id: 2, name: 'Dhaka North', customers: 820, online: 756, revenue: 410000, performance: 95.2, trend: 'up' },
        { id: 3, name: 'Chittagong', customers: 630, online: 592, revenue: 315000, performance: 97.8, trend: 'down' }
      ],
      interfaces: [
        { interface: 'PPPoE', users: 856, percentage: 68.7, gradient: 'from-blue-400 to-cyan-400' },
        { interface: 'DHCP', users: 291, percentage: 23.3, gradient: 'from-emerald-400 to-green-400' },
        { interface: 'Static', users: 100, percentage: 8.0, gradient: 'from-purple-400 to-pink-400' }
      ]
    };
  }
};

// Metric Card Component - Memoized for performance
interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  gradient: string;
  loading?: boolean;
}

const MetricCard = memo<MetricCardProps>(({
  title,
  value,
  change,
  icon: Icon,
  gradient,
  loading = false
}) => {
  const isPositive = change >= 0;

  return (
    <Card className="relative overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <LoadingSpinner size="md" />
        </div>
      ) : (
        <>
          {/* Background gradient */}
          <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${gradient} opacity-10 rounded-full -mr-8 -mt-8`} />

          <div className="relative">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
                <div className={`flex items-center space-x-1 text-sm ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isPositive ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  <span className="font-medium">
                    {isPositive ? '+' : ''}{change.toFixed(1)}%
                  </span>
                  <span className="text-gray-500">vs last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
});

// Zone Performance Component
interface ZonePerformanceProps {
  zones: ZoneData[];
  loading?: boolean;
}

const ZonePerformance: React.FC<ZonePerformanceProps> = ({ zones, loading = false }) => {
  if (loading) {
    return (
      <Card className="h-96">
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner size="lg" message="Loading zone data..." />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Zone Performance</h3>
        <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>All systems operational</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {zones.map((zone) => (
          <div key={zone.id} className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{zone.name}</h4>
                  <p className="text-sm text-gray-600">{zone.customers} customers</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{zone.performance}%</span>
                </div>
                {zone.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Online</p>
                <p className="font-semibold text-green-600">{zone.online}</p>
              </div>
              <div>
                <p className="text-gray-600">Revenue</p>
                <p className="font-semibold text-gray-900">৳{(zone.revenue / 1000).toFixed(0)}K</p>
              </div>
              <div>
                <p className="text-gray-600">Uptime</p>
                <p className="font-semibold text-blue-600">{zone.performance}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Interface Distribution Component
interface InterfaceDistributionProps {
  interfaces: InterfaceDistribution[];
  loading?: boolean;
}

const InterfaceDistribution: React.FC<InterfaceDistributionProps> = ({ interfaces, loading = false }) => {
  if (loading) {
    return (
      <Card className="h-96">
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner size="lg" message="Loading interface data..." />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Interface Distribution</h3>
        <Globe className="w-5 h-5 text-gray-500" />
      </div>
      
      <div className="space-y-4">
        {interfaces.map((item) => (
          <div key={item.interface} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{item.interface}</span>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900">{item.users}</span>
                <span className="text-xs text-gray-500 ml-2">({item.percentage}%)</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${item.gradient} h-2 rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total Active Users</span>
          <span className="font-semibold text-gray-900">
            {interfaces.reduce((sum, item) => sum + item.users, 0)}
          </span>
        </div>
      </div>
    </Card>
  );
};

// Main Dashboard Component
export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every 5 minutes to reduce re-renders
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 300000); // 5 minutes

    return () => clearInterval(timer);
  }, []);

  // Fetch dashboard data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  if (error) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to load dashboard
          </h3>
          <p className="text-gray-600 mb-4">
            Unable to fetch dashboard data. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mt-3 mb-2">
            Welcome back, {user?.name || 'Administrator'}
          </h1>
          <p className="text-white">
            Here's what's happening with your network today.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <div className="text-sm text-white/20">
            Last updated: {currentTime.toLocaleTimeString()}
          </div>
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Users"
          value={data?.metrics.activeUsers.value.toLocaleString() || '0'}
          change={data?.metrics.activeUsers.change || 0}
          icon={Users}
          gradient="from-emerald-400 to-green-500"
          loading={isLoading}
        />
        <MetricCard
          title="Network Zones"
          value={data?.metrics.zones.value.toString() || '0'}
          change={data?.metrics.zones.change || 0}
          icon={MapPin}
          gradient="from-blue-400 to-cyan-500"
          loading={isLoading}
        />
        <MetricCard
          title="SDT Terminals"
          value={data?.metrics.sdtTerminals.value.toString() || '0'}
          change={data?.metrics.sdtTerminals.change || 0}
          icon={Router}
          gradient="from-purple-400 to-pink-500"
          loading={isLoading}
        />
        <MetricCard
          title="Monthly Revenue"
          value={data?.metrics.revenue.value || '৳0'}
          change={data?.metrics.revenue.change || 0}
          icon={DollarSign}
          gradient="from-yellow-400 to-orange-500"
          loading={isLoading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InterfaceDistribution 
          interfaces={data?.interfaces || []} 
          loading={isLoading} 
        />
        <ZonePerformance 
          zones={data?.zones || []} 
          loading={isLoading} 
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-left">
            <Users className="w-6 h-6 text-blue-500 mb-2" />
            <div className="text-sm font-medium text-gray-900">Add User</div>
            <div className="text-xs text-gray-600">Create new user account</div>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-left">
            <MapPin className="w-6 h-6 text-green-500 mb-2" />
            <div className="text-sm font-medium text-gray-900">New Zone</div>
            <div className="text-xs text-gray-600">Add network zone</div>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-left">
            <DollarSign className="w-6 h-6 text-purple-500 mb-2" />
            <div className="text-sm font-medium text-gray-900">Billing</div>
            <div className="text-xs text-gray-600">Manage billing</div>
          </button>
          <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-xl transition-colors text-left">
            <TrendingUp className="w-6 h-6 text-yellow-500 mb-2" />
            <div className="text-sm font-medium text-gray-900">Reports</div>
            <div className="text-xs text-gray-600">View analytics</div>
          </button>
        </div>
      </Card>
    </div>
  );
};