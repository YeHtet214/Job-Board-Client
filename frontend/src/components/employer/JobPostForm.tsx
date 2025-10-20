import { useState, useEffect, useRef } from 'react'
import { Formik, FormikHelpers } from 'formik'
import { useNavigate } from 'react-router-dom'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useToast } from '@/components/ui/use-toast'
import { Job, CreateJobDto, JobType } from '@/types/job'
import {
    useCreateJob,
    useUpdateJob,
} from '@/hooks/react-queries/job/useJobQueries'
import {
    Form,
    InputFieldWithLabel,
    TextareaField,
    SelectFieldWithLabel,
    DatePickerFieldWithLabel,
} from '@/components/forms'
import { JobSchema } from '@/schemas/validation/job.schema'

interface JobPostFormProps {
    job?: Job
    isEditing?: boolean
}

// Job type options
const jobTypeOptions = [
    { value: 'FULL_TIME', label: 'Full Time' },
    { value: 'PART_TIME', label: 'Part Time' },
    { value: 'CONTRACT', label: 'Contract' },
]

// Experience level options
const experienceLevelOptions = [
    { value: 'ENTRY_LEVEL', label: 'Entry Level' },
    { value: 'MID_LEVEL', label: 'Mid Level' },
    { value: 'SENIOR', label: 'Senior' },
    { value: 'EXECUTIVE', label: 'Executive' },
]

