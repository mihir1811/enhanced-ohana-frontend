"use client";

import { io, Socket as ClientSocket } from "socket.io-client";
import { API_CONFIG } from "@/lib/constants";

export const CHAT_EVENTS = {
  CLIENT: {
    CHAT_EVENT: "CHAT_EVENT",
    REGISTER_SOCKET: "REGISTER_SOCKET",
    SEND_MESSAGE: "SEND_MESSAGE",
  },
  SERVER: {
    MESSAGE: "MESSAGE",
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

// Export the Socket type
export type Socket = ClientSocket;

export const createSocket = ({ token }: CreateSocketOptions): Socket | null => {
  if (typeof window === "undefined") return null;

  // Extract base URL (remove /api/v1)
  // If BASE_URL is http://localhost:3000/api/v1, we want http://localhost:3000
  // Note: Backend might be on a different port (3001), ensure env var is correct.
  // Using simple logic to strip the path.
  let baseUrl = API_CONFIG.BASE_URL;
  try {
    const url = new URL(API_CONFIG.BASE_URL);
    baseUrl = url.origin;
  } catch (e) {
    console.error('Invalid API URL:', API_CONFIG.BASE_URL);
  }

  console.log('🔧 [socket] Connecting to:', baseUrl);

  const socket = io(baseUrl, {
    auth: { token },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log("✅ [socket] Connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ [socket] Connection error:", err.message);
  });

  return socket;
};

export type OutgoingMessagePayload = {
  fromId: string;
  toId: string;
  message: string;
  fileUrl?: string;
  messageType?: "TEXT" | "FILE";
};

export type SocketRegisterPayload = {
  userId: string;
};

// Helper functions to wrap events in CHAT_EVENT format
export const wrapChatEvent = (type: string, data: unknown) => {
  return JSON.stringify({ type, data });
};

export const sendChatEvent = (socket: Socket, type: string, data: unknown) => {
  if (!socket || !socket.connected) {
    console.warn("⚠️ [socket] Cannot send event: Socket not connected");
    return;
  }
  
  const payload = wrapChatEvent(type, data);
  socket.emit(CHAT_EVENTS.CLIENT.CHAT_EVENT, payload);
};
