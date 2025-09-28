import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { 
  fetchUsersAsync, 
  createUserAsync, 
  updateUserAsync, 
  deleteUserAsync,
  clearError 
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
    pagination 
  } = useAppSelector((state) => state.user);
  
 const fetchUsers = useCallback((params: PaginationParams = { page: 1, limit: 10 }) => {
    return dispatch(fetchUsersAsync(params));
  }, [dispatch]);

  const createUser = useCallback(async (userData: CreateUserData) => {
    try {
      await dispatch(createUserAsync(userData)).unwrap();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error as string };
    }
  }, [dispatch]);

  const updateUser = useCallback(async (userData: UpdateUserData) => {
    try {
      await dispatch(updateUserAsync(userData)).unwrap();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error as string };
    }
  }, [dispatch]);

  const deleteUser = useCallback(async (userId: string) => {
    try {
      await dispatch(deleteUserAsync(userId)).unwrap();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error as string };
    }
  }, [dispatch]);

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
