'use client'

import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { createSocket, CHAT_EVENTS, OutgoingMessagePayload, sendChatEvent, Socket } from './socket'
import { useAppSelector } from '@/store/hooks'
import type { ChatMessageDto } from '@/services/chat.service'

type SocketContextValue = {
  socket: Socket | null
  connected: boolean
  sendMessage: (payload: OutgoingMessagePayload) => void
  register: (userId: string | number) => void
  onMessage: (callback: (message: ChatMessageDto) => void) => () => void
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined)

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = useAppSelector((s) => s.auth)
  const [connected, setConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  
  // We use a set of listeners to allow multiple components to subscribe to messages
  const messageListenersRef = useRef<Set<(message: ChatMessageDto) => void>>(new Set())

  // Establish/teardown socket based on token
  useEffect(() => {
    if (!token) {
      if (socketRef.current) {
        console.log('🔌 [SocketProvider] Disconnecting socket (no token)');
        socketRef.current.disconnect();
        socketRef.current = null;
        setConnected(false);
      }
      return;
    }

    // If socket exists and is connected, don't recreate unless token changed (which useEffect handles)
    if (socketRef.current?.connected) {
        // Just ensure we are registered if user changes? 
        // Usually token change implies user change.
        return;
    }

    console.log('� [SocketProvider] Initializing socket connection...');
    const socket = createSocket({ token, userId: user?.id });
    
    if (!socket) return;

    socketRef.current = socket;

    const onConnect = () => {
      console.log('✅ [SocketProvider] Socket Connected');
      setConnected(true);
      // Auto-register if user exists
      if (user?.id) {
        console.log('👤 [SocketProvider] Auto-registering user:', user.id);
        sendChatEvent(socket, CHAT_EVENTS.CLIENT.REGISTER_SOCKET, { userId: user.id });
      }
    };

    const onDisconnect = () => {
      console.log('❌ [SocketProvider] Socket Disconnected');
      setConnected(false);
    };

    const onSocketMessage = (payload: any) => {
        // payload might be the raw object or { type, data } depending on backend.
        // Based on ChatGateway:
        // this.chatEmitService.toSocket(client.id, SocketEmitEventType.MESSAGE, { ... })
        // It seems it emits 'MESSAGE' event with a payload.
        
        console.log('📩 [SocketProvider] Global message received:', payload);
        
        // Notify all listeners
        messageListenersRef.current.forEach(listener => {
            try {
                listener(payload);
            } catch (err) {
                console.error('Error in message listener:', err);
            }
        });
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on(CHAT_EVENTS.SERVER.MESSAGE, onSocketMessage); // 'MESSAGE'

    // Also listen for errors
    socket.on('error', (err) => console.error('Socket error:', err));
    socket.on('connect_error', (err) => console.error('Socket connect_error:', err));

    return () => {
      console.log('🧹 [SocketProvider] Cleaning up socket');
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off(CHAT_EVENTS.SERVER.MESSAGE, onSocketMessage);
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [token, user?.id]); // Re-connect if token or user changes

  // Helper to send message
  const sendMessage = useCallback((payload: OutgoingMessagePayload) => {
    if (socketRef.current && socketRef.current.connected) {
      sendChatEvent(socketRef.current, CHAT_EVENTS.CLIENT.SEND_MESSAGE, payload);
    } else {
      console.warn('⚠️ [SocketProvider] Cannot send: Socket disconnected');
    }
  }, []);

  // Helper to register (can be called manually if needed, though we auto-register)
  const register = useCallback((userId: string | number) => {
    if (socketRef.current && socketRef.current.connected) {
      sendChatEvent(socketRef.current, CHAT_EVENTS.CLIENT.REGISTER_SOCKET, { userId });
    }
  }, []);

  // Subscribe to messages
  const onMessage = useCallback((callback: (message: ChatMessageDto) => void) => {
    messageListenersRef.current.add(callback);
    return () => {
      messageListenersRef.current.delete(callback);
    };
  }, []);

  const value = useMemo<SocketContextValue>(() => ({
    socket: socketRef.current,
    connected,
    sendMessage,
    register,
    onMessage
  }), [connected, sendMessage, register, onMessage]);

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
