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
import { SortOption } from '@/lib/constants/jobs'

type SortOptionItem = { value: SortOption; label: string }

const sortOptions: SortOptionItem[] = [
    { value: SortOption.RELEVANCE, label: 'Most Relevant' },
    { value: SortOption.NEWEST, label: 'Latest' },
    { value: SortOption.OLDEST, label: 'Oldest' },
    { value: SortOption.SALARY_HIGH, label: 'Highest Salary' },
    { value: SortOption.SALARY_LOW, label: 'Lowest Salary' },
]

const JobSorting = () => {
    const { sortBy, updateSorting } = useJobsData()


    return (
        <div className="flex items-center justify-end mb-4 space-x-2">
            <Label
                htmlFor="sort-select"
                className="text-sm text-gray-600 whitespace-nowrap"
            >
                Sort by:
            </Label>
            <Select value={sortBy} onValueChange={updateSorting}>
                <SelectTrigger
                    id="sort-select"
                    className="w-auto min-w-[140px] sm:min-w-[180px] text-sm"
                >
                    <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    <SelectValue placeholder="Latest" />
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
