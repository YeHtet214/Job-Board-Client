import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Formik, FormikHelpers } from 'formik'
import { Form, InputFieldWithLabel, SubmitButton } from '@/components/forms'
import AuthLayout from '@/components/layouts/AuthLayout'
import { ForgotPasswordSchema } from '@/schemas/validation/auth.schema'

// Shadcn UI components
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { AlertCircle, Mail, ArrowLeft } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Alert, AlertDescription } from '@/components/ui/alert'

// API service
import AuthService from '@/services/auth.service'

interface ForgotPasswordRequest {
    email: string
}

const ForgotPasswordPage: React.FC = () => {
    const [formError, setFormError] = useState<string | null>(null)
    const [isSuccess, setIsSuccess] = useState(false)
    const [emailSent, setEmailSent] = useState('')
    const { toast } = useToast()

    const initialValues: ForgotPasswordRequest = {
        email: '',
    }

    const handleSubmit = async (
        values: ForgotPasswordRequest,
        { setSubmitting }: FormikHelpers<ForgotPasswordRequest>
    ) => {
        setFormError(null)

        try {
            await AuthService.forgotPassword(values.email)
            setIsSuccess(true)
            setEmailSent(values.email)
            toast({
                title: 'Reset email sent',
                description:
                    'Please check your inbox for password reset instructions.',
                variant: 'default',
            })
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
            title="Forgot Your Password?"
            subtitle="Don't worry, we'll help you reset it"
            imageSrc="/auth-background.svg"
            imagePosition="left"
        >
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center">
                        <Link
                            to="/login"
                            className="text-muted-foreground hover:text-primary mr-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <CardTitle className="text-2xl font-bold">
                            Forgot Password
                        </CardTitle>
                    </div>
                    <CardDescription>
                        Enter your email address and we'll send you a link to
                        reset your password.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {isSuccess ? (
                        <Alert className="bg-green-50 border-green-200">
                            <div className="flex items-center">
                                <Mail className="h-4 w-4 text-green-600 mr-2" />
                                <AlertDescription className="text-green-800">
                                    We've sent a password reset link to{' '}
                                    <span className="font-medium">
                                        {emailSent}
                                    </span>
                                    . Please check your email inbox and follow
                                    the instructions to reset your password.
                                </AlertDescription>
                            </div>
                        </Alert>
                    ) : (
                        <Formik
                            initialValues={initialValues}
                            validationSchema={ForgotPasswordSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    {formError && (
                                        <Alert className="bg-destructive/15 border-destructive/30">
                                            <AlertCircle className="h-4 w-4 text-destructive mr-2" />
                                            <AlertDescription className="text-destructive">
                                                {formError}
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    <InputFieldWithLabel
                                        formik={true}
                                        name="email"
                                        label="Email"
                                        placeholder="name@example.com"
                                        autoComplete="email"
                                        required
                                        disabled={isSubmitting}
                                    />

                                    <SubmitButton
                                        className="w-full"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center">
                                                <LoadingSpinner
                                                    size="sm"
                                                    className="mr-2"
                                                />{' '}
                                                Sending...
                                            </span>
                                        ) : (
                                            'Send Reset Link'
                                        )}
                                    </SubmitButton>
                                </Form>
                            )}
                        </Formik>
                    )}
                </CardContent>

                <CardFooter className="flex justify-center border-t p-4">
                    <p className="text-sm text-muted-foreground">
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

export default ForgotPasswordPage
