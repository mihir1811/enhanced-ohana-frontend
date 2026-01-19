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
    // Socket connection disabled as requested
    console.log('🚫 [SocketProvider] WebSocket connection disabled');
    setConnected(false);
    return () => {};
  }, [token, user])

  const value = useMemo<SocketContextValue>(() => ({
    socket: null,
    connected: false,
    sendMessage: (payload: OutgoingMessagePayload) => {
      console.warn('⚠️ [SocketProvider] sendMessage called but socket is disabled', payload);
    },
    register: (userId: string | number) => {
      console.log('⚠️ [SocketProvider] register called but socket is disabled', userId);
    },
    onMessage: (callback: (message: ChatMessageDto) => void) => {
      console.log('⚠️ [SocketProvider] onMessage listener registered but socket is disabled');
      return () => {};
    }
  }), [])

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