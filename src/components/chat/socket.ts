"use client";

import { io, Socket } from "socket.io-client";
import { API_CONFIG } from "@/lib/constants";

// Event names used by the backend chat module
export const CHAT_EVENTS = {
  CLIENT: {
    REGISTER_SOCKET: "REGISTER_SOCKET",
    SEND_MESSAGE: "SEND_MESSAGE",
  },
  SERVER: {
    MESSAGE: "MESSAGE",
    ERROR: "ERROR",
    READ_RECEIPT: "READ_RECEIPT",
    CHAT_DELETED: "CHAT_DELETED",
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

  socket.on('connect_error', (error) => {
    console.error('❌ [socket] Raw socket connection error:', {
      message: error.message,
      description: error.description,
      type: error.type,
      url: baseUrl
    });
  });

  return socket;
};

export type OutgoingMessagePayload = {
  chatId?: string; // client/local conversation id if available
  toSellerId?: string | number;
  toUserId?: string | number;
  toId?: string | number; // seller API compatible
  fromId?: string | number; // seller API compatible
  productId?: string | number;
  text: string;
  message?: string; // seller API compatible
  clientTempId?: string; // for optimistic UI correlation
};

export type IncomingMessagePayload = {
  id: string;
  chatId?: string;
  fromUserId?: string | number;
  toUserId?: string | number;
  text: string;
  timestamp: number;
  // Seller API compatible fields (optional)
  fromId?: string | number;
  toId?: string | number;
  message?: string;
  createdAt?: string; // ISO string
  from?: { id: string | number; name?: string; role?: string };
  to?: { id: string | number; name?: string; role?: string };
};