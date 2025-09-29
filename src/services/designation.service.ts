import { apiService } from './api';
import type {
  Designation,
  DesignationListResponse
} from '../types/user.types';

export class DesignationService {
  async getDesignations(params?: { search?: string; ordering?: string; page?: number }): Promise<DesignationListResponse> {
    return apiService.get<DesignationListResponse>('/designations/', params);
  }

  async getDesignation(id: string): Promise<Designation> {
    return apiService.get<Designation>(`/designations/${id}/`);
  }

  async createDesignation(designationData: Omit<Designation, 'id' | 'created_at' | 'updated_at'>): Promise<Designation> {
    return apiService.post<Designation>('/designations/', designationData);
  }

  async updateDesignation(id: string, designationData: Partial<Omit<Designation, 'id' | 'created_at' | 'updated_at'>>): Promise<Designation> {
    return apiService.put<Designation>(`/designations/${id}/`, designationData);
  }

  async partialUpdateDesignation(id: string, designationData: Partial<Omit<Designation, 'id' | 'created_at' | 'updated_at'>>): Promise<Designation> {
    return apiService.patch<Designation>(`/designations/${id}/`, designationData);
  }

  async deleteDesignation(id: string): Promise<void> {
    await apiService.delete(`/designations/${id}/`);
  }
}

export const designationService = new DesignationService();