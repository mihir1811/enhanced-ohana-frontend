import api from './api';

export const jewelryService = {
  getJewelriesBySeller: async <T = any>({ sellerId, page = 1, limit = 10, search = '', sort = '-createdAt' }: { sellerId: string, page?: number, limit?: number, search?: string, sort?: string }) => {
    // Compose query string with sellerId and other params
    const params = new URLSearchParams({
      sellerId,
      page: String(page),
      limit: String(limit),
      sort: sort || '-createdAt',
    });
    if (search) {
      params.append('search', search);
      params.append('searchBy', 'name');
      params.append('searchBy', 'skuCode');
      params.append('searchBy', 'attributes.style');
      params.append('searchBy', 'stones.type');
    }
    return api.get<T>(`/jewellery?${params.toString()}`);
  },
  addJewelry: async (formData: FormData, token: string) => {
    return api.upload('/jewellery', formData, token);
  },
  getJewelryById: async <T = any>(id: string) => {
    return api.get<T>(`/jewellery/${id}`);
  },
  updateJewelry: async (id: string, formData: FormData, token: string) => {
    // Send FormData for PATCH (file upload)
    return api.uploadPatch(`/jewellery/${id}`, formData, token);
  },
  deleteJewelry: async (id: string, token: string) => {
    // Send DELETE request for jewelry
    return api.delete(`/jewellery/${id}`, token);
  },
};
