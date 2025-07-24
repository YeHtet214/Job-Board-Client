import React from 'react';
import JobCard from './JobCard';
import Pagination from './Pagination';
import { Job } from '@/types/job.types';
import { AlertCircle, Search } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import JobSorting from './JobSorting';
import { useAuth } from '@/contexts/authContext';
import { useBatchJobSavedStatus, useJobsData } from '@/hooks/react-queries/job';

const JobList: React.FC = () => {
  const { jobs, isLoading, error, keyword, location, jobTypes, experienceLevel, totalCount } = useJobsData();
  const { isAuthenticated, currentUser } = useAuth();

  console.log("JObs in list: ",jobs);

  // Check if user is a job seeker for saved job functionality
  const isJobSeeker = currentUser?.role === 'JOBSEEKER';
  
  // Get all job IDs for batch checking saved status
  const jobIds = new Set(jobs.map((job: Job) => job.id));
  
  // Use the batch hook to check if jobs are saved in a single request
  const { data: savedJobsStatus = {} } = useBatchJobSavedStatus(
    isAuthenticated && isJobSeeker ? [...jobIds] : []
  )

  // Check if any filters are applied
  const hasFilters = keyword || location || jobTypes.length > 0 || experienceLevel !== 'ANY';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-jobboard-purple"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : 'An error occurred while fetching jobs'}
        </AlertDescription>
      </Alert>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-jb-surface rounded-lg shadow-md p-6 text-center">
        {hasFilters ? (
          <>
            <div className="flex justify-center mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No matching jobs found</h3>
            <p className="text-gray-600">
              We couldn't find any jobs matching your search criteria. Try adjusting your filters or check back later.
            </p>
          </>
        ) : (
          <>
            <h3 className="text-3xl font-semibold mb-2">No jobs available</h3>
            <p className="text-jb-text-muted">Check back later for new opportunities.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Search results and sorting controls */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          {/* Search results summary */}
          <div className="text-sm text-gray-600">
            {hasFilters && (
              <p>
                Found <span className="font-semibold">{totalCount}</span> job{totalCount !== 1 ? 's' : ''} matching your search
                {keyword && <span> for <span className="font-semibold">"{keyword}"</span></span>}
                {location && <span> in <span className="font-semibold">{location}</span></span>}
              </p>
            )}
          </div>
          
          {/* Sorting controls */}
          <JobSorting />
        </div>
      </div>

      {/* Job listings - Responsive Grid Layout with !important */}
      <div className="grid grid-cols-1 lg:!grid-cols-2 gap-4 mb-8">
        {jobs.map((job: Job) => (
          <JobCard 
            key={job.id} 
            job={job}
            savedStatus={(savedJobsStatus instanceof Error) ? { isSaved: false, savedJobId: null } : (savedJobsStatus[job.id]) ? { isSaved: true, savedJobId: savedJobsStatus[job.id].savedJobId } : { isSaved: false, savedJobId: null } }
          />
        ))}
      </div>

      {/* Pagination */}
      <Pagination />
    </div>
  );
};

export default JobList;