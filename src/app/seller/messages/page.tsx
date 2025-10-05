'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { chatService } from '@/services/chat.service'
import type { ApiResponse } from '@/services/api'
import type { ChatSummary } from '@/services/chat.service'
import { MessageSquare, Search, Wifi } from 'lucide-react'
import { useSocket } from '@/components/chat/SocketProvider'

export default function SellerMessagesPage() {
  const router = useRouter()
  const { token, user, isSeller } = useAppSelector((s) => s.auth)
  const { connected, register, socket } = useSocket()

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState<string>('')
  const [chats, setChats] = useState<any[]>([])

  const myId = user?.id
  const mySellerId = String((user as any)?.sellerData?.id || '')

  // Ensure socket is registered once user and connection are ready
  useEffect(() => {
    if (!socket || !connected || !user?.id) return
    try {
      console.log('📡 [SellerMessages] Manual socket registration with userId:', user.id)
      register(user.id)
      
      // Also register with sellerId if available
      const sellerId = (user as any)?.sellerData?.id
      if (sellerId && sellerId !== user.id) {
        console.log('📡 [SellerMessages] Additional registration with sellerId:', sellerId)
        register(sellerId)
      }
    } catch (e) {
      console.error('❌ [SellerMessages] Registration error:', e)
    }
  }, [socket, connected, user?.id, register])

  useEffect(() => {
    let active = true
    const run = async () => {
      if (!isSeller) {
        setError('Please login as a seller to view messages')
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const res: ApiResponse<ChatSummary[]> = await chatService.listChats({ limit: 50, page: 1 }, token)
        if (!active) return
        const raw = res?.data as any
        const data = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : [])
        setChats(data)
      } catch (e: any) {
        setError(e?.message || 'Failed to load conversations')
      } finally {
        if (active) setLoading(false)
      }
    }
    run()
    return () => {
      active = false
    }
  }, [isSeller, token])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const isMessageArray = chats.length > 0 && (typeof chats[0]?.message === 'string' || typeof chats[0]?.text === 'string')
    if (isMessageArray) {
      const groups = new Map<string, { otherId: string; otherLabel: string; lastText: string; lastTimestamp: number; unread: number }>()
      for (const dto of chats) {
        const fromId = String(dto?.fromUserId ?? dto?.fromId ?? dto?.from?.id ?? '')
        const toId = String(dto?.toUserId ?? dto?.toId ?? dto?.to?.id ?? '')
        const fromRole = (dto?.from?.role || '').toLowerCase()
        const toRole = (dto?.to?.role || '').toLowerCase()
        const involvesMe = (fromId === String(myId) || toId === String(myId) || (mySellerId && (fromId === String(mySellerId) || toId === String(mySellerId))))
        if (!involvesMe) continue
        const otherId = fromRole === 'user' ? fromId : toRole === 'user' ? toId : ''
        if (!otherId) continue
        const labelRole = fromRole === 'user' ? 'User' : toRole === 'user' ? 'User' : 'Unknown'
        const label = `${labelRole} ${otherId}`
        const ts = (typeof dto?.timestamp === 'number') ? dto.timestamp : (dto?.createdAt ? Date.parse(dto.createdAt) : Date.now())
        const text = dto?.text ?? dto?.message ?? ''
        const existing = groups.get(otherId)
        if (!existing || ts > existing.lastTimestamp) {
          groups.set(otherId, { otherId, otherLabel: label, lastText: text, lastTimestamp: ts, unread: 0 })
        }
      }
      const items = Array.from(groups.values())
        .filter((c) => (q ? c.otherLabel.toLowerCase().includes(q) || c.lastText.toLowerCase().includes(q) : true))
        .sort((a, b) => b.lastTimestamp - a.lastTimestamp)
        .map((c) => ({ chatId: c.otherId, otherId: c.otherId, otherLabel: c.otherLabel, lastText: c.lastText, lastTime: new Date(c.lastTimestamp).toLocaleString(), lastTimestamp: c.lastTimestamp, unread: c.unread }))
      return items
    }
    const items = chats
      .filter((c) => {
        const parts = c?.participants || []
        const hasMeUser = parts.some((p: any) => String(p.id) === String(myId))
        const hasMeSeller = mySellerId ? parts.some((p: any) => String(p.id) === String(mySellerId)) : false
        return hasMeUser || hasMeSeller
      })
      .map((c) => {
        const other = (c.participants || []).find((p: any) => String(p.id) !== String(myId) && String(p.id) !== String(mySellerId))
        const lastTs = ((): number | undefined => {
          const lm: any = c.lastMessage || {}
          if (typeof lm?.timestamp === 'number') return lm.timestamp
          if (lm?.createdAt) {
            const parsed = Date.parse(lm.createdAt)
            return Number.isNaN(parsed) ? undefined : parsed
          }
          return undefined
        })()
        return {
          chatId: c.id,
          otherId: other?.id ? String(other.id) : undefined,
          otherLabel: other?.id ? `${(other?.role || 'user').toString().charAt(0).toUpperCase() + (other?.role || 'user').toString().slice(1)} ${other.id}` : 'Unknown',
          lastText: (c.lastMessage as any)?.text || (c.lastMessage as any)?.message || '',
          lastTime: lastTs ? new Date(lastTs).toLocaleString() : '',
          lastTimestamp: lastTs || 0,
          unread: c.unreadCount || 0,
        }
      })
      .filter((c) => (q ? c.otherLabel.toLowerCase().includes(q) || c.lastText.toLowerCase().includes(q) : true))
      .sort((a, b) => (b.lastTimestamp - a.lastTimestamp))
    return items
  }, [chats, search, myId, mySellerId])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          <h1 className="text-xl font-semibold">Messages</h1>
          <span className={`inline-flex items-center gap-1 text-sm ${connected ? 'text-green-600' : 'text-gray-500'}`}>
            <Wifi className="w-4 h-4" />
            {connected ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Two-pane layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Conversations list */}
        <div className="md:col-span-1 rounded-xl border p-3" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          {/* Search */}
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users or messages"
                className="w-full pl-8 pr-3 py-2 rounded-md border bg-white text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-4 text-center text-sm text-gray-600">Loading conversations…</div>
          ) : error ? (
            <div className="p-4 text-center text-sm text-red-600">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-600">No conversations yet.</div>
          ) : (
            <ul className="divide-y">
              {filtered.map((c) => (
                <li key={c.chatId} className="py-3">
                  <button
                    className="w-full text-left flex items-center gap-3"
                    onClick={() => {
                      if (c.otherId) router.push(`/seller/messages/${c.otherId}`)
                    }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{c.otherLabel}</span>
                        {c.unread > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-blue-600 text-white">
                            {c.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{c.lastText || 'No messages yet'}</p>
                      <p className="text-xs text-gray-400">{c.lastTime}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Message pane placeholder */}
        <div className="md:col-span-2 rounded-xl border p-6 flex items-center justify-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="text-center max-w-md">
            <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
            <p className="text-sm text-gray-600">Choose a user on the left to open the chat thread. New messages will appear in real time.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
