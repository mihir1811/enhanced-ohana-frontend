import apiService, { ApiResponse } from './api';

export interface CertificateCompany {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface CertificateCompanyResponse {
  data: CertificateCompany[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

class CertificateCompanyService {
  async getCertificateCompanies(params?: {
    page?: number;
    limit?: number;
  }, token?: string): Promise<ApiResponse<CertificateCompanyResponse>> {
    const queryParams = {
      page: params?.page || 1,
      limit: params?.limit || 10,
    };
    return apiService.get('/certificate-company', queryParams, token);
  }

  // Convert API response to dropdown format
  formatForDropdown(companies: CertificateCompany[]) {
    return companies.map(company => ({
      value: company.id.toString(),
      label: company.name
    }));
  }
}

export const certificateCompanyService = new CertificateCompanyService();
export default certificateCompanyService;