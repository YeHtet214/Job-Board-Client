import React from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface DashboardStatCardProps {
    title: string
    value: number | string
    icon: React.ReactNode
    borderColorClass: string
    bgColorClass?: string
}

const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
    title,
    value,
    icon,
    borderColorClass,
    bgColorClass = `${borderColorClass.replace('border-l-', '')}/10`,
}) => {
    return (
        <Card className={`border-l-4 ${borderColorClass}`}>
            <CardContent className="">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">
                            {title}
                        </p>
                        <p className="text-2xl font-bold mt-1">{value}</p>
                    </div>
                    <div
                        className={`h-12 w-12 ${bgColorClass} rounded-full flex items-center justify-center`}
                    >
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default DashboardStatCard
