'use client'

import React, { useState, useEffect } from 'react'
import { useAppSelector } from '@/store/hooks'
import { useSocket } from '@/components/chat/SocketProvider'
import { chatService, type ChatMessageDto, type ChatConversation } from '@/services/chat.service'
import { MessageSquare, Send, Wifi } from 'lucide-react'

/**
 * Test page for verifying seller-to-user chat functionality
 * This component tests:
 * 1. WebSocket connection for sellers
 * 2. Conversation loading from backend
 * 3. Real-time message sending/receiving
 * 4. Integration with user chat system
 */
export default function SellerChatTestPage() {
  const { token, user } = useAppSelector((s) => s.auth)
  const { connected, register, socket } = useSocket()
  
  const [testUserId, setTestUserId] = useState('')
  const [testMessage, setTestMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessageDto[]>([])
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [logs, setLogs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  // Register socket when component mounts
  useEffect(() => {
    if (!socket || !connected || !user?.id) return
    
    try {
      register(user.id)
      addLog(`✅ Socket registered for seller: ${user.id}`)
    } catch (e) {
      addLog(`❌ Socket registration failed: ${e}`)
    }
  }, [socket, connected, user?.id, register])

  // Listen for incoming messages
  useEffect(() => {
    if (!socket || !connected) return

    const handleNewMessage = (message: ChatMessageDto) => {
      addLog(`📨 Received message: ${JSON.stringify(message)}`)
      setMessages(prev => [...prev, message])
    }

    socket.on('MESSAGE', handleNewMessage)
    
    return () => {
      socket.off('MESSAGE', handleNewMessage)
    }
  }, [socket, connected])

  // Test conversation loading
  const testLoadConversations = async () => {
    if (!token) {
      addLog('❌ No auth token available')
      return
    }

    setLoading(true)
    addLog('🔄 Loading conversations...')
    
    try {
      const response = await chatService.getConversations({ limit: 10, page: 1 }, token, user?.id)
      addLog(`✅ Conversations loaded: ${response.data?.length || 0} items`)
      addLog(`📋 Conversations data: ${JSON.stringify(response.data, null, 2)}`)
      
      if (response.data) {
        const userConversations = response.data.filter((conv: ChatConversation) => 
          conv.participantRole?.toLowerCase() === 'user'
        )
        setConversations(userConversations)
        addLog(`🎯 Filtered user conversations: ${userConversations.length} items`)
      }
    } catch (error) {
      addLog(`❌ Failed to load conversations: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  // Test sending message via WebSocket
  const testSendMessage = () => {
    if (!testUserId.trim() || !testMessage.trim()) {
      addLog('❌ Please provide both User ID and message')
      return
    }

    if (!socket || !connected) {
      addLog('❌ Socket not connected')
      return
    }

    if (!user?.id) {
      addLog('❌ No user ID available')
      return
    }

    try {
      addLog(`🚀 Sending message to user ${testUserId}: "${testMessage}"`)
      
      chatService.sendMessageViaSocket(
        user.id,
        testUserId,
        testMessage,
        socket
      )
      
      // Add message locally for immediate feedback
      const localMessage: ChatMessageDto = {
        id: `local-${Date.now()}`,
        fromId: user.id,
        toId: testUserId,
        message: testMessage,
        messageType: 'TEXT',
        createdAt: new Date().toISOString(),
        deletedBySender: false,
        deletedByReceiver: false,
        isRead: false,
        readAt: null,
        from: { id: user.id, name: 'You (Seller)', role: 'seller' },
        to: { id: testUserId, name: 'Test User', role: 'user' }
      }
      
      setMessages(prev => [...prev, localMessage])
      addLog(`✅ Message sent successfully`)
      setTestMessage('')
      
    } catch (error) {
      addLog(`❌ Failed to send message: ${error}`)
    }
  }

  // Test loading all messages
  const testLoadAllMessages = async () => {
    if (!token) {
      addLog('❌ No auth token available')
      return
    }

    setLoading(true)
    addLog('🔄 Loading all messages...')
    
    try {
      const response = await chatService.getAllMessages({ limit: 50, page: 1 }, token)
      addLog(`✅ Messages loaded: ${response.data?.data?.length || 0} items`)
      addLog(`📋 Messages data: ${JSON.stringify(response.data?.data, null, 2)}`)
      addLog(`📊 Meta data: ${JSON.stringify(response.data?.meta, null, 2)}`)
      
      if (response.data?.data) {
        setMessages(response.data.data)
      }
    } catch (error) {
      addLog(`❌ Failed to load messages: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  if (user?.role !== 'seller') {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Seller Access Required</h2>
        <p className="text-gray-600">This test page is only available to sellers.</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Seller Chat Test Interface</h1>
          <span className={`inline-flex items-center gap-1 text-sm px-2 py-1 rounded-full ${
            connected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            <Wifi className="w-4 h-4" />
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Controls */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Test Controls</h3>
            
            <div className="space-y-3">
              <button
                onClick={testLoadConversations}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load Conversations'}
              </button>
              
              <button
                onClick={testLoadAllMessages}
                disabled={loading}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load All Messages'}
              </button>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Send Test Message</h4>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Target User ID"
                  value={testUserId}
                  onChange={(e) => setTestUserId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Test message..."
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && testSendMessage()}
                  />
                  <button
                    onClick={testSendMessage}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-semibold mb-1">Current User Info</h4>
              <p className="text-sm text-gray-600">ID: {user?.id}</p>
              <p className="text-sm text-gray-600">Name: {user?.name}</p>
              <p className="text-sm text-gray-600">Role: {user?.role}</p>
            </div>
          </div>

          {/* Results Display */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Test Results</h3>
            
            {/* Conversations */}
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-semibold mb-2">Conversations ({conversations.length})</h4>
              <div className="max-h-32 overflow-y-auto text-sm">
                {conversations.length === 0 ? (
                  <p className="text-gray-500">No conversations loaded</p>
                ) : (
                  conversations.map((conv, index) => (
                    <div key={index} className="mb-1 p-2 bg-white rounded border">
                      <p><strong>{conv.participantName}</strong> ({conv.participantRole})</p>
                      <p className="text-gray-600 text-xs">{conv.lastMessage?.message || 'No messages'}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-semibold mb-2">Messages ({messages.length})</h4>
              <div className="max-h-40 overflow-y-auto text-sm space-y-1">
                {messages.length === 0 ? (
                  <p className="text-gray-500">No messages</p>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} className={`p-2 rounded border ${
                      msg.fromId === user?.id ? 'bg-blue-100 ml-4' : 'bg-white mr-4'
                    }`}>
                      <p className="text-xs text-gray-600">
                        {msg.from?.name || msg.fromId} → {msg.to?.name || msg.toId}
                      </p>
                      <p>{msg.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Debug Logs */}
        <div className="mt-6 bg-black text-green-400 p-4 rounded-md font-mono text-sm">
          <h4 className="text-white font-semibold mb-2">Debug Logs</h4>
          <div className="max-h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-400">No logs yet</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))
            )}
          </div>
          <button
            onClick={() => setLogs([])}
            className="mt-2 px-3 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600"
          >
            Clear Logs
          </button>
        </div>
      </div>
    </div>
  )
}