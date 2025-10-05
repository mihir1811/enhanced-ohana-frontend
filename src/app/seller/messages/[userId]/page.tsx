'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, MessageSquare, Send } from 'lucide-react'
import Link from 'next/link'
import { useAppSelector } from '@/store/hooks'
import { toast } from 'react-hot-toast'
import { useSocket } from '@/components/chat/SocketProvider'
import { CHAT_EVENTS } from '@/components/chat/socket'
import { chatService } from '@/services/chat.service'
import { extractMessageArray, normalizeMessageDto } from '@/services/chat.utils'

type ChatMessage = {
  id: string
  from: 'me' | 'user'
  text: string
  timestamp: number
}

export default function SellerChatWithUserPage() {
  const params = useParams()
  const userId = (params as { userId: string }).userId
  const router = useRouter()
  const { token, user, isSeller } = useAppSelector((state) => state.auth)

  const storageKey = useMemo(() => `chat:user:${userId}:general`, [userId])

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement | null>(null)
  const { socket, sendMessage, connected, register } = useSocket()
  const [serverChatId, setServerChatId] = useState<string | null>(null)

  // Auth gating: require seller role
  useEffect(() => {
    if (!isSeller) {
      toast.error('Please login as a seller to access chat')
    }
  }, [isSeller])

  // Remove localStorage persistence to avoid stale or duplicated state

  // Auto-scroll
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  // Fetch historical messages from backend on load
  useEffect(() => {
    let cancelled = false
    const loadHistory = async () => {
      try {
        if (!user?.id || !userId) return
        const myId = String(user.id)
        const mySellerId = String((user as any)?.sellerData?.id || '')
        const peerId = String(userId)
        const chatsRes = await chatService.listChats({ limit: 50, page: 1 }, token)
        const chatsRaw: any = chatsRes?.data
        const chats: any[] = Array.isArray(chatsRaw)
          ? chatsRaw
          : Array.isArray(chatsRaw?.data)
            ? chatsRaw.data
            : []
        console.log('[chat:history] listChats (seller page):', chats)

        // If listChats already returned messages (message-shaped), map directly
        const isMessageArray = chats.length > 0 && (typeof chats[0]?.message === 'string' || typeof chats[0]?.text === 'string')
        if (isMessageArray) {
          const relevant = chats.filter((dto: any) => {
            const fromId = String(dto?.fromUserId ?? dto?.fromId ?? dto?.from?.id ?? '')
            const toId = String(dto?.toUserId ?? dto?.toId ?? dto?.to?.id ?? '')
            const fromRole = (dto?.from?.role || '').toLowerCase()
            const toRole = (dto?.to?.role || '').toLowerCase()
            const involvesPeer = (fromRole === 'user' && fromId === peerId) || (toRole === 'user' && toId === peerId)
            const involvesMe = (fromId === myId || toId === myId || (mySellerId && (fromId === mySellerId || toId === mySellerId)))
            return involvesPeer && involvesMe
          })
          const mapped = relevant.map((dto: any) => {
            const n = normalizeMessageDto(dto)
            const isFromMe = (n.fromId && (n.fromId === myId || (mySellerId && n.fromId === mySellerId)))
            return {
              id: n.id,
              from: isFromMe ? ('me' as const) : ('user' as const),
              text: n.text,
              timestamp: n.timestamp,
            }
          })
          const sorted = mapped.sort((a, b) => a.timestamp - b.timestamp)
          if (!cancelled) setMessages(sorted)
          return
        }
        const match = chats.find((c) => {
          const hasMeUser = c.participants.some((p) => String(p.id) === myId)
          const hasMeSeller = mySellerId ? c.participants.some((p) => String(p.id) === mySellerId) : false
          const hasMe = hasMeUser || hasMeSeller
          const hasUser = c.participants.some((p) => String(p.id) === peerId)
          const hasUserRole = c.participants.some((p) => (p.role || '').toLowerCase() === 'user')
          const ok = hasMe && (hasUser || hasUserRole)
          if (ok) {
            console.log('[chat:history] candidate match (seller page):', { chatId: c.id, participants: c.participants, hasMeUser, hasMeSeller, hasMe, hasUser, hasUserRole })
          }
          return ok
        })
        const chatId = match?.id
        if (!chatId) {
          console.warn('[chat:history] no chat found for participants (seller page):', { myId, peerId })
        } else {
          console.log('[chat:history] resolved chatId (seller page):', chatId)
        }
        if (chatId) {
          if (!cancelled) setServerChatId(String(chatId))
          const msgsRes = await chatService.getMessages(chatId, { limit: 100, page: 1 }, token)
          const raw: any = msgsRes?.data
          const arr = extractMessageArray(raw)
          const mapped = arr.map((dto: any) => {
            const n = normalizeMessageDto(dto)
            const isFromMe = (n.fromId && (n.fromId === myId || (mySellerId && n.fromId === mySellerId)))
            return {
              id: n.id,
              from: isFromMe ? ('me' as const) : ('user' as const),
              text: n.text,
              timestamp: n.timestamp,
            }
          })
          const sorted = mapped.sort((a, b) => a.timestamp - b.timestamp)
          if (!cancelled) setMessages(sorted)
        }
      } catch (e) {
        console.warn('Failed to load chat history (seller page)', e)
      }
    }
    loadHistory()
    return () => {
      cancelled = true
    }
  }, [userId, user])

  // Ensure socket is registered once user and connection are ready
  useEffect(() => {
    if (!socket || !connected || !user?.id) return
    try {
      console.log('📡 [SellerChat] Manual socket registration with userId:', user.id)
      register(user.id)
      
      // Also register with sellerId if available
      const sellerId = (user as any)?.sellerData?.id
      if (sellerId && sellerId !== user.id) {
        console.log('📡 [SellerChat] Additional registration with sellerId:', sellerId)
        register(sellerId)
      }
    } catch (e) {
      console.error('❌ [SellerChat] Registration error:', e)
    }
  }, [socket, connected, user?.id, register])

  // Listen for incoming messages from backend
  useEffect(() => {
    if (!socket) return
    const onIncoming = (payload: any) => {
      console.log('[chat:seller->user] on MESSAGE (seller page):', payload)
      try {
        const text = payload?.text ?? payload?.message ?? ''
        const ts = payload?.timestamp ?? (payload?.createdAt ? Date.parse(payload.createdAt) : Date.now())
        const fromUserId = payload?.fromUserId ?? payload?.fromId ?? payload?.from?.id
        const toUserId = payload?.toUserId ?? payload?.toId ?? payload?.to?.id
        const myId = user?.id
        const mySellerId = (user as any)?.sellerData?.id

        // Only accept messages that belong to this conversation (me <-> userId)
        if (!myId || !userId) return
        const addressedToMe = String(toUserId) === String(myId) || (mySellerId && String(toUserId) === String(mySellerId))
        const sentByMe = String(fromUserId) === String(myId) || (mySellerId && String(fromUserId) === String(mySellerId))
        const isRelevant = (String(fromUserId) === String(userId) && addressedToMe)
          || (sentByMe && String(toUserId) === String(userId))
        console.log('[chat:seller->user] relevance check:', { myId, mySellerId, userId, fromUserId, toUserId, addressedToMe, sentByMe, isRelevant })
        if (!isRelevant) return

        const isFromMe = sentByMe
        setMessages((prev) => [
          ...prev,
          {
            id: String(payload?.id ?? `srv-${ts}`),
            from: isFromMe ? 'me' : 'user',
            text,
            timestamp: ts,
          },
        ])
      } catch (e) {
        // ignore malformed payloads
      }
    }
    socket.on(CHAT_EVENTS.SERVER.MESSAGE, onIncoming)
    return () => {
      socket.off(CHAT_EVENTS.SERVER.MESSAGE, onIncoming)
    }
  }, [socket, user, userId])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    const now = Date.now()
    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      { id: `me-${now}`, from: 'me', text: trimmed, timestamp: now },
    ])

    // Emit to backend
    try {
      const emitChatId = serverChatId || undefined
      console.log('[chat:seller->user] emit SEND_MESSAGE (seller page):', {
        chatId: emitChatId ?? '(none)',
        toUserId: userId,
        text: trimmed,
        clientTempId: `me-${now}`,
      })
      sendMessage({
        chatId: emitChatId,
        toUserId: userId,
        text: trimmed,
        clientTempId: `me-${now}`,
      })
    } catch (e) {
      // If socket not connected, we keep local only
    }
    setInput('')
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isSeller) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Seller Chat</h1>
              <p className="text-sm text-gray-600">Please login as a seller to access this chat.</p>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 p-6 bg-white">
            <p className="mb-4 text-gray-900">You must be logged in as a seller to use chat.</p>
            <div className="flex items-center gap-3">
              <Link href="/login" className="px-4 py-2 rounded-md font-medium bg-blue-600 hover:bg-blue-700 text-white">
                Login
              </Link>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 rounded-md font-medium border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-gray-900" />
                <h1 className="text-xl font-semibold text-gray-900">Chat with User</h1>
              </div>
              <p className="text-sm text-gray-600">User ID: {userId}{connected ? ' • Online' : ' • Offline'}</p>
            </div>
          </div>
        </div>

        {/* Chat window */}
        <div className="rounded-xl border border-gray-200 flex flex-col bg-white">
          <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm shadow-sm ${m.from === 'me' ? 'rounded-br-sm bg-blue-600 text-white' : 'rounded-bl-sm bg-gray-100 text-gray-800'}`}
                >
                  <p>{m.text}</p>
                  <p className="text-[11px] mt-1 opacity-70">{new Date(m.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input area */}
          <div className="border-t border-gray-200 p-3 flex items-center gap-2 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md font-medium bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}