import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ClipboardList } from 'lucide-react'

import { useToast } from '@/components/ui/use-toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { ReceivedApplication } from '@/types/dashboard'
import {
    useEmployerDashboard,
    useUpdateApplicationStatus,
} from '@/hooks/react-queries/dashboard'
import { useAuth } from '@/contexts/authContext'

import ApplicationFilters from '@/components/employer/applications/ApplicationFilters'
import ApplicationTable from '@/components/employer/applications/ApplicationTable'
import ApplicationStatusDialog from '@/components/employer/applications/ApplicationStatusDialog'

const EmployerApplicationListPage: React.FC = () => {
    const navigate = useNavigate()
    const { currentUser } = useAuth()
    const { toast } = useToast()

    // State for applications data
    const [applications, setApplications] = useState<ReceivedApplication[]>([])
    const [filteredApplications, setFilteredApplications] = useState<
        ReceivedApplication[]
    >([])
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('ALL')
    const [selectedApplication, setSelectedApplication] =
        useState<ReceivedApplication | null>(null)
    const [statusDialogOpen, setStatusDialogOpen] = useState(false)

    // Fetch employer dashboard data
    const {
        data: employerData,
        isLoading,
        error,
    } = useEmployerDashboard({
        enabled: currentUser?.role === 'EMPLOYER',
    })

    const {
        mutate: updateApplicationStatus,
        isPending: updateApplicationStatusLoading,
    } = useUpdateApplicationStatus()

    // Load applications on component mount
    useEffect(() => {
        if (employerData) {
            setApplications(employerData.applications)
            setFilteredApplications(employerData.applications)
        }
    }, [employerData])

    // Handle search and filtering
    useEffect(() => {
        let result = applications

        // Apply search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase()
            result = result.filter(
                (app) =>
                    app.applicantName.toLowerCase().includes(searchLower) ||
                    app.jobTitle.toLowerCase().includes(searchLower)
            )
        }

        // Apply status filter
        if (statusFilter !== 'ALL') {
            result = result.filter((app) => app.status === statusFilter)
        }

        setFilteredApplications(result)
    }, [searchTerm, statusFilter, applications])

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('')
        setStatusFilter('ALL')
    }

    // Open status update dialog
    const openStatusDialog = (application: ReceivedApplication) => {
        setSelectedApplication(application)
        setStatusDialogOpen(true)
    }

    const handleUpdateStatus = (status: ReceivedApplication['status']) => {
        if (!selectedApplication) return

        const previousApplications = [...applications]
        const previousFilteredApplications = [...filteredApplications]

        // Optimistically update local state
        const updatedApplications = applications.map((app) =>
            app.id === selectedApplication.id ? { ...app, status } : app
        )

        // Also update filtered list to reflect changes immediately in the UI
        const updatedFilteredApplications = filteredApplications.map((app) =>
            app.id === selectedApplication.id ? { ...app, status } : app
        )

        setApplications(updatedApplications)
        setFilteredApplications(updatedFilteredApplications)

        setStatusDialogOpen(false)
        setSelectedApplication(null)

        toast({
            title: 'Status updated',
            description: `Application status updated to ${status.toLowerCase()}.`,
        })

        updateApplicationStatus(
            { id: selectedApplication.id, statusData: { status } },
            {
                onError: () => {
                    setApplications(previousApplications)
                    setFilteredApplications(previousFilteredApplications)

                    toast({
                        title: 'Error',
                        description:
                            'Failed to update application status. Please try again.',
                        variant: 'destructive',
                    })
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
            <div className="container mx-auto max-w-6xl py-10 px-4 sm:px-6 text-center">
                <p className="text-red-500">
                    Error loading applications. Please try again later.
                </p>
            </div>
        )
    }

    return (
        <div className="container mx-auto max-w-6xl py-10 px-4 sm:px-6">
            <motion.div
                className="flex justify-between items-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div>
                    <h1 className="text-3xl font-bold text-jobboard-darkblue">
                        All Applications
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Review and manage applications for your job postings
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/employer/dashboard')}
                    variant="outline"
                >
                    Back to Dashboard
                </Button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <CardTitle>Job Applications</CardTitle>
                                <CardDescription>
                                    {filteredApplications.length} applications found
                                </CardDescription>
                            </div>
                            <ApplicationFilters
                                searchTerm={searchTerm}
                                onSearchChange={setSearchTerm}
                                statusFilter={statusFilter}
                                onStatusFilterChange={setStatusFilter}
                                onClearFilters={clearFilters}
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {filteredApplications.length > 0 ? (
                            <ApplicationTable
                                applications={filteredApplications}
                                onViewApplication={(id) =>
                                    navigate(`/employer/applications/${id}`)
                                }
                                onUpdateStatus={openStatusDialog}
                            />
                        ) : (
                            <div className="text-center py-12">
                                <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">
                                    No Applications Found
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {applications.length === 0
                                        ? "You haven't received any job applications yet."
                                        : 'No applications match your search filters.'}
                                </p>
                                {applications.length === 0 ? (
                                    <Button
                                        onClick={() =>
                                            navigate('/employer/jobs/create')
                                        }
                                        className="bg-jobboard-darkblue hover:bg-jobboard-darkblue/90"
                                    >
                                        Post a Job
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        onClick={clearFilters}
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            <ApplicationStatusDialog
                open={statusDialogOpen}
                onOpenChange={setStatusDialogOpen}
                selectedApplication={selectedApplication}
                onUpdateStatus={handleUpdateStatus}
                isUpdating={updateApplicationStatusLoading}
            />
        </div>
    )
}

export default EmployerApplicationListPage
