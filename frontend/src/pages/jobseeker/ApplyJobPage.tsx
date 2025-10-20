import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useJob } from '@/hooks/react-queries/job/useJobQueries'
import { Formik, Form, FormikHelpers } from 'formik'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { Check, File, MessageSquare, User } from 'lucide-react'
import Progress from '@/components/ui/Progress'
import { CreateApplicationDto } from '@/types/application'
import {
    PersonalInfoTab,
    ResumeTab,
    QuestionsTab,
    ReviewTab,
} from '@/components/application'
import ApplicationSchema from '@/schemas/validation/application.schema'
import { useAuth } from '@/contexts/authContext'
import { useCreateApplication } from '@/hooks/react-queries/application/useApplicationQueries'

const TABS = [
    {
        value: 'personal',
        label: 'Personal',
        Icon: <User className="h-4 w-4" />,
    },
    { value: 'resume', label: 'Resume', Icon: <File className="h-4 w-4" /> },
    {
        value: 'questions',
        label: 'Questions',
        Icon: <MessageSquare className="h-4 w-4" />,
    },
    { value: 'review', label: 'Review', Icon: <Check className="h-4 w-4" /> },
]

const ApplyJobPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('personal')
    const [progress, setProgress] = useState(20)
    const navigate = useNavigate()
    const createApplicationMutation = useCreateApplication()

    const jobId = useParams<{ id: string }>().id
    const { data: job } = useJob(jobId || '')
    const { currentUser } = useAuth()

    if (!jobId) {
        navigate('/jobseeker/jobs')
        return
    }

    // const resumeFile = profile?.resumeUrl ? new File([profile.resumeUrl], 'resume.pdf') : null;

    const initialValues: CreateApplicationDto = {
        jobId: jobId,
        fullName: currentUser
            ? `${currentUser.firstName} ${currentUser.lastName}`
            : '',
        email: currentUser?.email || '',
        phone: '',
        resume: null,
        useExistingResume: false,
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
            console.log('Application created:', createdApplication)
            navigate(`/jobseeker/applications/${createdApplication.id}`)
        } catch (error) {
            console.error('Error submitting form:', error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleTabChange = (tab: string) => {
        setActiveTab(tab)

        // Update progress based on active tab
        const progressMap: Record<string, number> = {
            personal: 20,
            resume: 40,
            coverLetter: 60,
            questions: 80,
            review: 100,
        }

        setProgress(progressMap[tab] || 0)
    }

    return (
        <div className="container mx-auto py-6 px-4 sm:px-6">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-2xl">
                        Apply for {job?.title || 'Job'}
                    </CardTitle>
                    <CardDescription>
                        {job?.company?.name || 'Company'} •{' '}
                        {job?.location || 'Location'}
                    </CardDescription>
                    <Progress value={progress} />
                </CardHeader>

                <Formik
                    initialValues={initialValues}
                    validationSchema={ApplicationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {(formik) => (
                        <Form>
                            <CardContent>
                                <Tabs
                                    value={activeTab}
                                    onValueChange={handleTabChange}
                                    className="w-full"
                                >
                                    <TabsList className="grid grid-cols-5 mb-8">
                                        {TABS.map((tab) => (
                                            <TabsTrigger
                                                key={tab.value}
                                                value={tab.value}
                                                className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2"
                                            >
                                                {tab.Icon}
                                                <span className="text-xs sm:text-sm">
                                                    {tab.label}
                                                </span>
                                                {/* Tab Error Indicator */}
                                                {tab.value === 'personal' &&
                                                    (formik.errors.fullName ||
                                                        formik.errors.email ||
                                                        formik.errors
                                                            .phone) && (
                                                        <span className="ml-2 h-2 w-2 rounded-full bg-red-500"></span>
                                                    )}
                                                {tab.value === 'resume' &&
                                                    (formik.errors.resume ||
                                                        formik.errors
                                                            .useExistingResume) && (
                                                        <span className="ml-2 h-2 w-2 rounded-full bg-red-500"></span>
                                                    )}
                                                {tab.value === 'questions' &&
                                                    (formik.errors
                                                        .coverLetter ||
                                                        formik.errors
                                                            .availability ||
                                                        formik.errors
                                                            .expectedSalary ||
                                                        formik.errors
                                                            .additionalInfo) && (
                                                        <span className="ml-2 h-2 w-2 rounded-full bg-red-500"></span>
                                                    )}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>

                                    {/* Personal Info Tab */}
                                    <TabsContent value="personal">
                                        <PersonalInfoTab />
                                    </TabsContent>

                                    {/* Resume Tab */}
                                    <TabsContent value="resume">
                                        <ResumeTab />
                                    </TabsContent>

                                    {/* Additional Questions Tab */}
                                    <TabsContent value="questions">
                                        <QuestionsTab />
                                    </TabsContent>

                                    {/* Review & Submit Tab */}
                                    <TabsContent value="review">
                                        <ReviewTab
                                            formik={formik}
                                            jobTitle={job?.title}
                                            companyName={job?.company?.name}
                                        />
                                    </TabsContent>
                                </Tabs>
                            </CardContent>

                            <CardFooter className="flex justify-between">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        const currentIndex = TABS.findIndex(
                                            (tab) => tab.value === activeTab
                                        )
                                        if (currentIndex > 0) {
                                            handleTabChange(
                                                TABS[currentIndex - 1].value
                                            )
                                        }
                                    }}
                                    disabled={activeTab === 'personal'}
                                >
                                    Previous
                                </Button>

                                {activeTab === 'review' ? (
                                    <Button
                                        type="submit"
                                        disabled={formik.isSubmitting}
                                    >
                                        Submit Application
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            const currentIndex = TABS.findIndex(
                                                (tab) => tab.value === activeTab
                                            )
                                            if (
                                                currentIndex <
                                                TABS.length - 1
                                            ) {
                                                handleTabChange(
                                                    TABS[currentIndex + 1].value
                                                )
                                            }
                                        }}
                                    >
                                        Next
                                    </Button>
                                )}
                            </CardFooter>
                        </Form>
                    )}
                </Formik>
            </Card>
        </div>
    )
}

export default ApplyJobPage
