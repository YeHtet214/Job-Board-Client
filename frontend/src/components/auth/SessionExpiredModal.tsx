import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { useAuth } from '@/contexts/authContext'

const SessionExpiredModal: React.FC = () => {
    const { showSessionExpiredDialog, dismissSessionExpiredDialog } = useAuth()
    const navigate = useNavigate()

    const handleLoginClick = () => {
        dismissSessionExpiredDialog()
        navigate('/login')
    }

    const handleDismiss = () => {
        dismissSessionExpiredDialog()
    }

    return (
        <Dialog open={showSessionExpiredDialog} onOpenChange={handleDismiss}>
            <DialogContent className="sm:max-w-md px-4 sm:px-6">
                <DialogHeader className="flex flex-col items-center gap-1">
                    <AlertTriangle className="h-12 w-12 text-amber-500 mb-2" />
                    <DialogTitle className="text-xl">
                        Session Expired
                    </DialogTitle>
                    <DialogDescription className="text-center text-sm sm:text-base">
                        Your session has expired. Please log in again to
                        continue.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2 mt-4">
                    <Button
                        variant="outline"
                        onClick={handleDismiss}
                        className="w-full sm:w-auto"
                    >
                        Dismiss
                    </Button>
                    <Button
                        onClick={handleLoginClick}
                        className="w-full sm:w-auto"
                    >
                        Log In
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default SessionExpiredModal
