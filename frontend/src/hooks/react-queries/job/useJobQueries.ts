import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import jobService, { JobSearchParams } from '@/services/job.service'
import type { CreateJobDto, UpdateJobDto, JobsResponse } from '@/types/job'
import { SortOption } from '@/contexts/JobsContext'
import { useMemo } from 'react'

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

interface JobsSearchParams {
    keyword?: string
    location?: string
    jobTypes?: string[]
    experienceLevel?: string
    page?: number
    limit?: number
    sortBy?: SortOption
    [key: string]: any // Allow additional filter parameters
}

// 🔧 FIX: Helper function to normalize filters for stable query keys
const normalizeFilters = (filters: JobsSearchParams): Record<string, any> => {
    const normalized: Record<string, any> = {}

    // Only include defined values in the query key
    if (filters.keyword && filters.keyword.trim()) {
        normalized.keyword = filters.keyword.trim()
    }
    if (filters.location && filters.location.trim()) {
        normalized.location = filters.location.trim()
    }
    if (filters.jobTypes && filters.jobTypes.length > 0) {
        // Sort job types for consistent query keys
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

/**
 * Hook for fetching jobs with flexible filtering options
 *
 * @param filters - Search parameters for jobs
 * @param isSearch - Whether this is a search query
 * @returns Query result with jobs data
 */
export const useJobs = (filters: JobsSearchParams = {}, isSearch = false) => {
    // 🔧 FIX: Memoize normalized filters to prevent unnecessary re-renders
    const normalizedFilters = useMemo(
        () => normalizeFilters(filters),
        [
            filters.keyword,
            filters.location,
            filters.jobTypes,
            filters.experienceLevel,
            filters.page,
            filters.limit,
            filters.sortBy,
        ]
    )

    // console.log('Filters: ', filters);
    // console.log('Normailzed Filters: ', normalizeFilters(filters));

    const queryKey = isSearch
        ? jobKeys.search(normalizedFilters)
        : jobKeys.list(normalizedFilters)

    // 🔧 FIX: Memoize search params to prevent recreation on every render
    const searchParams = useMemo((): JobSearchParams => {
        const params: JobSearchParams = {}

        if (filters.keyword !== undefined && filters.keyword.trim()) {
            params.keyword = filters.keyword.trim()
        }
        if (filters.location !== undefined && filters.location.trim()) {
            params.location = filters.location.trim()
        }
        if (filters.jobTypes?.length) {
            params.jobTypes = filters.jobTypes
        }
        if (filters.experienceLevel && filters.experienceLevel !== 'ANY') {
            params.experienceLevel = filters.experienceLevel
        }
        if (filters.page !== undefined) {
            params.page = filters.page
        }
        if (filters.limit !== undefined) {
            params.limit = filters.limit
        }
        if (filters.sortBy !== undefined) {
            params.sortBy = filters.sortBy
        }

        return params
    }, [
        filters.keyword,
        filters.location,
        filters.jobTypes,
        filters.experienceLevel,
        filters.page,
        filters.limit,
        filters.sortBy,
    ])

    return useQuery<JobsResponse>({
        queryKey,
        queryFn: async () => {
            try {
                const result = await jobService.getAllJobs(searchParams)
                return result
            } catch (error) {
                console.error('Failed to fetch jobs:', error)
                return {
                    jobs: [],
                    totalPages: 0,
                    totalCount: 0,
                    currentPage: 1,
                } // Return empty data on error
            }
        },
        // 🔧 FIX: Add stale time to prevent excessive refetches
        staleTime: 1000 * 60 * 2, // 2 minutes
        // 🔧 FIX: Add cache time
        gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    })
}

export const useJob = (id: string) => {
    return useQuery({
        queryKey: jobKeys.detail(id),
        queryFn: async () => {
            try {
                const job = await jobService.getJobById(id)
                return job || null
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