const JobPostForm = ({ job, isEditing = false }: JobPostFormProps) => {
    const navigate = useNavigate()
    const { toast } = useToast()
    const [skills, setSkills] = useState<string[]>(job?.requiredSkills || [])
    const [skillInput, setSkillInput] = useState('')
    const formikRef = useRef<any>(null)

    useEffect(() => setSkills(job?.requiredSkills || []), [job])

    // Handle skill input
    const handleAddSkill = () => {
        if (skillInput.trim() && !skills.includes(skillInput.trim())) {
            const newSkills = [...skills, skillInput.trim()]
            setSkills(newSkills)
            setSkillInput('')
            if (formikRef.current) {
                formikRef.current.setFieldValue('requiredSkills', newSkills)
            }
        }
    }

    const handleRemoveSkill = (skillToRemove: string) => {
        const newSkills = skills.filter((skill) => skill !== skillToRemove)
        setSkills(newSkills)
        if (formikRef.current) {
            formikRef.current.setFieldValue('requiredSkills', newSkills)
        }
    }

    // React Query mutations
    const createJob = useCreateJob()
    const updateJob = useUpdateJob()

    const initialValues: CreateJobDto = {
        title: job?.title || '',
        description: job?.description || '',
        location: job?.location || '',
        type: job?.type || ('FULL_TIME' as JobType),
        salaryMin: job?.salaryMin || 0,
        salaryMax: job?.salaryMax || 0,
        requiredSkills: job?.requiredSkills || [],
        experienceLevel: job?.experienceLevel || 'ENTRY_LEVEL',
        expiresAt: job?.expiresAt
            ? new Date(job.expiresAt).toISOString().split('T')[0]
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split('T')[0], // Default to 30 days from now
    }

    // Handle form submission
    const handleSubmit = async (
        values: CreateJobDto,
        { setSubmitting }: FormikHelpers<CreateJobDto>
    ) => {
        try {
            // Ensure required skills are set
            if (values.requiredSkills.length === 0) {
                toast({
                    title: 'Validation Error',
                    description: 'Please add at least one required skill',
                    variant: 'destructive',
                })
                return
            }

            // Submit the form
            if (isEditing && job) {
                await updateJob.mutateAsync({ id: job.id, job: values })
                toast({
                    title: 'Job Updated',
                    description:
                        'Your job posting has been updated successfully',
                })
            } else {
                await createJob.mutateAsync(values)
                toast({
                    title: 'Job Posted',
                    description:
                        'Your job posting has been created successfully',
                })
            }

            // Navigate to job listings after successful submission
            navigate('/employer/jobs')
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'An error occurred'
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            })
        } finally {
            setSubmitting(false)
        }
    }

    const formikSubmitting = createJob.isPending || updateJob.isPending

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {isEditing ? 'Edit Job' : 'Post a New Job'}
                </CardTitle>
                <CardDescription>
                    {isEditing
                        ? 'Update your job posting'
                        : 'Create a new job posting to attract the best candidates'}
                </CardDescription>
            </CardHeader>

            <Formik
                initialValues={initialValues}
                validationSchema={JobSchema}
                onSubmit={handleSubmit}
                innerRef={formikRef}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <CardContent className="space-y-6">
                            <InputFieldWithLabel
                                formik={true}
                                name="title"
                                label="Job Title"
                                placeholder="e.g. Senior React Developer"
                                required
                                disabled={isSubmitting || formikSubmitting}
                            />

                            <TextareaField
                                formik={true}
                                name="description"
                                label="Job Description"
                                placeholder="Describe the job responsibilities, requirements, benefits, etc."
                                rows={8}
                                required
                                disabled={isSubmitting || formikSubmitting}
                            />

                            <InputFieldWithLabel
                                formik={true}
                                name="location"
                                label="Location"
                                placeholder="e.g. New York, NY or Remote"
                                required
                                disabled={isSubmitting || formikSubmitting}
                            />

                            <SelectFieldWithLabel
                                formik={true}
                                name="type"
                                label="Job Type"
                                options={jobTypeOptions}
                                placeholder="Select job type"
                                required
                                disabled={isSubmitting || formikSubmitting}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputFieldWithLabel
                                    formik={true}
                                    name="salaryMin"
                                    label="Minimum Salary"
                                    placeholder="e.g. 50000"
                                    required
                                    disabled={isSubmitting || formikSubmitting}
                                />

                                <InputFieldWithLabel
                                    formik={true}
                                    name="salaryMax"
                                    label="Maximum Salary"
                                    placeholder="e.g. 80000"
                                    required
                                    disabled={isSubmitting || formikSubmitting}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-jb-text-muted-foreground">
                                    Required Skills{' '}
                                    <span className="text-jb-danger">*</span>
                                </label>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={skillInput}
                                        onChange={(e) =>
                                            setSkillInput(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                handleAddSkill()
                                            }
                                        }}
                                        placeholder="Enter a skill"
                                        className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-jb-primary focus:border-jb-primary sm:text-sm"
                                        disabled={
                                            isSubmitting || formikSubmitting
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddSkill}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-jb-primary hover:bg-jb-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jb-primary"
                                        disabled={
                                            isSubmitting || formikSubmitting
                                        }
                                    >
                                        Add
                                    </button>
                                </div>
                                {skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-jb-primary/10 text-jb-primary"
                                            >
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveSkill(skill)
                                                    }
                                                    className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-jb-primary/20 text-jb-primary hover:bg-jb-primary/30 focus:outline-none cursor-pointer"
                                                >
                                                    <span className="sr-only">
                                                        Remove skill
                                                    </span>
                                                    <svg
                                                        className="w-2 h-2"
                                                        fill="currentColor"
                                                        viewBox="0 0 8 8"
                                                    >
                                                        <path d="M8 0.8L7.2 0 4 3.2 0.8 0 0 0.8 3.2 4 0 7.2 0.8 8 4 4.8 7.2 8 8 7.2 4.8 4 8 0.8z" />
                                                    </svg>
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {formikRef.current?.errors.requiredSkills &&
                                    formikRef.current?.touched
                                        .requiredSkills && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {
                                                formikRef.current.errors
                                                    .requiredSkills
                                            }
                                        </p>
                                    )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                <SelectFieldWithLabel
                                    formik={true}
                                    name="experienceLevel"
                                    label="Experience Level"
                                    options={experienceLevelOptions}
                                    placeholder="Select experience level"
                                    required
                                    disabled={isSubmitting || formikSubmitting}
                                />

                                <DatePickerFieldWithLabel
                                    name="expiresAt"
                                    label="Job Posting Expires On"
                                    required
                                    disabled={isSubmitting || formikSubmitting}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/employer/jobs')}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-jb-primary text-white hover:bg-jb-primary/90"
                                disabled={isSubmitting || formikSubmitting}
                            >
                                {isSubmitting || formikSubmitting ? (
                                    <>
                                        <LoadingSpinner
                                            size="sm"
                                            className="mr-2"
                                        />
                                        {isEditing
                                            ? 'Updating...'
                                            : 'Posting...'}
                                    </>
                                ) : isEditing ? (
                                    'Update Job'
                                ) : (
                                    'Post Job'
                                )}
                            </Button>
                        </CardFooter>
                    </Form>
                )}
            </Formik>
        </Card>
    )
}

export default JobPostForm
