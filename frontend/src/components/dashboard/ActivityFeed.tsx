import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { formatDate } from '@/utils/dashboard.utils'

interface ActivityItem {
    id: string | number
    title: string
    relatedEntity: string
    timestamp: string
    type: string
}

interface ActivityFeedProps {
    activities: ActivityItem[]
    title?: string
    description?: string
    getActivityIcon: (type: string) => React.ReactNode
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
    activities,
    title = 'Recent Activity',
    description = 'Your latest activity',
    getActivityIcon,
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.length > 0 ? (
                        activities.map((activity, index) => (
                            <div key={`${activity.id}-${index}`} className="flex gap-3">
                                <div className="mt-1">
                                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        {activity.title}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {activity.relatedEntity} •{' '}
                                        {formatDate(activity.timestamp)}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">
                            No recent activity to show
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default ActivityFeed
