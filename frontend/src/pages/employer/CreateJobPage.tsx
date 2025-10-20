import React from 'react'
import { CompanyRequiredCheck } from '@/components/company'
import JobPostForm from '@/components/employer/JobPostForm'

const CreateJobPage: React.FC = () => {
    return (
        <div className="container mx-auto max-w-4xl py-10 px-4 sm:px-6">
            <h1 className="text-3xl font-bold mb-8 text-jobboard-darkblue">
                Create Job Posting
            </h1>

            {/* Wrap with CompanyRequiredCheck to ensure employer has created a company profile */}
            <CompanyRequiredCheck>
                <JobPostForm />
            </CompanyRequiredCheck>
        </div>
    )
}

export default CreateJobPage
