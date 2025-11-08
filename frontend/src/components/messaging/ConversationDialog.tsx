// components/messaging/ConversationDialog.tsx

import { useAuth } from '@/contexts/authContext'
import { useMessaging } from '@/contexts/MessagingContext'
import { Conversation, Message } from '@/types/messaging'
import { SendHorizontal } from 'lucide-react'
import { FormEvent, useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

/**
 * Recipient message component
 */
const RecipientMessage = ({
  conv,
  message,
}: {
  conv: Conversation
  message: Message
}) => {
  return (
    <div className="flex items-start my-2">
      <img
        src={conv.receipent?.avatar}
        alt={conv.receipent?.name}
        className="w-10 h-10 object-cover rounded-full"
      />
      <div className="ml-2">
        <p className="text-jb-text bg-jb-surface rounded-lg px-3 py-2">
          {message.body}
        </p>
      </div>
    </div>
  )
}

/**
 * Sender message component (current user's messages)
 */
const SenderMessage = ({ message }: { message: Message }) => {
  return (
    <div className="w-full flex justify-end my-2">
      <div className="flex flex-col items-end">
        <p className="text-jb-text bg-jb-primary/10 rounded-lg px-3 py-2 max-w-md break-words">
          {message.body}
        </p>

        {/* Message status indicator */}
        {message.status === 'sending' && (
          <span className="text-xs text-jb-text-muted mt-1">Sending...</span>
        )}
        {message.status === 'failed' && (
          <span className="text-xs text-red-500 mt-1">Failed to send</span>
        )}
        {message.status === 'sent' && (
          <span className="text-xs text-green-600 mt-1">Sent</span>
        )}
      </div>
    </div>
  )
}

/**
 * Conversation dialog component
 * Displays messages and handles message input
 */
const ConversationDialog = ({ conv }: { conv: Conversation }) => {
  const [input, setInput] = useState<string>('')
  const { currentUser } = useAuth()
  const {
    socket,
    sendMessage,
    getMergedConversation,
    addOptimisticMessage,
    updateMessageStatus,
  } = useMessaging()

  // Get merged conversation with real-time messages
  const mergedConv = getMergedConversation(conv)

  console.log("merged conv : ", mergedConv);

  const handleSubmit = useCallback(
    async (e?: FormEvent) => {
      if (e) {
        e.preventDefault()
      }

      // Validation
      if (!socket || !input.trim() || !currentUser) {
        return
      }

      const messageBody = input.trim()
      const tempId = uuidv4()

      // Create optimistic message
      const optimisticMessage: Message = {
        id: tempId,
        tempId,
        conversationId: conv.id,
        senderId: currentUser.id,
        body: messageBody,
        status: 'sending',
        createdAt: new Date(),
      }

      // Add optimistic message immediately for instant UI feedback
      addOptimisticMessage(conv.id, optimisticMessage)

      // Clear input
      setInput('')

      // Send message to server
      try {
        await sendMessage({
          tempId,
          receiverId: conv.receipent?.id || '',
          conversationId: conv.id,
          body: messageBody,
        })
      } catch (error) {
        console.error('Error sending message:', error)
        updateMessageStatus(conv.id, tempId, 'failed')
      }
    },
    [
      socket,
      input,
      currentUser,
      conv.id,
      conv.receipent?.id,
      addOptimisticMessage,
      sendMessage,
      updateMessageStatus,
    ]
  )

  return (
    <div className="h-full flex flex-col p-2">
      {/* Header */}
      <div className="border-b py-2 border-jb-text/20 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img
            src={conv.receipent?.avatar}
            alt={conv.receipent?.name}
            className="w-10 h-10 object-cover rounded-full border border-jb-text-muted"
          />
          <p className="font-medium text-jb-text">{conv.receipent?.name}</p>
        </div>
        <small className="text-jb-text-muted">
          {conv.updatedAt
            ? new Date(conv.updatedAt).toLocaleString()
            : ''}
        </small>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hidden min-h-[20vh] py-2">
        {mergedConv.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-jb-text-muted">No messages yet</p>
          </div>
        ) : (
          mergedConv.messages.map((message: Message) => (
            <div key={message.tempId || message.id}>
              {message.senderId === conv.receipent?.id ? (
                <RecipientMessage conv={conv} message={message} />
              ) : (
                <SenderMessage message={message} />
              )}
            </div>
          ))
        )}
      </div>

      {/* Input form */}
      <form
        className="w-full relative bg-jb-surface shadow-2xl border rounded-3xl px-4 h-12 flex items-center"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="flex-1 py-2 bg-transparent outline-none text-jb-text"
          placeholder="Message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!socket}
        />
        <button
          type="submit"
          className="ml-2 text-jb-primary hover:text-jb-primary/75 disabled:opacity-50 disabled:cursor-not-allowed transition"
          disabled={!socket || !input.trim()}
          aria-label="Send message"
        >
          <SendHorizontal size={20} />
        </button>
      </form>
    </div>
  )
}

export default ConversationDialog