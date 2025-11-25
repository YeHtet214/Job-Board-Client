import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface ApplicationHeaderProps {
  jobTitle: string
  isUpdating: boolean
  onOpenStatusDialog: () => void
}

const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({
  jobTitle,
  isUpdating,
  onOpenStatusDialog,
}) => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/employer/applications')}
          className="mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applications
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold text-jb-text">
          Application Details
        </h1>
        <p className="text-gray-500 mt-1">
          Reviewing application for {jobTitle}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Button
          onClick={onOpenStatusDialog}
          disabled={isUpdating}
          className="bg-jb-primary hover:bg-jb-primary/90"
        >
          {isUpdating && (
            <LoadingSpinner size="sm" className="mr-2" />
          )}
          Update Status
        </Button>
      </div>
    </div>
  )
}

export default ApplicationHeader
