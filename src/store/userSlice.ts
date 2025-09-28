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
  pagination: {
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  },
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

export const { clearError, setCurrentUser } = userSlice.actions;
export default userSlice.reducer;