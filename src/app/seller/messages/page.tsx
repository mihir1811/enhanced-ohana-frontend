'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { chatService } from '@/services/chat.service'
import type { ChatMessageDto, ChatConversation } from '@/services/chat.service'
import { MessageSquare, Search, Wifi, User, Send } from 'lucide-react'
import { useSocket } from '@/components/chat/SocketProvider'
import { formatMessageTime } from '@/services/chat.utils'

export default function SellerMessagesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { token, user } = useAppSelector((s) => s.auth)
  const { connected, socket, sendMessage: sendSocketMessage, register, onMessage } = useSocket()
  
  // State management
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null)
  const [messages, setMessages] = useState<ChatMessageDto[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  
  // Pagination and loading states for messages
  const [messagesPage, setMessagesPage] = useState(1)
  const [messagesLimit] = useState(20) // Messages per page
  const [hasMoreMessages, setHasMoreMessages] = useState(true)
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false)
  const [totalMessages, setTotalMessages] = useState(0)
  
  // Track locally added messages to prevent duplicates
  const locallyAddedMessagesRef = useRef<Set<string>>(new Set())
  // Track all processed messages to prevent any duplicates
  const processedMessagesRef = useRef<Set<string>>(new Set())

  // URL params handling for preselected user
  const preSelectedUserId = searchParams.get('userId')
  const selectedParticipantId = selectedConversation?.participantId

  // Check if user is a seller
  const isSeller = user?.role === 'seller'

  // Redirect if not a seller
  useEffect(() => {
    if (!isSeller && user) {
      router.push('/login')
    }
  }, [isSeller, user, router])

  // Register socket connection
  useEffect(() => {
    if (!socket || !connected || !user?.id) return
    
    try {
      register(user.id)
      console.log('✅ [SellerMessages] Socket registered for seller:', user.id)
    } catch (e) {
      console.error('❌ [SellerMessages] Registration error:', e)
    }
  }, [socket, connected, user?.id, register])

  // Load conversations
  useEffect(() => {
    let cancelled = false
    
    const loadConversations = async () => {
      if (!isSeller || !token) {
        console.log('⚠️ [SellerMessages] No seller access or token, skipping conversation load')
        return
      }
      
      console.log('🔄 [SellerMessages] Starting to load conversations...', { userId: user?.id, userRole: user?.role })
      setLoading(true)
      setError(null)
      
      try {
        const response = await chatService.getConversations({ limit: 50, page: 1 }, token, user?.id)
        
        console.log('📡 [SellerMessages] getConversations response:', response)
        
        if (!cancelled && response.data) {
          console.log(`📊 [SellerMessages] Processing ${response.data.length} conversations`)
          
          // Filter conversations to show only user-to-seller chats (where participant is user)
          const userConversations = response.data.filter(conv => 
            conv.participantRole.toLowerCase() === 'user'
          )
          
          console.log(`🎯 [SellerMessages] Filtered user conversations: ${userConversations.length}`, userConversations)
          
          setConversations(userConversations)
          
          // Auto-select conversation if userId provided in URL
          if (preSelectedUserId) {
            console.log(`🔍 [SellerMessages] Looking for preselected user: ${preSelectedUserId}`)
            const preSelected = userConversations.find(conv => 
              conv.participantId === preSelectedUserId
            )
            if (preSelected) {
              console.log('✅ [SellerMessages] Found and selecting preselected conversation:', preSelected)
              setSelectedConversation(preSelected)
              setMessages(preSelected.messages || [])
            } else {
              console.log('❌ [SellerMessages] Preselected user not found in conversations')
            }
          }
        } else {
          console.log('⚠️ [SellerMessages] No conversation data received')
        }
      } catch (err) {
        console.error('❌ [SellerMessages] Failed to load conversations:', err)
        if (!cancelled) {
          setError('Failed to load conversations')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadConversations()
    return () => { cancelled = true }
  }, [token, isSeller, preSelectedUserId, user])

  // Handle incoming messages via WebSocket through SocketProvider
  useEffect(() => {
    if (!connected || !onMessage) {
      console.log('⚠️ [SellerMessages] Message listener not set up:', { connected, hasOnMessage: !!onMessage })
      return
    }
    
    console.log('✅ [SellerMessages] Setting up message listener')

    const handleNewMessage = (message: any) => {
      console.log('📨 [SellerMessages] Received new message:', message)
      console.log('🔍 [SellerMessages] Current user ID:', user?.id)
      console.log('🔍 [SellerMessages] Selected conversation:', selectedConversation?.participantId)
      
      // Handle different possible message structures from backend
      const fromId = String(message.fromId || message.fromUserId || message.from?.id || '')
      const toId = String(message.toId || message.toUserId || message.to?.id || '')
      const messageText = String(message.message || message.text || '')
      
      // Safety check for message structure
      if (!fromId || !toId || !messageText) {
        console.warn('⚠️ [SellerMessages] Invalid message structure received:', {
          message,
          extractedFromId: fromId,
          extractedToId: toId,
          extractedMessage: messageText
        })
        return
      }
      
      // Ensure message has proper structure
      const safeMessage: ChatMessageDto = {
        id: message.id || `temp-${Date.now()}`,
        fromId,
        toId,
        message: messageText,
        messageType: message.messageType || 'TEXT',
        createdAt: message.createdAt || message.timestamp || new Date().toISOString(),
        deletedBySender: message.deletedBySender || false,
        deletedByReceiver: message.deletedByReceiver || false,
        isRead: message.isRead || false,
        readAt: message.readAt || null,
        fileUrl: message.fileUrl || null,
        from: {
          id: fromId,
          name: String(message.from?.name || message.fromName || 'Unknown User'),
          role: String(message.from?.role || message.fromRole || 'user')
        },
        to: {
          id: toId,
          name: String(message.to?.name || message.toName || 'Unknown User'),
          role: String(message.to?.role || message.toRole || 'seller')
        }
      }
      
      // If message is for current conversation, add to messages
      const currentUserId = String(user?.id || '')
      const selectedParticipant = String(selectedConversation?.participantId || '')
      const messageFromId = String(safeMessage.fromId)
      const messageToId = String(safeMessage.toId)
      
      const isFromCurrentUser = messageFromId === currentUserId
      const shouldAddToCurrentConversation = selectedConversation && currentUserId && 
          ((messageFromId === selectedParticipant && messageToId === currentUserId) ||
           (messageFromId === currentUserId && messageToId === selectedParticipant))
      
      console.log('🔍 [SellerMessages] Message filtering:', {
        shouldAdd: shouldAddToCurrentConversation,
        isFromCurrentUser,
        selectedConversationId: selectedParticipant,
        currentUserId,
        messageFromId,
        messageToId,
        condition1: selectedConversation && currentUserId && messageFromId === selectedParticipant && messageToId === currentUserId,
        condition2: selectedConversation && currentUserId && messageFromId === currentUserId && messageToId === selectedParticipant
      })
      
      // Check if this message was already processed
      const messageKey = `${safeMessage.fromId}-${safeMessage.toId}-${safeMessage.message}-${safeMessage.createdAt}`
      const wasAddedLocally = locallyAddedMessagesRef.current.has(messageKey)
      const wasAlreadyProcessed = processedMessagesRef.current.has(messageKey)
      
      // Debug logging for message processing
      console.log('🔍 [SellerMessages] Message processing decision:', {
        shouldAddToCurrentConversation,
        isFromCurrentUser,
        wasAddedLocally,
        wasAlreadyProcessed,
        messageFromId,
        messageToId,
        currentUserId,
        selectedParticipant,
        messageKey: messageKey.substring(0, 50) + '...'
      })
      
      // Only add messages that we haven't already processed
      if (shouldAddToCurrentConversation && !wasAlreadyProcessed) {
        console.log('✅ [SellerMessages] Adding message to current conversation')
        
        // Mark as processed immediately to prevent duplicates
        processedMessagesRef.current.add(messageKey)
        
        setMessages(prev => {
          console.log('🔍 [SellerMessages] Current messages count before adding:', prev.length)
          
          // Additional duplicate check based on ID and content (backup check)
          const isDuplicate = prev.some(existingMsg => 
            (existingMsg.id === safeMessage.id && !existingMsg.id.startsWith('temp-')) ||
            (existingMsg.message === safeMessage.message &&
             existingMsg.fromId === safeMessage.fromId &&
             existingMsg.toId === safeMessage.toId &&
             Math.abs(new Date(existingMsg.createdAt).getTime() - new Date(safeMessage.createdAt).getTime()) < 3000)
          )
          
          if (isDuplicate) {
            console.log('🔄 [SellerMessages] Skipping duplicate message (backup check - ID or content match)')
            return prev
          }
          
          console.log('✅ [SellerMessages] Adding new message, count will be:', prev.length + 1)
          
          // Update total messages count when adding new messages
          setTotalMessages(prevTotal => prevTotal + 1)
          
          return [...prev, safeMessage]
        })
      } else if (wasAlreadyProcessed) {
        console.log('🔄 [SellerMessages] Skipping message (already processed)')
      } else if (wasAddedLocally) {
        console.log('🔄 [SellerMessages] Skipping message (already added locally)', {
          messageContent: safeMessage.message.substring(0, 20) + '...'
        })
      } else {
        console.log('❌ [SellerMessages] Message not added to current conversation')
      }      // Update conversations list
      setConversations(prev => {
        let conversationUpdated = false
        const updated = prev.map(conv => {
          // Only update conversations that involve the current seller and this participant
          const shouldUpdate = currentUserId && 
              ((conv.participantId === safeMessage.fromId && safeMessage.toId === currentUserId) ||
               (conv.participantId === safeMessage.toId && safeMessage.fromId === currentUserId))
               
          if (shouldUpdate) {
            conversationUpdated = true
            console.log('✅ [SellerMessages] Updating conversation:', conv.participantId)
            return {
              ...conv,
              lastMessage: safeMessage,
              unreadCount: conv.participantId === safeMessage.fromId ? conv.unreadCount + 1 : conv.unreadCount,
              messages: [...(conv.messages || []), safeMessage]
            }
          }
          return conv
        })
        
        if (!conversationUpdated) {
          console.log('❌ [SellerMessages] No conversation updated for message')
        }
        
        return updated
      })
    }

    // Subscribe to messages through SocketProvider
    const unsubscribe = onMessage(handleNewMessage)
    console.log('📡 [SellerMessages] Message listener subscribed')
    
    return () => {
      console.log('🔌 [SellerMessages] Message listener unsubscribed')
      unsubscribe()
    }
  }, [connected, selectedConversation, onMessage, user?.id])

  // Send message function
  const sendMessage = useCallback(async () => {
    if (!messageText.trim() || !selectedConversation || sendingMessage || !user?.id) return
    
    setSendingMessage(true)
    
    try {
      console.log('🔍 [SellerMessages] Send message attempt:', {
        hasSocket: !!socket,
        reactConnected: connected,
        socketConnected: socket?.connected,
        socketId: socket?.id
      })
      
      // Send via WebSocket - check actual socket connection, not just React state
      if (socket && socket.connected) {
        const currentUserId = String(user.id)
        chatService.sendMessageViaSocket(
          currentUserId,
          selectedConversation.participantId,
          messageText.trim(),
          socket
        )
        
        // Add message locally for immediate UI update
        const tempMessage: ChatMessageDto = {
          id: `temp-${Date.now()}`,
          fromId: currentUserId,
          toId: selectedConversation.participantId,
          message: messageText.trim(),
          messageType: 'TEXT',
          createdAt: new Date().toISOString(),
          deletedBySender: false,
          deletedByReceiver: false,
          isRead: false,
          from: {
            id: currentUserId,
            name: user.name || 'You',
            role: user.role || 'seller'
          },
          to: {
            id: selectedConversation.participantId,
            name: selectedConversation.participantName,
            role: selectedConversation.participantRole
          }
        }
        
        console.log('📝 [SellerMessages] Adding message locally when sending:', {
          messageId: tempMessage.id,
          fromId: tempMessage.fromId,
          message: tempMessage.message.substring(0, 20) + '...',
          currentMessagesCount: messages.length
        })
        
        // Track this message as locally added and processed
        const messageKey = `${tempMessage.fromId}-${tempMessage.toId}-${tempMessage.message}-${tempMessage.createdAt}`
        locallyAddedMessagesRef.current.add(messageKey)
        processedMessagesRef.current.add(messageKey)
        
        // Clean up old tracking entries (keep only last 100 messages to prevent memory leaks)
        if (locallyAddedMessagesRef.current.size > 100) {
          const localEntries = Array.from(locallyAddedMessagesRef.current)
          const processedEntries = Array.from(processedMessagesRef.current)
          
          locallyAddedMessagesRef.current.clear()
          processedMessagesRef.current.clear()
          
          localEntries.slice(-50).forEach(key => locallyAddedMessagesRef.current.add(key))
          processedEntries.slice(-50).forEach(key => processedMessagesRef.current.add(key))
        }
        
        setMessages(prev => {
          console.log('📝 [SellerMessages] Local add - before:', prev.length, 'after will be:', prev.length + 1)
          
          // Update total messages count when sending messages
          setTotalMessages(prevTotal => prevTotal + 1)
          
          return [...prev, tempMessage]
        })
        setMessageText('')
      } else {
        // Socket not connected, use REST API fallback
        console.log('⚠️ [SellerMessages] Socket not connected, using REST API fallback')
        const currentUserId = String(user.id)
        
        await chatService.sendMessageViaRest(
          currentUserId,
          selectedConversation.participantId,
          messageText.trim(),
          token || undefined
        )
        
        console.log('✅ [SellerMessages] Message sent via REST API')
        setMessageText('')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      setError('Failed to send message')
    } finally {
      setSendingMessage(false)
    }
  }, [messageText, selectedConversation, sendingMessage, user, socket, connected])

  // Load messages for a conversation with pagination
  const loadConversationMessages = useCallback(async (conversation: ChatConversation, page: number = 1, append: boolean = false) => {
    if (!token || !user?.id) return
    
    try {
      setLoadingMessages(!append)
      setLoadingMoreMessages(append)
      
      console.log(`📥 [SellerMessages] Loading messages for conversation with ${conversation.participantName}`, {
        page,
        limit: messagesLimit,
        append
      })
      
      // Get messages from API with proper pagination
      const response = await chatService.getAllMessages({
        page,
        limit: messagesLimit
      }, token)
      
      if (response.data?.data) {
        const allMessages = response.data.data
        const meta = response.data.meta
        
        console.log('📊 [SellerMessages] API Meta data:', meta)
        
        // Filter messages for this specific conversation
        const conversationMessages = allMessages.filter(msg => 
          (msg.fromId === user.id && msg.toId === conversation.participantId) ||
          (msg.fromId === conversation.participantId && msg.toId === user.id)
        )
        
        // Sort by creation date (oldest first for chat display)
        const sortedMessages = conversationMessages.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        
        // Use API meta data for pagination info
        if (meta) {
          setTotalMessages(meta.total || sortedMessages.length)
          setHasMoreMessages(meta.currentPage < meta.lastPage)
        } else {
          // Fallback to local pagination
          setTotalMessages(sortedMessages.length)
          setHasMoreMessages(false)
        }
        
        if (append) {
          // For loading older messages, prepend to the beginning
          setMessages(prev => [...sortedMessages, ...prev])
        } else {
          // For initial load, replace all messages
          setMessages(sortedMessages)
          setMessagesPage(1)
        }
        
        console.log(`✅ [SellerMessages] Loaded ${sortedMessages.length} messages for conversation`, {
          totalFromMeta: meta?.total,
          currentPage: meta?.currentPage,
          lastPage: meta?.lastPage,
          hasMore: meta ? meta.currentPage < meta.lastPage : false
        })
      }
    } catch (error) {
      console.error('❌ [SellerMessages] Failed to load conversation messages:', error)
      setError('Failed to load messages')
    } finally {
      setLoadingMessages(false)
      setLoadingMoreMessages(false)
    }
  }, [token, user?.id, messagesLimit])

  // Handle conversation selection
  const selectConversation = useCallback((conversation: ChatConversation) => {
    console.log('🔄 [SellerMessages] Switching to conversation:', conversation.participantName)
    
    // Reset all chat states for new conversation
    setSelectedConversation(conversation)
    setMessages([]) // Clear current messages immediately
    setMessageText('') // Clear any unsent message
    setError(null) // Clear any errors
    setSendingMessage(false) // Reset sending state
    
    // Reset pagination states
    setMessagesPage(1)
    setHasMoreMessages(true)
    setTotalMessages(0)
    setLoadingMessages(false)
    setLoadingMoreMessages(false)
    
    // Clear message tracking for duplicate prevention
    processedMessagesRef.current.clear()
    locallyAddedMessagesRef.current.clear()
    console.log('🔄 [SellerMessages] Cleared all tracking and states for new conversation')
    
    // Load messages with pagination for new conversation
    loadConversationMessages(conversation, 1, false)
    
    // Reset scroll position to bottom for new conversation (after a short delay to let messages load)
    setTimeout(() => {
      const messagesContainer = document.querySelector('.messages-container')
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight
      }
    }, 100)
  }, [loadConversationMessages])

  // Load more messages (older messages)
  const loadMoreMessages = useCallback(async () => {
    if (!selectedConversation || !hasMoreMessages || loadingMoreMessages) return
    
    const nextPage = messagesPage + 1
    setMessagesPage(nextPage)
    await loadConversationMessages(selectedConversation, nextPage, true)
  }, [selectedConversation, hasMoreMessages, loadingMoreMessages, messagesPage, loadConversationMessages])

  // Auto-scroll to bottom for new messages (but not when loading older messages)
  useEffect(() => {
    if (!loadingMoreMessages) {
      // Scroll to bottom when messages change (new message added)
      const messagesContainer = document.querySelector('.messages-container')
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight
      }
    }
  }, [messages.length, loadingMoreMessages])

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv =>
    !search || 
    conv.participantName.toLowerCase().includes(search.toLowerCase()) ||
    (conv.lastMessage?.message || '').toLowerCase().includes(search.toLowerCase())
  )

  // Handle key press for sending messages
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
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
        {/* Conversations list - LEFT SIDE */}
        <div className="md:col-span-1 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          {/* User List Header */}
          <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-semibold text-sm text-gray-700">Users</h3>
            <p className="text-xs text-gray-500 mt-1">Customers who messaged you</p>
          </div>
          <div className="p-3">
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
                {filteredConversations.map((conv) => (
                  <li key={conv.participantId}>
                    <button
                      onClick={() => selectConversation(conv)}
                      className={`w-full px-3 py-3 flex items-center gap-3 text-left rounded-lg transition-colors ${
                        selectedParticipantId === conv.participantId 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {conv.participantName}
                            {conv.unreadCount > 0 && (
                              <span className="ml-2 inline-flex items-center justify-center text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                                {conv.unreadCount}
                              </span>
                            )}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {conv.lastMessage?.message || 'No messages yet'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {conv.lastMessage?.createdAt ? formatMessageTime(conv.lastMessage.createdAt) : ''}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Messages Panel */}
        <div className="md:col-span-2 rounded-xl border flex flex-col" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', height: '600px' }}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedConversation.participantName}</h3>
                  <p className="text-sm text-gray-500">
                    {connected ? 'Online' : 'Last seen recently'} • {selectedConversation.participantRole}
                  </p>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 messages-container">
                {/* Load More Messages Button at Top */}
                {selectedConversation && !loadingMessages && hasMoreMessages && messages.length > 0 && (
                  <div className="flex justify-center mb-4">
                    <button
                      onClick={loadMoreMessages}
                      disabled={loadingMoreMessages}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingMoreMessages ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                          Loading older messages...
                        </div>
                      ) : (
                        `Load older messages (${totalMessages - messages.length} more)`
                      )}
                    </button>
                  </div>
                )}
                
                {loadingMessages ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex justify-center items-center h-full text-gray-500">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((message) => {
                    const isFromSeller = message.fromId === user?.id
                    const senderName = isFromSeller ? 'You' : (message.from?.name || 'Customer')
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isFromSeller ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex flex-col ${isFromSeller ? 'items-end' : 'items-start'}`}>
                          <p className={`text-xs mb-1 ${
                            isFromSeller ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                            {senderName}
                          </p>
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isFromSeller
                                ? 'bg-blue-600 text-white rounded-br-sm'
                                : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <p className={`text-xs mt-1 ${
                              isFromSeller ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {formatMessageTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Pagination UI - Message Count Only */}
              {selectedConversation && !loadingMessages && totalMessages > 0 && (
                <div className="px-4 py-2 border-t border-gray-200">
                  <div className="flex justify-center">
                    <p className="text-xs text-gray-500">
                      Showing {messages.length} of {totalMessages} messages
                    </p>
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={sendingMessage}
                  />
                  <button 
                    onClick={sendMessage}
                    disabled={!messageText.trim() || sendingMessage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {sendingMessage ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a customer conversation</h3>
                <p className="text-sm text-gray-600">
                  Choose a customer on the left to open the chat thread. New messages will appear in real time.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
