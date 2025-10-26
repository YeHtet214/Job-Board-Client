import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import authService from '@/services/auth.service'
import type {
    LoginRequest,
    RegisterRequest,
    VerifiedEmailResponse,
} from '@/types/auth'
import { User } from '@/types/user'

// Query keys
export const authKeys = {
    all: ['auth'] as const,
    user: () => [...authKeys.all, 'user'] as const,
    currentUser: () => ['current-user'] as const,
    verification: () => [...authKeys.all, 'verification'] as const,
    verifyEmail: (token: string) =>
        [...authKeys.verification(), token] as const,
}

// Login Mutation
export const useLogin = () => {
    const queryClient = useQueryClient()

    return useMutation<User, Error, LoginRequest>({
        mutationFn: (credentials: LoginRequest) =>
            authService.login(credentials),
        onSuccess: (user) => {
            // Update cached user data
            queryClient.setQueryData(authKeys.currentUser(), user)
            // Invalidate any queries that might depend on authentication state
            queryClient.invalidateQueries({ queryKey: authKeys.all })
        },
        onError: (error) => {
            console.error('Login error:', error)
        },
    })
}

// Register Mutation
export const useRegister = () => {
    const queryClient = useQueryClient()

    return useMutation<User, Error, RegisterRequest>({
        mutationFn: (userData: RegisterRequest) =>
            authService.register(userData),
        onSuccess: (user) => {
            // Update cached user data
            queryClient.setQueryData(authKeys.currentUser(), user)
            // Invalidate any queries that might depend on authentication state
            queryClient.invalidateQueries({ queryKey: authKeys.all })
        },
        onError: (error) => {
            console.error('Registration error:', error)
        },
    })
}

// Logout Mutation
export const useLogout = () => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, void>({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            // Clear user data from cache
            queryClient.setQueryData(authKeys.currentUser(), null)
            // Invalidate all queries to refetch any public data that might be needed
            queryClient.invalidateQueries({ queryKey: [...authKeys.all] })
        },
        onError: (error) => {
            console.error('Logout error:', error)
            // Still remove user data even if the API call fails
            queryClient.setQueryData(authKeys.currentUser(), null)
        },
    })
}

// Email Verification Mutation
export const useVerifyEmail = (token: string) => {
    return useQuery<VerifiedEmailResponse>({
        queryKey: authKeys.verifyEmail(token),
        queryFn: async () => {
            try {
                const response = await authService.verifyEmail(token)
                return response
            } catch (error) {
                console.error('Email verification error:', error)
                throw error
            }
        },
        enabled: !!token, // Only run if we have a token
        retry: false,
    })
}

// Google Login Mutations
export const useGoogleLogin = () => {
    return useMutation<void, Error, void>({
        mutationFn: () => authService.googleLogin(),
    })
}

export const useGoogleCallback = () => {
    const queryClient = useQueryClient()

    return useMutation<User, Error, string>({
        mutationFn: (code: string) => authService.handleGoogleCallback(code),
        onSuccess: (user) => {
            queryClient.setQueryData(authKeys.currentUser(), user)
            queryClient.invalidateQueries({ queryKey: authKeys.all })
        },
        onError: (error) => {
            console.error('Google callback error:', error)
        },
    })
}
