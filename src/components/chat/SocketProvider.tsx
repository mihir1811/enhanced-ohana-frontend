'use client'

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createSocket, CHAT_EVENTS, OutgoingMessagePayload } from './socket'
import { useAppSelector } from '@/store/hooks'
import { getCookie } from '@/lib/cookie-utils'
import type { ChatMessageDto } from '@/services/chat.service'
import { normalizeMessageDto } from '@/services/chat.utils'

interface SocketError extends Error {
  type?: string;
  description?: string;
}

// Raw socket message data - will be normalized to ChatMessageDto
interface SocketMessage {
  [key: string]: unknown;
}

interface ChatEvent {
  chatId?: string;
  id?: string;
  participants?: unknown[];
  createdBy?: string;
  initiatedBy?: string;
  [key: string]: unknown;
}

type SocketContextValue = {
  socket: ReturnType<typeof createSocket> | null
  connected: boolean
  sendMessage: (payload: OutgoingMessagePayload) => void
  register: (userId: string | number) => void
  onMessage: (callback: (message: ChatMessageDto) => void) => () => void
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined)

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = useAppSelector((s) => s.auth)
  const [connected, setConnected] = useState(false)
  const socketRef = useRef<ReturnType<typeof createSocket> | null>(null)
  const messageListenersRef = useRef<Set<(message: ChatMessageDto) => void>>(new Set())

  // Establish/teardown socket based on token
  useEffect(() => {
    const cookieToken = getCookie('token')
    const effectiveToken = token || cookieToken

    console.log('🔄 [SocketProvider] Auth state changed:', { 
      hasReduxToken: Boolean(token),
      hasCookieToken: Boolean(cookieToken),
      hasEffectiveToken: Boolean(effectiveToken),
      userId: user?.id, 
      userRole: user?.role,
      tokenLength: effectiveToken?.length || 0
    })

    // Disconnect existing if token changes or becomes falsy
    if (socketRef.current) {
      console.log('🔌 [SocketProvider] Disconnecting existing socket')
      socketRef.current.disconnect()
      socketRef.current = null
    }

    if (!effectiveToken) {
      console.log('❌ [SocketProvider] No token available (redux/cookie), skipping socket connection')
      setConnected(false)
      return
    }

    console.log('🚀 [SocketProvider] Creating new socket connection with auth token')
    const socket = createSocket({ token: effectiveToken })
    socketRef.current = socket

    // Connection lifecycle
    socket.on('connect', () => {
      console.log('✅ [SocketProvider] Socket connected successfully:', { 
        socketId: socket.id,
        connected: socket.connected,
        transport: socket.io.engine.transport.name
      })
      setConnected(true)
      
      const userId = user?.id
      if (userId) {
        console.log('📡 [SocketProvider] Registering socket with CHAT_EVENT wrapper:', {
          userId,
          tokenPrefix: effectiveToken.substring(0, 10) + '...'
        })
        
        // Use the backend's CHAT_EVENT wrapper pattern
        const payload = JSON.stringify({
          type: 'REGISTER_SOCKET',
          data: { userId: String(userId) }
        })
        socket.emit(CHAT_EVENTS.CLIENT.CHAT_EVENT, payload)
      } else {
        console.warn('⚠️ [SocketProvider] No userId available for socket registration')
      }
    })

    socket.on('disconnect', (reason) => {
      console.log('❌ [SocketProvider] Socket disconnected:', { 
        reason,
        wasConnected: connected
      })
      setConnected(false)
    })
    
    socket.on('connect_error', (err: SocketError) => {
      console.error('🚨 [SocketProvider] Connection error:', {
        error: err.message,
        type: err.type,
        description: err.description
      })
      setConnected(false)
    })

    // Basic server error logging
    socket.on(CHAT_EVENTS.SERVER.ERROR, (err: SocketError) => {
      console.error('🚨 [SocketProvider] Server error received:', err)
    })

    // Enhanced message logging and listener notification
    socket.on(CHAT_EVENTS.SERVER.MESSAGE, (payload: SocketMessage) => {
      console.log('💬 [SocketProvider] Message received (full payload):', payload)
      console.log('💬 [SocketProvider] Message structure check:', {
        hasId: !!payload?.id,
        hasFromId: !!payload?.fromId,
        hasToId: !!payload?.toId,
        hasFromUserId: !!payload?.fromUserId,
        hasToUserId: !!payload?.toUserId,
        hasFrom: !!payload?.from,
        hasTo: !!payload?.to,
        messageLength: (typeof payload?.message === 'string' ? payload.message.length : 0) || (typeof payload?.text === 'string' ? payload.text.length : 0)
      })
      
      // Normalize raw socket message to ChatMessageDto format
      const normalizedMessage = normalizeMessageDto(payload)
      
      // Notify all registered message listeners
      messageListenersRef.current.forEach(listener => {
        try {
          listener(normalizedMessage)
        } catch (error) {
          console.error('🚨 [SocketProvider] Error in message listener:', error)
        }
      })
    })
    
    socket.on(CHAT_EVENTS.SERVER.READ_RECEIPT, (payload: SocketMessage) => {
      console.log('👁️ [SocketProvider] Read receipt received:', payload)
    })

    socket.on(CHAT_EVENTS.SERVER.CHAT_DELETED, (payload: ChatEvent) => {
      console.log('🗑️ [SocketProvider] Chat deleted event:', payload)
    })

    socket.on(CHAT_EVENTS.SERVER.CHAT_CREATED, (payload: ChatEvent) => {
      console.log('🆕 [SocketProvider] Chat created event:', {
        chatId: payload?.chatId || payload?.id,
        participants: payload?.participants,
        createdBy: payload?.createdBy || payload?.initiatedBy
      })
    })

    // Catch-all logger with enhanced details
    socket.onAny((event: string, ...args: unknown[]) => {
      const knownEvents = [
        CHAT_EVENTS.SERVER.MESSAGE, 
        CHAT_EVENTS.SERVER.ERROR, 
        CHAT_EVENTS.SERVER.READ_RECEIPT, 
        CHAT_EVENTS.SERVER.CHAT_DELETED, 
        CHAT_EVENTS.SERVER.CHAT_CREATED
      ] as string[]
      
      if (knownEvents.includes(event)) {
        // already logged above with more details
        return
      }
      console.log('📨 [SocketProvider] Unknown event received:', {
        event,
        argsCount: args.length,
        args: args.length > 0 ? args : 'none'
      })
    })

    return () => {
      console.log('🧹 [SocketProvider] Cleaning up socket listeners and connection')
      socket.removeAllListeners()
      socket.disconnect()
      socketRef.current = null
    }
  }, [token, user])

  const value = useMemo<SocketContextValue>(() => ({
    socket: socketRef.current,
    connected,
    sendMessage: (payload: OutgoingMessagePayload) => {
      const s = socketRef.current
      if (!s) {
        console.warn('⚠️ [SocketProvider] Cannot send message - no socket connection')
        return
      }
      
      // Ensure fromId is set if not provided
      const fromId = payload.fromId || (user?.id ? String(user.id) : '')
      if (!fromId) {
        console.error('❌ [SocketProvider] Cannot send message - no fromId available')
        return
      }
      
      const messagePayload = {
        fromId,
        toId: payload.toId,
        message: payload.message
      }
      
      console.log('📤 [SocketProvider] Sending message via CHAT_EVENT:', {
        fromId: messagePayload.fromId,
        toId: messagePayload.toId,
        messageLength: messagePayload.message.length,
        socketConnected: s.connected
      })
      
      // Use CHAT_EVENT wrapper pattern
      const chatEventPayload = JSON.stringify({
        type: 'SEND_MESSAGE',
        data: messagePayload
      })
      
      s.emit(CHAT_EVENTS.CLIENT.CHAT_EVENT, chatEventPayload)
    },
    register: (userId: string | number) => {
      const s = socketRef.current
      if (!s || !connected) {
        console.warn('⚠️ [SocketProvider] Cannot register - no socket connection')
        return
      }
      console.log('📡 [SocketProvider] Registering additional userId via CHAT_EVENT:', userId)
      
      const registerPayload = JSON.stringify({
        type: 'REGISTER_SOCKET',
        data: { userId: String(userId) }
      })
      
      s.emit(CHAT_EVENTS.CLIENT.CHAT_EVENT, registerPayload)
    },
    onMessage: (callback: (message: ChatMessageDto) => void) => {
      messageListenersRef.current.add(callback)
      
      // Return cleanup function
      return () => {
        messageListenersRef.current.delete(callback)
      }
    }
  }), [connected, user])

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = (): SocketContextValue => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}