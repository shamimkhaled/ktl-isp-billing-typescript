import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../services/user.service';
import type { User, UserCreate, UserUpdate } from '../types/user.types';
import type { PaginationParams } from '../types/api.types';

interface UserState {
  users: User[];
  currentUser: User | null;
  totalUsers: number;
  loading: boolean;
  error: string | null;
  mockMode: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  totalUsers: 0,
  loading: false,
  error: null,
  mockMode: false,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  },
};

// Helper: generate mock users for demo mode
const generateMockUsers = (): User[] => {
  const now = new Date().toISOString();
  return [
    {
      id: 'user-admin-001',
      login_id: 'admin001',
      email: 'admin@example.com',
      name: 'Admin User',
      mobile: '01700000001',
      user_type: 'admin',
      employee_id: 'EMP-001',
      designation: 'Administrator',
      department: 'IT',
      salary: '100000.00',
      date_of_joining: '2023-01-01',
      date_of_birth: '1990-01-01',
      address: '123 Admin Street',
      contact_person_name: 'Support',
      contact_person_phone: '01700000002',
      district: 'Dhaka',
      thana: 'Tejgaon',
      postal_code: '1215',
      remarks: 'Demo admin user',
      is_active: true,
      is_staff: true,
      is_email_verified: true,
      is_phone_verified: true,
      profile_photo: undefined,
      language_preference: 'en',
      timezone: 'Asia/Dhaka',
      roles: [],
      permissions: '',
      last_login: now,
      date_joined: now,
      created_at: now,
      updated_at: now,
    },
    {
      id: 'user-staff-001',
      login_id: 'staff001',
      email: 'staff@example.com',
      name: 'Field Staff',
      mobile: '01700000003',
      user_type: 'field_staff',
      employee_id: 'EMP-010',
      designation: 'Technician',
      department: 'Operations',
      salary: '35000.00',
      date_of_joining: '2024-06-15',
      address: '456 Service Road',
      district: 'Chattogram',
      thana: 'Pahartali',
      postal_code: '4207',
      is_active: true,
      is_staff: false,
      is_email_verified: false,
      is_phone_verified: true,
      language_preference: 'en',
      timezone: 'Asia/Dhaka',
      roles: [],
      permissions: '',
      date_joined: now,
      created_at: now,
      updated_at: now,
    },
  ];
};

// Async thunks
export const fetchUsersAsync = createAsyncThunk(
  'users/fetchUsers',
  async (params: PaginationParams = {}, { rejectWithValue }) => {
    try {
      const response = await userService.getUsers(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch users');
    }
  }
);

export const createUserAsync = createAsyncThunk(
  'users/createUser',
  async (userData: UserCreate, { rejectWithValue }) => {
    try {
      const response = await userService.createUser(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create user');
    }
  }
);

export const updateUserAsync = createAsyncThunk(
  'users/updateUser',
  async ({ id, ...userData }: UserUpdate & { id: string }, { rejectWithValue }) => {
    try {
      const response = await userService.updateUser(id, userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update user');
    }
  }
);

export const deleteUserAsync = createAsyncThunk(
  'users/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      await userService.deleteUser(userId);
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete user');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setMockMode: (state, action) => {
      state.mockMode = action.payload as boolean;
    },
    setUsersLocal: (state, action) => {
      state.users = action.payload as User[];
      state.totalUsers = state.users.length;
    },
    addUserLocal: (state, action) => {
      state.users.unshift(action.payload as User);
      state.totalUsers += 1;
    },
    updateUserLocal: (state, action) => {
      const updated = action.payload as User;
      const idx = state.users.findIndex(u => u.id === updated.id);
      if (idx !== -1) state.users[idx] = updated;
    },
    deleteUserLocal: (state, action) => {
      const id = action.payload as string;
      state.users = state.users.filter(u => u.id !== id);
      state.totalUsers = Math.max(0, state.totalUsers - 1);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.results;
        state.totalUsers = action.payload.count;

        // Calculate pagination info
        const limit = 10; // Default limit
        state.pagination = {
          currentPage: Math.floor(state.users.length / limit) + 1,
          totalPages: Math.ceil(state.totalUsers / limit),
          hasNext: !!action.payload.next,
          hasPrevious: !!action.payload.previous,
        };
      })
      .addCase(fetchUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Enter mock/demo mode with sample users
        state.mockMode = true;
        state.users = generateMockUsers();
        state.totalUsers = state.users.length;
        state.pagination = {
          currentPage: 1,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        };
      })
      
      // Create user
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.users.unshift(action.payload);
        state.totalUsers += 1;
      })
      
      // Update user
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      
      // Delete user
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
        state.totalUsers -= 1;
      });
  },
});

export const { clearError, setCurrentUser, setMockMode, setUsersLocal, addUserLocal, updateUserLocal, deleteUserLocal } = userSlice.actions;
export default userSlice.reducer;