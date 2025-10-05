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
  async listChats(token?: string): Promise<ApiResponse<ChatSummary[]>> {
    return apiService.get<ChatSummary[]>(`${BASE}`, undefined, token)
  },

  async getMessages(chatId: string, token?: string): Promise<ApiResponse<ChatMessageDto[]>> {
    return apiService.get<ChatMessageDto[]>(`${BASE}/${chatId}/messages`, undefined, token)
  },

  async markAsRead(chatId: string, token?: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.post(`${BASE}/${chatId}/read`, {}, token)
  },

  async deleteChat(chatId: string, token?: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.delete(`${BASE}/${chatId}`, token)
  },
}

export default chatService