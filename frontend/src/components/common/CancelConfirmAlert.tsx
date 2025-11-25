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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

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
                <Button variant="ghost" disabled={isLoading} className='text-jb-danger hover:text-jb-danger/80'>
                    {buttonContent ? buttonContent : <DeleteToolTip isLoading={isLoading} />}
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

const DeleteToolTip = ({ isLoading }: { isLoading: boolean }) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" disabled={isLoading} className='hover:opacity-80'><Trash className="w-4 h-4 text-jb-danger" /></Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Withdraw</p>
            </TooltipContent>
        </Tooltip>
    )
}

export default CancelConfirmAlert
