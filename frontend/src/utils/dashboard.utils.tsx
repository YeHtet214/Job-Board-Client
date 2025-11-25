import { Badge } from '@/components/ui/badge'
import {
    Eye,
    FileText,
    Bookmark,
    Mail,
    Calendar,
    Briefcase,
    Clock,
} from 'lucide-react'

export const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date)
}

// Job Seeker status badges
export const getJobSeekerStatusBadge = (status: string) => {
    switch (status) {
        case 'PENDING':
            return (
                <Badge
                    variant="outline"
                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                >
                    Pending
                </Badge>
            )
        case 'INTERVIEW':
            return (
                <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                >
                    Interview
                </Badge>
            )
        case 'REJECTED':
            return (
                <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200"
                >
                    Rejected
                </Badge>
            )
        case 'ACCEPTED':
            return (
                <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                >
                    Accepted
                </Badge>
            )
        default:
            return null
    }
}

// Employer application status badges
export const getEmployerStatusBadge = (status: string) => {
    switch (status) {
        case 'PENDING':
            return (
                <Badge
                    variant="outline"
                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                >
                    Pending
                </Badge>
            )
        case 'REVIEWING':
            return (
                <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                >
                    Reviewing
                </Badge>
            )
        case 'INTERVIEW':
            return (
                <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-purple-200"
                >
                    Interview
                </Badge>
            )
        case 'REJECTED':
            return (
                <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200"
                >
                    Rejected
                </Badge>
            )
        case 'ACCEPTED':
            return (
                <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                >
                    Accepted
                </Badge>
            )
        default:
            return null
    }
}

// Job status badges
export const getJobStatusBadge = (status: string) => {
    switch (status) {
        case 'ACTIVE':
            return (
                <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                >
                    Active
                </Badge>
            )
        case 'EXPIRED':
            return (
                <Badge
                    variant="outline"
                    className="bg-gray-50 text-gray-700 border-gray-200"
                >
                    Expired
                </Badge>
            )
        case 'DRAFT':
            return (
                <Badge
                    variant="outline"
                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                >
                    Draft
                </Badge>
            )
        default:
            return null
    }
}

// Activity icons for job seekers
export const getJobSeekerActivityIcon = (type: string) => {
    switch (type) {
        case 'VIEW':
            return <Eye className="h-4 w-4 text-blue-500" />
        case 'APPLY':
            return <FileText className="h-4 w-4 text-green-500" />
        case 'SAVE':
            return <Bookmark className="h-4 w-4 text-purple-500" />
        case 'MESSAGE':
            return <Mail className="h-4 w-4 text-yellow-500" />
        default:
            return null
    }
}

// Activity icons for employers
export const getEmployerActivityIcon = (type: string) => {
    switch (type) {
        case 'NEW_APPLICATION':
            return <FileText className="h-4 w-4 text-blue-500" />
        case 'APPLICATION_VIEWED':
            return <Eye className="h-4 w-4 text-purple-500" />
        case 'JOB_POSTED':
            return <Briefcase className="h-4 w-4 text-green-500" />
        case 'JOB_EXPIRED':
            return <Clock className="h-4 w-4 text-red-500" />
        case 'INTERVIEW_SCHEDULED':
            return <Calendar className="h-4 w-4 text-yellow-500" />
        default:
            return null
    }
}

// Application Status Maps
import {
    Clock as ClockIcon,
    MailOpen,
    Calendar as CalendarIcon,
    CheckCircle2,
    XCircle,
} from 'lucide-react'
import { ApplicationStatus } from '@/types/application'

export const statusIconMap = {
    PENDING: <ClockIcon className="h-5 w-5 text-yellow-500" />,
    REVIEWING: <MailOpen className="h-5 w-5 text-blue-500" />,
    INTERVIEW: <CalendarIcon className="h-5 w-5 text-purple-500" />,
    ACCEPTED: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    REJECTED: <XCircle className="h-5 w-5 text-red-500" />,
}

export const statusTextMap = {
    PENDING: 'Pending Review',
    REVIEWING: 'Under Review',
    INTERVIEW: 'Interview Scheduled',
    ACCEPTED: 'Application Accepted',
    REJECTED: 'Application Rejected',
}

export const statusColorMap = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    REVIEWING: 'bg-blue-100 text-blue-800',
    INTERVIEW: 'bg-purple-100 text-purple-800',
    ACCEPTED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
}

export const statusOptions: { label: string; value: ApplicationStatus }[] = [
    { label: 'Mark as Reviewing', value: 'REVIEWING' },
    { label: 'Schedule Interview', value: 'INTERVIEW' },
    { label: 'Accept Applicant', value: 'ACCEPTED' },
    { label: 'Reject Application', value: 'REJECTED' },
]
