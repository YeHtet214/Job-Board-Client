import React from 'react'
import { FileText, ExternalLink, Download, Mail, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ApplicationStatus } from '@/types/application'

interface ApplicationTabContentProps {
  resumeUrl?: string
  coverLetter?: string
  status: ApplicationStatus
}

const ApplicationTabContent: React.FC<ApplicationTabContentProps> = ({
  resumeUrl,
  coverLetter,
  status,
}) => {
  return (
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
          {resumeUrl ? (
            <div className="space-y-4">
              <div className="border border-dashed rounded-lg p-4 text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Resume uploaded with this application
                </p>
                <div className="flex justify-center gap-3">
                  <Button variant="outline" asChild>
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Resume
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={resumeUrl} download>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-dashed rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">
                No resume was uploaded with this application
              </p>
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
          {coverLetter ? (
            <div className="border rounded-lg p-4">
              <p className="text-sm whitespace-pre-wrap">
                {coverLetter}
              </p>
            </div>
          ) : (
            <div className="border border-dashed rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">
                No cover letter was included with this
                application
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interview information (shown if status is INTERVIEW) */}
      {status === 'INTERVIEW' && (
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
                This application is currently in the interview
                stage. You may want to contact the applicant to
                schedule an interview or provide additional
                information about the interview process.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ApplicationTabContent
