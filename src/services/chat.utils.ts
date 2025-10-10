import { ChatMessageDto } from './chat.service'

// Utility to extract message array from various API response formats
export const extractMessageArray = (response: any): ChatMessageDto[] => {
  // Handle direct array
  if (Array.isArray(response)) return response
  
  // Handle nested data.data structure (common API format)
  if (response?.data?.data && Array.isArray(response.data.data)) return response.data.data
  
  // Handle data array
  if (response?.data && Array.isArray(response.data)) return response.data
  
  // Handle messages array
  if (response?.messages && Array.isArray(response.messages)) return response.messages
  
  return []
}

// Normalize message DTO to consistent format
export const normalizeMessageDto = (msg: any): ChatMessageDto => {
  const id = String(msg?.id ?? msg?._id ?? `temp-${Date.now()}`)
  const chatId = String(msg?.chatId ?? msg?.conversationId ?? '')
  
  // Handle different field names for user IDs
  const fromUserId = String(
    msg?.fromUserId ?? 
    msg?.fromId ?? 
    msg?.from?.id ?? 
    msg?.senderId ?? 
    ''
  )
  
  const toUserId = String(
    msg?.toUserId ?? 
    msg?.toId ?? 
    msg?.to?.id ?? 
    msg?.receiverId ?? 
    ''
  )
  
  // Handle different field names for message text
  const text = String(
    msg?.text ?? 
    msg?.message ?? 
    msg?.content ?? 
    msg?.body ?? 
    ''
  )
  
  // Handle timestamp
  const timestamp = msg?.timestamp ?? msg?.createdAt ?? msg?.created_at ?? Date.now()
  
  // Handle read status
  const read = Boolean(
    msg?.read ?? 
    msg?.isRead ?? 
    msg?.is_read ?? 
    msg?.readAt ?? 
    msg?.read_at ?? 
    false
  )

  return {
    id,
    chatId,
    fromUserId,
    toUserId,
    text,
    timestamp: typeof timestamp === 'string' ? Date.parse(timestamp) : timestamp,
    read
  }
}

// Format timestamp for display
export const formatMessageTime = (timestamp: number | string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  // Less than 1 minute
  if (diff < 60000) {
    return 'just now'
  }
  
  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes}m ago`
  }
  
  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    return `${hours}h ago`
  }
  
  // More than 24 hours - show date
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

// Generate unique client-side message ID
export const generateClientMessageId = (prefix = 'client'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Extract sender name from message object
export const extractSenderName = (msg: any, fallback = 'Unknown'): string => {
  return (
    msg?.from?.name ?? 
    msg?.sender?.name ?? 
    msg?.senderName ?? 
    msg?.fromName ?? 
    fallback
  )
}

// Extract receiver name from message object
export const extractReceiverName = (msg: any, fallback = 'Unknown'): string => {
  return (
    msg?.to?.name ?? 
    msg?.receiver?.name ?? 
    msg?.receiverName ?? 
    msg?.toName ?? 
    fallback
  )
}

// Check if user is online based on socket connection
export const getUserOnlineStatus = (userId: string | number, onlineUsers: Set<string>): boolean => {
  return onlineUsers.has(String(userId))
}