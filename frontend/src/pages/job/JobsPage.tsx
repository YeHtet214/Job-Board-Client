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
    const isViewedByUser = useCallback(() => currentUser ? isViewedByCurrentUser(currentUser?.id) : false, [currentUser, isViewedByCurrentUser])()

    console.log("Is viewed by current user: ", isViewedByUser)

    return (
        <div className="min-h-screen bg-jb-bg flex flex-col">
            {/* Hero Section */}
            <section className="relative py-24 bg-jb-surface dark:bg-jb-bg overflow-hidden border-b border-jb-border">
                <div className="absolute inset-0 bg-gradient-to-tr from-jb-primary/5 to-transparent dark:from-jb-primary/10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-jb-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-jb-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="container relative z-10 mx-auto px-4 text-center">
                    <h1 className="font-sans text-4xl md:text-6xl font-bold text-jb-text mb-6 tracking-tight">
                        Find Your <span className="text-jb-primary">Dream Job</span>
                    </h1>
                    <p className="text-lg md:text-xl text-jb-text-muted max-w-2xl mx-auto leading-relaxed">
                        Discover thousands of job opportunities with top
                        employers across various industries. Your next career move starts here.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="flex-grow py-12 bg-jb-bg">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar with filters */}
                        <aside className="w-full lg:w-1/4 flex-shrink-0">
                            <div className="sticky top-24 space-y-6">
                                <div className="bg-jb-surface border border-jb-border rounded-xl shadow-sm p-6">
                                    <div className="flex items-center mb-6 pb-4 border-b border-jb-border">
                                        <Briefcase className="w-5 h-5 text-jb-primary mr-2.5" />
                                        <h2 className="text-lg font-bold text-jb-text">
                                            Filters
                                        </h2>
                                    </div>
                                    <JobFilters />
                                </div>

                                {/* CTA for Employers - Desktop/Tablet */}
                                <div className="hidden lg:block bg-gradient-to-br from-jb-primary to-jb-primary/80 rounded-xl shadow-lg p-6 text-center text-white relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <h2 className="text-xl font-bold mb-3 relative z-10">
                                        Looking to Hire?
                                    </h2>
                                    <p className="text-white/90 mb-6 text-sm relative z-10">
                                        Post your job openings and connect with
                                        qualified candidates today.
                                    </p>
                                    <Link to="/employer/jobs/create" className="relative z-10 block">
                                        <Button className="w-full bg-white text-jb-primary font-bold hover:bg-white/90 border-none shadow-md">
                                            Post a Job
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </aside>

                        {/* Job Listings */}
                        <main className="w-full lg:w-3/4 space-y-6">
                            <div className="bg-jb-surface border border-jb-border rounded-xl shadow-sm p-6 min-h-[500px]">
                                <JobList />
                                <div className="mt-8">
                                    <Pagination
                                        handlePageChange={(event: { selected: number }) => handlePageChange(event.selected + 1)}
                                        totalPages={totalPages}
                                    />
                                </div>
                            </div>

                            {/* Recently Viewed */}
                            {isViewedByUser && (
                                <div className="bg-jb-surface border border-jb-border rounded-xl shadow-sm p-6">
                                    <h2 className="text-lg font-bold text-jb-text mb-6 flex items-center">
                                        <span className="w-1.5 h-6 bg-jb-primary rounded-full mr-3"></span>
                                        Recently Viewed Jobs
                                    </h2>
                                    <RecentlyViewedJobs />
                                </div>
                            )}

                            {/* CTA for Employers - Mobile */}
                            <div className="lg:hidden bg-gradient-to-br from-jb-primary to-jb-primary/80 rounded-xl shadow-lg p-6 text-center text-white">
                                <h2 className="text-xl font-bold mb-3">
                                    Looking to Hire?
                                </h2>
                                <p className="text-white/90 mb-6 text-sm">
                                    Post your job openings and connect with
                                    qualified candidates.
                                </p>
                                <Link to="/employer/jobs/create">
                                    <Button className="w-full bg-white text-jb-primary font-bold hover:bg-white/90 border-none shadow-md">
                                        Post a Job
                                    </Button>
                                </Link>
                            </div>
                        </main>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default JobsPage
