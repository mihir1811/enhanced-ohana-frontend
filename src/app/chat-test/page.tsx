'use client'

import React, { useEffect, useState } from 'react'
import { useSocket } from '@/components/chat/SocketProvider'
import { useAppSelector } from '@/store/hooks'

export default function ChatTestPage() {
  const { connected, socket, sendMessage } = useSocket()
  const { user } = useAppSelector(s => s.auth)
  const [testMessage, setTestMessage] = useState('')
  const [receivedMessages, setReceivedMessages] = useState<any[]>([])
  const [connectionStatus, setConnectionStatus] = useState('Disconnected')

  useEffect(() => {
    if (!socket) return

    setConnectionStatus(connected ? 'Connected' : 'Disconnected')

    // Listen for the exact event name backend sends
    const handleMessage = (data: any) => {
      console.log('🎯 [ChatTest] Received MESSAGE event:', data)
      setReceivedMessages(prev => [...prev, {
        timestamp: Date.now(),
        data,
        type: 'MESSAGE_EVENT'
      }])
    }

    // Listen for all events to debug
    const handleAnyEvent = (eventName: string, data: any) => {
      console.log('📨 [ChatTest] Any event received:', { eventName, data })
      setReceivedMessages(prev => [...prev, {
        timestamp: Date.now(),
        data,
        type: eventName
      }])
    }

    socket.on('MESSAGE', handleMessage)
    socket.onAny(handleAnyEvent)

    return () => {
      socket.off('MESSAGE', handleMessage)
      socket.offAny(handleAnyEvent)
    }
  }, [socket, connected])

  const sendTestMessage = () => {
    if (!testMessage.trim() || !user) return

    sendMessage({
      fromId: String(user.id),
      toId: 'test-receiver-id', // Replace with actual receiver ID
      message: testMessage
    })

    setTestMessage('')
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Chat Implementation Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Connection Status</h2>
          <div className={`p-2 rounded ${connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {connectionStatus}
          </div>
          {socket && (
            <div className="mt-2 text-sm text-gray-600">
              Socket ID: {socket.id}
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Send Test Message</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Enter test message..."
              className="flex-1 px-3 py-2 border rounded"
              onKeyPress={(e) => e.key === 'Enter' && sendTestMessage()}
            />
            <button
              onClick={sendTestMessage}
              disabled={!connected || !testMessage.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg border">
        <h2 className="text-lg font-semibold mb-4">Received Events</h2>
        <div className="max-h-96 overflow-y-auto">
          {receivedMessages.length === 0 ? (
            <p className="text-gray-500">No events received yet...</p>
          ) : (
            receivedMessages.map((msg, index) => (
              <div key={index} className="mb-2 p-2 bg-gray-50 rounded text-sm">
                <div className="font-mono text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()} - {msg.type}
                </div>
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(msg.data, null, 2)}
                </pre>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="font-semibold text-yellow-800 mb-2">Test Instructions:</h3>
        <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
          <li>Ensure backend is running with chat module enabled</li>
          <li>Check browser console for detailed WebSocket logs</li>
          <li>Send a test message and verify it appears in backend logs</li>
          <li>Check if MESSAGE events are received when backend sends responses</li>
          <li>Verify the message structure matches backend format</li>
        </ol>
      </div>
    </div>
  )
}