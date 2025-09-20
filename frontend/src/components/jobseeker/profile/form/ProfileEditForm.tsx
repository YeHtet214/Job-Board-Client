import { Profile } from '@/types/profile';
import { Formik, Form } from 'formik';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, BookOpen, Building, Link } from 'lucide-react';
import BasicInfoTab from '@/components/jobseeker/profile/form/BasicInfoTab';
import EducationTab from '@/components/jobseeker/profile/form/EducationTab';
import ExperienceTab from '@/components/jobseeker/profile/form/ExperienceTab';
import LinksTab from '@/components/jobseeker/profile/form/LinksTab';
import { ProfileValidationSchema } from '@/schemas/validation/profile.shcema';

// Extended profile type for form fields
export interface ProfileFormValues extends Profile {
  newSkill?: string; // Form-specific field for adding new skills
}

interface ProfileEditFormProps {
  profile: ProfileFormValues;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleSubmit: (values: ProfileFormValues) => Promise<void>;
  handleResumeUpload: (file: File) => Promise<void>;
  handleProfileImageUpload: (file: File) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isUploading: boolean;
}

const ProfileEditForm = ({ 
  profile, 
  activeTab, 
  setActiveTab, 
  handleSubmit, 
  handleResumeUpload,
  handleProfileImageUpload,
  isCreating,
  isUpdating,
  isUploading
}: ProfileEditFormProps) => {
  // Create the extended initial values
  const initialValues: ProfileFormValues = {
    ...profile,
    newSkill: '' // Add the form-specific field
  };

  // Custom submit handler that strips form-specific fields before submitting
  const handleFormSubmit = async (values: ProfileFormValues) => {
    // Extract only the Profile fields (omitting newSkill)
    const { newSkill, ...profileData } = values;
    await handleSubmit(profileData);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full mb-8">
        <TabsTrigger value="info" className="text-xs sm:text-sm md:text-base flex-1 whitespace-nowrap">
          <User className="h-3 w-3 hidden sm:inline-block sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span>Basic Info</span>
        </TabsTrigger>
        <TabsTrigger value="education" className="text-xs sm:text-sm md:text-base flex-1 whitespace-nowrap">
          <BookOpen className="h-3 w-3 hidden sm:inline-block sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span>Education</span>
        </TabsTrigger>
        <TabsTrigger value="experience" className="text-xs sm:text-sm md:text-base flex-1 whitespace-nowrap">
          <Building className="h-3 w-3 hidden sm:inline-block sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span>Experience</span>
        </TabsTrigger>
        <TabsTrigger value="links" className="text-xs sm:text-sm md:text-base flex-1 whitespace-nowrap">
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
                isSaving={isCreating || isUpdating}
                onTabChange={setActiveTab}
                onProfileImageUpload={handleProfileImageUpload}
                profileImageURL={profile.profileImageURL}
              />
            </TabsContent>

            <TabsContent value="education" className="mt-0">
              <EducationTab
                formik={formik}
                isSaving={isCreating || isUpdating}
                onTabChange={setActiveTab}
              />
            </TabsContent>

            <TabsContent value="experience" className="mt-0">
              <ExperienceTab
                formik={formik}
                isSaving={isCreating || isUpdating}
                onTabChange={setActiveTab}
              />
            </TabsContent>

            <TabsContent value="links" className="mt-0">
              <LinksTab
                formik={formik}
                isSaving={isCreating || isUpdating}
                onTabChange={setActiveTab}
                onResumeUpload={handleResumeUpload}
                isResumeUploading={isUploading}
              />
            </TabsContent>
          </Form>
        )}
      </Formik>
    </Tabs>
  );
};

export default ProfileEditForm;
