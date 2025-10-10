'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { chatService } from '@/services/chat.service'
import type { ApiResponse } from '@/services/api'
import type { ChatSummary } from '@/services/chat.service'
import { MessageSquare, Search, Wifi, User, Plus } from 'lucide-react'
import { useSocket } from '@/components/chat/SocketProvider'
import { formatMessageTime } from '@/services/chat.utils'

type ConversationItem = {
  chatId: string
  userId: string
  userName: string
  lastText: string
  lastTime: string
  unread: number
}

export default function SellerMessagesPage() {
  const router = useRouter()
  const { token, user } = useAppSelector((s) => s.auth)
  const { connected, register, socket } = useSocket()
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chats, setChats] = useState<ChatSummary[]>([])

  // Check if user is a seller
  const isSeller = user?.role === 'seller'

  useEffect(() => {
    if (!isSeller) {
      return
    }
  }, [isSeller])

  // Register socket for seller
  useEffect(() => {
    if (!socket || !connected || !user?.id) return
    try {
      register(user.id)
      // Additional registration logic for sellers can be added here
    } catch (e) {
      console.error('❌ [SellerMessages] Registration error:', e)
    }
  }, [socket, connected, user?.id, register])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!isSeller) {
        setError('Please login as a seller to view messages')
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const res: ApiResponse<ChatSummary[]> = await chatService.listChats({ limit: 50, page: 1 }, token || undefined)
        if (!cancelled) {
          console.log('Seller listChats API response:', res)
          const raw = res?.data as any
          const data = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : [])
          console.log('Processed chat list data:', data)
          setChats(data)
        }
      } catch (e) {
        console.warn('[seller:messages] failed to list chats', e)
        if (!cancelled) setError('Failed to load conversations')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [token, isSeller])

  const conversations = React.useMemo((): ConversationItem[] => {
    const q = search.trim().toLowerCase()
    
    const formatted = chats.map((chat): ConversationItem => {
      // Find the user participant (non-seller)
      const userParticipant = chat.participants?.find(p => p.role?.toLowerCase() !== 'seller')
      const userId = userParticipant?.id ? String(userParticipant.id) : 'unknown'
      const userName = userParticipant?.name || `User ${userId}`
      
      return {
        chatId: chat.id,
        userId,
        userName,
        lastText: chat.lastMessage?.text || 'No messages yet',
        lastTime: chat.lastMessage?.timestamp ? formatMessageTime(chat.lastMessage.timestamp) : '',
        unread: chat.unreadCount || 0
      }
    })

    // Filter by search
    return formatted.filter(conv => 
      q ? (
        conv.userName.toLowerCase().includes(q) || 
        conv.lastText.toLowerCase().includes(q)
      ) : true
    )
  }, [chats, search])

  const openChat = (userId: string) => {
    router.push(`/seller/messages/${userId}`)
  }

  if (!isSeller) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Seller Access Required</h3>
          <p className="text-gray-600 mb-4">You need to be a verified seller to access messages</p>
          <button 
            onClick={() => router.push('/become-seller')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Become a Seller
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          <h1 className="text-xl font-semibold">Customer Messages</h1>
          <span className={`inline-flex items-center gap-1 text-sm ${connected ? 'text-green-600' : 'text-gray-500'}`}>
            <Wifi className="w-4 h-4" />
            {connected ? 'Online' : 'Offline'}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            className="px-4 py-2 rounded-lg font-medium transition-colors border"
            style={{ 
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
              backgroundColor: 'transparent'
            }}
          >
            Mark All Read
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer conversations..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Conversations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Conversations list */}
        <div className="md:col-span-1 rounded-xl border p-3" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
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
                  <p className="text-gray-500 mb-2">No customer messages yet</p>
                  <p className="text-sm text-gray-400">
                    Customers will appear here when they start conversations about your products
                  </p>
                </>
              )}
            </div>
          ) : (
            <ul className="space-y-2">
              {conversations.map((conv) => (
                <li key={conv.chatId}>
                  <button
                    onClick={() => openChat(conv.userId)}
                    className="w-full px-3 py-3 hover:bg-gray-50 flex items-center gap-3 text-left rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {conv.userName}
                          {conv.unread > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                              {conv.unread}
                            </span>
                          )}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conv.lastText || 'No messages yet'}</p>
                      <p className="text-xs text-gray-400">{conv.lastTime}</p>
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
            <p className="text-sm text-gray-600">Choose a customer on the left to open the chat thread. New messages will appear in real time.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
