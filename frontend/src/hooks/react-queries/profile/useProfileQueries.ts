import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { profileService } from '@/services/profile.service';
import { CreateProfileDto, Profile, UpdateProfileDto } from '@/types/profile';
import { useToast } from '@/components/ui/use-toast';

// Query keys
export const profileKeys = {
  all: ['profile'] as const,
  details: () => [...profileKeys.all, 'details'] as const,
  resume: () => [...profileKeys.all, 'resume'] as const,
  profileImage: () => [...profileKeys.all, 'profile-image'] as const,
};

/**
 * Hook for fetching the current user's profile
 * 
 * @param options - Optional query options
 * @returns Query result with profile data
 */
export const useProfile = (options?: Omit<UseQueryOptions<Profile | null, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery<Profile | null, Error>({
    queryKey: profileKeys.details(),
    queryFn: async () => {
      try {
        return await profileService.getMyProfile();
      } catch (error: any) {
        // If profile doesn't exist yet, return null instead of throwing error
        if (error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    ...options
  });
};

/**
 * Hook for creating a new profile
 * 
 * @returns Mutation for creating a profile
 */
export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (profileData: CreateProfileDto) =>
      profileService.createProfile(profileData),
    onSuccess: (data) => {
      queryClient.setQueryData(profileKeys.details(), data);
      toast({
        title: "Success",
        description: "Profile created successfully",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
      console.error('Error creating profile:', error);
    }
  });
};

/**
 * Hook for updating an existing profile
 * 
 * @returns Mutation for updating a profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (profileData: UpdateProfileDto) =>
      profileService.updateProfile(profileData),
    onSuccess: (data) => {
      queryClient.setQueryData(profileKeys.details(), data);
      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      console.error('Error updating profile:', error);
    }
  });
};

/**
 * Hook for uploading a resume
 * 
 * @returns Mutation for uploading a resume
 */
export const useUploadResume = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (file: File) => profileService.uploadResume(file),
    onSuccess: (resumeUrl) => {
      // Update the profile with the new resume URL
      queryClient.setQueryData<Profile | null>(profileKeys.details(), (oldData) => {
        if (!oldData) return null;
        return { ...oldData, resumeUrl };
      });

      toast({
        title: "Success",
        description: "Resume uploaded successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to upload resume. Please try again.",
        variant: "destructive",
      });
      console.error('Error uploading resume:', error);
    }
  });
};

/**
 * Hook for uploading a profile image
 * 
 * @returns Mutation for uploading a profile image
 */
export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (file: File) => profileService.uploadProfileImage(file),
    onSuccess: async (imageUrl) => {
      // Update the profile with the new image URL
      queryClient.setQueryData<Profile | null>(profileKeys.details(), (oldData) => {
        if (!oldData) return null;
        return { ...oldData, profileImageUrl: imageUrl };
      });

      // Invalidate and refetch profile data in the background
      await queryClient.invalidateQueries({ queryKey: profileKeys.details(), refetchType: 'active' });

      toast({
        title: "Success",
        description: "Profile image uploaded successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to upload profile image. Please try again.",
        variant: "destructive",
      });
      console.error('Error uploading profile image:', error);
    }
  });
};

/**
 * @deprecated Use individual hooks instead: useProfile, useCreateProfile, useUpdateProfile, useUploadResume, useUploadProfileImage
 */
export const useProfileQuery = () => {
  const { data: profile, isLoading, error, refetch } = useProfile();
  const createProfileMutation = useCreateProfile();
  const updateProfileMutation = useUpdateProfile();
  const uploadResumeMutation = useUploadResume();
  const uploadProfileImageMutation = useUploadProfileImage();

  return {
    profile,
    isLoading,
    error,
    refetch,
    createProfile: createProfileMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    uploadResume: uploadResumeMutation.mutate,
    uploadProfileImage: uploadProfileImageMutation.mutate,
    isCreating: createProfileMutation.isPending,
    isUpdating: updateProfileMutation.isPending,
    isUploading: uploadResumeMutation.isPending,
    isUploadingImage: uploadProfileImageMutation.isPending,
  };
};
