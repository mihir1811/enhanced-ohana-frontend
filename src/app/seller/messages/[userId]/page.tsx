'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, MessageSquare, Send, Wifi } from 'lucide-react'
import Link from 'next/link'
import { useAppSelector } from '@/store/hooks'
import { toast } from 'react-hot-toast'
import { useSocket } from '@/components/chat/SocketProvider'
import { CHAT_EVENTS } from '@/components/chat/socket'
import { chatService, type ChatMessageDto } from '@/services/chat.service'
import { formatMessageTime, extractSenderName } from '@/services/chat.utils'

type ChatMessage = {
  id: string
  from: 'me' | 'user'
  text: string
  timestamp: number
  senderName?: string
}

export default function SellerChatWithUserPage() {
  const params = useParams()
  const userId = (params as { userId: string }).userId
  const router = useRouter()
  const { token, user } = useAppSelector((state) => state.auth)

  const storageKey = useMemo(() => `chat:seller:${userId}`, [userId])

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement | null>(null)
  const { socket, sendMessage, connected, register } = useSocket()
  const [serverChatId, setServerChatId] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>('')

  // Check if user is a seller
  const isSeller = user?.role === 'seller'

  // Auth gating
  useEffect(() => {
    if (!token || !user) {
      toast.error('Please login to access seller chat')
      router.push('/login')
      return
    }
    if (!isSeller) {
      toast.error('Seller access required')
      router.push('/become-seller')
      return
    }
  }, [token, user, isSeller, router])

  // Load persisted messages
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(storageKey) : null
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[]
        setMessages(parsed)
      }
    } catch (e) {
      console.warn('Failed to load persisted messages:', e)
    }
  }, [storageKey])

  // Persist messages to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(messages))
      } catch (e) {
        console.warn('Failed to persist messages:', e)
      }
    }
  }, [messages, storageKey])

  // Load chat history from server  
  useEffect(() => {
    let cancelled = false
    const loadHistory = async () => {
      if (!token || !user || !isSeller) return
      try {
        console.log('[chat:seller->user] Loading messages with user:', { userId, sellerId: user.id })
        
        // Load messages directly using getAllMessages and filter for this conversation
        const messagesRes = await chatService.getAllMessages({ limit: 100, page: 1 }, token)
        
        if (!cancelled && messagesRes?.data?.data) {
          // Filter messages for this specific user conversation
          const conversationMessages = messagesRes.data.data.filter(msg => 
            (msg.fromId === user.id && msg.toId === userId) ||
            (msg.fromId === userId && msg.toId === user.id)
          )
          
          // Transform to local format
          const localMessages: ChatMessage[] = conversationMessages.map(msg => ({
            id: msg.id,
            from: msg.fromId === user.id ? 'me' : 'user',
            text: msg.message,
            timestamp: new Date(msg.createdAt).getTime(),
            senderName: extractSenderName(msg)
          }))
          
          setMessages(localMessages)
          setUserName(conversationMessages[0]?.from?.name || conversationMessages[0]?.to?.name || 'User')
          console.log('[chat:seller->user] Messages loaded:', localMessages.length)
        }
      } catch (e) {
        console.error('Failed to load messages:', e)
      }
    }
    loadHistory()
    return () => {
      cancelled = true
    }
  }, [token, user, userId, isSeller])

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return
    const onIncoming = (payload: ChatMessageDto) => {
      console.log('[chat:seller->user] on MESSAGE:', payload)
      try {
        const text = payload?.message ?? ''
        const ts = payload?.createdAt ? Date.parse(payload.createdAt) : Date.now()
        const fromUserId = payload?.fromId ?? payload?.from?.id
        const myId = user?.id
        const isFromMe = myId && (String(fromUserId) === String(myId))
        
        // Only process messages relevant to this chat
        const msgUserId = payload?.toId
        if (msgUserId && String(msgUserId) !== String(userId)) {
          return // Not for this user
        }

        setMessages((prev) => [...prev, {
          id: String(payload?.id ?? `srv-${ts}`),
          from: isFromMe ? 'me' : 'user',
          text,
          timestamp: ts,
          senderName: isFromMe ? user?.name : userName
        }])
        
        // Note: chatId property not available in ChatMessageDto interface
        // if (payload?.chatId && !serverChatId) {
        //   setServerChatId(payload.chatId)
        // }
      } catch (e) {
        console.warn('Failed to process incoming message:', e)
      }
    }
    socket.on(CHAT_EVENTS.SERVER.MESSAGE, onIncoming)
    return () => {
      socket.off(CHAT_EVENTS.SERVER.MESSAGE, onIncoming)
    }
  }, [socket, user, userId, serverChatId, userName])

  // Ensure socket is registered once user and connection are ready
  useEffect(() => {
    if (!socket || !connected || !user?.id) return
    try {
      register(user.id)
    } catch (e) {
      console.warn('Failed to register socket:', e)
    }
  }, [socket, connected, user?.id, register])

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  // Try to get user name
  useEffect(() => {
    let cancelled = false
    const fetchUserName = async () => {
      if (!userId) return
      try {
        // This would ideally come from a user service
        // For now, we'll use a fallback name
        if (!cancelled) {
          setUserName(`User ${userId}`)
        }
      } catch (e) {
        console.warn('Failed to fetch user name:', e)
        if (!cancelled) {
          setUserName(`User ${userId}`)
        }
      }
    }
    fetchUserName()
    return () => {
      cancelled = true
    }
  }, [userId])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    
    const now = Date.now()
    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      { 
        id: `me-${now}`, 
        from: 'me', 
        text: trimmed, 
        timestamp: now,
        senderName: user?.name 
      },
    ])

    // Emit to backend
    try {
      const emitChatId = serverChatId || undefined
      console.log('[chat:seller->user] emit SEND_MESSAGE:', {
        chatId: emitChatId ?? '(none)',
        toUserId: userId,
        text: trimmed,
        clientTempId: `me-${now}`,
      })
      sendMessage({
        fromId: String(user?.id || ''),
        toId: userId,
        message: trimmed,
      })
    } catch (e) {
      console.warn('Failed to send message:', e)
    }
    setInput('')
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  if (!token || !user || !isSeller) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Seller Access Required</h3>
          <p className="text-gray-600 mb-4">Please log in as a seller to access this chat</p>
          <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/seller/messages')}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gray-900" />
              <h1 className="text-xl font-semibold text-gray-900">
                Chat with {userName || 'Customer'}
              </h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className={`inline-flex items-center gap-1 ${connected ? 'text-green-600' : 'text-gray-500'}`}>
                <Wifi className="w-4 h-4" />
                {connected ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat window */}
      <div className="rounded-xl border border-gray-200 flex flex-col bg-white" style={{ height: '600px' }}>
        <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Start your conversation with {userName || 'the customer'}</p>
            </div>
          )}
          
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] md:max-w-[75%] px-3 py-2 rounded-2xl text-sm shadow-sm ${
                  m.from === 'me' 
                    ? 'rounded-br-sm bg-blue-600 text-white' 
                    : 'rounded-bl-sm bg-gray-100 text-gray-800'
                }`}
              >
                {m.senderName && (
                  <div className="text-xs opacity-75 mb-1">{m.senderName}</div>
                )}
                <p>{m.text}</p>
                <p className="text-[11px] mt-1 opacity-70">
                  {formatMessageTime(m.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${userName || 'customer'}...`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!connected}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || !connected}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
          {!connected && (
            <p className="text-xs text-red-500 mt-1">
              Connection lost. Messages will be sent when reconnected.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}