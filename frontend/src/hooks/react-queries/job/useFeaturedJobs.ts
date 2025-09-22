import { useQuery } from '@tanstack/react-query';
import jobService from '@/services/job.service';
import { SortOption } from '@/contexts/JobsContext';
import { JobsResponse } from '@/types/job';

/**
 * Custom hook to fetch featured jobs (latest 6 jobs)
 */
const useFeaturedJobs = () => {
  return useQuery<JobsResponse>({
    queryKey: ['featuredJobs'],
    queryFn: async () => {
      try {
        // Fetch the latest 6 jobs sorted by newest first
        return await jobService.getAllJobs({
          sortBy: SortOption.NEWEST,
          limit: 6,
          page: 1
        });
      } catch (error) {
        console.error('Error fetching featured jobs:', error);
        return { jobs: [], totalPages: 0, totalCount: 0, currentPage: 1 };
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export default useFeaturedJobs;
