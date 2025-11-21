import { useField } from "formik"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

const experienceLevelOptions = [
    { value: 'Any', label: 'Any Experience' },
    { value: 'Entry', label: 'Entry Level' },
    { value: 'Mid', label: 'Mid Level' },
    { value: 'Senior', label: 'Senior Level' },
    { value: 'Executive', label: 'Executive' },
]


const SelectFieldWithLabel = ({ label, ...props }) => {
    const [field, meta, helpers] = useField(props)
    const { setValue } = helpers

    return (
        <>
            <Label
                htmlFor="experience"
                className="text-sm font-medium text-gray-700 mb-1 block"
            >
                Experience Level
            </Label>
            <Select {...field} {...props} onValueChange={value => setValue(value)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                    {experienceLevelOptions.map(
                        (option) => (
                            <SelectItem
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </SelectItem>
                        )
                    )}
                </SelectContent>
            </Select>
            { meta.error && meta.touched && <p className="text-jb-danger">{meta.error}</p>}
        </>
    )
}

export default SelectFieldWithLabel