import { ApiService } from '@/services/api.service';
import { SavedJobWithDetails, JobSavedStatus, SaveJobResponse } from '@/types/saved-job';

/**
 * Service for handling saved job operations
 */
class SavedJobService extends ApiService {
  private endpoints = {
    BASE: '/saved-jobs',
    CHECK: (jobId: string) => `/saved-jobs/check/${jobId}`,
    REMOVE: (savedJobId: string) => `/saved-jobs/${savedJobId}`,
    CHECK_BATCH: '/saved-jobs/check-batch',
  };

  /**
   * Get all saved jobs for the current user
   */
  public async getSavedJobs(): Promise<SavedJobWithDetails[]> {
    try {
      const response = await this.get<SavedJobWithDetails[]>(this.endpoints.BASE);
      return response.data.data;
    } catch (error) {
      console.error('Failed to get saved jobs:', error);
      throw error;
    }
  }

  /**
   * Check if a job is saved by the current user
   * @param jobId - ID of the job to check
   */
  public async isJobSaved(jobId: string): Promise<JobSavedStatus> {
    try {
      const response = await this.get<JobSavedStatus>(this.endpoints.CHECK(jobId));
      return response.data.data;
    } catch (error) {
      console.error(`Failed to check if job ${jobId} is saved:`, error);
      // Return default "not saved" status rather than throwing
      return { isSaved: false, savedJobId: null };
    }
  }

  /**
   * Check if multiple jobs are saved by the current user in a single request
   * @param jobIds - Array of job IDs to check
   * @returns Map of job IDs to their saved status
   */
  public async areJobsSaved(jobIds: string[]): Promise<Record<string, JobSavedStatus> | Error> {
    if (!jobIds.length) return {};

    try {
      const response = await this.post<Record<string, JobSavedStatus>>(
        this.endpoints.CHECK_BATCH,
        { jobIds }
      );
      return response.data.data;

    } catch (error: any) {
      console.error(`Failed to check if job saved:`, error);
      return error;
    }
  }


  /**
   * Save a job for the current user
   * @param jobId - ID of the job to save
   */
  public async saveJob(jobId: string): Promise<SaveJobResponse> {
    const response = await this.post<SaveJobResponse>(this.endpoints.BASE, { jobId });
    return response.data.data;
  }

  /**
   * Remove a saved job for the current user
   * @param savedJobId - ID of the saved job entry to remove
   */
  public async removeSavedJob(savedJobId: string): Promise<void> {
    await this.delete<void>(this.endpoints.REMOVE(savedJobId));
  }
}

export default new SavedJobService();
