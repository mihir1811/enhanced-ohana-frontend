"use client";

// Socket functionality removed as requested
// Keeping types and constants to avoid breaking imports during refactor

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

// Mock Socket type to satisfy TypeScript
export type Socket = any;

export const createSocket = ({ token }: CreateSocketOptions): Socket => {
  console.log('🔧 [socket] Socket connection disabled');
  return null;
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
  console.warn('⚠️ [socket] sendChatEvent disabled');
};