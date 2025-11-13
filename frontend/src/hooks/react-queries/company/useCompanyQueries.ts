import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import companyService from '@/services/company.service'
import type { CreateCompanyDto, UpdateCompanyDto } from '@/types/company'
import { toast } from 'react-hot-toast'
import jobService from '@/services/job.service'
import { SearchParams } from '@/pages/company/CompaniesPage'

// Query keys
export const companyKeys = {
    all: ['companies'] as const,
    lists: () => [...companyKeys.all, 'list'] as const,
    list: (filters: Record<string, any>) =>
        [...companyKeys.lists(), { filters }] as const,
    details: () => [...companyKeys.all, 'detail'] as const,
    detail: (id: string) => [...companyKeys.details(), id] as const,
    my: () => [...companyKeys.all, 'my'] as const,
}

// Queries
export const useCompanies = (filters?: Record<string, any>) => {
    return useQuery({
        queryKey: companyKeys.list(filters || {}),
        queryFn: async () => companyService.getAllCompanies(),
        retry: 3,
    })
}

export const useCustomQuery = (params: SearchParams) => {
    console.log('Custom query get update params: ', params)

    return { data: 'custom data : ', params }
}

export const useCompany = (id: string) => {
    return useQuery({
        queryKey: companyKeys.detail(id),
        queryFn: async () => {
            try {
                const company = await companyService.getCompanyById(id)
                return company || null
            } catch (error) {
                console.error('Error fetching company with id:', id, error)
                return null
            }
        },
        enabled: !!id, // Only run the query if we have an ID
    })
}

export const useMyCompany = () => {
    return useQuery({
        queryKey: companyKeys.my(),
        queryFn: async () => {
            try {
                const company = await companyService.getMyCompany()
                return company || null
            } catch (error) {
                // 404 means the company doesn't exist yet, which is fine
                if ((error as any).response?.status !== 404) {
                    console.error('Error fetching my company:', error)
                }
                return null
            }
        },
        retry: (failureCount, error: any) => {
            // Don't retry on 404, but retry other errors
            return error.response?.status !== 404 && failureCount < 3
        },
    })
}

// getting company related jobs
export const useCompanyJobs = (companyId: string | undefined) => {
    return useQuery({
        queryKey: ['companyJobs', companyId],
        queryFn: async () => {
            if (!companyId) throw new Error('Company ID is required')
            const response = await jobService.getJobsByCompany(companyId)

            console.log('Jobs query response: ', response)
            // Ensuring to return an array of jobs
            return Array.isArray(response.jobs) ? response.jobs : []
        },
        enabled: !!companyId,
    })
}

// Mutations
export const useCreateCompany = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (newCompany: CreateCompanyDto) =>
            companyService.createCompany(newCompany),
        onSuccess: () => {
            toast.success('Company profile created successfully')
            queryClient.invalidateQueries({ queryKey: companyKeys.all })
        },
        onError: () => {
            toast.error('Failed to create company profile')
        },
    })
}

export const useUpdateCompany = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCompanyDto }) =>
            companyService.updateCompany(id, data),
        onSuccess: () => {
            toast.success('Company profile updated successfully')
            queryClient.invalidateQueries({ queryKey: companyKeys.all })
        },
        onError: () => {
            toast.error('Failed to update company profile')
        },
    })
}

export const useDeleteCompany = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => companyService.deleteCompany(id),
        onSuccess: () => {
            toast.success('Company deleted successfully')
            queryClient.invalidateQueries({ queryKey: companyKeys.all })
        },
        onError: () => {
            toast.error('Failed to delete company')
        },
    })
}
