import { useState, useEffect, useRef } from 'react'
import { FormikProps } from 'formik'
import { Separator } from '@/components/ui/separator'
import {
    FileText,
    Github,
    Linkedin,
    Globe,
    Upload,
    AlertCircle,
    CheckCircle,
    X,
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
import { Button } from '@/components/ui/button'

interface LinksTabProps {
    formik: FormikProps<ProfileFormValues>
    onUploadStatusChange?: (isUploading: boolean) => void
    onResumeUploaded: (fileId: string) => void
    currentResumeId?: string
}

const LinksTab = ({
    formik,
    onUploadStatusChange,
    onResumeUploaded,
    currentResumeId,
}: LinksTabProps) => {
    const { values } = formik // Only destructure values, use formik.setFieldValue directly
    const [resumeUploadError, setResumeUploadError] = useState<string | null>(null)
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
    const { mutate: uploadResume, isPending: isResumeUploading } = useUploadResume()

    const processedFileRef = useRef<File | null>(null)

    useEffect(() => {
        onUploadStatusChange?.(isResumeUploading)
    }, [isResumeUploading, onUploadStatusChange])

    useEffect(() => {
        const resumeFile = values.resume

        // Only process if we have a new file and it's different from the last processed file
        if (resumeFile && resumeFile instanceof File && resumeFile !== processedFileRef.current) {
            processedFileRef.current = resumeFile

            const maxSize = 5 * 1024 * 1024; // 5MB limit
            if (resumeFile.size > maxSize) {
                setResumeUploadError('File size must be less than 5MB');
                formik.setFieldValue('resume', null);
                processedFileRef.current = null;
                return;
            }

            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(resumeFile.type)) {
                setResumeUploadError('Only PDF, DOC, and DOCX files are allowed');
                formik.setFieldValue('resume', null);
                processedFileRef.current = null;
                return;
            }

            // Upload the file
            uploadResume(resumeFile, {
                onSuccess: (fileId: string) => {
                    setResumeUploadError(null)
                    setUploadedFileName(resumeFile.name)

                    onResumeUploaded(fileId)

                },
                onError: (error) => {
                    console.error('Resume upload error:', error)
                    setResumeUploadError('Failed to upload resume. Please try again.')
                    formik.setFieldValue('resume', null)
                    if (onResumeUploaded) {
                        onResumeUploaded('')
                    }
                    processedFileRef.current = null
                }
            })
        }
    }, [values.resume, formik, onResumeUploaded])

    const handleRemoveResume = () => {
        formik.setFieldValue('resume', null)
        if (onResumeUploaded) {
            onResumeUploaded('')
        }
        setUploadedFileName(null)
        setResumeUploadError(null)
        processedFileRef.current = null
    }

    // Show uploaded state if we have a currentResumeId (from parent/profile) OR if we just uploaded a file
    // Note: If we have currentResumeId but no uploadedFileName, it means it's a pre-existing resume.
    // We might want to show a generic "Resume Uploaded" message or fetch the name if possible.
    // For now, we'll assume if currentResumeId exists, we show the success state.
    const hasUploadedResume = !!currentResumeId

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

                    {/* Show uploaded resume status */}
                    {hasUploadedResume && (
                        <div className="border border-green-200 rounded-lg p-4 bg-green-50 mb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                    <div>
                                        <p className="font-medium text-green-900">
                                            Resume uploaded successfully
                                        </p>
                                        <p className="text-sm text-green-700 truncate max-w-xs">
                                            {uploadedFileName || "Existing Resume"}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleRemoveResume}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-100"
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    Remove
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Upload section */}
                    {!hasUploadedResume && (
                        <div className="border border-dashed rounded-lg p-6 bg-muted">
                            <div className="flex flex-col items-center justify-center">
                                <Upload className="h-12 w-12 text-gray-400 mb-3" />
                                <p className="mb-1 text-center font-medium">
                                    Upload your resume
                                </p>
                                <p className="mb-4 text-center text-sm text-gray-500">
                                    PDF, DOC, or DOCX (max 5MB)
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
                                        <div className="mt-3 flex items-center justify-center text-sm text-blue-600 bg-blue-50 p-3 rounded-md">
                                            <LoadingSpinner size="sm" className="mr-2" />
                                            Uploading resume...
                                        </div>
                                    )}

                                    {resumeUploadError && (
                                        <div className="mt-3 flex items-center text-red-600 text-sm bg-red-50 p-3 rounded-md">
                                            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                                            {resumeUploadError}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default LinksTab
