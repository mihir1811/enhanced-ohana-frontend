'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { chatService } from '@/services/chat.service'
import type { ApiResponse } from '@/services/api'
import type { ChatSummary } from '@/services/chat.service'
import { MessageSquare, Search, Wifi } from 'lucide-react'
import { useSocket } from '@/components/chat/SocketProvider'
import { userProfileService } from '@/services'

type ConversationItem = {
  chatId: string
  participantsLabel: string
  lastText: string
  lastTime: string
  unread: number
}

export default function AdminMessagesPage() {
  const router = useRouter()
  const { token } = useAppSelector((s) => s.auth)
  const { connected } = useSocket()
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [chats, setChats] = useState<ChatSummary[]>([])
  const [nameMap, setNameMap] = useState<Record<string, string>>({})

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!token) return
      setLoading(true)
      try {
        const res: ApiResponse<ChatSummary[]> = await chatService.listChats({ limit: 50, page: 1 }, token)
        if (!cancelled) setChats(res?.data ?? [])
      } catch (e) {
        console.warn('[admin:messages] failed to list chats', e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [token])

  // Enrich participant labels with user names when available
  useEffect(() => {
    let cancelled = false
    const fillNames = async () => {
      try {
        if (!token) return
        const ids = new Set<string>()
        for (const c of chats) {
          for (const p of c.participants || []) {
            const key = String(p.id)
            if (!nameMap[key]) ids.add(key)
          }
        }
        if (ids.size === 0) return
        // Ensure token available to userProfileService that reads localStorage
        try {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('token', token)
          }
        } catch {}
        const fetches = Array.from(ids).map(async (id) => {
          try {
            const res = await userProfileService.getUserProfile(id)
            const data: any = res?.data
            const name = (data?.name || data?.user?.name || data?.userName || `User ${id}`)
            return { id, name }
          } catch {
            return { id, name: `User ${id}` }
          }
        })
        const results = await Promise.all(fetches)
        if (cancelled) return
        setNameMap((prev) => {
          const next = { ...prev }
          for (const r of results) next[r.id] = r.name
          return next
        })
      } catch (e) {
        // ignore name enrichment errors
      }
    }
    fillNames()
    return () => { cancelled = true }
  }, [chats, token])

  const list: ConversationItem[] = useMemo(() => {
    const q = search.trim().toLowerCase()
    const fmt = (c: ChatSummary): ConversationItem => {
      const label = (c.participants || [])
        .map((p) => {
          const id = String(p.id)
          const display = nameMap[id] || `User ${id}`
          const role = (p.role || 'user').toUpperCase()
          return `${role}: ${display}`
        })
        .join('  •  ')
      return {
        chatId: c.id,
        participantsLabel: label,
        lastText: c.lastMessage?.text || '',
        lastTime: c.lastMessage?.timestamp ? new Date(c.lastMessage.timestamp).toLocaleString() : '',
        unread: c.unreadCount || 0,
      }
    }
    return (chats || [])
      .map(fmt)
      .filter((c) => (q ? c.participantsLabel.toLowerCase().includes(q) || c.lastText.toLowerCase().includes(q) : true))
  }, [chats, search, nameMap])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          <h1 className="text-xl font-semibold">Admin Messages</h1>
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
                placeholder="Search conversations"
                className="w-full pl-8 pr-3 py-2 rounded-md border text-sm"
                style={{ backgroundColor: 'var(--input)', borderColor: 'var(--border)' }}
              />
            </div>
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-500 text-sm">Loading conversations…</div>
          ) : list.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">No conversations found.</div>
          ) : (
            <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {list.map((c) => (
                <li key={c.chatId}>
                  <button
                    onClick={() => router.push(`/admin/messages/${encodeURIComponent(c.chatId)}`)}
                    className="w-full text-left flex items-center gap-3 py-3 hover:bg-gray-50 px-2"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{c.participantsLabel}</p>
                        {c.unread > 0 && (
                          <span className="ml-2 inline-flex items-center justify-center text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
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
            <p className="text-sm text-gray-600">Choose a chat on the left to open the thread. New messages appear in real time.</p>
          </div>
        </div>
      </div>
    </div>
  )
}