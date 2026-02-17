import api from './api';

export interface AuctionData {
  productId: string;
  productType: 'diamond' | 'gemstone' | 'jewellery' | 'meleeDiamond';
  startTime: string;
  endTime: string;
  [key: string]: unknown;
}

export interface BidData {
  auctionId: number;
  amount: number;
  [key: string]: unknown;
}

export interface AuctionFilter {
  productType?: string;
  status?: 'active' | 'ended' | 'upcoming';
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
}

export const auctionService = {
  // Create a new auction
  createAuction: async (auctionData: AuctionData, token: string) => {
    return api.post('/auction/create', auctionData, token);
  },

  // Get auctions by seller
  getAuctionsBySeller: async <T = unknown>({ sellerId, page = 1, limit = 10, search = '', sort = '-createdAt', status }: { 
    sellerId: string, 
    page?: number, 
    limit?: number, 
    search?: string, 
    sort?: string,
    status?: 'active' | 'ended' | 'upcoming'
  }) => {
    const params = new URLSearchParams({
      sellerId,
      page: String(page),
      limit: String(limit),
      sort: sort || '-createdAt',
    });
    
    if (search) {
      params.append('search', search);
    }
    
    if (status) {
      params.append('status', status);
    }
    
    return api.get<T>(`/auction/seller?${params.toString()}`);
  },

  // Get all auctions with filters
  getAllAuctions: async <T = unknown>(filters: AuctionFilter = {}) => {
    const { page = 1, limit = 10, search = '', sort = '-createdAt', productType, status } = filters;
    
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sort,
    });
    
    if (search) {
      params.append('search', search);
    }
    
    if (productType) {
      params.append('productType', productType);
    }
    
    if (status) {
      params.append('status', status);
    }
    
    return api.get<T>(`/auction?${params.toString()}`);
  },

  // Get auction by ID
  getAuctionById: async <T = unknown>(id: string) => {
    return api.get<T>(`/auction/${id}`);
  },

  // Update auction
  updateAuction: async (id: string, auctionData: Partial<AuctionData>, token: string) => {
    return api.patch(`/auction/${id}`, auctionData, token);
  },

  // End auction early
  endAuction: async (id: string, token: string) => {
    return api.post(`/auction/end/${id}`, {}, token);
  },

  // Select auction winner
  selectWinner: async (auctionId: string, bidderId: string, token: string) => {
    return api.post('/auction/select-winner', { auctionId, bidderId }, token);
  },

  // Delete auction
  deleteAuction: async (id: string, token: string) => {
    return api.delete(`/auction/${id}`, token);
  },

  // Place a bid
  placeBid: async (bidData: BidData, token: string) => {
    return api.post('/auction/bid', bidData, token);
  },

  // Get bids for an auction
  getAuctionBids: async <T = unknown>(auctionId: string, page = 1, limit = 10) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    
    return api.get<T>(`/auction/${auctionId}/bids?${params.toString()}`);
  },

  // Get user's bid history
  getUserBids: async <T = unknown>(userId: string, page = 1, limit = 10) => {
    const params = new URLSearchParams({
      userId,
      page: String(page),
      limit: String(limit),
    });
    
    return api.get<T>(`/auction/bids/user?${params.toString()}`);
  },

  // Get active auctions
  getActiveAuctions: async <T = unknown>(page = 1, limit = 10) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      status: 'active',
    });
    
    return api.get<T>(`/auction?${params.toString()}`);
  },

  // Get live auctions
  getLiveAuctions: async <T = unknown>({ 
    productType, 
    page = 1, 
    limit = 10, 
    sort = '-createdAt' 
  }: {
    productType?: 'diamond' | 'gemstone' | 'jewellery' | 'meleeDiamond';
    page?: number;
    limit?: number;
    sort?: string;
  } = {}) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    
    if (productType) {
      params.append('productType', productType);
    }
    
    if (sort) {
      params.append('sort', sort);
    }
    
    return api.get<T>(`/auction/live?${params.toString()}`);
  },

  // Get ending soon auctions
  getEndingSoonAuctions: async <T = unknown>(hours = 24, page = 1, limit = 10) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      endingWithinHours: String(hours),
    });
    
    return api.get<T>(`/auction/ending-soon?${params.toString()}`);
  },

  // Get auction statistics
  getAuctionStats: async <T = unknown>(sellerId?: string) => {
    const params = new URLSearchParams();
    
    if (sellerId) {
      params.append('sellerId', sellerId);
    }
    
    return api.get<T>(`/auction/stats?${params.toString()}`);
  },

  // Search auctions
  searchAuctions: async <T = unknown>({ 
    query, 
    productType, 
    minPrice, 
    maxPrice, 
    page = 1, 
    limit = 10 
  }: {
    query: string;
    productType?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams({
      search: query,
      page: String(page),
      limit: String(limit),
    });
    
    if (productType) {
      params.append('productType', productType);
    }
    
    if (minPrice !== undefined) {
      params.append('minPrice', String(minPrice));
    }
    
    if (maxPrice !== undefined) {
      params.append('maxPrice', String(maxPrice));
    }
    
    return api.get<T>(`/auction/search?${params.toString()}`);
  },
};
