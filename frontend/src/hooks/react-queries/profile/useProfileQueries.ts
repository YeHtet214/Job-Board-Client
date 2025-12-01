import {
    useQuery,
    useMutation,
    useQueryClient,
    UseQueryOptions,
} from '@tanstack/react-query'
import { profileService } from '@/services/profile.service'
import { CreateProfileDto, Profile, UpdateProfileDto } from '@/types/profile'
import { useToast } from '@/components/ui/use-toast'
import { mapProfileData } from '@/utils/profileMapper'

// Query keys
export const profileKeys = {
    all: ['profile'] as const,
    details: () => [...profileKeys.all, 'details'] as const,
    resume: () => [...profileKeys.all, 'resume'] as const,
    profileImage: () => [...profileKeys.all, 'profile-image'] as const,
}

export const useProfile = (id: string, options?: Omit<UseQueryOptions<Profile | null, Error>, 'queryKey' | 'queryFn'>) => {
    return useQuery<Profile | null, Error>({
        queryKey: profileKeys.details(),
        queryFn: async () => {
            try {
                const profile = await profileService.getProfile(id)
                return mapProfileData(profile)
            } catch (error: any) {
                // If profile doesn't exist yet, return null instead of throwing error
                if (error.response?.status === 404) {
                    return null
                }
                throw error
            }
        },
        enabled: !!id,
        ...options,
    })
}

export const useCreateProfile = () => {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: (profileData: CreateProfileDto) =>
            profileService.createProfile(profileData),
        onSuccess: (data) => {
            queryClient.setQueryData(profileKeys.details(), data)
            toast({
                title: 'Success',
                description: 'Profile created successfully',
                variant: 'success',
            })
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: 'Failed to create profile. Please try again.',
                variant: 'destructive',
            })
            console.error('Error creating profile:', error)
        },
    })
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: (profileData: UpdateProfileDto) =>
            profileService.updateProfile(profileData),
        onSuccess: (data) => {
            queryClient.setQueryData(profileKeys.details(), data)
            toast({
                title: 'Success',
                description: 'Profile updated successfully',
                variant: 'default',
            })
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: 'Failed to update profile. Please try again.',
                variant: 'destructive',
            })
            console.error('Error updating profile:', error)
        },
    })
}

export const useUploadResume = () => {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: (file: File) => profileService.uploadResume(file),
        onSuccess: (resumeUrl) => {
            // Update the profile with the new resume URL
            queryClient.setQueryData<Profile | null>(
                profileKeys.details(),
                (oldData) => {
                    if (!oldData) return null
                    return { ...oldData, resumeUrl }
                }
            )

            toast({
                title: 'Success',
                description: 'Resume uploaded successfully',
                variant: 'default',
            })
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: 'Failed to upload resume. Please try again.',
                variant: 'destructive',
            })
            console.error('Error uploading resume:', error)
        },
    })
}

export const useUploadProfileImage = () => {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: (file: File) => profileService.uploadProfileImage(file),
        onSuccess: async (imageUrl) => {
            // Update the profile with the new image URL
            queryClient.setQueryData<Profile | null>(
                profileKeys.details(),
                (oldData) => {
                    if (!oldData) return null
                    return { ...oldData, profileImageUrl: imageUrl }
                }
            )

            // Invalidate and refetch profile data in the background
            await queryClient.invalidateQueries({
                queryKey: profileKeys.details(),
                refetchType: 'active',
            })

            toast({
                title: 'Success',
                description: 'Profile image uploaded successfully',
                variant: 'default',
            })
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description:
                    'Failed to upload profile image. Please try again.',
                variant: 'destructive',
            })
            console.error('Error uploading profile image:', error)
        },
    })
}