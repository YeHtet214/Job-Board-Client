import { ApiService } from '@/services/api.service'
import { Job } from '@/types/job'

export interface JobSearchParams {
    keyword?: string
    location?: string
    jobType?: string[]
    experienceLevel?: string
    salaryMin?: number
    salaryMax?: number
    skills?: string[]
    page?: number
    limit?: number
}

class SearchService extends ApiService {
    private endpoints = {
        SEARCH: '/jobs/search',
        SUGGESTED: '/jobs/suggested',
        POPULAR_KEYWORDS: '/jobs/popular-keywords',
    }

    public async searchJobs(
        params: JobSearchParams
    ): Promise<{ jobs: Job[]; total: number; page: number; limit: number }> {
        // Convert params to query string
        const queryParams = new URLSearchParams()

        // Add all non-empty params to query string
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach((item) => queryParams.append(key, item))
                } else {
                    queryParams.append(key, value.toString())
                }
            }
        })

        const queryString = queryParams.toString()
        const url = queryString
            ? `${this.endpoints.SEARCH}?${queryString}`
            : this.endpoints.SEARCH

        const response = await this.get<{
            jobs: Job[]
            total: number
            page: number
            limit: number
        }>(url)
        return response.data.data
    }

    public async getSuggestedJobs(): Promise<Job[]> {
        const response = await this.get<Job[]>(this.endpoints.SUGGESTED)
        return response.data.data
    }

    public async getPopularKeywords(): Promise<string[]> {
        const response = await this.get<string[]>(
            this.endpoints.POPULAR_KEYWORDS
        )
        return response.data.data
    }
}

export default new SearchService()
