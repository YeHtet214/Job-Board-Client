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
import { MessageCircleMore } from 'lucide-react'

/**
 * Loading skeleton component
 */
const ConversationSkeleton = () => (
    <div className="w-full h-full p-4 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
            <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-xl border border-jb-text/10"
            >
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                </div>
                <Skeleton className="h-3 w-12 rounded" />
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
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-jb-surface rounded-full flex items-center justify-center mb-4">
                    <MessageCircleMore className="w-10 h-10 text-jb-text-muted" />
                </div>
                <h3 className="text-lg font-semibold text-jb-text mb-2">
                    Welcome to Messages
                </h3>
                <p className="text-jb-text-muted max-w-sm">
                    Please log in to start conversations and connect with
                    others.
                </p>
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
                            setJoinedConversations((prev) =>
                                new Set(prev).add(conv.id)
                            )

                            if (res.notis && res.notis.length > 0) {
                                console.log(
                                    '📬 Conversation notifications:',
                                    res.notis
                                )
                            }
                        } else {
                            console.error(
                                '❌ Failed to join conversation:',
                                res.error
                            )
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
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-jb-surface rounded-full flex items-center justify-center mb-4">
                    <MessageCircleMore className="w-10 h-10 text-jb-text-muted" />
                </div>
                <h3 className="text-lg font-semibold text-jb-text mb-2">
                    No conversations yet
                </h3>
                <p className="text-jb-text-muted max-w-sm">
                    Start a conversation by clicking on a job seeker or employer
                    profile.
                </p>
            </div>
        )
    }

    return (
        <div className="flex justify-between h-full bg-card rounded-xl shadow-lg overflow-hidden border border-jb-text/10">
            <div
                className={`overflow-y-auto scrollbar-thin scrollbar-thumb-jb-text/20 scrollbar-track-transparent transition-all duration-300 ${
                    openConversation
                        ? 'w-1/3 border-r border-jb-text/10'
                        : 'w-full'
                }`}
            >
                <div className="p-4 border-b border-jb-text/10 bg-jb-surface/30">
                    <h2 className="text-lg font-semibold text-jb-text">
                        Messages
                    </h2>
                    <p className="text-sm text-jb-text-muted">
                        Connect with job seekers and employers
                    </p>
                </div>
                <ul className="divide-y divide-jb-text/5">
                    {conversations.map((conv: Conversation) => (
                        <ConversationCard
                            key={conv.id}
                            conv={conv}
                            isCurrentOpen={openConversation?.id === conv.id}
                            selectConv={handleConversationClick}
                        />
                    ))}
                </ul>
            </div>

            {/* Conversation dialog */}
            <div
                className={`transition-all duration-300 ${openConversation ? 'w-2/3' : 'w-0'}`}
            >
                {openConversation && (
                    <ConversationDialog conv={openConversation} />
                )}
            </div>
        </div>
    )
}

export default ConversationList
