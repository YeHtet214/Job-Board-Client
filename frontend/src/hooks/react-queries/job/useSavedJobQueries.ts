import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import savedJobService from '@/services/saved-job.service'
import { SavedJobWithDetails, JobSavedStatus } from '@/types/saved-job'
import { useToast } from '@/components/ui/use-toast'

// Query keys for saved jobs
export const savedJobKeys = {
   all: ['savedJobs'] as const,
   single: (jobId: string) => ['jobSaved', jobId] as const,
   batch: (ids: string[]) => ['jobsSaved', ids.sort().join(',')] as const,
}

/**
 * Hook to fetch all saved jobs for the current user
 */
export const useSavedJobs = () => {
   const { toast } = useToast()

   return useQuery<SavedJobWithDetails[]>({
      queryKey: savedJobKeys.all,
      queryFn: async () => {
         try {
            return await savedJobService.getSavedJobs()
         } catch (error) {
            console.error('Error fetching saved jobs:', error)
            toast({
               title: 'Error',
               description: 'Failed to load saved jobs',
               variant: 'destructive',
            })
            throw error
         }
      },
   })
}

/**
 * Hook to check if multiple jobs are saved by the current user
 * @param jobIds - Array of job IDs to check
 * @returns Map of job IDs to their saved status
 */
export const useBatchJobSavedStatus = (jobIds: string[] = []) => {
   const uniqueJobIds = [...new Set(jobIds)].filter(Boolean)

   return useQuery<Record<string, JobSavedStatus> | Error>({
      queryKey: savedJobKeys.batch(uniqueJobIds),
      queryFn: async () => {
         try {
            return await savedJobService.areJobsSaved(uniqueJobIds)
         } catch (error) {
            console.error('Error checking saved job status:', error)
            // Return empty object instead of throwing to prevent cascade failures
            return {}
         }
      },
      enabled: uniqueJobIds.length > 0,
   })
}

/**
 * Hook to check if a job is saved by the current user
 * @deprecated Use useBatchJobSavedStatus instead for better performance
 */
export const useIsJobSaved = (jobId: string) => {
   return useQuery<JobSavedStatus>({
      queryKey: savedJobKeys.single(jobId),
      queryFn: async () => {
         try {
            return await savedJobService.isJobSaved(jobId)
         } catch (error) {
            console.error('Error checking job saved status:', error)
            // Return a default "not saved" status instead of throwing
            return { isSaved: false, savedJobId: null }
         }
      },
      enabled: !!jobId,
   })
}

/**
 * Hook to save a job
 */
export const useSaveJob = () => {
   const queryClient = useQueryClient()
   const { toast } = useToast()

   return useMutation({
      mutationFn: async (jobId: string) => {
         try {
            const result = await savedJobService.saveJob(jobId)
            return result
         } catch (error) {
            console.error('Error saving job:', error)
            throw error
         }
      },
      onSuccess: (_, jobId) => {
         queryClient.invalidateQueries({ queryKey: savedJobKeys.all })
         queryClient.invalidateQueries({
            queryKey: savedJobKeys.single(jobId),
         })

         // Invalidate any batch queries that might include this job ID
         queryClient.invalidateQueries({
            predicate: (query) => {
               return (
                  query.queryKey[0] === 'jobsSaved' &&
                  typeof query.queryKey[1] === 'string' &&
                  query.queryKey[1].includes(jobId)
               )
            },
         })

         toast({
            title: 'Job Saved',
            description: 'This job has been added to your saved jobs.',
         })
      },
      onError: (error) => {
         console.error('Error in save job mutation:', error)

         // Show a generic error message to the user
         toast({
            title: 'Error',
            description: 'Failed to save job. Please try again.',
            variant: 'destructive',
         })
      },
   })
}

/**
 * Hook to remove a saved job
 */
export const useRemoveSavedJob = () => {
   const queryClient = useQueryClient()
   const { toast } = useToast()

   return useMutation({
      mutationFn: async ({
         savedJobId,
      }: {
         savedJobId: string
         jobId: string
      }) => savedJobService.removeSavedJob(savedJobId),
      onSuccess: (_, variables) => {
         const { jobId } = variables

         queryClient.invalidateQueries({ queryKey: savedJobKeys.all })
         queryClient.invalidateQueries({
            queryKey: savedJobKeys.single(jobId),
         })

         // Invalidate any batch queries that might include this job ID
         queryClient.invalidateQueries({
            predicate: (query) => {
               return (
                  query.queryKey[0] === 'jobsSaved' &&
                  typeof query.queryKey[1] === 'string' &&
                  query.queryKey[1].includes(jobId)
               )
            },
         })
      },
      onError: (error) => {
         console.error('Error in remove saved job mutation:', error)

         // Show a generic error message to the user
         toast({
            title: 'Error',
            description:
               'Failed to remove job from saved jobs. Please try again.',
            variant: 'destructive',
         })
      },
   })
}
