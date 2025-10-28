import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { 
  fetchUsersAsync, 
  createUserAsync, 
  updateUserAsync, 
  deleteUserAsync,
  clearError,
  addUserLocal,
  updateUserLocal,
  deleteUserLocal
} from '../store/userSlice';
import type { CreateUserData, UpdateUserData } from '../types/user.types';
import type { PaginationParams } from '../types/api.types';

export const useUsers = () => {
  const dispatch = useAppDispatch();
  
  const { 
    users, 
    currentUser, 
    totalUsers, 
    loading, 
    error, 
    pagination,
    mockMode,
  } = useAppSelector((state) => state.user);
  
 const fetchUsers = useCallback((params: PaginationParams = { page: 1, limit: 10 }) => {
    return dispatch(fetchUsersAsync(params));
  }, [dispatch]);

  const createUser = useCallback(async (userData: CreateUserData) => {
    try {
      await dispatch(createUserAsync(userData)).unwrap();
      return { success: true };
    } catch (error: any) {
      if (mockMode) {
        // Create a local user object in demo mode
        const now = new Date().toISOString();
        const newUser = {
          id: `user-${Date.now()}`,
          login_id: userData.login_id,
          email: userData.email,
          name: userData.name,
          mobile: userData.mobile || '',
          user_type: userData.user_type,
          employee_id: userData.employee_id,
          designation: userData.designation,
          department: userData.department,
          salary: userData.salary,
          date_of_joining: userData.date_of_joining,
          date_of_birth: userData.date_of_birth,
          address: userData.address,
          contact_person_name: userData.contact_person_name,
          contact_person_phone: userData.contact_person_phone,
          district: userData.district,
          thana: userData.thana,
          postal_code: userData.postal_code,
          remarks: userData.remarks,
          is_active: true,
          is_staff: false,
          is_email_verified: false,
          is_phone_verified: false,
          profile_photo: undefined,
          language_preference: 'en',
          timezone: 'Asia/Dhaka',
          roles: [],
          permissions: '',
          date_joined: now,
          created_at: now,
          updated_at: now,
        } as any; // conforms to User
        dispatch(addUserLocal(newUser));
        return { success: true };
      }
      return { success: false, error: error as string };
    }
  }, [dispatch, mockMode]);

  const updateUser = useCallback(async (userData: UpdateUserData) => {
    try {
      await dispatch(updateUserAsync(userData)).unwrap();
      return { success: true };
    } catch (error: any) {
      if (mockMode) {
        const existing = users.find(u => u.id === (userData as any).id);
        if (existing) {
          const updated = { ...existing, ...userData, updated_at: new Date().toISOString() } as any;
          dispatch(updateUserLocal(updated));
          return { success: true };
        }
      }
      return { success: false, error: error as string };
    }
  }, [dispatch, mockMode, users]);

  const deleteUser = useCallback(async (userId: string) => {
    try {
      await dispatch(deleteUserAsync(userId)).unwrap();
      return { success: true };
    } catch (error: any) {
      if (mockMode) {
        dispatch(deleteUserLocal(userId));
        return { success: true };
      }
      return { success: false, error: error as string };
    }
  }, [dispatch, mockMode]);

  const clearUserError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Auto-fetch users on mount
  useEffect(() => {
    if (users.length === 0 && !loading) {
      fetchUsers();
    }
  }, [fetchUsers, users.length, loading]);

  return {
    users,
    currentUser,
    totalUsers,
    loading,
    error,
    pagination,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    clearError: clearUserError,
  };
};
