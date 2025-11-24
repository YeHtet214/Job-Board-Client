import { useParams, Link, useNavigate } from 'react-router-dom'
import { useJob } from '@/hooks/react-queries/job/useJobQueries'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
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
import {
    MapPin,
    Briefcase,
    DollarSign,
    Calendar,
    Clock,
    Building,
    ArrowLeft,
    Share2,
    Bookmark,
    ExternalLink
} from 'lucide-react'

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
            <div className="container mx-auto py-12 px-4 bg-jb-bg min-h-screen">
                <div className="flex flex-col justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-jb-primary"></div>
                    <p className="mt-4 text-jb-text-muted">Loading job details...</p>
                </div>
            </div>
        )
    }

    if (error || !job) {
        return (
            <div className="container mx-auto py-12 px-4 min-h-screen bg-jb-bg">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 px-6 py-8 rounded-xl mb-6">
                        <h3 className="text-lg font-semibold mb-2">Error Loading Job</h3>
                        <p>{error instanceof Error ? error.message : 'Job not found'}</p>
                    </div>
                    <Button onClick={() => navigate(-1)} variant="outline" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </Button>
                </div>
            </div>
        )
    }

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
        <div className="min-h-screen bg-jb-bg pb-12">
            {/* Header / Breadcrumb area */}
            <div className="bg-jb-surface border-b border-jb-border py-8">
                <div className="container mx-auto px-4 sm:px-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="mb-6 pl-0 text-jb-text-muted hover:text-jb-text hover:bg-transparent"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Jobs
                    </Button>

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex items-start gap-5">
                            <div className="w-20 h-20 bg-white dark:bg-jb-surface rounded-xl shadow-sm border border-jb-border flex items-center justify-center flex-shrink-0">
                                {job.company?.logo ? (
                                    <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-contain p-2" />
                                ) : (
                                    <span className="text-jb-primary font-bold text-2xl">
                                        {companyInitials}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-jb-text mb-2 leading-tight">
                                    {job.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-jb-text-muted text-sm">
                                    <div className="flex items-center">
                                        <Building className="w-4 h-4 mr-1.5" />
                                        <span className="font-medium text-jb-text">{job.company?.name}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-1.5" />
                                        {job.location}
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-1.5" />
                                        Posted {formattedDate}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-2 md:mt-0">
                            {canEdit ? (
                                <Link to={`/jobs/${job.id}/edit`}>
                                    <Button variant="outline" className="w-full sm:w-auto border-jb-primary text-jb-primary hover:bg-jb-primary/5">
                                        Edit Job
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Button variant="outline" size="icon" className="hidden sm:flex">
                                        <Share2 className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="hidden sm:flex">
                                        <Bookmark className="w-4 h-4" />
                                    </Button>
                                    {canApply ? (
                                        <Link to={`/jobs/${job.id}/apply`} className="w-full sm:w-auto">
                                            <Button className="w-full bg-jb-primary hover:bg-jb-primary/80 text-white px-8">
                                                Apply Now
                                            </Button>
                                        </Link>
                                    ) : !isAuthenticated ? (
                                        <Link to={`/login?redirect=/jobs/${job.id}`} className="w-full sm:w-auto">
                                            <Button className="w-full bg-jb-primary hover:bg-jb-primary/80 text-white px-8">
                                                Login to Apply
                                            </Button>
                                        </Link>
                                    ) : null}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Job Overview Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Card className="bg-jb-surface border-jb-border shadow-sm">
                                <CardContent className="p-4 flex flex-col items-center text-center sm:items-start sm:text-left">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-3">
                                        <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <p className="text-xs text-jb-text-muted uppercase font-semibold tracking-wider mb-1">Salary</p>
                                    <p className="font-semibold text-jb-text">{formattedSalary}</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-jb-surface border-jb-border shadow-sm">
                                <CardContent className="p-4 flex flex-col items-center text-center sm:items-start sm:text-left">
                                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg mb-3">
                                        <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <p className="text-xs text-jb-text-muted uppercase font-semibold tracking-wider mb-1">Job Type</p>
                                    <p className="font-semibold text-jb-text">{job.type}</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-jb-surface border-jb-border shadow-sm">
                                <CardContent className="p-4 flex flex-col items-center text-center sm:items-start sm:text-left">
                                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg mb-3">
                                        <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <p className="text-xs text-jb-text-muted uppercase font-semibold tracking-wider mb-1">Experience</p>
                                    <p className="font-semibold text-jb-text capitalize">{job.experienceLevel.toLowerCase()}</p>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="border-jb-border shadow-sm overflow-hidden p-0">
                            <CardHeader className="bg-jb-surface border-b border-jb-border">
                                <CardTitle className="text-xl translate-y-1/2">Job Description</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className=" dark:prose-invert max-w-none text-jb-text-muted">
                                    <p className="whitespace-pre-line leading-relaxed">
                                        {job.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-jb-border shadow-sm">
                            <CardHeader className="bg-jb-surface border-b border-jb-border">
                                <CardTitle className="text-xl">Required Skills</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="flex flex-wrap gap-2">
                                    {job.requiredSkills.map((skill, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="bg-jb-primary/10 text-jb-primary hover:bg-jb-primary/20 px-3 py-1 text-sm font-medium border-none"
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-jb-border shadow-sm overflow-hidden p-0">
                            <CardHeader className="bg-jb-surface border-b border-jb-border pb-4">
                                <CardTitle className="text-lg translate-y-1/2">About the Company</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="flex items-center mb-6">
                                    <div className="w-14 h-14 bg-jb-surface rounded-xl flex items-center justify-center mr-4 border border-jb-border">
                                        {job.company?.logo ? (
                                            <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-contain p-1" />
                                        ) : (
                                            <span className="text-jb-primary font-bold text-xl">
                                                {companyInitials}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-jb-text text-lg">
                                            {job.company?.name || 'Company Name'}
                                        </h3>
                                        <Link to={`/companies/${job.companyId}`} className="text-sm text-jb-primary hover:underline flex items-center">
                                            View Profile <ExternalLink className="w-3 h-3 ml-1" />
                                        </Link>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-start">
                                        <MapPin className="w-4 h-4 text-jb-text-muted mt-0.5 mr-3" />
                                        <div>
                                            <p className="text-xs text-jb-text-muted uppercase font-semibold">Location</p>
                                            <p className="text-sm text-jb-text">{job.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <Briefcase className="w-4 h-4 text-jb-text-muted mt-0.5 mr-3" />
                                        <div>
                                            <p className="text-xs text-jb-text-muted uppercase font-semibold">Industry</p>
                                            <p className="text-sm text-jb-text">{job.company?.industry || 'N/A'}</p>
                                        </div>
                                    </div>
                                    {job.company?.website && (
                                        <div className="flex items-start">
                                            <ExternalLink className="w-4 h-4 text-jb-text-muted mt-0.5 mr-3" />
                                            <div>
                                                <p className="text-xs text-jb-text-muted uppercase font-semibold">Website</p>
                                                <a href={job.company.website} target="_blank" rel="noreferrer" className="text-sm text-jb-primary hover:underline truncate block max-w-[200px]">
                                                    {job.company.website.replace(/^https?:\/\//, '')}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Separator className="my-4" />

                                <p className="text-sm text-jb-text-muted leading-relaxed mb-6">
                                    {job.company?.description ?
                                        (job.company.description.length > 150 ? `${job.company.description.substring(0, 150)}...` : job.company.description)
                                        : 'Company description not available.'}
                                </p>

                                <Link to={`/companies/${job.companyId}`}>
                                    <Button variant="outline" className="w-full border-jb-border hover:bg-jb-primary/80">
                                        View Full Profile
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Similar Jobs Placeholder - Could be a real component later */}
                        <Card className="border-jb-border shadow-sm bg-gradient-to-br from-jb-primary/5 to-transparent border-none">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-jb-text mb-2">Not the right fit?</h3>
                                <p className="text-sm text-jb-text-muted mb-4">
                                    Keep looking! We have thousands of other job opportunities waiting for you.
                                </p>
                                <Link to="/jobs">
                                    <Button className="w-full bg-jb-surface text-jb-text border border-jb-border hover:bg-jb-surface">
                                        Browse All Jobs
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobDetailPage
