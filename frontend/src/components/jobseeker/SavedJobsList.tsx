import React from 'react'
import { useNavigate } from 'react-router-dom'
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
import { formatDate } from '@/utils/dashboard.utils'
import { SavedJobWithDetails } from '@/types/saved-job'

interface SavedJobsListProps {
    savedJobs: SavedJobWithDetails[]
    onRemoveSavedJob?: (job: SavedJobWithDetails) => void
    isRemovingSavedJob: boolean
    emptyStateMessage?: string
}

const SavedJobsList: React.FC<SavedJobsListProps> = ({
    savedJobs,
    onRemoveSavedJob,
    isRemovingSavedJob,
    emptyStateMessage = "You haven't saved any jobs yet.",
}) => {
    const navigate = useNavigate()

    return (
        <div>
            {savedJobs.length > 0 ? (
                <div className="space-y-4">
                    {savedJobs.map((savedJob) => (
                        <div
                            key={savedJob.id}
                            className="p-4 border rounded-lg hover:bg-jb-text-muted/10 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm truncate">
                                        {savedJob.job.title}
                                    </h4>
                                    <p className="text-xs text-jb-text-muted mt-1">
                                        {savedJob.job.company?.name}
                                    </p>
                                    <div className="flex items-center mt-2">
                                        <span className="text-xs text-jb-text-muted">
                                            Saved{' '}
                                            {formatDate(savedJob.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={isRemovingSavedJob}
                                        onClick={() =>
                                            navigate(`/jobs/${savedJob.job.id}`)
                                        }
                                    >
                                        View
                                    </Button>

                                    {onRemoveSavedJob && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-jb-danger hover:text-jb-danger/80"
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Remove Saved Job
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to
                                                        remove{' '}
                                                        {savedJob.job.title} at{' '}
                                                        {
                                                            savedJob.job.company
                                                                ?.name
                                                        }{' '}
                                                        from your saved jobs?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => onRemoveSavedJob(savedJob)}
                                                        className="bg-red-500 hover:bg-red-600"
                                                        disabled={isRemovingSavedJob}
                                                    >
                                                        Remove
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-jb-text-muted mb-4">
                        {emptyStateMessage}
                    </p>
                    <Button onClick={() => navigate('/jobs')}>
                        Browse Jobs
                    </Button>
                </div>
            )}
        </div>
    )
}

export default SavedJobsList
