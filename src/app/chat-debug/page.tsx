'use client'

import React, { useState, useEffect } from 'react'
import { useAppSelector } from '@/store/hooks'
import { useSocket } from '@/components/chat/SocketProvider'
import { CHAT_EVENTS } from '@/components/chat/socket'
import { chatService } from '@/services/chat.service'

export default function ChatDebugPage() {
  const { token, user } = useAppSelector((state) => state.auth)
  const { socket, sendMessage, connected } = useSocket()
  const [testMessage, setTestMessage] = useState('Test message from debug page')
  const [testSellerId, setTestSellerId] = useState('7ad3e142-ae9e-44fb-9e51-e28dae19e1dd')
  const [testUserId, setTestUserId] = useState('56812cf4-b9ab-4082-a3cc-e1a48fc513c1')
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  useEffect(() => {
    if (!socket) return

    const onMessage = (payload: any) => {
      addLog(`📨 MESSAGE received: ${JSON.stringify(payload, null, 2)}`)
    }

    const onChatCreated = (payload: any) => {
      addLog(`🆕 CHAT_CREATED received: ${JSON.stringify(payload, null, 2)}`)
    }

    const onError = (payload: any) => {
      addLog(`❌ ERROR received: ${JSON.stringify(payload, null, 2)}`)
    }

    socket.on(CHAT_EVENTS.SERVER.MESSAGE, onMessage)
    socket.on(CHAT_EVENTS.SERVER.CHAT_CREATED, onChatCreated)
    socket.on(CHAT_EVENTS.SERVER.ERROR, onError)

    return () => {
      socket.off(CHAT_EVENTS.SERVER.MESSAGE, onMessage)
      socket.off(CHAT_EVENTS.SERVER.CHAT_CREATED, onChatCreated)
      socket.off(CHAT_EVENTS.SERVER.ERROR, onError)
    }
  }, [socket])

  const testCreateChatFirst = async () => {
    if (!user?.id) {
      addLog('❌ No user logged in')
      return
    }

    try {
      // Test the new getOrCreateChat method
      const chatRes = await chatService.getOrCreateChat(
        { 
          userId: user.id, 
          sellerId: testSellerId,
          productId: 'test-product-123'
        }, 
        token || undefined
      )
      
      addLog(`🆕 getOrCreateChat result: ${JSON.stringify(chatRes, null, 2)}`)
      
      if (chatRes?.data?.id) {
        const chatId = chatRes.data.id
        addLog(`✅ Chat ready with ID: ${chatId}`)
        
        // Now send a message with the chatId
        const payload = {
          chatId: chatId,
          toSellerId: testSellerId,
          toUserId: testSellerId,
          fromUserId: user.id,
          text: testMessage,
          clientTempId: `debug-with-chatid-${Date.now()}`
        }
        
        addLog(`🚀 Sending message with chatId: ${JSON.stringify(payload, null, 2)}`)
        sendMessage(payload)
      }
    } catch (error) {
      addLog(`❌ Error in getOrCreateChat: ${JSON.stringify(error, null, 2)}`)
    }
  }

  const testSendMessageWithoutChatId = () => {
    if (!user?.id) {
      addLog('❌ No user logged in')
      return
    }

    const payload = {
      // No chatId - should trigger chat creation
      toSellerId: testSellerId,
      toUserId: testSellerId,
      toId: testSellerId,
      fromUserId: user.id,
      fromId: user.id,
      text: testMessage,
      message: testMessage,
      clientTempId: `debug-${Date.now()}`,
      initiatedBy: 'user',
      participantType: 'user-seller',
      productContext: { productId: 'test-product', productName: 'Test Product' }
    }

    addLog(`🚀 Sending SEND_MESSAGE without chatId: ${JSON.stringify(payload, null, 2)}`)
    sendMessage(payload)
  }

  const testSendMessageAsSeller = () => {
    if (!user?.id) {
      addLog('❌ No user logged in')
      return
    }

    const payload = {
      // No chatId - should trigger chat creation from seller side
      toUserId: testUserId,
      toId: testUserId,
      fromUserId: user.id,
      fromId: user.id,
      fromSellerId: user.id,
      text: testMessage,
      message: testMessage,
      clientTempId: `debug-seller-${Date.now()}`,
      initiatedBy: 'seller',
      participantType: 'user-seller'
    }

    addLog(`🚀 Sending SEND_MESSAGE as seller without chatId: ${JSON.stringify(payload, null, 2)}`)
    sendMessage(payload)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Chat Debug Console</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">Connection Status</h2>
          <div className="space-y-2">
            <div className={`flex items-center space-x-2 ${connected ? 'text-green-600' : 'text-red-600'}`}>
              <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>Socket: {connected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <div className={`flex items-center space-x-2 ${user ? 'text-green-600' : 'text-yellow-600'}`}>
              <div className={`w-3 h-3 rounded-full ${user ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span>User: {user ? `${user.name} (${user.role})` : 'Not logged in'}</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              User ID: {user?.id || 'None'}
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">Test Chat Creation</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Test Message</label>
              <input
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Test Seller ID</label>
              <input
                type="text"
                value={testSellerId}
                onChange={(e) => setTestSellerId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Test User ID</label>
              <input
                type="text"
                value={testUserId}
                onChange={(e) => setTestUserId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <button
                onClick={testCreateChatFirst}
                disabled={!connected || !user}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Test getOrCreateChat + Send Message
              </button>
              <button
                onClick={testSendMessageWithoutChatId}
                disabled={!connected || !user}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Test User → Seller Message (No ChatId)
              </button>
              <button
                onClick={testSendMessageAsSeller}
                disabled={!connected || !user}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Test Seller → User Message (No ChatId)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Logs */}
      <div className="mt-6 bg-black text-green-400 rounded-lg p-4 shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Debug Logs</h2>
          <button
            onClick={() => setLogs([])}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Clear Logs
          </button>
        </div>
        <div className="space-y-1 max-h-96 overflow-y-auto font-mono text-sm">
          {logs.length === 0 ? (
            <div className="text-gray-500">No logs yet. Try sending a test message.</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="whitespace-pre-wrap">{log}</div>
            ))
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">How to Test ChatId Issue</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Make sure you're logged in and socket is connected</li>
          <li>Click "Test User → Seller Message" to simulate a new chat creation</li>
          <li>Check the debug logs for the exact payload being sent</li>
          <li>Watch for CHAT_CREATED or MESSAGE events from the backend</li>
          <li>If chatId is still undefined, check your backend chat creation logic</li>
        </ol>
      </div>
    </div>
  )
}