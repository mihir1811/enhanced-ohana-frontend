import apiService, { ApiResponse } from './api'

export type ChatSummary = {
  id: string
  participants: Array<{ id: string | number; role?: string }>
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