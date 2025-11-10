import { Application, ApplicationStatus } from '@/types/application'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../ui/card'
import {
    Building,
    Calendar,
    Clock,
    MapPin,
    FileText,
    CheckCircle2,
    XCircle,
    User2,
    AlertCircle,
} from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { formatDistanceToNow } from 'date-fns'
import { useNavigate } from 'react-router-dom'

interface ApplicationCardProps {
    application: Application
}

const getStatusConfig = (status: ApplicationStatus) => {
    switch (status) {
        case 'PENDING':
            return {
                color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                icon: <Clock className="h-4 w-4 mr-1" />,
            }
        case 'REVIEWING':
            return {
                color: 'bg-blue-100 text-blue-800 border-blue-200',
                icon: <FileText className="h-4 w-4 mr-1" />,
            }
        case 'INTERVIEW':
            return {
                color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
                icon: <User2 className="h-4 w-4 mr-1" />,
            }
        case 'ACCEPTED':
            return {
                color: 'bg-green-100 text-green-800 border-green-200',
                icon: <CheckCircle2 className="h-4 w-4 mr-1" />,
            }
        case 'REJECTED':
            return {
                color: 'bg-red-100 text-red-800 border-red-200',
                icon: <XCircle className="h-4 w-4 mr-1" />,
            }
        default:
            return {
                color: 'bg-gray-100 text-gray-800 border-gray-200',
                icon: <AlertCircle className="h-4 w-4 mr-1" />,
            }
    }
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
    const navigate = useNavigate()
    const { color, icon } = getStatusConfig(application.status)
    const appliedDate = new Date(application.createdAt)
    const timeAgo = formatDistanceToNow(appliedDate, { addSuffix: true })

    return (
        <Card className="mb-4 hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl text-jobboard-darkblue">
                            {application.job?.title || 'Unnamed Position'}
                        </CardTitle>
                        <CardDescription className="flex items-center mt-1">
                            <Building className="h-4 w-4 mr-1 text-gray-500" />
                            {application.job?.company?.name ||
                                'Unknown Company'}
                        </CardDescription>
                    </div>
                    <Badge className={`${color} flex items-center px-2 py-1`}>
                        {icon}
                        {application.status}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="pb-2">
                <div className="space-y-2">
                    {application.job?.location && (
                        <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            {application.job.location}
                        </div>
                    )}

                    <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        Applied {timeAgo}
                    </div>

                    {application.coverLetter && (
                        <div className="mt-2">
                            <h4 className="text-sm font-medium text-gray-700 mb-1">
                                Cover Letter
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {application.coverLetter}
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="pt-2 flex justify-between items-center">
                <div className="text-xs text-gray-500">
                    Last updated:{' '}
                    {new Date(application.updatedAt).toLocaleDateString()}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() =>
                        navigate(`/jobseeker/applications/${application.id}`)
                    }
                >
                    View Details
                </Button>
            </CardFooter>
        </Card>
    )
}

export default ApplicationCard
