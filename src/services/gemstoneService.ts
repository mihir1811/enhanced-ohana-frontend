import api from './api';

export const gemstoneService = {
  getGemstonesBySeller: async <T = any>({ sellerId, page = 1, limit = 10 }: { sellerId: string, page?: number, limit?: number }) => {
    return api.get<T>(`/gem-stone?sellerId=${sellerId}&page=${page}&limit=${limit}`);
  },

  addGemstone: async (formData: FormData, token: string) => {
    // POST /gem-stone with multipart/form-data
    return api.upload('/gem-stone', formData, token);
  },

  getGemstoneById: async <T = any>(id: string) => {
    return api.get<T>(`/gem-stone/${id}`, { headers: { Accept: 'application/json' } });
  },

  updateGemstone: async (id: string, formData: FormData, token: string) => {
    // PATCH /gem-stone/:id with multipart/form-data
    return api.uploadPatch(`/gem-stone/${id}`, formData, token);
  },
  deleteGemstone: async (id: string, token: string) => {
    // DELETE /gem-stone/:id with Accept and Authorization headers
    return api.delete(`/gem-stone/${id}`, token);
  },
};
