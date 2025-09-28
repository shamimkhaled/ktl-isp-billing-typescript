import { apiService } from './api';
import type {
  User,
  UserCreate,
  UserUpdate,
  UserListResponse,
} from '../types/user.types';
import type { PaginationParams } from '../types/api.types';


export class UserService {
  async getUsers(params?: PaginationParams): Promise<UserListResponse> {
    return apiService.get<UserListResponse>('/users/', params);
  }

  async getUser(id: string): Promise<User> {
    const response = await apiService.get<User>(`/users/${id}/`);
    return response;
  }

  async createUser(userData: UserCreate): Promise<User> {
    const response = await apiService.post<User>('/users/', userData);
    return response;
  }

  async updateUser(id: string, userData: UserUpdate): Promise<User> {
    const response = await apiService.patch<User>(`/users/${id}/`, userData);
    return response;
  }

  async deleteUser(id: string): Promise<void> {
    await apiService.delete(`/users/${id}/`);
  }

  async changePassword(data: { old_password: string; new_password: string; confirm_password: string }): Promise<{ message: string }> {
    return apiService.post('/users/change-password/', data);
  }

  async getUserPermissions(): Promise<{ permissions: string[] }> {
    const response = await apiService.get<{ permissions: string[] }>('/users/permissions/');
    return response;
  }
}

export const userService = new UserService();