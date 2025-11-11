// components/messaging/ConversationCard.tsx

import { Conversation } from '@/types/messaging'
import { useAuth } from '@/contexts/authContext'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { getUserAvatarInitials } from '@/utils/avatarUtils'
import { memo } from 'react'
import { useMessaging } from '@/contexts/MessagingContext'

interface ConversationCardProps {
  conv: Conversation
  isCurrentOpen: boolean
  selectConv: (conv: Conversation) => void
}

/**
 * Individual conversation card component
 * Displays conversation preview with avatar and last message
 */
const ConversationCard = ({
  conv,
  isCurrentOpen,
  selectConv,
}: ConversationCardProps) => {
  const { currentUser } = useAuth()
  const  { getMergedConversation } = useMessaging()

  // Get avatar initials
  const avatarName = getUserAvatarInitials(
    currentUser?.firstName,
    currentUser?.lastName,
    conv.receipent?.name,
    conv.receipent?.id,
    currentUser?.id
  )

  // Get merged conversation with real-time messages
  const mergedConv = getMergedConversation(conv)

  return (
    <li
      className={`flex gap-3 p-4 ${isCurrentOpen ? 'bg-jb-primary/5 border-r-2 border-jb-primary' : 'hover:bg-jb-surface/50'
        } items-center cursor-pointer rounded-xl transition-all duration-200 border border-transparent hover:border-jb-text/10`}
      onClick={() => selectConv(conv)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          selectConv(mergedConv)
        }
      }}
    >
      <div className="relative">
        <Avatar className="w-12 h-12 border-2 border-jb-surface shadow-sm">
          <AvatarImage src={conv.receipent?.avatar} alt={mergedConv.receipent?.name} />
          <AvatarFallback className="bg-jb-primary text-white font-semibold">{avatarName}</AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <span className="font-semibold text-jb-text truncate text-base">
            {mergedConv.receipent?.name}
          </span>
          <span className="text-xs text-jb-text-muted flex-shrink-0 ml-2">
            {mergedConv.lastMessage?.createdAt
              ? new Date(mergedConv.lastMessage.createdAt).toLocaleDateString()
              : ''}
          </span>
        </div>
        <p className="text-sm text-jb-text-muted truncate leading-relaxed">
          {mergedConv.lastMessage?.body || 'No messages yet'}
        </p>
      </div>
    </li>
  )
}

// Memoize to prevent unnecessary re-renders
export default memo(ConversationCard)