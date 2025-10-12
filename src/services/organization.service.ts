import { apiService } from './api';
import type { Organization } from '../types/user.types';

export class OrganizationService {
  async getOrganizations(params?: { page?: number; page_size?: number }): Promise<{
    links: { next: string | null; previous: string | null };
    count: number;
    total_pages: number;
    current_page: number;
    page_size: number;
    results: Organization[];
  }> {
    return apiService.get('/organization/', params);
  }

  async getOrganization(id: string): Promise<Organization> {
    return apiService.get(`/organization/${id}/`);
  }

  async createOrganization(orgData: Omit<Organization, 'id' | 'created_at' | 'updated_at'>): Promise<Organization> {
    return apiService.post('/organization/', orgData);
  }

  async updateOrganization(id: string, orgData: Partial<Omit<Organization, 'id' | 'created_at' | 'updated_at'>> | FormData): Promise<Organization> {
    return apiService.patch(`/organization/${id}/`, orgData);
  }

  async partialUpdateOrganization(id: string, orgData: Partial<Omit<Organization, 'id' | 'created_at' | 'updated_at'>>): Promise<Organization> {
    return apiService.patch(`/organization/${id}/`, orgData);
  }

  async deleteOrganization(id: string): Promise<void> {
    await apiService.delete(`/organization/${id}/`);
  }
}

export const organizationService = new OrganizationService();