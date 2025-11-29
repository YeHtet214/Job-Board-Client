import { useState, useMemo } from 'react'
import { useAuth } from '@/contexts/authContext'
import { useParams } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Profile } from '@/types/profile'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import {
    useProfile,
    useCreateProfile,
    useUpdateProfile,
    useUploadResume,
    useUploadProfileImage,
} from '@/hooks/react-queries/profile/useProfileQueries'

import ProfileOverview from '@/components/jobseeker/profile/ProfileOverview'
import ProfileTabs from '@/components/jobseeker/profile/ProfileTabs'
import ProfileEditForm, {
    ProfileFormValues,
} from '@/components/jobseeker/profile/form/ProfileEditForm'

const initialProfile: Profile = {
    id: '',
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    bio: '',
    skills: [],
    education: [],
    experience: [],
    resumeUrl: '',
    linkedInUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    createdAt: '',
    updatedAt: '',
}

const ProfilePage = () => {
    const { currentUser } = useAuth()
    const { id } = useParams()
    const [activeTab, setActiveTab] = useState('info')
    const [editMode, setEditMode] = useState(false)

    const { data: profile, isLoading } = useProfile(id!)
    const { mutate: createProfile, isPending: isCreating } = useCreateProfile()
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile()
    const { mutate: uploadResume, isPending: isUploading } = useUploadResume()
    const { mutate: uploadProfileImage } = useUploadProfileImage()

    const isAuthorized = useMemo(() => (currentUser?.id === profile?.userId && currentUser?.role === 'JOBSEEKER'), [currentUser, profile])

    console.log("profile data in profile page: ", profile)

    const handleSubmit = async (values: ProfileFormValues) => {
        try {
            if (profile?.id) {
                await updateProfile(values)
            } else {
                await createProfile(values as any)
            }
        } catch (error) {
            console.error('Error saving profile:', error)
        } finally {
            setEditMode(false)
        }
    }

    const handleResumeUpload = async (file: File) => {
        await uploadResume(file)
    }

    const handleProfileImageUpload = async (file: File) => {
        await uploadProfileImage(file)
    }

    const enterEditMode = () => {
        if (!isAuthorized) return
        setEditMode(true)
        setActiveTab('info')
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-jb-bg text-jb-text">
                <LoadingSpinner />
            </div>
        )
    }

    if (!profile && isAuthorized) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto max-w-5xl py-10 px-4 sm:px-6 text-jb-text"
            >
                <h1 className="text-3xl font-bold mb-4 text-jb-text">
                    Profile
                </h1>

                {(!editMode) ? (
                    <ProfileOverview enterEditMode={enterEditMode} />
                ) : (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.5 }}
                        className="mt-8"
                    >
                        <Card className="border border-jb-primary/20 shadow-md bg-jb-surface">
                            <CardContent className="pt-6">
                                <ProfileEditForm
                                    profile={initialProfile}
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                    handleSubmit={handleSubmit}
                                    handleResumeUpload={handleResumeUpload}
                                    handleProfileImageUpload={
                                        handleProfileImageUpload
                                    }
                                    isCreating={isCreating}
                                    isUpdating={isUpdating}
                                    isUploading={isUploading}
                                />
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </motion.div>
        )
    }

    if (editMode && isAuthorized) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto max-w-5xl py-10 px-4 sm:px-6 text-jb-text"
            >
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Edit Profile</h1>
                    <Button
                        onClick={() => setEditMode(false)}
                        variant="outline"
                        className="border-jb-text-muted text-jb-text hover:bg-jb-muted/10"
                    >
                        Cancel
                    </Button>
                </div>

                <Card className="border border-jb-primary/20 shadow-md bg-jb-surface">
                    <CardContent className="pt-6">
                        <ProfileEditForm
                            profile={profile || initialProfile}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            handleSubmit={handleSubmit}
                            handleResumeUpload={handleResumeUpload}
                            handleProfileImageUpload={handleProfileImageUpload}
                            isCreating={isCreating}
                            isUpdating={isUpdating}
                            isUploading={isUploading}
                        />
                    </CardContent>
                </Card>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto max-w-5xl py-10 px-4 sm:px-6 text-jb-text"
        >
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-jb-text">Profile</h1>
                {isAuthorized && (
                    <Button
                        onClick={enterEditMode}
                        variant="outline"
                        className="flex items-center gap-2 border-jb-primary text-jb-text hover:bg-jb-primary/10"
                    >
                        <Pencil className="h-4 w-4" />
                        <span>Edit Profile</span>
                    </Button>
                )}
            </div>

            {profile && (
                <ProfileTabs profile={profile} />
            )}
        </motion.div>
    )


}

export default ProfilePage
