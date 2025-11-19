import React, { createContext, useContext, ReactNode } from 'react'
import { Job } from '@/types/job'
import { useSearchParams } from 'react-router-dom'
import { useFetchJobsQuery } from '@/hooks/react-queries/job'

// Use the same interface shape as what's returned from useJobsData
interface JobsContextType {
    jobs: Job[]
    isLoading: boolean
    error: unknown
    currentPage: number
    totalPages: number
    totalCount: number
    recentlyViewedJobs: Job[]
    // Filter states
    keyword: string
    location: string
    jobTypes: string[]
    experienceLevel: string
    // Sort state
    sortBy: SortOption
}

export enum SortOption {
    NEWEST = 'date_desc',
    OLDEST = 'date_asc',
    SALARY_HIGH = 'salary_desc',
    SALARY_LOW = 'salary_asc',
    RELEVANCE = 'relevance', // Default - most relevant to search terms
}

const JobsContext = createContext<JobsContextType | undefined>(undefined)

interface JobsProviderProps {
    children: ReactNode
}

export const JobsProvider: React.FC<JobsProviderProps> = ({ children }) => {
    const [searchParams] = useSearchParams()

    // Initialize the hook with URL parameters
    const jobsData = useFetchJobsQuery({
        keyword: searchParams.get('keyword') || '',
        location: searchParams.get('location') || '',
        jobTypes: searchParams.getAll('jobTypes') || [],
        experienceLevel: searchParams.get('experienceLevel') || 'ANY',
        page: parseInt(searchParams.get('page') || '1', 10),
        sortBy: (searchParams.get('sortBy') as SortOption) || SortOption.NEWEST,
    })

    // The context now simply passes through all the functionality from the hook
    return (
        <JobsContext.Provider value={jobsData}>{children}</JobsContext.Provider>
    )
}

export const useJobsContext = (): JobsContextType => {
    const context = useContext(JobsContext)
    if (context === undefined) {
        throw new Error('useJobsContext must be used within a JobsProvider')
    }
    return context
}
