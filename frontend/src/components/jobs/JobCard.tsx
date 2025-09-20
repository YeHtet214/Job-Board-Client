import React from 'react';
import { Job } from '@/types/job';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Briefcase, Calendar, Bookmark, BookmarkCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSaveJob, useRemoveSavedJob, useJobsData } from '@/hooks/react-queries/job';
import { JobSavedStatus } from '@/types/saved-job';
import { useAuth } from '@/contexts/authContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '../ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface JobCardProps {
  job: Job;
  savedStatus?: JobSavedStatus;
}

const JobCard: React.FC<JobCardProps> = ({ job, savedStatus }) => {
  const { handleJobView } = useJobsData();
  const navigate = useNavigate(); 
  const { toast } = useToast();
  const { currentUser, isAuthenticated } = useAuth();
  const isJobSeeker = currentUser?.role === 'JOBSEEKER';
  
  // Use mutations for saving/removing jobs
  const saveJobMutation = useSaveJob();
  const removeSavedJobMutation = useRemoveSavedJob();

  // Format data for display
  const companyInitials = job.company?.name?.substring(0, 2).toUpperCase() || 'CO';
  const formattedSalary = `$${job.salaryMin}K - $${job.salaryMax}K`;
  const postedDate = job.createdAt ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true }) : 'Recently';

  // Limit skills to show (to prevent overflow)
  const displaySkills = job.requiredSkills.slice(0, 3);
  const hasMoreSkills = job.requiredSkills.length > 3;

  const handleCardClick = () => {
    handleJobView(job);
    navigate(`/jobs/${job.id}`);
  };

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click

    if (!isAuthenticated || !isJobSeeker) {
      toast({
        title: 'Authentication Required',
        description: 'Please login as a job seeker to save jobs',
        variant: 'default'
      });
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (savedStatus?.isSaved && savedStatus?.savedJobId) {
      removeSavedJobMutation.mutate({
        savedJobId: savedStatus.savedJobId,
        jobId: job.id
      });
    } else if (job.id) {
      saveJobMutation.mutate(job.id);
    }
  };

  return (
    <Card 
      className="h-full flex flex-col hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="flex flex-row items-start gap-3 relative pb-3">
        {job.company?.logo ? (
          <img
            src={job.company.logo}
            alt={job.company.name || 'Company'}
            className="w-12 h-12 rounded-md object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 bg-jobboard-light rounded-md flex items-center justify-center flex-shrink-0">
            <span className="text-jobboard-darkblue font-bold">{companyInitials}</span>
          </div>
        )}

        <div className="flex-1 min-w-0 pr-10 space-y-0">
          <CardTitle className="text-jobboard-darkblue text-lg truncate">{job.title}</CardTitle>
          <CardDescription className="truncate">{job.company?.name || 'Company Name'}</CardDescription>
        </div>

        {isJobSeeker && (
          <div className="absolute top-4 right-4 z-10">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={savedStatus?.isSaved
                      ? "text-jobboard-purple h-8 w-8 p-0 bg-white/90"
                      : "text-gray-400 hover:text-jobboard-purple h-8 w-8 p-0 bg-white/90"}
                    onClick={(e) => handleSaveToggle(e)}
                  >
                    {savedStatus?.isSaved
                      ? <BookmarkCheck className="h-5 w-5" />
                      : <Bookmark className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{savedStatus?.isSaved ? 'Remove from saved jobs' : 'Save job'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col pt-0">
        {/* Job Details */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{job.type}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{job.experienceLevel}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {displaySkills.map((skill, index) => (
            <Badge key={index} variant="outline" className="bg-jobboard-light/30 text-jobboard-darkblue border-none">
              {skill}
            </Badge>
          ))}
          {hasMoreSkills && (
            <Badge variant="outline" className="bg-gray-100 text-gray-600 border-none">
              +{job.requiredSkills.length - 3} more
            </Badge>
          )}
        </div>

        {/* Posted Date */}
        <div className="text-xs text-gray-500 flex items-center mb-4">
          <Calendar className="w-3 h-3 mr-1" />
          <span>Posted {postedDate}</span>
        </div>
      </CardContent>

      <CardFooter className="justify-between items-center pt-3">
        <span className="text-green-600 font-medium text-sm">{formattedSalary}</span>
        <Button
          size="sm"
          className="bg-jobboard-purple hover:bg-jobboard-purple/90"
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            navigate(`/jobs/${job.id}`);
          }}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
