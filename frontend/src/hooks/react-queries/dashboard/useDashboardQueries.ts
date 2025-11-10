import {
    useQuery,
    useMutation,
    useQueryClient,
    UseQueryOptions,
} from '@tanstack/react-query'
import DashboardService from '@/services/dashboard.service'
import JobService from '@/services/job.service'
import {
    JobSeekerDashboardData,
    EmployerDashboardData,
} from '@/types/dashboard'
import { UpdateApplicationDto, Application } from '@/types/application'
import ApplicationService from '@/services/application.service'

// Query keys
export const dashboardKeys = {
    all: ['dashboard'] as const,
    jobseeker: ['dashboard', 'jobseeker'] as const,
    employer: ['dashboard', 'employer'] as const,
    applications: ['dashboard', 'applications'] as const,
    postedJobs: ['dashboard', 'postedJobs'] as const,
    receivedApplications: ['dashboard', 'receivedApplications'] as const,
    application: (id: string) => ['dashboard', 'application', id] as const,
    companyProfile: ['dashboard', 'companyProfile'] as const,
}

// Job seeker dashboard queries
export const useJobSeekerDashboard = (
    options?: Omit<
        UseQueryOptions<JobSeekerDashboardData, Error>,
        'queryKey' | 'queryFn'
    >
) => {
    return useQuery<JobSeekerDashboardData, Error>({
        queryKey: dashboardKeys.jobseeker,
        queryFn: async () => {
            try {
                return await DashboardService.getJobSeekerDashboardData()
            } catch (error) {
                console.error(
                    'Error fetching job seeker dashboard data:',
                    error
                )
                throw error
            }
        },
        ...options,
    })
}

export const useWithdrawApplication = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => ApplicationService.withdrawApplication(id),
        onSuccess: () => {
            // Invalidate job seeker dashboard and applications queries
            queryClient.invalidateQueries({ queryKey: dashboardKeys.jobseeker })
            queryClient.invalidateQueries({
                queryKey: dashboardKeys.applications,
            })
        },
    })
}

// Employer dashboard queries
export const useEmployerDashboard = (
    options?: Omit<
        UseQueryOptions<EmployerDashboardData, Error>,
        'queryKey' | 'queryFn'
    >
) => {
    return useQuery<EmployerDashboardData, Error>({
        queryKey: dashboardKeys.employer,
        queryFn: async () => {
            try {
                return await DashboardService.getEmployerDashboardData()
            } catch (error) {
                console.error('Error fetching employer dashboard data:', error)
                throw error
            }
        },
        retry: 2,
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    })
}

export const useUpdateApplicationStatus = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            statusData,
        }: {
            id: string
            statusData: UpdateApplicationDto
        }) => ApplicationService.updateApplication(id, statusData),
        onSuccess: (updatedApplication: Application) => {
            // Invalidate employer dashboard and specific application
            queryClient.invalidateQueries({ queryKey: dashboardKeys.employer })
            queryClient.invalidateQueries({
                queryKey: dashboardKeys.receivedApplications,
            })
            queryClient.invalidateQueries({
                queryKey: dashboardKeys.application(updatedApplication.id),
            })
        },
    })
}

export const useDeletePostedJob = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => JobService.deleteJob(id),
        onSuccess: () => {
            // Invalidate employer dashboard and posted jobs queries
            queryClient.invalidateQueries({ queryKey: dashboardKeys.employer })
            queryClient.invalidateQueries({
                queryKey: dashboardKeys.postedJobs,
            })
        },
    })
}

export const useCompanyProfileCompletion = () => {
    return useQuery({
        queryKey: dashboardKeys.companyProfile,
        queryFn: async () => {
            try {
                return await DashboardService.getCompanyProfileCompletion()
            } catch (error) {
                console.error(
                    'Error fetching company profile completion:',
                    error
                )
                return { complete: false, percentage: 0 }
            }
        },
    })
}
