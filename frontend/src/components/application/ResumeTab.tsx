import React from 'react'
import { FileInputFieldWithLabel, TextareaField } from '@/components/forms'

const ResumeTab: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* // Resume */}
            <div className="border-b-2 border-gray-200 pb-4">
                <h3 className="text-lg font-medium">Resume / CV</h3>
                <p className="text-sm text-gray-500 mb-4">
                    Upload your resume or use one from your profile.
                </p>

                <FileInputFieldWithLabel
                    name="resume"
                    label="Upload Resume"
                    description="Accepted formats: PDF, DOC, DOCX"
                    accept=".pdf,.doc,.docx"
                    required={true}
                    formik={true}
                />
            </div>

            {/* // Cover Letter */}
            <div className="pb-4">
                <h3 className="text-lg font-medium">Cover Letter</h3>
                <p className="text-sm text-gray-500 mb-4">
                    Tell the employer why you're a good fit for this position.
                </p>

                <TextareaField
                    name="coverLetter"
                    label="Cover Letter"
                    placeholder="Write your cover letter here..."
                    required={true}
                />

                <div className="mt-2">
                    <p className="text-xs text-gray-500">
                        Tips for a great cover letter:
                    </p>
                    <ul className="list-disc pl-5 text-xs text-gray-500 mt-1 space-y-1">
                        <li>
                            Introduce yourself and explain why you're interested
                            in this position
                        </li>
                        <li>
                            Highlight your most relevant skills and experience
                        </li>
                        <li>
                            Explain how your background makes you a good fit
                        </li>
                        <li>
                            End with a call to action, inviting the employer to
                            contact you
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ResumeTab
