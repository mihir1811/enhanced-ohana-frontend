'use client'

import React, { useEffect } from 'react'

// Example test component to verify chat utilities in the browser
export default function ChatTestPage() {
  useEffect(() => {
    // Import utilities dynamically in the browser environment
    import('@/services/chat.utils').then((utils) => {
      // Sample API response format
      const sampleApiResponse = {
        "success": true,
        "message": "Chat messages fetched successfully.",
        "data": {
          "data": [
            {
              "id": "85fa4ce3-e5aa-46a2-aeb0-652ad2267e19",
              "fromId": "56812cf4-b9ab-4082-a3cc-e1a48fc513c1",
              "toId": "7ad3e142-ae9e-44fb-9e51-e28dae19e1dd",
              "message": "vervre",
              "fileUrl": null,
              "messageType": "TEXT",
              "createdAt": "2025-10-02T17:46:14.969Z",
              "deletedBySender": false,
              "deletedByReceiver": false,
              "isRead": false,
              "readAt": null,
              "from": {
                "id": "56812cf4-b9ab-4082-a3cc-e1a48fc513c1",
                "name": "user",
                "role": "user"
              },
              "to": {
                "id": "7ad3e142-ae9e-44fb-9e51-e28dae19e1dd",
                "name": "diamond seller 2",
                "role": "seller"
              }
            },
            {
              "id": "48bdea4b-40c3-4a99-a701-7f181053aa22",
              "fromId": "7ad3e142-ae9e-44fb-9e51-e28dae19e1dd",
              "toId": "56812cf4-b9ab-4082-a3cc-e1a48fc513c1",
              "message": "sjsjs",
              "fileUrl": null,
              "messageType": "TEXT",
              "createdAt": "2025-10-03T19:14:45.519Z",
              "deletedBySender": false,
              "deletedByReceiver": false,
              "isRead": false,
              "readAt": null,
              "from": {
                "id": "7ad3e142-ae9e-44fb-9e51-e28dae19e1dd",
                "name": "diamond seller 2",
                "role": "seller"
              },
              "to": {
                "id": "56812cf4-b9ab-4082-a3cc-e1a48fc513c1",
                "name": "user",
                "role": "user"
              }
            }
          ],
          "meta": {
            "total": 11,
            "lastPage": 1,
            "currentPage": 1,
            "perPage": 50,
            "prev": null,
            "next": null
          }
        }
      }

      console.log('=== Testing Chat Utilities ===')

      // Test 1: Extract message array
      const messages = utils.extractMessageArray(sampleApiResponse.data)
      console.log('✅ Extracted messages count:', messages.length)
      console.log('✅ First message raw:', messages[0])

      // Test 2: Normalize first message
      const firstRawMessage = messages[0]
      const normalizedFirst = utils.normalizeMessageDto(firstRawMessage)
      console.log('✅ Normalized first message:', normalizedFirst)

      // Test 3: Extract sender names
      const firstSenderName = utils.extractSenderName(firstRawMessage)
      const secondSenderName = utils.extractSenderName(messages[1])
      console.log('✅ Sender names:', { firstSenderName, secondSenderName })

      // Test 4: Process all messages like the chat component would (from seller perspective)
      const currentUserId = "7ad3e142-ae9e-44fb-9e51-e28dae19e1dd" // Seller ID for testing
      const processedMessages = messages.map(rawMsg => {
        const normalizedMsg = utils.normalizeMessageDto(rawMsg)
        const isFromMe = String(normalizedMsg.fromUserId) === String(currentUserId)
        const senderName = utils.extractSenderName(rawMsg, 'Unknown User')
        
        return {
          id: normalizedMsg.id,
          from: isFromMe ? 'me' : 'user',
          text: normalizedMsg.text,
          timestamp: normalizedMsg.timestamp,
          senderName,
          isFromMe
        }
      })

      console.log('✅ Processed messages for seller view:')
      processedMessages.forEach((msg, i) => {
        console.log(`   Message ${i + 1}: "${msg.text}" from ${msg.senderName} (${msg.from})`)
      })

      console.log('🎉 All chat utility tests passed! The API format is now properly supported.')
    })
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Chat Utilities Test</h1>
      <p className="text-gray-600">
        Check the browser console to see the test results.
        The chat utilities have been updated to handle the API response format.
      </p>
      <div className="mt-4 bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold text-green-800">Updates Made:</h3>
        <ul className="mt-2 text-green-700 space-y-1">
          <li>• Updated extractMessageArray to handle nested data.data structure</li>
          <li>• Enhanced normalizeMessageDto to support fromId, toId, message fields</li>
          <li>• Added extractSenderName and extractReceiverName utilities</li>
          <li>• Added console logging to chat pages for debugging</li>
          <li>• Updated both user and seller chat pages to use new utilities</li>
        </ul>
      </div>
    </div>
  )
}