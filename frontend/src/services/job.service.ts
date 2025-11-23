import { ApiService } from '@/services/api.service'
import {
   Job,
   CreateJobDto,
   UpdateJobDto,
   JobsResponse,
   JobFilterType,
} from '@/types/job'
class JobService extends ApiService {
   private endpoints = {
      ALL: '/jobs',
      COMPANY_JOBS: '/jobs/company',
      DETAIL: (id: string) => `/jobs/${id}`,
      SEARCH: '/jobs/search',
      COMPANY: (companyId: string) => `/jobs/company/${companyId}`,
      SUGGESTIONS: '/jobs/suggestions',
   }

   public async getAllJobs(params: JobFilterType) {
      const queryParams = this.createQueryParams(params)
      const url = `${this.endpoints.ALL}?${queryParams.toString()}`
      const response = await this.get<JobsResponse>(url)

      if (!response.data.success) {
         throw new Error('Failed to fetch companies')
      }

      return {
         jobs: response.data.data,
         meta: {
            currentPage: response.data.meta?.currentPage,
            totalCount: response.data.meta?.totalCount,
            totalPages: response.data.meta?.totalPages,
         },
      }
   }

   public async getJobById(id: string) {
      const response = await this.get<Job>(this.endpoints.DETAIL(id))

      if (!response.data.success) {
         throw new Error('Failed to fetch job')
      }

      return response.data.data
   }

   public async getCompanyJobs(params?: JobFilterType): Promise<JobsResponse> {
      const queryParams = this.createQueryParams(params || {})
      const url = `${this.endpoints.COMPANY_JOBS}?${queryParams.toString()}`
      const response = await this.get<JobsResponse>(url)
      return response.data.data
   }

   public async getJobsByCompany(
      companyId: string,
      params?: JobFilterType
   ): Promise<JobsResponse> {
      const queryParams = this.createQueryParams(params || {})
      const url = `${this.endpoints.COMPANY(companyId)}?${queryParams.toString()}`
      const response = await this.get<JobsResponse>(url)
      return response.data.data
   }

   public async createJob(job: CreateJobDto): Promise<Job> {
      const response = await this.post<Job>(this.endpoints.ALL, job)
      return response.data.data
   }

   public async updateJob(id: string, job: UpdateJobDto): Promise<Job> {
      const response = await this.put<Job>(this.endpoints.DETAIL(id), job)
      return response.data.data
   }

   public async deleteJob(id: string): Promise<void> {
      await this.delete<void>(this.endpoints.DETAIL(id))
   }

   /**
    * Fetches search suggestions based on the partial search term
    * @param term The partial search term to get suggestions for
    * @param type The type of suggestions to get ('keyword', 'location', or 'all')
    * @param limit Maximum number of suggestions to return
    * @returns Array of suggestion strings
    */
   public async getSearchSuggestions(
      term: string,
      type: 'keyword' | 'location' | 'all' = 'all',
      limit: number = 5
   ): Promise<string[]> {
      if (!term || term.trim().length < 2) return []

      const params = new URLSearchParams()
      params.append('term', term)
      params.append('type', type)
      params.append('limit', limit.toString())

      try {
         const url = `${this.endpoints.SUGGESTIONS}?${params.toString()}`
         // Using any for the get request to bypass TypeScript's strict checking
         const response = await this.get<any>(url)
         // Ensure we return a string array, even if the API doesn't match our expected format
         return Array.isArray(response?.data?.data) ? response.data.data : []
      } catch (error) {
         console.error('Error fetching search suggestions:', error)
         return []
      }
   }

   private createQueryParams(params: JobFilterType): URLSearchParams {
      const queryParams = new URLSearchParams()

      if (params && Object.keys(params).length > 0) {
         for (const [key, value] of Object.entries(params)) {
            if (key === 'jobTypes' && Array.isArray(value)) {
               value.forEach((type) => queryParams.append('jobTypes', type))
            } else {
               if (value !== undefined && value !== null && value !== '')
                  queryParams.append(key, String(value))
            }
         }
      }

      return queryParams
   }
}

export default new JobService()
