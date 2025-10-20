import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import * as Yup from 'yup'
import { Formik, FormikHelpers, Field, ErrorMessage } from 'formik'
import { Form } from '@/components/forms/'
import AuthLayout from '@/components/layouts/AuthLayout'

// Shadcn UI components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { AlertCircle, Check, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Alert, AlertDescription } from '@/components/ui/alert'

// API service
import authService from '@/services/auth.service'

// Validation schema
const resetPasswordSchema = Yup.object({
    newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        )
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Confirm password is required'),
})

interface ResetPasswordRequest {
    newPassword: string
    confirmPassword: string
}

const ResetPasswordPage: React.FC = () => {
    const { token } = useParams<{ token: string }>()
    const [formError, setFormError] = useState<string | null>(null)
    const [isSuccess, setIsSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const navigate = useNavigate()
    const { toast } = useToast()

    useEffect(() => {
        if (!token) {
            setFormError(
                'Invalid reset link. Please request a new password reset link.'
            )
        }
    }, [token])

    const initialValues: ResetPasswordRequest = {
        newPassword: '',
        confirmPassword: '',
    }

    const handleSubmit = async (
        values: ResetPasswordRequest,
        { setSubmitting }: FormikHelpers<ResetPasswordRequest>
    ) => {
        setFormError(null)

        if (!token) {
            setFormError(
                'Invalid reset link. Please request a new password reset link.'
            )
            setSubmitting(false)
            return
        }

        try {
            await authService.resetPassword(token, values.newPassword)
            setIsSuccess(true)
            toast({
                title: 'Success!',
                description:
                    'Your password has been reset successfully. You can now log in with your new password.',
                variant: 'default',
            })

            // Redirect to login page after 3 seconds
            setTimeout(() => {
                navigate('/login')
            }, 3000)
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'An error occurred'
            setFormError(errorMessage)
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <AuthLayout
            title="Reset Your Password"
            subtitle="Create a new secure password for your account"
        >
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center">
                        <Link
                            to="/login"
                            className="text-jb-foreground hover:text-jb-text-muted mr-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <CardTitle className="text-2xl font-bold">
                            Reset Password
                        </CardTitle>
                    </div>
                    <CardDescription>
                        Create a new password for your account
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {isSuccess ? (
                        <Alert className="bg-green-50 border-green-200">
                            <div className="flex items-center">
                                <Check className="h-4 w-4 text-green-600 mr-2" />
                                <AlertDescription className="text-green-800">
                                    Your password has been reset successfully.
                                    Redirecting to login page...
                                </AlertDescription>
                            </div>
                        </Alert>
                    ) : (
                        <Formik
                            initialValues={initialValues}
                            validationSchema={resetPasswordSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting, touched, errors }) => (
                                <Form className="space-y-4">
                                    {formError && (
                                        <Alert className="bg-destructive/15 border-destructive/30">
                                            <AlertCircle className="h-4 w-4 text-destructive mr-2" />
                                            <AlertDescription className="text-destructive">
                                                {formError}
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">
                                            New Password
                                        </Label>
                                        <div className="relative">
                                            <Field
                                                as={Input}
                                                id="newPassword"
                                                name="newPassword"
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                placeholder="••••••••"
                                                className={
                                                    touched.newPassword &&
                                                    errors.newPassword
                                                        ? 'border-destructive pr-10'
                                                        : 'pr-10'
                                                }
                                                disabled={isSubmitting}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                        <ErrorMessage
                                            name="newPassword"
                                            component="div"
                                            className="text-sm text-destructive"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Password must be at least 8
                                            characters and include uppercase,
                                            lowercase, number, and special
                                            character.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">
                                            Confirm Password
                                        </Label>
                                        <div className="relative">
                                            <Field
                                                as={Input}
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type={
                                                    showConfirmPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                placeholder="••••••••"
                                                className={
                                                    touched.confirmPassword &&
                                                    errors.confirmPassword
                                                        ? 'border-destructive pr-10'
                                                        : 'pr-10'
                                                }
                                                disabled={isSubmitting}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword
                                                    )
                                                }
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                        <ErrorMessage
                                            name="confirmPassword"
                                            component="div"
                                            className="text-sm text-destructive"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full border-jb-primary bg-jb-primary text-white hover:bg-jb-primary/90"
                                        disabled={isSubmitting || !token}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center">
                                                <LoadingSpinner
                                                    size="sm"
                                                    className="mr-2"
                                                />{' '}
                                                Resetting...
                                            </span>
                                        ) : (
                                            'Reset Password'
                                        )}
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    )}
                </CardContent>

                <CardFooter className="flex justify-center border-t p-4">
                    <p className="text-sm text-jb-text-muted">
                        Remember your password?{' '}
                        <Link
                            to="/login"
                            className="font-medium text-jb-primary hover:underline"
                        >
                            Back to login
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </AuthLayout>
    )
}

export default ResetPasswordPage
