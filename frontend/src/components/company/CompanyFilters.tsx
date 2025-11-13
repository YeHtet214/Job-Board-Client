import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Building, Search, Users } from 'lucide-react'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Input } from '../ui/input'
import useDebounce from '@/hooks/useDebounce'
import { SearchParams } from '@/pages/company/CompaniesPage'

const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Hospitality',
    'Media',
    'Transportation',
    'Construction',
]

// Company sizes
const companySizes = [
    {
        key: 'Startup (1-10)',
        value: '1',
    },
    {
        key: 'Small (11-50)',
        value: '11',
    },
    {
        key: 'Medium (51-200)',
        value: '51',
    },
    {
        key: 'Large (201-500)',
        value: '201',
    },
    {
        key: 'Enterprise (500+)',
        value: '500',
    },
]

type IndustrySelectProps = {
    selectIndustry: (value: string) => void
}

type CompanySelectProps = {
    selectCompanySize: (value: string) => void
}

const IndustrySelect = ({ selectIndustry }: IndustrySelectProps) => {
    return (
        <Select onValueChange={(value) => selectIndustry(value)}>
            <CardTitle className="text-lg flex items-center">
                <Building className="h-5 w-5 mr-2 text-jobboard-purple" />
                Industry
            </CardTitle>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Industries</SelectLabel>
                    {industries.map((industry) => (
                        <SelectItem value={industry.toLowerCase()}>
                            {industry}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

const CompanySelect = ({ selectCompanySize }: CompanySelectProps) => {
    return (
        <Select onValueChange={(value) => selectCompanySize(value)}>
            <CardTitle className="text-lg flex items-center">
                <Building className="h-5 w-5 mr-2 text-jobboard-purple" />
                Company Size
            </CardTitle>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Industries</SelectLabel>
                    {companySizes.map((com) => (
                        <SelectItem value={com.value}>{com.key}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

type CompanyFiltersProps = {
    updateParams: (value: SearchParams) => void
}

const CompanyFilters: React.FC<CompanyFiltersProps> = ({ updateParams }) => {
    const [keyword, setKeyword] = useState('')
    const [industry, setIndustry] = useState('')
    const [companySize, setCompanySize] = useState(null)

    const debouncedValue = useDebounce(keyword)

    useEffect(() => {
        updateParams({
            searchTerm: keyword,
            industry,
            companySize,
        })
    }, [debouncedValue, industry, companySize])

    return (
        <div className="space-y-6">
            <div className="relative mb-8 max-w-2xl">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-5 w-5 text-jb-text-muted" />
                </div>
                <Input
                    type="text"
                    placeholder="Search companies by name, description or location..."
                    className="pl-10 py-3 bg-jb-surface text-jb-text border border-jb-surface-muted"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>

            <IndustrySelect selectIndustry={(value) => setIndustry(value)} />
            <CompanySelect
                selectCompanySize={(value) => setCompanySize(value)}
            />
        </div>
    )
}

export default CompanyFilters
