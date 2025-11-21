import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Briefcase, Clock, MapPin, Star, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDistanceToNow } from 'date-fns'
import { Job, JobType } from '@/types/job'
import { useFeaturedJobs, useJobsData } from '@/hooks'

// Mapping for job type display and styles
const jobTypeConfig: Record<JobType, { label: string; className: string }> = {
    FULL_TIME: {
        label: 'Full Time',
        className: 'bg-green-100 text-green-800 hover:bg-green-100',
    },
    PART_TIME: {
        label: 'Part Time',
        className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    },
    CONTRACT: {
        label: 'Contract',
        className: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
    },
}

interface FeaturedJobsSectionProps {
    jobsRef: React.RefCallback<HTMLElement>
    jobsInView: boolean
    fadeIn: any
    staggerContainer: any
    cardVariants: any
}

const FeaturedJobsSection: React.FC<FeaturedJobsSectionProps> = ({
    jobsRef,
    jobsInView,
    fadeIn,
    staggerContainer,
    cardVariants,
}) => {
    const { handleJobView } = useJobsData()
    const { data, isLoading } = useFeaturedJobs()
    const featuredJobs = data?.jobs

    console.log("Featured Jobs: ", featuredJobs)

    const renderJobCard = (job: Job) => {
        const typeInfo = jobTypeConfig[job.type] ?? {
            label: job.type,
            className: 'bg-gray-100 text-gray-800 hover:bg-gray-100', // leave badge as is
        }

        return (
            <motion.article
                key={job.id}
                variants={cardVariants}
                whileHover="hover"
            >
                <Link
                    to={`/jobs/${job.id}`}
                    onClick={() => handleJobView(job)}
                    className="block h-full"
                >
                    <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow duration-300 bg-jb-surface">
                        <CardContent className="p-5 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-3">
                                <div className="w-10 h-10 bg-jb-surface rounded-md flex items-center justify-center">
                                    {job.company?.logo ? (
                                        <img
                                            src={job.company.logo}
                                            alt={job.company.name}
                                            className="w-full h-full object-contain rounded"
                                        />
                                    ) : (
                                        <Briefcase
                                            className="w-5 h-5 text-jb-primary"
                                            aria-hidden="true"
                                        />
                                    )}
                                </div>

                                <Badge
                                    className={`${typeInfo.className} rounded-full text-xs font-medium py-1`}
                                >
                                    {typeInfo.label}
                                </Badge>
                            </div>

                            <h3 className="text-base font-semibold text-jb-text mb-1 line-clamp-1">
                                {job.title}
                            </h3>
                            <p className="text-jb-text-muted text-sm mb-3 line-clamp-1">
                                {job.company?.name || 'Company'}
                            </p>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-jb-text-muted text-xs">
                                    <MapPin
                                        className="w-3.5 h-3.5 mr-1.5"
                                        aria-hidden="true"
                                    />
                                    <span className="line-clamp-1">
                                        {job.location}
                                    </span>
                                </div>
                                <div className="flex items-center text-jb-text-muted text-xs">
                                    <Clock
                                        className="w-3.5 h-3.5 mr-1.5"
                                        aria-hidden="true"
                                    />
                                    <span>
                                        Posted{' '}
                                        {formatDistanceToNow(
                                            new Date(job.createdAt),
                                            { addSuffix: true }
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center text-jb-text-muted text-xs">
                                    <Star
                                        className="w-3.5 h-3.5 mr-1.5 text-yellow-400"
                                        aria-hidden="true"
                                    />
                                    <span>
                                        {job.salaryMin && job.salaryMax
                                            ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()} / year`
                                            : 'Salary not specified'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-auto">
                                {job.requiredSkills
                                    .slice(0, 3)
                                    .map((skill, index) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className="bg-jb-bg text-xs font-medium py-1 border border-jb-text-muted"
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                {job.requiredSkills.length > 3 && (
                                    <Badge
                                        variant="outline"
                                        className="bg-jb-bg text-xs font-medium py-1 border border-jb-text-muted"
                                    >
                                        +{job.requiredSkills.length - 3}
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </motion.article>
        )
    }

    const renderSkeletonCard = (index: number) => (
        <motion.div key={`skeleton-${index}`} variants={cardVariants}>
            <Card className="h-full bg-jb-surface border-none shadow-sm">
                <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                        <Skeleton className="w-10 h-10 rounded-md bg-jb-bg" />
                        <Skeleton className="w-20 h-6 rounded-full bg-jb-bg" />
                    </div>
                    <Skeleton className="h-5 w-3/4 mb-1 bg-jb-bg" />
                    <Skeleton className="h-4 w-1/2 mb-3 bg-jb-bg" />
                    <div className="space-y-2 mb-4">
                        <Skeleton className="h-3 w-full bg-jb-bg" />
                        <Skeleton className="h-3 w-3/4 bg-jb-bg" />
                        <Skeleton className="h-3 w-2/3 bg-jb-bg" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {[...Array(3)].map((_, idx) => (
                            <Skeleton
                                key={idx}
                                className="h-6 w-16 rounded-full bg-jb-bg"
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )

    if (isLoading) {
        return Array.from({ length: 8 }).map((_, i) => renderSkeletonCard(i))
    }

    return (
        <motion.section
            ref={jobsRef}
            initial="hidden"
            animate={jobsInView ? 'visible' : 'hidden'}
            variants={fadeIn}
            className="py-16 bg-jb-bg"
        >
            <div className="container mx-auto px-4 sm:px-6">
                <div className="text-center mb-12">
                    <motion.h2
                        className="text-2xl font-bold mb-4 inline-block relative text-jb-text"
                        variants={fadeIn}
                    >
                        Featured Jobs
                        <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-jb-danger"></span>
                    </motion.h2>
                    <motion.p
                        className="text-jb-text-muted max-w-2xl mx-auto mt-4"
                        variants={fadeIn}
                    >
                        Discover opportunities from top companies and find your
                        perfect role.
                    </motion.p>
                </div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    variants={staggerContainer}
                >
                    { featuredJobs.map(renderJobCard) }
                </motion.div>

                <div className="mt-10 text-center">
                    <Button
                        asChild
                        variant="outline"
                        className="border-jb-primary text-jb-primary hover:bg-jb-primary hover:text-white transition-all duration-300"
                    >
                        <Link to="/jobs" className="inline-flex items-center">
                            View All Jobs
                            <ChevronRight
                                className="w-4 h-4 ml-1"
                                aria-hidden="true"
                            />
                        </Link>
                    </Button>
                </div>
            </div>
        </motion.section>
    )
}

export default FeaturedJobsSection
