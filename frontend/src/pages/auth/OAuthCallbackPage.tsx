import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/authContext'

// UI Components
import { Loader2, AlertCircle } from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const OAuthCallbackPage: React.FC = () => {
    const navigate = useNavigate()
    const { refetchUser } = useAuth()
    const [error, setError] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState<boolean>(true)

    useEffect(() => {
        const processOAuthCallback = async () => {
            try {
                // Get the URL search params
                const searchParams = new URLSearchParams(window.location.search)
                const accessToken = searchParams.get('accessToken')
                const refreshToken = searchParams.get('refreshToken')
                const errorParam = searchParams.get('error')

                // Handle error case
                if (errorParam) {
                    setError(errorParam)
                    setIsProcessing(false)
                    return
                }

                // Validate tokens
                if (!accessToken || !refreshToken) {
                    setError('No authentication tokens received')
                    setIsProcessing(false)
                    return
                }

                // Store tokens in localStorage
                localStorage.setItem('accessToken', accessToken)
                localStorage.setItem('refreshToken', refreshToken)

                // Update auth state by refetching the user
                await refetchUser()

                // Clean URL and redirect to dashboard
                window.history.replaceState(
                    {},
                    document.title,
                    '/oauth/callback'
                )
                setTimeout(() => navigate('/'), 3000)
            } catch (err) {
                setError('Authentication failed. Please try again.')
                console.error('OAuth callback error:', err)
            } finally {
                setIsProcessing(false)
            }
        }

        processOAuthCallback()
    }, [navigate, refetchUser])

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">
                        Google Authentication
                    </CardTitle>
                    <CardDescription>
                        {isProcessing
                            ? 'Processing your authentication...'
                            : error
                              ? 'Authentication failed'
                              : 'Authentication successful!'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                    {isProcessing ? (
                        <div className="flex flex-col items-center space-y-4 py-6">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <p className="text-muted-foreground">
                                Completing authentication...
                            </p>
                        </div>
                    ) : error ? (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    ) : (
                        <div className="flex flex-col items-center space-y-4 py-6">
                            <div className="rounded-full bg-primary/10 p-3">
                                <svg
                                    className="h-8 w-8 text-primary"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <p className="text-center text-muted-foreground">
                                You've been successfully authenticated.
                                Redirecting to your dashboard...
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default OAuthCallbackPage
