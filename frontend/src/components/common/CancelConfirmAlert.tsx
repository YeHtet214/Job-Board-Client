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
import { X } from 'lucide-react'

interface CancelConfirmAlertProps {
    buttonContent?: string
    alertTitle: string
    alertDescription: string
    cancelItem: any
    onWithdraw: (cancelItem: any) => void
}

const CancelConfirmAlert: React.FC<CancelConfirmAlertProps> = ({
    buttonContent,
    alertTitle,
    alertDescription,
    cancelItem,
    onWithdraw,
}) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="">
                    {buttonContent ? buttonContent : <X className="h-4 w-4" />}
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
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => onWithdraw(cancelItem)}
                        className="bg-jb-danger hover:bg-jb-danger/80"
                    >
                        {buttonContent ? buttonContent : 'Withdraw'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default CancelConfirmAlert
