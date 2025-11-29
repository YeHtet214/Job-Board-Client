import { useJobsData } from '@/hooks/react-queries/job'
import JobCard from './JobCard'
import { Job } from '@/types/job'
import { History, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const RecentlyViewedJobs = () => {
    const { recentlyViewedJobs } = useJobsData()

    // Ensure recentlyViewedJobs is always an array
    const viewedJobs = Array.isArray(recentlyViewedJobs) ? recentlyViewedJobs : []

    if (viewedJobs.length === 0) {
        return (
            <div className="text-center py-6">
                <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No recently viewed jobs</p>
                <p className="text-gray-400 text-sm">
                    Jobs you view will appear here
                </p>
            </div>
        )
    }

    // Only show up to 4 recently viewed jobs
    const displayJobs = viewedJobs.slice(0, 4)
    const hasMoreJobs = viewedJobs.length > 4

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayJobs.map((job: Job, index: number) => (
                    <JobCard key={`recent-${job.id}-${index}`} job={job} />
                ))}
            </div>

            {hasMoreJobs && (
                <div className="mt-4 text-center">
                    <Link
                        to="/jobs/history"
                        className="inline-flex items-center text-jb-primary hover:text-jb-primary/80 text-sm font-medium"
                    >
                        View all {viewedJobs.length} recently viewed
                        jobs
                        <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                </div>
            )}
        </div>
    )
}

export default RecentlyViewedJobs
