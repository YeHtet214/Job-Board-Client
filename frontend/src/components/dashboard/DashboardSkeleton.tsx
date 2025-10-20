import { Skeleton } from '@/components/ui/skeleton'

const DashboardSkeleton = () => {
    return (
        <div>
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-2 md:!grid-cols-4 gap-4 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="border rounded-lg">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-8 w-16" />
                                </div>
                                <Skeleton className="h-12 w-12 rounded-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div>
                    <div className="border rounded-lg">
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-4">
                                <Skeleton className="h-6 w-40" />
                                <div className="flex space-x-2">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                </div>
                            </div>
                            <div className="space-y-4 mt-4">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="border rounded-lg p-4"
                                    >
                                        <div className="flex justify-between">
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-40" />
                                                <Skeleton className="h-3 w-24" />
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <Skeleton className="h-3 w-16" />
                                                    <Skeleton className="h-5 w-16 rounded-full" />
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-2">
                                                <Skeleton className="h-8 w-16 rounded-md" />
                                                <Skeleton className="h-8 w-8 rounded-md" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Activity Feed Skeleton */}
                    <div className="border rounded-lg">
                        <div className="p-4">
                            <Skeleton className="h-6 w-32 mb-2" />
                            <Skeleton className="h-4 w-48 mb-4" />
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex gap-3">
                                        <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-3 w-4/5" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Profile Completion Skeleton */}
                    <div className="border rounded-lg">
                        <div className="p-4">
                            <Skeleton className="h-6 w-36 mb-2" />
                            <Skeleton className="h-4 w-56 mb-4" />
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <Skeleton className="h-3 w-32" />
                                        <Skeleton className="h-3 w-8" />
                                    </div>
                                    <Skeleton className="h-2 w-full rounded-full" />
                                </div>
                                <div className="space-y-3">
                                    {[...Array(4)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center"
                                        >
                                            <Skeleton className="h-4 w-4 rounded-full mr-2" />
                                            <Skeleton className="h-3 w-40" />
                                        </div>
                                    ))}
                                </div>
                                <Skeleton className="h-9 w-full rounded-md mt-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardSkeleton
