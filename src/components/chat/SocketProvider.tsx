'use client'

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createSocket, CHAT_EVENTS, OutgoingMessagePayload } from './socket'
import { useAppSelector } from '@/store/hooks'
import { getCookie } from '@/lib/cookie-utils'

type SocketContextValue = {
  socket: ReturnType<typeof createSocket> | null
  connected: boolean
  sendMessage: (payload: OutgoingMessagePayload) => void
  register: (userId: string | number) => void
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined)

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = useAppSelector((s) => s.auth)
  const [connected, setConnected] = useState(false)
  const socketRef = useRef<ReturnType<typeof createSocket> | null>(null)

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
        const payload = { userId, token: effectiveToken }
        console.log('📡 [SocketProvider] Emitting REGISTER_SOCKET:', {
          userId,
          tokenPrefix: effectiveToken.substring(0, 10) + '...',
          eventName: CHAT_EVENTS.CLIENT.REGISTER_SOCKET
        })
        socket.emit(CHAT_EVENTS.CLIENT.REGISTER_SOCKET, payload)
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
    
    socket.on('connect_error', (err) => {
      console.error('🚨 [SocketProvider] Connection error:', {
        error: err.message,
        type: err.type,
        description: err.description
      })
      setConnected(false)
    })

    // Basic server error logging
    socket.on(CHAT_EVENTS.SERVER.ERROR, (err: any) => {
      console.error('🚨 [SocketProvider] Server error received:', err)
    })

    // Enhanced message logging
    socket.on(CHAT_EVENTS.SERVER.MESSAGE, (payload: any) => {
      console.log('💬 [SocketProvider] Message received:', {
        messageId: payload?.id,
        fromUserId: payload?.fromUserId,
        toUserId: payload?.toUserId,
        chatId: payload?.chatId,
        textLength: payload?.text?.length || 0,
        timestamp: payload?.timestamp
      })
    })
    
    socket.on(CHAT_EVENTS.SERVER.READ_RECEIPT, (payload: any) => {
      console.log('👁️ [SocketProvider] Read receipt received:', payload)
    })
    
    socket.on(CHAT_EVENTS.SERVER.CHAT_DELETED, (payload: any) => {
      console.log('🗑️ [SocketProvider] Chat deleted event:', payload)
    })

    // Catch-all logger with enhanced details
    // @ts-ignore
    socket.onAny((event: string, ...args: any[]) => {
      if ([CHAT_EVENTS.SERVER.MESSAGE, CHAT_EVENTS.SERVER.ERROR, CHAT_EVENTS.SERVER.READ_RECEIPT, CHAT_EVENTS.SERVER.CHAT_DELETED].includes(event as any)) {
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
      const enriched: OutgoingMessagePayload = {
        ...payload,
        message: payload.message ?? payload.text,
        toId: payload.toId ?? payload.toUserId ?? payload.toSellerId,
        fromId: (typeof user?.id !== 'undefined') ? String(user!.id) : payload.fromId
      }
      console.log('📤 [SocketProvider] Sending message:', {
        chatId: enriched.chatId,
        toUserId: enriched.toUserId,
        toSellerId: enriched.toSellerId,
        toId: enriched.toId,
        fromId: enriched.fromId,
        productId: enriched.productId,
        textLength: (enriched.text ?? enriched.message ?? '').length,
        clientTempId: enriched.clientTempId,
        socketConnected: s.connected
      })
      s.emit(CHAT_EVENTS.CLIENT.SEND_MESSAGE, enriched)
    },
    register: (userId: string | number) => {
      const s = socketRef.current
      const cookieToken = getCookie('token')
      const effectiveToken = token || cookieToken
      if (!s || !effectiveToken) {
        console.warn('⚠️ [SocketProvider] Cannot register socket - missing socket or token')
        return
      }
      const payload = { userId, token: effectiveToken }
      console.log('📡 [SocketProvider] Manual socket registration:', {
        userId,
        tokenPrefix: effectiveToken.substring(0, 10) + '...',
        socketConnected: s.connected
      })
      s.emit(CHAT_EVENTS.CLIENT.REGISTER_SOCKET, payload)
    },
  }), [connected, token])

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

export const useSocket = () => {
  const ctx = useContext(SocketContext)
  if (!ctx) throw new Error('useSocket must be used within SocketProvider')
  return ctx
}