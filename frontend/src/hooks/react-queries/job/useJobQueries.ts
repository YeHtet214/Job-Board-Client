import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import jobService from '@/services/job.service'
import type {
   CreateJobDto,
   UpdateJobDto,
   JobFilterType,
} from '@/types/job'
import { useMemo } from 'react'
import { SortOption } from '@/contexts/JobsContext'

// Query keys
export const jobKeys = {
   all: ['jobs'] as const,
   lists: () => [...jobKeys.all, 'list'] as const,
   list: (filters: Record<string, any>) =>
      [...jobKeys.lists(), { filters }] as const,
   details: () => [...jobKeys.all, 'detail'] as const,
   detail: (id: string) => [...jobKeys.details(), id] as const,
   company: (companyId: string) =>
      [...jobKeys.all, 'company', companyId] as const,
   search: (filters: Record<string, any>) =>
      [...jobKeys.all, 'search', { filters }] as const,
}

// Function to normalize filters for stable query keys
const normalizeFilters = (filters: JobFilterType): JobFilterType | {} => {
   const normalized: JobFilterType | Record<string, string | number | string[] > = {}

   // Only include defined values in the query key
   if (filters.keyword && filters.keyword.trim()) {
      normalized.keyword = filters.keyword.trim()
   }
   if (filters.location && filters.location.trim()) {
      normalized.location = filters.location.trim()
   }
   if (filters.jobTypes && filters.jobTypes.length > 0) {
      normalized.jobTypes = [...filters.jobTypes].sort()
   }
   if (filters.experienceLevel && filters.experienceLevel !== 'ANY') {
      normalized.experienceLevel = filters.experienceLevel
   }
   if (filters.page && filters.page > 1) {
      normalized.page = filters.page
   }
   if (filters.limit) {
      normalized.limit = filters.limit
   }
   if (filters.sortBy && filters.sortBy !== SortOption.NEWEST) {
      normalized.sortBy = filters.sortBy
   }

   return normalized
}

export const useFetchJobsQuery = (filters: JobFilterType, isSearch = false) => {
   // Memoize normalized filters to prevent unnecessary re-renders
   const normalizedFilters = useMemo(() => normalizeFilters(filters) as JobFilterType, [filters])

   const queryKey = isSearch
      ? jobKeys.search(normalizedFilters)
      : jobKeys.list(normalizedFilters)

   return useQuery({
      queryKey,
      queryFn: () => jobService.getAllJobs(normalizedFilters),
      staleTime: 1000 * 60 * 2, // stale time
      gcTime: 1000 * 60 * 10, // cache time
   })
}

export const useJob = (id: string) => {
   return useQuery({
      queryKey: jobKeys.detail(id),
      queryFn: async () => {
         try {
            return await jobService.getJobById(id)
         } catch (error) {
            console.log('Error fetching job with id: ', id)
            return null
         }
      },
      enabled: !!id, // Only run the query if we have an ID
      staleTime: 1000 * 60 * 5, // 5 minutes
   })
}

export const useCompanyJobs = (companyId: string) => {
   return useQuery({
      queryKey: jobKeys.company(companyId),
      queryFn: async () => {
         return await jobService.getJobsByCompany(companyId)
      },
      enabled: !!companyId, // Only run the query if we have a company ID
      staleTime: 1000 * 60 * 5, // 5 minutes
   })
}

// Mutations
export const useCreateJob = () => {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: (newJob: CreateJobDto) => {
         return jobService.createJob(newJob)
      },
      onSuccess: () => {
         // Invalidate and refetch jobs list
         queryClient.invalidateQueries({ queryKey: jobKeys.lists() })
      },
   })
}

export const useUpdateJob = () => {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: ({ id, job }: { id: string; job: UpdateJobDto }) => {
         return jobService.updateJob(id, job)
      },
      onSuccess: (_, variables) => {
         // Invalidate and refetch the specific job and the jobs list
         queryClient.invalidateQueries({
            queryKey: jobKeys.detail(variables.id),
         })
         queryClient.invalidateQueries({ queryKey: jobKeys.lists() })
      },
   })
}

export const useDeleteJob = () => {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: (id: string) => {
         return jobService.deleteJob(id)
      },
      onSuccess: (_, id) => {
         // Invalidate and refetch the jobs list
         queryClient.invalidateQueries({ queryKey: jobKeys.lists() })
         // Remove the job from the cache
         queryClient.removeQueries({ queryKey: jobKeys.detail(id) })
      },
   })
}
