import {
    useQuery,
    useMutation,
    useQueryClient,
    UseQueryOptions,
} from "@tanstack/react-query"
import DashboardService from "@/services/dashboard.service"
import JobService from "@/services/job.service"
import {
    JobSeekerDashboardData,
    EmployerDashboardData,
} from "@/types/dashboard"
import { UpdateApplicationDto, Application } from "@/types/application"
import ApplicationService from "@/services/application.service"

// Query keys
export const dashboardKeys = {
    all: ["dashboard"] as const,
    jobseeker: ["dashboard", "jobseeker"] as const,
    employer: ["dashboard", "employer"] as const,
    applications: ["dashboard", "applications"] as const,
    postedJobs: ["dashboard", "postedJobs"] as const,
    receivedApplications: ["dashboard", "receivedApplications"] as const,
    application: (id: string) => ["dashboard", "application", id] as const,
    companyProfile: ["dashboard", "companyProfile"] as const,
}

// Job seeker dashboard queries
export const useJobSeekerDashboard = (
    options?: Omit<
        UseQueryOptions<JobSeekerDashboardData, Error>,
        "queryKey" | "queryFn"
    >
) => {
    return useQuery<JobSeekerDashboardData, Error>({
        queryKey: dashboardKeys.jobseeker,
        queryFn: async () => {
            try {
                return await DashboardService.getJobSeekerDashboardData()
            } catch (error) {
                console.error(
                    "Error fetching job seeker dashboard data:",
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
        onMutate: async (id: string) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({
                queryKey: dashboardKeys.jobseeker,
            })

            // Snapshot the previous value
            const previousDashboardData =
                queryClient.getQueryData<JobSeekerDashboardData>(
                    dashboardKeys.jobseeker
                )

            // Optimistically update to the new value
            if (previousDashboardData) {
                queryClient.setQueryData<JobSeekerDashboardData>(
                    dashboardKeys.jobseeker,
                    {
                        ...previousDashboardData,
                        applications: previousDashboardData.applications.filter(
                            (app) => app.id !== id
                        ),
                        stats: {
                            ...previousDashboardData.stats,
                            totalApplications: Math.max(
                                0,
                                previousDashboardData.stats.totalApplications -
                                1
                            ),
                        },
                    }
                )
            }

            // Return a context object with the snapshotted value
            return { previousDashboardData }
        },
        onError: (_err, _newTodo, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            if (context?.previousDashboardData) {
                queryClient.setQueryData(
                    dashboardKeys.jobseeker,
                    context.previousDashboardData
                )
            }
        },
        onSettled: () => {
            // Always refetch after error or success:
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
        "queryKey" | "queryFn"
    >
) => {
    return useQuery<EmployerDashboardData, Error>({
        queryKey: dashboardKeys.employer,
        queryFn: async () => {
            try {
                return await DashboardService.getEmployerDashboardData()
            } catch (error) {   
                console.error("Error fetching employer dashboard data:", error)
                throw error
            }
        },
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
                    "Error fetching company profile completion:",
                    error
                )
                return { complete: false, percentage: 0 }
            }
        },
    })
}

