import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useJob } from '@/hooks/react-queries/job/useJobQueries'
import { Formik, Form, FormikHelpers, FormikProps, FormikErrors, FormikTouched } from 'formik'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { Check, File, MessageSquare, User, ArrowLeft, ArrowRight, Send } from 'lucide-react'
import { CreateApplicationDto } from '@/types/application'
import {
    PersonalInfoTab,
    ResumeTab,
    QuestionsTab,
    ReviewTab,
    ApplicationStepper,
} from '@/components/application'
import ApplicationSchema from '@/schemas/validation/application.schema'
import { useAuth } from '@/contexts/authContext'
import { useCreateApplication } from '@/hooks/react-queries/application/useApplicationQueries'
import { motion, AnimatePresence } from 'framer-motion'
import { useProfile } from '@/hooks/react-queries/profile'

const STEPS = [
    {
        value: 'personal',
        label: 'Personal Info',
        Icon: User,
    },
    { value: 'resume', label: 'Resume', Icon: File },
    {
        value: 'questions',
        label: 'Questions',
        Icon: MessageSquare,
    },
    { value: 'review', label: 'Review', Icon: Check },
]

const ApplyJobPage = () => {
    const navigate = useNavigate()
    const { currentUser } = useAuth()
    const { data: profile } = useProfile(currentUser?.id!)
    const createApplicationMutation = useCreateApplication()

    const [activeTab, setActiveTab] = useState('personal')
    const [completedSteps, setCompletedSteps] = useState<string[]>([])

    const jobId = useParams<{ id: string }>().id
    const { data: job } = useJob(jobId || '')

    if (!jobId) {
        navigate('/jobseeker/jobs')
        return null
    }

    const initialValues: CreateApplicationDto = {
        jobId: jobId,
        fullName: profile?.firstName + ' ' + profile?.lastName,
        email: profile?.email || '',
        phone: '',
        resumeURL: profile?.resumeURL,
        useExistingResume: true,
        coverLetter: '',
        availability: '',
        expectedSalary: '',
        additionalInfo: '',
        acceptTerms: false,
    }

    const handleSubmit = async (
        values: CreateApplicationDto,
        { setSubmitting }: FormikHelpers<CreateApplicationDto>
    ) => {
        try {
            setSubmitting(true)
            const createdApplication =
                await createApplicationMutation.mutateAsync(values)
            navigate(`/jobseeker/applications/${createdApplication.id}`)
        } catch (error) {
            console.error('Error submitting form:', error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleStepChange = (step: string) => {
        setActiveTab(step)
    }

    const handleNext = (currentStep: string) => {
        // Mark current step as completed
        if (!completedSteps.includes(currentStep)) {
            setCompletedSteps([...completedSteps, currentStep])
        }

        const currentIndex = STEPS.findIndex((s) => s.value === currentStep)
        if (currentIndex < STEPS.length - 1) {
            setActiveTab(STEPS[currentIndex + 1].value)
        }
    }

    const handlePrevious = (currentStep: string) => {
        const currentIndex = STEPS.findIndex((s) => s.value === currentStep)
        if (currentIndex > 0) {
            setActiveTab(STEPS[currentIndex - 1].value)
        }
    }

    const renderStepContent = (step: string, formik: FormikProps<CreateApplicationDto>) => {
        switch (step) {
            case 'personal':
                return <PersonalInfoTab />
            case 'resume':
                return <ResumeTab formik={formik} />
            case 'questions':
                return <QuestionsTab />
            case 'review':
                return (
                    <ReviewTab
                        formik={formik}
                        jobTitle={job?.title}
                        companyName={job?.company?.name}
                    />
                )
            default:
                return null
        }
    }

    // Define fields for each step for validation
    const stepFields: Record<string, Array<keyof CreateApplicationDto>> = {
        personal: ['fullName', 'email', 'phone'],
        resume: ['resume', 'useExistingResume'],
        questions: ['coverLetter', 'availability', 'expectedSalary', 'additionalInfo'],
        review: [],
    }

    const getStepsWithErrors = (
        errors: FormikErrors<CreateApplicationDto>,
        touched: FormikTouched<CreateApplicationDto>
    ) => {
        return STEPS.filter((step) => {
            const fields = stepFields[step.value]
            return fields?.some((field) => errors[field] && touched[field])
        }).map((step) => step.value)
    }

    const isStepValid = (
        step: string,
        values: CreateApplicationDto,
        errors: FormikErrors<CreateApplicationDto>
    ) => {
        const fields = stepFields[step]
        if (!fields) return true

        // Filter to remove resume field from validation if using existing resume with valid resumeURL
        const filteredFields = fields.filter(field => {
            // Skip 'resume' field validation if user is using existing resume and has a resumeURL
            if (field === 'resume' && values.useExistingResume && values.resumeURL) {
                return false
            }
            return true
        })

        const hasErrors = filteredFields.some((field) => errors[field])
        return !hasErrors
    }

    return (
        <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="space-y-2 text-center sm:text-left">
                    <Button
                        variant="ghost"
                        className="pl-0 hover:bg-transparent hover:text-primary mb-2"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Job Details
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Apply for {job?.title || 'Job'}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        {job?.company?.name || 'Company'} • {job?.location || 'Location'}
                    </p>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={ApplicationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                    validateOnMount={true}
                >
                    {(formik) => {
                        const stepsWithErrors = getStepsWithErrors(formik.errors, formik.touched)
                        const isCurrentStepValid = isStepValid(
                            activeTab,
                            formik.values,
                            formik.errors
                        )

                        return (
                            <Form className="space-y-8">
                                {/* Stepper */}
                                <ApplicationStepper
                                    steps={STEPS}
                                    currentStep={activeTab}
                                    onStepClick={handleStepChange}
                                    completedSteps={completedSteps}
                                    stepsWithErrors={stepsWithErrors}
                                />

                                <Card className="border-none shadow-lg overflow-hidden pt-0">
                                    <CardHeader className="bg-jb-primary/5 border-b px-6 py-4">
                                        <CardTitle className="text-xl flex items-center gap-2">
                                            {STEPS.find(s => s.value === activeTab)?.Icon &&
                                                React.createElement(STEPS.find(s => s.value === activeTab)!.Icon, { className: "h-5 w-5 text-jb-primary" })
                                            }
                                            {STEPS.find(s => s.value === activeTab)?.label}
                                        </CardTitle>
                                        <CardDescription>
                                            Please fill in your details below.
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="p-6 min-h-[400px]">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={activeTab}
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {renderStepContent(activeTab, formik)}
                                            </motion.div>
                                        </AnimatePresence>
                                    </CardContent>

                                    <CardFooter className="flex justify-between items-center border-t">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => handlePrevious(activeTab)}
                                            disabled={activeTab === 'personal'}
                                            className="w-32"
                                        >
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Previous
                                        </Button>

                                        {activeTab === 'review' ? (
                                            <Button
                                                type="submit"
                                                disabled={formik.isSubmitting || !formik.isValid}
                                                className="w-40"
                                            >
                                                {formik.isSubmitting ? (
                                                    'Submitting...'
                                                ) : (
                                                    <>
                                                        Submit Application
                                                        <Send className="ml-2 h-4 w-4" />
                                                    </>
                                                )}
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    // Touch all fields in the current step to show errors if any
                                                    const fields = stepFields[activeTab]
                                                    fields?.forEach(field => {
                                                        formik.setFieldTouched(field as string, true)
                                                    })

                                                    if (isCurrentStepValid) {
                                                        handleNext(activeTab)
                                                    }
                                                }}
                                                disabled={!isCurrentStepValid}
                                                className="w-32"
                                            >
                                                Next
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        )}
                                    </CardFooter>
                                </Card>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </div>
    )
}

export default ApplyJobPage
