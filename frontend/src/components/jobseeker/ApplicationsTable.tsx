import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { formatDate, getJobSeekerStatusBadge } from '@/utils/dashboard.utils'
import { JobApplication } from '@/types/dashboard'
import CancelConfirmAlert from '../common/CancelConfirmAlert'

interface ApplicationsTableProps {
    applications: JobApplication[]
    onWithdrawApplication?: (application: JobApplication) => void
    isWithdrawingApplication: boolean
    emptyStateMessage?: string
}

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
    applications,
    onWithdrawApplication,
    isWithdrawingApplication,
    emptyStateMessage = "You haven't applied to any jobs yet.",
}) => {
    const navigate = useNavigate()

    return (
        <div>
            {applications.length > 0 ? (
                <div className="space-y-4">
                    {applications.map((application) => (
                        <div
                            key={application.id}
                            className="p-4 border rounded-lg hover:bg-jb-text-muted/10 transition-colors"
                        >
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between min-w-0">
                                    <div>
                                        <h4 className="font-medium text-sm truncate">
                                            {application.jobTitle}
                                        </h4>
                                        <p className="text-xs text-jb-text-muted mt-1">
                                            {application.companyName}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => navigate(`/jobs/${application.jobId}`)}
                                        >
                                            View
                                        </Button>

                                        {onWithdrawApplication && (
                                            <CancelConfirmAlert
                                                alertTitle="Withdraw Application"
                                                alertDescription={`Are you sure you want to withdraw your application for ${application.jobTitle} at ${application.companyName}? This action cannot be undone.`}
                                                cancelItem={application}
                                                onWithdraw={onWithdrawApplication}
                                                isLoading={isWithdrawingApplication}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-xs text-jb-text-muted">
                                        Applied{' '}
                                        {formatDate(application.applied)}
                                    </span>
                                    {getJobSeekerStatusBadge(
                                        application.status
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

export default ApplicationsTable
