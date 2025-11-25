import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ApplicationStatus } from '@/types/application'
import { statusOptions } from '@/utils/dashboard.utils'

interface StatusUpdateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  applicantName: string
  currentStatus: ApplicationStatus
  isUpdating: boolean
  onUpdateStatus: (status: ApplicationStatus) => void
}

const StatusUpdateDialog: React.FC<StatusUpdateDialogProps> = ({
  open,
  onOpenChange,
  applicantName,
  currentStatus,
  isUpdating,
  onUpdateStatus,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Application Status</DialogTitle>
          <DialogDescription>
            Change the status for {applicantName}'s application
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center gap-4">
            <div className="space-y-3">
              {statusOptions.map((option) => (
                <div key={option.value}>
                  <Button
                    variant={
                      currentStatus === option.value
                        ? 'default'
                        : 'outline'
                    }
                    className="w-full justify-start"
                    onClick={() =>
                      onUpdateStatus(option.value)
                    }
                    disabled={
                      currentStatus === option.value ||
                      isUpdating
                    }
                  >
                    {option.label}
                    {currentStatus === option.value && (
                      <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
                        Current
                      </Badge>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default StatusUpdateDialog
