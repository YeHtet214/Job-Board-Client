import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ApplicationService from '@/services/application.service'
import { CreateApplicationDto, UpdateApplicationDto } from '@/types/application'
import { useToast } from '@/components/ui/use-toast'

export const useMyApplications = (userId: string) => {
   return useQuery({
      queryKey: ['myApplications'],
      queryFn: () => ApplicationService.getMyApplications(userId),
   })
}

export const useApplicationById = (id: string) => {
   return useQuery({
      queryKey: ['application', id],
      queryFn: () => ApplicationService.getApplicationById(id),
      enabled: !!id, // Only run if id is provided
   })
}

export const useJobApplications = (jobId: string) => {
   return useQuery({
      queryKey: ['jobApplications', jobId],
      queryFn: () => ApplicationService.getApplicationsByJobId(jobId),
      enabled: !!jobId, // Only run if jobId is provided
   })
}

export const useCreateApplication = () => {
   const queryClient = useQueryClient()
   const { toast } = useToast()

   return useMutation({
      mutationFn: (applicationData: CreateApplicationDto) => {
         console.log('application craete data in query: ', applicationData)
         return ApplicationService.createApplication(applicationData)
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['myApplications'] })
         toast({
            title: 'Application Submitted',
            description:
               'Your job application has been successfully submitted.',
            variant: 'default',
         })
      },
      onError: (error: any) => {
         toast({
            title: 'Application Failed',
            description:
               error.response?.data?.message ||
               'Failed to submit your application. Please try again.',
            variant: 'destructive',
         })
      },
   })
}

export const useUpdateApplication = () => {
   const queryClient = useQueryClient()
   const { toast } = useToast()

   return useMutation({
      mutationFn: ({
         id,
         updateData,
      }: {
         id: string
         updateData: UpdateApplicationDto
      }) => ApplicationService.updateApplication(id, updateData),
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({
            queryKey: ['application', variables.id],
         })
      },
      onError: (error: any) => {
         toast({
            title: 'Update Failed',
            description:
               error.response?.data?.message ||
               'Failed to update application status. Please try again.',
            variant: 'destructive',
         })
      },
   })
}

export const useWithdrawApplication = () => {
   const queryClient = useQueryClient()
   const { toast } = useToast()

   return useMutation({
      mutationFn: (id: string) => ApplicationService.withdrawApplication(id),
      onSuccess: (_, id) => {
         queryClient.invalidateQueries({ queryKey: ['application', id] })
         queryClient.invalidateQueries({ queryKey: ['myApplications'] })
         toast({
            title: 'Application Withdrawn',
            description: 'Your application has been withdrawn successfully.',
            variant: 'default',
         })
      },
      onError: (error: any) => {
         toast({
            title: 'Withdrawal Failed',
            description:
               error.response?.data?.message ||
               'Failed to withdraw your application. Please try again.',
            variant: 'destructive',
         })
      },
   })
}
