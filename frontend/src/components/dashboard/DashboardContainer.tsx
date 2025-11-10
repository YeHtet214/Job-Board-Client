import React from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface DashboardContainerProps {
    isLoading: boolean
    error: Error | null | unknown
    refetch: () => void
    children: React.ReactNode
    title?: string
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({
    isLoading,
    error,
    refetch,
    children,
    title = 'Dashboard',
}) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto max-w-5xl py-10 px-4 sm:px-6">
                <h1 className="text-3xl font-bold mb-8 text-jobboard-darkblue">
                    {title}
                </h1>
                <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                    <h2 className="text-xl font-semibold text-red-700 mb-2">
                        Error loading dashboard
                    </h2>
                    <p className="text-red-600 mb-4">
                        There was an error loading your dashboard data. Please
                        try refreshing the page.
                    </p>
                    <p className="text-sm text-red-500">
                        {(error as Error)?.message || 'Unknown error occurred'}
                    </p>
                    <Button onClick={refetch} className="mt-4">
                        <RefreshCw className="mr-2" size={16} />
                        Refresh
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto max-w-5xl py-10 px-4 sm:px-6">
            <h1 className="text-3xl font-bold mb-8 text-jobboard-darkblue">
                {title}
            </h1>
            {children}
        </div>
    )
}

export default DashboardContainer
