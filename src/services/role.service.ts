import { apiService } from './api';
import type {
  Role,
  RoleListResponse,
  UserRoleListResponse
} from '../types/user.types';

export class RoleService {
  async getRoles(params?: { search?: string; ordering?: string; page?: number }): Promise<RoleListResponse> {
    return apiService.get<RoleListResponse>('/roles/', params);
  }

  async getRole(id: string): Promise<Role> {
    return apiService.get<Role>(`/roles/${id}/`);
  }

  async createRole(roleData: Omit<Role, 'id' | 'created_at' | 'updated_at' | 'users_count'>): Promise<Role> {
    return apiService.post<Role>('/roles/', roleData);
  }

  async updateRole(id: string, roleData: Partial<Omit<Role, 'id' | 'created_at' | 'updated_at' | 'users_count'>>): Promise<Role> {
    return apiService.put<Role>(`/roles/${id}/`, roleData);
  }

  async partialUpdateRole(id: string, roleData: Partial<Omit<Role, 'id' | 'created_at' | 'updated_at' | 'users_count'>>): Promise<Role> {
    return apiService.patch<Role>(`/roles/${id}/`, roleData);
  }

  async deleteRole(id: string): Promise<void> {
    await apiService.delete(`/roles/${id}/`);
  }

  async assignRole(data: { user_id: string; role_id: string; expires_at?: string }): Promise<{ message: string }> {
    return apiService.post('/roles/assign/', data);
  }

  async bulkAssignRoles(data: { assignments: Array<{ user_id: string; role_id: string; expires_at?: string }> }): Promise<{ message: string }> {
    return apiService.post('/roles/bulk-assign/', data);
  }

  async getUserRoles(params?: { user?: string; role?: string; search?: string; ordering?: string; page?: number }): Promise<UserRoleListResponse> {
    return apiService.get<UserRoleListResponse>('/user-roles/', params);
  }
}

export const roleService = new RoleService();