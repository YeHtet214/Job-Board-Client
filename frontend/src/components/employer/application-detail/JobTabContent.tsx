import React from 'react'
import { Building, MapPin, Clock, User, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface JobTabContentProps {
  job: {
    title: string
    company?: { name: string }
    location?: string
    jobType?: string
    salary?: string
    description?: string
    requirements?: string
    responsibilities?: string
  }
  jobId: string
}

const JobTabContent: React.FC<JobTabContentProps> = ({ job, jobId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          {job.title || 'Job Title'}
        </CardTitle>
        <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="flex items-center">
            <Building className="h-4 w-4 mr-1" />
            {job.company?.name || 'Company Name'}
          </span>
          <span className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {job.location || 'Location'}
          </span>
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {job.jobType || 'Full-time'}
          </span>
          {job.salary && (
            <span className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {job.salary}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Job Description</h3>
          <div className="text-muted-foreground whitespace-pre-wrap">
            {job.description || 'No job description available'}
          </div>
        </div>

        {job.requirements && (
          <div>
            <h3 className="font-medium mb-2">Requirements</h3>
            <div className="text-muted-foreground whitespace-pre-wrap">
              {job.requirements}
            </div>
          </div>
        )}

        {job.responsibilities && (
          <div>
            <h3 className="font-medium mb-2">Responsibilities</h3>
            <div className="text-muted-foreground whitespace-pre-wrap">
              {job.responsibilities}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t p-6">
        <Button variant="outline" asChild>
          <a
            href={`/jobs/${jobId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Job Posting
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default JobTabContent
