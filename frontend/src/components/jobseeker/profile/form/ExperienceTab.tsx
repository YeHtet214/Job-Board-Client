import { FieldArray, FormikProps } from 'formik';
import { X, Plus, Briefcase } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputFieldWithLabel, TextareaField, CheckboxField } from '@/components/forms';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ProfileFormValues } from './ProfileEditForm';

interface ExperienceTabProps {
  formik: FormikProps<ProfileFormValues>;
}

const ExperienceTab = ({ formik }: ExperienceTabProps) => {
  const { values } = formik;

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0 md:px-6">
        <CardTitle className="text-xl md:text-2xl text-jobboard-darkblue">Work Experience</CardTitle>
        <CardDescription className="text-gray-500">
          Add your work history to showcase your professional experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0 md:px-6">
        <FieldArray
          name="experience"
          render={arrayHelpers => (
            <div className="space-y-8">
              {values?.experience && values.experience.length > 0 ? (
                values.experience.map((_, index) => (
                  <div key={index} className="relative p-4 sm:p-6 border rounded-lg">
                    <button
                      type="button"
                      className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                      onClick={() => arrayHelpers.remove(index)}
                    >
                      <X className="h-5 w-5" />
                    </button>

                    <div className="flex items-center mb-4">
                      <Briefcase className="mr-2 h-6 w-6 text-jobboard-purple" />
                      <h3 className="text-lg font-medium">Experience #{index + 1}</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <InputFieldWithLabel
                        formik={true}
                        name={`experience.${index}.company`}
                        label="Company"
                        placeholder="e.g. Google Inc."
                      />

                      <InputFieldWithLabel
                        formik={true}
                        name={`experience.${index}.position`}
                        label="Position"
                        placeholder="e.g. Software Engineer"
                      />

                      <InputFieldWithLabel
                        formik={true}
                        name={`experience.${index}.location`}
                        label="Location (Optional)"
                        placeholder="e.g. San Francisco, CA"
                      />

                      <div className="space-y-2 col-span-2 flex items-center gap-2">
                        <CheckboxField
                          formik={true}
                          name={`experience.${index}.isCurrent`}
                          label="I currently work here"
                        />
                      </div>

                      <InputFieldWithLabel
                        formik={true}
                        name={`experience.${index}.startDate`}
                        label="Start Date"
                        placeholder="YYYY-MM-DD"
                      />
                      
                      <InputFieldWithLabel
                        formik={true}
                        name={`experience.${index}.endDate`}
                        label="End Date"
                        placeholder="YYYY-MM-DD"
                      />

                      <TextareaField
                        formik={true}
                        name={`experience.${index}.description`}
                        label="Description"
                        placeholder="Describe your responsibilities, achievements, and skills used in this role..."
                        className="min-h-32 col-span-2"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-4 text-gray-500">No work experience added yet. Add your first job.</p>
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                className="w-full mt-4"
                onClick={() => arrayHelpers.push({
                  company: '',
                  position: '',
                  location: '',
                  startDate: '',
                  endDate: '',
                  isCurrent: false,
                  description: ''
                })}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Experience
              </Button>
            </div>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default ExperienceTab;
