import { useState, useEffect } from 'react'
import { FormikProps } from 'formik'
import { Separator } from '@/components/ui/separator'
import {
    FileText,
    Github,
    Linkedin,
    Globe,
    Upload,
    AlertCircle,
} from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    FileInputFieldWithLabel,
    InputFieldWithLabel,
} from '@/components/forms'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { ProfileFormValues } from './ProfileEditForm'
import { useUploadResume } from '@/hooks/react-queries/profile'

interface LinksTabProps {
    formik: FormikProps<ProfileFormValues>
}

const LinksTab = ({
    formik,
}: LinksTabProps) => {
    const { values, setFieldValue } = formik
    const [resumeUploadError, setResumeUploadError] = useState<string | null>(null)
    const { mutate: uploadResume, isPending: isResumeUploading } = useUploadResume()

    useEffect(() => {
        const resumeFile = values.resume as File | null

        if (resumeFile && resumeFile instanceof File) {
            // Check file size (max 5MB)
            if (resumeFile.size > 5 * 1024 * 1024) {
                setResumeUploadError('File size exceeds the 5MB limit');
                setFieldValue('resume', null); // Clear the file input
                return;
            }

            // Check file type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(resumeFile.type)) {
                setResumeUploadError('Only PDF, DOC, and DOCX files are allowed');
                setFieldValue('resume', null); // Clear the file input
                return;
            }

            // Upload the file
            uploadResume(resumeFile, {
                onSuccess: () => {
                    setResumeUploadError(null)
                    setFieldValue('resume', null)
                },
                onError: (error) => {
                    setResumeUploadError('Failed to upload resume. Please try again.')
                    console.error('Resume upload error:', error)
                    setFieldValue('resume', null)
                }
            })
        }
    }, [values.resume, uploadResume, setFieldValue])

    return (
        <Card className="border-none shadow-none">
            <CardHeader className="px-0 md:px-6">
                <CardTitle className="text-xl md:text-2xl text-jobboard-darkblue">
                    Links & Resume
                </CardTitle>
                <CardDescription className="text-gray-500">
                    Add your professional profiles and resume
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 px-0 md:px-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Professional Links</h3>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center gap-2">
                            <Linkedin className="h-5 w-5 text-[#0077B5]" />
                            <InputFieldWithLabel
                                formik={true}
                                name="linkedInUrl"
                                label="LinkedIn Profile"
                                placeholder="https://linkedin.com/in/yourprofile"
                                className="flex-1"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Github className="h-5 w-5" />
                            <InputFieldWithLabel
                                formik={true}
                                name="githubUrl"
                                label="GitHub Profile"
                                placeholder="https://github.com/yourusername"
                                className="flex-1"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-blue-500" />
                            <InputFieldWithLabel
                                formik={true}
                                name="portfolioUrl"
                                label="Portfolio Website"
                                placeholder="https://yourportfolio.com"
                                className="flex-1"
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Resume</h3>

                    <div className="border border-dashed rounded-lg p-4 bg-muted">
                        {values.resumeUrl && (
                            <>
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-8 w-8 text-jobboard-darkblue" />
                                        <div>
                                            <p className="font-medium">
                                                Resume uploaded
                                            </p>
                                            <p className="text-sm text-gray-500 truncate max-w-xs">
                                                {values.resumeUrl.split('/').pop()}
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={values.resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-card border rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 focus:outline-none"
                                    >
                                        View Resume
                                    </a>
                                </div>

                                <div className="flex flex-col items-center justify-center p-4">
                                    <Upload className="h-12 w-12 text-gray-300 mb-2" />
                                    <p className="mb-4 text-center">
                                        Upload your resume (PDF, DOC, or DOCX up to 5MB)
                                    </p>

                                    <div className="w-full max-w-md">
                                        <FileInputFieldWithLabel
                                            name="resume"
                                            label=""
                                            description=""
                                            accept=".pdf,.doc,.docx"
                                            required={false}
                                            showPreview={false}
                                        />

                                        {isResumeUploading && (
                                            <div className="mt-2 flex items-center justify-center text-sm text-gray-500">
                                                <LoadingSpinner size="sm" className="mr-2" />
                                                Uploading resume...
                                            </div>
                                        )}
                                    </div>

                                    {resumeUploadError && (
                                        <div className="mt-2 flex items-center text-red-500 text-sm">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {resumeUploadError}
                                        </div>
                                    )}
                                </div>
                            </>

                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default LinksTab
