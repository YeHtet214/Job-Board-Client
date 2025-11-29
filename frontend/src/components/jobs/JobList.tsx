import JobCard from './JobCard'
import { Job } from '@/types/job'
import { AlertCircle, Search } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import JobSorting from './JobSorting'
import { useAuth } from '@/contexts/authContext'
import { useBatchJobSavedStatus, useJobsData } from '@/hooks/react-queries/job'
import LoadingSpinner from '../ui/LoadingSpinner'

const JobList = () => {
    const {
        jobs,
        isLoading,
        error,
        keyword,
        location,
        jobTypes,
        experienceLevel,
        totalCount
    } = useJobsData()
    const { isAuthenticated, currentUser } = useAuth()

    const isJobSeeker = currentUser?.role === 'JOBSEEKER'
    const jobIds = new Set(jobs.map((job: Job) => job.id))

    // Use the batch hook to check if jobs are saved in a single request
    const { data: savedJobsStatus = {} } = useBatchJobSavedStatus(
        isAuthenticated() && isJobSeeker ? [...jobIds] : []
    )

    console.log("savedJobsStatus: ", savedJobsStatus)

    const hasFilters =
        keyword || location || jobTypes.length > 0 || experienceLevel !== 'ANY'

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner />
            <p className="text-jb-text-muted mt-4">Finding the best jobs for you...</p>
        </div>
    )

    if (error) {
        return (
            <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {error instanceof Error
                        ? error.message
                        : 'An error occurred while fetching jobs'}
                </AlertDescription>
            </Alert>
        )
    }

    if (jobs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-jb-surface-muted rounded-full flex items-center justify-center mb-6">
                    <Search className="h-10 w-10 text-jb-text-muted" />
                </div>

                {hasFilters ? (
                    <>
                        <h3 className="text-xl font-bold text-jb-text mb-2">
                            No matching jobs found
                        </h3>
                        <p className="text-jb-text-muted max-w-md mx-auto">
                            We couldn't find any jobs matching your search
                            criteria. Try adjusting your filters or check back
                            later.
                        </p>
                    </>
                ) : (
                    <>
                        <h3 className="text-xl font-bold text-jb-text mb-2">
                            No jobs available
                        </h3>
                        <p className="text-jb-text-muted max-w-md mx-auto">
                            There are currently no job listings available.
                            Please check back later for new opportunities.
                        </p>
                    </>
                )}
            </div>
        )
    }

    return (
        <div>
            {/* Search results and sorting controls */}
            <div className="mb-8 pb-6 border-b border-jb-border">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* Search results summary */}
                    <div className="text-sm text-jb-text-muted">
                        <span className="font-semibold text-jb-text text-lg mr-1">{totalCount}</span>
                        Job{totalCount !== 1 ? 's' : ''} Found

                        {hasFilters && (
                            <span className="ml-1">
                                {keyword && (
                                    <> for <span className="font-medium text-jb-text">"{keyword}"</span></>
                                )}
                                {location && (
                                    <> in <span className="font-medium text-jb-text">{location}</span></>
                                )}
                            </span>
                        )}
                    </div>

                    <JobSorting />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 mb-8">
                {jobs.map((job: Job) => (
                    <JobCard
                        key={job.id}
                        job={job}
                        savedStatus={
                            savedJobsStatus instanceof Error
                                ? { isSaved: false, savedJobId: null }
                                : savedJobsStatus[job.id]
                                    ? {
                                        isSaved: true,
                                        savedJobId:
                                            savedJobsStatus[job.id].savedJobId,
                                    }
                                    : { isSaved: false, savedJobId: null }
                        }
                    />
                ))}
            </div>
        </div>
    )
}

export default JobList
