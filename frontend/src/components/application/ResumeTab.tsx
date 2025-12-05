import { useState, useEffect } from 'react'
import { FileInputFieldWithLabel, TextareaField } from '@/components/forms'
import { CreateApplicationDto } from '@/types/application'
import { FormikProps } from 'formik'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
    FileText,
    CheckCircle2,
    AlertCircle,
    ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ResumeTab = ({ formik }: { formik: FormikProps<CreateApplicationDto> }) => {
    const [resumeOption, setResumeOption] = useState<'existing' | 'new'>(
        formik.values.useExistingResume ? 'existing' : 'new'
    )

    const hasExistingResume = formik.values.resumeURL

    useEffect(() => {
        formik.setFieldValue('useExistingResume', resumeOption === 'existing')

        // Clear uploaded file if switching to existing resume
        if (resumeOption === 'existing') {
            formik.setFieldValue('resume', null)
        }
    }, [resumeOption])

    const handleResumeOptionChange = (value: 'existing' | 'new') => {
        setResumeOption(value)
    }

    const handleDownloadResume = () => {
        if (formik.values.resumeURL) {
            window.open(formik.values.resumeURL, '_blank')
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <FileText className="h-5 w-5 text-jb-primary" />
                        Resume / CV
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Choose to use your existing resume or upload a new one for this application.
                    </p>
                </div>

                {/* Resume Options */}
                <RadioGroup
                    value={resumeOption}
                    onValueChange={(value) => handleResumeOptionChange(value as 'existing' | 'new')}
                    className="space-y-3"
                >
                    {/* Existing Resume Option */}
                    <Card
                        className={cn(
                            "cursor-pointer transition-all duration-200 border-2",
                            resumeOption === 'existing' && hasExistingResume
                                ? "border-jb-primary bg-jb-primary/5 shadow-sm"
                                : "border-border hover:border-jb-primary/50",
                            !hasExistingResume && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <RadioGroupItem
                                    value="existing"
                                    id="existing-resume"
                                    disabled={!hasExistingResume}
                                    className="mt-1"
                                />
                                <div className="flex-1 space-y-2">
                                    <Label
                                        htmlFor="existing-resume"
                                        className={cn(
                                            "text-base font-medium cursor-pointer flex items-center gap-2",
                                            !hasExistingResume && "cursor-not-allowed"
                                        )}
                                    >
                                        Use Existing Resume from Profile
                                        {hasExistingResume && resumeOption === 'existing' && (
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        )}
                                    </Label>

                                    {hasExistingResume ? (
                                        <div className="space-y-2">
                                            <p className="text-sm text-muted-foreground">
                                                Your resume from your profile will be used for this application.
                                            </p>
                                            <div className="flex items-center gap-2 p-3 bg-background rounded-md border">
                                                <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-foreground truncate">
                                                        Your Resume
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Uploaded to your profile
                                                    </p>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDownloadResume()
                                                    }}
                                                    className="flex-shrink-0"
                                                >
                                                    <ExternalLink className="h-4 w-4 mr-1" />
                                                    View
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start gap-2 text-sm text-amber-600">
                                            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                            <p>
                                                No resume found in your profile. Please upload a resume to your profile or choose to upload a new one below.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upload New Resume Option */}
                    <Card
                        className={cn(
                            "cursor-pointer transition-all duration-200 border-2",
                            resumeOption === 'new'
                                ? "border-jb-primary bg-jb-primary/5 shadow-sm"
                                : "border-border hover:border-jb-primary/50"
                        )}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <RadioGroupItem
                                    value="new"
                                    id="new-resume"
                                    className="mt-1"
                                />
                                <div className="flex-1 space-y-3">
                                    <Label
                                        htmlFor="new-resume"
                                        className="text-base font-medium cursor-pointer flex items-center gap-2"
                                    >
                                        Upload New Resume
                                        {resumeOption === 'new' && formik.values.resume && (
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        )}
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Upload a different resume specifically for this application.
                                    </p>

                                    {resumeOption === 'new' && (
                                        <div className="pt-2" onClick={(e) => e.stopPropagation()}>
                                            <FileInputFieldWithLabel
                                                name="resume"
                                                label="Select Resume File"
                                                description="Accepted formats: PDF, DOC, DOCX (Max 5MB)"
                                                accept=".pdf,.doc,.docx"
                                                disabled={formik.values.useExistingResume}
                                                required={resumeOption === 'new'}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </RadioGroup>

                {/* Validation Message */}
                {formik.touched.resume && formik.errors.resume && resumeOption === 'new' && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <p>{formik.errors.resume}</p>
                    </div>
                )}
            </div>

            {/* Cover Letter Section */}
            <div className="pt-6 border-t">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Cover Letter</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Tell the employer why you're a good fit for this position.
                    </p>
                </div>

                <TextareaField
                    name="coverLetter"
                    label="Cover Letter"
                    placeholder="Dear Hiring Manager,

I am writing to express my strong interest in this position...

[Highlight your relevant experience and skills]

[Explain why you're a great fit]

I look forward to discussing how I can contribute to your team.

Best regards,
[Your Name]"
                    required={true}
                />

                <Card className="mt-4 bg-blue-50/50 border-blue-200">
                    <CardContent className="p-4">
                        <p className="text-sm font-medium text-blue-900 mb-2">
                            💡 Tips for a great cover letter:
                        </p>
                        <ul className="space-y-1.5 text-sm text-blue-800">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Introduce yourself and explain your interest in this specific position</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Highlight 2-3 key achievements relevant to the role</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Show you've researched the company and explain why you want to work there</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Keep it concise (3-4 paragraphs) and professional</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ResumeTab
