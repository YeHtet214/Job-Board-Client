import React, { useEffect, useState } from 'react'
import { Building, Search } from 'lucide-react'

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

const industries = [
    { id: 1, type: 'Technology' },
    { id: 2, type: 'Healthcare' },
    { id: 3, type: 'Finance' },
    { id: 4, type: 'Education' },
    { id: 5, type: 'Manufacturing' },
    { id: 6, type: 'Retail' },
    { id: 7, type: 'Hospitality' },
    { id: 8, type: 'Media' },
    { id: 9, type: 'Transportation' },
    { id: 10, type: 'Construction' }
]

// Company sizes
const companySizes = [
    {
        key: 'Startup (1-10)',
        value: '1-10',
    },
    {
        key: 'Small (11-50)',
        value: '11-50',
    },
    {
        key: 'Medium (51-200)',
        value: '51-200',
    },
    {
        key: 'Large (201-500)',
        value: '201-500',
    },
    {
        key: 'Enterprise (500+)',
        value: '500+',
    },
]

type IndustrySelectProps = {
    selectIndustry: (value: string) => void
}

type CompanySelectProps = {
    selectCompanySize: (value: string) => void
}

const IndustrySelect = ({ selectIndustry }: IndustrySelectProps) => {
    const handleIndustrySelectChange = (value: string) => {
        return value !== "null" ? selectIndustry(value) : selectIndustry('')
    }

    return (
        <Select onValueChange={handleIndustrySelectChange} >
            <div className="hidden sm:flex text-md text-nowrap items-center mb-2">
                <Building className="h-5 w-5 mr-2 text-jb-primary" />
                Industry
            </div>
            <SelectTrigger >
                <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Industries</SelectLabel>
                    <SelectItem value="null" defaultValue="">All Industries</SelectItem>
                    {industries.map((industry) => (
                        <SelectItem key={industry.id} value={industry.type.toLowerCase()}>
                            {industry.type}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

const CompanySizeSelect = ({ selectCompanySize }: CompanySelectProps) => {
    const handleSizeSelectChange = (value: string) => {
        return value !== "null" ? selectCompanySize(value) : selectCompanySize('')
    }
    return (
        <Select onValueChange={handleSizeSelectChange}>
            <div className="hidden sm:flex text-md text-nowrap mb-2 items-center">
                <Building className="h-5 w-5 mr-2 text-jb-primary" />
                Company Size
            </div>
            <SelectTrigger className="min-w-[180px]">
                <SelectValue placeholder="Select Company Size" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Company Size</SelectLabel>
                    <SelectItem value="null" defaultValue="">All Sizes</SelectItem>
                    {companySizes.map((com) => (
                        <SelectItem key={com.value} value={com.value}>{com.key}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

type CompanyFiltersProps = {
    updateParams: (value: Record<string, string | string[] | null>) => void
}

const CompanyFilters: React.FC<CompanyFiltersProps> = ({ updateParams }) => {
    const [keyword, setKeyword] = useState('')
    const [industry, setIndustry] = useState('')
    const [companySize, setCompanySize] = useState<null | string>(null)

    const debouncedValue = useDebounce(keyword)

    useEffect(() => {
        
        updateParams({
            searchTerm: debouncedValue,
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

            <div className="flex md:flex-col md:space-y-6 max-w-2xl justify-between">
                <IndustrySelect selectIndustry={(value) => setIndustry(value)} />
                <CompanySizeSelect
                    selectCompanySize={(value) => setCompanySize(value)}
                />
            </div>
        </div>
    )
}

export default CompanyFilters