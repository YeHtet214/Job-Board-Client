import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CalendarDays, 
  Building, 
  User, 
  MapPin, 
  Clock, 
  FileText, 
  Mail, 
  Phone, 
  Download, 
  MailOpen, 
  Calendar, 
  CheckCircle2, 
  XCircle,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

import { 
  useApplicationById, 
  useUpdateApplication 
} from '@/hooks/react-queries/application/useApplicationQueries';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ApplicationStatus } from '@/types/application';

// Status display maps
const statusIconMap = {
  PENDING: <Clock className="h-5 w-5 text-yellow-500" />,
  REVIEWING: <MailOpen className="h-5 w-5 text-blue-500" />,
  INTERVIEW: <Calendar className="h-5 w-5 text-purple-500" />,
  ACCEPTED: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  REJECTED: <XCircle className="h-5 w-5 text-red-500" />,
};

const statusTextMap = {
  PENDING: 'Pending Review',
  REVIEWING: 'Under Review',
  INTERVIEW: 'Interview Scheduled',
  ACCEPTED: 'Application Accepted',
  REJECTED: 'Application Rejected',
};

const statusColorMap = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  REVIEWING: 'bg-blue-100 text-blue-800',
  INTERVIEW: 'bg-purple-100 text-purple-800',
  ACCEPTED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

const EmployerApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Local state
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  // Fetch application data
  const { 
    data: application, 
    isLoading, 
    error,
    refetch 
  } = useApplicationById(id || '');

  // Mutation for updating application status
  const { 
    mutate: updateApplication,
    isPending: isUpdating
  } = useUpdateApplication();

  // Format dates for display
  const formattedAppliedDate = application?.createdAt 
    ? format(new Date(application.createdAt), 'PPP') 
    : 'Unknown';
  
  const formattedUpdatedDate = application?.updatedAt 
    ? format(new Date(application.updatedAt), 'PPP') 
    : 'Unknown';

  // Handle status update
  const handleUpdateStatus = (newStatus: ApplicationStatus) => {
    if (!application || !id) return;

    updateApplication(
      { id, updateData: { status: newStatus } },
      {
        onSuccess: () => {
          toast({
            title: 'Status Updated',
            description: `Application status has been updated to ${statusTextMap[newStatus]}.`,
          });
          setStatusDialogOpen(false);
          refetch();
        },
        onError: (error) => {
          console.error('Failed to update status:', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to update application status. Please try again.',
          });
        }
      }
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load application details. Please try again."}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => navigate('/employer/applications')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Button>
        </div>
      </div>
    );
  }

  // Not found state
  if (!application) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6">
        <Alert>
          <AlertTitle>Application Not Found</AlertTitle>
          <AlertDescription>
            The application you're looking for doesn't exist or you don't have permission to view it.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => navigate('/employer/applications')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Button>
        </div>
      </div>
    );
  }

  // Status options for the status update dialog
  const statusOptions: { label: string; value: ApplicationStatus }[] = [
    { label: "Mark as Reviewing", value: "REVIEWING" },
    { label: "Schedule Interview", value: "INTERVIEW" },
    { label: "Accept Applicant", value: "ACCEPTED" },
    { label: "Reject Application", value: "REJECTED" }
  ];

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/employer/applications')}
              className="mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applications
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold text-jobboard-darkblue">
              Application Details
            </h1>
            <p className="text-gray-500 mt-1">
              Reviewing application for {application.job?.title || 'Unknown Position'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              onClick={() => setStatusDialogOpen(true)}
              disabled={isUpdating}
              className="bg-jobboard-darkblue hover:bg-jobboard-darkblue/90"
            >
              {isUpdating && <LoadingSpinner size="sm" className="mr-2" />}
              Update Status
            </Button>
          </div>
        </div>

        {/* Status and dates */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Card className="flex-1">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-muted rounded-full p-2">
                {statusIconMap[application.status] || statusIconMap.PENDING}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className={`mt-1 ${statusColorMap[application.status]}`}>
                  {statusTextMap[application.status]}
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-muted rounded-full p-2">
                <CalendarDays className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Applied On</p>
                <p className="font-medium">{formattedAppliedDate}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-muted rounded-full p-2">
                <Clock className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{formattedUpdatedDate}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <Tabs defaultValue="application" className="space-y-4">
          <TabsList className="w-full border-b px-0 py-0 gap-0">
            <TabsTrigger 
              value="application" 
              className="flex-1 text-sm px-6 py-3 rounded-none data-[state=active]:border-b-2 border-jobboard-darkblue"
            >
              <FileText className="h-4 w-4 mr-2" />
              Application Details
            </TabsTrigger>
            <TabsTrigger 
              value="applicant" 
              className="flex-1 text-sm px-6 py-3 rounded-none data-[state=active]:border-b-2 border-jobboard-darkblue"
            >
              <User className="h-4 w-4 mr-2" />
              Applicant Information
            </TabsTrigger>
            <TabsTrigger 
              value="job" 
              className="flex-1 text-sm px-6 py-3 rounded-none data-[state=active]:border-b-2 border-jobboard-darkblue"
            >
              <Building className="h-4 w-4 mr-2" />
              Job Details
            </TabsTrigger>
          </TabsList>

          {/* Application tab */}
          <TabsContent value="application">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Resume section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-gray-500" />
                    Resume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {application.resumeUrl ? (
                    <div className="space-y-4">
                      <div className="border border-dashed rounded-lg p-4 text-center space-y-2">
                        <p className="text-sm text-muted-foreground">Resume uploaded with this application</p>
                        <div className="flex justify-center gap-3">
                          <Button variant="outline" asChild>
                            <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Resume
                            </a>
                          </Button>
                          <Button variant="outline" asChild>
                            <a href={application.resumeUrl} download>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground">No resume was uploaded with this application</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Cover letter section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-gray-500" />
                    Cover Letter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {application.coverLetter ? (
                    <div className="border rounded-lg p-4">
                      <p className="text-sm whitespace-pre-wrap">{application.coverLetter}</p>
                    </div>
                  ) : (
                    <div className="border border-dashed rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground">No cover letter was included with this application</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Interview information (shown if status is INTERVIEW) */}
              {application.status === 'INTERVIEW' && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-purple-500" />
                      Interview Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <p className="text-sm">
                        This application is currently in the interview stage. You may want to contact the applicant
                        to schedule an interview or provide additional information about the interview process.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Applicant tab */}
          <TabsContent value="applicant">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <User className="h-5 w-5 mr-2 text-gray-500" />
                  Applicant Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Applicant details */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Full Name</p>
                    <p className="text-sm bg-muted p-3 rounded-md">
                      {application.applicant?.firstName} {application.applicant?.lastName}
                    </p>
                  </div>
                  
                  {application.applicant?.email && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm bg-muted p-3 rounded-md flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        <a href={`mailto:${application.applicant.email}`} className="text-blue-600 hover:underline">
                          {application.applicant.email}
                        </a>
                      </p>
                    </div>
                  )}
                  
                  {application.applicant?.phone && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Phone Number</p>
                      <p className="text-sm bg-muted p-3 rounded-md flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <a href={`tel:${application.applicant.phone}`} className="text-blue-600 hover:underline">
                          {application.applicant.phone}
                        </a>
                      </p>
                    </div>
                  )}
                  
                  {application.applicant?.location && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm bg-muted p-3 rounded-md flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        {application.applicant.location}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Profile link */}
                <div className="pt-4 border-t border-border">
                  <Button variant="outline" asChild>
                    <a href={`/profile/${application.applicantId}`} target="_blank" rel="noopener noreferrer">
                      <User className="h-4 w-4 mr-2" />
                      View Full Profile
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Job details tab */}
          <TabsContent value="job">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{application.job?.title || 'Job Title'}</CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="flex items-center">
                    <Building className="h-4 w-4 mr-1" />
                    {application.job?.company?.name || 'Company Name'}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {application.job?.location || 'Location'}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {application.job?.jobType || 'Full-time'}
                  </span>
                  {application.job?.salary && (
                    <span className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {application.job.salary}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Job Description</h3>
                  <div className="text-muted-foreground whitespace-pre-wrap">
                    {application.job?.description || 'No job description available'}
                  </div>
                </div>

                {application.job?.requirements && (
                  <div>
                    <h3 className="font-medium mb-2">Requirements</h3>
                    <div className="text-muted-foreground whitespace-pre-wrap">
                      {application.job.requirements}
                    </div>
                  </div>
                )}

                {application.job?.responsibilities && (
                  <div>
                    <h3 className="font-medium mb-2">Responsibilities</h3>
                    <div className="text-muted-foreground whitespace-pre-wrap">
                      {application.job.responsibilities}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t p-6">
                <Button variant="outline" asChild>
                  <a href={`/jobs/${application.jobId}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Job Posting
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Application Status</DialogTitle>
            <DialogDescription>
              Change the status for {application.applicant?.firstName} {application.applicant?.lastName}'s application
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 items-center gap-4">
              <div className="space-y-3">
                {statusOptions.map(option => (
                  <div key={option.value}>
                    <Button
                      variant={application.status === option.value ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleUpdateStatus(option.value)}
                      disabled={application.status === option.value || isUpdating}
                    >
                      {option.label}
                      {application.status === option.value && 
                        <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">Current</Badge>
                      }
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setStatusDialogOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployerApplicationDetailPage;
