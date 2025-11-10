import { FormikProps } from 'formik'
import { FieldArray } from 'formik'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Upload, User as UserIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TextareaField, InputFieldWithLabel } from '@/components/forms'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { ProfileFormValues } from './ProfileEditForm'
import { useProfile } from '@/hooks/react-queries/profile'

interface BasicInfoTabProps {
    formik: FormikProps<ProfileFormValues>
    onProfileImageUpload: (file: File) => Promise<void>
    profileImageURL?: string
}

const BasicInfoTab = ({
    formik,
    onProfileImageUpload,
    profileImageURL,
}: BasicInfoTabProps) => {
    const { values, setFieldValue } = formik
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)
    const { data: profile } = useProfile()

    console.log('PROFILE IMAGE URL ', profile?.profileImageURL)

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Check file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file')
            return
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB')
            return
        }

        try {
            setIsUploading(true)
            await onProfileImageUpload(file)
        } catch (error) {
            console.error('Error uploading profile image:', error)
        } finally {
            setIsUploading(false)
            // Reset the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    // Function to handle adding a new skill
    const handleAddSkill = () => {
        // Get the new skill value from formik (could be defined in initialValues)
        const skillToAdd = values.newSkill?.trim()

        // Add the skill if it's not empty and not already in the list
        if (
            skillToAdd &&
            (!values.skills || !values.skills.includes(skillToAdd))
        ) {
            // Update the skills array
            setFieldValue('skills', [...(values.skills || []), skillToAdd])

            // Clear the input field
            setFieldValue('newSkill', '')
        }
    }

    return (
        <Card className="border-none shadow-none">
            <CardHeader className="px-0 md:px-6">
                <CardTitle className="text-xl md:text-2xl text-jb-primary">
                    Basic Information
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                    Tell us about yourself
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-0 md:px-6">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center overflow-hidden border-2 border-border">
                            {profile?.profileImageURL ? (
                                <img
                                    src={profile?.profileImageURL}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <UserIcon className="h-12 w-12 text-muted-foreground/50" />
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={triggerFileInput}
                            disabled={isUploading}
                            className="absolute -bottom-2 -right-2 bg-background p-1.5 rounded-full shadow-md border border-border text-foreground hover:bg-accent/50 transition-colors"
                        >
                            {isUploading ? (
                                <LoadingSpinner className="h-4 w-4" />
                            ) : (
                                <Upload className="h-4 w-4" />
                            )}
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                            disabled={isUploading}
                        />
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            JPG, GIF or PNG. Max size of 5MB.
                        </p>
                    </div>
                </div>
                <div className="border-t border-gray-200 my-6"></div>
                <TextareaField
                    formik={true}
                    name="bio"
                    label="Bio"
                    placeholder="Write a brief introduction about yourself..."
                    className="min-h-32"
                    rows={6}
                />

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-jb-text-muted-foreground mb-1">
                        Skills
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                        <FieldArray
                            name="skills"
                            render={(arrayHelpers) => (
                                <>
                                    {values?.skills &&
                                        values.skills.map((skill, index) => (
                                            <Badge
                                                key={index}
                                                className="bg-jb-text/75 text-jb-surface/80 font-light hover:bg-jobboard-purple/90 flex items-center gap-1 px-3 py-1.5"
                                            >
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        arrayHelpers.remove(
                                                            index
                                                        )
                                                    }
                                                    className="ml-1 text-jb-surface/80 cursor-pointer p-0.5 hover:text-jb-surface"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </Badge>
                                        ))}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex gap-2 items-center">
                        <InputFieldWithLabel
                            formik={true}
                            name="newSkill"
                            label=""
                            placeholder="Add a skill..."
                            className="flex-1"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddSkill}
                        >
                            <Plus className="h-4 w-4 mr-1" /> Add
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default BasicInfoTab
