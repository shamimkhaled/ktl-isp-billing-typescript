
// src/types/api.types.ts
export interface ApiResponse<T = any> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: Record<string, any>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  ordering?: string;
}

