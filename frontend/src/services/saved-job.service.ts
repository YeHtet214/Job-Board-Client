import { ApiService } from '@/services/api.service'
import {
    SavedJobWithDetails,
    JobSavedStatus,
    SaveJobResponse,
} from '@/types/saved-job'

class SavedJobService extends ApiService {
    private endpoints = {
        BASE: '/saved-jobs',
        CHECK: (jobId: string) => `/saved-jobs/check/${jobId}`,
        REMOVE: (savedJobId: string) => `/saved-jobs/${savedJobId}`,
        CHECK_BATCH: '/saved-jobs/check-batch',
    }

    public async getSavedJobs(): Promise<SavedJobWithDetails[]> {
        try {
            const response = await this.get<SavedJobWithDetails[]>(
                this.endpoints.BASE
            )
            return response.data.data
        } catch (error) {
            console.error('Failed to get saved jobs:', error)
            throw error
        }
    }

    public async isJobSaved(jobId: string): Promise<JobSavedStatus> {
        try {
            const response = await this.get<JobSavedStatus>(
                this.endpoints.CHECK(jobId)
            )

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            return response.data.data
        } catch (error) {
            console.error(`Failed to check if job ${jobId} is saved:`, error)
            return { isSaved: false, savedJobId: null }
        }
    }

    /**
     * Check if multiple jobs are saved by the current user in a single request
     */
    public async areJobsSaved(
        jobIds: string[]
    ): Promise<Record<string, JobSavedStatus> | Error> {
        if (!jobIds.length) return {}

        try {
            const response = await this.post<Record<string, JobSavedStatus>>(
                this.endpoints.CHECK_BATCH,
                { jobIds }
            )

            console.log("areJobsSaved", response.data)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            return response.data.data
        } catch (error: any) {
            console.error(`Failed to check if job saved:`, error)
            return {}
        }
    }

    public async saveJob(jobId: string): Promise<SaveJobResponse> {
        const response = await this.post<SaveJobResponse>(this.endpoints.BASE, {
            jobId,
        })
        return response.data.data
    }

    public async removeSavedJob(savedJobId: string): Promise<void> {
        await this.delete<void>(this.endpoints.REMOVE(savedJobId))
    }
}

export default new SavedJobService()
