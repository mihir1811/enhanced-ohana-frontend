'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { chatService } from '@/services/chat.service'
import type { ChatConversation, ChatMessageDto } from '@/services/chat.service'
import { MessageSquare, Search, Wifi, User, Send } from 'lucide-react'
import { useSocket } from '@/components/chat/SocketProvider'
import { formatMessageTime } from '@/services/chat.utils'

export default function UserMessagesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { token, user } = useAppSelector((s) => s.auth)
  const { connected, socket, register, onMessage } = useSocket()
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessageDto[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Auto-selection state to prevent duplicate processing
  const autoSelectionAttemptedRef = useRef<string | null>(null)
  
  // Rate limiting for message sending
  const lastMessageTimeRef = useRef<number>(0)
  const MESSAGE_RATE_LIMIT = 1000 // 1 second between messages
  
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
  // Track current selected participant to avoid stale closures
  const selectedParticipantRef = useRef<string | null>(null)

  // Update ref when selectedParticipantId changes
  useEffect(() => {
    selectedParticipantRef.current = selectedParticipantId
  }, [selectedParticipantId])

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

    const handleError = (error: { pattern?: string; data?: unknown; cause?: unknown; message?: string }) => {
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
          
          setConversations(prev => {
            // If we have locally created conversations (from auto-selection), merge them
            const localConversations = prev.filter(conv => 
              !sellerConversations.some(serverConv => serverConv.participantId === conv.participantId)
            )
            
            if (localConversations.length > 0) {
              console.log('� [UserChat] Merging server conversations with local conversations:', {
                serverCount: sellerConversations.length,
                localCount: localConversations.length,
                localIds: localConversations.map(c => c.participantId)
              })
              return [...sellerConversations, ...localConversations]
            } else {
              console.log('📝 [UserChat] Using server conversations (no local conversations to merge)')
              return sellerConversations
            }
          })
          
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
    
    console.log('✅ [UserChat] Setting up message listener for user:', user?.id)

    const handleNewMessage = (message: ChatMessageDto) => {
      console.log('📨 [UserChat] Received new message:', message)
      console.log('🔍 [UserChat] Current user ID:', user?.id)
      console.log('🔍 [UserChat] Socket connected:', connected)
      console.log('🔍 [UserChat] Message timestamp:', new Date().toISOString())
      
      // Add a prominent log that's easy to spot
      console.log('🔥🔥🔥 [UserChat] MESSAGE RECEIVED - THIS SHOULD BE VISIBLE 🔥🔥🔥')
      
      // Handle different possible message structures from backend
      const fromId = String(message.fromId || message.from?.id || '')
      const toId = String(message.toId || message.to?.id || '')
      const messageText = String(message.message || '')
      
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
        createdAt: message.createdAt || new Date().toISOString(),
        deletedBySender: message.deletedBySender || false,
        deletedByReceiver: message.deletedByReceiver || false,
        isRead: message.isRead || false,
        readAt: message.readAt || null,
        fileUrl: message.fileUrl || null,
        from: {
          id: fromId,
          name: String(message.from?.name || 'Unknown User'),
          role: String(message.from?.role || 'seller')
        },
        to: {
          id: toId,
          name: String(message.to?.name || 'Unknown User'),
          role: String(message.to?.role || 'user')
        }
      }
      
      // If message is for current conversation, add to messages
      const currentUserId = String(user?.id || '')
      const selectedParticipant = String(selectedParticipantRef.current || '')
      const messageFromId = String(safeMessage.fromId)
      const messageToId = String(safeMessage.toId)
      
      const shouldAddToCurrentConversation = selectedParticipant && currentUserId && 
          ((messageFromId === selectedParticipant && messageToId === currentUserId) ||
           (messageFromId === currentUserId && messageToId === selectedParticipant))
      
      // Check if this message was already processed
      const messageKey = `${safeMessage.fromId}-${safeMessage.toId}-${safeMessage.message}-${safeMessage.createdAt}`
      const wasAddedLocally = locallyAddedMessagesRef.current.has(messageKey)
      const wasAlreadyProcessed = processedMessagesRef.current.has(messageKey)
      
      console.log('🔍 [UserChat] Message processing check:', {
        messageKey: messageKey.substring(0, 50) + '...',
        wasAddedLocally,
        wasAlreadyProcessed,
        shouldAddToCurrentConversation,
        messageFromId,
        messageToId,
        currentUserId,
        selectedParticipant,
        hasSelectedParticipant: !!selectedParticipant,
        condition1: selectedParticipant && currentUserId && messageFromId === selectedParticipant && messageToId === currentUserId,
        condition2: selectedParticipant && currentUserId && messageFromId === currentUserId && messageToId === selectedParticipant,
        messageForCurrentUser: messageToId === currentUserId || messageFromId === currentUserId
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
      } else if (messageToId === currentUserId && messageFromId !== currentUserId) {
        // Message is for current user but not for selected conversation
        console.log('📬 [UserChat] Message received for current user from different seller:', messageFromId)
        console.log('🎯 [UserChat] Current selected participant:', selectedParticipant)
        
        // If no conversation is selected, auto-select this one
        if (!selectedParticipant) {
          console.log('🔄 [UserChat] No conversation selected, auto-selecting sender:', messageFromId)
          setSelectedParticipantId(messageFromId)
        }
      } else {
        console.log('❌ [UserChat] Message not relevant to current user')
        console.log('🔍 [UserChat] Message details:', {
          isForCurrentUser: messageToId === currentUserId,
          isFromCurrentUser: messageFromId === currentUserId,
          hasSelectedConversation: !!selectedParticipant
        })
      }
      
      // Update conversations list
      setConversations(prev => {
        const updatedConversations = prev.map(conv => {
          // Only update conversations that involve the current user and this participant
          if (currentUserId && 
              ((conv.participantId === messageFromId && messageToId === currentUserId) ||
               (conv.participantId === messageToId && messageFromId === currentUserId))) {
            return {
              ...conv,
              lastMessage: safeMessage,
              unreadCount: conv.participantId === messageFromId ? conv.unreadCount + 1 : conv.unreadCount,
              messages: [...(conv.messages || []), safeMessage]
            }
          }
          return conv
        })
        
        // If message is from a new seller that doesn't have a conversation yet, create one
        const isMessageFromSeller = safeMessage.from?.role === 'seller' && messageToId === currentUserId
        const hasExistingConversation = prev.find(conv => conv.participantId === messageFromId)
        
        if (isMessageFromSeller && !hasExistingConversation && currentUserId) {
          console.log('🆕 [UserChat] Creating new conversation for seller who sent message:', {
            sellerId: messageFromId,
            sellerName: safeMessage.from?.name,
            message: safeMessage.message.substring(0, 50) + '...'
          })
          
          const newConversation: ChatConversation = {
            participantId: messageFromId,
            participantName: safeMessage.from?.name || 'Seller',
            participantRole: 'seller',
            lastMessage: safeMessage,
            unreadCount: 1,
            messages: [safeMessage]
          }
          
          return [...updatedConversations, newConversation]
        }
        
        return updatedConversations
      })
    }

    // Subscribe to messages through SocketProvider
    const unsubscribe = onMessage(handleNewMessage)
    
    return unsubscribe
  }, [connected, onMessage, user?.id]) // Removed selectedParticipantId from dependencies

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
        if (meta && typeof meta === 'object') {
          const metaObj = meta as { total?: number; currentPage?: number; lastPage?: number }
          setTotalMessages(metaObj.total || sortedMessages.length)
          setHasMoreMessages((metaObj.currentPage || 0) < (metaObj.lastPage || 0))
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
          
          // Mark unread messages as read (only for initial load, not pagination)
          const unreadMessageIds = sortedMessages
            .filter(msg => msg.fromId === participantId && !msg.isRead) // Only messages from the other person that are unread
            .map(msg => msg.id)
            .filter(id => id && !id.startsWith('temp-')) // Exclude temporary/local message IDs
          
          if (unreadMessageIds.length > 0) {
            console.log(`📖 [UserChat] Marking ${unreadMessageIds.length} messages as read`)
            chatService.markMessagesAsRead(unreadMessageIds, token)
              .then(() => {
                console.log('✅ [UserChat] Messages marked as read successfully')
                // Update conversation unread count
                setConversations(prev => prev.map(conv => 
                  conv.participantId === participantId 
                    ? { ...conv, unreadCount: 0 }
                    : conv
                ))
              })
              .catch(err => {
                console.error('❌ [UserChat] Failed to mark messages as read:', err)
                // Don't show error to user as this is not critical for UX
              })
          }
        }
        
        console.log(`✅ [UserChat] Loaded ${sortedMessages.length} messages for conversation`, {
          totalFromMeta: meta && typeof meta === 'object' ? (meta as { total?: number }).total : undefined,
          currentPage: meta && typeof meta === 'object' ? (meta as { currentPage?: number }).currentPage : undefined,
          lastPage: meta && typeof meta === 'object' ? (meta as { lastPage?: number }).lastPage : undefined,
          hasMore: meta && typeof meta === 'object' ? ((meta as { currentPage?: number; lastPage?: number }).currentPage || 0) < ((meta as { lastPage?: number }).lastPage || 0) : false
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
      
      // Note: Messages will be marked as read after they are loaded in loadConversationMessages
    }
  }, [conversations, loadConversationMessages])

  // Reset auto-selection state when seller ID changes
  useEffect(() => {
    console.log('🔄 [UserChat] Seller ID changed, resetting auto-selection state:', {
      newSellerId: preSelectedSellerId,
      previousAttempted: autoSelectionAttemptedRef.current
    })
    
    if (preSelectedSellerId !== autoSelectionAttemptedRef.current) {
      autoSelectionAttemptedRef.current = null
    }
  }, [preSelectedSellerId])

  // Auto-select seller from URL parameters - SIMPLE AND RELIABLE
  useEffect(() => {
    // Only proceed if we have necessary conditions
    if (!preSelectedSellerId || !user?.id || loading) {
      return
    }

    // Prevent processing the same seller ID multiple times
    if (autoSelectionAttemptedRef.current === preSelectedSellerId) {
      return
    }

    console.log('🔍 [UserChat] Processing seller ID from URL:', {
      sellerId: preSelectedSellerId,
      conversationsCount: conversations.length,
      allSellerIds: conversations.map(c => c.participantId)
    })

    // Mark this seller ID as being processed
    autoSelectionAttemptedRef.current = preSelectedSellerId

    // Check if seller ID exists in current conversations
    const existingConversation = conversations.find(conv => conv.participantId === preSelectedSellerId)

    if (existingConversation) {
      // Seller exists in conversations - select it
      console.log('✅ [UserChat] Seller exists in conversations - selecting existing:', {
        sellerId: preSelectedSellerId,
        sellerName: existingConversation.participantName
      })
      
      handleSelectConversation(preSelectedSellerId)
    } else {
      // Seller does NOT exist in conversations - create new box
      console.log('🆕 [UserChat] Seller NOT in conversations - creating new box:', {
        sellerId: preSelectedSellerId,
        existingConversations: conversations.map(c => ({ id: c.participantId, name: c.participantName }))
      })

      const sellerName = productName ? `Seller (${decodeURIComponent(productName)})` : 'Seller'
      
      const newConversation: ChatConversation = {
        participantId: preSelectedSellerId,
        participantName: sellerName,
        participantRole: 'seller',
        lastMessage: undefined,
        unreadCount: 0,
        messages: []
      }

      // Add new conversation to the list
      setConversations(prev => {
        console.log('🔄 [UserChat] Adding new conversation to list:', {
          newConversation: newConversation,
          currentCount: prev.length,
          newCount: prev.length + 1
        })
        return [...prev, newConversation]
      })

      // Use setTimeout to ensure conversation is added before selection
      setTimeout(() => {
        console.log('⏰ [UserChat] Selecting new conversation after timeout:', preSelectedSellerId)
        handleSelectConversation(preSelectedSellerId)
        
        // Pre-fill welcome message if product info available
        if (productName && productType) {
          const welcomeMessage = `Hello! I'm interested in your ${productType}: ${decodeURIComponent(productName)}`
          console.log('📩 [UserChat] Pre-filling welcome message:', welcomeMessage)
          setNewMessage(welcomeMessage)
        }
      }, 100) // Small delay to ensure state update is processed
    }
  }, [preSelectedSellerId, conversations, user?.id, loading, handleSelectConversation, productName, productType])

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
    const filtered = conversations.filter(conv => 
      query ? (
        conv.participantName.toLowerCase().includes(query) || 
        conv.lastMessage?.message.toLowerCase().includes(query)
      ) : true
    )
    
    console.log('🔍 [UserChat] Filtered conversations updated:', {
      totalConversations: conversations.length,
      filteredCount: filtered.length,
      searchQuery: query,
      conversationIds: filtered.map(c => ({ id: c.participantId, name: c.participantName })),
      preSelectedSellerId
    })
    
    return filtered
  }, [conversations, search, preSelectedSellerId])

  // Send message
  const handleSendMessage = useCallback(async () => {
    // Rate limiting check
    const now = Date.now()
    if (now - lastMessageTimeRef.current < MESSAGE_RATE_LIMIT) {
      console.log('⚠️ [UserChat] Rate limited - please wait before sending another message')
      setError('Please wait a moment before sending another message.')
      setTimeout(() => setError(null), 2000)
      return
    }
    
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

    lastMessageTimeRef.current = now

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

      console.log('🚀 [UserChat] Sending via WebSocket only...')
      
      // Send via WebSocket (no REST API fallback)
      try {
        await chatService.sendMessageWithInit(
          String(user.id),
          selectedParticipantId,
          messageText,
          socket
        )
        console.log('✅ [UserChat] Message sent via WebSocket')
      } catch (wsError) {
        console.error('❌ [UserChat] WebSocket send failed:', wsError)
        
        // Try basic WebSocket as fallback
        try {
          chatService.sendMessageViaSocket(
            String(user.id),
            selectedParticipantId,
            messageText,
            socket
          )
          console.log('✅ [UserChat] Message sent via basic WebSocket')
        } catch (basicWsError) {
          console.error('❌ [UserChat] All WebSocket methods failed:', basicWsError)
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
        fileUrl: null,
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
  }, [newMessage, selectedParticipantId, user, socket, filteredConversations])

  if (!token || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
          <p className="mb-4" style={{ color: 'var(--muted-foreground)' }}>Please log in to view your messages</p>
          <button 
            onClick={() => router.push('/login')}
            className="px-4 py-2 rounded-md"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  const selectedConversation = filteredConversations.find(c => c.participantId === selectedParticipantId)

  if (!token || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
          <p className="mb-4" style={{ color: 'var(--muted-foreground)' }}>Please log in to view your messages</p>
          <button 
            onClick={() => router.push('/login')}
            className="px-4 py-2 rounded-md"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--muted)' }}>
      {/* Header */}
      <div className="flex-none border-b px-4 py-3 sm:px-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6" style={{ color: 'var(--primary)' }} />
            <h1 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>My Messages</h1>
            <span 
              className="inline-flex items-center gap-1.5 text-sm px-2 py-1 rounded-full"
              style={{ 
                color: connected ? 'var(--status-success)' : 'var(--muted-foreground)', 
                backgroundColor: connected ? 'var(--status-success-bg)' : 'var(--muted)' 
              }}
            >
              <Wifi className="w-3.5 h-3.5" />
              {connected ? 'Online' : 'Offline'}
            </span>
          </div>
          
          {/* Mobile menu button - could be added for mobile navigation */}
          <div className="lg:hidden">
            {selectedParticipantId && (
              <button
                onClick={() => setSelectedParticipantId(null)}
                className="p-2 transition-colors"
                style={{ color: 'var(--muted-foreground)' }}
              >
                <User className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        
        {/* Product Context Banner */}
        {productName && (
          <div className="mt-3 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--card-diamond-bg)', border: '1px solid var(--card-diamond-border)' }}>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--card-diamond-icon-text)' }}>
              <MessageSquare className="w-4 h-4" />
              <span>Chat about: <strong>{decodeURIComponent(productName)}</strong></span>
              {productType && <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--card-diamond-icon-bg)' }}>{productType}</span>}
            </div>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex-none border-b px-4 py-3 sm:px-6" style={{ backgroundColor: 'var(--destructive-bg)', borderColor: 'var(--destructive)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--destructive)' }}>
              <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--destructive)' }}>
                <span className="text-xs font-bold text-white">!</span>
              </div>
              <span>{error}</span>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-lg font-bold"
              style={{ color: 'var(--destructive)' }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Chat Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Conversations List */}
        <div className={`${
          selectedParticipantId ? 'hidden lg:flex' : 'flex'
        } flex-col w-full lg:w-80 xl:w-96 border-r`}
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          {/* Search Header */}
          <div className="flex-none p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ border: '1px solid var(--border)' }}
              />
            </div>
          </div>
          
          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary)' }}></div>
                <p className="mt-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>Loading conversations...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 px-6 text-center">
                {search ? (
                  <>
                    <Search className="w-12 h-12 mb-4" style={{ color: 'var(--muted-foreground)' }} />
                    <p className="mb-2" style={{ color: 'var(--muted-foreground)' }}>No conversations found for &ldquo;{search}&rdquo;</p>
                    <button 
                      onClick={() => setSearch('')}
                      className="text-sm font-medium"
                      style={{ color: 'var(--primary)' }}
                    >
                      Clear search
                    </button>
                  </>
                ) : (
                  <>
                    <User className="w-16 h-16 mb-4" style={{ color: 'var(--muted-foreground)' }} />
                    <p className="mb-2 font-medium" style={{ color: 'var(--muted-foreground)' }}>No conversations yet</p>
                    <p className="text-sm max-w-48" style={{ color: 'var(--muted-foreground)' }}>Sellers will appear here when they initiate conversations about products</p>
                  </>
                )}
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {filteredConversations.map((conversation) => {
                  const isNewConversation = !conversation.lastMessage
                  const isSelected = selectedParticipantId === conversation.participantId
                  
                  return (
                    <div
                      key={conversation.participantId}
                      onClick={() => handleSelectConversation(conversation.participantId)}
                      className="flex items-center gap-3 p-4 cursor-pointer transition-all duration-200"
                      style={{
                        backgroundColor: isSelected ? 'var(--card-diamond-bg)' : isNewConversation ? 'var(--status-success-bg)' : 'transparent'
                      }}
                    >
                      <div className="flex-shrink-0">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                          style={{
                            background: isNewConversation ? 'linear-gradient(135deg, var(--status-success), var(--status-warning))' : 'linear-gradient(135deg, var(--primary), var(--card-gem-icon-text))'
                          }}
                        >
                          {conversation.participantName.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold truncate" style={{ color: 'var(--foreground)' }}>
                            {conversation.participantName}
                            {isNewConversation && (
                              <span className="ml-2 text-xs font-normal" style={{ color: 'var(--status-success)' }}>✨ Ready to chat</span>
                            )}
                          </h3>
                          <div className="flex items-center gap-1.5">
                            {isNewConversation && (
                              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-semibold text-white rounded-full animate-pulse" style={{ backgroundColor: 'var(--status-success)' }}>
                                New
                              </span>
                            )}
                            {conversation.unreadCount > 0 && (
                              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold text-white rounded-full" style={{ backgroundColor: 'var(--destructive)' }}>
                                {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                        <p 
                          className="text-sm truncate"
                          style={{ color: isNewConversation ? 'var(--status-success)' : 'var(--muted-foreground)' }}>
                          {conversation.lastMessage?.message || 'Click to start chatting'}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                          {conversation.lastMessage ? formatMessageTime(new Date(conversation.lastMessage.createdAt).getTime()) : 'Just now'}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
        {/* Right Side - Chat Messages */}
        <div className={`${
          selectedParticipantId ? 'flex' : 'hidden lg:flex'
        } flex-col flex-1`}
          style={{ backgroundColor: 'var(--card)' }}
        >
          {selectedParticipantId && selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="flex-none p-4 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
                <div className="flex items-center gap-3">
                  {/* Mobile back button */}
                  <button 
                    onClick={() => setSelectedParticipantId(null)}
                    className="lg:hidden p-1"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: 'linear-gradient(135deg, var(--primary), var(--card-gem-icon-text))' }}>
                    {selectedConversation.participantName.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate" style={{ color: 'var(--foreground)' }}>
                      {selectedConversation.participantName}
                    </h3>
                    <div className="flex items-center gap-2">
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{selectedConversation.participantRole}</p>
                      {preSelectedSellerId === selectedConversation.participantId && productName && (
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--card-diamond-bg)', color: 'var(--card-diamond-icon-text)' }}>
                          About: {decodeURIComponent(productName)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    {connected ? '🟢 Online' : '🔴 Offline'}
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: 'var(--muted)' }}>
                {/* Load More Messages Button */}
                {hasMoreMessages && messages.length > 0 && (
                  <div className="flex justify-center mb-4">
                    <button
                      onClick={loadMoreMessages}
                      disabled={loadingMoreMessages}
                      className="px-4 py-2 rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                    >
                      {loadingMoreMessages ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: 'var(--primary)' }}></div>
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
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 mb-3" style={{ borderColor: 'var(--primary)' }}></div>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Loading messages...</p>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-6">
                    <MessageSquare className="w-16 h-16 mb-4" style={{ color: 'var(--muted-foreground)' }} />
                    {preSelectedSellerId === selectedParticipantId && productName ? (
                      <>
                        <p className="mb-2 font-medium" style={{ color: 'var(--muted-foreground)' }}>Start chatting with {selectedConversation?.participantName}</p>
                        <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>Ask questions about <strong>{decodeURIComponent(productName)}</strong></p>
                        <div className="text-xs px-4 py-2 rounded-lg" style={{ color: 'var(--muted-foreground)', backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                          💎 {productType === 'gemstone' ? 'Gemstone' : productType === 'diamond' ? 'Diamond' : 'Product'} Chat
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="mb-2 font-medium" style={{ color: 'var(--muted-foreground)' }}>No messages yet</p>
                        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Start the conversation by sending a message!</p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => {
                      const isOwnMessage = message.fromId === String(user.id)
                      return (
                        <div key={message.id || index} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                          <div 
                            className="max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl shadow-sm"
                            style={{
                              backgroundColor: isOwnMessage ? 'var(--primary)' : 'var(--card)',
                              color: isOwnMessage ? 'var(--primary-foreground)' : 'var(--foreground)',
                              border: isOwnMessage ? 'none' : '1px solid var(--border)'
                            }}
                          >
                            <p className="text-sm leading-relaxed">{message.message}</p>
                            <p className="text-xs mt-2" style={{ color: isOwnMessage ? 'var(--primary-foreground)' : 'var(--muted-foreground)', opacity: 0.9 }}>
                              {formatMessageTime(new Date(message.createdAt).getTime())}
                              {isOwnMessage && message.isRead && (
                                <span className="ml-2">✓✓</span>
                              )}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                    
                    {/* Message Count Info */}
                    {totalMessages > messages.length && (
                      <div className="flex justify-center py-2">
                        <p className="text-xs px-3 py-1 rounded-full" style={{ color: 'var(--muted-foreground)', backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                          Showing {messages.length} of {totalMessages} messages
                        </p>
                      </div>
                    )}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="flex-none p-4 border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      placeholder={connected ? "Type your message..." : "Connecting..."}
                      className="w-full px-4 py-3 rounded-full focus:outline-none focus:ring-2 pr-12 text-sm"
                      style={{ border: '1px solid var(--border)' }}
                      disabled={!connected}
                    />
                    {newMessage.trim() && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        {newMessage.length}/1000
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || !connected}
                    className="w-12 h-12 rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 shadow-sm"
                    style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                
                {!connected && (
                  <div className="mt-2 text-center">
                    <p className="text-xs" style={{ color: 'var(--destructive)' }}>Connection lost. Reconnecting...</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: 'var(--muted)' }}>
              <div className="text-center px-6">
                <MessageSquare className="w-20 h-20 mx-auto mb-6" style={{ color: 'var(--muted-foreground)' }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>Select a conversation</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Choose a conversation from the sidebar to start chatting</p>
                
                {/* Mobile call-to-action */}
                <div className="lg:hidden mt-6">
                  <button
                    onClick={() => setSelectedParticipantId(null)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                    style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                  >
                    <User className="w-4 h-4" />
                    Browse Conversations
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}