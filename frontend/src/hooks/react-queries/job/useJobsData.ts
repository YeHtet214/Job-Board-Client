import { useState, useEffect, useCallback, useMemo } from 'react'
import { Job, JobFilterType } from '@/types/job'
import { useFetchJobsQuery } from './useJobQueries'
import { useSearchParams } from 'react-router-dom'
import { SortOption } from '@/lib/constants/jobs'

interface UseJobsDataReturn {
   jobs: Job[]
   isLoading: boolean
   error: unknown
   recentlyViewedJobs: Job[]
   keyword: string
   location: string
   jobTypes: string[]
   experienceLevel: string
   sortBy: SortOption
   currentPage: number
   totalPages: number
   totalCount: number
   updateSorting: (option: SortOption) => void
   handleSearch: (values: JobFilterType) => void
   handleJobView: (job: Job, isClearing: boolean) => void
   handlePageChange: (page: number) => void
   updateSearchParams: (values: JobFilterType) => void
   resetFilters: () => void
   refetch: () => void
}

/**
 * This hook handles all job search state, actions, and data fetching
 */
export const useJobsData = (
   page = 1,
   isFiltering = false
): UseJobsDataReturn => {
   const [searchParams, setSearchParams] = useSearchParams()
   const keyword = searchParams.get('keyword') || ''
   const location = searchParams.get('location') || ''
   const experienceLevel = searchParams.get('experience') || 'Any'
   const jobTypes = searchParams.get('types')?.split(',') || []
   const sortBy = (searchParams.get('sort') as SortOption) || ''
   const currentPage = Number(searchParams.get('page')) || page || 1
   const [recentlyViewedJobs, setRecentlyViewedJobs] = useState<Job[]>([])

   const ITEMS_PER_PAGE = 10

   const filters = useMemo(
      () => ({
         keyword,
         location,
         jobTypes,
         experienceLevel,
         page: currentPage,
         limit: ITEMS_PER_PAGE,
         sortBy,
      }),
      [keyword, location, jobTypes, experienceLevel, sortBy, currentPage]
   )

   const { data, isLoading, error, refetch } = useFetchJobsQuery(
      filters,
      isFiltering
   )

   const jobs = (data && Array.isArray(data?.jobs) ? data.jobs : []) as Job[]
   const { totalPages = 0, totalCount = 0 } = data?.meta || {}

   // Memoize refetch to prevent useEffect from running unnecessarily
   const stableRefetch = useCallback(() => {
      refetch()
   }, [refetch])

   const updateSearchParams = (values: JobFilterType) => {
      if (!values) return
      const params: Record<string, string> = {}

      if (values.keyword) params.keyword = values.keyword as string
      if (values.location) params.location = values.location as string
      if (values.experienceLevel && values.experienceLevel !== 'Any') {
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

   const handleJobView = useCallback((job: Job, isClearing = false) => {
      if (isClearing) {
         localStorage.removeItem('recentlyViewedJobs')
         setRecentlyViewedJobs([])
         return
      } 

      setRecentlyViewedJobs((prev) => {
         const updatedRecentlyViewed = [
            job,
            ...prev.filter((j) => j.id !== job.id),
         ]
         localStorage.setItem(
            'recentlyViewedJobs',
            JSON.stringify(updatedRecentlyViewed)
         )
         return updatedRecentlyViewed
      })
   }, [])

   const handlePageChange = useCallback((page: number) => {
      setSearchParams((prev) => {
         const newParams = new URLSearchParams(prev)
         newParams.set('page', page.toString())
         return newParams
      })
      // React Query will automatically refetch when the page changes
      window.scrollTo(0, 0)
   }, [currentPage])

   const updateSorting = (option: SortOption) => {
      setSearchParams((prev) => {
         const newParams = new URLSearchParams(prev)
         newParams.set('sort', option)
         return newParams
      })
   }

   const resetFilters = useCallback(
      () => setSearchParams(''),
      [setSearchParams]
   )

   return {
      jobs,
      isLoading,
      error,
      recentlyViewedJobs,
      keyword,
      location,
      jobTypes,
      experienceLevel,
      sortBy,
      currentPage,
      totalPages,
      totalCount,
      updateSorting,
      handleSearch,
      handleJobView,
      handlePageChange,
      resetFilters,
      updateSearchParams,
      refetch: stableRefetch,
   }
}
