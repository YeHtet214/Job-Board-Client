import React, { useEffect } from 'react'
import SavedJobs from '@/components/jobseeker/SavedJobs'
import { BookmarkIcon } from 'lucide-react'

const SavedJobsPage: React.FC = () => {
    // Set document title using useEffect instead of react-helmet-async
    useEffect(() => {
        document.title = 'Saved Jobs | Job Board'
    }, [])

    return (
        <div className="container mx-auto px-4 sm:px-6 py-8">
            <div className="mb-6 flex items-center">
                <BookmarkIcon className="h-6 w-6 mr-2 text-jobboard-purple" />
                <h1 className="text-3xl font-bold text-jobboard-darkblue">
                    Saved Jobs
                </h1>
            </div>

            <SavedJobs />
        </div>
    )
}

export default SavedJobsPage
