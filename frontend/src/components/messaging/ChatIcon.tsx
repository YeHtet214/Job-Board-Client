import { useState } from 'react'
import ConversationList from '@/components/messaging/ConversationList'
import { MessageCircleMore, X } from 'lucide-react'
import { useAuth } from '@/contexts/authContext'
import { useMessaging } from '@/contexts/MessagingContext'

export default function ChatIcon() {
    const [isOpen, setIsOpen] = useState(false)
    const { socket } = useMessaging()
    const { currentUser } = useAuth()

    if (!currentUser) return null

    return (
        <div className="fixed bottom-5 right-5 w-full sm:w-[80vw] md:w-[70vw] lg:w-[50vw] h-[75vh] text-jb-text z-100">
            {isOpen ? (
                <div className="w-full h-full absolute bottom-0 bg-jb-surface text-jb-text bg-jb-b rounded-lg shadow-lg px-4 py-8">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-0 right-0 border-s-1  border-b-1 bg-red-200 text-jb-danger opacity-50 p-1 cursor-pointer transition focus:bg-red-300"
                    >
                        <X size={15} />
                    </button>
                    {socket && (
                        <ConversationList
                        // onConversationClick={(conversation: Conversation) => {
                        //   socket.emit(
                        //     'chat:join',
                        //     { conversationId: conversation.id },
                        //     (res: any) => {
                        //       if (res.ok) {
                        //         console.log('Joined conversation:', res.conversationId);
                        //       } else {
                        //         console.error('Failed to join conversation:', res.error);
                        //       }
                        //     }
                        //   );
                        // }}
                        />
                    )}
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-jb-surface p-2 rounded-full shadow-lg cursor-pointer hover:bg-jb-bg absolute bottom-0 right-0"
                >
                    <MessageCircleMore
                        size={60}
                        className="text-jb-primary bg-jb-surface border-1 p-2 rounded-full shadow-lg"
                    />
                </button>
            )}
        </div>
    )
}
