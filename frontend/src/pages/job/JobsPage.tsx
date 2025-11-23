import { Link } from 'react-router-dom'
import { Briefcase } from 'lucide-react'

import JobFilters from '@/components/jobs/JobFilters'
import JobList from '@/components/jobs/JobList'
import RecentlyViewedJobs from '@/components/jobs/RecentlyViewedJobs'
import { Button } from '@/components/ui/button'
import Pagination from '@/components/Pagination'
import { useJobsData } from '@/hooks'
import { useAuth } from '@/contexts/authContext'
import { useCallback } from 'react'

const JobsPage = () => {
    const { currentUser } = useAuth()
    const { totalPages, handlePageChange, isViewedByCurrentUser } = useJobsData()
    const isViewedByUser = (useCallback(() => currentUser ? isViewedByCurrentUser(currentUser?.id) : false, [currentUser]))()
   
    return (
        <>
            {/* Hero Section */}
            <section className="relative py-20 bg-jb-surface dark:bg-jb-bg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-jb-primary/10 to-jb-primary/5 dark:from-jb-primary/20 dark:to-jb-primary/10 pointer-events-none" />

                <div className="container relative z-10 mx-auto px-4 text-center">
                    <h1 className="font-sans text-4xl md:text-5xl font-bold text-jb-text mb-4 tracking-tight">
                        Find Your Dream Job
                    </h1>
                    <p className="font- text-lg text-jb-text-muted max-w-2xl mx-auto">
                        Discover thousands of job opportunities with the top
                        employers across various industries.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-10 bg-jb-bg">
                <div className="container mx-auto px-4">
                    {/* Desktop Layout */}
                    <div className="hidden md:flex gap-6">
                        {/* Sidebar with filters */}
                        <div className="w-1/4 flex-shrink-0">
                            <div className="sticky top-4 bg-jb-surface border border-border rounded-lg shadow-sm p-5">
                                <div className="flex items-center mb-4">
                                    <Briefcase className="w-5 h-5 text-jb-primary mr-2" />
                                    <h2 className="text-lg font-semibold text-jb-text">
                                        Filters
                                    </h2>
                                </div>
                                <JobFilters />
                            </div>
                        </div>

                        {/* Job Listings */}
                        <div className="w-3/4 space-y-6">
                            <div className="bg-jb-surface border border-border rounded-lg shadow-sm p-5">
                                <JobList />
                                <Pagination
                                    handlePageChange={(event: { selected: number }) => handlePageChange(event.selected + 1)}
                                    totalPages={totalPages} />
                            </div>

                            {/* Recently Viewed */}
                            {
                                isViewedByUser && (
                                    <div className="bg-jb-surface border border-border rounded-lg shadow-sm p-5">
                                        <h2 className="text-lg font-semibold text-jb-text mb-4">
                                            Recently Viewed Jobs
                                        </h2>
                                        <RecentlyViewedJobs />
                                    </div>
                                )
                            }

                            {/* CTA for Employers */}
                            <div className="bg-gradient-to-r from-jb-primary to-jb-success rounded-lg shadow-md p-6 text-center">
                                <h2 className="text-xl font-bold text-white mb-3">
                                    Looking to Hire?
                                </h2>
                                <p className="text-white/90 mb-4 text-sm">
                                    Post your job openings and connect with
                                    qualified candidates.
                                </p>
                                <Link to="/employer/jobs">
                                    <Button className="bg-jb-surface text-jb-text font-semibold hover:bg-muted">
                                        Post a Job
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden flex flex-col gap-6">
                        <div className="bg-jb-surface border border-border rounded-lg shadow-sm p-5">
                            <div className="flex items-center mb-4">
                                <Briefcase className="w-5 h-5 text-jb-primary mr-2" />
                                <h2 className="text-lg font-semibold text-jb-text">
                                    Filters
                                </h2>
                            </div>
                            <JobFilters />
                        </div>

                        <div className="bg-jb-surface border border-border rounded-lg shadow-sm p-5">
                            <JobList />
                            <Pagination
                                handlePageChange={(event: { selected: number }) => handlePageChange(event.selected + 1)}
                                totalPages={totalPages} />
                        </div>

                        <div className="bg-jb-surface border border-border rounded-lg shadow-sm p-5">
                            <h2 className="text-lg font-semibold text-jb-text mb-4">
                                Recently Viewed Jobs
                            </h2>
                            <RecentlyViewedJobs />
                        </div>

                        <div className="bg-gradient-to-r from-jb-primary to-jb-success rounded-lg shadow-md p-6 text-center">
                            <h2 className="text-xl font-bold text-white mb-3">
                                Looking to Hire?
                            </h2>
                            <p className="text-white/90 mb-4 text-sm">
                                Post your job openings and connect with
                                qualified candidates.
                            </p>
                            <Link to="/employer/jobs/create">
                                <Button className="w-full bg-jb-surface text-jb-text font-semibold hover:bg-muted">
                                    Post a Job
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default JobsPage
