import { apiService } from './api';
import type {
  Thana,
  DistrictListResponse,
  ThanaListResponse
} from '../types/user.types';

export class LocationService {
  async getDistricts(params?: { search?: string; ordering?: string; page?: number }): Promise<DistrictListResponse> {
    return apiService.get<DistrictListResponse>('/locations/districts/', params);
  }

  async getThanas(params?: { search?: string; ordering?: string; district?: string; page?: number }): Promise<ThanaListResponse> {
    return apiService.get<ThanaListResponse>('/locations/thanas/', params);
  }

  async getThanasByDistrict(districtId: string): Promise<Thana[]> {
    const response = await apiService.get<{ thanas: Thana[] }>(`/locations/districts/${districtId}/thanas/`);
    return response.thanas;
  }

  async getLocationSummary(): Promise<{ districts_count: number; thanas_count: number }> {
    return apiService.get<{ districts_count: number; thanas_count: number }>('/locations/summary/');
  }
}

export const locationService = new LocationService();