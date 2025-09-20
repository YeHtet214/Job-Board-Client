import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanyRequiredCheck } from '../../components/company';
import { useCompanyJobs, useDeleteJob } from '../../hooks/react-queries/job/useJobQueries';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  Calendar,
  Users
} from 'lucide-react';
import { Job } from '../../types/job';
import { useMyCompany } from '../../hooks/react-queries/company/useCompanyQueries';
import { motion } from 'framer-motion';

const EmployerJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: company, isLoading: isCompanyLoading } = useMyCompany();
  const { data: jobsData, isLoading: isJobsLoading } = useCompanyJobs(company?.id || '');
  const deleteJob = useDeleteJob();

  const [companyJobs, setCompanyJobs] = useState<Job[] | []>(jobsData ? jobsData.jobs : []);

  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    if (jobsData && jobsData.jobs) {
      setCompanyJobs(jobsData.jobs);
    }
  }, [company, jobsData])

  // Handle job deletion
  const handleDeleteJob = async () => {
    if (!jobToDelete) return;

    try {
      await deleteJob.mutateAsync(jobToDelete.id);
      // Show success message
      window.alert("Job posting has been deleted successfully.");
    } catch (error) {
      // Show error message
      window.alert("There was a problem deleting the job posting. Please try again.");
    } finally {
      setJobToDelete(null);
      setConfirmDialogOpen(false);
    }
  };

  // Open confirm dialog for job deletion
  const openDeleteConfirmDialog = (job: Job) => {
    setJobToDelete(job);
    setConfirmDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getStatusBadge = (job: Job) => {
    const now = new Date();
    const expiryDate = job.expiresAt ? new Date(job.expiresAt) : null;

    if (!job.isActive) {
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Inactive</Badge>;
    }

    if (expiryDate && expiryDate < now) {
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Expired</Badge>;
    }

    return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
  };

  const isLoading = isCompanyLoading || isJobsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl py-10 px-4 sm:px-6">
      <motion.div 
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-jb-primary">Your Job Postings</h1>
        <Button
          onClick={() => navigate('/employer/jobs/create')}
          className="text-jb-text-foreground bg-jb-primary hover:bg-jb-primary/80"
        >
          <Plus className="h-4 w-4 mr-2" />
          Post New Job
        </Button>
      </motion.div>

      <CompanyRequiredCheck>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Manage Your Job Listings</CardTitle>
              <CardDescription>
                View, edit, and track applications for your posted jobs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {companyJobs && companyJobs.length > 0 ? (
                <div className="space-y-6 grid grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 xl:!grid-cols-4 gap-4">
                  {companyJobs.map((job, index) => (
                    <motion.div 
                      key={job.id} 
                      className=" background-primary-500 rounded-lg p-4 hover:border-jobboard-purple transition-all duration-300 shadow-sm hover:shadow-md"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex flex-col md:!flex-row md:!justify-between md:!items-start gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-medium text-jobboard-darkblue">{job.title}</h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {getStatusBadge(job)}
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                              {job.type}
                            </Badge>
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                              {job.location}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2 md:mt-0">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(`/jobs/${job.id}`)}
                            title="View Job"
                            className="hover:bg-gray-100 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(`/employer/jobs/edit/${job.id}`)}
                            title="Edit Job"
                            className="hover:bg-gray-100 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                            onClick={() => openDeleteConfirmDialog(job)}
                            title="Delete Job"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          <span>Posted: {formatDate(job.createdAt)}</span>
                        </div>
                        {job.expiresAt && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            <span>Expires: {formatDate(job.expiresAt)}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-400" />
                          <span>
                            {/* This would be fetched from the backend in a real implementation */}
                            {Math.floor(Math.random() * 20)} Applications
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Jobs Posted Yet</h3>
                  <p className="text-gray-500 mb-6">
                    Start posting jobs and find the perfect candidates for your positions.
                  </p>
                  <Button
                    onClick={() => navigate('/employer/jobs/create')}
                    className="bg-jobboard-darkblue hover:bg-jobboard-darkblue/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Post Your First Job
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </CompanyRequiredCheck>

      {/* Confirmation Dialog for Job Deletion */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the job posting
              and remove it from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setJobToDelete(null);
                setConfirmDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteJob}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={deleteJob.isPending}
            >
              {deleteJob.isPending ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployerJobsPage;
