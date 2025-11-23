import { useParams, Link, useNavigate } from 'react-router-dom'
import { useJob } from '@/hooks/react-queries/job/useJobQueries'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/contexts/authContext'
import {
    getCompanyInitials,
    formatSalaryRange,
    formatDate,
} from '@/lib/formatters'
import { useJobsData } from '@/hooks'
import { useEffect } from 'react'

const JobDetailPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { handleJobView } = useJobsData()
    const { isAuthenticated, currentUser } = useAuth()

    // Fetch job details using the useJob hook
    const { data: job, isLoading, error } = useJob(id || '')

    // Update recently viewed jobs when the job data is loaded
    useEffect(() => {
        if (job) {
            handleJobView(currentUser?.id || '', job)
        }
    }, [currentUser, job, handleJobView])

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 px-4 bg-jb-bg">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-jb-accent"></div>
                </div>
            </div>
        )
    }

    if (error || !job) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error instanceof Error ? error.message : 'Job not found'}
                </div>
                <div className="mt-4">
                    <Button onClick={() => navigate(-1)} variant="outline">
                        Go Back
                    </Button>
                </div>
            </div>
        )
    }

    // For demo purposes, using mock data where needed

    const companyInitials = getCompanyInitials(job.company?.name)
    const formattedSalary = formatSalaryRange(job.salaryMin, job.salaryMax)
    const formattedDate = formatDate(job.createdAt)

    const isEmployer = currentUser?.role === 'EMPLOYER'
    const isAdmin = currentUser?.role === 'ADMIN'
    const canApply = isAuthenticated && currentUser?.role === 'JOBSEEKER'
    const canEdit =
        isAuthenticated &&
        (isAdmin || (isEmployer && job.postedById === currentUser?.id))

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <Card className="mb-6">
                        <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center">
                                    <div className="w-16 h-16 bg-jb-surface rounded-full shadow flex items-center justify-center mr-4">
                                        <span className="text-jb-primary font-bold text-xl">
                                            {companyInitials}
                                        </span>
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl font-bold text-jobboard-darkblue mb-1">
                                            {job.title}
                                        </CardTitle>
                                        <CardDescription className="text-gray-600 text-lg">
                                            {job.company?.name ||
                                                'Company Name'}
                                        </CardDescription>
                                    </div>
                                </div>
                                {canEdit ? (
                                    <div className="flex space-x-2">
                                        <Link to={`/jobs/${job.id}/edit`}>
                                            <Button
                                                variant="outline"
                                                className="text-jb-primary"
                                            >
                                                Edit
                                            </Button>
                                        </Link>
                                    </div>
                                ): (
                                    <div className="flex space-x-2">
                                        <Link to={`/jobs/${job.id}/apply`}>
                                            <Button
                                                variant="outline"
                                                className="text-jb-primary"
                                            >
                                                Message
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-4 mb-4">
                                <div className="flex items-center text-gray-600">
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {job.location}
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {job.type}
                                </div>
                                <div className="flex items-center text-green-600 font-medium">
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {formattedSalary}
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Posted on {formattedDate}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">
                                    Required Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {job.requiredSkills.map((skill, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="bg-jb-accent "
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <Separator className="my-6" />

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    Job Description
                                </h3>
                                <div className="prose max-w-none">
                                    <p className="whitespace-pre-line">
                                        {job.description}
                                    </p>
                                </div>
                            </div>

                            <Separator className="my-6" />

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">
                                    Experience Level
                                </h3>
                                <p className="text-gray-700 capitalize">
                                    {job.experienceLevel}
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <div className="w-full flex justify-between items-center">
                                <Button
                                    onClick={() => navigate(-1)}
                                    variant="outline"
                                >
                                    Back to Jobs
                                </Button>
                                {canApply && (
                                    <Link to={`/jobs/${job.id}/apply`}>
                                        <Button className="bg-jb-primary hover:bg-jb-primary/90">
                                            Apply Now
                                        </Button>
                                    </Link>
                                )}
                                {!isAuthenticated && (
                                    <Link
                                        to={`/login?redirect=/jobs/${job.id}`}
                                    >
                                        <Button className="bg-jb-primary hover:bg-jb-primary/90">
                                            Login to Apply
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </CardFooter>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Company Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-jobboard-light rounded-md flex items-center justify-center mr-3">
                                    <span className="text-jobboard-darkblue font-bold">
                                        {companyInitials}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold">
                                        {job.company?.name || 'Company Name'}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {job.location}
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-700 mb-4">
                                {job.company?.industry ||
                                    'Company description not available.'}
                            </p>
                            <Link to={`/companies/${job.companyId}`}>
                                <Button variant="outline" className="w-full">
                                    View Company Profile
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Similar Jobs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 text-sm">
                                We're finding similar jobs based on your current
                                view.
                            </p>
                            <div className="mt-4 space-y-4">
                                <div className="animate-pulse space-y-4">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default JobDetailPage
