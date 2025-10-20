import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CompanyRequiredCheck } from '../../components/company'
import JobPostForm from '../../components/employer/JobPostForm'
import { useJob } from '../../hooks/react-queries/job/useJobQueries'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { AlertCircle } from 'lucide-react'

const EditJobPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { data: job, isLoading, isError } = useJob(id || '')

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner fullScreen />
            </div>
        )
    }

    if (isError || !job) {
        return (
            <div className="container mx-auto max-w-4xl py-10 px-4 sm:px-6">
                <Card className="p-8 text-center">
                    <div className="flex flex-col items-center">
                        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">
                            Job Not Found
                        </h2>
                        <p className="text-gray-600 mb-6">
                            The job posting you're trying to edit doesn't exist
                            or has been removed.
                        </p>
                        <Button
                            onClick={() => navigate('/employer/jobs')}
                            className="bg-jobboard-darkblue hover:bg-jobboard-darkblue/90"
                        >
                            Back to Jobs
                        </Button>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto max-w-4xl py-10 px-4 sm:px-6">
            <h1 className="text-3xl font-bold mb-8 text-jobboard-darkblue">
                Edit Job Posting
            </h1>

            <CompanyRequiredCheck>
                <JobPostForm job={job} isEditing={true} />
            </CompanyRequiredCheck>
        </div>
    )
}

export default EditJobPage
