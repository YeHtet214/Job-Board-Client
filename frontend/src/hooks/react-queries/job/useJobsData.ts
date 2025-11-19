import { useState, useEffect, useCallback, useMemo } from 'react'
import { Job, JobFilterType } from '@/types/job'
import { useFetchJobsQuery } from './useJobQueries'
import { SortOption } from '@/contexts/JobsContext'
import { useSearchParams } from 'react-router-dom'

interface UseJobsDataReturn {
    jobs: Job[]
    isLoading: boolean
    error: unknown
    currentPage: number
    recentlyViewedJobs: Job[]
    keyword: string
    location: string
    jobTypes: string[]
    experienceLevel: string
    sortBy: SortOption
    setSortBy: (option: SortOption) => void
    handleSearch: (values: JobFilterType) => void
    handleJobView: (job: Job) => void
    handlePageChange: (page: number) => void
    updateSearchParams: (values: JobFilterType) => void
    resetFilters: () => void
    refetch: () => void
}

/**
 * This hook handles all job search state, actions, and data fetching
 */
export const useJobsData = (page = 1): UseJobsDataReturn => {
    const [searchParams, setSearchParams] = useSearchParams()
    const keyword = searchParams.get('keyword') || ''
    const location = searchParams.get('location') || ''
    const experienceLevel = searchParams.get('experience') || 'ANY'
    const jobTypes = searchParams.get('types')?.split(',') || []
    const [currentPage, setCurrentPage] = useState<number>(page)
    const [sortBy, setSortBy] = useState<SortOption>(SortOption.NEWEST)
    const [recentlyViewedJobs, setRecentlyViewedJobs] = useState<Job[]>([])

    const ITEMS_PER_PAGE = 10
    
    const filters = useMemo(
        () => ({
            keyword: searchParams.get('keyword') || '',
            location: searchParams.get('location') || '',
            jobTypes: searchParams.get('types')?.split(',') || [],
            experienceLevel: searchParams.get('experience') || 'ANY',
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            sortBy,
        }),
        [searchParams, currentPage, sortBy]
    )

    const { data, isLoading, error, refetch } = useFetchJobsQuery(filters, true)

    useEffect(() => console.log("Job fetch return data: ", data), [data])

    // Memoize refetch to prevent useEffect from running unnecessarily
    const stableRefetch = useCallback(() => {
        refetch()
    }, [refetch])

    // Extract values from the response
    const jobs: Job[] = data?.jobs || []
    console.log(data?.meta)

    const updateSearchParams = (values: JobFilterType) => {
        if (!values) return
        const params: Record<string, string> = {}

        if (values.keyword) params.keyword = values.keyword as string
        if (values.location) params.location = values.location as string
        if (values.experienceLevel && values.experienceLevel !== 'ANY') {
            params.experience = values.experienceLevel as string
        }
        if (values.jobTypes.length > 0) {
            params.types = (values.jobTypes as string[]).join(',')
        }

        setSearchParams(params)
    }

    // Load recently viewed jobs from localStorage
    useEffect(() => {
        const recentlyViewed = localStorage.getItem('recentlyViewedJobs')
        if (recentlyViewed) {
            try {
                const parsed = JSON.parse(recentlyViewed)
                setRecentlyViewedJobs(Array.isArray(parsed) ? parsed : [])
            } catch (e) {
                console.error('Error parsing recently viewed jobs:', e)
                setRecentlyViewedJobs([])
            }
        }
    }, [])

    const handleSearch = (values: JobFilterType) => {
        updateSearchParams(values)
    }

    const handleJobView = useCallback((job: Job) => {
        setRecentlyViewedJobs((prev) => {
            const updatedRecentlyViewed = [
                job,
                ...prev.filter((j) => j.id !== job.id),
            ].slice(0, 4)
            localStorage.setItem(
                'recentlyViewedJobs',
                JSON.stringify(updatedRecentlyViewed)
            )
            return updatedRecentlyViewed
        })
    }, [])

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page)
        // React Query will automatically refetch when the page changes
        window.scrollTo(0, 0)
    }, [])

    const resetFilters = useCallback(() => {
        setSortBy(SortOption.NEWEST)
        setCurrentPage(1)
        setSearchParams('')
    }, [searchParams])

    return {
        jobs,
        isLoading,
        error,
        currentPage,
        recentlyViewedJobs,
        keyword,
        location,
        jobTypes,
        experienceLevel,
        sortBy,
        setSortBy,
        handleSearch,
        handleJobView,
        handlePageChange,
        resetFilters,
        updateSearchParams,
        refetch: stableRefetch,
    }
}
