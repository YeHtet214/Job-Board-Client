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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Search, Filter, X, UserCheck, ClipboardList, Eye } from 'lucide-react'

import { useToast } from '@/components/ui/use-toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { ReceivedApplication } from '@/types/dashboard'
import {
    useEmployerDashboard,
    useUpdateApplicationStatus,
} from '@/hooks/react-queries/dashboard'
import { useAuth } from '@/contexts/authContext'
import { formatDate, getEmployerStatusBadge } from '@/utils/dashboard.utils'

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

    // Handle application status update
    const handleUpdateStatus = (status: ReceivedApplication['status']) => {
        if (!selectedApplication) return

        // 1. Snapshot previous state
        const previousApplications = [...applications]
        const previousFilteredApplications = [...filteredApplications]

        // 2. Optimistically update local state
        const updatedApplications = applications.map((app) =>
            app.id === selectedApplication.id ? { ...app, status } : app
        )

        // Also update filtered list to reflect changes immediately in the UI
        const updatedFilteredApplications = filteredApplications.map((app) =>
            app.id === selectedApplication.id ? { ...app, status } : app
        )

        setApplications(updatedApplications)
        setFilteredApplications(updatedFilteredApplications)

        // 3. Close dialog and show success message immediately
        setStatusDialogOpen(false)
        setSelectedApplication(null)

        toast({
            title: 'Status updated',
            description: `Application status updated to ${status.toLowerCase()}.`,
        })

        // 4. Perform mutation
        updateApplicationStatus(
            { id: selectedApplication.id, statusData: { status } },
            {
                onError: () => {
                    // 5. Revert on error
                    setApplications(previousApplications)
                    setFilteredApplications(previousFilteredApplications)

                    toast({
                        title: 'Error',
                        description:
                            'Failed to update application status. Please try again.',
                        variant: 'destructive',
                    })
                },
                // On success, the query invalidation in the hook will eventually sync with server,
                // but our local state is already correct.
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

    const statusOptions = [
        { value: 'PENDING', label: 'Pending' },
        { value: 'REVIEWING', label: 'Reviewing' },
        { value: 'INTERVIEW', label: 'Interview' },
        { value: 'REJECTED', label: 'Rejected' },
        { value: 'ACCEPTED', label: 'Accepted' },
    ]

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
                                    {filteredApplications.length} applications
                                    found
                                </CardDescription>
                            </div>
                            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Search by name or job title..."
                                        className="pl-9 w-full sm:w-[250px]"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Select
                                        value={statusFilter}
                                        onValueChange={setStatusFilter}
                                    >
                                        <SelectTrigger className="w-full sm:w-[180px]">
                                            <div className="flex items-center">
                                                <Filter className="h-4 w-4 mr-2 text-gray-400" />
                                                <SelectValue placeholder="Filter by status" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">
                                                All Statuses
                                            </SelectItem>
                                            {statusOptions.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {(searchTerm || statusFilter !== 'ALL') && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={clearFilters}
                                            title="Clear filters"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {filteredApplications.length > 0 ? (
                            <div className="overflow-x-auto rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Applicant</TableHead>
                                            <TableHead>Job Title</TableHead>
                                            <TableHead>Date Applied</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredApplications.map(
                                            (application) => (
                                                <TableRow key={application.id}>
                                                    <TableCell className="font-medium">
                                                        {
                                                            application.applicantName
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {application.jobTitle}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatDate(
                                                            application.applied
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getEmployerStatusBadge(
                                                            application.status
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/employer/applications/${application.id}`
                                                                    )
                                                                }
                                                            >
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                View
                                                            </Button>
                                                            <Button
                                                                variant="secondary"
                                                                size="sm"
                                                                onClick={() =>
                                                                    openStatusDialog(
                                                                        application
                                                                    )
                                                                }
                                                            >
                                                                <UserCheck className="h-4 w-4 mr-2" />
                                                                Update Status
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
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

            {/* Status Update Dialog */}
            <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Application Status</DialogTitle>
                        <DialogDescription>
                            Change the status for{' '}
                            {selectedApplication?.applicantName}'s application
                            for {selectedApplication?.jobTitle}
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
                                                handleUpdateStatus(
                                                    option.value as ReceivedApplication['status']
                                                )
                                            }
                                            disabled={
                                                selectedApplication?.status ===
                                                option.value ||
                                                updateApplicationStatusLoading
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
                            onClick={() => setStatusDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EmployerApplicationListPage
