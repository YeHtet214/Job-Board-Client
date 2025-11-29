import React, { useState } from 'react'
import { Job } from '@/types/job'
import { useNavigate } from 'react-router-dom'
import {
    MapPin,
    Clock,
    Briefcase,
    Calendar,
    Bookmark,
    BookmarkCheck,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    useSaveJob,
    useRemoveSavedJob,
    useJobsData,
} from '@/hooks/react-queries/job'
import { JobSavedStatus } from '@/types/saved-job'
import { useAuth } from '@/contexts/authContext'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { useToast } from '../ui/use-toast'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

interface JobCardProps {
    job: Job
    savedStatus?: JobSavedStatus
}

const JobCard: React.FC<JobCardProps> = ({ job, savedStatus }) => {
    const { handleJobView } = useJobsData()
    const navigate = useNavigate()
    const { toast } = useToast()
    const { currentUser, isAuthenticated } = useAuth()
    const isJobSeeker = currentUser?.role === 'JOBSEEKER'

    // Use mutations for saving/removing jobs
    const { mutate: saveJobMutation, isPending: isSavingJob } = useSaveJob()
    const { mutate: removeSavedJobMutation, isPending: isRemovingJob } = useRemoveSavedJob()

    const [isSaved, setIsSaved] = useState<boolean>(() => !!savedStatus?.isSaved && !!savedStatus?.savedJobId)

    const isLoading = isSavingJob || isRemovingJob

    // Format data for display
    const companyInitials =
        job.company?.name?.substring(0, 2).toUpperCase() || 'CO'
    const formattedSalary = `$${job.salaryMin}K - $${job.salaryMax}K`
    const postedDate = job.createdAt
        ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })
        : 'Recently'

    // Limit skills to show (to prevent overflow)
    const displaySkills = job.requiredSkills.slice(0, 3)
    const hasMoreSkills = job.requiredSkills.length > 3

    const handleView = () => {
        // Only track viewed jobs for authenticated users
        if (isAuthenticated() && currentUser?.id) {
            handleJobView(currentUser.id, job)
        }
        navigate(`/jobs/${job.id}`)
    }

    const handleSaveToggle = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsSaved(prev => !prev)

        if (!isAuthenticated() || !isJobSeeker) {
            toast({
                title: 'Authentication Required',
                description: 'Please login as a job seeker to save jobs',
                variant: 'default',
            })
            setTimeout(() => navigate('/login'), 2000)
            return
        }

        if (savedStatus?.isSaved && savedStatus?.savedJobId === job.id) {
            removeSavedJobMutation({
                savedJobId: savedStatus.savedJobId,
                jobId: job.id,
            })
        } else if (job.id) {
            saveJobMutation(job.id)
        }
    }

    return (
        <Card className="h-full flex flex-col hover:shadow-md transition-all duration-200 cursor-pointer">
            <CardHeader className="flex flex-row items-start gap-3 relative pb-3">
                {job.company?.logo ? (
                    <img
                        src={job.company.logo}
                        alt={job.company.name || 'Company'}
                        className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                    />
                ) : (
                    <div className="w-12 h-12 bg-jb-surface rounded-md flex items-center justify-center flex-shrink-0">
                        <span className="text-jb-primary font-bold">
                            {companyInitials}
                        </span>
                    </div>
                )}

                <div className="flex-1 min-w-0 pr-10 space-y-0">
                    <CardTitle className="text-jb-primary text-lg line-clamp-2">
                        {job.title}
                    </CardTitle>
                    <CardDescription className="truncate">
                        {job.company?.name || 'Company Name'}
                    </CardDescription>
                </div>

                {isJobSeeker && (
                    <div className="absolute top-4 right-4 z-10">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={
                                            isSaved
                                                ? 'text-jb-purple h-8 w-8 p-0 bg-card/90'
                                                : 'text-gray-400 hover:text-jb-primary h-8 w-8 p-0 bg-background/90'
                                        }
                                        onClick={(e) => handleSaveToggle(e)}
                                        disabled={isLoading}
                                    >
                                        {isSaved ? (
                                            <BookmarkCheck className="h-7 w-7 text-jb-primary" />
                                        ) : (
                                            <Bookmark className="h-5 w-5" />
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        {isSaved
                                            ? 'Remove from saved jobs'
                                            : 'Save job'}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                )}
            </CardHeader>

            <CardContent className="flex-1 flex flex-col pt-0">
                {/* Job Details */}
                <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{job.type}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{job.experienceLevel}</span>
                    </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {displaySkills.map((skill, index) => (
                        <Badge
                            key={index}
                            variant="outline"
                            className="bg-jb-surface/30 text-jb-primary border-none"
                        >
                            {skill}
                        </Badge>
                    ))}
                    {hasMoreSkills && (
                        <Badge
                            variant="outline"
                            className="bg-secondary text-secondary-foreground border-none"
                        >
                            +{job.requiredSkills.length - 3} more
                        </Badge>
                    )}
                </div>

                {/* Posted Date */}
                <div className="text-xs text-gray-500 flex items-center mb-4">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>Posted {postedDate}</span>
                </div>
            </CardContent>

            <CardFooter className="justify-between items-center pt-3 gap-2">
                <span className="text-green-600 font-medium text-sm">
                    {formattedSalary}
                </span>
                <Button
                    size="sm"
                    className="bg-jb-primary hover:bg-jb-primary/90"
                    onClick={handleView}
                >
                    View Details
                </Button>
            </CardFooter>
        </Card>
    )
}

export default JobCard
