import { ApiService } from '@/services/api.service'
import {
    JobSeekerDashboardData,
    EmployerDashboardData,
    JobApplication,
    PostedJob,
    ReceivedApplication,
    EmployerActivity,
} from '@/types/dashboard'

class DashboardService extends ApiService {
    private endpoints = {
        JOBSEEKER_DASHBOARD: '/dashboard/jobseeker',
        EMPLOYER_DASHBOARD: '/dashboard/employer',
        JOBSEEKER_APPLICATIONS: '/dashboard/jobseeker/applications',
        JOBSEEKER_SAVED_JOBS: '/dashboard/jobseeker/saved-jobs',
        EMPLOYER_POSTED_JOBS: '/dashboard/employer/jobs',
        EMPLOYER_APPLICATIONS: '/dashboard/employer/applications',
        EMPLOYER_ACTIVITY: '/dashboard/employer/activity',
        APPLICATION_DETAIL: (id: string) => `/dashboard/applications/${id}`,
        COMPANY_PROFILE_COMPLETION: '/dashboard/employer/profile-completion',
    }

    // Job seeker dashboard methods
    public async getJobSeekerDashboardData() {
        const response = await this.get<JobSeekerDashboardData>(
            this.endpoints.JOBSEEKER_DASHBOARD
        )

        if (!response.data.success) {
            throw new Error(response.data.message)
        }

        return response.data.data
    }

    public async getJobSeekerApplications(): Promise<JobApplication[]> {
        const response = await this.get<JobApplication[]>(
            this.endpoints.JOBSEEKER_APPLICATIONS
        )
        return response.data.data
    }

    // Employer dashboard methods
    public async getEmployerDashboardData(): Promise<EmployerDashboardData> {
        const response = await this.get<EmployerDashboardData>(
            this.endpoints.EMPLOYER_DASHBOARD
        )
        return response.data.data
    }

    public async getEmployerPostedJobs(): Promise<PostedJob[]> {
        const response = await this.get<PostedJob[]>(
            this.endpoints.EMPLOYER_POSTED_JOBS
        )
        return response.data.data
    }

    public async getEmployerApplications(): Promise<ReceivedApplication[]> {
        const response = await this.get<ReceivedApplication[]>(
            this.endpoints.EMPLOYER_APPLICATIONS
        )
        return response.data.data
    }

    public async getEmployerActivity(): Promise<EmployerActivity[]> {
        const response = await this.get<EmployerActivity[]>(
            this.endpoints.EMPLOYER_ACTIVITY
        )
        return response.data.data
    }

    public async getCompanyProfileCompletion(): Promise<{
        complete: boolean
        percentage: number
    }> {
        const response = await this.get<{
            complete: boolean
            percentage: number
        }>(this.endpoints.COMPANY_PROFILE_COMPLETION)
        return response.data.data
    }
}

export default new DashboardService()
