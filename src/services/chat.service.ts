import apiService, { ApiResponse } from './api'
import { API_CONFIG } from '../lib/constants'

export type ChatMessageDto = {
  id: string
  fromId: string
  toId: string
  message: string
  fileUrl?: string | null
  messageType: 'TEXT' | 'FILE'
  createdAt: string
  deletedBySender: boolean
  deletedByReceiver: boolean
  isRead: boolean
  readAt?: string | null
  from: {
    id: string
    name: string
    role: string
  }
  to: {
    id: string
    name: string
    role: string
  }
}

export type ChatConversation = {
  participantId: string
  participantName: string
  participantRole: string
  lastMessage?: ChatMessageDto
  unreadCount: number
  messages: ChatMessageDto[]
}

export const chatService = {
  // Get all messages - backend returns paginated messages between users
  async getAllMessages(params?: { limit?: number; page?: number }, token?: string): Promise<ApiResponse<{ data: ChatMessageDto[], meta?: any }>> {
    const query = {
      ...(params?.limit ? { limit: params!.limit } : {}),
      ...(params?.page ? { page: params!.page } : {}),
    }
    
    console.log('🔄 [ChatService] getAllMessages - Request params:', { query, token: !!token })
    
    const response = await apiService.get<any>(API_CONFIG.ENDPOINTS.CHAT.BASE, query, token)
    
    console.log('📡 [ChatService] getAllMessages - Raw API response:', response)
    
    // Handle different API response structures
    let messagesArray = []
    let metaData = null
    
    if (response?.data?.data?.data) {
      // Structure: { success: true, data: { data: [...], meta: {...} } }
      messagesArray = response.data.data.data
      metaData = response.data.data.meta
      console.log('📋 [ChatService] Using nested data.data.data structure')
    } else if (response?.data?.data) {
      // Structure: { data: [...], meta: {...} }
      messagesArray = response.data.data
      metaData = response.data.meta
      console.log('📋 [ChatService] Using data.data structure')
    } else if (Array.isArray(response?.data)) {
      // Structure: [...]
      messagesArray = response.data
      console.log('📋 [ChatService] Using direct array structure')
    } else {
      console.log('⚠️ [ChatService] No valid data structure found')
      return { ...response, data: { data: [], meta: null } }
    }
    
    if (messagesArray && messagesArray.length > 0) {
      const messages = messagesArray.map((msg: any) => {
        // Safety check for from/to objects
        if (!msg.from || !msg.to) {
          console.warn('⚠️ [ChatService] Message missing from/to data:', msg)
          return null
        }
        
        return {
          id: String(msg.id || ''),
          fromId: String(msg.fromId || ''),
          toId: String(msg.toId || ''),
          message: String(msg.message || ''),
          fileUrl: msg.fileUrl || null,
          messageType: msg.messageType || 'TEXT',
          createdAt: msg.createdAt || new Date().toISOString(),
          deletedBySender: msg.deletedBySender || false,
          deletedByReceiver: msg.deletedByReceiver || false,
          isRead: msg.isRead || false,
          readAt: msg.readAt || null,
          from: {
            id: String(msg.from?.id || ''),
            name: String(msg.from?.name || 'Unknown User'),
            role: String(msg.from?.role || 'user')
          },
          to: {
            id: String(msg.to?.id || ''),
            name: String(msg.to?.name || 'Unknown User'),
            role: String(msg.to?.role || 'user')
          }
        }
      }).filter(Boolean) // Remove null entries
      
      console.log('✅ [ChatService] getAllMessages - Parsed messages:', messages)
      console.log('📊 [ChatService] getAllMessages - Meta data:', metaData)
      
      return {
        ...response,
        data: {
          data: messages,
          meta: metaData
        }
      }
    }
    
    console.log('⚠️ [ChatService] getAllMessages - No messages found, returning empty array')
    return { 
      ...response, 
      data: {
        data: [],
        meta: metaData
      }
    }
  },

  // Group messages into conversations by participants
  async getConversations(params?: { limit?: number; page?: number }, token?: string, currentUserId?: string): Promise<ApiResponse<ChatConversation[]>> {
    console.log('🔄 [ChatService] getConversations - Starting conversation grouping...', { currentUserId })
    
    const messagesResponse = await this.getAllMessages(params, token)
    
    if (!messagesResponse.data?.data || messagesResponse.data.data.length === 0) {
      console.log('⚠️ [ChatService] getConversations - No messages found, returning empty conversations')
      return { ...messagesResponse, data: [] }
    }

    console.log(`📊 [ChatService] getConversations - Processing ${messagesResponse.data.data.length} messages`)

    // Group messages by participant pairs
    const conversationsMap = new Map<string, ChatConversation>()
    
    messagesResponse.data.data.forEach((message: ChatMessageDto, index: number) => {
      // Safety check for message structure
      if (!message.from || !message.to) {
        console.warn(`⚠️ [ChatService] Skipping message ${index + 1} - missing from/to data:`, message)
        return
      }
      
      console.log(`🔄 [ChatService] Processing message ${index + 1}:`, {
        id: message.id,
        from: `${message.from?.name || 'Unknown'} (${message.from?.role || 'unknown'})`,
        to: `${message.to?.name || 'Unknown'} (${message.to?.role || 'unknown'})`,
        message: (message.message || '').substring(0, 50) + '...'
      })
      
      // Determine the other participant (not the current user)
      let otherParticipant
      if (currentUserId) {
        // If we know the current user, find the other participant
        otherParticipant = message.fromId === currentUserId ? message.to : message.from
        console.log(`👤 [ChatService] Current user: ${currentUserId}, Other participant: ${otherParticipant?.name || 'Unknown'} (${otherParticipant?.role || 'unknown'})`)
      } else {
        // Fallback: assume we want to show all unique participants
        // Create conversations for both directions
        otherParticipant = message.from
        console.log(`👤 [ChatService] No current user specified, using from participant: ${otherParticipant?.name || 'Unknown'} (${otherParticipant?.role || 'unknown'})`)
      }
      
      // Safety check for otherParticipant
      if (!otherParticipant || !otherParticipant.id) {
        console.warn(`⚠️ [ChatService] Skipping message ${index + 1} - invalid other participant:`, otherParticipant)
        return
      }
      
      const conversationKey = currentUserId ? 
        [currentUserId, otherParticipant.id].sort().join('-') : 
        [message.fromId, message.toId].sort().join('-')
      
      if (!conversationsMap.has(conversationKey)) {
        console.log(`➕ [ChatService] Creating new conversation: ${conversationKey}`, {
          participantId: otherParticipant.id,
          participantName: otherParticipant.name,
          participantRole: otherParticipant.role
        })
        
        conversationsMap.set(conversationKey, {
          participantId: otherParticipant.id,
          participantName: otherParticipant.name,
          participantRole: otherParticipant.role,
          lastMessage: message,
          unreadCount: 0,
          messages: []
        })
      }
      
      const conversation = conversationsMap.get(conversationKey)!
      conversation.messages.push(message)
      
      // Update last message if this one is newer
      if (!conversation.lastMessage || new Date(message.createdAt) > new Date(conversation.lastMessage.createdAt)) {
        conversation.lastMessage = message
      }
      
      // Count unread messages (messages not read by current user)
      if (!message.isRead && currentUserId && message.toId === currentUserId) {
        conversation.unreadCount++
      }
    })

    const conversations = Array.from(conversationsMap.values())
    console.log(`✅ [ChatService] getConversations - Created ${conversations.length} conversations:`, conversations)

    return {
      ...messagesResponse,
      data: conversations
    }
  },

  // Mark messages as read - backend expects array of messageIds
  async markMessagesAsRead(messageIds: string[], token?: string): Promise<ApiResponse<{ success: boolean; messageIds: string[] }>> {
    const payload = { messageIds }
    return apiService.patch(API_CONFIG.ENDPOINTS.CHAT.READ, payload, token)
  },

  // Delete a specific message
  async deleteMessage(messageId: string, token?: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.delete(API_CONFIG.ENDPOINTS.CHAT.DELETE_MESSAGE.replace(':messageId', messageId), token)
  },

  // Send message via WebSocket (not REST API)
  // This is handled by the WebSocket service, but kept here for consistency
  sendMessageViaSocket(fromId: string, toId: string, message: string, socket: any): void {
    console.log('🔄 [ChatService] sendMessageViaSocket called with:', {
      fromId,
      toId,
      messageLength: message.length,
      hasSocket: !!socket,
      socketConnected: socket?.connected,
      socketId: socket?.id
    })
    
    if (!socket) {
      console.error('❌ [ChatService] Cannot send message - socket is null/undefined')
      throw new Error('Socket not available')
    }
    
    if (!socket.connected) {
      console.error('❌ [ChatService] Cannot send message - socket not connected:', {
        hasSocket: !!socket,
        connected: socket.connected,
        socketId: socket.id,
        readyState: socket.readyState
      })
      throw new Error('Socket not connected')
    }
    
    const payload = JSON.stringify({
      type: 'SEND_MESSAGE',
      data: {
        fromId,
        toId,
        message,
        messageType: 'TEXT',
        timestamp: new Date().toISOString()
      }
    })
    
    console.log('📤 [ChatService] Sending via WebSocket:', {
      fromId,
      toId,
      messageLength: message.length,
      payload: payload.substring(0, 200) + '...'
    })
    
    try {
      socket.emit('CHAT_EVENT', payload)
      console.log('✅ [ChatService] Message emitted successfully')
    } catch (emitError) {
      console.error('❌ [ChatService] Failed to emit message:', emitError)
      throw emitError
    }
  },

  // Initialize conversation between user and seller
  async initializeConversation(participantId: string, token?: string): Promise<ApiResponse<{ conversationId: string; participant: any }>> {
    console.log('🔄 [ChatService] Initializing conversation with participant:', participantId)
    
    const payload = {
      participantId,
      action: 'initialize'
    }
    
    return apiService.post(`${API_CONFIG.ENDPOINTS.CHAT.BASE}/conversation`, payload, token)
  },

  // Send message via REST API (fallback method)
  async sendMessageViaRest(fromId: string, toId: string, message: string, token?: string): Promise<ApiResponse<ChatMessageDto>> {
    const payload = {
      fromId,
      toId,
      message,
      messageType: 'TEXT'
    }
    
    console.log('📤 [ChatService] Sending via REST API:', {
      fromId,
      toId,
      messageLength: message.length
    })
    
    return apiService.post(API_CONFIG.ENDPOINTS.CHAT.BASE, payload, token)
  },

  // Enhanced WebSocket message sending with conversation initialization
  async sendMessageWithInit(fromId: string, toId: string, message: string, socket: any, token?: string): Promise<void> {
    try {
      // First try to initialize conversation if needed
      if (token) {
        try {
          console.log('🔄 [ChatService] Ensuring conversation exists between users')
          await this.initializeConversation(toId, token)
          
          // Small delay to ensure backend processes the conversation initialization
          await new Promise(resolve => setTimeout(resolve, 100))
        } catch (initError) {
          console.log('⚠️ [ChatService] Conversation initialization failed (might already exist):', initError)
          // Continue anyway - conversation might already exist
        }
      }
      
      // Then send via WebSocket
      this.sendMessageViaSocket(fromId, toId, message, socket)
    } catch (error) {
      console.error('❌ [ChatService] Enhanced message sending failed:', error)
      throw error
    }
  },

  // Register socket connection
  registerSocket(userId: string, socket: any): void {
    if (socket && socket.connected) {
      const payload = JSON.stringify({
        type: 'REGISTER_SOCKET',
        data: {
          userId
        }
      })
      
      socket.emit('CHAT_EVENT', payload)
    }
  }
}

export default chatService