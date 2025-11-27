import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Eye, UserCheck } from 'lucide-react'
import { formatDate, getEmployerStatusBadge } from '@/utils/dashboard.utils'
import { ReceivedApplication } from '@/types/dashboard'

interface ApplicationTableProps {
  applications: ReceivedApplication[]
  onViewApplication: (id: string) => void
  onUpdateStatus: (application: ReceivedApplication) => void
}

const ApplicationTable: React.FC<ApplicationTableProps> = ({
  applications,
  onViewApplication,
  onUpdateStatus,
}) => {
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Date Applied</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell className="font-medium">
                {application.applicantName}
              </TableCell>
              <TableCell>{application.jobTitle}</TableCell>
              <TableCell>
                {formatDate(application.applied)}
              </TableCell>
              <TableCell>
                {getEmployerStatusBadge(application.status)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onViewApplication(application.id)
                    }
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      onUpdateStatus(application)
                    }
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Update Status
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ApplicationTable
