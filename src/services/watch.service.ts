
import { API_CONFIG, buildApiUrl } from '../lib/constants';
import { getCookie } from '../lib/cookie-utils';

export enum MovementType {
  AUTOMATIC = 'AUTOMATIC',
  MANUAL = 'MANUAL',
  QUARTZ = 'QUARTZ',
  SOLAR = 'SOLAR',
  KINETIC = 'KINETIC',
  SPRING_DRIVE = 'SPRING_DRIVE',
  SMART = 'SMART',
  HYBRID = 'HYBRID',
  OTHER = 'OTHER'
}

export enum DisplayType {
  ANALOG = 'ANALOG',
  DIGITAL = 'DIGITAL',
  HYBRID = 'HYBRID'
}

export enum Gender {
  kids = 'kids',
  women = 'women',
  men = 'men',
  unisex = 'unisex'
}

export interface CreateWatchRequest {
  stockNumber: string;
  brand: string;
  model: string;
  referenceNumber?: string;
  dialColor: string;
  caseShape: string;
  caseSize: number;
  caseMaterial: string;
  caseBack?: string;
  crownType?: string;
  strapMaterial?: string;
  strapColor?: string;
  claspType?: string;
  claspMaterial?: string;
  movementType: MovementType;
  movementDetails?: string;
  calibre?: string;
  powerReserve?: number;
  waterResistance?: string;
  glass: string;
  complications?: string;
  features?: string;
  stonesOnDial?: number;
  bezelType?: string;
  bezelMaterial?: string;
  display: DisplayType;
  gender: Gender;
  collection?: string;
  certification?: string;
  modelYear?: number;
  wristSizeFit?: number;
  lugWidth?: number;
  condition: string;
  price: number;
  availabilityStatus?: boolean;
  warrantyCardIncluded: boolean;
  boxIncluded: boolean;
  papersIncluded: boolean;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image6?: string;
  videoURL?: string;
  description?: string;
}

export interface WatchProduct extends CreateWatchRequest {
  id: number;
  sellerId?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

class WatchService {
  private getHeaders(token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async createWatch(data: CreateWatchRequest | FormData) {
    try {
      const token = getCookie('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      // Do not set Content-Type for FormData, browser sets it with boundary
      if (!(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
        headers['Accept'] = 'application/json';
      }

      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.WATCH.BASE), {
        method: 'POST',
        headers: headers,
        body: data instanceof FormData ? data : JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create watch product');
      }

      return result;
    } catch (error) {
      console.error('Error creating watch product:', error);
      throw error;
    }
  }

  async getWatches(params?: any) {
    try {
      const token = getCookie('token');
      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
      }

      const response = await fetch(
        `${buildApiUrl(API_CONFIG.ENDPOINTS.WATCH.ALL)}?${queryParams.toString()}`,
        {
          headers: this.getHeaders(token),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch watches');
      }

      return result;
    } catch (error) {
      console.error('Error fetching watches:', error);
      throw error;
    }
  }

  async getWatchById(id: number) {
    try {
      const token = getCookie('token');
      const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.WATCH.BASE}/${id}`), {
        headers: this.getHeaders(token),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch watch');
      }

      return result;
    } catch (error) {
      console.error('Error fetching watch:', error);
      throw error;
    }
  }

  async updateWatch(id: number, data: Partial<CreateWatchRequest> | FormData) {
    try {
      const token = getCookie('token');
      if (!token) throw new Error('No authentication token found');

      const headers: Record<string, string> = {};
      headers['Authorization'] = `Bearer ${token}`;
      if (!(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
        headers['Accept'] = 'application/json';
      }

      const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.WATCH.BASE}/${id}`), {
        method: 'PATCH',
        headers,
        body: data instanceof FormData ? data : JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update watch');
      }

      return result;
    } catch (error) {
      console.error('Error updating watch:', error);
      throw error;
    }
  }

  async deleteWatch(id: number) {
    try {
      const token = getCookie('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.WATCH.BASE}/${id}`), {
        method: 'DELETE',
        headers: this.getHeaders(token),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete watch');
      }

      return result;
    } catch (error) {
      console.error('Error deleting watch:', error);
      throw error;
    }
  }
}

export const watchService = new WatchService();
