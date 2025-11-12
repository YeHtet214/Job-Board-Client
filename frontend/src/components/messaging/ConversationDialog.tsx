// components/messaging/ConversationDialog.tsx

import { useAuth } from '@/contexts/authContext'
import { useMessaging } from '@/contexts/MessagingContext'
import { Conversation, Message } from '@/types/messaging'
import { getUserAvatarInitials } from '@/utils/avatarUtils'
import { SendHorizontal, MessageCircleMore } from 'lucide-react'
import { FormEvent, useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

type ReceipentMessageProps = {
  conv: Conversation
  avatarName: string
  message: Message
}
const RecipientMessage = ({
  conv,
  avatarName,
  message,
}: ReceipentMessageProps) => {
  return (
    <div className="flex items-start gap-3 my-3">
      <Avatar className="w-6 h-6 border-2 border-jb-surface shadow-sm">
        <AvatarImage src={conv.receipent?.avatar} alt={conv.receipent?.name} />
        <AvatarFallback className="bg-jb-primary text-white">{avatarName}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col max-w-[70%]">
        <div className="bg-jb-surface text-jb-text rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-jb-text/10">
          <p className="text-sm leading-relaxed break-words">{message.body}</p>
        </div>
      </div>
    </div>
  )
}

/**
 * Sender message component (current user's messages)
 */
const SenderMessage = ({ message, isLast }: { message: Message, isLast: boolean }) => {
  return (
    <div className="w-full flex justify-end my-3">
      <div className="flex flex-col items-end max-w-[70%]">
        <div className="bg-jb-primary text-white rounded-2xl rounded-tr-md px-4 py-3 shadow-sm">
          <p className="text-sm leading-relaxed break-words">{message.body}</p>
        </div>

        {/* Message status indicator */}
        <div className="flex items-center gap-1 mt-1">
          {message.status === 'sending' && (
            <span className="text-xs text-jb-text-muted flex items-center gap-1">
              <div className="w-1 h-1 bg-jb-text-muted rounded-full animate-pulse"></div>
              Sending...
            </span>
          )}
          {message.status === 'failed' && (
            <span className="text-xs text-red-500 flex items-center gap-1">
              <div className="w-1 h-1 bg-red-500 rounded-full"></div>
              Failed to send
            </span>
          )}
          {message.status === 'sent' && isLast && (
            <span className="text-xs text-jb-text-muted">Delivered</span>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Main conversation dialog component
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

  const avatarName = getUserAvatarInitials(
    currentUser?.firstName,
    currentUser?.lastName,
    conv.receipent?.name,
    conv.receipent?.id,
    currentUser?.id
  )

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
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-jb-text/10 bg-jb-surface/30">
        <Avatar className="w-10 h-10 border-2 border-jb-surface shadow-sm">
          <AvatarImage src={conv.receipent?.avatar} alt={mergedConv.receipent?.name} />
          <AvatarFallback className="bg-jb-primary text-white font-semibold">{avatarName}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-jb-text">{mergedConv.receipent?.name}</h3>
          <p className="text-xs text-jb-text-muted">Active now</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-jb-text/20 scrollbar-track-transparent px-4 py-4 space-y-1 scrollbar-hidden">
        {mergedConv.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-jb-surface rounded-full flex items-center justify-center mb-3">
              <MessageCircleMore className="w-8 h-8 text-jb-text-muted" />
            </div>
            <p className="text-jb-text-muted font-medium">No messages yet</p>
            <p className="text-sm text-jb-text-muted/70 mt-1">Start the conversation!</p>
          </div>
        ) : (
          mergedConv.messages.map((message: Message) => (
            <div key={message.tempId || message.id}>
              {message.senderId === conv.receipent?.id ? (
                <RecipientMessage conv={conv} avatarName={avatarName} message={message} />
              ) : (
                <SenderMessage message={message} isLast={message.id === mergedConv.lastMessage?.id} />
              )}
            </div>
          ))
        )}
      </div>

      {/* Input form */}
      <div className="border-t border-jb-text/10 bg-jb-surface/30 backdrop-blur-sm px-4 py-4">
        <form
          className="w-full relative bg-background border border-jb-text/20 rounded-2xl shadow-sm px-4 h-12 flex items-center focus-within:border-jb-primary/50 focus-within:ring-2 focus-within:ring-jb-primary/20 transition-all"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            className="flex-1 py-2 bg-transparent outline-none text-jb-text placeholder-jb-text-muted/60 text-sm"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!socket}
          />
          <button
            type="submit"
            className="ml-3 bg-jb-primary text-white p-2 rounded-xl hover:bg-jb-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            disabled={!socket || !input.trim()}
            aria-label="Send message"
          >
            <SendHorizontal size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default ConversationDialog
