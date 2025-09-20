import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { formatDate, getJobStatusBadge } from '@/utils/dashboard.utils';
import { PostedJob } from '@/types/dashboard';

interface PostedJobsListProps {
  postedJobs: PostedJob[];
  onDeleteJob?: (job: PostedJob) => void;
  emptyStateMessage?: string;
}

const PostedJobsList: React.FC<PostedJobsListProps> = ({
  postedJobs,
  onDeleteJob,
  emptyStateMessage = "You haven't posted any jobs yet."
}) => {
  const navigate = useNavigate(); 

  return (
    <div>
      {postedJobs?.length > 0 ? (
        <div className="space-y-4">
          {postedJobs.map((job) => (
            <div
              key={job.id}
              className="p-4 border rounded-lg hover:bg-jb-text-muted/10 border-jb-border transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-jb-text truncate">
                    {job.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-jb-text-muted">
                      Posted {formatDate(job.postedDate)}
                    </span>
                    {getJobStatusBadge(job.status)}
                  </div>
                  <p className="text-xs text-jb-text-muted mt-2">
                    <span className="font-medium text-jb-text">
                      {job.applicationsCount}
                    </span>{" "}
                    applications
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    View
                  </Button>

                  {onDeleteJob && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-4 w-4 text-jb-text" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => navigate(`/jobs/${job.id}/edit`)}
                        >
                          Edit Job
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate(`/jobs/${job.id}/applications`)}
                        >
                          View Applications
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-jb-danger"
                              onSelect={(e) => e.preventDefault()}
                            >
                              Delete Job
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-jb-surface text-jb-text">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Job Posting</AlertDialogTitle>
                              <AlertDialogDescription className="text-jb-text-muted">
                                Are you sure you want to delete the job posting for{" "}
                                <span className="font-medium">{job.title}</span>? This action cannot
                                be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDeleteJob(job)}
                                className="bg-jb-danger hover:bg-jb-danger/90 text-white"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-jb-text-muted mb-4">{emptyStateMessage}</p>
          <Button
            onClick={() => navigate('/employer/jobs/create')}
            className="bg-jb-primary hover:bg-jb-primary/90 text-white"
          >
            Post a Job
          </Button>
        </div>
      )}
    </div>

  );
};

export default PostedJobsList;
