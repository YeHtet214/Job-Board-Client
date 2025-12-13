import { ScrollArea } from '@/components/ui/scroll-area'

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
        <ScrollArea className="h-full">
            <Formik
                initialValues={initialValues}
                validationSchema={JobFilterSchema}
                onSubmit={handleSearch}
                enableReinitialize
            >
                {(formikProps) => (
                    <Form>
                        <div className="space-y-5">
                            <InputFieldWithLabel
                                name="keyword"
                                label="Keyword"
                                placeholder="Job title or keyword"
                                className="bg-jb-bg border-jb-border focus:ring-jb-primary/20"
                            />
                            <InputFieldWithLabel
                                name="location"
                                label="Location"
                                placeholder="City, state, or remote"
                                className="bg-jb-bg border-jb-border focus:ring-jb-primary/20"
                            />
                            <div className="pt-2">
                                <CheckboxItems label="Job Types" name="jobTypes" />
                            </div>
                            <SelectFieldWithLabel
                                label='Experience Level'
                                name="experienceLevel"
                            />
                        </div>

                        <div className="flex flex-col space-y-3 mt-8 pt-6 border-t border-jb-border">
                            <Button
                                type="submit"
                                className="w-full bg-jb-primary hover:bg-jb-primary/90 text-white font-semibold shadow-sm"
                            >
                                Apply Filters
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    resetFilters()
                                    formikProps.resetForm()
                                }}
                                className="w-full text-jb-text-muted hover:text-jb-text hover:bg-jb-surface-muted flex items-center justify-center"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Reset Filters
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </ScrollArea>
    )
}

export default JobFilters
