'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { chatService } from '@/services/chat.service'
import { diamondService } from '@/services/diamondService'
import type { ChatConversation, ChatMessageDto } from '@/services/chat.service'
import { MessageSquare, Search, Wifi, User, Send } from 'lucide-react'
import { useSocket } from '@/components/chat/SocketProvider'
import { formatMessageTime } from '@/services/chat.utils'

export default function UserMessagesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { token, user } = useAppSelector((s) => s.auth)
  const { connected, socket, sendMessage: sendSocketMessage, register, onMessage } = useSocket()
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessageDto[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Pagination and loading states for messages
  const [messagesPage, setMessagesPage] = useState(1)
  const [messagesLimit] = useState(20) // Messages per page
  const [hasMoreMessages, setHasMoreMessages] = useState(true)
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false)
  const [totalMessages, setTotalMessages] = useState(0)
  const [loadingMessages, setLoadingMessages] = useState(false)
  
  // Track locally added messages to prevent duplicates
  const locallyAddedMessagesRef = useRef<Set<string>>(new Set())
  // Track all processed messages to prevent any duplicates
  const processedMessagesRef = useRef<Set<string>>(new Set())

  // Register socket for receiving messages when user is available
  useEffect(() => {
    if (user?.id && register) {
      console.log('👤 [UserChat] Registering socket for user:', user.id)
      register(user.id)
    }
  }, [user?.id, register])

  // Listen for socket errors
  useEffect(() => {
    if (!socket) return

    const handleError = (error: any) => {
      console.error('🚨 [UserChat] Socket error received:', error)
      
      // Check if this is a CHAT_EVENT error
      if (error?.pattern === 'CHAT_EVENT') {
        console.error('❌ [UserChat] CHAT_EVENT error details:', {
          pattern: error.pattern,
          data: error.data,
          cause: error.cause,
          message: error.message
        })
        
        // Show user-friendly error
        setError('Failed to send message. Please try again.')
      }
    }

    // Listen for ERROR events from the socket
    socket.on('ERROR', handleError)
    socket.on('error', handleError)
    socket.on('connect_error', handleError)

    return () => {
      socket.off('ERROR', handleError)
      socket.off('error', handleError)
      socket.off('connect_error', handleError)
    }
  }, [socket])

  // Get URL parameters for auto-selecting seller
  const preSelectedSellerId = searchParams.get('sellerId')
  const productId = searchParams.get('productId')
  const productName = searchParams.get('productName')
  const productType = searchParams.get('productType')

  console.log('🔍 [UserChat] URL Parameters received:', {
    preSelectedSellerId,
    productId,
    productName: productName ? decodeURIComponent(productName) : null,
    productType
  })

  // Load conversations from backend
  useEffect(() => {
    let cancelled = false
    const loadConversations = async () => {
      if (!token || !user) {
        console.log('⚠️ [UserChat] No token or user, skipping conversation load')
        return
      }
      
      console.log('🔄 [UserChat] Starting to load conversations...', { userId: user.id, userRole: user.role })
      setLoading(true)
      try {
        const response = await chatService.getConversations({ limit: 50, page: 1 }, token, user.id)
        console.log('📡 [UserChat] getConversations response:', response)
        
        if (!cancelled && response?.data) {
          console.log(`📊 [UserChat] Processing ${response.data.length} conversations:`, response.data)
          
          // Filter to show only conversations with sellers (since user is chatting with sellers)
          const sellerConversations = response.data.filter(conv => 
            conv.participantRole.toLowerCase() === 'seller'
          )
          
          console.log(`🎯 [UserChat] Filtered seller conversations: ${sellerConversations.length}`, sellerConversations)
          
          setConversations(sellerConversations)
          
          // If we have a preselected seller, try to find and select that conversation
          if (preSelectedSellerId) {
            console.log(`🔍 [UserChat] Looking for preselected seller: ${preSelectedSellerId}`)
            const preSelected = sellerConversations.find(conv => conv.participantId === preSelectedSellerId)
            if (preSelected) {
              console.log('✅ [UserChat] Found preselected conversation, will be handled by auto-select effect')
            } else {
              console.log('❌ [UserChat] Preselected seller not found in conversations')
            }
          }
        } else {
          console.log('⚠️ [UserChat] No conversation data received')
        }
      } catch (error) {
        console.error('❌ [UserChat] Failed to load conversations:', error)
        if (!cancelled) {
          setError('Failed to load conversations. Please try again.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    
    loadConversations()
    return () => { cancelled = true }
  }, [token, user, preSelectedSellerId])

  // Handle incoming messages via WebSocket through SocketProvider
  useEffect(() => {
    if (!connected || !onMessage) {
      console.log('⚠️ [UserChat] Message listener not set up:', { connected, hasOnMessage: !!onMessage })
      return
    }
    
    console.log('✅ [UserChat] Setting up message listener')

    const handleNewMessage = (message: any) => {
      console.log('📨 [UserChat] Received new message:', message)
      console.log('🔍 [UserChat] Current user ID:', user?.id)
      console.log('🔍 [UserChat] Selected participant:', selectedParticipantId)
      
      // Handle different possible message structures from backend
      const fromId = String(message.fromId || message.fromUserId || message.from?.id || '')
      const toId = String(message.toId || message.toUserId || message.to?.id || '')
      const messageText = String(message.message || message.text || '')
      
      // Safety check for message structure
      if (!fromId || !toId || !messageText) {
        console.warn('⚠️ [UserChat] Invalid message structure received:', {
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
          role: String(message.from?.role || message.fromRole || 'seller')
        },
        to: {
          id: toId,
          name: String(message.to?.name || message.toName || 'Unknown User'),
          role: String(message.to?.role || message.toRole || 'user')
        }
      }
      
      // If message is for current conversation, add to messages
      const currentUserId = String(user?.id || '')
      const isFromCurrentUser = safeMessage.fromId === currentUserId
      const shouldAddToCurrentConversation = selectedParticipantId && currentUserId && 
          ((safeMessage.fromId === selectedParticipantId && safeMessage.toId === currentUserId) ||
           (safeMessage.fromId === currentUserId && safeMessage.toId === selectedParticipantId))
      
      // Check if this message was already processed
      const messageKey = `${safeMessage.fromId}-${safeMessage.toId}-${safeMessage.message}-${safeMessage.createdAt}`
      const wasAddedLocally = locallyAddedMessagesRef.current.has(messageKey)
      const wasAlreadyProcessed = processedMessagesRef.current.has(messageKey)
      
      console.log('🔍 [UserChat] Message processing check:', {
        messageKey: messageKey.substring(0, 50) + '...',
        wasAddedLocally,
        wasAlreadyProcessed,
        shouldAddToCurrentConversation,
        messageFromId: safeMessage.fromId,
        currentUserId
      })
      
      // Only add messages that we haven't already processed
      if (shouldAddToCurrentConversation && !wasAlreadyProcessed) {
        console.log('✅ [UserChat] Adding message to current conversation')
        
        // Mark as processed immediately to prevent duplicates
        processedMessagesRef.current.add(messageKey)
        
        setMessages(prev => {
          // Additional duplicate check based on ID and content (backup check)
          const isDuplicate = prev.some(existingMsg => 
            (existingMsg.id === safeMessage.id && !existingMsg.id.startsWith('temp-')) ||
            (existingMsg.message === safeMessage.message &&
             existingMsg.fromId === safeMessage.fromId &&
             existingMsg.toId === safeMessage.toId &&
             Math.abs(new Date(existingMsg.createdAt).getTime() - new Date(safeMessage.createdAt).getTime()) < 3000)
          )
          
          if (isDuplicate) {
            console.log('🔄 [UserChat] Skipping duplicate message (backup check - ID or content match)')
            return prev
          }
          
          console.log('✅ [UserChat] Message added, new count:', prev.length + 1)
          
          // Update total messages count when adding new messages
          setTotalMessages(prevTotal => prevTotal + 1)
          
          return [...prev, safeMessage]
        })
      } else if (wasAlreadyProcessed) {
        console.log('🔄 [UserChat] Skipping message (already processed)')
      } else if (wasAddedLocally) {
        console.log('🔄 [UserChat] Skipping message (already added locally)')
      } else {
        console.log('❌ [UserChat] Message not added - not for current conversation')
      }
      
      // Update conversations list
      setConversations(prev => {
        return prev.map(conv => {
          // Only update conversations that involve the current user and this participant
          if (currentUserId && 
              ((conv.participantId === safeMessage.fromId && safeMessage.toId === currentUserId) ||
               (conv.participantId === safeMessage.toId && safeMessage.fromId === currentUserId))) {
            return {
              ...conv,
              lastMessage: safeMessage,
              unreadCount: conv.participantId === safeMessage.fromId ? conv.unreadCount + 1 : conv.unreadCount,
              messages: [...(conv.messages || []), safeMessage]
            }
          }
          return conv
        })
      })
    }

    // Subscribe to messages through SocketProvider
    const unsubscribe = onMessage(handleNewMessage)
    
    return unsubscribe
  }, [connected, selectedParticipantId, onMessage, user?.id])

  // Load messages for a conversation with pagination
  const loadConversationMessages = useCallback(async (participantId: string, page: number = 1, append: boolean = false) => {
    if (!token || !user?.id) return
    
    try {
      setLoadingMessages(!append)
      setLoadingMoreMessages(append)
      
      console.log(`📥 [UserChat] Loading messages for conversation with participant ${participantId}`, {
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
        
        console.log('📊 [UserChat] API Meta data:', meta)
        
        // Filter messages for this specific conversation
        const conversationMessages = allMessages.filter(msg => 
          (msg.fromId === user.id && msg.toId === participantId) ||
          (msg.fromId === participantId && msg.toId === user.id)
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
        
        console.log(`✅ [UserChat] Loaded ${sortedMessages.length} messages for conversation`, {
          totalFromMeta: meta?.total,
          currentPage: meta?.currentPage,
          lastPage: meta?.lastPage,
          hasMore: meta ? meta.currentPage < meta.lastPage : false
        })
      }
    } catch (error) {
      console.error('❌ [UserChat] Failed to load conversation messages:', error)
      setError('Failed to load messages')
    } finally {
      setLoadingMessages(false)
      setLoadingMoreMessages(false)
    }
  }, [token, user?.id, messagesLimit])

  // Load more messages (older messages)
  const loadMoreMessages = useCallback(async () => {
    if (!selectedParticipantId || !hasMoreMessages || loadingMoreMessages) return
    
    const nextPage = messagesPage + 1
    setMessagesPage(nextPage)
    await loadConversationMessages(selectedParticipantId, nextPage, true)
  }, [selectedParticipantId, hasMoreMessages, loadingMoreMessages, messagesPage, loadConversationMessages])

  // Handle selecting a conversation
  const handleSelectConversation = useCallback((participantId: string) => {
    const selectedConversation = conversations.find(c => c.participantId === participantId)
    if (selectedConversation) {
      console.log('🔄 [UserChat] Switching to conversation:', participantId)
      
      // Reset all chat states for new conversation
      setSelectedParticipantId(participantId)
      setMessages([]) // Clear current messages immediately
      setNewMessage('') // Clear any unsent message
      setError(null) // Clear any errors
      
      // Reset pagination states
      setMessagesPage(1)
      setHasMoreMessages(true)
      setTotalMessages(0)
      setLoadingMessages(false)
      setLoadingMoreMessages(false)
      
      // Clear message tracking for duplicate prevention
      processedMessagesRef.current.clear()
      locallyAddedMessagesRef.current.clear()
      console.log('🔄 [UserChat] Cleared all tracking and states for new conversation')
      
      // Load messages with pagination for new conversation
      loadConversationMessages(participantId, 1, false)
      
      // Reset scroll position to bottom for new conversation (after a short delay to let messages load)
      setTimeout(() => {
        const messagesContainer = document.querySelector('.messages-container')
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight
        }
      }, 100)
      
      // Mark messages as read (we'll handle this after loading messages)
      if (token) {
        chatService.markMessagesAsRead([], token) // We'll mark as read after loading
          .then(() => {
            // Update conversation unread count
            setConversations(prev => prev.map(conv => 
              conv.participantId === participantId 
                ? { ...conv, unreadCount: 0 }
                : conv
            ))
          })
          .catch(err => console.error('Failed to mark messages as read:', err))
      }
    }
  }, [conversations, user, token, loadConversationMessages])

  // Auto-select seller from URL parameters
  useEffect(() => {
    console.log('🔍 [UserChat] Auto-select effect triggered:', {
      preSelectedSellerId,
      conversationsCount: conversations.length,
      conversations: conversations.map(c => ({ id: c.participantId, name: c.participantName, role: c.participantRole }))
    })
    
    if (preSelectedSellerId) {
      const targetConversation = conversations.find(conv => 
        conv.participantId === preSelectedSellerId && 
        conv.participantRole.toLowerCase() === 'seller'
      )
      
      console.log('🔍 [UserChat] Looking for existing conversation:', {
        targetSellerId: preSelectedSellerId,
        foundConversation: !!targetConversation,
        conversationDetails: targetConversation || null
      })
      
      if (targetConversation) {
        console.log('✅ [UserChat] Found existing conversation with seller:', targetConversation)
        handleSelectConversation(preSelectedSellerId)
      } else if (conversations.length >= 0) {
        // Create a new conversation entry for this seller when coming from product page
        console.log('🆕 [UserChat] Creating new conversation for seller:', preSelectedSellerId)
        
        // Fetch seller info to get proper name
        const createNewConversation = async () => {
          try {
            let sellerName = 'Seller'
            
            console.log('🔍 [UserChat] Fetching seller info for:', preSelectedSellerId)
            
            // Try to fetch seller info for better name
            try {
              const sellerInfo = await diamondService.getSellerInfo(preSelectedSellerId)
              console.log('📡 [UserChat] Seller info response:', sellerInfo)
              
              if (sellerInfo?.data?.user?.firstName) {
                sellerName = sellerInfo.data.user.firstName
                if (sellerInfo.data.user.lastName) {
                  sellerName += ` ${sellerInfo.data.user.lastName}`
                }
              } else if (sellerInfo?.data?.user?.name) {
                sellerName = sellerInfo.data.user.name
              }
              console.log('✅ [UserChat] Fetched seller name:', sellerName)
            } catch (error) {
              console.log('⚠️ [UserChat] Could not fetch seller info, using fallback name:', error)
              // Use product-based fallback name
              sellerName = productName ? 
                `Seller (${productType === 'gemstone' ? 'Gemstone' : productType === 'diamond' ? 'Diamond' : 'Product'} Seller)` :
                'Seller'
            }
            
            const newConversation: ChatConversation = {
              participantId: preSelectedSellerId,
              participantName: sellerName,
              participantRole: 'seller',
              lastMessage: undefined,
              unreadCount: 0,
              messages: []
            }
            
            console.log('🎯 [UserChat] Creating new conversation object:', newConversation)
            
            // Add to conversations list
            setConversations(prev => {
              const exists = prev.find(conv => conv.participantId === preSelectedSellerId)
              if (exists) {
                console.log('⚠️ [UserChat] Conversation already exists, not adding duplicate')
                return prev
              }
              console.log('➕ [UserChat] Adding new conversation to list')
              return [...prev, newConversation]
            })
            
            // Select this new conversation
            console.log('🎯 [UserChat] Selecting new conversation:', preSelectedSellerId)
            handleSelectConversation(preSelectedSellerId)
            
            console.log('✅ [UserChat] Created and selected new conversation for seller:', {
              sellerId: preSelectedSellerId,
              sellerName,
              productType,
              productName
            })
          } catch (error) {
            console.error('❌ [UserChat] Error creating new conversation:', error)
            setError('Could not start chat with seller. Please try again.')
          }
        }
        
        createNewConversation()
      }
    }
  }, [preSelectedSellerId, conversations, handleSelectConversation, productName, productType])

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

  // Filter conversations by search
  const filteredConversations = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    return conversations.filter(conv => 
      query ? (
        conv.participantName.toLowerCase().includes(query) || 
        conv.lastMessage?.message.toLowerCase().includes(query)
      ) : true
    )
  }, [conversations, search])

  // Send message
  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !selectedParticipantId || !user || !socket) {
      console.log('⚠️ [UserChat] Cannot send message - missing requirements:', {
        hasMessage: !!newMessage.trim(),
        hasSelectedParticipant: !!selectedParticipantId,
        hasUser: !!user,
        hasSocket: !!socket,
        socketConnected: socket?.connected
      })
      return
    }

    const messageText = newMessage.trim()
    
    // Validate message content
    if (messageText.length === 0) {
      console.log('⚠️ [UserChat] Empty message, not sending')
      return
    }
    
    if (messageText.length > 1000) {
      console.error('❌ [UserChat] Message too long:', messageText.length)
      setError('Message is too long. Please keep it under 1000 characters.')
      return
    }
    
    setNewMessage('')

    try {
      console.log('📤 [UserChat] Preparing to send message:', {
        fromId: user.id,
        toId: selectedParticipantId,
        message: messageText.substring(0, 50) + (messageText.length > 50 ? '...' : ''),
        socketConnected: socket.connected,
        userRole: user.role,
        selectedConversation: filteredConversations.find(c => c.participantId === selectedParticipantId)
      })

      // Add validation for user and participant IDs
      if (!user.id || !selectedParticipantId) {
        console.error('❌ [UserChat] Invalid user or participant ID:', {
          userId: user.id,
          participantId: selectedParticipantId
        })
        setError('Invalid user or seller ID. Please refresh the page and try again.')
        return
      }

      // Validate UUID format (basic check)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(user.id) || !uuidRegex.test(selectedParticipantId)) {
        console.error('❌ [UserChat] Invalid UUID format:', {
          userId: user.id,
          userIdValid: uuidRegex.test(user.id),
          participantId: selectedParticipantId,
          participantIdValid: uuidRegex.test(selectedParticipantId)
        })
        setError('Invalid ID format. Please refresh the page and try again.')
        return
      }

      // Add socket connection validation
      if (!socket.connected) {
        console.error('❌ [UserChat] Socket not connected, cannot send message')
        setError('Connection lost. Please refresh the page and try again.')
        return
      }

      console.log('🚀 [UserChat] Sending via WebSocket...')
      
      // Try WebSocket first
      try {
        chatService.sendMessageViaSocket(
          String(user.id),
          selectedParticipantId,
          messageText,
          socket
        )
        console.log('✅ [UserChat] Message sent via WebSocket')
      } catch (wsError) {
        console.error('❌ [UserChat] WebSocket send failed, trying REST API fallback:', wsError)
        
        // Fallback to REST API
        try {
          await chatService.sendMessageViaRest(
            String(user.id),
            selectedParticipantId,
            messageText,
            token
          )
          console.log('✅ [UserChat] Message sent via REST API fallback')
        } catch (restError) {
          console.error('❌ [UserChat] Both WebSocket and REST API failed:', restError)
          setError('Failed to send message. Please check your connection and try again.')
          setNewMessage(messageText) // Restore the message text
          return
        }
      }

      // Optimistically add message to UI
      const tempMessage: ChatMessageDto = {
        id: `temp-${Date.now()}`,
        fromId: String(user.id),
        toId: selectedParticipantId,
        message: messageText,
        messageType: 'TEXT',
        createdAt: new Date().toISOString(),
        deletedBySender: false,
        deletedByReceiver: false,
        isRead: false,
        readAt: null,
        from: {
          id: String(user.id),
          name: user.name || 'You',
          role: user.role || 'USER'
        },
        to: {
          id: selectedParticipantId,
          name: filteredConversations.find(c => c.participantId === selectedParticipantId)?.participantName || 'User',
          role: filteredConversations.find(c => c.participantId === selectedParticipantId)?.participantRole || 'USER'
        }
      }

      console.log('➕ [UserChat] Adding optimistic message to UI:', {
        messageId: tempMessage.id,
        from: tempMessage.from.name,
        to: tempMessage.to.name
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
        // Update total messages count when sending messages
        setTotalMessages(prevTotal => prevTotal + 1)
        
        return [...prev, tempMessage]
      })

    } catch (error) {
      console.error('[UserMessages] Failed to send message:', error)
      // Re-add the message to input on error
      setNewMessage(messageText)
    }
  }, [newMessage, selectedParticipantId, user, socket, sendSocketMessage, filteredConversations])

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

  const selectedConversation = filteredConversations.find(c => c.participantId === selectedParticipantId)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
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

      {/* Product Context Banner (if applicable) */}
      {productName && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-yellow-800">
            <MessageSquare className="w-4 h-4" />
            <span>Chat about: <strong>{decodeURIComponent(productName)}</strong></span>
            {productType && <span className="text-xs bg-yellow-200 px-2 py-1 rounded">({productType})</span>}
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 mb-6 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-red-800">
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">!</span>
            </div>
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
        {/* Left Side - Conversations List */}
        <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
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
          
          <div className="overflow-y-auto h-full">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                {search ? (
                  <>
                    <p className="text-gray-600 mb-2">No conversations found for "{search}"</p>
                    <button 
                      onClick={() => setSearch('')}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Clear search
                    </button>
                  </>
                ) : (
                  <>
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No conversations yet</p>
                    <p className="text-sm text-gray-500">Sellers will initiate conversations with you about products</p>
                  </>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.participantId}
                    onClick={() => handleSelectConversation(conversation.participantId)}
                    className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedParticipantId === conversation.participantId ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {conversation.participantName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-900 truncate text-sm">
                          {conversation.participantName}
                        </h3>
                        {conversation.unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-red-500 text-white rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs truncate">
                        {conversation.lastMessage?.message || 'No messages yet'}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {conversation.lastMessage ? formatMessageTime(new Date(conversation.lastMessage.createdAt).getTime()) : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Chat Messages */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
          {selectedParticipantId && selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {selectedConversation.participantName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {selectedConversation.participantName}
                    </h3>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500">{selectedConversation.participantRole}</p>
                      {/* Show product context if this conversation was started from a product page */}
                      {preSelectedSellerId === selectedConversation.participantId && productName && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                          About: {decodeURIComponent(productName)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 messages-container">
                {/* Load More Messages Button */}
                {hasMoreMessages && messages.length > 0 && (
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
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    {preSelectedSellerId === selectedParticipantId && productName ? (
                      <>
                        <p className="text-gray-600 mb-2">Start chatting with {selectedConversation?.participantName}</p>
                        <p className="text-sm text-gray-500 mb-4">Ask questions about <strong>{decodeURIComponent(productName)}</strong></p>
                        <div className="text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-md inline-block">
                          💎 {productType === 'gemstone' ? 'Gemstone' : productType === 'diamond' ? 'Diamond' : 'Product'} Chat
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-600">No messages yet</p>
                        <p className="text-sm text-gray-500">Start the conversation!</p>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => {
                      const isOwnMessage = message.fromId === String(user.id)
                      return (
                        <div key={message.id || index} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isOwnMessage 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm">{message.message}</p>
                            <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                              {formatMessageTime(new Date(message.createdAt).getTime())}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                    
                    {/* Message Count Info */}
                    {totalMessages > messages.length && (
                      <div className="flex justify-center py-2">
                        <p className="text-xs text-gray-500">
                          Showing {messages.length} of {totalMessages} messages
                        </p>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!connected}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || !connected}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Select a conversation to start chatting</p>
                <p className="text-sm text-gray-500">Choose a conversation from the left to view messages</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}