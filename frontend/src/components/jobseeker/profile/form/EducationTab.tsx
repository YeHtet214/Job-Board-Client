import { FieldArray, FormikProps } from 'formik'
import { X, Plus, GraduationCap } from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    InputFieldWithLabel,
    TextareaField,
    CheckboxField,
} from '@/components/forms'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { ProfileFormValues } from './ProfileEditForm'

interface EducationTabProps {
    formik: FormikProps<ProfileFormValues>
}

const EducationTab = ({ formik }: EducationTabProps) => {
    const { values } = formik

    return (
        <Card className="border-none shadow-none">
            <CardHeader className="px-0 md:px-6">
                <CardTitle className="text-xl md:text-2xl text-jobboard-darkblue">
                    Education
                </CardTitle>
                <CardDescription className="text-gray-500">
                    Add your educational background
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-0 md:px-6">
                <FieldArray
                    name="education"
                    render={(arrayHelpers) => (
                        <div className="space-y-8">
                            {values?.education &&
                            values.education.length > 0 ? (
                                values.education.map((_, index) => (
                                    <div
                                        key={index}
                                        className="relative p-4 sm:p-6 border rounded-lg"
                                    >
                                        <button
                                            type="button"
                                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                                            onClick={() =>
                                                arrayHelpers.remove(index)
                                            }
                                        >
                                            <X className="h-5 w-5" />
                                        </button>

                                        <div className="flex items-center mb-4">
                                            <GraduationCap className="mr-2 h-6 w-6 text-jobboard-purple" />
                                            <h3 className="text-lg font-medium">
                                                Education #{index + 1}
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                            <InputFieldWithLabel
                                                formik={true}
                                                name={`education.${index}.institution`}
                                                label="Institution"
                                                placeholder="e.g. Harvard University"
                                            />

                                            <InputFieldWithLabel
                                                formik={true}
                                                name={`education.${index}.degree`}
                                                label="Degree"
                                                placeholder="e.g. Bachelor of Science"
                                            />

                                            <InputFieldWithLabel
                                                formik={true}
                                                name={`education.${index}.fieldOfStudy`}
                                                label="Field of Study"
                                                placeholder="e.g. Computer Science"
                                            />

                                            <div className="space-y-2 col-span-2 flex items-center gap-2">
                                                <CheckboxField
                                                    formik={true}
                                                    name={`education.${index}.isCurrent`}
                                                    label="I currently study here"
                                                />
                                            </div>

                                            <InputFieldWithLabel
                                                formik={true}
                                                name={`education.${index}.startDate`}
                                                label="Start Date"
                                                placeholder="YYYY-MM-DD"
                                            />

                                            <InputFieldWithLabel
                                                formik={true}
                                                name={`education.${index}.endDate`}
                                                label="End Date"
                                                placeholder="YYYY-MM-DD"
                                            />

                                            <TextareaField
                                                formik={true}
                                                name={`education.${index}.description`}
                                                label="Description (Optional)"
                                                placeholder="Add more details about your education..."
                                                className="min-h-20 col-span-2"
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <GraduationCap className="mx-auto h-12 w-12 text-gray-300" />
                                    <p className="mt-4 text-gray-500">
                                        No education added yet. Add your first
                                        education entry.
                                    </p>
                                </div>
                            )}

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full mt-4"
                                onClick={() =>
                                    arrayHelpers.push({
                                        institution: '',
                                        degree: '',
                                        fieldOfStudy: '',
                                        startDate: '',
                                        endDate: '',
                                        isCurrent: false,
                                        description: '',
                                    })
                                }
                            >
                                <Plus className="h-4 w-4 mr-2" /> Add Education
                            </Button>
                        </div>
                    )}
                />
            </CardContent>
        </Card>
    )
}

export default EducationTab
