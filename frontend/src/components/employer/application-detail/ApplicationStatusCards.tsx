import React from 'react'
import { CalendarDays, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ApplicationStatus } from '@/types/application'
import {
  statusIconMap,
  statusTextMap,
  statusColorMap,
} from '@/utils/dashboard.utils'

interface ApplicationStatusCardsProps {
  status: ApplicationStatus
  formattedAppliedDate: string
  formattedUpdatedDate: string
}

const ApplicationStatusCards: React.FC<ApplicationStatusCardsProps> = ({
  status,
  formattedAppliedDate,
  formattedUpdatedDate,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <Card className="flex-1">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="bg-muted rounded-full p-2">
            {statusIconMap[status] || statusIconMap.PENDING}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge
              className={`mt-1 ${statusColorMap[status]}`}
            >
              {statusTextMap[status]}
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
            <p className="text-sm text-muted-foreground">
              Applied On
            </p>
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
            <p className="text-sm text-muted-foreground">
              Last Updated
            </p>
            <p className="font-medium">{formattedUpdatedDate}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ApplicationStatusCards
