import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Briefcase, 
  FileText, 
  Plus,
  UserCheck
} from 'lucide-react';
import { PostedJob, ReceivedApplication, EmployerActivity, EmployerStats } from '@/types/dashboard';
import DashboardStatCard from '@/components/dashboard/DashboardStatCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import ProfileCompletionCard from '@/components/dashboard/ProfileCompletionCard';
import PostedJobsList from '@/components/employer/PostedJobsList';
import ReceivedApplicationsList from '@/components/employer/ReceivedApplicationsList';
import { getEmployerActivityIcon } from '@/utils/dashboard.utils';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { useAuth } from '@/contexts/authContext';
import { useToast } from '@/components/ui/use-toast';
import {
  useEmployerDashboard,
  useUpdateApplicationStatus,
  useDeletePostedJob
} from '@/hooks/react-queries/dashboard';
import { UpdateApplicationStatusDto } from '@/types/dashboard';

const EmployerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const [stats, setStats] = useState<EmployerStats | null>(null);
  const [postedJobs, setPostedJobs] = useState<PostedJob[]>([]);
  const [applications, setApplications] = useState<ReceivedApplication[]>([]);
  const [recentActivity, setRecentActivity] = useState<EmployerActivity[]>([]);
  const [companyProfileComplete, setCompanyProfileComplete] = useState<boolean>(false);
  const [companyProfilePercentage, setCompanyProfilePercentage] = useState<number>(0);

  // Employer query and mutations - only fetch if user is an EMPLOYER
  const { 
    data: employerData, 
    isLoading, 
    error, 
    refetch 
  } = useEmployerDashboard({
    enabled: currentUser?.role === 'EMPLOYER'
  });

  const { mutate: updateApplicationStatus } = useUpdateApplicationStatus();
  const { mutate: deletePostedJob } = useDeletePostedJob();

  // Load dashboard data on component mount
  useEffect(() => {
    if (employerData) {
      setStats(employerData.stats);
      setPostedJobs(employerData.jobs);
      setApplications(employerData.applications);
      setRecentActivity(employerData.recentActivity);
      setCompanyProfileComplete(employerData.company);
      setCompanyProfilePercentage(employerData.companyProfilePercentage);
    }
  }, [employerData]);

  // Handle employer actions
  const handleUpdateApplicationStatus = useCallback((
    application: ReceivedApplication, 
    status: ReceivedApplication['status']
  ) => {
    const statusData: UpdateApplicationStatusDto = { status };
    updateApplicationStatus(
      { id: application.id, statusData },
      {
        onSuccess: () => {
          toast({
            title: "Status updated",
            description: `Application status updated to ${status.toLowerCase()}.`,
            variant: "default"
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update application status. Please try again.",
            variant: "destructive"
          });
        }
      }
    );
  }, [updateApplicationStatus, toast]);

  const handleDeleteJob = useCallback((job: PostedJob) => {
    deletePostedJob(job.id, {
      onSuccess: () => {
        toast({
          title: "Job deleted",
          description: `${job.title} has been deleted.`,
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to delete job. Please try again.",
          variant: "destructive"
        });
      }
    });
  }, [deletePostedJob, toast]);

  return (
    <DashboardContainer
      isLoading={isLoading}
      error={error}
      refetch={refetch}
      title="Employer Dashboard"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <DashboardStatCard
          title="Active Jobs"
          value={stats?.activeJobs || 0}
          icon={<Briefcase className="h-6 w-6 text-jb-primary" />}
          borderColorClass="border-l-jb-primary"
        />
        <DashboardStatCard
          title="Total Applications"
          value={stats?.totalApplications || 0}
          icon={<FileText className="h-6 w-6 text-jb-accent" />}
          borderColorClass="border-l-jb-accent"
        />
        <DashboardStatCard
          title="Interview Invitations"
          value={stats?.interviewInvitations || 0}
          icon={<UserCheck className="h-6 w-6 text-jb-success" />}
          borderColorClass="border-l-jb-success"
        />
        <DashboardStatCard
          title="Reviewing"
          value={stats?.reviewingApplications || 0}
          icon={<Plus className="h-6 w-6 text-jb-danger" />}
          borderColorClass="border-l-jb-danger"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Tabs Section */}
        <div className="md:col-span-3">
          <Tabs defaultValue="jobs" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-jb-surface h-auto text-jb-text">
              <TabsTrigger value="jobs" className="flex items-center cursor-pointer">
                <Briefcase className=" w-4 mr-2" />
                <span className="sm:block">Posted Jobs</span>
              </TabsTrigger>
              <TabsTrigger value="applications" className="flex items-center cursor-pointer">
                <FileText className=" w-4 mr-2" />
                <span className="sm:block">Applications</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="jobs">
              <Card className="bg-jb-surface text-jb-text">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Your Job Postings</CardTitle>
                      <CardDescription>
                        Manage your active and past job postings
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      className="bg-jb-primary hover:bg-jb-primary/90 text-white"
                      onClick={() => navigate('/employer/jobs/create')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Job
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <PostedJobsList postedJobs={postedJobs || []} onDeleteJob={handleDeleteJob} />
                </CardContent>
                {postedJobs?.length > 0 && (
                  <CardFooter className="flex justify-center">
                    <Button variant="outline" onClick={() => navigate('/employer/jobs')}>
                      View All Jobs
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="applications">
              <Card className="bg-jb-surface text-jb-text">
                <CardHeader>
                  <CardTitle>Received Applications</CardTitle>
                  <CardDescription>
                    Applications received for your job postings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ReceivedApplicationsList
                    applications={applications || []}
                    onUpdateApplicationStatus={handleUpdateApplicationStatus}
                  />
                </CardContent>
                {applications?.length > 0 && (
                  <CardFooter className="flex justify-center">
                    <Button variant="outline" onClick={() => navigate('/employer/applications')}>
                      View All Applications
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Section */}
        <div className="md:col-span-2">
          <ActivityFeed
            activities={recentActivity || []}
            title="Recent Activity"
            description="Recent activity on your job postings"
            getActivityIcon={getEmployerActivityIcon}
          />

          <div className="mt-6">
            <ProfileCompletionCard
              title="Company Profile"
              description={
                companyProfileComplete
                  ? "Your company profile looks great!"
                  : "Complete your company profile to attract more applicants"
              }
              completionPercentage={companyProfilePercentage}
              completionItems={[
                { completed: true, text: "Basic company information added" },
                { completed: true, text: "Company location set" },
                { completed: companyProfileComplete, text: "Add company logo" },
                { completed: companyProfileComplete, text: "Complete company description" }
              ]}
              profilePath="/company/profile"
              buttonText={companyProfileComplete ? "Update Company Profile" : "Complete Company Profile"}
              isJobSeeker={false}
            />
          </div>
        </div>
      </div>
    </DashboardContainer>
  );
};

export default EmployerDashboard;
