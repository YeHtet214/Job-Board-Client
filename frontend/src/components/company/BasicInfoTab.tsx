import { Building, Info, Briefcase } from 'lucide-react'
import {
    InputFieldWithLabel,
    TextareaField,
    SelectFieldWithLabel,
} from '../forms'

// Industry options for dropdown
const industryOptions = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Retail',
    'Manufacturing',
    'Media',
    'Construction',
    'Transportation',
    'Hospitality',
    'Entertainment',
    'Agriculture',
    'Energy',
    'Telecommunications',
    'Other',
].map((industry) => ({ value: industry, label: industry }))

const BasicInfoTab = () => {
    return (
        <div className="space-y-6">
            <InputFieldWithLabel
                name="name"
                label={
                    <span className="flex items-center">
                        <Building className="h-4 w-4 mr-2" />
                        Company Name*
                    </span>
                }
                placeholder="Enter your company name"
                required
            />

            <TextareaField
                name="description"
                label={
                    <span className="flex items-center">
                        <Info className="h-4 w-4 mr-2" />
                        Company Description*
                    </span>
                }
                placeholder="Describe your company, mission, values, and what makes it unique"
                rows={5}
                required
            />

            <SelectFieldWithLabel
                name="industry"
                label={
                    <span className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2" />
                        Industry*
                    </span>
                }
                options={industryOptions}
                placeholder="Select industry"
                required
            />
        </div>
    )
}

export default BasicInfoTab
