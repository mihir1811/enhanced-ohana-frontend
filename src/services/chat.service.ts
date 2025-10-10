import apiService, { ApiResponse } from './api'

export type ChatSummary = {
  id: string
  participants: Array<{ id: string | number; role?: string; name?: string }>
  lastMessage?: { text: string; timestamp: number }
  unreadCount?: number
}

export type ChatMessageDto = {
  id: string
  chatId: string
  fromUserId: string | number
  toUserId: string | number
  text: string
  timestamp: number
  read?: boolean
}

const BASE = '/chat'

export const chatService = {
  async listChats(params?: { limit?: number; page?: number }, token?: string): Promise<ApiResponse<ChatSummary[]>> {
    const query = {
      ...(params?.limit ? { limit: params!.limit } : {}),
      ...(params?.page ? { page: params!.page } : {}),
    }
    return apiService.get<ChatSummary[]>(`${BASE}`, query, token)
  },

  async createChat(participants: { userId: string | number; sellerId: string | number; productId?: string | number }, token?: string): Promise<ApiResponse<{ id: string; participants: any[] }>> {
    const payload = {
      participants: [
        { id: participants.userId, role: 'user' },
        { id: participants.sellerId, role: 'seller' }
      ],
      ...(participants.productId && { productId: participants.productId }),
      type: 'user-seller'
    }
    return apiService.post(`${BASE}`, payload, token)
  },

  async getOrCreateChat(params: { userId: string | number; sellerId: string | number; productId?: string | number }, token?: string): Promise<ApiResponse<{ id: string; participants: any[]; isNew?: boolean }>> {
    try {
      // First, try to find existing chat
      const existingChats = await this.listChats({ limit: 50, page: 1 }, token)
      if (existingChats?.data) {
        const existingChat = existingChats.data.find((chat: any) => {
          const participants = chat?.participants || []
          const hasUser = participants.some((p: any) => String(p?.id) === String(params.userId))
          const hasSeller = participants.some((p: any) => String(p?.id) === String(params.sellerId) && p?.role?.toLowerCase() === 'seller')
          return hasUser && hasSeller
        })
        
        if (existingChat) {
          return { ...existingChats, data: { ...existingChat, isNew: false } }
        }
      }
      
      // If no existing chat found, create new one
      const newChat = await this.createChat(params, token)
      return { ...newChat, data: { ...newChat.data, isNew: true } }
    } catch (error) {
      console.error('Error in getOrCreateChat:', error)
      throw error
    }
  },

  async getMessages(chatId: string, params?: { limit?: number; page?: number }, token?: string): Promise<ApiResponse<ChatMessageDto[]>> {
    const query = {
      ...(params?.limit ? { limit: params!.limit } : {}),
      ...(params?.page ? { page: params!.page } : {}),
    }
    return apiService.get<ChatMessageDto[]>(`${BASE}/${chatId}/messages`, query, token)
  },

  async markAsRead(chatId: string, token?: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.post(`${BASE}/${chatId}/read`, {}, token)
  },

  async deleteChat(chatId: string, token?: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.delete(`${BASE}/${chatId}`, token)
  },
}

export default chatService