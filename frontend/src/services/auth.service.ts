import { ApiService } from '@/services/api.service'
import {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    VerifiedEmailResponse,
} from '@/types/auth'
import { User } from '@/types/user'
import { isTokenExpired } from '@/utils/jwt'

class AuthService extends ApiService {
    private endpoints = {
        SIGNIN: '/auth/signin',
        SIGNUP: '/auth/signup',
        GOOGLE_AUTH: `${import.meta.env.VITE_API_BASE_URL}/auth/google`,
        GOOGLE_CALLBACK: `${import.meta.env.VITE_API_BASE_URL}/auth/google/callback`,
        LOGOUT: '/auth/logout',
        REFRESH_TOKEN: '/auth/refresh-token',
        VERIFY_EMAIL: (token: string) => `/auth/verify-email/${token}`,
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
    }

    public async login(credentials: LoginRequest): Promise<User> {
        const response = await this.post<AuthResponse>(
            this.endpoints.SIGNIN,
            credentials
        )
        const data = response.data.data

        if (data.accessToken && data.refreshToken) {
            localStorage.setItem('accessToken', data.accessToken)
            localStorage.setItem('refreshToken', data.refreshToken)
        }

        return data.user
    }

    public async register(userData: RegisterRequest): Promise<User> {
        const response = await this.post<AuthResponse>(
            this.endpoints.SIGNUP,
            userData
        )
        const data = response.data.data

        if (data.accessToken && data.refreshToken) {
            localStorage.setItem('accessToken', data.accessToken)
            localStorage.setItem('refreshToken', data.refreshToken)
        }

        return data.user
    }

    public async googleLogin(): Promise<void> {
        // Redirect to Google OAuth endpoint
        window.location.href = this.endpoints.GOOGLE_AUTH
        // await this.get(this.endpoints.GOOGLE_AUTH);
    }

    public async handleGoogleCallback(code: string): Promise<User> {
        const response = await this.post<AuthResponse>(
            this.endpoints.GOOGLE_CALLBACK,
            { code }
        )
        const data = response.data.data

        if (data.accessToken && data.refreshToken) {
            localStorage.setItem('accessToken', data.accessToken)
            localStorage.setItem('refreshToken', data.refreshToken)
        }

        return data.user
    }

    public async logout(): Promise<void> {
        try {
            // The token will be automatically included in the Authorization header
            // by the axios interceptor in index.ts
            await this.post<void>(this.endpoints.LOGOUT, {})
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
        }
    }

    public async refreshToken(
        refreshToken: string
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const response = await this.post<AuthResponse>(
            this.endpoints.REFRESH_TOKEN,
            { refreshToken }
        )
        const data = response.data.data

        if (data.accessToken && data.refreshToken) {
            localStorage.setItem('accessToken', data.accessToken)
            localStorage.setItem('refreshToken', data.refreshToken)
            return {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
            }
        }

        throw new Error('Failed to refresh token')
    }

    public getToken(): string | null {
        return localStorage.getItem('accessToken')
    }

    public getRefreshToken(): string | null {
        return localStorage.getItem('refreshToken')
    }

    public isAuthenticated(): boolean {
        const token = this.getToken()
        return !!token && !isTokenExpired(token)
    }

    public async verifyEmail(token: string): Promise<VerifiedEmailResponse> {
        console.log(
            `Sending verification request to: ${this.endpoints.VERIFY_EMAIL(token)}`
        )
        try {
            const response = await this.get<any>(
                this.endpoints.VERIFY_EMAIL(token)
            )
            console.log('Raw verification response:', response)
            return response.data
        } catch (error) {
            console.error('Error in verifyEmail service call:', error)
            throw error
        }
    }

    public async resendVerification(
        email: string
    ): Promise<{ message: string }> {
        try {
            const response = await this.post<{
                success: boolean
                message: string
            }>('/auth/resend-verification', { email })
            return { message: response.data.message }
        } catch (error) {
            console.error('Error in resendVerification service call:', error)
            throw error
        }
    }

    public async forgotPassword(email: string): Promise<{ message: string }> {
        try {
            const response = await this.post<{
                success: boolean
                message: string
            }>(this.endpoints.FORGOT_PASSWORD, { email })
            return { message: response.data.message }
        } catch (error) {
            console.error('Error in forgotPassword service call:', error)
            throw error
        }
    }

    public async resetPassword(
        token: string,
        newPassword: string
    ): Promise<{ message: string }> {
        try {
            const response = await this.post<{
                success: boolean
                message: string
            }>(this.endpoints.RESET_PASSWORD, { token, newPassword })
            return { message: response.data.message }
        } catch (error) {
            console.error('Error in resetPassword service call:', error)
            throw error
        }
    }
}

export default new AuthService()
