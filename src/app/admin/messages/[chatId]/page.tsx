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

type ChatMessage = {
  id: string
  from: 'me' | 'other'
  text: string
  timestamp: number
}

export default function AdminChatDetailPage() {
  const params = useParams()
  const chatId = (params as { chatId: string }).chatId
  const router = useRouter()
  const { token, user } = useAppSelector((state) => state.auth)

  const storageKey = useMemo(() => `admin:chat:${chatId}`, [chatId])

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement | null>(null)
  const { socket, sendMessage, connected } = useSocket()

  // Auth gating
  useEffect(() => {
    if (!token) {
      toast.error('Please login to access admin chat')
    }
  }, [token])

  // Load persisted messages
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(storageKey) : null
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[]
        setMessages(parsed)
      }
    } catch (e) {
      // ignore parse errors
    }
  }, [storageKey])

  // Persist on change
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(storageKey, JSON.stringify(messages))
      }
    } catch (e) {
      // ignore
    }
  }, [messages, storageKey])

  // Auto-scroll
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  // Fetch historical messages from backend on load by chatId
  useEffect(() => {
    let cancelled = false
    const loadHistory = async () => {
      try {
        if (!token || !user?.id || !chatId) return
        const msgsRes = await chatService.getMessages(chatId, token)
        const myId = String(user.id)
        const raw: any = msgsRes?.data
        // Support legacy array, { data: [...] }, and { data: { data: [...] } }
        const arr: any[] = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
            ? raw.data
            : Array.isArray(raw?.data?.data)
              ? raw.data.data
              : []
        const mapped = arr.map((dto: any) => {
          const fromId = String(dto?.fromUserId ?? dto?.fromId ?? dto?.from?.id ?? '')
          const isFromMe = fromId === myId
          const text = dto?.text ?? dto?.message ?? ''
          const ts = dto?.timestamp ?? (dto?.createdAt ? Date.parse(dto.createdAt) : Date.now())
          return {
            id: String(dto?.id ?? `${fromId}-${ts}`),
            from: isFromMe ? ('me' as const) : ('other' as const),
            text,
            timestamp: ts,
          }
        })
        if (!cancelled) setMessages(mapped)
      } catch (e) {
        console.warn('Failed to load chat history (admin page)', e)
      }
    }
    loadHistory()
    return () => {
      cancelled = true
    }
  }, [token, chatId, user])

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return
    const onIncoming = (payload: any) => {
      try {
        const text = payload?.text ?? payload?.message ?? ''
        const ts = payload?.timestamp ?? (payload?.createdAt ? Date.parse(payload.createdAt) : Date.now())
        const fromUserId = payload?.fromUserId ?? payload?.fromId ?? payload?.from?.id
        const myId = user?.id
        const isFromMe = myId && (String(fromUserId) === String(myId))
        setMessages((prev) => [...prev, {
          id: String(payload?.id ?? `srv-${ts}`),
          from: isFromMe ? 'me' : 'other',
          text,
          timestamp: ts,
        }])
      } catch (e) {
        // ignore malformed payloads
      }
    }
    socket.on(CHAT_EVENTS.SERVER.MESSAGE, onIncoming)
    return () => {
      socket.off(CHAT_EVENTS.SERVER.MESSAGE, onIncoming)
    }
  }, [socket, user])

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
      sendMessage({
        chatId,
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

  if (!token) {
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
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-gray-900" />
                <h1 className="text-xl font-semibold text-gray-900">Admin Chat</h1>
              </div>
              <p className="text-sm text-gray-600">Please login to access this chat.</p>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 p-6 bg-white">
            <p className="mb-4 text-gray-900">You must be logged in to use chat.</p>
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
              onClick={() => router.push('/admin/messages')}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-gray-900" />
                <h1 className="text-xl font-semibold text-gray-900">Chat</h1>
              </div>
              <p className="text-sm text-gray-600">Chat ID: {chatId}{connected ? ' • Online' : ' • Offline'}</p>
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
          <div className="border-t border-gray-200 p-3 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message"
              className="flex-1 px-3 py-2 rounded-md border text-sm"
            />
            <button
              onClick={handleSend}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
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