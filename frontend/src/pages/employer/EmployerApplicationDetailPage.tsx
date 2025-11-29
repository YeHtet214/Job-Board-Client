import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, FileText, User, Building } from 'lucide-react'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useToast } from '@/components/ui/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import {
    useApplicationById,
    useUpdateApplication,
} from '@/hooks/react-queries/application/useApplicationQueries'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { ApplicationStatus } from '@/types/application'
import { statusTextMap } from '@/utils/dashboard.utils'

import ApplicationHeader from '@/components/employer/application-detail/ApplicationHeader'
import ApplicationStatusCards from '@/components/employer/application-detail/ApplicationStatusCards'
import ApplicationTabContent from '@/components/employer/application-detail/ApplicationTabContent'
import ApplicantTabContent from '@/components/employer/application-detail/ApplicantTabContent'
import JobTabContent from '@/components/employer/application-detail/JobTabContent'
import StatusUpdateDialog from '@/components/employer/application-detail/StatusUpdateDialog'

const EmployerApplicationDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { toast } = useToast()

    // Local state
    const [statusDialogOpen, setStatusDialogOpen] = useState(false)

    // Fetch application data
    const {
        data: application,
        isLoading,
        error,
        refetch,
    } = useApplicationById(id || '')

    console.log("Application detail data: ", application)

    // Mutation for updating application status
    const { mutate: updateApplication, isPending: isUpdating } =
        useUpdateApplication()

    // Format dates for display
    const formattedAppliedDate = application?.createdAt
        ? format(new Date(application.createdAt), 'PPP')
        : 'Unknown'

    const formattedUpdatedDate = application?.updatedAt
        ? format(new Date(application.updatedAt), 'PPP')
        : 'Unknown'

    // Handle status update
    const handleUpdateStatus = (newStatus: ApplicationStatus) => {
        if (!application || !id) return

        updateApplication(
            { id, updateData: { status: newStatus } },
            {
                onSuccess: () => {
                    toast({
                        title: 'Status Updated',
                        description: `Application status has been updated to ${statusTextMap[newStatus]}.`,
                    })
                    setStatusDialogOpen(false)
                    refetch()
                },
            }
        )
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto py-8 px-4 sm:px-6">
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {error instanceof Error
                            ? error.message
                            : 'Failed to load application details. Please try again.'}
                    </AlertDescription>
                </Alert>
                <div className="mt-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/employer/applications')}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Applications
                    </Button>
                </div>
            </div>
        )
    }

    if (!application) {
        return (
            <div className="container mx-auto py-8 px-4 sm:px-6">
                <Alert>
                    <AlertTitle>Application Not Found</AlertTitle>
                    <AlertDescription>
                        The application you're looking for doesn't exist or you
                        don't have permission to view it.
                    </AlertDescription>
                </Alert>
                <div className="mt-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/employer/applications')}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Applications
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {/* Header */}
                <ApplicationHeader
                    jobTitle={application.job?.title || 'Unknown Position'}
                    isUpdating={isUpdating}
                    onOpenStatusDialog={() => setStatusDialogOpen(true)}
                />

                {/* Status and dates */}
                <ApplicationStatusCards
                    status={application.status}
                    formattedAppliedDate={formattedAppliedDate}
                    formattedUpdatedDate={formattedUpdatedDate}
                />

                {/* Main content */}
                <Tabs defaultValue="application" className="space-y-4">
                    <TabsList className="w-full border-b px-0 py-0 gap-0">
                        <TabsTrigger
                            value="application"
                            className="flex-1 text-sm px-6 py-3 rounded-none data-[state=active]:border-b-2 border-jobboard-darkblue"
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            Application Details
                        </TabsTrigger>
                        <TabsTrigger
                            value="applicant"
                            className="flex-1 text-sm px-6 py-3 rounded-none data-[state=active]:border-b-2 border-jobboard-darkblue"
                        >
                            <User className="h-4 w-4 mr-2" />
                            Applicant Information
                        </TabsTrigger>
                        <TabsTrigger
                            value="job"
                            className="flex-1 text-sm px-6 py-3 rounded-none data-[state=active]:border-b-2 border-jobboard-darkblue"
                        >
                            <Building className="h-4 w-4 mr-2" />
                            Job Details
                        </TabsTrigger>
                    </TabsList>

                    {/* Application tab */}
                    <TabsContent value="application">
                        <ApplicationTabContent
                            resumeUrl={application.resumeUrl}
                            coverLetter={application.coverLetter}
                            status={application.status}
                        />
                    </TabsContent>

                    {/* Applicant tab */}
                    <TabsContent value="applicant">
                        <ApplicantTabContent
                            applicant={{
                                firstName:
                                    application.applicant?.firstName || '',
                                lastName: application.applicant?.lastName || '',
                                email: application.applicant?.email || '',
                                phone: application.applicant?.phone,
                                location: application.applicant?.location,
                            }}
                            applicantId={application.applicantId}
                        />
                    </TabsContent>

                    {/* Job details tab */}
                    <TabsContent value="job">
                        <JobTabContent
                            job={{
                                title: application.job?.title || '',
                                company: application.job?.company,
                                location: application.job?.location,
                                jobType: application.job?.jobType,
                                salary: application.job?.salary,
                                description: application.job?.description,
                                requirements: application.job?.requirements,
                                responsibilities:
                                    application.job?.responsibilities,
                            }}
                            jobId={application.jobId}
                        />
                    </TabsContent>
                </Tabs>
            </motion.div>

            {/* Status Update Dialog */}
            <StatusUpdateDialog
                open={statusDialogOpen}
                onOpenChange={setStatusDialogOpen}
                applicantName={`${application.applicant?.firstName} ${application.applicant?.lastName}`}
                currentStatus={application.status}
                isUpdating={isUpdating}
                onUpdateStatus={handleUpdateStatus}
            />
        </div>
    )
}

export default EmployerApplicationDetailPage
