import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Building, Users } from 'lucide-react'

interface CompanyFiltersProps {
    selectedIndustries: string[]
    setSelectedIndustries: React.Dispatch<React.SetStateAction<string[]>>
    selectedSizes: string[]
    setSelectedSizes: React.Dispatch<React.SetStateAction<string[]>>
}

const CompanyFilters: React.FC<CompanyFiltersProps> = ({
    selectedIndustries,
    setSelectedIndustries,
    selectedSizes,
    setSelectedSizes,
}) => {
    // Common industries
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
        'Startup (1-10)',
        'Small (11-50)',
        'Medium (51-200)',
        'Large (201-500)',
        'Enterprise (500+)',
    ]

    const handleIndustryChange = (industry: string) => {
        setSelectedIndustries((prev) =>
            prev.includes(industry)
                ? prev.filter((i) => i !== industry)
                : [...prev, industry]
        )
    }

    const handleSizeChange = (size: string) => {
        setSelectedSizes((prev) =>
            prev.includes(size)
                ? prev.filter((s) => s !== size)
                : [...prev, size]
        )
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                        <Building className="h-5 w-5 mr-2 text-jobboard-purple" />
                        Industry
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {industries.map((industry) => (
                            <div
                                key={industry}
                                className="flex items-center space-x-2"
                            >
                                <Checkbox
                                    id={`industry-${industry}`}
                                    checked={selectedIndustries.includes(
                                        industry
                                    )}
                                    onCheckedChange={() =>
                                        handleIndustryChange(industry)
                                    }
                                />
                                <Label
                                    htmlFor={`industry-${industry}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    {industry}
                                </Label>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                        <Users className="h-5 w-5 mr-2 text-jobboard-purple" />
                        Company Size
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {companySizes.map((size) => (
                            <div
                                key={size}
                                className="flex items-center space-x-2"
                            >
                                <Checkbox
                                    id={`size-${size}`}
                                    checked={selectedSizes.includes(size)}
                                    onCheckedChange={() =>
                                        handleSizeChange(size)
                                    }
                                />
                                <Label
                                    htmlFor={`size-${size}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    {size}
                                </Label>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default CompanyFilters
