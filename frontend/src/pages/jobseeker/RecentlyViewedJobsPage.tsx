import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/authContext";
import { useJobsData } from "@/hooks/react-queries/job";
import { formatDate, formatSalaryRange } from "@/lib/formatters";
import { Job } from "@/types/job";
import { Trash2 } from "lucide-react";

const JobCard = ({ job }: { job: Job }) => {

  console.log("Jobs for recent: ", job)
  if (!job || typeof job !== 'object') return null

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold text-gray-800">
              {job.title}
            </CardTitle>
            <p className="text-sm text-gray-600">{job.company?.name}</p>
          </div>
          <p className="text-xs text-gray-500">
            {job.createdAt && formatDate(job.createdAt)}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-2">{job.location}</p>
        <p className="text-sm text-gray-600 mb-2">
          {job.type?.replace('_', ' ')}
        </p>
        <p className="text-lg font-semibold text-green-600">
          {formatSalaryRange(job.salaryMin, job.salaryMax)}
        </p>
      </CardContent>
    </Card>
  );
}

const RecentlyViewedJobsPage = () => {
  const { currentUser } = useAuth()
  const { recentlyViewedJobs, handleJobView } = useJobsData()

  if (!currentUser || !currentUser.id) return <h1>You've not logged in to view recent jobs</h1>

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <Card className="bg-white shadow-md rounded-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <CardTitle className="text-3xl font-bold text-gray-800 mb-2 md:mb-0">
              Recently Viewed Jobs
            </CardTitle>
            <Button
              variant="destructive"
              onClick={() => handleJobView(currentUser?.id!, {} as Job, true)}
              className="flex items-center"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear History
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentlyViewedJobs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentlyViewedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">
                You have not viewed any jobs recently.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentlyViewedJobsPage;