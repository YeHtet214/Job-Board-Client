import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Briefcase, FileText, Calendar, Bookmark } from 'lucide-react'
import { JobApplication } from '@/types/dashboard'
import DashboardStatCard from '@/components/dashboard/DashboardStatCard'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import ProfileCompletionCard from '@/components/dashboard/ProfileCompletionCard'
import ApplicationsTable from './ApplicationsTable'
import SavedJobsList from './SavedJobsList'
import { getJobSeekerActivityIcon } from '@/utils/dashboard.utils'
import DashboardContainer from '@/components/dashboard/DashboardContainer'

import {
    useJobSeekerDashboard,
    useWithdrawApplication,
} from '@/hooks/react-queries/dashboard'
import {
    useRemoveSavedJob,
    useSavedJobs,
} from '@/hooks/react-queries/job/useSavedJobQueries'
import { useAuth } from '@/contexts/authContext'
import { useToast } from '@/components/ui/use-toast'
import { useProfile } from '@/hooks/react-queries/profile/useProfileQueries'
import { ProfileCompletionItemType } from '@/types/profile'
import { SavedJobWithDetails } from '@/types/saved-job'

const JobSeekerDashboard: React.FC = () => {
    const navigate = useNavigate()
    const { currentUser } = useAuth()
    const { toast } = useToast()

    const { mutate: withdrawApplication, isPending: isWithdrawingApplication } = useWithdrawApplication()
    const { mutate: removeSavedJob, isPending: isRemovingSavedJob } = useRemoveSavedJob()
    const {
        data: profile,
        isLoading: isProfileLoading,
        error: profileError,
    } = useProfile()

    // Fetch saved jobs directly for more real-time updates
    const { data: savedJobs = [] } = useSavedJobs()

    // Only using state for profile completion items since they're derived from profile data
    const [completionItems, setCompletionItems] = useState<
        ProfileCompletionItemType[]
    >([])

    // Job seeker query and mutations - only fetch if user is a JOBSEEKER
    const {
        data: dashboardData,
        isLoading,
        error,
        refetch,
    } = useJobSeekerDashboard({
        enabled: currentUser?.role === 'JOBSEEKER',
    })

    useEffect(() => {
        const settingCompletionItems = () => {
            if (profile) {
                const basic =
                    profile.bio !== ''
                        ? {
                            completed: true,
                            text: 'Basic information completed',
                        }
                        : {
                            completed: false,
                            text: 'Basic information completed',
                        }
                const skills =
                    profile.skills?.length >= 3
                        ? { completed: true, text: 'Added 3 skills' }
                        : { completed: false, text: 'Added 3 skills' }
                const experience =
                    profile.experience.length > 0
                        ? { completed: true, text: 'Added an Experience' }
                        : { completed: false, text: 'Experience added' }
                const resume =
                    profile.resumeUrl !== ''
                        ? { completed: true, text: 'Resume uploaded' }
                        : { completed: false, text: 'Resume uploaded' }
                setCompletionItems([basic, skills, experience, resume])
            }
        }

        settingCompletionItems()
    }, [profile])

    // Handle job seeker actions
    const handleRemoveSavedJob = useCallback(
        (savedJob: SavedJobWithDetails) => {
            removeSavedJob(
                { savedJobId: savedJob.id, jobId: savedJob.job.id },
                {
                    onSuccess: () => {
                        toast({
                            title: 'Job removed',
                            description: `${savedJob.job.title} has been removed from your saved jobs.`,
                        })
                    }
                }
            )
        },
        [removeSavedJob, toast]
    )

    const handleWithdrawApplication = useCallback(
        (application: JobApplication) => {
            withdrawApplication(application.id, {
                onSuccess: () => {
                    toast({
                        title: 'Application withdrawn',
                        description: `Your application for ${application.jobTitle} has been withdrawn.`,
                    })
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description:
                            'Failed to withdraw application. Please try again.',
                        variant: 'destructive',
                    })
                },
            })
        },
        [withdrawApplication, toast]
    )

    return (
        <DashboardContainer
            isLoading={isLoading || isProfileLoading}
            error={error || profileError}
            refetch={refetch}
            title="Job Seeker Dashboard"
        >
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <DashboardStatCard
                    title="Applications"
                    value={dashboardData?.stats?.totalApplications || 0}
                    icon={<FileText className="h-6 w-6 text-jb-primary" />}
                    borderColorClass="border-l-jb-primary"
                />
                <DashboardStatCard
                    title="Interviews"
                    value={dashboardData?.stats?.interviews || 0}
                    icon={<Calendar className="h-6 w-6 text-jb-accent" />}
                    borderColorClass="border-l-jb-accent"
                />
                <DashboardStatCard
                    title="Offers"
                    value={dashboardData?.stats?.offers || 0}
                    icon={<Briefcase className="h-6 w-6 text-jb-success" />}
                    borderColorClass="border-l-jb-success"
                />
                <DashboardStatCard
                    title="Saved Jobs"
                    value={savedJobs.length || 0}
                    icon={<Bookmark className="h-6 w-6 text-jb-danger" />}
                    borderColorClass="border-l-jb-danger"
                />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tabs Section */}
                <div>
                    <Tabs defaultValue="applications" className="w-full">
                        <TabsList className="grid grid-cols-2 w-full bg-jb-surface">
                            <TabsTrigger
                                value="applications"
                                className="flex items-center justify-center gap-2 cursor-pointer hover:text-jb-text"
                            >
                                <FileText className="h-4 w-4" />
                                <span>Applications</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="saved"
                                className="flex items-center justify-center gap-2 cursor-pointer hover:text-jb-text"
                            >
                                <Bookmark className="h-4 w-4" />
                                <span>Saved Jobs</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="applications">
                            <Card className="bg-jb-surface">
                                <CardHeader>
                                    <CardTitle>Your Applications</CardTitle>
                                    <CardDescription className="text-jb-text-muted">
                                        Track the status of your job
                                        applications
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ApplicationsTable
                                        applications={
                                            dashboardData?.applications || []
                                        }
                                        onWithdrawApplication={
                                            handleWithdrawApplication
                                        }
                                        isWithdrawingApplication={isWithdrawingApplication}
                                    />
                                </CardContent>
                                {(dashboardData?.applications?.length ?? 0) >
                                    0 && (
                                        <CardFooter className="flex justify-center">
                                            <Button
                                                variant="outline"
                                                className="text-jb-primary border-jb-primary hover:bg-jb-primary"
                                                onClick={() =>
                                                    navigate('/applications')
                                                }
                                            >
                                                View All Applications
                                            </Button>
                                        </CardFooter>
                                    )}
                            </Card>
                        </TabsContent>

                        <TabsContent value="saved">
                            <Card className="bg-jb-surface text-jb-text">
                                <CardHeader>
                                    <CardTitle>Saved Jobs</CardTitle>
                                    <CardDescription className="text-jb-text-muted">
                                        Jobs you've saved for later
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <SavedJobsList
                                        savedJobs={savedJobs || []}
                                        onRemoveSavedJob={handleRemoveSavedJob}
                                        isRemovingSavedJob={isRemovingSavedJob}
                                    />
                                </CardContent>
                                {savedJobs?.length > 0 && (
                                    <CardFooter className="flex justify-center">
                                        <Button
                                            variant="outline"
                                            className="text-jb-primary border-jb-primary hover:bg-jb-primary"
                                            onClick={() =>
                                                navigate('/saved-jobs')
                                            }
                                        >
                                            View All Saved Jobs
                                        </Button>
                                    </CardFooter>
                                )}
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar Section */}
                <div className="space-y-6">
                    <ActivityFeed
                        activities={dashboardData?.recentActivity || []}
                        title="Recent Activity"
                        description="Your latest interactions"
                        getActivityIcon={getJobSeekerActivityIcon}
                    />

                    <ProfileCompletionCard
                        title="Profile Completion"
                        description="Complete your profile to increase visibility"
                        completionPercentage={
                            dashboardData?.stats?.profileCompletion || 0
                        }
                        completionItems={completionItems}
                        profilePath="/profile"
                        buttonText="Complete Profile"
                        isJobSeeker={true}
                    />
                </div>
            </div>
        </DashboardContainer>
    )
}

export default JobSeekerDashboard
