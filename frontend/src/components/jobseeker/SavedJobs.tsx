import React from 'react'
import { useSavedJobs, useRemoveSavedJob } from '@/hooks/react-queries/job'
import { SavedJobWithDetails } from '@/types/saved-job'
import { Button } from '@/components/ui/button'
import {
    Bookmark,
    BookmarkX,
    CalendarIcon,
    ExternalLink,
    Loader2,
} from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'

const SavedJobs: React.FC = () => {
    const { data: savedJobs, isLoading, error } = useSavedJobs()
    const removeSavedJobMutation = useRemoveSavedJob()
    const { toast } = useToast()

    const handleRemoveSavedJob = async (
        savedJobId: string,
        jobId: string,
        jobTitle: string
    ) => {
        try {
            await removeSavedJobMutation.mutateAsync({ savedJobId, jobId })
            toast({
                title: 'Job removed',
                description: `"${jobTitle}" has been removed from your saved jobs.`,
            })
        } catch (error) {
            // Error is handled in the mutation configuration
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-jobboard-darkblue">
                        Saved Jobs
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, index) => (
                        <Card key={index} className="border shadow-sm">
                            <CardHeader className="pb-2">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent className="pb-2">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between pt-2">
                                <Skeleton className="h-8 w-24" />
                                <Skeleton className="h-8 w-24" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <BookmarkX className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">
                    Error loading saved jobs
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                    There was a problem loading your saved jobs. Please try
                    again.
                </p>
                <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </Button>
            </div>
        )
    }

    if (!savedJobs || savedJobs.length === 0) {
        return (
            <div className="text-center py-10">
                <Bookmark className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No saved jobs</h3>
                <p className="mt-2 text-sm text-gray-500">
                    You haven't saved any jobs yet. Browse jobs and click the
                    bookmark icon to save them.
                </p>
                <Button variant="outline" className="mt-4" asChild>
                    <Link to="/jobs">Browse Jobs</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-jobboard-darkblue">
                    Saved Jobs
                </h2>
                <Badge
                    variant="outline"
                    className="bg-jobboard-light/30 text-jobboard-darkblue"
                >
                    {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'}{' '}
                    saved
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedJobs.map((savedJob: SavedJobWithDetails) => (
                    <Card
                        key={savedJob.id}
                        className="border shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg font-semibold text-jobboard-darkblue">
                                        {savedJob.job.title}
                                    </CardTitle>
                                    <CardDescription>
                                        {savedJob.job.company?.name ||
                                            'Company'}
                                    </CardDescription>
                                </div>
                                {savedJob.job.company?.logo ? (
                                    <img
                                        src={savedJob.job.company.logo}
                                        alt={savedJob.job.company.name}
                                        className="w-10 h-10 rounded-md object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-jobboard-light rounded-md flex items-center justify-center">
                                        <span className="text-jobboard-darkblue font-bold">
                                            {savedJob.job.company?.name
                                                ?.substring(0, 2)
                                                .toUpperCase() || 'CO'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="pb-2">
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                                {savedJob.job.location && (
                                    <span className="flex items-center mr-3">
                                        <CalendarIcon className="mr-1 h-3 w-3" />
                                        Saved{' '}
                                        {formatDistanceToNow(
                                            new Date(savedJob.createdAt),
                                            { addSuffix: true }
                                        )}
                                    </span>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-between pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                                onClick={() =>
                                    handleRemoveSavedJob(
                                        savedJob.id,
                                        savedJob.job.id,
                                        savedJob.job.title
                                    )
                                }
                                disabled={removeSavedJobMutation.isPending}
                            >
                                {removeSavedJobMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                ) : (
                                    <BookmarkX className="h-4 w-4 mr-1" />
                                )}
                                Remove
                            </Button>

                            <Button
                                size="sm"
                                asChild
                                className="bg-jobboard-purple hover:bg-jobboard-purple/90"
                            >
                                <Link to={`/jobs/${savedJob.job.id}`}>
                                    <ExternalLink className="h-4 w-4 mr-1" />
                                    View Job
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default SavedJobs
