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
import { ReceivedApplication } from '@/types/dashboard'

interface ApplicationStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedApplication: ReceivedApplication | null
  onUpdateStatus: (status: ReceivedApplication['status']) => void
  isUpdating: boolean
}

const statusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'REVIEWING', label: 'Reviewing' },
  { value: 'INTERVIEW', label: 'Interview' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'ACCEPTED', label: 'Accepted' },
]

const ApplicationStatusDialog: React.FC<ApplicationStatusDialogProps> = ({
  open,
  onOpenChange,
  selectedApplication,
  onUpdateStatus,
  isUpdating,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Application Status</DialogTitle>
          <DialogDescription>
            Change the status for {selectedApplication?.applicantName}
            's application for {selectedApplication?.jobTitle}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-4 space-y-3">
              {statusOptions.map((option) => (
                <div key={option.value}>
                  <Button
                    variant={
                      selectedApplication?.status ===
                        option.value
                        ? 'default'
                        : 'outline'
                    }
                    className="w-full justify-start"
                    onClick={() =>
                      onUpdateStatus(
                        option.value as ReceivedApplication['status']
                      )
                    }
                    disabled={
                      selectedApplication?.status ===
                      option.value || isUpdating
                    }
                  >
                    {option.label}
                    {selectedApplication?.status ===
                      option.value && (
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
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ApplicationStatusDialog
