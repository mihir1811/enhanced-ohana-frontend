'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, MessageSquare, Send, Wifi } from 'lucide-react'
import Link from 'next/link'
import { useAppSelector } from '@/store/hooks'
import { toast } from 'react-hot-toast'
import { useSocket } from '@/components/chat/SocketProvider'
import { CHAT_EVENTS } from '@/components/chat/socket'
import { chatService } from '@/services/chat.service'
import { extractMessageArray, normalizeMessageDto, formatMessageTime, extractSenderName } from '@/services/chat.utils'

type ChatMessage = {
  id: string
  from: 'me' | 'seller'
  text: string
  timestamp: number
  senderName?: string
}

export default function UserChatWithSellerPage() {
  const params = useParams()
  const sellerId = (params as { sellerId: string }).sellerId
  const searchParams = useSearchParams()
  const router = useRouter()
  const { token, user } = useAppSelector((state) => state.auth)

  const productId = searchParams.get('productId') || ''
  const productName = searchParams.get('productName') || ''

  const storageKey = useMemo(() => `chat:user:${sellerId}:${productId || 'general'}`, [sellerId, productId])

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement | null>(null)
  const { socket, sendMessage, connected, register } = useSocket()
  const [serverChatId, setServerChatId] = useState<string | null>(null)
  const [sellerName, setSellerName] = useState<string>('')
  const [loadingMore, setLoadingMore] = useState(false)

  // Auth gating
  useEffect(() => {
    if (!token || !user) {
      toast.error('Please login to start a chat')
      router.push('/login')
      return
    }
  }, [token, user, router])

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
      if (!token || !user) return
      try {
        console.log('[chat:user->seller] Loading or creating chat with seller:', { sellerId, userId: user.id, productId })
        
        // Use getOrCreateChat to ensure we have a chatId
        const chatRes = await chatService.getOrCreateChat(
          { 
            userId: user.id, 
            sellerId, 
            ...(productId && { productId }) 
          }, 
          token
        )
        
        if (!cancelled && chatRes?.data) {
          const chat = chatRes.data
          setServerChatId(chat.id)
          console.log('[chat:user->seller] Chat ready:', { 
            chatId: chat.id, 
            isNew: chat.isNew,
            participants: chat.participants 
          })
          
          // Load messages for this chat if it's not new
          if (!chat.isNew) {
            const msgRes = await chatService.getMessages(chat.id, { limit: 50, page: 1 }, token)
            if (!cancelled && msgRes?.data) {
              const rawMessages = extractMessageArray(msgRes.data)
              console.log('Raw messages from API (user side):', { count: rawMessages.length, sample: rawMessages[0] })
              
              const chatMessages: ChatMessage[] = rawMessages.map(rawMsg => {
                const normalizedMsg = normalizeMessageDto(rawMsg)
                const isFromMe = String(normalizedMsg.fromUserId) === String(user.id)
                const senderName = isFromMe ? user.name : extractSenderName(rawMsg, sellerName)
                
                return {
                  id: normalizedMsg.id,
                  from: isFromMe ? 'me' : 'seller',
                  text: normalizedMsg.text,
                  timestamp: normalizedMsg.timestamp,
                  senderName
                }
              })
              setMessages(chatMessages)
              console.log('Processed chat messages (user side):', { 
                count: chatMessages.length, 
                sample: chatMessages[0] 
              })
            }
          } else {
            console.log('[chat:user->seller] New chat created, starting with empty messages')
          }
        }
      } catch (e) {
        console.error('Failed to load/create chat:', e)
      }
    }
    loadHistory()
    return () => {
      cancelled = true
    }
  }, [token, user, sellerId, sellerName, productId])

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return
    const onIncoming = (payload: any) => {
      console.log('[chat:user->seller] on MESSAGE:', payload)
      try {
        const text = payload?.text ?? payload?.message ?? ''
        const ts = payload?.timestamp ?? (payload?.createdAt ? Date.parse(payload.createdAt) : Date.now())
        const fromUserId = payload?.fromUserId ?? payload?.fromId ?? payload?.from?.id
        const myId = user?.id
        const isFromMe = myId && (String(fromUserId) === String(myId))
        
        // Only process messages relevant to this chat
        const msgSellerId = payload?.toSellerId ?? payload?.toId
        if (msgSellerId && String(msgSellerId) !== String(sellerId)) {
          return // Not for this seller
        }

        setMessages((prev) => [...prev, {
          id: String(payload?.id ?? `srv-${ts}`),
          from: isFromMe ? 'me' : 'seller',
          text,
          timestamp: ts,
          senderName: isFromMe ? user?.name : sellerName
        }])
        
        if (payload?.chatId && !serverChatId) {
          setServerChatId(payload.chatId)
        }
      } catch (e) {
        console.warn('Failed to process incoming message:', e)
      }
    }
    socket.on(CHAT_EVENTS.SERVER.MESSAGE, onIncoming)
    return () => {
      socket.off(CHAT_EVENTS.SERVER.MESSAGE, onIncoming)
    }
  }, [socket, user, sellerId, serverChatId, sellerName])

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

  // Try to get seller name from user profile service
  useEffect(() => {
    let cancelled = false
    const fetchSellerName = async () => {
      if (!sellerId) return
      try {
        // This would ideally come from a seller service
        // For now, we'll use a fallback name
        if (!cancelled) {
          setSellerName(`Seller ${sellerId}`)
        }
      } catch (e) {
        console.warn('Failed to fetch seller name:', e)
        if (!cancelled) {
          setSellerName(`Seller ${sellerId}`)
        }
      }
    }
    fetchSellerName()
    return () => {
      cancelled = true
    }
  }, [sellerId])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    
    if (!sellerId) {
      console.error('[chat:user->seller] No seller ID available')
      return
    }
    
    if (!user?.id) {
      console.error('[chat:user->seller] No user ID available')
      return
    }
    
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
      
      // Enhanced payload for chat creation when chatId is undefined
      const messagePayload = {
        chatId: emitChatId,
        // Primary recipient identification
        toSellerId: sellerId,
        toUserId: sellerId, // Backend compatibility - seller is the recipient
        toId: sellerId, // Additional backend compatibility
        // Sender identification
        fromUserId: user.id,
        fromId: user.id, // Additional backend compatibility
        // Message content
        text: trimmed,
        message: trimmed, // Backend compatibility alias
        // Additional context
        productId,
        clientTempId: `me-${now}`,
        // Chat creation metadata (when chatId is undefined)
        ...((!emitChatId) && {
          initiatedBy: 'user',
          participantType: 'user-seller',
          productContext: productId ? { productId, productName } : undefined
        })
      }
      
      console.log('[chat:user->seller] emit SEND_MESSAGE:', {
        chatId: emitChatId ?? '(none - will create new)',
        toSellerId: sellerId,
        fromUserId: user.id,
        hasExistingChat: !!emitChatId,
        productContext: productId,
        payloadKeys: Object.keys(messagePayload)
      })
      
      sendMessage(messagePayload)
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

  if (!token || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
          <p className="text-gray-600 mb-4">Please log in to start a chat</p>
          <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/user')}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gray-900" />
              <h1 className="text-xl font-semibold text-gray-900">
                Chat with {sellerName || 'Seller'}
              </h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {productName && <span>About: {productName}</span>}
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
              <p className="text-gray-500">Start your conversation with {sellerName || 'the seller'}</p>
              {productName && <p className="text-sm text-gray-400 mt-1">About: {productName}</p>}
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
              placeholder={`Message ${sellerName || 'seller'}...`}
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