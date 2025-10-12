import { apiService } from './api';
import type {
  Department,
  DepartmentListResponse
} from '../types/user.types';

export class DepartmentService {
  async getDepartments(params?: { search?: string; ordering?: string; page?: number }): Promise<DepartmentListResponse> {
    return apiService.get<DepartmentListResponse>('/departments/', params);
  }

  async getDepartment(id: string): Promise<Department> {
    return apiService.get<Department>(`/departments/${id}/`);
  }

  async createDepartment(departmentData: Omit<Department, 'id' | 'created_at' | 'updated_at'>): Promise<Department> {
    return apiService.post<Department>('/departments/', departmentData);
  }

  async updateDepartment(id: string, departmentData: Partial<Omit<Department, 'id' | 'created_at' | 'updated_at'>>): Promise<Department> {
    return apiService.put<Department>(`/departments/${id}/`, departmentData);
  }

  async partialUpdateDepartment(id: string, departmentData: Partial<Omit<Department, 'id' | 'created_at' | 'updated_at'>>): Promise<Department> {
    return apiService.patch<Department>(`/departments/${id}/`, departmentData);
  }

  async deleteDepartment(id: string): Promise<void> {
    await apiService.delete(`/departments/${id}/`);
  }
}

export const departmentService = new DepartmentService();