import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
} from 'react'
import {
    useLogin as useLoginQuery,
    useRegister as useRegisterQuery,
    useLogout as useLogoutQuery,
    useGoogleLogin as useGoogleLoginQuery,
    useGoogleCallback as useGoogleCallbackQuery,
} from '@/hooks/react-queries/auth'
import { useCurrentUser } from '@/hooks/react-queries/user'
import authService from '@/services/auth.service'
import { User } from '@/types/user'
import { isTokenExpired } from '@/utils/jwt'
import { RegisterRequest } from '@/types/auth'

interface AuthContextType {
    currentUser: User | null | undefined
    isAuthenticated: () => boolean
    accessToken: string
    isLoading: boolean
    refetchUser: () => Promise<any>
    login: (email: string, password: string) => Promise<void>
    register: (userData: RegisterRequest) => Promise<void>
    logout: () => Promise<void>
    verifyEmail: (token: string) => Promise<any>
    resendVerification: (email: string) => Promise<any>
    googleLogin: () => Promise<void>
    showSessionExpiredDialog: boolean
    dismissSessionExpiredDialog: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const { data: currentUser, isLoading: isUserLoading, refetch: refetchUser } = useCurrentUser()
    const loginMutation = useLoginQuery()
    const registerMutation = useRegisterQuery()
    const logoutMutation = useLogoutQuery()
    const googleLoginMutation = useGoogleLoginQuery()
    const googleCallbackMutation = useGoogleCallbackQuery()

    const [showSessionExpiredDialog, setShowSessionExpiredDialog] = useState(false)
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || '')

    const isAuthenticated = useCallback(() => !!currentUser && !!accessToken && !isTokenExpired(accessToken), [currentUser, accessToken])

    // Handle session expiration events
    useEffect(() => {
        const handleSessionExpired = () => {
            setShowSessionExpiredDialog(true)
        }

        window.addEventListener('auth:sessionExpired', handleSessionExpired)

        return () => {
            window.removeEventListener(
                'auth:sessionExpired',
                handleSessionExpired
            )
        }
    }, [])

    const login = async (email: string, password: string): Promise<void> => {
        try {
            const user = await loginMutation.mutateAsync({ email, password })
            setAccessToken(user.accessToken)
            localStorage.setItem('accessToken', user.accessToken)
            refetchUser() // Refresh user data after login
        } catch (error) {
            console.error('Login failed:', error)
            throw error
        }
    }

    const register = async (userData: RegisterRequest): Promise<void> => {
        try {
            await registerMutation.mutateAsync(userData)
            refetchUser() // Refresh user data after registration
        } catch (error) {
            console.error('Registration failed:', error)
            throw error
        }
    }

    const googleLogin = async (): Promise<void> => {
        try {
            await googleLoginMutation.mutateAsync()
            // The page will be redirected to Google's OAuth page
        } catch (error) {
            console.error('Google login error:', error)
        }
    }

    const logout = async () => {
        try {
            await logoutMutation.mutateAsync()
            localStorage.removeItem('accessToken')
            setAccessToken('')
            refetchUser()
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    const verifyEmail = async (token: string) => {
        try {
            // We can't call a hook inside a function, so use the service directly
            const response = await authService.verifyEmail(token)
            return response
        } catch (error) {
            console.error('Email verification error:', error)
            throw error
        }
    }

    const resendVerification = async (email: string) => {
        try {
            const response = await authService.resendVerification(email)
            return response
        } catch (error) {
            console.error('Resend verification error:', error)
            throw error
        }
    }

    const dismissSessionExpiredDialog = () => {
        setShowSessionExpiredDialog(false)
    }

    const isLoading =
        isUserLoading ||
        loginMutation.isPending ||
        registerMutation.isPending ||
        logoutMutation.isPending ||
        googleLoginMutation.isPending ||
        googleCallbackMutation.isPending

    const value = {
        currentUser,
        isAuthenticated,
        accessToken,
        isLoading,
        refetchUser,
        login,
        register,
        logout,
        verifyEmail,
        resendVerification,
        googleLogin,
        showSessionExpiredDialog,
        dismissSessionExpiredDialog,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export default AuthProvider
