import { useState } from 'react'
import ConversationList from '@/components/messaging/ConversationList'
import { MessageCircleMore} from 'lucide-react'
import { useAuth } from '@/contexts/authContext'
import { useMessaging } from '@/contexts/MessagingContext'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'

export default function ChatIcon() {
    const { socket } = useMessaging()
    const { currentUser } = useAuth()

    if (!currentUser) return null

    return (
        <div className="fixed bottom-10 right-10 z-100">
            <Dialog>
                <DialogTrigger asChild>
                    <button
                        className="bg-jb-surface p-2 rounded-full shadow-lg cursor-pointer hover:bg-jb-bg absolute bottom-0 right-0"
                    >
                        <MessageCircleMore
                            size={60}
                            className="text-jb-primary bg-jb-surface border-1 p-2 rounded-full shadow-lg"
                        />
                    </button>
                </DialogTrigger>
                <DialogContent className='h-[80vh] flex'>
                    {socket && <ConversationList />}
                </DialogContent>
            </Dialog>
        </div>
    )
}
