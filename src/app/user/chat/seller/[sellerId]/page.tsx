'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, MessageSquare, Send } from 'lucide-react'
import Link from 'next/link'
import { useAppSelector } from '@/store/hooks'
import { toast } from 'react-hot-toast'
import { useSocket } from '@/components/chat/SocketProvider'
import { CHAT_EVENTS } from '@/components/chat/socket'
import { chatService } from '@/services/chat.service'

type ChatMessage = {
  id: string
  from: 'me' | 'seller'
  text: string
  timestamp: number
  senderRole?: string
  receiverRole?: string
}

export default function UserChatWithSellerPage() {
  const params = useParams()
  const sellerId = (params as { sellerId: string }).sellerId
  const searchParams = useSearchParams()
  const router = useRouter()
  const { token, user } = useAppSelector((state) => state.auth)

  const productId = searchParams.get('productId') || ''
  const productName = searchParams.get('productName') || ''

  const storageKey = useMemo(() => `chat:${sellerId}:${productId || 'general'}`,[sellerId, productId])

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement | null>(null)
  const { socket, sendMessage, connected, register } = useSocket()
  const [serverChatId, setServerChatId] = useState<string | null>(null)
  const [chatSummaries, setChatSummaries] = useState<any[]>([])
  const [sellerDisplayName, setSellerDisplayName] = useState<string>('Seller')
  // Cache of sellerId -> display name for the left pane
  const [sellerDirectory, setSellerDirectory] = useState<Record<string, string>>({})

  // Pagination state (dynamic via URL params, manageable in state)
  const initialMsgLimit = useMemo(() => {
    const v = Number(searchParams.get('limit'))
    return Number.isFinite(v) && v > 0 ? v : 20
  }, [searchParams])
  const initialMsgPage = useMemo(() => {
    const v = Number(searchParams.get('page'))
    return Number.isFinite(v) && v > 0 ? v : 1
  }, [searchParams])
  const initialChatsLimit = useMemo(() => {
    const v = Number(searchParams.get('chatsLimit'))
    return Number.isFinite(v) && v > 0 ? v : 50
  }, [searchParams])
  const initialChatsPage = useMemo(() => {
    const v = Number(searchParams.get('chatsPage'))
    return Number.isFinite(v) && v > 0 ? v : 1
  }, [searchParams])
  const [messageLimit, setMessageLimit] = useState<number>(initialMsgLimit)
  const [messagePage, setMessagePage] = useState<number>(initialMsgPage)
  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(false)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const [chatsLimit, setChatsLimit] = useState<number>(initialChatsLimit)
  const [chatsPage, setChatsPage] = useState<number>(initialChatsPage)
  const [skipNextAutoScroll, setSkipNextAutoScroll] = useState<boolean>(false)

  // Keep pagination state in sync with URL if it changes
  useEffect(() => {
    setMessageLimit(initialMsgLimit)
    setMessagePage(initialMsgPage)
    setChatsLimit(initialChatsLimit)
    setChatsPage(initialChatsPage)
  }, [initialMsgLimit, initialMsgPage, initialChatsLimit, initialChatsPage])

  // Auth gating: allow any logged-in user, prompt otherwise
  useEffect(() => {
    if (!token) {
      toast.error('Please login to access chat')
    }
  }, [token])

  // Load persisted messages
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(storageKey) : null
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[]
        setMessages(parsed)
      } else {
        // Seed with a friendly welcome including product context if available
        setMessages([
          {
            id: `seed-${Date.now()}`,
            from: 'seller',
            text: productName ? `Hi! How can I help with “${productName}”?` : 'Hi! How can I help today?',
            timestamp: Date.now(),
          },
        ])
      }
    } catch (e) {
      // ignore parse errors
    }
  }, [storageKey, productName])

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
    if (skipNextAutoScroll) {
      // Skip one auto-scroll when we prepend older history
      setSkipNextAutoScroll(false)
      return
    }
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, skipNextAutoScroll])

  // Fetch historical messages from backend on load
  useEffect(() => {
    let cancelled = false
    const loadHistory = async () => {
      try {
        if (!token || !user?.id) return
        const myId = String(user.id)
        const sellerIdStr = String(sellerId)
        // Request chats with dynamic pagination state
        const chatsRes = await chatService.listChats({ limit: chatsLimit, page: chatsPage }, token)
        const chatsRaw: any = chatsRes?.data
        const chats: any[] = Array.isArray(chatsRaw)
          ? chatsRaw
          : Array.isArray(chatsRaw?.data)
            ? chatsRaw.data
            : []
        console.log('[chat:history] listChats (user page):', chats)
        if (!cancelled) setChatSummaries(chats)

        // Determine shape: chat summaries vs message array
        const isSummaryArray = chats.length > 0 && Array.isArray(chats[0]?.participants)
        const isMessageArray = chats.length > 0 && (typeof chats[0]?.message === 'string' || typeof chats[0]?.text === 'string')

        if (isMessageArray) {
          // Use listChats messages directly for this thread
          const mapped = chats.map((dto: any) => {
            const fromId = String(dto?.fromUserId ?? dto?.fromId ?? dto?.from?.id ?? '')
            const isFromMe = fromId === myId
            const text = dto?.text ?? dto?.message ?? ''
            const ts = dto?.timestamp ?? (dto?.createdAt ? Date.parse(dto.createdAt) : Date.now())
            const senderRole = dto?.from?.role || (isFromMe ? 'user' : 'seller')
            const receiverRole = dto?.to?.role || (isFromMe ? 'seller' : 'user')
            return {
              id: String(dto?.id ?? `${fromId}-${ts}`),
              from: isFromMe ? ('me' as const) : ('seller' as const),
              text,
              timestamp: ts,
              senderRole,
              receiverRole,
            }
          })
          if (!cancelled) setMessages(mapped)
          return
        }

        if (isSummaryArray) {
          const match = chats.find((c) => {
            const hasMe = c.participants?.some((p: any) => String(p.id) === myId)
            const hasSellerByRoleAndId = c.participants?.some((p: any) => (p?.role || '').toLowerCase() === 'seller' && String(p?.id) === sellerIdStr)
            const ok = Boolean(hasMe && hasSellerByRoleAndId)
            if (ok) {
              console.log('[chat:history] candidate match (user page):', { chatId: c.id, participants: c.participants, hasMe, hasSellerByRoleAndId })
            }
            return ok
          })
          const chatId = match?.id
          if (!chatId) {
            console.warn('[chat:history] no chat found for participants (user page):', { myId, sellerId: sellerIdStr })
          } else {
            console.log('[chat:history] resolved chatId (user page):', chatId)
          }
          if (chatId) {
            if (!cancelled) setServerChatId(String(chatId))
            // Fetch messages using dynamic pagination state
            const msgsRes = await chatService.getMessages(chatId, { limit: messageLimit, page: messagePage }, token)
            const raw1: any = msgsRes?.data
            console.log('[chat:history] getMessages (user page):', raw1)
            // Support legacy array, { data: [...] }, and { data: { data: [...] } }
            const arr1: any[] = Array.isArray(raw1)
              ? raw1
              : Array.isArray(raw1?.data)
                ? raw1.data
                : Array.isArray(raw1?.data?.data)
                  ? raw1.data.data
                  : []

            const mapped = arr1.map((dto: any) => {
              const fromId = String(dto?.fromUserId ?? dto?.fromId ?? dto?.from?.id ?? '')
              const isFromMe = fromId === myId
              const text = dto?.text ?? dto?.message ?? ''
              const ts = dto?.timestamp ?? (dto?.createdAt ? Date.parse(dto.createdAt) : Date.now())
              const senderRole = dto?.from?.role || (isFromMe ? 'user' : 'seller')
              const receiverRole = dto?.to?.role || (isFromMe ? 'seller' : 'user')
              return {
                id: String(dto?.id ?? `${fromId}-${ts}`),
                from: isFromMe ? ('me' as const) : ('seller' as const),
                text,
                timestamp: ts,
                senderRole,
                receiverRole,
              }
            })
            if (!cancelled) {
              const sorted = [...mapped].sort((a, b) => a.timestamp - b.timestamp)
              setMessages(sorted)
              setHasMoreMessages(arr1.length >= messageLimit)
            }
          }
        }
      } catch (e) {
        console.warn('Failed to load chat history (user page)', e)
      }
    }
    loadHistory()
    return () => {
      cancelled = true
    }
  }, [token, sellerId, user, chatsLimit, chatsPage, messageLimit, messagePage])

  // Load older messages (next page)
  const loadMoreMessages = async () => {
    try {
      if (!token || !serverChatId) return
      setLoadingMore(true)
      const nextPage = messagePage + 1
      const res = await chatService.getMessages(serverChatId, { limit: messageLimit, page: nextPage }, token)
      const raw: any = res?.data
      const arr: any[] = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw?.data?.data)
            ? raw.data.data
            : []
      const mapped: ChatMessage[] = arr.map((dto: any) => {
        const fromId = String(dto?.fromUserId ?? dto?.fromId ?? dto?.from?.id ?? '')
        const isFromMe = fromId === String(user?.id ?? '')
        const text = dto?.text ?? dto?.message ?? ''
        const ts = dto?.timestamp ?? (dto?.createdAt ? Date.parse(dto.createdAt) : Date.now())
        const senderRole = dto?.from?.role || (isFromMe ? 'user' : 'seller')
        const receiverRole = dto?.to?.role || (isFromMe ? 'seller' : 'user')
        return {
          id: String(dto?.id ?? `${fromId}-${ts}`),
          from: isFromMe ? 'me' : 'seller',
          text,
          timestamp: ts,
          senderRole,
          receiverRole,
        }
      })
      // Merge, de-duplicate by id, and sort by timestamp asc
      const mergedMap = new Map<string, ChatMessage>()
      for (const m of [...messages, ...mapped]) mergedMap.set(m.id, m)
      const merged = Array.from(mergedMap.values()).sort((a, b) => a.timestamp - b.timestamp)
      // Avoid auto-scroll when prepending older messages
      setSkipNextAutoScroll(true)
      setMessages(merged)
      setMessagePage(nextPage)
      setHasMoreMessages(mapped.length >= messageLimit)
    } catch (e) {
      console.warn('Failed to load more messages', e)
    } finally {
      setLoadingMore(false)
    }
  }

  // Build seller directory (id -> name) whenever chatSummaries change
  useEffect(() => {
    let cancelled = false
    const collectSellerIds = () => {
      const ids = new Set<string>()
      for (const c of chatSummaries) {
        // Summary-shaped: participants array
        if (Array.isArray(c?.participants)) {
          const sellerP = (c?.participants || []).find((p: any) => (p?.role || '').toLowerCase() === 'seller')
          if (sellerP?.id) ids.add(String(sellerP.id))
          continue
        }
        // Message-shaped: from/to objects with roles
        const fromRole = (c?.from?.role || '').toLowerCase()
        const toRole = (c?.to?.role || '').toLowerCase()
        const sellerIdCandidate = fromRole === 'seller' ? c?.from?.id : toRole === 'seller' ? c?.to?.id : undefined
        if (sellerIdCandidate) ids.add(String(sellerIdCandidate))
      }
      return Array.from(ids)
    }

    const ids = collectSellerIds().filter((id) => !!id && !sellerDirectory[id])
    if (ids.length === 0) return

    const fetchNames = async () => {
      const updates: Record<string, string> = {}
      for (const id of ids) {
        // Try to get a name from any message first to avoid extra network calls
        const fromMsg = chatSummaries.find((c) => c?.from?.id && String(c.from.id) === String(id) && c?.from?.name)
        const toMsg = chatSummaries.find((c) => c?.to?.id && String(c.to.id) === String(id) && c?.to?.name)
        const localName = (fromMsg?.from?.name as string) || (toMsg?.to?.name as string)
        if (localName) {
          updates[id] = localName
          continue
        }
        // No external fetch; fall back to a generic label
        updates[id] = updates[id] || `Seller ${String(id).slice(0, 6)}`
      }
      if (!cancelled && Object.keys(updates).length > 0) {
        setSellerDirectory((prev) => ({ ...prev, ...updates }))
      }
    }

    fetchNames()
    return () => { cancelled = true }
  }, [chatSummaries, sellerDirectory])

  // Listen for incoming messages from backend
  useEffect(() => {
    if (!socket) return
    const onIncoming = (payload: any) => {
      console.log('[chat:user->seller] on MESSAGE (user page):', payload)
      try {
        const text = payload?.text ?? payload?.message ?? ''
        const ts = payload?.timestamp ?? (payload?.createdAt ? Date.parse(payload.createdAt) : Date.now())
        const fromUserId = payload?.fromUserId ?? payload?.fromId ?? payload?.from?.id
        const toUserId = payload?.toUserId ?? payload?.toId ?? payload?.to?.id
        const myId = user?.id
        const sellerIdStr = String(sellerId)
        const fromRole = (payload?.from?.role || '').toLowerCase()
        const toRole = (payload?.to?.role || '').toLowerCase()
        const fromSellerMatch = fromRole === 'seller' && String(payload?.from?.id ?? fromUserId) === sellerIdStr
        const toSellerMatch = toRole === 'seller' && String(payload?.to?.id ?? toUserId) === sellerIdStr
        const involvesMe = myId ? (String(fromUserId) === String(myId) || String(toUserId) === String(myId)) : true
        const isRelevant = (fromSellerMatch || toSellerMatch) && involvesMe
        console.log('[chat:user->seller] relevance check:', { myId, sellerId: sellerIdStr, fromUserId, toUserId, fromRole, toRole, isRelevant })
        if (!isRelevant) return

        const isFromMe = myId && (String(fromUserId) === String(myId))
        const senderRole = payload?.from?.role || (isFromMe ? 'user' : 'seller')
        const receiverRole = payload?.to?.role || (isFromMe ? 'seller' : 'user')
        setMessages((prev) => [...prev, {
          id: String(payload?.id ?? `srv-${ts}`),
          from: isFromMe ? 'me' : 'seller',
          text,
          timestamp: ts,
          senderRole,
          receiverRole,
        }])
      } catch (e) {
        // ignore malformed payloads
      }
    }
    socket.on(CHAT_EVENTS.SERVER.MESSAGE, onIncoming)
    return () => {
      socket.off(CHAT_EVENTS.SERVER.MESSAGE, onIncoming)
    }
  }, [socket, user, sellerId])

  // Ensure socket is registered once user and connection are ready
  useEffect(() => {
    if (!socket || !connected || !user?.id) return
    try {
      register(user.id)
    } catch {}
  }, [socket, connected, user?.id])

  // Derive seller display name from chat summaries/messages; avoid extra network calls
  useEffect(() => {
    let nameFromChats: string | undefined
    for (const c of chatSummaries) {
      if (Array.isArray(c?.participants)) {
        const sellerP = (c?.participants || []).find((p: any) => (p?.role || '').toLowerCase() === 'seller' && String(p?.id) === String(sellerId))
        if (sellerP?.name) { nameFromChats = String(sellerP.name); break }
      } else {
        const fromRole = (c?.from?.role || '').toLowerCase()
        const toRole = (c?.to?.role || '').toLowerCase()
        const sellerObj = fromRole === 'seller' ? c?.from : toRole === 'seller' ? c?.to : undefined
        if (sellerObj && String(sellerObj?.id) === String(sellerId) && sellerObj?.name) { nameFromChats = String(sellerObj.name); break }
      }
    }
    setSellerDisplayName(nameFromChats || `Seller ${String(sellerId).slice(0, 6)}`)
  }, [chatSummaries, sellerId])

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
      console.log('[chat:user->seller] emit SEND_MESSAGE (user page):', {
        chatId: emitChatId ?? '(none)',
        toSellerId: sellerId,
        productId,
        text: trimmed,
        clientTempId: `me-${now}`,
      })
      // Route by sellerId and roles; no need to resolve seller userId
      sendMessage({
        chatId: emitChatId,
        toSellerId: sellerId,
        productId,
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

  if (false && !token) { 
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
              <h1 className="text-xl font-semibold text-gray-900">Chat with Seller</h1>
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
    <div className="h-[calc(100vh-120px)] bg-gray-50 flex flex-col">
      <div className="max-w-6xl mx-auto px-4 py-6 flex-1 overflow-hidden w-full flex flex-col">
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
                <h1 className="text-xl font-semibold text-gray-900">Chat with {sellerDisplayName}</h1>
              </div>
              <p className="text-sm text-gray-600">Seller ID: {sellerId} • {connected ? 'Online' : 'Offline'}</p>
            </div>
          </div>
        </div>

        {/* Auth notice for logged-out users */}
        {!token && (
          <div className="mb-3 rounded-md border border-amber-300 bg-amber-50 text-amber-800 px-3 py-2 text-sm">
            You are not logged in. Login to send messages.
          </div>
        )}

        {/* Two-pane layout (pure flex) */}
        <div className="flex flex-col md:flex-row gap-4 flex-1 overflow-hidden h-full">
          {/* Conversations list (header fixed, list scrolls) */}
          <div className="rounded-xl border border-gray-200 bg-white md:h-full h-[35vh] md:w-80 flex-shrink-0 p-4 flex flex-col">
            {(productId || productName) && (
              <div className="rounded-md border border-gray-200 p-3 mb-3">
                <p className="text-xs text-gray-600">Product context</p>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-gray-900">{productName || `Product #${productId}`}</h2>
                  {productId && (
                    <Link
                      href={`/diamonds/${productId}`}
                      className="px-2 py-1 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      View
                    </Link>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-gray-700" />
              <h2 className="text-sm font-medium text-gray-900">Your Conversations</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
            {Array.isArray(chatSummaries) && chatSummaries.length > 0 ? (
              <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {(() => {
                  // Group conversations by sellerId, showing one entry per seller
                  const groups = new Map<string, { sellerId: string; sellerName: string; lastText: string; lastTime: string }>()
                  for (const c of chatSummaries) {
                    let sid: string | undefined
                    let sname: string | undefined
                    let lastText = ''
                    let lastTime = ''
                    // Summary-shaped
                    if (Array.isArray(c?.participants)) {
                      const sellerP = (c?.participants || []).find((p: any) => (p?.role || '').toLowerCase() === 'seller')
                      sid = sellerP?.id ? String(sellerP.id) : undefined
                      sname = sid ? sellerDirectory[sid] : undefined
                      lastText = c?.lastMessage?.text || c?.lastMessage?.message || ''
                      lastTime = c?.lastMessage?.timestamp
                        ? new Date(c.lastMessage.timestamp).toLocaleString()
                        : (c?.lastMessage?.createdAt ? new Date(c.lastMessage.createdAt).toLocaleString() : '')
                    } else {
                      // Message-shaped
                      const fromRole = (c?.from?.role || '').toLowerCase()
                      const toRole = (c?.to?.role || '').toLowerCase()
                      const sellerObj = fromRole === 'seller' ? c?.from : toRole === 'seller' ? c?.to : undefined
                      sid = sellerObj?.id ? String(sellerObj.id) : undefined
                      sname = sellerObj?.name || (sid ? sellerDirectory[sid] : undefined)
                      lastText = c?.text || c?.message || ''
                      lastTime = c?.timestamp
                        ? new Date(c.timestamp).toLocaleString()
                        : (c?.createdAt ? new Date(c.createdAt).toLocaleString() : '')
                    }
                    if (!sid) continue
                    const prev = groups.get(sid)
                    // Prefer the most recent by time string compare is not ideal; we replace if not set
                    if (!prev) {
                      groups.set(sid, {
                        sellerId: sid,
                        sellerName: sname || `Seller ${sid.slice(0, 6)}`,
                        lastText,
                        lastTime,
                      })
                    } else {
                      // Update last message preview if this item looks newer or has text
                      const updated = {
                        sellerId: prev.sellerId,
                        sellerName: prev.sellerName || sname || `Seller ${sid.slice(0, 6)}`,
                        lastText: lastText || prev.lastText,
                        lastTime: lastTime || prev.lastTime,
                      }
                      groups.set(sid, updated)
                    }
                  }
                  const items = Array.from(groups.values())
                  return items.map((g) => {
                    const isSelected = String(g.sellerId) === String(sellerId)
                    const base = 'rounded-md cursor-pointer'
                    const touch = 'px-3 py-3 md:py-2'
                    const colors = isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'
                    return (
                      <li
                        key={g.sellerId}
                        className={`${base} ${touch} ${colors}`}
                        role="button"
                        aria-current={isSelected ? 'true' : undefined}
                        data-seller-id={g.sellerId}
                        onClick={() => {
                          const target = String(g.sellerId)
                          const current = String(sellerId)
                          if (target !== current) {
                            router.push(`/user/chat/seller/${encodeURIComponent(target)}`)
                          }
                        }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{g.sellerName}</p>
                            <p className="text-sm text-gray-600 truncate">{g.lastText || 'No messages yet'}</p>
                            {g.lastTime && <p className="text-xs text-gray-400">{g.lastTime}</p>}
                          </div>
                          {isSelected && (
                            <span className="text-xs font-medium text-blue-700">Selected</span>
                          )}
                        </div>
                      </li>
                    )
                  })
                })()}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">No conversations found.</p>
            )}
            </div>
          </div>

          {/* Chat window (messages scroll independently) */}
          <div className="flex-1 rounded-xl border border-gray-200 flex flex-col bg-white h-full">
            <div ref={listRef} className="flex-1 min-h-0 overflow-y-auto p-3 md:p-4 space-y-3">
              {hasMoreMessages && (
                <div className="flex justify-center">
                  <button
                    onClick={loadMoreMessages}
                    disabled={loadingMore}
                    className="px-3 py-1.5 text-xs rounded-md border border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                  >
                    {loadingMore ? 'Loading…' : 'Load older messages'}
                  </button>
                </div>
              )}
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] md:max-w-[75%] px-3 py-2 rounded-2xl text-sm shadow-sm ${m.from === 'me' ? 'rounded-br-sm bg-blue-600 text-white' : 'rounded-bl-sm bg-gray-100 text-gray-800'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${m.from === 'me' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-800'}`}>
                        {m.from === 'me' ? 'You' : (m.senderRole ? m.senderRole.toUpperCase() : 'SELLER')}
                      </span>
                      {m.receiverRole && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-200 text-gray-800">
                          → {m.receiverRole.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <p className="break-words">{m.text}</p>
                    <p className="text-[11px] mt-1 opacity-70">{new Date(m.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input area (fixed at bottom like WhatsApp/Instagram) */}
            <div className="border-t border-gray-200 p-2 md:p-3 flex items-center gap-2 bg-white sticky bottom-0 z-10">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${sellerDisplayName}…`}
                className="flex-1 px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!token}
              />
              <button
                onClick={handleSend}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-md font-medium text-white ${!token ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                disabled={!token}
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}