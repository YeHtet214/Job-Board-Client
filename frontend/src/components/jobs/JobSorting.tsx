import React from 'react'
import { ArrowUpDown } from 'lucide-react'
import { useJobsData } from '@/hooks/react-queries/job'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { SortOption } from '@/contexts/JobsContext'

const JobSorting: React.FC = () => {
    const { sortBy, setSortBy } = useJobsData()

    const sortOptions = [
        { value: SortOption.RELEVANCE, label: 'Most Relevant' },
        { value: SortOption.NEWEST, label: 'Newest First' },
        { value: SortOption.OLDEST, label: 'Oldest First' },
        { value: SortOption.SALARY_HIGH, label: 'Highest Salary' },
        { value: SortOption.SALARY_LOW, label: 'Lowest Salary' },
    ]

    const handleSortChange = (value: string) => {
        setSortBy(value as SortOption)
    }

    return (
        <div className="flex items-center justify-end mb-4 space-x-2">
            <Label
                htmlFor="sort-select"
                className="text-sm text-gray-600 whitespace-nowrap"
            >
                Sort by:
            </Label>
            <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger
                    id="sort-select"
                    className="w-auto min-w-[140px] sm:min-w-[180px] text-sm"
                >
                    <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    <SelectValue placeholder="Sort jobs" />
                </SelectTrigger>
                <SelectContent>
                    {sortOptions.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-sm"
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default JobSorting
