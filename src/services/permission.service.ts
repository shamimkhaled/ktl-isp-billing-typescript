import { apiService } from './api';
import type {
  CustomPermission,
  PermissionCategory,
  Group,
  PermissionListResponse,
  CustomPermissionListResponse,
  PermissionCategoryListResponse,
  GroupListResponse
} from '../types/user.types';

export class PermissionService {
  async getPermissions(params?: { search?: string; page?: number }): Promise<PermissionListResponse> {
    return apiService.get<PermissionListResponse>('/permissions/', params);
  }

  async getCustomPermissions(params?: { search?: string; page?: number }): Promise<CustomPermissionListResponse> {
    return apiService.get<CustomPermissionListResponse>('/custom-permissions/', params);
  }

  async getCustomPermission(id: string): Promise<CustomPermission> {
    return apiService.get<CustomPermission>(`/custom-permissions/${id}/`);
  }

  async createCustomPermission(permissionData: Omit<CustomPermission, 'id' | 'created_at' | 'updated_at'>): Promise<CustomPermission> {
    return apiService.post<CustomPermission>('/custom-permissions/', permissionData);
  }

  async updateCustomPermission(id: string, permissionData: Partial<Omit<CustomPermission, 'id' | 'created_at' | 'updated_at'>>): Promise<CustomPermission> {
    return apiService.put<CustomPermission>(`/custom-permissions/${id}/`, permissionData);
  }

  async partialUpdateCustomPermission(id: string, permissionData: Partial<Omit<CustomPermission, 'id' | 'created_at' | 'updated_at'>>): Promise<CustomPermission> {
    return apiService.patch<CustomPermission>(`/custom-permissions/${id}/`, permissionData);
  }

  async deleteCustomPermission(id: string): Promise<void> {
    await apiService.delete(`/custom-permissions/${id}/`);
  }

  async getPermissionCategories(params?: { page?: number }): Promise<PermissionCategoryListResponse> {
    return apiService.get<PermissionCategoryListResponse>('/permission-categories/', params);
  }

  async getPermissionCategory(id: string): Promise<PermissionCategory> {
    return apiService.get<PermissionCategory>(`/permission-categories/${id}/`);
  }

  async createPermissionCategory(categoryData: Omit<PermissionCategory, 'id' | 'permissions_count' | 'created_at' | 'updated_at'>): Promise<PermissionCategory> {
    return apiService.post<PermissionCategory>('/permission-categories/', categoryData);
  }

  async updatePermissionCategory(id: string, categoryData: Partial<Omit<PermissionCategory, 'id' | 'permissions_count' | 'created_at' | 'updated_at'>>): Promise<PermissionCategory> {
    return apiService.put<PermissionCategory>(`/permission-categories/${id}/`, categoryData);
  }

  async partialUpdatePermissionCategory(id: string, categoryData: Partial<Omit<PermissionCategory, 'id' | 'permissions_count' | 'created_at' | 'updated_at'>>): Promise<PermissionCategory> {
    return apiService.patch<PermissionCategory>(`/permission-categories/${id}/`, categoryData);
  }

  async deletePermissionCategory(id: string): Promise<void> {
    await apiService.delete(`/permission-categories/${id}/`);
  }

  async getGroups(params?: { search?: string; page?: number }): Promise<GroupListResponse> {
    return apiService.get<GroupListResponse>('/groups/', params);
  }

  async getGroup(id: number): Promise<Group> {
    return apiService.get<Group>(`/groups/${id}/`);
  }

  async createGroup(groupData: Omit<Group, 'id' | 'permissions'>): Promise<Group> {
    return apiService.post<Group>('/groups/', groupData);
  }

  async updateGroup(id: number, groupData: Partial<Omit<Group, 'id' | 'permissions'>>): Promise<Group> {
    return apiService.put<Group>(`/groups/${id}/`, groupData);
  }

  async partialUpdateGroup(id: number, groupData: Partial<Omit<Group, 'id' | 'permissions'>>): Promise<Group> {
    return apiService.patch<Group>(`/groups/${id}/`, groupData);
  }

  async deleteGroup(id: number): Promise<void> {
    await apiService.delete(`/groups/${id}/`);
  }
}

export const permissionService = new PermissionService();