'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { chatService } from '@/services/chat.service'
import type { ApiResponse } from '@/services/api'
import type { ChatSummary } from '@/services/chat.service'
import { MessageSquare, Search, Wifi, User } from 'lucide-react'
import { useSocket } from '@/components/chat/SocketProvider'
import { formatMessageTime } from '@/services/chat.utils'

type ConversationItem = {
  chatId: string
  sellerId: string
  sellerName: string
  lastText: string
  lastTime: string
  unread: number
}

export default function UserMessagesPage() {
  const router = useRouter()
  const { token, user } = useAppSelector((s) => s.auth)
  const { connected } = useSocket()
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [chats, setChats] = useState<ChatSummary[]>([])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!token || !user) return
      setLoading(true)
      try {
        const res: ApiResponse<ChatSummary[]> = await chatService.listChats({ limit: 50, page: 1 }, token)
        if (!cancelled) setChats(res?.data ?? [])
      } catch (e) {
        console.warn('[user:messages] failed to list chats', e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [token, user])

  const conversations = React.useMemo((): ConversationItem[] => {
    const q = search.trim().toLowerCase()
    
    const formatted = chats.map((chat): ConversationItem => {
      // Find the seller participant
      const sellerParticipant = chat.participants?.find(p => p.role?.toLowerCase() === 'seller')
      const sellerId = sellerParticipant?.id ? String(sellerParticipant.id) : 'unknown'
      const sellerName = sellerParticipant?.name || `Seller ${sellerId}`
      
      return {
        chatId: chat.id,
        sellerId,
        sellerName,
        lastText: chat.lastMessage?.text || 'No messages yet',
        lastTime: chat.lastMessage?.timestamp ? formatMessageTime(chat.lastMessage.timestamp) : '',
        unread: chat.unreadCount || 0
      }
    })

    // Filter by search
    return formatted.filter(conv => 
      q ? (
        conv.sellerName.toLowerCase().includes(q) || 
        conv.lastText.toLowerCase().includes(q)
      ) : true
    )
  }, [chats, search])

  const openChat = (sellerId: string) => {
    router.push(`/user/chat/seller/${sellerId}`)
  }

  if (!token || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
          <p className="text-gray-600 mb-4">Please log in to view your messages</p>
          <button 
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          <h1 className="text-xl font-semibold">My Messages</h1>
          <span className={`inline-flex items-center gap-1 text-sm ${connected ? 'text-green-600' : 'text-gray-500'}`}>
            <Wifi className="w-4 h-4" />
            {connected ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading conversations...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-8 text-center">
            {search ? (
              <>
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No conversations found matching "{search}"</p>
              </>
            ) : (
              <>
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">No conversations yet</p>
                <p className="text-sm text-gray-400">
                  Start chatting with sellers by visiting product pages and clicking "Chat with Seller"
                </p>
              </>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {conversations.map((conv) => (
              <li key={conv.chatId}>
                <button
                  onClick={() => openChat(conv.sellerId)}
                  className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-left"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {conv.sellerName}
                        {conv.unread > 0 && (
                          <span className="ml-2 inline-flex items-center justify-center text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                            {conv.unread}
                          </span>
                        )}
                      </h3>
                      <span className="text-xs text-gray-400">{conv.lastTime}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">{conv.lastText}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}