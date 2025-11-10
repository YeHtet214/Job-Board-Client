import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/authContext'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

import { Button } from '../../components/ui/button'
import { AlertCircle, Mail, Check, Loader2 } from 'lucide-react'

const VerifyEmailPage: React.FC = () => {
    const { verifyEmail, resendVerification } = useAuth()
    const [status, setStatus] = useState<
        'loading' | 'success' | 'error' | 'pending'
    >('loading')
    const [message, setMessage] = useState<string>('')
    const [isResending, setIsResending] = useState(false)
    const { token } = useParams<{ token?: string }>()
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email || ''
    const stateMessage = location.state?.message || ''

    useEffect(() => {
        // Check if we already tried to verify this token
        const verificationState = sessionStorage.getItem(
            `verification_${token}`
        )

        if (token) {
            // If we have already verified this token successfully, don't make another API call
            if (verificationState === 'success') {
                setStatus('success')
                setMessage(
                    'Your email has already been verified. You can now log in to your account.'
                )
            } else {
                sendVerifyRequest(token)
            }
        } else if (email) {
            setStatus('pending')
            setMessage(
                stateMessage ||
                    `We've sent a verification link to ${email}. Please check your inbox and spam folder.`
            )
        } else {
            setStatus('error')
            setMessage(
                'Verification information is missing. Please check your email link or try registering again.'
            )
        }
    }, [token, email, stateMessage])

    const sendVerifyRequest = async (verificationToken: string) => {
        try {
            const response = await verifyEmail(verificationToken)
            setStatus('success')
            setMessage(
                response?.message ||
                    'Your email has been successfully verified!'
            )

            // Save verification state to session storage to prevent duplicate API calls
            sessionStorage.setItem(`verification_${token}`, 'success')
        } catch (error: any) {
            setStatus('error')
            setMessage(
                error.message ||
                    'Failed to verify your email. Please try again.'
            )

            // Save verification state to session storage
            sessionStorage.setItem(`verification_${token}`, 'error')
        }
    }

    const handleResendVerification = async () => {
        if (!email) {
            setMessage(
                'Email address is missing. Please try registering again.'
            )
            return
        }

        setIsResending(true)
        try {
            const response = await resendVerification(email)
            setMessage(
                response?.message ||
                    'Verification email has been resent. Please check your inbox.'
            )
            // Keep the status as pending since we're waiting for the user to verify
            setStatus('pending')
        } catch (error: any) {
            setMessage(
                error.message ||
                    'Failed to resend verification email. Please try again later.'
            )
        } finally {
            setIsResending(false)
        }
    }

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                        <p className="text-jobboard-darkblue">
                            Verifying your email address...
                        </p>
                    </div>
                )
            case 'pending':
                return (
                    <div className="flex flex-col items-center gap-6">
                        <div className="rounded-full bg-blue-100 p-3">
                            <Mail className="h-12 w-12 sm:h-16 sm:w-16 text-blue-600" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-semibold text-blue-600">
                            Check Your Email
                        </h2>
                        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md w-full">
                            {message}
                        </div>
                        <p className="text-sm text-gray-500 text-center">
                            The verification link is valid for 24 hours. If you
                            don't see the email, check your spam folder.
                        </p>
                        <div className="flex flex-col sm:!flex-row gap-4 mt-2 w-full">
                            <Button
                                onClick={() => navigate('/login')}
                                variant="outline"
                                className="flex-6 hover:bg-jb-surface"
                                disabled={isResending}
                            >
                                Back to Login
                            </Button>
                            <Button
                                onClick={handleResendVerification}
                                disabled={isResending}
                                className="flex-6 hover:bg-jb-primary"
                            >
                                {isResending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Resending...
                                    </>
                                ) : (
                                    'Resend Verification Email'
                                )}
                            </Button>
                        </div>
                    </div>
                )
            case 'success':
                return (
                    <div className="flex flex-col items-center gap-6">
                        <div className="rounded-full bg-green-100 p-3">
                            <Check className="h-12 w-12 sm:h-16 sm:w-16 text-green-600" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-semibold text-green-600">
                            Email Verified!
                        </h2>
                        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md w-full">
                            {message}
                        </div>
                        <div className="flex gap-4 mt-2">
                            <Button
                                onClick={() => navigate('/login')}
                                className="px-4 py-2"
                            >
                                Go to Login
                            </Button>
                        </div>
                    </div>
                )
            case 'error':
                return (
                    <div className="flex flex-col items-center gap-6">
                        <div className="rounded-full bg-red-100 p-3">
                            <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-red-600" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-semibold text-red-600">
                            Verification Failed
                        </h2>
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md w-full">
                            {message}
                        </div>
                        <p className="text-sm text-gray-500 text-center">
                            Your verification link may have expired.
                            Verification links are valid for 24 hours.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full">
                            <Button
                                onClick={() => navigate('/')}
                                variant="outline"
                                className="w-full"
                            >
                                Back to Home
                            </Button>
                            {email && (
                                <Button
                                    onClick={handleResendVerification}
                                    className="w-full"
                                    disabled={isResending}
                                >
                                    {isResending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Resending...
                                        </>
                                    ) : (
                                        'Resend Verification Email'
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="flex justify-center items-center min-h-[80vh] px-4 py-8">
            <div className="bg-jb-surface rounded-lg shadow-md p-4 sm:p-8 max-w-md w-full">
                <h1 className="text-2xl sm:text-3xl font-bold text-jb-text mb-6 text-center">
                    Email Verification
                </h1>
                {renderContent()}
            </div>
        </div>
    )
}

export default VerifyEmailPage
