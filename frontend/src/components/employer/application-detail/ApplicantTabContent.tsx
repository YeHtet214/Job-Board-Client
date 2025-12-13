import React from 'react'
import { User, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'

interface ApplicantTabContentProps {
  applicant: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    location?: string
  }
  applicantId: string
}

const ApplicantTabContent: React.FC<ApplicantTabContentProps> = ({
  applicant,
  applicantId,
}) => {
  return (
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
              {applicant.firstName} {applicant.lastName}
            </p>
          </div>

          {applicant.email && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm bg-muted p-3 rounded-md flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                <a
                  href={`mailto:${applicant.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {applicant.email}
                </a>
              </p>
            </div>
          )}

          {applicant.phone && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Phone Number</p>
              <p className="text-sm bg-muted p-3 rounded-md flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                <a
                  href={`tel:${applicant.phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {applicant.phone}
                </a>
              </p>
            </div>
          )}

          {applicant.location && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Location</p>
              <p className="text-sm bg-muted p-3 rounded-md flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                {applicant.location}
              </p>
            </div>
          )}
        </div>

        {/* Profile link */}
        <div className="pt-4 border-t border-border">
          <Link to={`/profile/${applicantId}`} >
            <Button variant="outline">
              <User className="h-4 w-4 mr-2" />
              View Full Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default ApplicantTabContent
