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
      className={`flex gap-2 p-3 ${isCurrentOpen ? 'bg-jb-bg' : ''
        } items-center hover:bg-jb-bg transition cursor-pointer rounded-lg`}
      onClick={() => selectConv(conv)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          selectConv(mergedConv)
        }
      }}
    >
      <Avatar>
        <AvatarImage src={conv.receipent?.avatar} alt={mergedConv.receipent?.name} />
        <AvatarFallback>{avatarName}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <span className="font-medium text-jb-text opacity-90 truncate">
            {mergedConv.receipent?.name}
          </span>
        </div>
        <p className="text-sm text-jb-text-muted truncate">
          {mergedConv.lastMessage?.body || 'No messages yet'}
        </p>
      </div>
    </li>
  )
}

// Memoize to prevent unnecessary re-renders
export default memo(ConversationCard)