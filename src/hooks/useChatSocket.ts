import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  createSocket, 
  Socket, 
  CHAT_EVENTS, 
  sendChatEvent, 
  OutgoingMessagePayload 
} from '@/components/chat/socket';
import { toast } from 'react-hot-toast';

interface UseChatSocketProps {
  token: string | null;
  userId: string | null;
}

export const useChatSocket = ({ token, userId }: UseChatSocketProps) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    if (!token || !userId) return;

    // 1. Initialize Socket
    const socket = createSocket({ token, userId });
    if (!socket) return;

    socketRef.current = socket;

    // 2. Setup Event Listeners
    const onConnect = () => {
      setIsConnected(true);
      console.log('✅ [useChatSocket] Socket Connected');
      // Register user immediately upon connection
      sendChatEvent(socket, CHAT_EVENTS.CLIENT.REGISTER_SOCKET, { userId });
    };

    const onDisconnect = () => {
      setIsConnected(false);
      console.log('❌ [useChatSocket] Socket Disconnected');
    };

    const onMessage = (data: any) => {
      console.log('📩 [useChatSocket] Received message:', data);
      setLastMessage(data);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on(CHAT_EVENTS.SERVER.MESSAGE, onMessage);

    // 3. Cleanup
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off(CHAT_EVENTS.SERVER.MESSAGE, onMessage);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, userId]);

  // Helper to send message
  const sendMessage = useCallback((payload: OutgoingMessagePayload) => {
    if (socketRef.current && socketRef.current.connected) {
      sendChatEvent(socketRef.current, CHAT_EVENTS.CLIENT.SEND_MESSAGE, payload);
    } else {
      console.warn('⚠️ [useChatSocket] Cannot send: Socket disconnected');
      toast.error('Connection lost. Reconnecting...');
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    sendMessage,
    lastMessage
  };
};
