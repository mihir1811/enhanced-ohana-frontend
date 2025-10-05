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
  const { connected } = useSocket()

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState<string>('')
  const [chats, setChats] = useState<ChatSummary[]>([])

  const myId = user?.id

  useEffect(() => {
    let active = true
    const run = async () => {
      if (!token || !isSeller) {
        setError('Please login as a seller to view messages')
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const res: ApiResponse<ChatSummary[]> = await chatService.listChats(token)
        if (!active) return
        const data = Array.isArray(res?.data) ? res.data : []
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
  }, [token, isSeller])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return chats
      .filter((c) => (c?.participants || []).some((p) => String(p.id) === String(myId)))
      .map((c) => {
        const other = (c.participants || []).find((p) => String(p.id) !== String(myId))
        return {
          chatId: c.id,
          otherId: other?.id ? String(other.id) : undefined,
          otherLabel: other?.id ? `User ${other.id}` : 'Unknown user',
          lastText: c.lastMessage?.text || '',
          lastTime: c.lastMessage?.timestamp ? new Date(c.lastMessage.timestamp).toLocaleString() : '',
          unread: c.unreadCount || 0,
        }
      })
      .filter((c) => (q ? c.otherLabel.toLowerCase().includes(q) || c.lastText.toLowerCase().includes(q) : true))
  }, [chats, search, myId])

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
