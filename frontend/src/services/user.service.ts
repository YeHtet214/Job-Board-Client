import { ApiService } from './api.service'
import { User } from '@/types/user'

class UserService extends ApiService {
    private endpoints = {
        ALL: '/users',
        DETAIL: (id: string) => `/users/${id}`,
        CURRENT_USER: '/users/me',
        CHANGE_PASSWORD: '/users/change-password',
    }

    public async getCurrentUser(): Promise<User> {
        const response = await this.get<User>(this.endpoints.CURRENT_USER)

        if (!response.data.success) {
            throw new Error(response.data.message)
        }

        return response.data.data
    }

    public async getUserById(id: string): Promise<User> {
        const response = await this.get<User>(this.endpoints.DETAIL(id))

        if (!response.data.success) {
            throw new Error(response.data.message)
        }

        return response.data.data
    }

    public async updateUserInfo(userData: {
        firstName?: string
        lastName?: string
        email?: string
    }): Promise<User> {
        const response = await this.put<User>(
            this.endpoints.CURRENT_USER,
            userData
        )
        return response.data.data
    }

    public async changePassword(passwordData: {
        currentPassword: string
        newPassword: string
        confirmPassword: string
    }): Promise<{ message: string }> {
        const response = await this.put<{ message: string }>(
            this.endpoints.CHANGE_PASSWORD,
            passwordData
        )
        return response.data.data
    }
}

export default new UserService()
