import { Profile } from '@/types/profile'
import { Formik, Form } from 'formik'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, BookOpen, Building, Link } from 'lucide-react'
import BasicInfoTab from '@/components/jobseeker/profile/form/BasicInfoTab'
import EducationTab from '@/components/jobseeker/profile/form/EducationTab'
import ExperienceTab from '@/components/jobseeker/profile/form/ExperienceTab'
import LinksTab from '@/components/jobseeker/profile/form/LinksTab'
import { ProfileValidationSchema } from '@/schemas/validation/profile.shcema'
import { Button } from '@/components/ui/button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useToast } from '@/components/ui/use-toast'

// Extended profile type for form fields
export interface ProfileFormValues extends Profile {
    newSkill?: string // Form-specific field for adding new skills
    resume?: File | null
}

interface ProfileEditFormProps {
    profile: ProfileFormValues
    activeTab: string
    setActiveTab: (tab: string) => void
    handleSubmit: (values: ProfileFormValues) => Promise<void>
    isCreating: boolean
    isUpdating: boolean
}

const ProfileEditForm = ({
    profile,
    activeTab,
    setActiveTab,
    handleSubmit,
    isCreating,
    isUpdating,
}: ProfileEditFormProps) => {
    const { toast } = useToast()
    // Create the extended initial values
    const initialValues: ProfileFormValues = {
        ...profile,
        newSkill: '', // Add the form-specific field
    }

    // Custom submit handler that strips form-specific fields before submitting
    const handleFormSubmit = async (values: ProfileFormValues) => {
        // Extract only the Profile fields (omitting newSkill)

        const { skills, education, experience } = values
        if (
            skills.length < 2 ||
            education.length < 1 ||
            experience.length < 1
        ) {
            toast({
                title: 'Profile Incomplete',
                description:
                    'Please add at least 2 skills, an education and an experience',
                variant: 'destructive',
            })
            return
        }

        const { newSkill, ...profileData } = values

        await handleSubmit(profileData)
    }

    const changeNextTab = () => {
        const currentIndex = [
            'info',
            'education',
            'experience',
            'links',
        ].indexOf(activeTab)
        const nextIndex = (currentIndex + 1) % 4
        setActiveTab(['info', 'education', 'experience', 'links'][nextIndex])
    }

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full mb-8 bg-jb-bg border border-jb-border">
                <TabsTrigger
                    value="info"
                    className="text-xs sm:text-sm md:text-base flex-1 whitespace-nowrap cursor-pointer hover:bg-jb-surface hover:font-bold"
                >
                    <User className="h-3 w-3 hidden sm:inline-block sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span>Basic Info</span>
                </TabsTrigger>
                <TabsTrigger
                    value="education"
                    className="text-xs sm:text-sm md:text-base flex-1 whitespace-nowrap cursor-pointer hover:bg-jb-surface hover:font-bold"
                >
                    <BookOpen className="h-3 w-3 hidden sm:inline-block sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span>Education</span>
                </TabsTrigger>
                <TabsTrigger
                    value="experience"
                    className="text-xs sm:text-sm md:text-base flex-1 whitespace-nowrap cursor-pointer hover:bg-jb-surface hover:font-bold"
                >
                    <Building className="h-3 w-3 hidden sm:inline-block sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span>Experience</span>
                </TabsTrigger>
                <TabsTrigger
                    value="links"
                    className="text-xs sm:text-sm md:text-base flex-1 whitespace-nowrap cursor-pointer hover:bg-jb-surface hover:font-bold"
                >
                    <Link className="h-3 w-3 hidden sm:inline-block sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span>Links & Resume</span>
                </TabsTrigger>
            </TabsList>

            <Formik
                initialValues={initialValues}
                validationSchema={ProfileValidationSchema}
                onSubmit={handleFormSubmit}
                enableReinitialize
            >
                {(formik) => (
                    <Form className="space-y-6">
                        <TabsContent value="info" className="mt-0">
                            <BasicInfoTab
                                formik={formik}
                                profileImageURL={profile.profileImageURL}
                            />
                        </TabsContent>

                        <TabsContent value="education" className="mt-0">
                            <EducationTab formik={formik} />
                        </TabsContent>

                        <TabsContent value="experience" className="mt-0">
                            <ExperienceTab formik={formik} />
                        </TabsContent>

                        <TabsContent value="links" className="mt-0">
                            <LinksTab
                                formik={formik}
                            />
                        </TabsContent>

                        <div className="flex justify-end gap-2">
                            <Button
                                type="submit"
                                disabled={isCreating || isUpdating}
                            >
                                {isCreating || isUpdating ? (
                                    <span className="flex items-center">
                                        <LoadingSpinner
                                            size="sm"
                                            className="mr-2"
                                        />
                                        Saving...
                                    </span>
                                ) : (
                                    'Save'
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={changeNextTab}
                            >
                                Next
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Tabs>
    )
}

export default ProfileEditForm
