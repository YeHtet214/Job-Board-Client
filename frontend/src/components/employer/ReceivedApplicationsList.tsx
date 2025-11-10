import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDate, getEmployerStatusBadge } from '@/utils/dashboard.utils'
import { ReceivedApplication } from '@/types/dashboard'

interface ReceivedApplicationsListProps {
    applications: ReceivedApplication[]
    onUpdateApplicationStatus?: (
        application: ReceivedApplication,
        status: ReceivedApplication['status']
    ) => void
    emptyStateMessage?: string
}

const ReceivedApplicationsList: React.FC<ReceivedApplicationsListProps> = ({
    applications,
    onUpdateApplicationStatus,
    emptyStateMessage = "You haven't received any applications yet.",
}) => {
    const navigate = useNavigate()

    const statusOptions: {
        label: string
        value: ReceivedApplication['status']
    }[] = [
        { label: 'Mark as Reviewing', value: 'REVIEWING' },
        { label: 'Schedule Interview', value: 'INTERVIEW' },
        { label: 'Reject Application', value: 'REJECTED' },
        { label: 'Accept Candidate', value: 'ACCEPTED' },
    ]

    return (
        <div>
            {applications.length > 0 ? (
                <div className="space-y-4">
                    {applications.map((application) => (
                        <div
                            key={application.id}
                            className="p-4 border rounded-lg hover:bg-jb-text-muted/10 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <h4 className="font-medium text-sm text-jb-text truncate">
                                            {application.applicantName}
                                        </h4>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    navigate(
                                                        `/employer/applications/${application.id}`
                                                    )
                                                }
                                            >
                                                View
                                            </Button>

                                            {onUpdateApplicationStatus && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger>
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                        >
                                                            Update Status
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="bg-jb-surface text-jb-textbg-jb-surface shadow p-2"
                                                    >
                                                        {statusOptions.map(
                                                            (option) => (
                                                                <DropdownMenuItem
                                                                    key={
                                                                        option.value
                                                                    }
                                                                    disabled={
                                                                        application.status ===
                                                                        option.value
                                                                    }
                                                                    className="hover:text-jb-primary/90"
                                                                    onClick={() =>
                                                                        onUpdateApplicationStatus(
                                                                            application,
                                                                            option.value
                                                                        )
                                                                    }
                                                                >
                                                                    {
                                                                        option.label
                                                                    }
                                                                </DropdownMenuItem>
                                                            )
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-xs text-jb-text-muted mt-1">
                                        Applied for: {application.jobTitle}
                                    </p>

                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-xs text-jb-text-muted">
                                            Received{' '}
                                            {formatDate(application.applied)}
                                        </span>
                                        {getEmployerStatusBadge(
                                            application.status
                                        )}
                                    </div>
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
                    <Button
                        onClick={() => navigate('/employer/jobs/create')}
                        className="bg-jb-primary hover:bg-jb-primary/90 text-white"
                    >
                        Post a Job
                    </Button>
                </div>
            )}
        </div>
    )
}

export default ReceivedApplicationsList
