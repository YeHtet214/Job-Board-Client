import { User, UserRole } from '@/types/user'

export interface LoginRequest {
    email: string
    password: string
    remember?: boolean
}

export interface RegisterRequest {
    email: string
    password: string
    firstName: string
    lastName: string
    role: UserRole
}

export interface RefreshTokenRequest {
    refreshToken: string
}

export interface AuthResponse {
    user: User
    accessToken: string
    refreshToken: string
}

export interface VerifiedEmailResponse {
    success: boolean
    message: string
    verified?: boolean
    user?: User
}
