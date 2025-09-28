
export interface DashboardMetrics {
  activeUsers: {
    value: number;
    change: number;
  };
  zones: {
    value: number;
    change: number;
  };
  sdtTerminals: {
    value: number;
    change: number;
  };
  revenue: {
    value: string;
    change: number;
  };
}

export interface ZoneData {
  id: number;
  name: string;
  customers: number;
  online: number;
  revenue: number;
  performance: number;
  trend: 'up' | 'down';
}

export interface InterfaceDistribution {
  interface: string;
  users: number;
  percentage: number;
  gradient: string;
}