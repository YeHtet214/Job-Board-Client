import React, { createContext, useContext, ReactNode } from 'react'
import { Job } from '@/types/job'
import { useSearchParams } from 'react-router-dom'
import { useJobsData } from '@/hooks/react-queries/job'

// Define sorting options with enum for type safety
export enum SortOption {
    NEWEST = 'date_desc',
    OLDEST = 'date_asc',
    SALARY_HIGH = 'salary_desc',
    SALARY_LOW = 'salary_asc',
    RELEVANCE = 'relevance', // Default - most relevant to search terms
}

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

const JobsContext = createContext<JobsContextType | undefined>(undefined)

interface JobsProviderProps {
    children: ReactNode
}

export const JobsProvider: React.FC<JobsProviderProps> = ({ children }) => {
    const [searchParams] = useSearchParams()

    // Initialize the hook with URL parameters
    const jobsData = useJobsData({
        initialKeyword: searchParams.get('keyword') || '',
        initialLocation: searchParams.get('location') || '',
        initialJobTypes: searchParams.getAll('jobTypes') || [],
        initialExperienceLevel: searchParams.get('experienceLevel') || 'ANY',
        initialPage: parseInt(searchParams.get('page') || '1', 10),
        initialSortBy:
            (searchParams.get('sortBy') as SortOption) || SortOption.NEWEST,
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
