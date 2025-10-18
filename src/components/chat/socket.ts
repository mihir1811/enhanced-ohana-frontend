"use client";

import { io, Socket } from "socket.io-client";
import { API_CONFIG } from "@/lib/constants";

// Event names used by the backend chat module
// Backend uses a single "CHAT_EVENT" wrapper with type/data structure
export const CHAT_EVENTS = {
  CLIENT: {
    CHAT_EVENT: "CHAT_EVENT", // Main event wrapper
    REGISTER_SOCKET: "REGISTER_SOCKET", // type for CHAT_EVENT
    SEND_MESSAGE: "SEND_MESSAGE", // type for CHAT_EVENT
  },
  SERVER: {
    MESSAGE: "MESSAGE", // Direct server events
    ERROR: "ERROR",
    READ_RECEIPT: "READ_RECEIPT",
    CHAT_DELETED: "CHAT_DELETED",
    CHAT_CREATED: "CHAT_CREATED",
  },
} as const;

type CreateSocketOptions = {
  token: string;
  userId?: string | number;
};

// Derive socket base from API base if explicit env is not provided
const deriveSocketBaseUrl = () => {
  const explicit = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (explicit) {
    console.log('🌐 [socket] Using explicit SOCKET_URL:', explicit);
    return explicit;
  }
  
  // Try to strip trailing "/api/v1" from API base to get host origin
  const derived = API_CONFIG.BASE_URL.replace(/\/api\/v1$/, "");
  console.log('🌐 [socket] Derived socket URL from API base:', {
    apiBase: API_CONFIG.BASE_URL,
    derivedSocketUrl: derived
  });
  return derived;
};

export const createSocket = ({ token }: CreateSocketOptions): Socket => {
  const baseUrl = deriveSocketBaseUrl();
  
  console.log('🔧 [socket] Creating socket with configuration:', { 
    baseUrl, 
    hasToken: Boolean(token),
    tokenLength: token?.length || 0,
    tokenPrefix: token ? token.substring(0, 10) + '...' : 'none',
    transports: ['websocket'],
    path: '/socket.io',
    withCredentials: true,
    reconnection: true
  });

  const socket = io(baseUrl, {
    transports: ["websocket"],
    path: "/socket.io",
    withCredentials: true,
    auth: { token },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    reconnectionDelayMax: 5000,
  });

  // Add connection event logging directly on the socket
  socket.on('connect', () => {
    console.log('🎯 [socket] Raw socket connected:', {
      id: socket.id,
      connected: socket.connected,
      transport: socket.io.engine.transport.name,
      url: baseUrl
    });
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 [socket] Raw socket disconnected:', {
      reason,
      id: socket.id
    });
  });

  socket.on('connect_error', (error: Error & { description?: string; type?: string }) => {
    console.error('❌ [socket] Raw socket connection error:', {
      message: error.message,
      description: error.description || 'Unknown error',
      type: error.type || 'connection_error',
      url: baseUrl
    });
  });

  return socket;
};

export type OutgoingMessagePayload = {
  fromId: string;
  toId: string;
  message: string;
};

export type SocketRegisterPayload = {
  userId: string;
};

// Helper functions to wrap events in CHAT_EVENT format
export const wrapChatEvent = (type: string, data: unknown) => {
  return JSON.stringify({ type, data });
};

export const sendChatEvent = (socket: Socket, type: string, data: unknown) => {
  if (!socket.connected) {
    console.warn('⚠️ [socket] Cannot send event - socket not connected');
    return;
  }
  
  const payload = wrapChatEvent(type, data);
  console.log('📤 [socket] Sending CHAT_EVENT:', { type, data, payload });
  socket.emit(CHAT_EVENTS.CLIENT.CHAT_EVENT, payload);
};