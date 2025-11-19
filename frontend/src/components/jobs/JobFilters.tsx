import { ScrollArea } from '@/components/ui/scroll-area'
import Sidebar from '../layouts/Sidebar'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { Form, InputFieldWithLabel, SelectFieldWithLabel } from '@/components/forms'
import { Formik } from 'formik'
import { JobFilterSchema } from '@/schemas/validation/job.schema'
import { useJobsData } from '@/hooks/react-queries/job'
import { JobFilterType } from '@/types/job'
import CheckboxItems from '../forms/CheckboxItems'

const JobFilters = () => {
    const {
        keyword,
        location,
        jobTypes,
        experienceLevel,
        handleSearch,
        resetFilters,
    } = useJobsData()

    const initialValues: JobFilterType = {
        keyword: keyword || '',
        location: location || '',
        jobTypes: jobTypes || [],
        experienceLevel: experienceLevel || '',
    }

    return (
        <ScrollArea>
            <Sidebar title="Filter Jobs">
                <Formik
                    initialValues={initialValues}
                    validationSchema={JobFilterSchema}
                    onSubmit={handleSearch}
                    enableReinitialize
                >
                    {(formikProps) => (
                        <Form>
                            <div className="space-y-4">
                                <InputFieldWithLabel name="keyword" label="Keyword" placeholder="Job title or keyword" />
                                <InputFieldWithLabel name="location" label="Location" placeholder="City, state, or remote" />
                                <CheckboxItems label="Job Types" name="jobTypes" />
                                <SelectFieldWithLabel label='Experience Level' name="experienceLevel" />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <Button
                                    type="submit"
                                    className="w-full bg-jb-primary hover:bg-jb-primary/90 text-white"
                                >
                                    Apply Filters
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        resetFilters()
                                        formikProps.resetForm()
                                    }}
                                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Reset Filters
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Sidebar>
        </ScrollArea>
    )
}

export default JobFilters
