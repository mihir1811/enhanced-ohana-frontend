import { ChatMessageDto } from './chat.service'

// Type for unknown API response structure
type UnknownApiResponse = unknown

// Type guards to check for properties
const hasDataProperty = (obj: unknown): obj is { data: unknown } => {
  return typeof obj === 'object' && obj !== null && 'data' in obj
}

const hasMessagesProperty = (obj: unknown): obj is { messages: unknown } => {
  return typeof obj === 'object' && obj !== null && 'messages' in obj
}

// Utility to extract message array from various API response formats
export const extractMessageArray = (response: UnknownApiResponse): ChatMessageDto[] => {
  // Handle direct array
  if (Array.isArray(response)) return response
  
  // Handle nested data.data structure (common API format)
  if (hasDataProperty(response) && hasDataProperty(response.data) && Array.isArray(response.data.data)) {
    return response.data.data
  }
  
  // Handle data array
  if (hasDataProperty(response) && Array.isArray(response.data)) return response.data
  
  // Handle messages array
  if (hasMessagesProperty(response) && Array.isArray(response.messages)) return response.messages
  
  return []
}

// Type for incoming message data from various sources
type UnknownMessageData = unknown

// Type guard to check if object has string or number property
const getStringValue = (obj: unknown, ...keys: string[]): string => {
  if (typeof obj !== 'object' || obj === null) return ''
  
  for (const key of keys) {
    const value = (obj as Record<string, unknown>)[key]
    if (typeof value === 'string' || typeof value === 'number') {
      return String(value)
    }
    // Check nested objects
    if (typeof value === 'object' && value !== null) {
      const nestedValue = (value as Record<string, unknown>).id
      if (typeof nestedValue === 'string' || typeof nestedValue === 'number') {
        return String(nestedValue)
      }
    }
  }
  return ''
}

const getBooleanValue = (obj: unknown, ...keys: string[]): boolean => {
  if (typeof obj !== 'object' || obj === null) return false
  
  for (const key of keys) {
    const value = (obj as Record<string, unknown>)[key]
    if (typeof value === 'boolean') return value
    if (value === 'true' || value === 1) return true
    if (value === 'false' || value === 0) return false
  }
  return false
}

const getNestedName = (obj: unknown, path: string): string => {
  if (typeof obj !== 'object' || obj === null) return 'User'
  
  const parts = path.split('.')
  let current: unknown = obj
  
  for (const part of parts) {
    if (typeof current === 'object' && current !== null && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part]
    } else {
      return 'User'
    }
  }
  
  return typeof current === 'string' ? current : 'User'
}

// Normalize message DTO to consistent format matching backend structure
export const normalizeMessageDto = (msg: UnknownMessageData): ChatMessageDto => {
  return {
    id: getStringValue(msg, 'id', '_id') || `temp-${Date.now()}`,
    fromId: getStringValue(msg, 'fromId', 'fromUserId', 'senderId') || getStringValue(msg, 'from.id'),
    toId: getStringValue(msg, 'toId', 'toUserId', 'receiverId') || getStringValue(msg, 'to.id'),
    message: getStringValue(msg, 'message', 'text', 'content', 'body'),
    fileUrl: getStringValue(msg, 'fileUrl') || null,
    messageType: (getStringValue(msg, 'messageType') as 'TEXT' | 'FILE') || 'TEXT',
    createdAt: getStringValue(msg, 'createdAt', 'timestamp', 'created_at') || new Date().toISOString(),
    deletedBySender: getBooleanValue(msg, 'deletedBySender'),
    deletedByReceiver: getBooleanValue(msg, 'deletedByReceiver'),
    isRead: getBooleanValue(msg, 'isRead', 'read', 'is_read'),
    readAt: getStringValue(msg, 'readAt') || null,
    from: {
      id: getStringValue(msg, 'fromId', 'fromUserId', 'senderId') || getStringValue(msg, 'from.id'),
      name: getNestedName(msg, 'from.name') || 'User',
      role: getNestedName(msg, 'from.role') || 'USER'
    },
    to: {
      id: getStringValue(msg, 'toId', 'toUserId', 'receiverId') || getStringValue(msg, 'to.id'),
      name: getNestedName(msg, 'to.name') || 'User',
      role: getNestedName(msg, 'to.role') || 'USER'
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
export const extractSenderName = (msg: UnknownMessageData, fallback = 'Unknown'): string => {
  return (
    getNestedName(msg, 'from.name') ||
    getNestedName(msg, 'sender.name') ||
    getStringValue(msg, 'senderName', 'fromName') ||
    fallback
  )
}

// Extract receiver name from message object
export const extractReceiverName = (msg: UnknownMessageData, fallback = 'Unknown'): string => {
  return (
    getNestedName(msg, 'to.name') ||
    getNestedName(msg, 'receiver.name') ||
    getStringValue(msg, 'receiverName', 'toName') ||
    fallback
  )
}

// Check if user is online based on socket connection
export const getUserOnlineStatus = (userId: string | number, onlineUsers: Set<string>): boolean => {
  return onlineUsers.has(String(userId))
}