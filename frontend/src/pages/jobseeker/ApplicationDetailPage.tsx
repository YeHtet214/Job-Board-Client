import { useParams, useNavigate } from 'react-router-dom'
import {
    CalendarDays,
    Building,
    User,
    MapPin,
    Clock,
    FileText,
    PenSquare,
    MailOpen,
    Calendar,
    CheckCircle2,
    XCircle,
    ArrowLeft,
} from 'lucide-react'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import { useToast } from '@/components/ui/use-toast'
import {
    useApplicationById,
    useWithdrawApplication,
} from '@/hooks/react-queries/application/useApplicationQueries'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useEffect } from 'react'
import CancelConfirmAlert from '@/components/common/CancelConfirmAlert'

const statusIconMap = {
    PENDING: <Clock className="h-5 w-5 text-yellow-500" />,
    REVIEWING: <MailOpen className="h-5 w-5 text-blue-500" />,
    INTERVIEW: <Calendar className="h-5 w-5 text-purple-500" />,
    ACCEPTED: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    REJECTED: <XCircle className="h-5 w-5 text-red-500" />,
}

const statusTextMap = {
    PENDING: 'Pending Review',
    REVIEWING: 'Under Review',
    INTERVIEW: 'Interview Scheduled',
    ACCEPTED: 'Application Accepted',
    REJECTED: 'Application Rejected',
}

const statusColorMap = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    REVIEWING: 'bg-blue-100 text-blue-800',
    INTERVIEW: 'bg-purple-100 text-purple-800',
    ACCEPTED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
}

const ApplicationDetailPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { toast } = useToast()

    const { data: application, isLoading, error } = useApplicationById(id || '')
    const { mutate: withdrawApplication } = useWithdrawApplication()

    const handleWithdraw = async () => {
        if (!application || !id) return

        try {
            withdrawApplication(id)
            toast({
                title: 'Application Withdrawn',
                description: 'Your application has been successfully withdrawn',
            })
            navigate('/applications')
        } catch (err) {
            console.error('Failed to withdraw application:', err)
            toast({
                variant: 'destructive',
                title: 'Error',
                description:
                    'Failed to withdraw application. Please try again.',
            })
        }
    }

    useEffect(() => {
        console.log('Application: ', application)
    }, [application])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner fullScreen />
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto py-8 px-4 sm:px-6">
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {error.message ||
                            'Failed to load application details. Please try again.'}
                    </AlertDescription>
                </Alert>
                <div className="mt-4">
                    <Button onClick={() => navigate('/dashboard/applications')}>
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
                    <Button onClick={() => navigate('/dashboard/applications')}>
                        Back to Applications
                    </Button>
                </div>
            </div>
        )
    }

    const formattedAppliedDate = application.createdAt
        ? format(new Date(application.createdAt), 'MMMM dd, yyyy')
        : 'N/A'

    const formattedLastUpdated = application.updatedAt
        ? format(new Date(application.updatedAt), 'MMMM dd, yyyy')
        : 'N/A'

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                <div>
                    <h1 className="">
                        {application.job?.title || 'Job Title'}
                    </h1>
                    <div className="flex flex-wrap items-center text-muted-foreground text-sm gap-x-4 gap-y-2">
                        <span className="flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            {application.job?.company?.name || 'Company Name'}
                        </span>
                        <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {application.job?.location || 'Location'}
                        </span>
                        <span className="flex items-center">
                            <CalendarDays className="h-4 w-4 mr-1" />
                            Applied: {formattedAppliedDate}
                        </span>
                    </div>
                </div>

                <div className="mt-4 md:mt-0 w-full md:w-auto">
                    <Badge
                        variant="outline"
                        className={`text-sm py-1 px-3 font-medium ${statusColorMap[application.status]}`}
                    >
                        <span className="flex items-center gap-1.5">
                            {statusIconMap[application.status]}
                            {statusTextMap[application.status]}
                        </span>
                    </Badge>
                </div>
            </div>

            <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger
                        value="details"
                        className="flex items-center justify-center gap-2"
                    >
                        <FileText className="h-4 w-4" />
                        Application Details
                    </TabsTrigger>
                    <TabsTrigger
                        value="job"
                        className="flex items-center justify-center gap-2"
                    >
                        <PenSquare className="h-4 w-4" />
                        Job Description
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">
                                        Application Details
                                    </CardTitle>
                                    <CardDescription>
                                        Information about your application for{' '}
                                        {application.job?.title}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <h3 className="font-medium mb-2">
                                            Cover Letter
                                        </h3>
                                        <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">
                                            {application.coverLetter ||
                                                'No cover letter provided'}
                                        </div>
                                    </div>

                                    {/* {application.answers && application.answers.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Additional Questions</h3>
                      <div className="space-y-4">
                        {application.answers.map((answer, index) => (
                          <div key={index} className="bg-muted p-4 rounded-md">
                            <p className="font-medium mb-1">{answer.question}</p>
                            <p>{answer.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )} */}

                                    {application.resumeUrl && (
                                        <div className="overflow-hidden">
                                            <h3 className="font-medium mb-2 flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-muted-foreground" />
                                                <span>Resume</span>
                                            </h3>
                                            <iframe
                                                src={application.resumeUrl}
                                                width="100%"
                                                height="500px"
                                                title="Resume Preview"
                                                style={{
                                                    border: '1px solid #ccc',
                                                    borderRadius: '8px',
                                                }}
                                            />
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="flex justify-between border-t p-6">
                                    <Button
                                        variant="ghost"
                                        className="pl-0 hover:bg-transparent hover:text-jb-primary mb-2"
                                        onClick={() =>
                                            navigate('/applications')
                                        }
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Applications
                                    </Button>
                                    {application.status === 'PENDING' && (
                                        <CancelConfirmAlert
                                            buttonContent="Withdraw Application"
                                            alertTitle="Withdraw Application"
                                            alertDescription="Are you sure you want to withdraw your application for {application.job?.title} at {application.job?.company?.name}? This action cannot be undone."
                                            cancelItem={application}
                                            onWithdraw={handleWithdraw}
                                        />
                                    )}
                                </CardFooter>
                            </Card>
                        </div>

                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">
                                        Application Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Status
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className={`${statusColorMap[application.status]}`}
                                        >
                                            {statusTextMap[application.status]}
                                        </Badge>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Applied On
                                        </span>
                                        <span className="text-sm font-medium">
                                            {formattedAppliedDate}
                                        </span>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Last Updated
                                        </span>
                                        <span className="text-sm font-medium">
                                            {formattedLastUpdated}
                                        </span>
                                    </div>

                                    {/* {application.feedback && (
                    <>
                      <Separator />
                      <div>
                        <span className="text-sm text-muted-foreground block mb-1">Employer Feedback</span>
                        <p className="text-sm bg-muted p-3 rounded-md">
                          {application.feedback}
                        </p>
                      </div>
                    </>
                  )} */}
                                </CardContent>
                            </Card>

                            {application.job?.interviewDate && (
                                <Card className="mt-6">
                                    <CardHeader>
                                        <CardTitle className="text-xl">
                                            Interview Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="font-medium">
                                                    {format(
                                                        new Date(
                                                            application.job?.interviewDate
                                                        ),
                                                        'MMMM dd, yyyy'
                                                    )}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {format(
                                                        new Date(
                                                            application.job?.interviewDate
                                                        ),
                                                        'h:mm a'
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        {/* {application.interviewLocation && ( */}
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-primary" />
                                            {/* <span>{application.interviewLocation}</span> */}
                                            <span>Interview Location</span>
                                        </div>
                                        {/* )} */}
                                        {/* {application.interviewNotes && ( */}
                                        <div>
                                            <p className="text-sm font-medium mb-1">
                                                Notes
                                            </p>
                                            <p className="text-sm bg-muted p-3 rounded-md">
                                                {/* {application.interviewNotes} */}
                                                Interview Notes
                                            </p>
                                        </div>
                                        {/* )} */}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="job">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">
                                {application.job?.title || 'Job Title'}
                            </CardTitle>
                            <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <span className="flex items-center">
                                    <Building className="h-4 w-4 mr-1" />
                                    {application.job?.company?.name ||
                                        'Company Name'}
                                </span>
                                <span className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {application.job?.location || 'Location'}
                                </span>
                                <span className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {application.job?.jobType || 'Full-time'}
                                </span>
                                {application.job?.salary && (
                                    <span className="flex items-center">
                                        <User className="h-4 w-4 mr-1" />
                                        {application.job.salary}
                                    </span>
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="font-medium mb-2">
                                    Job Description
                                </h3>
                                <div className="text-muted-foreground whitespace-pre-wrap">
                                    {application.job?.description ||
                                        'No job description available'}
                                </div>
                            </div>

                            {application.job?.requirements && (
                                <div>
                                    <h3 className="font-medium mb-2">
                                        Requirements
                                    </h3>
                                    <div className="text-muted-foreground whitespace-pre-wrap">
                                        {application.job.requirements}
                                    </div>
                                </div>
                            )}

                            {application.job?.responsibilities && (
                                <div>
                                    <h3 className="font-medium mb-2">
                                        Responsibilities
                                    </h3>
                                    <div className="text-muted-foreground whitespace-pre-wrap">
                                        {application.job.responsibilities}
                                    </div>
                                </div>
                            )}

                            {application.job?.benefits && (
                                <div>
                                    <h3 className="font-medium mb-2">
                                        Benefits
                                    </h3>
                                    <div className="text-muted-foreground whitespace-pre-wrap">
                                        {application.job.benefits}
                                    </div>
                                </div>
                            )}

                            {application.job?.qualifications && (
                                <div>
                                    <h3 className="font-medium mb-2">
                                        Qualifications
                                    </h3>
                                    <div className="text-muted-foreground whitespace-pre-wrap">
                                        {application.job.qualifications}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="border-t p-6">
                            <Button
                                variant="ghost"
                                className="pl-0 hover:bg-transparent hover:text-jb-primary mb-2"
                                onClick={() =>
                                    navigate('/dashboard/applications')
                                }
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Applications
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default ApplicationDetailPage
