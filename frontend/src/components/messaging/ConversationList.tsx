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
            className={`flex gap-2 ${isCurrentOpen && 'bg-jb-bg'} items-center hover:bg-jb-bg transition cursor-pointer`}
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
    const { data: conversations, isLoading } = useConversationQuery<Conversation[]>()
    const { socket, openConversation, setOpenConversation } = useMessaging();

    const handleConversationClick = (conv: any) => {
        if (conv.id === openConversation?.id) {
            setOpenConversation(null)
            return;
        }

        // Join Conversation { *** Need to refactor, every time converation open, join event trigger!}
        socket?.emit("join", { conversationId: conv.id }, (res: any) => {
            if (res.ok) {
                console.log("Notis test: ", res.notis);
            } else {
                console.error("Failed to join conversation:", res.error);
            }
        });

        if (conv && conv.id !== openConversation?.id) {
            setOpenConversation(conv)
        }
    }

    if (isLoading) return <ConversationSkeleton />;

    return (
        <div className={`flex jusitfy-between w-full h-full rounded-lg shadow-md overflow-hidden`}>
            <ul className={`overflow-y-scroll scrollbar-hidden transition ${openConversation ? 'flex-1/3 border-r' : 'w-full'}`} >
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

            <div className={` transition ${openConversation && 'flex-2/3'}`} >
                {openConversation && (
                    <ConversationDialog conv={openConversation} />
                )}
            </div>
        </div>
    )
}

export default ConversationList
