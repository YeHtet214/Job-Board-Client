import { ApiService } from '@/services/api.service'
import { Profile, CreateProfileDto, UpdateProfileDto } from '@/types/profile'

class ProfileService extends ApiService {
    private endpoints = {
        ALL: '/profiles',
        MY_PROFILE: '/profiles/me',
        DETAIL: (id: string) => `/profiles/${id}`,
        UPLOAD_RESUME: '/resumes/upload',
        VIEW_RESUME: (id: string) => `/resumes/${id}/view`,
        UPLOAD_PROFILE_IMAGE: '/profiles/upload-profile-image',
    }

    public async getProfile(id: string): Promise<Profile> {
        const response = await this.get<Profile>(this.endpoints.DETAIL(id))

        if (!response.data.success) {
            throw new Error(response.data.message)
        }

        return response.data.data
    }

    public async createProfile(
        profileData: CreateProfileDto
    ): Promise<Profile> {
        const formData = new FormData()

        for (const [key, value] of Object.entries(profileData)) {
            if (
                key === 'skills' ||
                key === 'education' ||
                key === 'experience'
            ) {
                formData.append(key, JSON.stringify(value))
            } else {
                formData.append(key, value)
            }
        }

        const response = await this.post<Profile>(
            this.endpoints.MY_PROFILE,
            formData
        )
        return response.data.data
    }

    public async updateProfile(
        profileData: UpdateProfileDto
    ): Promise<Profile> {
        const formData = new FormData()

        for (const [key, value] of Object.entries(profileData)) {
            if (
                key === 'skills' ||
                key === 'education' ||
                key === 'experience'
            ) {
                formData.append(key, JSON.stringify(value))
            } else {
                formData.append(key, value as string)
            }
        }
        const response = await this.put<Profile>(
            this.endpoints.MY_PROFILE,
            formData
        )
        return response.data.data
    }

    public async uploadResume(file: File) {
        const formData = new FormData()
        formData.append('resume', file)

        const response = await this.post<{ fileId: string }>(
            this.endpoints.UPLOAD_RESUME,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )

        if (!response.data.success) {
            throw new Error(response.data.message)
        }

        return response.data.data.fileId
    }

    public async uploadProfileImage(file: File): Promise<string> {
        const formData = new FormData()
        formData.append('image', file)

        const response = await this.post<{ url: string }>(
            this.endpoints.UPLOAD_PROFILE_IMAGE,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )

        if (!response.data.success) {
            throw new Error(response.data.message)
        }

        return response.data.data.url
    }
}

export const profileService = new ProfileService()
