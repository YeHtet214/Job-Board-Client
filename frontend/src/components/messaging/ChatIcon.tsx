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
        <div className="fixed bottom-6 right-6 z-50">
            <Dialog>
                <DialogTrigger asChild>
                    <button
                        className="group relative bg-jb-primary hover:bg-jb-primary/90 text-white p-4 rounded-full shadow-xl cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-2xl border-2 border-card"
                        aria-label="Open messages"
                    >
                        <MessageCircleMore size={24} className="transition-transform group-hover:scale-110" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-card animate-pulse"></div>
                    </button>
                </DialogTrigger>
                <DialogContent className='h-[85vh] p-0 bg-transparent border-none shadow-2xl'>
                    <div className="h-full bg-card rounded-2xl overflow-hidden">
                        {socket && <ConversationList />}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
