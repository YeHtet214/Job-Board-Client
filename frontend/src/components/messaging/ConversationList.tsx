import { Conversation } from '@/types/messaging'
import { useAuth } from '@/contexts/authContext'
import { useEffect, useState } from 'react'
import ConversationDialog from './ConversationDialog'
import { useConversationQuery } from '@/hooks/react-queries/messaging/useConversation'
import { Skeleton } from '../ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useMessaging } from '@/contexts/MessagingContext'
interface ConversationCardType {
    conv: Conversation
    isCurrentOpen: boolean
    selectConv: (conv: Conversation) => void
}

const ConversationCard = ({
    conv,
    isCurrentOpen,
    selectConv,
}: ConversationCardType) => {
    const { currentUser } = useAuth()
    const [avatarName, setAvatarName] = useState<string>('')

    useEffect(() => {
        const makeAvatarFromName = () => {
            if (conv.receipent?.id === currentUser?.id) {
                return currentUser?.firstName[0] + currentUser?.lastName[0]
            } else {
                return conv.receipent?.name.split(" ")[0].charAt(0) + conv.receipent?.name.split(" ")[1].charAt(0)
            }
        }

        setAvatarName(makeAvatarFromName())
    }, [conv, currentUser])

    return (
        <li
            key={conv.id}
            className={`flex ${isCurrentOpen && 'bg-jb-bg'} items-center px-4 py-3 hover:bg-jb-bg transition cursor-pointer absolute`}
            onClick={() => selectConv(conv)}
        >
            <Avatar>
                <AvatarImage src={conv.receipent?.avatar} />
                <AvatarFallback>
                    {avatarName}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <span className="font-medium text-jb-text opacity-90 truncate">
                        {conv.receipent?.name}
                    </span>
                </div>
                <p className="text-sm text-jb-text-muted truncate">
                    {conv.lastMessage?.body}
                </p>
            </div>
        </li>
    )
}

const ConversationSkeleton = () => (
    <div className='w-full h-full'>
        <div className="flex items-center space-x-4 my-2">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
        <div className="flex items-center space-x-4 my-2">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
        <div className="flex items-center space-x-4 my-2">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    </div>
)

const ConversationList = () => {
    const [toggleConversation, setToggleConversation] = useState(false)
    const { data: conversations, isLoading } = useConversationQuery<Conversation[]>()
    const { socket, openConversation, setOpenConversation } = useMessaging();

    const handleConversationClick = (conv: any) => {

        socket?.emit("join", { conversationId: conv.id }, (res: any) => {
            if (res.ok) {
                console.log("Notis test: ", res.notis);
            } else {
                console.error("Failed to join conversation:", res.error);
            }
        });

        // Handle conversation click
        setToggleConversation(prev => !prev);

        if (conv && conv.id !== openConversation?.id) {
            setOpenConversation(conv)
        }
    }

    if (isLoading) return <ConversationSkeleton />;

    return (
        <div className={`h-full grid ${openConversation ? 'md:grid-cols-3' : 'md:grid-cols-1'} rounded-lg shadow-md overflow-hidden`}>
            <ul className={`transition ${toggleConversation ? 'w-auto border-r-1' : 'w-full'}`} >
                {conversations ? (
                    conversations.map((conv: Conversation) => (
                        <ConversationCard
                            key={conv.id}
                            conv={conv}
                            isCurrentOpen={openConversation?.id === conv.id}
                            selectConv={handleConversationClick}
                        />
                    ))
                ) : (
                    <>No conversations found!</>
                )}
            </ul>

            {openConversation && (
                <div className={`col-span-2 relative transition overflow-y-auto ${toggleConversation ? 'translate-x-0' : 'translate-x-[200%]'}`} >
                    <ConversationDialog conv={openConversation} />
                </div>
            )}
        </div>
    )
}

export default ConversationList
