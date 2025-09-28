import { apiService } from './api';

export class DashboardService {
  async getStats(): Promise<any> {
    return apiService.get('/dashboard/stats/');
  }

}

export const dashboardService = new DashboardService();