import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Sidebar from '../layouts/Sidebar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import { Form, InputFieldWithLabel } from '@/components/forms';
import { Formik, FormikProps } from 'formik';
import { JobFilterSchema } from '@/schemas/validation/job.schema';
import { useJobsData } from '@/hooks/react-queries/job';
import { JobFilterType } from '@/types/job';

const JobFilters: React.FC = () => {
  const {
    keyword,
    location,
    jobTypes,
    experienceLevel,
    handleSearch,
    resetFilters
  } = useJobsData();

  const jobTypeOptions = [
    { value: 'FULL_TIME', label: 'Full-time' },
    { value: 'PART_TIME', label: 'Part-time' },
    { value: 'CONTRACT', label: 'Contract' },
    { value: 'INTERNSHIP', label: 'Internship' },
    { value: 'REMOTE', label: 'Remote' }
  ];

  const experienceLevelOptions = [
    { value: 'ANY', label: 'Any Experience' },
    { value: 'ENTRY_LEVEL', label: 'Entry Level' },
    { value: 'MID_LEVEL', label: 'Mid Level' },
    { value: 'SENIOR', label: 'Senior Level' },
    { value: 'EXECUTIVE', label: 'Executive' }
  ];

  const initialValues: Record<string, string | string[]> = {
    keyword: keyword || '',
    location: location || '',
    jobTypes: jobTypes || [],
    experienceLevel: experienceLevel || ''
  };

  const handleOnChange = (values: FormikProps<any> | typeof initialValues) => {
    // Extract values from either Formik props or directly from values
    const formValues = 'values' in values ? values.values : values;
    
    const updateParamsProps: JobFilterType = {
      keyword: formValues.keyword as string || '',
      location: formValues.location as string || '',
      experienceLevel: formValues.experienceLevel as string || '',
      jobTypes: formValues.jobTypes as string[] || []
    };
  
    handleSearch(updateParamsProps);
  };

  // Create an adapter function to handle Formik submission
  const handleFormikSubmit = (values: typeof initialValues) => {
    handleOnChange(values);
  };

  return (
    <ScrollArea>
      <Sidebar title="Filter Jobs">
        <Formik
          initialValues={initialValues}
          validationSchema={JobFilterSchema}
          onSubmit={handleFormikSubmit}
          enableReinitialize
        >
          {(formikProps) => (
            <Form>
              <div className="space-y-4">
                <InputFieldWithLabel
                  name="keyword"
                  label="Keyword"
                  value={formikProps.values.keyword as string}
                  onChange={(e) => {
                    const value = e.target.value;
                    formikProps.setFieldValue('keyword', value);
                    handleOnChange({
                      ...formikProps.values,
                      keyword: value
                    });
                  }}
                  placeholder="Job title or keyword"
                />

                <InputFieldWithLabel
                  name="location"
                  label="Location"
                  value={formikProps.values.location as string}
                  onChange={(e) => {
                    const value = e.target.value;
                    formikProps.setFieldValue('location', value);
                    handleOnChange({
                      ...formikProps.values,
                      location: value
                    });
                  }}
                  placeholder="City, state, or remote"
                />

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Job Type
                  </Label>
                  <div className="space-y-2">
                    {jobTypeOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`job-type-${option.value}`}
                          checked={jobTypes.includes(option.value)}
                          // onCheckedChange={() => handleJobTypeChange(option.value)}
                          onCheckedChange={(checked: boolean) => {
                            const updatedJobTypes = checked
                              ? [...jobTypes, option.value]  // Add to array if checked
                              : jobTypes.filter(type => type !== option.value);  // Remove if unchecked
                              
                            formikProps.setFieldValue('jobTypes', updatedJobTypes);
                            handleOnChange({
                                ...formikProps.values,
                                jobTypes: updatedJobTypes
                              });
                          }}
                        />
                        <Label
                          htmlFor={`job-type-${option.value}`}
                          className="text-sm text-gray-700 cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="experience" className="text-sm font-medium text-gray-700 mb-1 block">
                    Experience Level
                  </Label>
                  <Select
                    value={formikProps.values.experienceLevel as string || "ANY"}
                    onValueChange={(value) => {
                      formikProps.setFieldValue('experienceLevel', value);
                      handleOnChange({
                        ...formikProps.values,
                        experienceLevel: value
                      })
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevelOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
  );
};

export default JobFilters;
