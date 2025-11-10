// components/messaging/ConversationList.tsx

import { Conversation } from '@/types/messaging'
import { useState, useCallback } from 'react'
import ConversationDialog from './ConversationDialog'
import ConversationCard from './ConversationCard'
import { useConversationQuery } from '@/hooks/react-queries/messaging/useConversationQuery'
import { Skeleton } from '../ui/skeleton'
import { useMessaging } from '@/contexts/MessagingContext'
import { SOCKET_EVENTS } from '@/lib/constants/socketEvents'
import { JoinConversationResponse } from '@/types/socket'
import { useAuth } from '@/contexts/authContext'

/**
 * Loading skeleton component
 */
const ConversationSkeleton = () => (
  <div className="w-full h-full p-2">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center space-x-4 my-2">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    ))}
  </div>
)

/**
 * Displays all conversations and handles conversation selection
 */
const ConversationList = () => {
  const { data: conversations, isLoading } =
    useConversationQuery<Conversation[]>()
  const { socket, openConversation, setOpenConversation } = useMessaging()
  const [joinedConversations, setJoinedConversations] = useState<Set<string>>(
    new Set()
  )
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-jb-text-muted">Please log in to view conversations</p>
      </div>
    )
  }

  const handleConversationClick = useCallback(
    (conv: Conversation) => {
      if (conv.id === openConversation?.id) {
        setOpenConversation(null)
        return
      }

      if (socket && !joinedConversations.has(conv.id)) {
        socket.emit(
          SOCKET_EVENTS.JOIN,
          { conversationId: conv.id },
          (res: JoinConversationResponse) => {
            if (res.ok) {
              console.log('✅ Joined conversation:', conv.id)
              setJoinedConversations((prev) => new Set(prev).add(conv.id))

              if (res.notis && res.notis.length > 0) {
                console.log('📬 Conversation notifications:', res.notis)
              }
            } else {
              console.error('❌ Failed to join conversation:', res.error)
            }
          }
        )
      }

      setOpenConversation(conv)
    },
    [socket, openConversation, joinedConversations, setOpenConversation]
  )

  if (isLoading) {
    return <ConversationSkeleton />
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-jb-text-muted">No conversations found</p>
      </div>
    )
  }

  return (
    <div className="flex justify-between w-full h-full rounded-lg shadow-md overflow-hidden">
      <ul
        className={`overflow-y-scroll scrollbar-hidden transition-all ${
          openConversation ? 'w-1/3 border-r border-jb-text/20' : 'w-full'
        }`}
      >
        {conversations.map((conv: Conversation) => (
          <ConversationCard
            key={conv.id}
            conv={conv}
            isCurrentOpen={openConversation?.id === conv.id}
            selectConv={handleConversationClick}
          />
        ))}
      </ul>

      {/* Conversation dialog */}
      <div
        className={`transition-all ${openConversation ? 'w-2/3' : 'w-0'}`}
      >
        {openConversation && <ConversationDialog conv={openConversation} />}
      </div>
    </div>
  )
}

export default ConversationList