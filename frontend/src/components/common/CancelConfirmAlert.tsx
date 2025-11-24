import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'

interface CancelConfirmAlertProps {
    buttonContent?: string
    alertTitle: string
    alertDescription: string
    isLoading?: boolean
    cancelItem: any
    onWithdraw: (cancelItem: any) => void
}

const CancelConfirmAlert: React.FC<CancelConfirmAlertProps> = ({
    buttonContent,
    alertTitle,
    alertDescription,
    isLoading = false,
    cancelItem,
    onWithdraw,
}) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isLoading} className='hover:opacity-90'>
                    {buttonContent ? buttonContent : <Trash className="h-4 w-4 text-jb-danger" />}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {alertDescription}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => onWithdraw(cancelItem)}
                        className="bg-jb-danger hover:bg-jb-danger/80"
                        disabled={isLoading}
                    >
                        {buttonContent ? buttonContent : 'Withdraw'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default CancelConfirmAlert
