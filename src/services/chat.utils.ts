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

// Normalize message DTO to consistent format matching backend structure
export const normalizeMessageDto = (msg: any): ChatMessageDto => {
  return {
    id: String(msg?.id ?? msg?._id ?? `temp-${Date.now()}`),
    fromId: String(msg?.fromId ?? msg?.fromUserId ?? msg?.from?.id ?? msg?.senderId ?? ''),
    toId: String(msg?.toId ?? msg?.toUserId ?? msg?.to?.id ?? msg?.receiverId ?? ''),
    message: String(msg?.message ?? msg?.text ?? msg?.content ?? msg?.body ?? ''),
    fileUrl: msg?.fileUrl || null,
    messageType: msg?.messageType || 'TEXT',
    createdAt: msg?.createdAt ?? msg?.timestamp ?? msg?.created_at ?? new Date().toISOString(),
    deletedBySender: Boolean(msg?.deletedBySender ?? false),
    deletedByReceiver: Boolean(msg?.deletedByReceiver ?? false),
    isRead: Boolean(msg?.isRead ?? msg?.read ?? msg?.is_read ?? false),
    readAt: msg?.readAt || null,
    from: {
      id: String(msg?.from?.id ?? msg?.fromId ?? ''),
      name: String(msg?.from?.name ?? 'User'),
      role: String(msg?.from?.role ?? 'USER')
    },
    to: {
      id: String(msg?.to?.id ?? msg?.toId ?? ''),
      name: String(msg?.to?.name ?? 'User'),
      role: String(msg?.to?.role ?? 'USER')
    }
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