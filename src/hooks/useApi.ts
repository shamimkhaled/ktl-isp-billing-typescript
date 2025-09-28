import { useState, useCallback } from 'react';
import type { ApiError } from '../types/api.types';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export const useApi = <T = any>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
      return { success: true, data: result };
    } catch (error: any) {
      const apiError: ApiError = {
        message: error.message || 'An unexpected error occurred',
        status: error.status,
        details: error.details,
      };
      setState(prev => ({ ...prev, loading: false, error: apiError }));
      return { success: false, error: apiError };
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};
